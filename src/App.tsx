/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { HomeScreen } from './views/HomeScreen';
import { ActivityScreen } from './views/ActivityScreen';
import { CompeteScreen } from './views/CompeteScreen';
import { FeedScreen } from './views/FeedScreen';
import { ProfileScreen } from './views/ProfileScreen';
import { AnimatePresence, motion } from 'motion/react';
import { Menu } from 'lucide-react';
import { Button } from './components/UI';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isTracking, setIsTracking] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderTab = () => {
    switch (activeTab) {
      case 'home': return <HomeScreen onTrackingChange={setIsTracking} />;
      case 'activity': return <ActivityScreen />;
      case 'compete': return <CompeteScreen />;
      case 'feed': return <FeedScreen />;
      case 'profile': return <ProfileScreen />;
      default: return <HomeScreen onTrackingChange={setIsTracking} />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-background text-textPrimary selection:bg-accent/30 max-w-md mx-auto relative overflow-hidden">
      {/* Floating Menu Button */}
      {!isTracking && (
        <div className="fixed top-6 left-6 z-[150]">
          <Button
            variant="secondary"
            size="sm"
            className="rounded-full w-12 h-12 p-0 shadow-xl border-none bg-white/90 backdrop-blur-md text-black"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={24} />
          </Button>
        </div>
      )}

      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <main className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full"
          >
            {renderTab()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

