"use client";

import { ChevronDownIcon } from "lucide-react";
import { type DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export default function DateRangePicker({ value, setValue, ariaInvalid, ...props }: { value: DateRange | undefined; setValue: (value: DateRange | undefined) => void; ariaInvalid?: boolean }) {
  return (
    <div className="flex flex-col gap-3">
      <Popover>
        <PopoverTrigger asChild>
          <Button aria-invalid={ariaInvalid} variant="outline" id="dates" className="w-full justify-between font-normal">
            {value?.from && value?.to ? `${value.from.toLocaleDateString()} - ${value.to.toLocaleDateString()}` : "Select date"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            {...props}
            mode="range"
            selected={value}
            captionLayout="dropdown"
            onSelect={(range) => {
              setValue(range);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
