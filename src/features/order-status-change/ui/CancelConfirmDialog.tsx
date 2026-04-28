import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cancelOrderSchema, type CancelOrderInput } from '@/entities/order/model/schemas';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { Label } from '@/shared/ui/label';
import { Textarea } from '@/shared/ui/textarea';
import { Button } from '@/shared/ui/button';

interface CancelConfirmDialogProps {
  open: boolean;
  onConfirm: (note: string) => void;
  onClose: () => void;
  isLoading?: boolean;
}

export function CancelConfirmDialog({
  open,
  onConfirm,
  onClose,
  isLoading,
}: CancelConfirmDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CancelOrderInput>({
    resolver: zodResolver(cancelOrderSchema),
  });

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Cancel Order</DialogTitle>
          <DialogDescription>
            Provide a reason for cancellation. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <form
          id="cancel-order-form"
          onSubmit={handleSubmit((data) => onConfirm(data.note))}
          className="flex flex-col gap-1.5"
        >
          <Label htmlFor="cancel-reason">Reason</Label>
          <Textarea
            id="cancel-reason"
            placeholder="Enter cancellation reason..."
            aria-invalid={errors.note ? true : undefined}
            {...register('note')}
          />
          {errors.note && (
            <p className="text-xs text-destructive">{errors.note.message}</p>
          )}
        </form>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" form="cancel-order-form" variant="destructive" disabled={isLoading}>
            {isLoading ? 'Cancelling...' : 'Confirm Cancel'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
