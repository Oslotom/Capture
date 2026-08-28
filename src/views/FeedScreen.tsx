import { Card, Badge, Button } from '../components/UI';
import { Heart, MessageCircle, Share2, Map as MapIcon } from 'lucide-react';
import { MOCK_FEED } from '../constants';
import { motion } from 'motion/react';

export const FeedScreen = () => {
  return (
    <div className="p-6 pb-32 space-y-6">
      <header>
        <h1 className="text-3xl font-black italic">FEED</h1>
        <p className="text-textSecondary">What's happening nearby</p>
      </header>

      <div className="space-y-6">
        {MOCK_FEED.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="p-0 overflow-hidden border-none shadow-sm bg-white">
              <div className="p-4 flex items-center gap-3">
                <img src={item.userAvatar} className="w-10 h-10 rounded-full border border-surface-secondary" alt="" />
                <div>
                  <p className="font-black italic text-sm text-black">
                    {item.userName} <span className="text-textSecondary font-bold not-italic ml-1">{item.content}</span>
                  </p>
                  <p className="text-[10px] text-textSecondary uppercase tracking-widest font-black italic">2H AGO</p>
                </div>
              </div>

              {/* Map Preview */}
              <div className="aspect-square bg-surface-secondary relative flex items-center justify-center overflow-hidden">
                 <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent to-transparent"></div>
                 <MapIcon size={64} className="text-accent/10" />
                 <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                    {item.stats.area && <Badge className="bg-white/80 backdrop-blur-md text-black border-none font-black italic">+{item.stats.area} KM²</Badge>}
                    {item.stats.distance && <Badge className="bg-white/80 backdrop-blur-md text-black border-none font-black italic">{item.stats.distance} KM</Badge>}
                    {item.stats.time && <Badge className="bg-white/80 backdrop-blur-md text-black border-none font-black italic">{item.stats.time}</Badge>}
                 </div>
              </div>

              <div className="p-4 flex gap-6">
                <button className="flex items-center gap-2 text-textSecondary hover:text-accent transition-colors">
                  <Heart size={20} />
                  <span className="text-xs font-black italic text-black">24</span>
                </button>
                <button className="flex items-center gap-2 text-textSecondary hover:text-black transition-colors">
                  <MessageCircle size={20} />
                  <span className="text-xs font-black italic text-black">3</span>
                </button>
                <button className="ml-auto text-textSecondary hover:text-black transition-colors">
                  <Share2 size={20} />
                </button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
