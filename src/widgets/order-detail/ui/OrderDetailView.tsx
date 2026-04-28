import { useState } from 'react';
import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';
import { STOP_TYPE, type Order } from '@/entities/order/model/types';
import { StatusBadgeDropdown } from '@/features/order-status-change/ui/StatusBadgeDropdown';
import { formatCurrency } from '@/shared/lib/formatters';
import { EQUIPMENT_LABELS, LOAD_TYPE_LABELS } from '@/shared/config/constants';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { RouteTimeline } from './RouteTimeline';
import { StatusHistoryTimeline } from './StatusHistoryTimeline';

interface DetailCardProps {
  label: string;
  children: ReactNode;
  fullWidth?: boolean;
}

function DetailCard({ label, children, fullWidth = false }: DetailCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-0.5 rounded-lg border border-border p-3',
        fullWidth && 'col-span-2 md:col-span-3',
      )}
    >
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="text-sm font-medium">{children}</div>
    </div>
  );
}

interface OrderDetailViewProps {
  order: Order;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

export function OrderDetailView({
  order,
  onBack,
  onEdit,
  onDelete,
  isDeleting,
}: OrderDetailViewProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const firstPickup = order.stops.find((stop) => stop.type === STOP_TYPE.PICK_UP);
  const lastDropoff = [...order.stops].reverse().find((stop) => stop.type === STOP_TYPE.DROP_OFF);
  const routeSummary =
    firstPickup && lastDropoff
      ? `${firstPickup.address.city}, ${firstPickup.address.state} → ${lastDropoff.address.city}, ${lastDropoff.address.state}`
      : null;

  const isPending = order.status === 'pending';

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <Button variant="ghost" size="sm" onClick={onBack} className="w-fit -ml-2">
          ← Orders
        </Button>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-semibold">{order.referenceNumber}</h1>
            <StatusBadgeDropdown orderId={order.id} status={order.status} />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onEdit} disabled={!isPending}>
              Edit
            </Button>
            {isPending && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowDeleteDialog(true)}
                disabled={isDeleting}
              >
                Delete
              </Button>
            )}
          </div>
        </div>
        {routeSummary && <p className="text-sm text-muted-foreground">{routeSummary}</p>}
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <DetailCard label="Client">{order.clientName}</DetailCard>
        <DetailCard label="Carrier">
          <span>{order.carrier.name}</span>
          <span className="ml-1 font-normal text-muted-foreground">· {order.carrier.mcNumber}</span>
        </DetailCard>
        <DetailCard label="Equipment">{EQUIPMENT_LABELS[order.equipmentType]}</DetailCard>
        <DetailCard label="Load Type">{LOAD_TYPE_LABELS[order.loadType]}</DetailCard>
        <DetailCard label="Rate">{formatCurrency(order.rate)}</DetailCard>
        <DetailCard label="Weight">{order.weight.toLocaleString()} lbs</DetailCard>
        {order.notes && (
          <DetailCard label="Notes" fullWidth>
            {order.notes}
          </DetailCard>
        )}
      </div>

      {/* Timeline sections */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold">Route</h2>
          <RouteTimeline stops={order.stops} />
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold">Status History</h2>
          <StatusHistoryTimeline history={order.statusHistory} />
        </div>
      </div>

      {/* Delete confirmation */}
      <Dialog
        open={showDeleteDialog}
        onOpenChange={(isOpen) => {
          if (!isOpen && !isDeleting) setShowDeleteDialog(false);
        }}
      >
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Delete Order</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {order.referenceNumber}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={onDelete} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
