import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  selected?: Date | null;
  onSelect?: (date: Date | undefined) => void;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
  placeholder?: string;
}

export function DatePicker({ 
  selected, 
  onSelect, 
  className, 
  minDate, 
  maxDate,
  placeholder = "Pick a date" 
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal h-10",
            !selected && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
          {selected ? format(selected, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected || undefined}
          onSelect={onSelect}
          initialFocus
          disabled={(date) => 
            (minDate ? date < minDate : false) || 
            (maxDate ? date > maxDate : false)
          }
        />
      </PopoverContent>
    </Popover>
  );
}
