import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border border-grabit-200 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-grabit-950 focus:ring-offset-2 dark:border-grabit-800 dark:focus:ring-grabit-300',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-grabit-900 text-grabit-50 hover:bg-grabit-900/80 dark:bg-grabit-50 dark:text-grabit-900 dark:hover:bg-grabit-50/80',
        secondary:
          'border-transparent bg-grabit-100 text-grabit-900 hover:bg-grabit-100/80 dark:bg-grabit-800 dark:text-grabit-50 dark:hover:bg-grabit-800/80',
        destructive:
          'border-transparent bg-red-500 text-grabit-50 hover:bg-red-500/80 dark:bg-red-900 dark:text-grabit-50 dark:hover:bg-red-900/80',
        outline: 'text-grabit-950 dark:text-grabit-50',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
