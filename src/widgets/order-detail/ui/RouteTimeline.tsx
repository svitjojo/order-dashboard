import { cn } from '@/shared/lib/utils';
import { STOP_TYPE, type Stop } from '@/entities/order/model/types';
import { formatDate } from '@/shared/lib/formatters';
import { APPOINTMENT_LABELS } from '@/shared/config/constants';

interface RouteTimelineProps {
  stops: Stop[];
}

export function RouteTimeline({ stops }: RouteTimelineProps) {
  const sortedStops = [...stops].sort((a, b) => a.order - b.order);
  const isPickup = (stop: Stop) => stop.type === STOP_TYPE.PICK_UP;
  const isDropoff = (stop: Stop) => stop.type === STOP_TYPE.DROP_OFF;

  return (
    <div className="flex flex-col">
      {sortedStops.map((stop, index) => (
        <div key={stop.id} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                'flex size-7 shrink-0 items-center justify-center rounded-full text-white text-xs font-bold',
                isPickup(stop) ? 'bg-blue-500' : isDropoff(stop) ? 'bg-slate-500' : 'bg-amber-500',
              )}
            >
              {isPickup(stop) ? '↑' : isDropoff(stop) ? '↓' : '·'}
            </div>
            {index < sortedStops.length - 1 && <div className="w-px grow bg-border my-1 min-h-3" />}
          </div>
          <div
            className={cn(
              'flex flex-col gap-0.5',
              index < sortedStops.length - 1 ? 'pb-4' : 'pb-0',
            )}
          >
            <p className="text-sm font-medium leading-7">
              {isPickup(stop) ? 'Pickup' : isDropoff(stop) ? 'Dropoff' : 'Stop'}
            </p>
            {stop.locationName && (
              <p className="text-xs text-muted-foreground">{stop.locationName}</p>
            )}
            <p className="text-sm">
              {stop.address.city}, {stop.address.state} {stop.address.zip}
            </p>
            <p className="text-xs text-muted-foreground">
              {APPOINTMENT_LABELS[stop.appointmentType]}
              {stop.appointmentDate ? ` · ${formatDate(stop.appointmentDate)}` : ''}
            </p>
            {stop.refNumber && (
              <p className="text-xs text-muted-foreground">Ref: {stop.refNumber}</p>
            )}
            {stop.notes && <p className="text-xs text-muted-foreground italic">{stop.notes}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
