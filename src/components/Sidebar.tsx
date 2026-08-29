import React from 'react';
import { Menu, X, Map as MapIcon, Globe, Activity, Trophy, Users, User, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { Button } from './UI';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Sidebar = ({ isOpen, onClose, activeTab, onTabChange }: SidebarProps) => {
  const menuItems = [
    { id: 'home', icon: MapIcon, label: 'HOME' },
    { id: 'territory', icon: Globe, label: 'TERRITORIE' },
    { id: 'myruns', icon: Activity, label: 'MY RUNS' },
    { id: 'compete', icon: Trophy, label: 'COMPETE' },
    { id: 'feed', icon: Users, label: 'FEED' },
    { id: 'profile', icon: User, label: 'PROFILE' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200]"
          />

          {/* Menu Panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-[80%] max-w-[320px] bg-white z-[201] shadow-2xl flex flex-col"
          >
            <div className="p-8 flex justify-between items-center border-b border-surface-secondary">
              <h2 className="text-2xl font-black italic tracking-tighter">TERRAIN</h2>
              <button onClick={onClose} className="p-2 hover:bg-surface-secondary rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <nav className="flex-1 p-6 space-y-2">
              {menuItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onTabChange(item.id);
                      onClose();
                    }}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-2xl transition-all group",
                      isActive 
                        ? "bg-accent/10 text-black shadow-sm" 
                        : "text-textSecondary hover:bg-surface-secondary hover:text-black"
                    )}
                  >
                    <div className={cn(
                      "p-2 rounded-xl transition-colors",
                      isActive ? "bg-accent/20 text-accent" : "bg-surface-secondary text-textSecondary group-hover:text-black"
                    )}>
                      <item.icon size={20} strokeWidth={isActive ? 3 : 2} />
                    </div>
                    <span className="flex-1 text-left font-black italic tracking-widest text-sm">
                      {item.label}
                    </span>
                    {isActive && <ChevronRight size={16} className="text-accent" />}
                  </button>
                );
              })}
            </nav>

            <div className="p-8 border-t border-surface-secondary">
              <div className="flex items-center gap-3 p-4 bg-surface-secondary rounded-2xl">
                 <img 
                   src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop" 
                   className="w-10 h-10 rounded-full border-2 border-white shadow-sm" 
                   alt="avatar" 
                 />
                 <div className="flex-1">
                    <p className="text-xs font-black italic">ALEX RIVERA</p>
                    <p className="text-[10px] font-bold text-textSecondary uppercase tracking-widest">LEVEL 3 RUNNER</p>
                 </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
