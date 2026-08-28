import { Map as MapIcon, Activity, Trophy, Users, User } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  const tabs = [
    { id: 'home', icon: MapIcon, label: 'HOME' },
    { id: 'activity', icon: Activity, label: 'ACTIVITY' },
    { id: 'compete', icon: Trophy, label: 'COMPETE' },
    { id: 'feed', icon: Users, label: 'FEED' },
    { id: 'profile', icon: User, label: 'PROFILE' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-surface-secondary px-6 pt-3 pb-8 z-[100] shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">
      <div className="flex justify-between items-center max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative flex flex-col items-center gap-1 group"
            >
              <div className={cn(
                "p-2 rounded-xl transition-all duration-300",
                isActive ? "text-accent bg-accent/10" : "text-textSecondary hover:text-black"
              )}>
                <tab.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={cn(
                "text-[10px] font-black tracking-widest transition-all",
                isActive ? "text-black" : "text-textSecondary"
              )}>
                {tab.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -bottom-1 w-1 h-1 rounded-full bg-accent"
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
