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
      'bg-white dark:bg-[#121824] border-slate-200/80 dark:border-slate-800 shadow-subtle',
    raised:
      'bg-slate-50/60 dark:bg-[#161f30] border-slate-200 dark:border-slate-700/80 shadow-card',
    interactive:
      'bg-white dark:bg-[#121824] border-slate-200/80 dark:border-slate-800 shadow-subtle hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-card cursor-pointer',
  };

  return (
    <div className={clsx(baseStyles, variants[variant], className)} {...props}>
      {children}
    </div>
  );
};
