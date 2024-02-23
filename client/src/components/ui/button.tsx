import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-grabit-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-grabit-950 dark:focus-visible:ring-grabit-300 rounded-xl',
  {
    variants: {
      variant: {
        default:
          'bg-grabit-600 text-grabit-50 hover:bg-grabit-600/90 dark:bg-grabit-50 dark:text-grabit-900 dark:hover:bg-grabit-50/90',
        destructive:
          'bg-red-500 text-grabit-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-grabit-50 dark:hover:bg-red-900/90',
        outline:
          'border border-grabit-200 bg-white hover:bg-grabit-100 hover:text-grabit-900 dark:border-grabit-800 dark:bg-grabit-950 dark:hover:bg-grabit-800 dark:hover:text-grabit-50',
        secondary:
          'bg-grabit-100 text-grabit-900 hover:bg-grabit-100/80 dark:bg-grabit-800 dark:text-grabit-50 dark:hover:bg-grabit-800/80',
        ghost: 'hover:bg-grabit-100 hover:text-grabit-900 dark:hover:bg-grabit-800 dark:hover:text-grabit-50',
        link: 'text-grabit-900 underline-offset-4 hover:underline dark:text-grabit-50',
      },
      size: {
        default: 'px-6 py-3',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
