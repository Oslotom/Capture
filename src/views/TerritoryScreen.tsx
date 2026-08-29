import { useMemo, useState } from 'react';
import { useGameState } from '../hooks/useGameState';
import { MapView } from '../components/Map/MapView';
import { Card } from '../components/UI';
import { Territory, LatLng } from '../types';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

const OVERVIEW_CENTER: LatLng = { lat: 59.405, lng: 10.665 };

export const TerritoryScreen = () => {
  const { user, territories } = useGameState();
  const [selected, setSelected] = useState<Territory | null>(null);

  const byOwner = useMemo(() => {
    const groups = new Map<string, { name: string; color: string; strokeColor: string; area: number; count: number }>();
    for (const t of territories) {
      const g = groups.get(t.ownerId);
      if (g) {
        g.area += t.area;
        g.count += 1;
      } else {
        groups.set(t.ownerId, { name: t.ownerName, color: t.color, strokeColor: t.strokeColor, area: t.area, count: 1 });
      }
    }
    return Array.from(groups.values()).sort((a, b) => b.area - a.area);
  }, [territories]);

  const totalArea = territories.reduce((s, t) => s + t.area, 0);

  return (
    <div className="pb-32">
      <header className="p-6 pb-4">
        <h1 className="text-3xl font-black italic">TERRITORIE</h1>
        <p className="text-textSecondary">Alle kaprede områder på kartet</p>
      </header>

      <div className="px-6">
        <Card className="p-0 overflow-hidden border-none shadow-sm h-[45vh]">
          <MapView
            center={selected ? selected.polygon[0] : OVERVIEW_CENTER}
            territories={territories}
            zoom={12}
            zoomControl
            onTerritoryClick={setSelected}
          />
        </Card>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-accent/10 border-accent/20 border-none shadow-sm">
            <p className="text-[10px] text-accent font-bold uppercase tracking-wider mb-1">Totalt kapret</p>
            <p className="text-2xl font-black italic text-black">{totalArea.toFixed(2)} <span className="text-sm font-normal not-italic text-textSecondary">KM²</span></p>
          </Card>
          <Card className="border-none shadow-sm">
            <p className="text-[10px] text-textSecondary font-bold uppercase tracking-wider mb-1">Antall områder</p>
            <p className="text-2xl font-black italic text-black">{territories.length}</p>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold italic">PER SPILLER</h2>
          <div className="space-y-2">
            {byOwner.map((g, idx) => (
              <motion.div
                key={g.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className={cn(
                  "flex items-center gap-4 p-4 border-none shadow-sm",
                  g.name === user.name ? "bg-accent/10 ring-1 ring-accent/30" : "bg-white"
                )}>
                  <span
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: g.strokeColor }}
                  />
                  <div className="flex-1">
                    <p className="font-black italic text-sm text-black uppercase tracking-tight">{g.name}</p>
                    <p className="text-[10px] text-textSecondary font-bold uppercase tracking-widest">{g.count} områder</p>
                  </div>
                  <p className="font-black italic text-base text-black">{g.area.toFixed(2)} <span className="text-[8px] uppercase not-italic text-textSecondary font-bold">KM²</span></p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {selected && (
          <Card className="p-4 border-none shadow-sm bg-accent/10 ring-1 ring-accent/30">
            <p className="text-[10px] text-accent font-black uppercase tracking-widest mb-1">Valgt område</p>
            <div className="flex items-center justify-between">
              <p className="font-black italic text-lg text-black">{selected.ownerName}</p>
              <p className="font-black italic text-lg text-black">{selected.area.toFixed(2)} <span className="text-[10px] font-bold not-italic text-textSecondary">KM²</span></p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
