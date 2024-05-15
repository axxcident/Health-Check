'use client';
import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className="relative flex laptop:w-[70%] w-[100%] touch-none select-none items-center"
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 grow overflow-hidden rounded-full bg-[#B9B8B6]">
      <SliderPrimitive.Range className="absolute h-full bg-[#464343]" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-[29px] w-[29px] rounded-full border border-black/50 bg-[#464343] shadow-md transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
