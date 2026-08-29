import { Card, Badge } from '../components/UI';
import { Heart, MessageCircle, Share2, Users, Flame } from 'lucide-react';
import { MOCK_FEED } from '../constants';
import { motion } from 'motion/react';
import { useGameState } from '../hooks/useGameState';
import { MapView } from '../components/Map/MapView';
import { LatLng } from '../types';

function centroid(points: LatLng[]): LatLng {
  const lat = points.reduce((s, p) => s + p.lat, 0) / points.length;
  const lng = points.reduce((s, p) => s + p.lng, 0) / points.length;
  return { lat, lng };
}

export const FeedScreen = () => {
  const { territories } = useGameState();
  const totalCaptured = territories.reduce((s, t) => s + t.area, 0);
  const activePlayers = new Set(territories.map(t => t.ownerId)).size;

  return (
    <div className="p-6 pb-32 space-y-6">
      <header>
        <h1 className="text-3xl font-black italic">FEED</h1>
        <p className="text-textSecondary">What's happening nearby</p>
      </header>

      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-accent/10 border-accent/20 border-none shadow-sm">
          <p className="text-[10px] text-accent font-bold uppercase tracking-wider mb-1">Captured nearby</p>
          <div className="flex items-center gap-2">
            <Flame size={18} className="text-accent" />
            <p className="text-2xl font-black italic text-black">{totalCaptured.toFixed(1)} <span className="text-xs font-normal not-italic text-textSecondary">KM²</span></p>
          </div>
        </Card>
        <Card className="border-none shadow-sm">
          <p className="text-[10px] text-textSecondary font-bold uppercase tracking-wider mb-1">Active players</p>
          <div className="flex items-center gap-2">
            <Users size={18} className="text-textSecondary" />
            <p className="text-2xl font-black italic text-black">{activePlayers}</p>
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        {MOCK_FEED.map((item, idx) => {
          const ownedTerritories = territories.filter(t => t.ownerId === item.userId);
          const mapCenter = ownedTerritories.length > 0 ? centroid(ownedTerritories[0].polygon) : undefined;

          return (
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
                <div className="aspect-square bg-surface-secondary relative overflow-hidden">
                  {mapCenter ? (
                    <MapView
                      center={mapCenter}
                      territories={ownedTerritories}
                      zoom={14}
                      interactive={false}
                      className="pointer-events-none"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent to-transparent" />
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 right-4 flex gap-2 z-10">
                    {item.stats.area && <Badge className="bg-white/90 backdrop-blur-md text-black border-none font-black italic">+{item.stats.area} KM²</Badge>}
                    {item.stats.distance && <Badge className="bg-white/90 backdrop-blur-md text-black border-none font-black italic">{item.stats.distance} KM</Badge>}
                    {item.stats.time && <Badge className="bg-white/90 backdrop-blur-md text-black border-none font-black italic">{item.stats.time}</Badge>}
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
          );
        })}
      </div>
    </div>
  );
};
