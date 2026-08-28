import React from 'react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'accent';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, ...props }, ref) => {
    const variants = {
      primary: 'bg-[#090A0C] text-white hover:bg-opacity-90',
      secondary: 'bg-white text-black border border-surface-secondary hover:bg-surface-secondary shadow-sm',
      ghost: 'bg-transparent text-black hover:bg-surface-secondary',
      accent: 'bg-accent text-black font-black italic shadow-lg hover:brightness-105',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs font-bold rounded-lg',
      md: 'px-4 py-2 text-sm font-bold rounded-xl',
      lg: 'px-6 py-3 text-lg font-bold rounded-2xl',
      xl: 'px-8 py-4 text-xl font-black rounded-3xl w-full',
    };

    return (
      <motion.button
        whileTap={{ scale: 0.96 }}
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center transition-all disabled:opacity-50 disabled:pointer-events-none tracking-widest uppercase',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

export const Card = ({ children, className, glass, ...props }: { children: React.ReactNode, className?: string, glass?: boolean, [key: string]: any }) => (
  <div 
    className={cn(
      'rounded-[32px] border border-surface-secondary p-4 shadow-[0_10px_40px_rgba(0,0,0,0.03)]',
      glass ? 'bg-white/80 backdrop-blur-xl' : 'bg-surface',
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export const Badge = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn('px-3 py-1 rounded-full text-[10px] font-black italic uppercase tracking-widest bg-accent/10 text-accent border border-accent/20', className)}>
    {children}
  </div>
);
