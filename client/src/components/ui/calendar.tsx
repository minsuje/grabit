import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { ko } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
        month: 'space-y-4',
        caption: 'flex justify-center pt-1 relative items-center',
        caption_label: 'ㅇㅎtext-sm font-medium',
        nav: 'space-x-1 flex items-center',
        nav_button: cn(
          buttonVariants({ variant: 'outline' }),
          'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
        ),
        nav_button_previous: 'absolute left-1',
        nav_button_next: 'absolute right-1',
        table: 'w-full border-collapse space-y-1',
        head_row: 'flex',
        head_cell: 'text-grabit-500 rounded-md w-9 font-normal text-[0.8rem] dark:text-grabit-400',
        row: 'flex w-full mt-2',
        cell: 'h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-grabit-100/50 [&:has([aria-selected])]:bg-grabit-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 dark:[&:has([aria-selected].day-outside)]:bg-grabit-800/50 dark:[&:has([aria-selected])]:bg-grabit-800',
        day: cn(buttonVariants({ variant: 'ghost' }), 'h-9 w-9 p-0 font-normal aria-selected:opacity-100'),
        day_range_end: 'day-range-end',
        day_selected:
          'bg-grabit-900 text-grabit-50 hover:bg-grabit-900 hover:text-grabit-50 focus:bg-grabit-900 focus:text-grabit-50 dark:bg-grabit-50 dark:text-grabit-900 dark:hover:bg-grabit-50 dark:hover:text-grabit-900 dark:focus:bg-grabit-50 dark:focus:text-grabit-900',
        day_today: 'bg-grabit-100 text-grabit-900 dark:bg-grabit-800 dark:text-grabit-50',
        day_outside:
          'day-outside text-grabit-500 opacity-50 aria-selected:bg-grabit-100/50 aria-selected:text-grabit-500 aria-selected:opacity-30 dark:text-grabit-400 dark:aria-selected:bg-grabit-800/50 dark:aria-selected:text-grabit-400',
        day_disabled: 'text-grabit-500 opacity-50 dark:text-grabit-400',
        day_range_middle:
          'aria-selected:bg-grabit-100 aria-selected:text-grabit-900 dark:aria-selected:bg-grabit-800 dark:aria-selected:text-grabit-50',
        day_hidden: 'invisible',
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
      }}
      locale={ko}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };
