"use client";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, CircleChevronRight, Loader } from "lucide-react";
import { Activity, useEffect, useState } from "react";
import { Button } from "./button";

const ComboboxField = ({ listTypes, valueProps, setValueProps, debounce = 500, onValueChange, isLoading, isDisabled }: ComboboxFieldProps) => {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(valueProps);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      onValueChange?.(search);
    }, debounce);

    return () => clearTimeout(timer);
  }, [onValueChange, search, debounce]);

  useEffect(() => {
    setInternalValue(valueProps);
  }, [valueProps]);

  const selectedItem = listTypes.find((list) => list.id === internalValue);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={isDisabled}>
        <Button variant="outline" role="combobox" aria-expanded={open} className="justify-between w-full">
          {internalValue && selectedItem ? (
            <div className="flex items-center gap-2">
              <span>{selectedItem.name}</span>
              <Activity mode={selectedItem.productCode ? "visible" : "hidden"}>
                <CircleChevronRight />
                <span>{selectedItem.productCode}</span>
              </Activity>
            </div>
          ) : (
            "Select List..."
          )}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command
          filter={(value, search) => {
            const splitValue = value.split("|")[1];

            if (splitValue.toLowerCase().includes(search.toLowerCase())) return 1;
            return 0;
          }}>
          <CommandInput value={search} onValueChange={(value) => setSearch(value)} placeholder="Search List..." className="h-9" />
          <CommandList>
            <CommandEmpty className="flex justify-center text-sm p-3">
              {isLoading ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : listTypes.length === 0 ? "No List found." : <Loader className="mr-2 h-4 w-4 animate-spin" />}
            </CommandEmpty>
            <CommandGroup className="overflow-y-auto">
              {listTypes.map((list) => (
                <CommandItem
                  key={list.id}
                  value={`${list.id}|${list.name}`}
                  onSelect={(currentValue) => {
                    const splitValue = currentValue.split("|")[0];

                    setValueProps(splitValue === internalValue ? "" : splitValue);
                    setOpen(false);
                  }}>
                  {list.name} {list.productCode && <CircleChevronRight />} {list.productCode}
                  <Check className={cn("ml-auto", internalValue === list.id ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export { ComboboxField };
