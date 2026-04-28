import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronUpIcon, ChevronDownIcon, MoreHorizontalIcon, PlusIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { useOrdersTableState } from '@/widgets/orders-table/model/useOrdersTableState';
import { StatusBadgeDropdown } from '@/features/order-status-change/ui/StatusBadgeDropdown';
import { duplicateOrderAsDraft } from '@/features/draft-management/model/draftsSlice';
import { useDeleteOrderMutation } from '@/entities/order/api/orderApi';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { DraftsBar } from '@/widgets/orders-table/ui/DraftsBar';
import { OrdersTableSkeleton } from '@/widgets/orders-table/ui/OrdersTableSkeleton';
import { formatCurrency, formatDate } from '@/shared/lib/formatters';
import {
  EQUIPMENT_LABELS,
  MAX_DRAFT_TABS,
  PAGE_SIZE_OPTIONS,
  STATUS_LABELS,
} from '@/shared/config/constants';
import { cn } from '@/shared/lib/utils';
import { Select } from '@/shared/ui/select';
import {
  ORDER_STATUS,
  STOP_TYPE,
  type Order,
  type OrderStatus,
} from '@/entities/order/model/types';
import { mapOrderToFormData } from '../lib/mapOrderToFormData';

function getRouteLabel(order: Order): string {
  const pickupStop = order.stops.find((stop) => stop.type === STOP_TYPE.PICK_UP);
  const dropoffs = order.stops.filter((stop) => stop.type === STOP_TYPE.DROP_OFF);
  const dropoffStop = dropoffs[dropoffs.length - 1];
  if (!pickupStop || !dropoffStop) return '—';
  return `${pickupStop.address.city}, ${pickupStop.address.state} → ${dropoffStop.address.city}, ${dropoffStop.address.state}`;
}

function getPickupDate(order: Order): string | null | undefined {
  return order.stops.find((stop) => stop.type === STOP_TYPE.PICK_UP)?.appointmentDate;
}

function SortIcon({
  field,
  currentSort,
  currentDir,
}: {
  field: string;
  currentSort?: string;
  currentDir?: string;
}) {
  if (currentSort === field) {
    return currentDir === 'desc' ? (
      <ChevronDownIcon className="size-3" />
    ) : (
      <ChevronUpIcon className="size-3" />
    );
  }
  return <ChevronUpIcon className="size-3 opacity-30" />;
}

export function OrdersPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { drafts } = useAppSelector((state) => state.drafts);
  const {
    orders,
    total,
    totalPages,
    isLoading,
    isFetching,
    isError,
    refetch,
    filters,
    search,
    setSearch,
    setStatus,
    setSort,
    setPage,
    setSize,
    clearFilters,
  } = useOrdersTableState();

  const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const activeStatuses = filters.status ?? [];
  const currentPage = filters.page ?? 1;
  const pageSize = filters.size ?? 10;
  const pageStart = (currentPage - 1) * pageSize + 1;
  const pageEnd = Math.min(currentPage * pageSize, total);
  const hasActiveFilters = search.length > 0 || activeStatuses.length > 0;
  const atDraftLimit = drafts.length >= MAX_DRAFT_TABS;

  const toggleStatus = (status: OrderStatus) => {
    if (activeStatuses.includes(status)) {
      setStatus(activeStatuses.filter((s) => s !== status));
    } else {
      setStatus([...activeStatuses, status]);
    }
  };

  const handleDuplicate = (order: Order) => {
    if (atDraftLimit) return;
    dispatch(duplicateOrderAsDraft(mapOrderToFormData(order)));
    navigate('/orders/new');
  };

  const handleDeleteConfirm = async () => {
    if (!pendingDeleteId) return;
    try {
      await deleteOrder(pendingDeleteId).unwrap();
      toast.success('Order deleted');
    } catch {
      toast.error('Failed to delete order');
    } finally {
      setPendingDeleteId(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Drafts bar */}
      <DraftsBar />

      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Input
          placeholder="Search orders..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <div className="flex flex-wrap items-center gap-1">
          {Object.values(ORDER_STATUS).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => toggleStatus(status)}
              className={cn(
                'cursor-pointer rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                activeStatuses.includes(status)
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-border bg-background text-muted-foreground hover:border-blue-400 hover:text-foreground',
              )}
            >
              {STATUS_LABELS[status]}
            </button>
          ))}
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear filters
          </Button>
        )}
        <Button className="ml-auto" size="sm" onClick={() => navigate('/orders/new')}>
          <PlusIcon />
          New Order
        </Button>
      </div>

      {/* Table */}
      <div
        className={cn(
          'overflow-x-auto rounded-lg border border-border',
          isFetching && !isLoading && 'opacity-60 transition-opacity',
        )}
      >
        {isLoading ? (
          <OrdersTableSkeleton />
        ) : isError ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <p className="text-sm text-muted-foreground">Failed to load orders.</p>
            <Button variant="outline" size="sm" onClick={() => void refetch()}>
              Retry
            </Button>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <p className="text-sm text-muted-foreground">
              {hasActiveFilters ? 'No orders match your filters.' : 'No orders yet.'}
            </p>
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear filters
              </Button>
            )}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">
                  Reference #
                </th>
                <th
                  className="cursor-pointer select-none px-4 py-2.5 text-left text-xs font-medium text-muted-foreground hover:text-foreground"
                  onClick={() => setSort('status')}
                >
                  <span className="inline-flex items-center gap-1">
                    Status
                    <SortIcon field="status" currentSort={filters.sort} currentDir={filters.dir} />
                  </span>
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">
                  Route
                </th>
                <th className="px-4 py-2.5 text-center text-xs font-medium text-muted-foreground">
                  Stops
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">
                  Carrier
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">
                  Equipment
                </th>
                <th
                  className="cursor-pointer select-none px-4 py-2.5 text-left text-xs font-medium text-muted-foreground hover:text-foreground"
                  onClick={() => setSort('pickupDate')}
                >
                  <span className="inline-flex items-center gap-1">
                    Pickup Date
                    <SortIcon
                      field="pickupDate"
                      currentSort={filters.sort}
                      currentDir={filters.dir}
                    />
                  </span>
                </th>
                <th
                  className="cursor-pointer select-none px-4 py-2.5 text-right text-xs font-medium text-muted-foreground hover:text-foreground"
                  onClick={() => setSort('rate')}
                >
                  <span className="inline-flex items-center justify-end gap-1">
                    Rate
                    <SortIcon field="rate" currentSort={filters.sort} currentDir={filters.dir} />
                  </span>
                </th>
                <th className="px-2 py-2.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="cursor-pointer transition-colors hover:bg-muted/50"
                  onClick={() => navigate(`/orders/${order.id}`)}
                >
                  <td className="px-4 py-3 font-mono text-xs font-medium">
                    {order.referenceNumber}
                  </td>
                  <td className="px-4 py-3" onClick={(clickEvent) => clickEvent.stopPropagation()}>
                    <StatusBadgeDropdown orderId={order.id} status={order.status} />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{getRouteLabel(order)}</td>
                  <td className="px-4 py-3 text-center tabular-nums">{order.stops.length}</td>
                  <td className="px-4 py-3">{order.carrier.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {EQUIPMENT_LABELS[order.equipmentType]}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(getPickupDate(order))}
                  </td>
                  <td className="px-4 py-3 text-right font-medium">{formatCurrency(order.rate)}</td>
                  <td className="px-2 py-3" onClick={(clickEvent) => clickEvent.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="cursor-pointer inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted">
                        <MoreHorizontalIcon className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/orders/${order.id}`)}>
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => navigate(`/orders/${order.id}/edit`)}
                          disabled={order.status !== 'pending'}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDuplicate(order)}
                          disabled={atDraftLimit}
                        >
                          Duplicate as Draft
                        </DropdownMenuItem>
                        {order.status === 'pending' && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => setPendingDeleteId(order.id)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {!isLoading && !isError && total > 0 && (
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>
              Showing {pageStart}–{pageEnd} of {total} orders
            </span>
            <Select
              value={String(pageSize)}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-min"
            >
              {PAGE_SIZE_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n} / page
                </option>
              ))}
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setPage(currentPage - 1)}
            >
              Previous
            </Button>
            <span className="text-xs">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      <Dialog
        open={pendingDeleteId !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) setPendingDeleteId(null);
        }}
      >
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Delete Order</DialogTitle>
            <DialogDescription>
              This action cannot be undone. The order will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPendingDeleteId(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => void handleDeleteConfirm()}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
