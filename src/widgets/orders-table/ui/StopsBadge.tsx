import { Popover } from '@base-ui/react/popover';
import { STOP_TYPE, type Stop } from '@/entities/order/model/types';

function getStopBadgeLabel(count: number): string {
  return count === 1 ? '+1 stop' : `+${count} stops`;
}

interface StopsBadgeProps {
  stops: Stop[];
}

export function StopsBadge({ stops }: StopsBadgeProps) {
  const intermediateCount = stops.filter((s) => s.type === 'stop').length;

  if (intermediateCount === 0) return null;

  const sorted = [...stops].sort((a, b) => a.order - b.order);

  return (
    <Popover.Root>
      <span onClick={(e) => e.stopPropagation()}>
        <Popover.Trigger className="ml-1.5 inline-flex cursor-pointer items-center rounded-full bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-200 outline-none focus-visible:ring-2 focus-visible:ring-ring/50 dark:bg-blue-900/40 dark:text-blue-300 dark:hover:bg-blue-800/60">
          {getStopBadgeLabel(intermediateCount)}
        </Popover.Trigger>
      </span>
      <Popover.Portal>
        <Popover.Positioner sideOffset={6}>
          <Popover.Popup className="z-50 min-w-44 rounded-md border border-border bg-popover p-3 shadow-md text-popover-foreground outline-none">
            <div className="space-y-1.5">
              {sorted.map((stop) => (
                <div key={stop.id} className="flex items-center gap-2 text-xs">
                  <span className="w-3 text-center text-muted-foreground">
                    {stop.type === STOP_TYPE.PICK_UP
                      ? '↑'
                      : stop.type === STOP_TYPE.DROP_OFF
                        ? '↓'
                        : '·'}
                  </span>
                  <span>
                    {stop.address.city}, {stop.address.state}
                    {stop.locationName ? ` — ${stop.locationName}` : ''}
                  </span>
                </div>
              ))}
            </div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
