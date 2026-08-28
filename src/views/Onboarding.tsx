import { useState } from 'react';
import { Button } from '../components/UI';
import { motion, AnimatePresence } from 'motion/react';
import { Map as MapIcon, Shield, Users, Zap } from 'lucide-react';

const SLIDES = [
  {
    title: "Your city is your playground.",
    description: "Every street, park, and path is waiting to be claimed.",
    icon: MapIcon,
    color: "text-blue-400"
  },
  {
    title: "Move to claim territory.",
    description: "Complete a closed loop while walking, running or cycling to claim the area.",
    icon: Shield,
    color: "text-accent"
  },
  {
    title: "Compete with others.",
    description: "See your rank in the city and defend your home territory.",
    icon: Users,
    color: "text-purple-400"
  },
  {
    title: "Start your first mission.",
    description: "The journey of a thousand kilometers starts with a single step.",
    icon: Zap,
    color: "text-yellow-400"
  }
];

export const Onboarding = ({ onFinish }: { onFinish: () => void }) => {
  const [current, setCurrent] = useState(0);

  const handleNext = () => {
    if (current === SLIDES.length - 1) {
      onFinish();
    } else {
      setCurrent(current + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-background flex flex-col p-8">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="space-y-8"
          >
            <div className={`w-24 h-24 rounded-3xl bg-white/5 flex items-center justify-center mx-auto border border-white/10 ${SLIDES[current].color}`}>
              {(() => {
                const Icon = SLIDES[current].icon;
                return <Icon size={48} />;
              })()}
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl font-black italic leading-tight">{SLIDES[current].title}</h2>
              <p className="text-textSecondary text-lg max-w-[280px] mx-auto leading-relaxed">
                {SLIDES[current].description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="space-y-6">
        <div className="flex gap-2 justify-center">
          {SLIDES.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? "w-8 bg-accent" : "w-2 bg-white/10"}`}
            />
          ))}
        </div>
        <Button variant="accent" size="xl" onClick={handleNext}>
          {current === SLIDES.length - 1 ? "START EXPLORING" : "NEXT"}
        </Button>
      </div>
    </div>
  );
};
