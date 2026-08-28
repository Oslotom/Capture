import { useGameState } from '../hooks/useGameState';
import { Card, Badge } from '../components/UI';
import { ChevronRight, Calendar, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { formatArea } from '../lib/utils';

export const ActivityScreen = () => {
  const { user } = useGameState();

  return (
    <div className="p-6 pb-32 space-y-6">
      <header>
        <h1 className="text-3xl font-black italic">ACTIVITY</h1>
        <p className="text-textSecondary">Your latest expeditions</p>
      </header>

      {user.activities.length === 0 ? (
        <Card className="text-center py-12 border-dashed border-surface-secondary">
          <div className="w-16 h-16 bg-surface-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="text-textSecondary" />
          </div>
          <p className="text-textSecondary">No activities yet. Start your first mission!</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {user.activities.map((act) => (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              key={act.id}
            >
              <Card className="flex items-center gap-4 p-4 hover:bg-surface-secondary/50 transition-colors cursor-pointer group border-none shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                   {act.type === 'RUN' && <MapPin size={24} />}
                   {act.type === 'WALK' && <MapPin size={24} />}
                   {act.type === 'BIKE' && <MapPin size={24} />}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-black italic text-lg">{act.type}</p>
                    <Badge className="bg-accent/10 text-accent border-none font-bold">+{formatArea(act.territoryClaimed)} KM²</Badge>
                  </div>
                  <div className="flex gap-4 text-xs text-textSecondary font-bold uppercase tracking-widest">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(act.date).toLocaleDateString()}</span>
                    <span>{act.distance.toFixed(2)} KM</span>
                    <span>{act.pace}</span>
                  </div>
                </div>
                <ChevronRight className="text-textSecondary group-hover:text-black transition-colors" />
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
