import { useParams, useNavigate } from 'react-router-dom';
import { useGetOrderQuery, useDeleteOrderMutation } from '@/entities/order/api/orderApi';
import { Button } from '@/shared/ui/button';
import { OrderDetailView } from '@/widgets/order-detail/ui/OrderDetailView';
import { OrderDetailSkeleton } from '@/widgets/order-detail/ui/OrderDetailSkeleton';

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: order, isLoading, isError, refetch } = useGetOrderQuery(id!);
  const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();

  const handleDelete = async () => {
    try {
      await deleteOrder(id!).unwrap();
      navigate('/orders');
    } catch {
      // deletion failed — user stays on page, can retry
    }
  };

  if (isLoading) {
    return <OrderDetailSkeleton />;
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

  return (
    <OrderDetailView
      order={order}
      onBack={() => navigate('/orders')}
      onEdit={() => navigate(`/orders/${id}/edit`)}
      onDelete={() => void handleDelete()}
      isDeleting={isDeleting}
    />
  );
}
