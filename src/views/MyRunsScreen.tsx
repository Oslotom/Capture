import { useMemo, useState } from 'react';
import { useGameState } from '../hooks/useGameState';
import { Card, Badge } from '../components/UI';
import { ChevronRight, Calendar, MapPin, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { formatArea, cn } from '../lib/utils';
import { LineChart, BarChart, Line, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const FALLBACK_CHART_DATA = [
  { name: 'Mon', distance: 2.4, area: 0.5 },
  { name: 'Tue', distance: 3.1, area: 0.8 },
  { name: 'Wed', distance: 1.8, area: 0.3 },
  { name: 'Thu', distance: 4.5, area: 1.2 },
  { name: 'Fri', distance: 2.9, area: 0.7 },
  { name: 'Sat', distance: 6.2, area: 1.8 },
  { name: 'Sun', distance: 0, area: 0 },
];

export const MyRunsScreen = () => {
  const { user } = useGameState();
  const [chartFilter, setChartFilter] = useState<'distance' | 'area'>('distance');
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');

  const chartData = useMemo(() => {
    const days: { name: string; distance: number; area: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toDateString();
      const dayActivities = user.activities.filter(a => new Date(a.date).toDateString() === key);
      days.push({
        name: d.toLocaleDateString('en-US', { weekday: 'short' }),
        distance: dayActivities.reduce((s, a) => s + a.distance, 0),
        area: dayActivities.reduce((s, a) => s + a.territoryClaimed, 0),
      });
    }
    const hasData = days.some(d => d.distance > 0 || d.area > 0);
    return hasData ? days : FALLBACK_CHART_DATA;
  }, [user.activities]);

  const weekTotals = useMemo(() => ({
    distance: chartData.reduce((s, d) => s + d.distance, 0),
    area: chartData.reduce((s, d) => s + d.area, 0),
  }), [chartData]);

  return (
    <div className="p-6 pb-32 space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black italic">MY RUNS</h1>
          <p className="text-textSecondary">Logged runs and statistics</p>
        </div>
        <div className="flex items-center gap-1 text-accent">
          <Zap size={14} fill="currentColor" />
          <span className="text-xs font-black">{user.xp} XP</span>
        </div>
      </header>

      <Card className="p-6 space-y-6 border-none shadow-sm">
        <div className="grid grid-cols-2 gap-4 border-b border-surface-secondary pb-6">
          <div className="space-y-1">
            <p className="text-[10px] text-textSecondary font-black italic uppercase tracking-widest">Distance (7d)</p>
            <p className="text-2xl font-black italic text-black">{weekTotals.distance.toFixed(1)} <span className="text-xs font-bold not-italic uppercase">KM</span></p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-textSecondary font-black italic uppercase tracking-widest">Captured (7d)</p>
            <p className="text-2xl font-black italic text-black">{weekTotals.area.toFixed(2)} <span className="text-xs font-bold not-italic uppercase">KM²</span></p>
          </div>
        </div>

        <div className="flex items-center justify-between">
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
          <div className="flex bg-surface-secondary rounded-lg p-1">
            <button
              onClick={() => setChartType('line')}
              className={cn("px-4 py-1.5 text-[10px] font-black tracking-widest rounded-md transition-all uppercase", chartType === 'line' ? "bg-white text-black shadow-sm" : "text-textSecondary")}
            >
              Graph
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={cn("px-4 py-1.5 text-[10px] font-black tracking-widest rounded-md transition-all uppercase", chartType === 'bar' ? "bg-white text-black shadow-sm" : "text-textSecondary")}
            >
              Diagram
            </button>
          </div>
        </div>

        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'line' ? (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F3F5" vertical={false} />
                <XAxis dataKey="name" stroke="#6C757D" fontSize={10} tickLine={false} axisLine={false} />
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
            ) : (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F3F5" vertical={false} />
                <XAxis dataKey="name" stroke="#6C757D" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#F1F3F5', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                  itemStyle={{ color: '#32E03F' }}
                  cursor={{ fill: 'rgba(50, 224, 63, 0.08)' }}
                />
                <Bar dataKey={chartFilter} fill="#32E03F" radius={[8, 8, 0, 0]} maxBarSize={28} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-bold italic">LOGGED RUNS</h2>

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
                    <MapPin size={24} />
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
    </div>
  );
};
