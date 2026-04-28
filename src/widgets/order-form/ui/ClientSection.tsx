import { useFormContext } from 'react-hook-form';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import type { CreateOrderInput } from '@/entities/order/model/schemas';

export function ClientSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CreateOrderInput>();

  return (
    <section className="space-y-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Client
      </h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="clientName">
            Client Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="clientName"
            placeholder="Acme Corp"
            aria-invalid={!!errors.clientName}
            {...register('clientName')}
          />
          {errors.clientName && (
            <p className="text-sm text-destructive">{errors.clientName.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="referenceNumber">Client Ref # (optional)</Label>
          <Input
            id="referenceNumber"
            placeholder="Auto-generated"
            {...register('referenceNumber')}
          />
        </div>
      </div>
    </section>
  );
}
