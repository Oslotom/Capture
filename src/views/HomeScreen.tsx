import { useState, useEffect, useRef } from 'react';
import { MapView } from '../components/Map/MapView';
import { LatLng, ActivityType, Activity } from '../types';
import { Button, Card, Badge } from '../components/UI';
import { Play, Pause, Square, Navigation, Bell, Zap, Trophy, TrendingUp, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useGameState } from '../hooks/useGameState';
import * as turf from '@turf/turf';
import { COLORS } from '../constants';
import { formatArea, formatDuration, calculatePace, cn } from '../lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const STARTING_POS: LatLng = { lat: 51.505, lng: -0.09 };

const MOCK_CHART_DATA = [
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
  const [currentPos, setCurrentPos] = useState<LatLng>(STARTING_POS);
  const [isTracking, setIsTracking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [activeType, setActiveType] = useState<ActivityType>('RUN');
  const [activeRoute, setActiveRoute] = useState<LatLng[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [lastClaimedArea, setLastClaimedArea] = useState(0);
  const [chartFilter, setChartFilter] = useState<'distance' | 'area'>('distance');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    onTrackingChange(isTracking);
  }, [isTracking, onTrackingChange]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setCurrentPos({ lat: latitude, lng: longitude });
      });
    }
  }, []);

  useEffect(() => {
    if (isTracking && !isPaused) {
      timerRef.current = setInterval(() => {
        setElapsed(prev => prev + 1);
        
        // In a real app we would use watchPosition here.
        // For the demo we still simulate some movement around the real center
        // to show the UI working, but it starts from the user's REAL location.
        setCurrentPos(prev => ({
          lat: prev.lat + (Math.random() - 0.5) * 0.0001,
          lng: prev.lng + (Math.random() - 0.5) * 0.0001,
        }));
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isTracking, isPaused]);

  useEffect(() => {
    if (isTracking && !isPaused) {
      setActiveRoute(prev => [...prev, currentPos]);
    }
  }, [currentPos, isTracking, isPaused]);

  const handleStart = () => {
    setIsTracking(true);
    setStartTime(Date.now());
    setActiveRoute([currentPos]);
    setElapsed(0);
  };

  const handleFinish = () => {
    if (activeRoute.length < 3) {
      setIsTracking(false);
      return;
    }

    const points = activeRoute.map(p => [p.lng, p.lat]);
    points.push(points[0]); 
    const polygon = turf.polygon([points]);
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

  const leaderboard = [
    { id: '1', name: 'Alex', area: 12.8, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop' },
    { id: '2', name: 'Sarah', area: 10.4, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
    { id: 'user-1', name: 'You', area: user.territoryArea, avatar: user.avatar, isMe: true },
  ].sort((a, b) => b.area - a.area);

  const handleLocate = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setCurrentPos({ lat: latitude, lng: longitude });
      });
    }
  };

  return (
    <div className="min-h-full pb-32">
      {/* Map Section - Height fixed when not tracking */}
      <div className={cn(
        "relative transition-all duration-500 overflow-hidden",
        isTracking ? "h-screen fixed inset-0 z-40" : "h-[45vh]"
      )}>
        <MapView
          center={currentPos}
          currentPosition={currentPos}
          territories={territories}
          activeRoute={activeRoute}
        />
        
        {/* Header Overlay */}
        <div className="absolute top-0 left-0 right-0 z-10 p-6 pl-20 flex justify-between items-start pointer-events-none">
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="pointer-events-auto">
            <Card className="flex items-center gap-3 py-2 px-3 border-none shadow-lg">
              <img src={user.avatar} className="w-10 h-10 rounded-full border-2 border-accent" alt="avatar" />
              <div>
                <p className="text-[10px] text-accent font-black italic uppercase tracking-widest">MY TERRITORY</p>
                <p className="text-xl font-black italic leading-none text-black">{user.territoryArea.toFixed(2)} <span className="text-xs font-bold not-italic text-textSecondary uppercase">KM²</span></p>
              </div>
            </Card>
          </motion.div>

          <div className="flex flex-col gap-3 items-end pointer-events-auto">
            <Button variant="secondary" size="sm" className="rounded-full w-10 h-10 p-0 shadow-lg border-none bg-white text-black">
              <Bell size={20} />
            </Button>
          </div>
        </div>

        {/* Locate Button */}
        {!isTracking && (
          <div className="absolute right-6 bottom-10 z-10">
            <Button variant="secondary" size="sm" className="rounded-full w-12 h-12 p-0 shadow-xl bg-white text-black border-none" onClick={handleLocate}>
              <Navigation size={20} className="rotate-45" />
            </Button>
          </div>
        )}
      </div>

      {/* Main Content Dashboard */}
      {!isTracking && (
        <div className="p-6 space-y-8 relative z-10 bg-background rounded-t-[32px] -mt-8 pt-10">
          {/* Start Section */}
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <h1 className="text-4xl font-black italic tracking-tighter">READY TO CLAIM?</h1>
              <p className="text-textSecondary font-bold text-sm tracking-widest">SELECT MODE & START EXPLORING</p>
            </div>

            <div className="flex gap-2 justify-center">
              {(['RUN', 'WALK', 'BIKE'] as ActivityType[]).map(type => (
                <button
                  key={type}
                  onClick={() => setActiveType(type)}
                  className={cn(
                    "px-6 py-2 rounded-full text-xs font-black italic tracking-widest transition-all border uppercase",
                    activeType === type
                      ? "bg-accent text-black border-accent shadow-md"
                      : "bg-white text-textSecondary border-surface-secondary"
                  )}
                >
                  {type}
                </button>
              ))}
            </div>

            <Button variant="accent" size="xl" onClick={handleStart} className="h-24 shadow-[0_20px_40px_rgba(50,224,63,0.2)] text-2xl">
              START {activeType}
            </Button>
          </div>

          {/* Stats Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold italic">LAST 7 DAYS</h2>
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
            </div>

            <Card className="p-6 space-y-6 border-none shadow-sm">
              <div className="grid grid-cols-2 gap-4 border-b border-surface-secondary pb-6">
                <div className="space-y-1">
                  <p className="text-[10px] text-textSecondary font-black italic uppercase tracking-widest">Total Distance</p>
                  <p className="text-2xl font-black italic text-black">20.9 <span className="text-xs font-bold not-italic uppercase">KM</span></p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-textSecondary font-black italic uppercase tracking-widest">New Territory</p>
                  <p className="text-2xl font-black italic text-black">5.3 <span className="text-xs font-bold not-italic uppercase">KM²</span></p>
                </div>
              </div>

              <div className="h-48 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={MOCK_CHART_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F3F5" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      stroke="#6C757D" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false} 
                    />
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
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Scoreboard Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold italic">SCOREBOARD</h2>
            <div className="space-y-2">
              {leaderboard.map((player, idx) => (
                <Card key={player.id} className={cn("flex items-center gap-4 p-3 border-none shadow-sm", player.isMe ? "bg-accent/10" : "bg-white")}>
                  <div className="w-6 text-center text-sm font-black italic text-textSecondary">
                    {idx + 1}
                  </div>
                  <img src={player.avatar} className="w-10 h-10 rounded-full border border-surface-secondary shadow-sm" alt="" />
                  <div className="flex-1">
                    <p className="font-black italic text-sm text-black uppercase tracking-tight">{player.name}</p>
                  </div>
                  <p className="font-black italic text-base text-black">{player.area.toFixed(1)} <span className="text-[8px] uppercase not-italic text-textSecondary font-bold">KM²</span></p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tracking Overlay */}
      <AnimatePresence>
        {isTracking && (
          <div className="fixed inset-0 z-50 pointer-events-none">
            {/* Minimalist Top Gradient for visibility */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/40 to-transparent" />

            {/* Compact Bottom Sheet */}
            <motion.div
              initial={{ y: 300 }}
              animate={{ y: 0 }}
              exit={{ y: 400 }}
              className="absolute bottom-0 left-0 right-0 p-6 pb-10 bg-white rounded-t-[40px] shadow-[0_-20px_50px_rgba(0,0,0,0.08)] pointer-events-auto flex flex-col items-center"
            >
              {/* Grabber Handle */}
              <div className="w-10 h-1 bg-surface-secondary rounded-full mb-6 opacity-60" />
              
              {/* Primary Metric: Territory */}
              <div className="text-center mb-6">
                <div className="flex items-baseline justify-center gap-1">
                  <p className="text-5xl font-black italic tracking-tighter text-black tabular-nums">
                    {(activeRoute.length * 0.08).toFixed(2)}
                  </p>
                  <span className="text-xs font-black text-black">KM²</span>
                </div>
                <div className="flex items-center justify-center gap-1 text-accent font-black text-[9px] tracking-widest mt-0.5">
                  <Trophy size={10} fill="currentColor" />
                  TERRITORY CAPTURED
                </div>
              </div>

              {/* Secondary Metrics Row */}
              <div className="grid grid-cols-3 w-full gap-2 mb-8 text-center border-t border-surface-secondary pt-6">
                <div className="space-y-0.5">
                  <p className="text-[9px] text-textSecondary font-black uppercase tracking-widest">Distance</p>
                  <p className="text-lg font-black italic text-black">{(activeRoute.length * 0.05).toFixed(2)} <span className="text-[9px] font-bold not-italic">KM</span></p>
                </div>
                <div className="space-y-0.5 border-x border-surface-secondary">
                  <p className="text-[9px] text-textSecondary font-black uppercase tracking-widest">Duration</p>
                  <p className="text-lg font-black italic text-black tabular-nums">{formatDuration(elapsed)}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[9px] text-textSecondary font-black uppercase tracking-widest">Speed</p>
                  <p className="text-lg font-black italic text-black">12.4 <span className="text-[9px] font-bold not-italic">KM/H</span></p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 w-full">
                {isPaused ? (
                  <>
                    <Button
                      variant="primary"
                      size="lg"
                      className="flex-1 h-16 bg-accent text-black text-sm shadow-md border-none font-black italic rounded-2xl"
                      onClick={() => setIsPaused(false)}
                    >
                      RESUME
                    </Button>
                    <Button
                      variant="primary"
                      size="lg"
                      className="flex-1 h-16 bg-red-500 text-white border-none text-sm shadow-md font-black italic rounded-2xl"
                      onClick={handleFinish}
                    >
                      FINISH
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full h-16 bg-[#090A0C] text-white rounded-2xl shadow-xl font-black italic tracking-widest flex items-center justify-center gap-2 text-sm"
                    onClick={() => setIsPaused(true)}
                  >
                    <div className="flex items-center gap-2">
                       <Pause size={14} fill="currentColor" />
                       PAUSE {activeType}
                    </div>
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Celebration Modal */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-sm"
            >
              <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-accent/20">
                <Navigation size={48} className="text-accent" />
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
                    <p className="text-xl font-black italic">#3</p>
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

