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
  const [inputValues, setInputValues] = React.useState<[string, string]>([
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

  const getValueFromEvent = React.useCallback((event: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    if (!trackRef.current) return null;
    const rect = trackRef.current.getBoundingClientRect();
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const percentage = ((clientX - rect.left) / rect.width) * 100;
    return getValue(percentage);
  }, [trackRef, getValue]);

  const handleTrackInteraction = (event: React.MouseEvent | React.TouchEvent) => {
    const newValue = getValueFromEvent(event);
    if (newValue === null) return;
    
    // Find closest thumb
    const thumb0Distance = Math.abs(value[0] - newValue);
    const thumb1Distance = Math.abs(value[1] - newValue);
    
    if (thumb0Distance < thumb1Distance) {
      onValueChange([newValue, value[1]]);
    } else {
      onValueChange([value[0], newValue]);
    }
  };

  const handleMove = React.useCallback((event: MouseEvent | TouchEvent) => {
    if (isDragging === null) return;
    
    const newValue = getValueFromEvent(event);
    if (newValue === null) return;
    
    if (isDragging === 0) {
      onValueChange([Math.min(newValue, value[1]), value[1]]);
    } else {
      onValueChange([value[0], Math.max(value[0], newValue)]);
    }
  }, [isDragging, value, getValueFromEvent, onValueChange]);

  const handleMoveEnd = () => {
    setIsDragging(null);
  };

  React.useEffect(() => {
    if (isDragging !== null) {
      const handleTouchMove = (e: TouchEvent) => {
        e.preventDefault(); // Prevent scrolling while dragging
        handleMove(e);
      };
      
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleMoveEnd);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleMoveEnd);
      
      return () => {
        window.removeEventListener('mousemove', handleMove);
        window.removeEventListener('mouseup', handleMoveEnd);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleMoveEnd);
      };
    }
  }, [isDragging, handleMove]);

  React.useEffect(() => {
    if (!isDragging) {
      setInputValues([formatValue(value[0]), formatValue(value[1])]);
    }
  }, [value, formatValue, isDragging]);

  const handleInputChange = (inputValue: string, index: number) => {
    const newInputValues = [...inputValues] as [string, string];
    newInputValues[index] = inputValue;
    setInputValues(newInputValues);

    const parsed = parseValue(inputValue);
    if (!isNaN(parsed)) {
      const clamped = Math.max(min, Math.min(max, parsed));
      const newValue = [...value];
      newValue[index] = clamped;

      // Ensure min thumb doesn't exceed max thumb and vice versa
      if (index === 0 && clamped <= value[1]) {
        onValueChange([clamped, value[1]]);
      } else if (index === 1 && clamped >= value[0]) {
        onValueChange([value[0], clamped]);
      }
    }
  };

  const handleInputBlur = () => {
    // If the input is invalid, reset it to the current value
    setInputValues([formatValue(value[0]), formatValue(value[1])]);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
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
              value={inputValues[0]}
              onChange={(e) => handleInputChange(e.target.value, 0)}
              onBlur={handleInputBlur}
              onKeyDown={handleInputKeyDown}
              className="w-24 h-8"
            />
            <span>-</span>
            <Input
              type="text"
              value={inputValues[1]}
              onChange={(e) => handleInputChange(e.target.value, 1)}
              onBlur={handleInputBlur}
              onKeyDown={handleInputKeyDown}
              className="w-24 h-8"
            />
          </div>
        </div>
      )}

      <div className="relative h-10 flex items-center touch-none">
        <div
          ref={trackRef}
          className="relative h-1.5 w-full rounded-full bg-primary/20 cursor-pointer"
          onClick={handleTrackInteraction}
          onTouchStart={handleTrackInteraction}
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
          onTouchStart={(e) => {
            e.preventDefault();
            setIsDragging(0);
          }}
        />
        <div
          className="absolute w-4 h-4 -ml-2 rounded-full bg-background border border-primary/50 shadow cursor-grab active:cursor-grabbing"
          style={{ left: `${getPercentage(value[1])}%` }}
          onMouseDown={() => setIsDragging(1)}
          onTouchStart={(e) => {
            e.preventDefault();
            setIsDragging(1);
          }}
        />
      </div>
    </div>
  );
});

RangeSlider.displayName = "RangeSlider";

export { RangeSlider }
