import { cn } from '@/shared/lib/utils';
import type { OrderStatus, StatusChange } from '@/entities/order/model/types';
import { formatDateTime } from '@/shared/lib/formatters';
import { STATUS_LABELS } from '@/shared/config/constants';

const STATUS_DOT_CLASSES: Record<OrderStatus, string> = {
  pending: 'bg-blue-500',
  in_transit: 'bg-amber-500',
  delivered: 'bg-green-500',
  cancelled: 'bg-red-500',
};

interface StatusHistoryTimelineProps {
  history: StatusChange[];
}

export function StatusHistoryTimeline({ history }: StatusHistoryTimelineProps) {
  const sortedHistory = [...history].sort(
    (a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime(),
  );

  return (
    <div className="flex flex-col">
      {sortedHistory.map((entry, index) => (
        <div key={entry.changedAt} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                'mt-1.5 size-2.5 shrink-0 rounded-full',
                STATUS_DOT_CLASSES[entry.to],
              )}
            />
            {index < sortedHistory.length - 1 && (
              <div className="w-px grow bg-border my-1 min-h-3" />
            )}
          </div>
          <div
            className={cn(
              'flex flex-col gap-0.5 rounded-md px-2 py-1 -mt-0.5',
              index < sortedHistory.length - 1 ? 'pb-4' : 'pb-1',
              index === 0 && 'bg-muted',
            )}
          >
            <p className={cn('text-sm', index === 0 ? 'font-semibold' : 'font-medium')}>
              {entry.from ? `${STATUS_LABELS[entry.from]} → ${STATUS_LABELS[entry.to]}` : STATUS_LABELS[entry.to]}
            </p>
            <p className="text-xs text-muted-foreground">{formatDateTime(entry.changedAt)}</p>
            {entry.note && (
              <p className="text-xs text-muted-foreground italic">{entry.note}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
