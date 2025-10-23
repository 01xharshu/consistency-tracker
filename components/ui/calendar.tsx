"use client";

import * as React from "react";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import {
  DayButton,
  DayPicker,
  getDefaultClassNames,
} from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";

type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"];
  heatMap?: Map<string, number>;
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  heatMap,
  ...props
}: CalendarProps) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "bg-background group/calendar p-4 [--cell-size:3rem] md:[--cell-size:3.5rem] lg:[--cell-size:4rem] calendar-large",
        className
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn(defaultClassNames.root),
        months: cn("flex flex-col w-full gap-4 md:gap-6 md:flex-row", defaultClassNames.months),
        month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1 md:gap-3",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-[var(--cell-size)] w-[var(--cell-size)] p-0 select-none aria-disabled:opacity-50",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-[var(--cell-size)] w-[var(--cell-size)] p-0 select-none aria-disabled:opacity-50",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex items-center justify-center px-4 md:px-6 py-2 text-lg md:text-xl lg:text-2xl font-semibold",
          defaultClassNames.month_caption
        ),
        table: "w-full border-collapse",
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "text-muted-foreground flex-1 select-none rounded-md text-[0.85rem] md:text-sm",
          defaultClassNames.weekday
        ),
        week: cn("flex w-full mt-2", defaultClassNames.week),
        day: cn("group/day relative aspect-square h-full w-full select-none p-0 text-center", defaultClassNames.day),
        today: cn(
          "bg-accent text-accent-foreground rounded-md data-[selected=true]:rounded-none",
          defaultClassNames.today
        ),
        disabled: cn(
          "text-muted-foreground opacity-50",
          defaultClassNames.disabled
        ),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => (
          <div data-slot="calendar" ref={rootRef} className={cn(className)} {...props} />
        ),
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return <ChevronLeftIcon className={cn("size-4 md:size-5", className)} {...props} />;
          }
          if (orientation === "right") {
            return <ChevronRightIcon className={cn("size-4 md:size-5", className)} {...props} />;
          }
          return <ChevronDownIcon className={cn("size-4 md:size-5", className)} {...props} />;
        },
        DayButton: ({ day, modifiers, className: cbClassName, ...btnProps }) => {
          const dateKey = day.date.toISOString().split("T")[0];
          const heatVal = heatMap?.get(dateKey) ?? 0;
          const heatClass =
            heatVal >= 5
              ? "heat-5"
              : heatVal >= 3
              ? "heat-3"
              : heatVal >= 1
              ? "heat-1"
              : "";

          return (
            <CalendarDayButton
              day={day}
              modifiers={modifiers}
              className={cn(cbClassName, heatClass)}
              {...btnProps}
            />
          );
        },
        ...components,
      }}
      {...props}
    />
  );
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames();

  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toISOString().split("T")[0]}
      className={cn(
        "flex aspect-square h-full w-full select-none p-0 font-normal leading-none data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground group-data-[focused=true]/day:ring-ring/50 [&>span]:text-xs md:[&>span]:text-sm",
        defaultClassNames.day_button,
        className
      )}
      {...props}
    />
  );
}

export { Calendar, CalendarDayButton };
