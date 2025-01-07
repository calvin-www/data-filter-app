"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Input } from "./input"

interface RangeSliderProps {
  label?: string;
  min: number;
  max: number;
  step: number;
  value: number[];
  onValueChange: (values: number[]) => void;
  formatValue?: (value: number) => string;
  parseValue?: (value: string) => number;
  showMarks?: boolean;
  markCount?: number;
  className?: string;
}

const RangeSlider = React.forwardRef<HTMLDivElement, RangeSliderProps>(({
  label,
  min,
  max,
  step,
  value,
  onValueChange,
  formatValue = (v: number) => v.toString(),
  parseValue = (v: string) => parseFloat(v),
  showMarks = false,
  markCount = 10,
  className,
}, ref) => {
  const [isDragging, setIsDragging] = React.useState<number | null>(null);
  const [localValue, setLocalValue] = React.useState<[string, string]>([
    formatValue(value[0]),
    formatValue(value[1])
  ]);
  const trackRef = React.useRef<HTMLDivElement>(null);

  const getPercentage = (value: number) => {
    return ((value - min) / (max - min)) * 100;
  };

  const getValue = (percentage: number) => {
    const rawValue = (percentage / 100) * (max - min) + min;
    const steppedValue = Math.round(rawValue / step) * step;
    return Math.min(max, Math.max(min, steppedValue));
  };

  const handleTrackClick = (event: React.MouseEvent) => {
    if (!trackRef.current) return;
    
    const rect = trackRef.current.getBoundingClientRect();
    const percentage = ((event.clientX - rect.left) / rect.width) * 100;
    const newValue = getValue(percentage);
    
    // Find closest thumb
    const thumb0Distance = Math.abs(value[0] - newValue);
    const thumb1Distance = Math.abs(value[1] - newValue);
    
    if (thumb0Distance < thumb1Distance) {
      onValueChange([newValue, value[1]]);
    } else {
      onValueChange([value[0], newValue]);
    }
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (isDragging === null || !trackRef.current) return;
    
    const rect = trackRef.current.getBoundingClientRect();
    const percentage = ((event.clientX - rect.left) / rect.width) * 100;
    const newValue = getValue(percentage);
    
    if (isDragging === 0) {
      onValueChange([Math.min(newValue, value[1]), value[1]]);
    } else {
      onValueChange([value[0], Math.max(value[0], newValue)]);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(null);
  };

  React.useEffect(() => {
    if (isDragging !== null) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, value]);

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

  const marks = React.useMemo(() => {
    if (!showMarks) return [];
    const result = [];
    for (let i = 0; i <= markCount; i++) {
      result.push(min + ((max - min) * i) / markCount);
    }
    return result;
  }, [min, max, markCount, showMarks]);

  return (
    <div ref={ref} className={cn("space-y-4", className)}>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">{label}</span>
          <div className="flex items-center gap-2">
            <Input
              type="text"
              value={localValue[0]}
              onChange={(e) => handleInputChange(0, e.target.value)}
              className="w-24 h-8"
            />
            <span>-</span>
            <Input
              type="text"
              value={localValue[1]}
              onChange={(e) => handleInputChange(1, e.target.value)}
              className="w-24 h-8"
            />
          </div>
        </div>
      )}

      <div className="relative h-10 flex items-center">
        <div
          ref={trackRef}
          className="relative h-1.5 w-full rounded-full bg-primary/20 cursor-pointer"
          onClick={handleTrackClick}
        >
          <div
            className="absolute h-full bg-primary rounded-full"
            style={{
              left: `${getPercentage(value[0])}%`,
              right: `${100 - getPercentage(value[1])}%`,
            }}
          />
          {showMarks && (
            <div className="absolute w-full">
              {marks.map((mark) => (
                <div
                  key={mark}
                  className="absolute w-0.5 h-1.5 bg-primary/50 -translate-x-1/2 top-2"
                  style={{
                    left: `${getPercentage(mark)}%`,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <div
          className="absolute w-4 h-4 -ml-2 rounded-full bg-background border border-primary/50 shadow cursor-grab active:cursor-grabbing"
          style={{ left: `${getPercentage(value[0])}%` }}
          onMouseDown={() => setIsDragging(0)}
        />
        <div
          className="absolute w-4 h-4 -ml-2 rounded-full bg-background border border-primary/50 shadow cursor-grab active:cursor-grabbing"
          style={{ left: `${getPercentage(value[1])}%` }}
          onMouseDown={() => setIsDragging(1)}
        />
      </div>
    </div>
  );
});

RangeSlider.displayName = "RangeSlider";

export { RangeSlider }
