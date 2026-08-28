import { useState } from 'react';
import { Card, Badge } from '../components/UI';
import { Trophy, Medal, Star } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { useGameState } from '../hooks/useGameState';

export const CompeteScreen = () => {
  const [scope, setScope] = useState<'LOCAL' | 'CITY' | 'GLOBAL'>('LOCAL');
  const { user } = useGameState();

  const leaderboard = [
    { id: '1', name: 'Alex', area: 12.8, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop' },
    { id: '2', name: 'Sarah', area: 10.4, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
    { id: 'user-1', name: 'You', area: user.territoryArea, avatar: user.avatar, isMe: true },
    { id: '4', name: 'Jonas', area: 7.9, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop' },
    { id: '5', name: 'Elena', area: 6.2, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop' },
  ].sort((a, b) => b.area - a.area);

  return (
    <div className="p-6 pb-32 space-y-6">
      <header>
        <h1 className="text-3xl font-black italic">COMPETE</h1>
        <p className="text-textSecondary">Dominate your territory</p>
      </header>

      <div className="flex p-1 bg-surface-secondary rounded-xl">
        {(['LOCAL', 'CITY', 'GLOBAL'] as const).map(s => (
          <button
            key={s}
            onClick={() => setScope(s)}
            className={cn(
              "flex-1 py-2 text-xs font-bold rounded-lg transition-all",
              scope === s ? "bg-white text-black" : "text-textSecondary"
            )}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
          <Card className="bg-accent/10 border-accent/20 border-none shadow-sm">
              <p className="text-[10px] text-accent font-bold uppercase tracking-wider mb-1">Rank</p>
              <div className="flex items-center gap-2">
                <Trophy size={20} className="text-accent" />
                <p className="text-2xl font-black italic text-black">#3</p>
              </div>
          </Card>
          <Card className="border-none shadow-sm">
              <p className="text-[10px] text-textSecondary font-bold uppercase tracking-wider mb-1">Weekly</p>
              <div className="flex items-center gap-2">
                <Star size={20} className="text-yellow-500" />
                <p className="text-2xl font-black italic text-black">+1.4 <span className="text-sm font-normal not-italic text-textSecondary">KM²</span></p>
              </div>
          </Card>
      </div>

      <div className="space-y-3">
        {leaderboard.map((player, idx) => (
          <motion.div
            key={player.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <div className={cn(
              "flex items-center gap-4 p-3 rounded-2xl transition-all border",
              player.isMe ? "bg-accent/10 border-accent/20 shadow-sm" : "bg-white border-surface-secondary shadow-sm"
            )}>
              <div className="w-8 text-center">
                {idx === 0 ? <Medal className="text-yellow-500 mx-auto" size={20} /> :
                 idx === 1 ? <Medal className="text-slate-400 mx-auto" size={20} /> :
                 idx === 2 ? <Medal className="text-orange-400 mx-auto" size={20} /> :
                 <span className="text-textSecondary font-black italic">{idx + 1}</span>}
              </div>
              <img src={player.avatar} className="w-10 h-10 rounded-full border border-surface-secondary shadow-sm" alt="" />
              <div className="flex-1">
                <p className="font-black italic text-black">{player.name}</p>
              </div>
              <div className="text-right">
                <p className="font-black italic text-lg text-black">{player.area.toFixed(1)} <span className="text-[10px] uppercase tracking-tighter not-italic text-textSecondary font-bold">KM²</span></p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
