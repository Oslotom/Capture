import { useGameState } from '../hooks/useGameState';
import { Card, Button, Badge } from '../components/UI';
import { Settings, Shield, Zap, TrendingUp, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

export const ProfileScreen = () => {
  const { user } = useGameState();

  const stats = [
    { label: 'DISTANCE', value: `${user.totalDistance} km`, icon: TrendingUp },
    { label: 'TERRITORY', value: `${user.territoryArea.toFixed(1)} km²`, icon: Shield },
    { label: 'ACTIVITIES', value: user.activities.length, icon: Zap },
    { label: 'RANK', value: `#${user.rank}`, icon: Settings },
  ];

  return (
    <div className="p-6 pb-32 space-y-8">
      <div className="flex items-center justify-between">
         <h1 className="text-3xl font-black italic">PROFILE</h1>
         <Button variant="secondary" size="sm" className="rounded-full w-10 h-10 p-0">
            <Settings size={20} />
         </Button>
      </div>

      <div className="flex flex-col items-center text-center">
        <div className="relative mb-4">
          <div className="absolute inset-0 bg-accent blur-2xl opacity-20"></div>
          <img
            src={user.avatar}
            className="w-32 h-32 rounded-full border-4 border-accent relative z-10"
            alt=""
          />
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-accent text-black text-[10px] font-black px-3 py-1 rounded-full z-20">
            LEVEL {user.level}
          </div>
        </div>
        <h2 className="text-2xl font-bold">{user.name}</h2>
        <p className="text-accent font-black tracking-widest text-sm uppercase italic">{user.levelName}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="flex flex-col gap-1">
             <div className="flex items-center justify-between">
                <p className="text-[10px] text-textSecondary font-bold uppercase tracking-widest">{stat.label}</p>
                <stat.icon size={12} className="text-textSecondary" />
             </div>
             <p className="text-xl font-black italic">{stat.value}</p>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
         <h3 className="text-lg font-bold">Progress</h3>
         <Card className="space-y-4">
            <div className="flex justify-between items-end">
               <div>
                  <p className="text-[10px] text-textSecondary font-bold uppercase mb-1">XP to Level {user.level + 1}</p>
                  <p className="text-2xl font-black italic">{user.xp} / {user.nextLevelXp}</p>
               </div>
               <Badge>{Math.round((user.xp / user.nextLevelXp) * 100)}%</Badge>
            </div>
            <div className="h-3 bg-surface-secondary rounded-full overflow-hidden">
               <motion.div
                 initial={{ width: 0 }}
                 animate={{ width: `${(user.xp / user.nextLevelXp) * 100}%` }}
                 className="h-full bg-accent shadow-[0_0_10px_rgba(0,229,255,0.5)]"
               />
            </div>
         </Card>
      </div>

      <div className="space-y-3">
         <button className="w-full flex items-center justify-between p-4 bg-surface rounded-2xl border border-white/5">
            <span className="font-bold">Achievements</span>
            <ChevronRight size={20} className="text-textSecondary" />
         </button>
         <button className="w-full flex items-center justify-between p-4 bg-surface rounded-2xl border border-white/5">
            <span className="font-bold">Club Memberships</span>
            <ChevronRight size={20} className="text-textSecondary" />
         </button>
      </div>
    </div>
  );
};
