"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";
import { Input } from "./input";

interface RangeSliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  formatValue?: (value: number) => string;
  parseValue?: (value: string) => number;
  label?: string;
  className?: string;
  showMarks?: boolean;
  markCount?: number;
  min: number;
  max: number;
  step: number;
  value: number[];
  onValueChange: (value: number[]) => void;
}

const RangeSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  RangeSliderProps
>(({ className, formatValue, parseValue, label, showMarks = false, markCount = 10, min, max, step, value, onValueChange, ...props }, ref) => {
  const [localValue, setLocalValue] = React.useState<[string, string]>([
    formatValue ? formatValue(value[0]) : String(value[0]),
    formatValue ? formatValue(value[1]) : String(value[1])
  ]);

  const handleInputChange = (index: number, inputValue: string) => {
    const newLocalValue = [...localValue] as [string, string];
    newLocalValue[index] = inputValue;
    setLocalValue(newLocalValue);

    if (parseValue) {
      const parsedValue = parseValue(inputValue);
      if (!isNaN(parsedValue)) {
        const newValue = [...value];
        newValue[index] = Math.max(min, Math.min(max, parsedValue));
        onValueChange(newValue);
      }
    }
  };

  const handleInputBlur = (index: number) => {
    const formattedValue = formatValue 
      ? formatValue(value[index])
      : String(value[index]);
    const newLocalValue = [...localValue] as [string, string];
    newLocalValue[index] = formattedValue;
    setLocalValue(newLocalValue);
  };

  React.useEffect(() => {
    setLocalValue([
      formatValue ? formatValue(value[0]) : String(value[0]),
      formatValue ? formatValue(value[1]) : String(value[1])
    ]);
  }, [value, formatValue]);

  const marks = React.useMemo(() => {
    if (!showMarks) return [];
    const result = [];
    for (let i = 0; i <= markCount; i++) {
      const markValue = min + (max - min) * (i / markCount);
      result.push(markValue);
    }
    return result;
  }, [min, max, markCount, showMarks]);

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex justify-between items-center gap-4">
          <span className="text-sm font-medium">{label}</span>
          <div className="flex items-center gap-2 text-sm">
            <Input
              type="text"
              value={localValue[0]}
              onChange={(e) => handleInputChange(0, e.target.value)}
              onBlur={() => handleInputBlur(0)}
              className="h-8 w-24"
            />
            <span>-</span>
            <Input
              type="text"
              value={localValue[1]}
              onChange={(e) => handleInputChange(1, e.target.value)}
              onBlur={() => handleInputBlur(1)}
              className="h-8 w-24"
            />
          </div>
        </div>
      )}
      <div className="relative">
        <SliderPrimitive.Root
          ref={ref}
          min={min}
          max={max}
          step={step}
          value={value}
          onValueChange={onValueChange}
          className={cn(
            "relative flex w-full touch-none select-none items-center",
            className
          )}
          {...props}
        >
          <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20">
            <SliderPrimitive.Range className="absolute h-full bg-primary" />
          </SliderPrimitive.Track>
          {showMarks && (
            <div className="absolute w-full top-2">
              {marks.map((mark, index) => {
                // Calculate position accounting for thumb width
                const thumbWidth = 16; // width of thumb in pixels
                const totalWidth = 100;
                const adjustedPosition = (index / markCount) * (totalWidth - (thumbWidth / totalWidth) * 100);
                return (
                  <div
                    key={mark}
                    className="absolute w-0.5 h-1.5 bg-primary/50 -translate-x-1/2"
                    style={{ left: `${adjustedPosition}%` }}
                  />
                );
              })}
            </div>
          )}
          <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
          <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
        </SliderPrimitive.Root>
      </div>
    </div>
  );
});

RangeSlider.displayName = SliderPrimitive.Root.displayName;

export { RangeSlider };
