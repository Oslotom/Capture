import { Card } from '../UI';

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
}

export const StatCard = ({ label, value, unit }: StatCardProps) => (
  <Card className="p-4 text-center">
    <p className="text-xs text-textSecondary font-bold uppercase tracking-wider">{label}</p>
    <p className="text-2xl font-black italic text-black">
      {value} {unit && <span className="text-sm font-bold not-italic">{unit}</span>}
    </p>
  </Card>
);