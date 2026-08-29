
import { Activity, LatLng } from '../types';
import { MapView } from '../components/Map/MapView';
import { Button, Card } from '../components/UI';
import { formatDuration, calculatePace } from '../lib/utils';
import { motion } from 'motion/react';
import { ArrowLeft, Maximize } from 'lucide-react';
import * as turf from '@turf/turf';

const getCenter = (activity: Activity): LatLng => {
  if (activity.route && activity.route.length > 1) {
    const routeLine = turf.lineString(activity.route.map(p => [p.lng, p.lat]));
    const bbox = turf.bbox(routeLine);
    return { lat: (bbox[1] + bbox[3]) / 2, lng: (bbox[0] + bbox[2]) / 2 };
  }
  if (activity.route && activity.route.length === 1) {
    return activity.route[0];
  }
  return { lat: 59.391757, lng: 10.666610 };
}

export const RunSummaryScreen = ({ activity, onClose }: { activity: Activity, onClose: () => void }) => {
  const activityCenter = getCenter(activity);

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
          <h1 className="text-3xl font-black italic mb-4">Din Løpetur</h1>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-textSecondary font-bold">Distanse</p>
              <p className="text-2xl font-black italic">{activity.distance.toFixed(2)} km</p>
            </div>
            <div>
              <p className="text-sm text-textSecondary font-bold">Varighet</p>
              <p className="text-2xl font-black italic">{formatDuration(activity.duration)}</p>
            </div>
            <div>
              <p className="text-sm text-textSecondary font-bold">Fart</p>
              <p className="text-2xl font-black italic">{calculatePace(activity.duration, activity.distance)}</p>
            </div>
            {activity.territoryClaimed > 0 && (
              <div>
                <p className="text-sm text-textSecondary font-bold">Erobret Område</p>
                <p className="text-2xl font-black italic text-accent">+{activity.territoryClaimed.toFixed(2)} km²</p>
              </div>
            )}
          </div>
          <Button variant="accent" size="lg" className="w-full" onClick={onClose}>Ferdig</Button>
        </Card>
      </div>
    </motion.div>
  );
};