/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { ActivityType, Activity, LatLng } from '../types';
import { Button, Card } from '../components/UI';
import { Play, Pause, Square, Trophy, Crosshair } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useGameState } from '../hooks/useGameState';
import { MapView } from '../components/Map/MapView';
import { RunSummaryScreen } from './RunSummaryScreen';
import * as turf from '@turf/turf';
import { formatDuration, calculatePace, cn } from '../lib/utils';
import { StatCard } from '../components/UI/StatCard';
import heroImage from '../assets/hero-image.png';


const MOSS_CENTER: LatLng = { lat: 59.391757, lng: 10.666610 };

export const HomeScreen = ({ onTrackingChange }: { onTrackingChange: (isTracking: boolean) => void }) => {
  const { user, territories, feed, addActivity, completedActivity, setCompletedActivity } = useGameState();
  const [isTracking, setIsTracking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const activeType: ActivityType = 'RUN';
  const [activeRoute, setActiveRoute] = useState<LatLng[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [lastClaimedArea, setLastClaimedArea] = useState(0);

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
      setGpsError('Geolokalisering støttes ikke på denne enheten.');
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
    const distance = turf.length(turf.lineString(points as number[][]));

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
    setCompletedActivity(newActivity);
  };

  const userTerritories = territories.filter(t => t.ownerId === user.id);
  const totalArea = userTerritories.reduce((sum, t) => sum + t.area, 0);

  return (
    <div className="min-h-full pb-32">
      {/* ===== HERO BANNER ===== */}
      <div className="relative overflow-hidden bg-white text-textPrimary rounded-b-[32px] px-6 pt-20 pb-10 shadow-[0_4px_30px_rgba(0,0,0,0.04)] border-b border-surface-secondary">
        {/* Decorative glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-16 w-56 h-56 bg-accent/10 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-start justify-between gap-2 mb-6">
            <div className="flex-1 min-w-0">
              <h1 className="text-4xl font-black italic tracking-tighter leading-[1.05] mb-2">
                KLAR TIL Å<br />EROBRE OMRÅDE?
              </h1>
              <p className="text-textSecondary font-bold text-sm tracking-wide">
                Hver løpetur utvider ditt imperium.
              </p>
            </div>
            <div className="flex-shrink-0 -mr-2 -mt-2">
              <img src={heroImage} alt="Hero" className="w-24" />
            </div>
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

      <div className="p-6 space-y-8">
        <div className="grid grid-cols-3 gap-4">
          <StatCard label="KM² KAPRET" value={totalArea.toFixed(2)} />
          <StatCard label="ANTALL LØP" value={user.activities.length} />
          <StatCard label="OMRÅDER" value={userTerritories.length} />
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
            className="fixed inset-0 z-[150] bg-background"
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
                  {isPaused ? 'PAUSE' : 'SPORER'} · {activeType}
                </span>
              </div>
              <div className="bg-white/90 backdrop-blur-md rounded-full px-4 py-2 shadow-lg pointer-events-auto">
                <span className="text-sm font-black italic tabular-nums text-black">{formatDuration(elapsed)}</span>
              </div>
            </div>

            {gpsError && (
              <div className="absolute top-20 left-6 right-6 z-10 pointer-events-none">
                <div className="bg-red-500/95 backdrop-blur-md rounded-2xl px-4 py-2.5 shadow-lg text-white text-xs font-bold text-center">
                  GPS-feil: {gpsError}
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
              animate={{ y: isMinimized ? 240 : 0 }}
              exit={{ y: 400 }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="absolute bottom-0 left-0 right-0 z-10 p-6 pb-10 bg-white rounded-t-[40px] shadow-[0_-20px_50px_rgba(0,0,0,0.15)]"
            >
              <div className="w-10 h-1 bg-surface-secondary rounded-full mb-6 opacity-60 mx-auto" onClick={() => setIsMinimized(!isMinimized)} />
              <AnimatePresence>
                {!isMinimized && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="grid grid-cols-3 w-full gap-2 mb-8 text-center">
                      <div className="space-y-0.5">
                        <p className="text-[9px] text-textSecondary font-black uppercase tracking-widest">Distanse</p>
                        <p className="text-xl font-black italic text-black tabular-nums">{(activeRoute.length * 0.05).toFixed(2)} <span className="text-[9px] font-bold not-italic">KM</span></p>
                      </div>
                      <div className="space-y-0.5 border-x border-surface-secondary">
                        <p className="text-[9px] text-textSecondary font-black uppercase tracking-widest">Varighet</p>
                        <p className="text-xl font-black italic text-black tabular-nums">{formatDuration(elapsed)}</p>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[9px] text-textSecondary font-black uppercase tracking-widest">Fart</p>
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
                            <span className="flex items-center gap-2"><Play size={16} fill="currentColor" /> FORTSETT</span>
                          </Button>
                          <Button
                            size="lg"
                            className="flex-1 h-16 bg-red-500 text-white border-none text-sm font-black italic rounded-2xl"
                            onClick={handleFinish}
                          >
                            <span className="flex items-center gap-2"><Square size={14} fill="currentColor" /> AVSLUTT</span>
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
                            <span className="flex items-center gap-2"><Square size={14} fill="currentColor" /> AVSLUTT</span>
                          </Button>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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
              <h2 className="text-4xl font-black mb-2 italic text-black">NYTT OMRÅDE</h2>
              <p className="text-accent text-6xl font-black mb-8">+{lastClaimedArea.toFixed(2)} <span className="text-2xl">KM²</span></p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-surface-secondary rounded-2xl p-4">
                  <p className="text-[10px] text-textSecondary font-bold mb-1">XP TJENT</p>
                  <p className="text-xl font-black italic">+500</p>
                </div>
                <div className="bg-surface-secondary rounded-2xl p-4">
                  <p className="text-[10px] text-textSecondary font-bold mb-1">TOTAL RANK</p>
                  <p className="text-xl font-black italic">#{user.rank}</p>
                </div>
              </div>

              <Button variant="accent" size="xl" onClick={() => setShowCelebration(false)}>
                FORTSETT
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {completedActivity && (
          <RunSummaryScreen
            activity={completedActivity}
            onClose={() => setCompletedActivity(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};