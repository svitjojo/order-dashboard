import { useState } from 'react';
import { Popover as PopoverPrimitive } from '@base-ui/react/popover';
import { CheckIcon, ChevronsUpDownIcon, SearchIcon } from 'lucide-react';
import { useGetCarriersQuery } from '@/entities/carrier/api/carrierApi';
import { cn } from '@/shared/lib/utils';

interface CarrierSelectProps {
  value: string;
  onChange: (carrierId: string) => void;
  onBlur?: () => void;
  error?: string;
  disabled?: boolean;
}

export function CarrierSelect({ value, onChange, onBlur, error, disabled }: CarrierSelectProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: allCarriers = [], isLoading } = useGetCarriersQuery(undefined);

  const filteredCarriers = searchQuery
    ? allCarriers.filter(
        (carrier) =>
          carrier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          carrier.mcNumber.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : allCarriers;

  const selectedCarrier = allCarriers.find((carrier) => carrier.id === value) ?? null;

  return (
    <div>
      <PopoverPrimitive.Root>
        <PopoverPrimitive.Trigger
          aria-invalid={error ? true : undefined}
          onBlur={onBlur}
          disabled={disabled}
          className={cn(
            'flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-2.5 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
            error && 'border-destructive ring-3 ring-destructive/20',
          )}
        >
          <span className={cn(!selectedCarrier && 'text-muted-foreground')}>
            {selectedCarrier
              ? `${selectedCarrier.name} · ${selectedCarrier.mcNumber}`
              : 'Search carriers...'}
          </span>
          <ChevronsUpDownIcon className="size-4 shrink-0 text-muted-foreground" />
        </PopoverPrimitive.Trigger>

        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Positioner sideOffset={4} className="z-50 w-(--anchor-width) min-w-64">
            <PopoverPrimitive.Popup className="rounded-md bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-none">
              <div className="flex items-center border-b border-border px-3">
                <SearchIcon className="mr-2 size-4 shrink-0 text-muted-foreground" />
                <input
                  placeholder="Search carriers..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="flex h-10 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
              <div className="max-h-60 overflow-y-auto p-1">
                {isLoading && (
                  <div className="py-6 text-center text-sm text-muted-foreground">Loading...</div>
                )}
                {!isLoading && filteredCarriers.length === 0 && (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    No carriers found
                  </div>
                )}
                {filteredCarriers.map((carrier) => (
                  <PopoverPrimitive.Close
                    key={carrier.id}
                    type="button"
                    onClick={() => {
                      onChange(carrier.id);
                      setSearchQuery('');
                    }}
                    className="relative flex w-full cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none hover:bg-accent hover:text-accent-foreground"
                  >
                    <CheckIcon
                      className={cn(
                        'mr-2 size-4 shrink-0',
                        value === carrier.id ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                    <span>
                      {carrier.name} · {carrier.mcNumber}
                    </span>
                  </PopoverPrimitive.Close>
                ))}
              </div>
            </PopoverPrimitive.Popup>
          </PopoverPrimitive.Positioner>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
      {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
    </div>
  );
}
