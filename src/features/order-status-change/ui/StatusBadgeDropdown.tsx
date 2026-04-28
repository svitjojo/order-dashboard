import { cn } from '@/shared/lib/utils';
import type { OrderStatus } from '@/entities/order/model/types';
import { STATUS_LABELS } from '@/shared/config/constants';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { getValidTransitions, isTerminalStatus } from '../lib/getValidTransitions';
import { useStatusChange } from '../model/useStatusChange';
import { CancelConfirmDialog } from './CancelConfirmDialog';

const STATUS_BADGE_CLASSES: Record<OrderStatus, string> = {
  pending: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  in_transit: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  delivered: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

interface StatusBadgeDropdownProps {
  orderId: string;
  status: OrderStatus;
}

export function StatusBadgeDropdown({ orderId, status }: StatusBadgeDropdownProps) {
  const { handleStatusChange, isLoading, cancelDialog } = useStatusChange();
  const transitions = getValidTransitions(status);
  const terminal = isTerminalStatus(status);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          disabled={terminal || transitions.length === 0}
          className={cn(
            'inline-flex h-5 items-center justify-center rounded-full border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-opacity outline-none',
            STATUS_BADGE_CLASSES[status],
            !terminal ? 'cursor-pointer hover:opacity-80' : 'cursor-default',
          )}
        >
          {STATUS_LABELS[status]}
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {transitions.map((nextStatus) => (
            <DropdownMenuItem
              key={nextStatus}
              onClick={() => handleStatusChange(orderId, nextStatus)}
              disabled={isLoading}
            >
              {STATUS_LABELS[nextStatus]}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <CancelConfirmDialog
        open={cancelDialog.open}
        onConfirm={cancelDialog.onConfirm}
        onClose={cancelDialog.onClose}
        isLoading={isLoading}
      />
    </>
  );
}
