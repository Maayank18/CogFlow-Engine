import React from 'react';
import { clsx } from 'clsx';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'raised' | 'interactive';
}

export const Card: React.FC<CardProps> = ({
  className,
  variant = 'default',
  children,
  ...props
}) => {
  const baseStyles = 'rounded-xl transition-all duration-200 border';

  const variants = {
    default:
      'bg-white dark:bg-[#0c0c0e] border-zinc-200/80 dark:border-zinc-800/80 shadow-xs',
    raised:
      'bg-zinc-50/70 dark:bg-[#121215] border-zinc-200 dark:border-zinc-800 shadow-sm',
    interactive:
      'bg-white dark:bg-[#0c0c0e] border-zinc-200/80 dark:border-zinc-800/80 shadow-xs hover:border-zinc-900 dark:hover:border-zinc-100 transition-all cursor-pointer',
  };

  return (
    <div className={clsx(baseStyles, variants[variant], className)} {...props}>
      {children}
    </div>
  );
};

