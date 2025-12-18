"use client";
import { Dispatch, SetStateAction, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export function ComboboxField({ listTypes, value, setValue }: { listTypes: { id: string; name: string }[]; value: string; setValue: Dispatch<SetStateAction<string>> }) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="justify-between w-full">
          {value ? listTypes.find((list) => list.id === value)?.name : "Select List..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command
          filter={(value, search) => {
            const idValue = value.split("|")[1];

            if (idValue.toLowerCase().includes(search.toLowerCase())) return 1;
            return 0;
          }}>
          <CommandInput placeholder="Search List..." className="h-9" />
          <CommandList>
            <CommandEmpty>No List found.</CommandEmpty>
            <CommandGroup className="overflow-y-auto">
              {listTypes.map((list) => (
                <CommandItem
                  key={list.id}
                  value={`${list.id}|${list.name}`}
                  onSelect={(currentValue) => {
                    const idValue = currentValue.split("|")[0];

                    setValue(idValue === value ? "" : idValue);
                    setOpen(false);
                  }}>
                  {list.name}
                  <Check className={cn("ml-auto", value === list.id ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
