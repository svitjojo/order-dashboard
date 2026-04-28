import { useState } from 'react';
import { toast } from 'sonner';
import { useUpdateOrderStatusMutation } from '@/entities/order/api/orderApi';
import type { OrderStatus } from '@/entities/order/model/types';

interface PendingCancellation {
  orderId: string;
}

interface UseStatusChangeReturn {
  handleStatusChange: (orderId: string, to: OrderStatus) => void;
  isLoading: boolean;
  cancelDialog: {
    open: boolean;
    onConfirm: (note: string) => void;
    onClose: () => void;
  };
}

export function useStatusChange(): UseStatusChangeReturn {
  const [updateOrderStatus, { isLoading }] = useUpdateOrderStatusMutation();
  const [pendingCancellation, setPendingCancellation] = useState<PendingCancellation | null>(null);

  const handleStatusChange = (orderId: string, to: OrderStatus) => {
    if (to === 'cancelled') {
      setPendingCancellation({ orderId });
    } else {
      updateOrderStatus({ id: orderId, status: to })
        .unwrap()
        .then(() => toast.success('Status updated'))
        .catch(() => toast.error('Failed to update status'));
    }
  };

  const handleConfirmCancel = (note: string) => {
    if (pendingCancellation) {
      updateOrderStatus({ id: pendingCancellation.orderId, status: 'cancelled', note })
        .unwrap()
        .then(() => toast.success('Status updated'))
        .catch(() => toast.error('Failed to update status'));
      setPendingCancellation(null);
    }
  };

  const handleCloseCancel = () => {
    setPendingCancellation(null);
  };

  return {
    handleStatusChange,
    isLoading,
    cancelDialog: {
      open: pendingCancellation !== null,
      onConfirm: handleConfirmCancel,
      onClose: handleCloseCancel,
    },
  };
}
