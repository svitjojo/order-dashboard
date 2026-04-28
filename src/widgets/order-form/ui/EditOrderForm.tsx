import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { createOrderSchema, type CreateOrderInput } from '@/entities/order/model/schemas';
import { Button } from '@/shared/ui/button';
import { ClientSection } from './ClientSection';
import { OrderSection } from './OrderSection';
import { StopsSection } from './StopsSection';

interface EditOrderFormProps {
  orderId: string;
  initialValues: Partial<CreateOrderInput>;
  onSave: (data: CreateOrderInput) => Promise<void>;
  isSaving: boolean;
}

export function EditOrderForm({
  orderId,
  initialValues,
  onSave,
  isSaving,
}: EditOrderFormProps) {
  const navigate = useNavigate();
  const form = useForm<CreateOrderInput>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: initialValues,
  });

  const handleInvalidSubmit = () => {
    const firstInvalidElement = document.querySelector('[aria-invalid="true"]');
    firstInvalidElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSave, handleInvalidSubmit)}
        className="flex h-full flex-col"
        noValidate
      >
        <div className="flex shrink-0 items-center justify-between border-b border-border bg-background px-4 py-2.5">
          <h2 className="text-sm font-semibold text-foreground">
            Edit {initialValues.referenceNumber}
          </h2>
          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => navigate(`/orders/${orderId}`)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>

        <div className="flex-1 space-y-8 overflow-y-auto p-6">
          <ClientSection />
          <OrderSection />
          <StopsSection />
        </div>
      </form>
    </FormProvider>
  );
}
