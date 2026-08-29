/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useMemo } from 'react';
import { ActivityType, Activity, LatLng } from '../types';
import { Button, Card } from '../components/UI';
import { Play, Pause, Square, Trophy, Zap, TrendingUp, Flame, MapPin, Crosshair } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useGameState } from '../hooks/useGameState';
import { MapView } from '../components/Map/MapView';
import * as turf from '@turf/turf';
import { formatDuration, calculatePace, cn } from '../lib/utils';
import { LineChart, BarChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MOSS_CENTER: LatLng = { lat: 59.391757, lng: 10.666610 };

const FALLBACK_CHART_DATA = [
  { name: 'Mon', distance: 2.4, area: 0.5 },
  { name: 'Tue', distance: 3.1, area: 0.8 },
  { name: 'Wed', distance: 1.8, area: 0.3 },
  { name: 'Thu', distance: 4.5, area: 1.2 },
  { name: 'Fri', distance: 2.9, area: 0.7 },
  { name: 'Sat', distance: 6.2, area: 1.8 },
  { name: 'Sun', distance: 0, area: 0 },
];

export const HomeScreen = ({ onTrackingChange }: { onTrackingChange: (isTracking: boolean) => void }) => {
  const { user, territories, addActivity } = useGameState();
  const [isTracking, setIsTracking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [activeType, setActiveType] = useState<ActivityType>('RUN');
  const [activeRoute, setActiveRoute] = useState<LatLng[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [lastClaimedArea, setLastClaimedArea] = useState(0);
  const [chartFilter, setChartFilter] = useState<'distance' | 'area'>('distance');
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);

  useEffect(() => {
    onTrackingChange(isTracking);
  }, [isTracking, onTrackingChange]);

  // Timer runs independently of GPS updates
  useEffect(() => {
    if (isTracking && !isPaused) {
      timerRef.current = setInterval(() => {
        setElapsed(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isTracking, isPaused]);

  // Live GPS tracking of the route
  useEffect(() => {
    if (isTracking && !isPaused && 'geolocation' in navigator) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          setGpsError(null);
          setActiveRoute(prev => [...prev, { lat: pos.coords.latitude, lng: pos.coords.longitude }]);
        },
        (err) => setGpsError(err.message),
        { enableHighAccuracy: true, maximumAge: 1000, timeout: 10000 }
      );
    }
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [isTracking, isPaused]);

  const handleStart = () => {
    if (!('geolocation' in navigator)) {
      setGpsError('Geolocation is not supported on this device.');
      return;
    }
    setGpsError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setActiveRoute([{ lat: pos.coords.latitude, lng: pos.coords.longitude }]);
        setElapsed(0);
        setIsTracking(true);
      },
      (err) => setGpsError(err.message),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleRecenter = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsError(null);
        setActiveRoute(prev => [...prev, { lat: pos.coords.latitude, lng: pos.coords.longitude }]);
      },
      (err) => setGpsError(err.message),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleFinish = () => {
    if (activeRoute.length < 3) {
      setIsTracking(false);
      setIsPaused(false);
      setActiveRoute([]);
      setElapsed(0);
      return;
    }

    const points = activeRoute.map(p => [p.lng, p.lat]);
    points.push(points[0]);
    const polygon = turf.polygon([points as number[][]]);
    const area = turf.area(polygon) / 1_000_000;
    const distance = activeRoute.length * 0.05;

    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      type: activeType,
      date: Date.now(),
      distance,
      duration: elapsed,
      pace: calculatePace(elapsed, distance),
      route: activeRoute,
      territoryClaimed: area > 0.01 ? area : 0
    };

    addActivity(newActivity);

    if (area > 0.01) {
      setLastClaimedArea(area);
      setShowCelebration(true);
    }

    setIsTracking(false);
    setIsPaused(false);
    setActiveRoute([]);
    setElapsed(0);
  };

  const chartData = useMemo(() => {
    const days: { name: string; distance: number; area: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toDateString();
      const dayActivities = user.activities.filter(a => new Date(a.date).toDateString() === key);
      days.push({
        name: d.toLocaleDateString('en-US', { weekday: 'short' }),
        distance: dayActivities.reduce((s, a) => s + a.distance, 0),
        area: dayActivities.reduce((s, a) => s + a.territoryClaimed, 0),
      });
    }
    const hasData = days.some(d => d.distance > 0 || d.area > 0);
    return hasData ? days : FALLBACK_CHART_DATA;
  }, [user.activities]);

  const weekTotals = useMemo(() => ({
    distance: chartData.reduce((s, d) => s + d.distance, 0),
    area: chartData.reduce((s, d) => s + d.area, 0),
  }), [chartData]);

  const leaderboard = [
    { id: '1', name: 'Alex', area: 12.8, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop' },
    { id: '2', name: 'Sarah', area: 10.4, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
    { id: 'user-1', name: 'You', area: user.territoryArea, avatar: user.avatar, isMe: true },
  ].sort((a, b) => b.area - a.area);

  const medal = (idx: number) => (idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}`);

  return (
    <div className="min-h-full pb-32">
      {/* ===== HERO BANNER ===== */}
      <div className="relative overflow-hidden bg-[#090A0C] text-white rounded-b-[32px] px-6 pt-20 pb-10">
        {/* Decorative glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-16 w-56 h-56 bg-accent/10 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <img src={user.avatar} className="w-12 h-12 rounded-full border-2 border-accent" alt="avatar" />
            <div>
              <p className="text-[10px] text-accent font-black uppercase tracking-widest">LEVEL {user.level} · {user.levelName}</p>
              <p className="text-lg font-black italic leading-none">HEY {user.name.toUpperCase()} 👋</p>
            </div>
          </div>

          <h1 className="text-4xl font-black italic tracking-tighter leading-[1.05] mb-2">
            READY TO<br />CLAIM TERRITORY?
          </h1>
          <p className="text-white/60 font-bold text-sm tracking-wide mb-6">
            Every run expands your empire.
          </p>

          {/* Hero stat chips */}
          <div className="flex gap-3 mb-8">
            <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <div className="flex items-center gap-1.5 text-accent mb-1">
                <TrendingUp size={12} />
                <span className="text-[9px] font-black uppercase tracking-widest">Total KM</span>
              </div>
              <p className="text-2xl font-black italic">{user.totalDistance.toFixed(1)}</p>
            </div>
            <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <div className="flex items-center gap-1.5 text-accent mb-1">
                <MapPin size={12} />
                <span className="text-[9px] font-black uppercase tracking-widest">Captured</span>
              </div>
              <p className="text-2xl font-black italic">{user.territoryArea.toFixed(2)} <span className="text-[10px] font-bold not-italic text-white/60">KM²</span></p>
            </div>
            <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <div className="flex items-center gap-1.5 text-accent mb-1">
                <Flame size={12} />
                <span className="text-[9px] font-black uppercase tracking-widest">Rank</span>
              </div>
              <p className="text-2xl font-black italic">#{user.rank}</p>
            </div>
          </div>

          {/* Mode selector */}
          <div className="flex gap-2 mb-4">
            {(['RUN', 'WALK', 'BIKE'] as ActivityType[]).map(type => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                disabled={isTracking}
                className={cn(
                  "flex-1 py-2.5 rounded-full text-xs font-black italic tracking-widest transition-all border uppercase",
                  activeType === type
                    ? "bg-accent text-black border-accent shadow-md"
                    : "bg-transparent text-white/60 border-white/20"
                )}
              >
                {type}
              </button>
            ))}
          </div>

          <Button
            variant="accent"
            size="xl"
            onClick={handleStart}
            disabled={isTracking}
            className="w-full h-20 shadow-[0_20px_40px_rgba(50,224,63,0.3)] text-xl"
          >
            <span className="flex items-center gap-3">
              <Play size={22} fill="currentColor" /> START {activeType}
            </span>
          </Button>
        </div>
      </div>

      {/* ===== STATISTICS ===== */}
      <div className="p-6 space-y-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold italic">MY STATS</h2>
            <div className="flex items-center gap-1 text-accent">
              <Zap size={14} fill="currentColor" />
              <span className="text-xs font-black">{user.xp} XP</span>
            </div>
          </div>

          <Card className="p-6 space-y-6 border-none shadow-sm">
            <div className="grid grid-cols-2 gap-4 border-b border-surface-secondary pb-6">
              <div className="space-y-1">
                <p className="text-[10px] text-textSecondary font-black italic uppercase tracking-widest">Distance (7d)</p>
                <p className="text-2xl font-black italic text-black">{weekTotals.distance.toFixed(1)} <span className="text-xs font-bold not-italic uppercase">KM</span></p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-textSecondary font-black italic uppercase tracking-widest">Captured (7d)</p>
                <p className="text-2xl font-black italic text-black">{weekTotals.area.toFixed(2)} <span className="text-xs font-bold not-italic uppercase">KM²</span></p>
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center justify-between">
              <div className="flex bg-surface-secondary rounded-lg p-1">
                <button
                  onClick={() => setChartFilter('distance')}
                  className={cn("px-4 py-1.5 text-[10px] font-black tracking-widest rounded-md transition-all uppercase", chartFilter === 'distance' ? "bg-white text-black shadow-sm" : "text-textSecondary")}
                >
                  KM
                </button>
                <button
                  onClick={() => setChartFilter('area')}
                  className={cn("px-4 py-1.5 text-[10px] font-black tracking-widest rounded-md transition-all uppercase", chartFilter === 'area' ? "bg-white text-black shadow-sm" : "text-textSecondary")}
                >
                  KM²
                </button>
              </div>
              <div className="flex bg-surface-secondary rounded-lg p-1">
                <button
                  onClick={() => setChartType('line')}
                  className={cn("px-4 py-1.5 text-[10px] font-black tracking-widest rounded-md transition-all uppercase", chartType === 'line' ? "bg-white text-black shadow-sm" : "text-textSecondary")}
                >
                  Graph
                </button>
                <button
                  onClick={() => setChartType('bar')}
                  className={cn("px-4 py-1.5 text-[10px] font-black tracking-widest rounded-md transition-all uppercase", chartType === 'bar' ? "bg-white text-black shadow-sm" : "text-textSecondary")}
                >
                  Diagram
                </button>
              </div>
            </div>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'line' ? (
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F3F5" vertical={false} />
                    <XAxis dataKey="name" stroke="#6C757D" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#F1F3F5', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                      itemStyle={{ color: '#32E03F' }}
                    />
                    <Line
                      type="monotone"
                      dataKey={chartFilter}
                      stroke="#32E03F"
                      strokeWidth={4}
                      dot={{ fill: '#32E03F', strokeWidth: 0, r: 4 }}
                      activeDot={{ r: 6, strokeWidth: 0, fill: '#090A0C' }}
                    />
                  </LineChart>
                ) : (
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F3F5" vertical={false} />
                    <XAxis dataKey="name" stroke="#6C757D" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#F1F3F5', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                      itemStyle={{ color: '#32E03F' }}
                      cursor={{ fill: 'rgba(50, 224, 63, 0.08)' }}
                    />
                    <Bar dataKey={chartFilter} fill="#32E03F" radius={[8, 8, 0, 0]} maxBarSize={28} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* ===== LEADERBOARD ===== */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold italic">LEADERBOARD</h2>
            <div className="flex items-center gap-1.5 text-accent">
              <Trophy size={14} fill="currentColor" />
              <span className="text-xs font-black uppercase tracking-widest">Territory</span>
            </div>
          </div>
          <div className="space-y-2">
            {leaderboard.map((player, idx) => (
              <Card key={player.id} className={cn("flex items-center gap-4 p-4 border-none shadow-sm", player.isMe ? "bg-accent/10 ring-1 ring-accent/30" : "bg-white")}>
                <div className="w-8 text-center text-lg">
                  {medal(idx)}
                </div>
                <img src={player.avatar} className="w-11 h-11 rounded-full border border-surface-secondary shadow-sm" alt="" />
                <div className="flex-1">
                  <p className="font-black italic text-sm text-black uppercase tracking-tight">{player.name}</p>
                  {player.isMe && <p className="text-[9px] text-accent font-black uppercase tracking-widest">You</p>}
                </div>
                <p className="font-black italic text-base text-black">{player.area.toFixed(1)} <span className="text-[8px] uppercase not-italic text-textSecondary font-bold">KM²</span></p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* ===== ACTIVE RUN PAGE (full-screen map) ===== */}
      <AnimatePresence>
        {isTracking && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="fixed inset-0 z-[150] bg-[#090A0C]"
          >
            {/* Full-screen map */}
            <div className="absolute inset-0">
              <MapView
                center={activeRoute[activeRoute.length - 1] ?? MOSS_CENTER}
                currentPosition={activeRoute[activeRoute.length - 1] ?? MOSS_CENTER}
                territories={territories}
                activeRoute={activeRoute}
              />
            </div>

            {/* Top HUD */}
            <div className="absolute top-0 left-0 right-0 z-10 p-6 flex justify-between items-start pointer-events-none">
              <div className="bg-white/90 backdrop-blur-md rounded-full px-4 py-2 shadow-lg pointer-events-auto flex items-center gap-2">
                <span className={cn("w-2.5 h-2.5 rounded-full", isPaused ? "bg-amber-400" : "bg-accent animate-pulse")} />
                <span className="text-[10px] font-black uppercase tracking-widest text-black">
                  {isPaused ? 'PAUSED' : 'TRACKING'} · {activeType}
                </span>
              </div>
              <div className="bg-white/90 backdrop-blur-md rounded-full px-4 py-2 shadow-lg pointer-events-auto">
                <span className="text-sm font-black italic tabular-nums text-black">{formatDuration(elapsed)}</span>
              </div>
            </div>

            {gpsError && (
              <div className="absolute top-20 left-6 right-6 z-10 pointer-events-none">
                <div className="bg-red-500/95 backdrop-blur-md rounded-2xl px-4 py-2.5 shadow-lg text-white text-xs font-bold text-center">
                  GPS error: {gpsError}
                </div>
              </div>
            )}

            {/* Locate button */}
            <div className="absolute right-6 bottom-[340px] z-10">
              <Button
                variant="secondary"
                size="sm"
                className="rounded-full w-12 h-12 p-0 shadow-xl bg-white text-black border-none"
                onClick={handleRecenter}
              >
                <Crosshair size={20} />
              </Button>
            </div>

            {/* Bottom control sheet */}
            <motion.div
              initial={{ y: 300 }}
              animate={{ y: 0 }}
              exit={{ y: 400 }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="absolute bottom-0 left-0 right-0 z-10 p-6 pb-10 bg-white rounded-t-[40px] shadow-[0_-20px_50px_rgba(0,0,0,0.15)]"
            >
              <div className="w-10 h-1 bg-surface-secondary rounded-full mb-6 opacity-60 mx-auto" />

              <div className="grid grid-cols-3 w-full gap-2 mb-8 text-center">
                <div className="space-y-0.5">
                  <p className="text-[9px] text-textSecondary font-black uppercase tracking-widest">Distance</p>
                  <p className="text-xl font-black italic text-black tabular-nums">{(activeRoute.length * 0.05).toFixed(2)} <span className="text-[9px] font-bold not-italic">KM</span></p>
                </div>
                <div className="space-y-0.5 border-x border-surface-secondary">
                  <p className="text-[9px] text-textSecondary font-black uppercase tracking-widest">Duration</p>
                  <p className="text-xl font-black italic text-black tabular-nums">{formatDuration(elapsed)}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[9px] text-textSecondary font-black uppercase tracking-widest">Pace</p>
                  <p className="text-xl font-black italic text-black">{calculatePace(elapsed, activeRoute.length * 0.05)}</p>
                </div>
              </div>

              <div className="flex gap-3 w-full">
                {isPaused ? (
                  <>
                    <Button
                      variant="accent"
                      size="lg"
                      className="flex-1 h-16 text-sm font-black italic rounded-2xl border-none"
                      onClick={() => setIsPaused(false)}
                    >
                      <span className="flex items-center gap-2"><Play size={16} fill="currentColor" /> RESUME</span>
                    </Button>
                    <Button
                      size="lg"
                      className="flex-1 h-16 bg-red-500 text-white border-none text-sm font-black italic rounded-2xl"
                      onClick={handleFinish}
                    >
                      <span className="flex items-center gap-2"><Square size={14} fill="currentColor" /> FINISH</span>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      size="lg"
                      className="flex-1 h-16 bg-[#090A0C] text-white border-none text-sm font-black italic rounded-2xl"
                      onClick={() => setIsPaused(true)}
                    >
                      <span className="flex items-center gap-2"><Pause size={16} fill="currentColor" /> PAUSE</span>
                    </Button>
                    <Button
                      size="lg"
                      className="flex-1 h-16 bg-accent text-black border-none text-sm font-black italic rounded-2xl"
                      onClick={handleFinish}
                    >
                      <span className="flex items-center gap-2"><Square size={14} fill="currentColor" /> FINISH</span>
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== CELEBRATION MODAL ===== */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-background/90 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-sm"
            >
              <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-accent/20">
                <Trophy size={48} className="text-accent" />
              </div>
              <h2 className="text-4xl font-black mb-2 italic text-black">NEW TERRITORY</h2>
              <p className="text-accent text-6xl font-black mb-8">+{lastClaimedArea.toFixed(2)} <span className="text-2xl">KM²</span></p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-surface-secondary rounded-2xl p-4">
                  <p className="text-[10px] text-textSecondary font-bold mb-1">XP EARNED</p>
                  <p className="text-xl font-black italic">+500</p>
                </div>
                <div className="bg-surface-secondary rounded-2xl p-4">
                  <p className="text-[10px] text-textSecondary font-bold mb-1">TOTAL RANK</p>
                  <p className="text-xl font-black italic">#{user.rank}</p>
                </div>
              </div>

              <Button variant="accent" size="xl" onClick={() => setShowCelebration(false)}>
                KEEP GOING
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
