import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useGetOrderQuery, useUpdateOrderMutation } from '@/entities/order/api/orderApi';
import { Button } from '@/shared/ui/button';
import { EditOrderForm } from '@/widgets/order-form/ui/EditOrderForm';
import { EditOrderFormSkeleton } from '@/widgets/order-form/ui/EditOrderFormSkeleton';
import type { CreateOrderInput } from '@/entities/order/model/schemas';
import { mapOrderToFormValues } from '../lib/mapOrderToFormValues';

export function EditOrderPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: order, isLoading, isError, refetch } = useGetOrderQuery(id!);
  const [updateOrder, { isLoading: isSaving }] = useUpdateOrderMutation();

  if (isLoading) {
    return <EditOrderFormSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-12 text-center">
        <p className="text-sm text-muted-foreground">Failed to load order.</p>
        <Button variant="outline" onClick={() => void refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-12 text-center">
        <p className="text-sm text-muted-foreground">Order not found.</p>
        <Button variant="outline" onClick={() => navigate('/orders')}>
          Back to Orders
        </Button>
      </div>
    );
  }

  if (order.status !== 'pending') {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-12 text-center">
        <p className="text-sm font-medium">This order cannot be edited.</p>
        <p className="text-sm text-muted-foreground">
          Only pending orders are editable. This order is{' '}
          {order.status.replace('_', ' ')}.
        </p>
        <Button variant="outline" onClick={() => navigate(`/orders/${id}`)}>
          View Order
        </Button>
      </div>
    );
  }

  const handleSave = async (data: CreateOrderInput) => {
    try {
      await updateOrder({ id: id!, data }).unwrap();
      toast.success('Order updated');
      navigate(`/orders/${id}`);
    } catch {
      toast.error('Failed to update order');
    }
  };

  return (
    <EditOrderForm
      orderId={id!}
      initialValues={mapOrderToFormValues(order)}
      onSave={handleSave}
      isSaving={isSaving}
    />
  );
}
