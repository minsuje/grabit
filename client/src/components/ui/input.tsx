import * as React from 'react';

import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'text-md flex w-full rounded-md border border-grabit-200 bg-white px-4 py-3 ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-grabit-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-grabit-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-grabit-800 dark:bg-grabit-950 dark:ring-offset-grabit-950 dark:placeholder:text-grabit-400 dark:focus-visible:ring-grabit-300',
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = 'Input';

export { Input };
