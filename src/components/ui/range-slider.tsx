"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"
import { Input } from "./input"

interface RangeSliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  label?: string;
  showMarks?: boolean;
  markCount?: number;
  formatValue?: (value: number) => string;
  parseValue?: (value: string) => number;
  min: number;
  max: number;
  step: number;
  value: number[];
  onValueChange: (values: number[]) => void;
  showInput?: boolean;
}

const RangeSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  RangeSliderProps
>(({ 
  className, 
  label,
  showMarks = false, 
  markCount = 10,
  formatValue = (v: number) => v.toString(),
  parseValue = (v: string) => parseFloat(v),
  min,
  max,
  step,
  value,
  onValueChange,
  showInput,
  ...props 
}, ref) => {
  const [localValue, setLocalValue] = React.useState<[string, string]>([
    formatValue(value[0]),
    formatValue(value[1])
  ]);

  const marks = React.useMemo(() => {
    if (!showMarks) return [];
    const result = [];
    for (let i = 0; i <= markCount; i++) {
      result.push(min + ((max - min) * i) / markCount);
    }
    return result;
  }, [min, max, markCount, showMarks]);

  React.useEffect(() => {
    setLocalValue([formatValue(value[0]), formatValue(value[1])]);
  }, [value, formatValue]);

  const handleInputChange = (index: number, inputValue: string) => {
    const newLocalValue = [...localValue] as [string, string];
    newLocalValue[index] = inputValue;
    setLocalValue(newLocalValue);

    const parsed = parseValue(inputValue);
    if (!isNaN(parsed)) {
      const clamped = Math.max(min, Math.min(max, parsed));
      const newValue = [...value];
      newValue[index] = clamped;
      onValueChange(newValue);
    }
  };

  return (
    <div className="space-y-4">
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">{label}</span>
          {showInput && (
            <div className="flex items-center gap-2">
              <Input
                type="text"
                value={localValue[0]}
                onChange={(e) => handleInputChange(0, e.target.value)}
                className="w-20 h-8"
              />
              <span>-</span>
              <Input
                type="text"
                value={localValue[1]}
                onChange={(e) => handleInputChange(1, e.target.value)}
                className="w-20 h-8"
              />
            </div>
          )}
        </div>
      )}

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
          {showMarks && (
            <div className="absolute w-full">
              {marks.map((mark, index) => (
                <div
                  key={mark}
                  className="absolute w-0.5 h-1.5 bg-primary/50 -translate-x-1/2 top-2"
                  style={{
                    left: `${(index / markCount) * 100}%`,
                  }}
                />
              ))}
            </div>
          )}
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
        <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
      </SliderPrimitive.Root>
    </div>
  );
});

RangeSlider.displayName = "RangeSlider";

export { RangeSlider }
