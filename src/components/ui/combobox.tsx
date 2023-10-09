'use client';

import { Check, ChevronsUpDown } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useCallback, useState } from 'react';

import { Button } from '@/components/ui/button';
import { CommandList } from 'cmdk';
import { cn } from '@/lib/utils';
import { debounce } from 'radash';

type ComboboxProps = {
  items: { label: string; value: string }[];
  placeholder?: string;
  value: string;
  onChange: (value: string, type: 'select' | 'input') => void;
};

export function Combobox({
  items,
  placeholder = 'Search items...',
  value,
  onChange,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);

  console.log(items);

  const debouncedOnChange = debounce({ delay: 500 }, (value: string) => {
    onChange(value, 'input');
  });

  const onInputChange = useCallback(
    (value: string) => {
      debouncedOnChange(value);
    },
    [debouncedOnChange]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-[400px] justify-between capitalize'
        >
          {value ? value : placeholder}
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[400px] p-0'>
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={placeholder}
            onValueChange={(value) => {
              onInputChange(value);
            }}
          />
          <CommandEmpty>
            {items.length === 0 ? 'Item not found.' : 'Loading...'}
          </CommandEmpty>
          <CommandGroup className='max-h-64 overflow-y-auto'>
            {items.map((item) => {
              return (
                <CommandItem
                  key={item.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue, 'select');
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === item.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {item.label}
                </CommandItem>
              );
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
