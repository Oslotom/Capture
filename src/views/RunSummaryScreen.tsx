
import { Activity } from '../types';
import { MapView } from '../components/Map/MapView';
import { Button, Card } from '../components/UI';
import { formatDuration, calculatePace } from '../lib/utils';
import { motion } from 'motion/react';
import { ArrowLeft, Maximize } from 'lucide-react';
import * as turf from '@turf/turf';

export const RunSummaryScreen = ({ activity, onClose }: { activity: Activity, onClose: () => void }) => {
  const routePoints = activity.route.map(p => [p.lng, p.lat]);
  if (routePoints.length > 0) {
    routePoints.push(routePoints[0]);
  }
  const center = turf.center(turf.polygon([routePoints])).geometry.coordinates;
  const activityCenter = { lat: center[1], lng: center[0] };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[200] bg-background"
    >
      <div className="relative w-full h-1/2 bg-surface-secondary">
        <MapView
          center={activityCenter}
          activeRoute={activity.route}
          interactive={false}
          zoom={14}
        />
        <div className="absolute top-0 inset-x-0 z-10 p-4 flex justify-between">
          <Button size="sm" className="bg-white/80 backdrop-blur-md rounded-full h-10 w-10 p-0" onClick={onClose}>
            <ArrowLeft size={20} />
          </Button>
          <Button size="sm" className="bg-white/80 backdrop-blur-md rounded-full h-10 w-10 p-0">
            <Maximize size={20} />
          </Button>
        </div>
      </div>
      <div className="p-6 -mt-8 relative z-20">
        <Card className="p-6">
          <h1 className="text-3xl font-black italic mb-4">Your Run</h1>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-textSecondary font-bold">Distance</p>
              <p className="text-2xl font-black italic">{activity.distance.toFixed(2)} km</p>
            </div>
            <div>
              <p className="text-sm text-textSecondary font-bold">Duration</p>
              <p className="text-2xl font-black italic">{formatDuration(activity.duration)}</p>
            </div>
            <div>
              <p className="text-sm text-textSecondary font-bold">Pace</p>
              <p className="text-2xl font-black italic">{activity.pace}</p>
            </div>
            {activity.territoryClaimed > 0 && (
              <div>
                <p className="text-sm text-textSecondary font-bold">Territory Claimed</p>
                <p className="text-2xl font-black italic text-accent">+{activity.territoryClaimed.toFixed(2)} km²</p>
              </div>
            )}
          </div>
          <Button variant="accent" size="lg" className="w-full" onClick={onClose}>Done</Button>
        </Card>
      </div>
    </motion.div>
  );
};