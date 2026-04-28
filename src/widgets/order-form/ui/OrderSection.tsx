import { Controller, useFormContext } from 'react-hook-form';
import { Input } from '@/shared/ui/input';
import { Select } from '@/shared/ui/select';
import { Label } from '@/shared/ui/label';
import { Textarea } from '@/shared/ui/textarea';
import { EQUIPMENT_LABELS, LOAD_TYPE_LABELS } from '@/shared/config/constants';
import type { CreateOrderInput } from '@/entities/order/model/schemas';
import type { EquipmentType, LoadType } from '@/entities/order/model/types';
import { CarrierSelect } from './CarrierSelect';

export function OrderSection() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<CreateOrderInput>();

  return (
    <section className="space-y-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Order Details
      </h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="carrierId">
            Carrier <span className="text-destructive">*</span>
          </Label>
          <Controller
            name="carrierId"
            control={control}
            render={({ field, fieldState }) => (
              <CarrierSelect
                value={field.value ?? ''}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={fieldState.error?.message}
              />
            )}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="equipmentType">
            Equipment Type <span className="text-destructive">*</span>
          </Label>
          <Select
            id="equipmentType"
            aria-invalid={!!errors.equipmentType}
            {...register('equipmentType')}
          >
            <option value="">Select equipment...</option>
            {(Object.entries(EQUIPMENT_LABELS) as [EquipmentType, string][]).map(
              ([equipmentValue, label]) => (
                <option key={equipmentValue} value={equipmentValue}>
                  {label}
                </option>
              ),
            )}
          </Select>
          {errors.equipmentType && (
            <p className="text-sm text-destructive">{errors.equipmentType.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="loadType">
            Load Type <span className="text-destructive">*</span>
          </Label>
          <Select id="loadType" aria-invalid={!!errors.loadType} {...register('loadType')}>
            <option value="">Select load type...</option>
            {(Object.entries(LOAD_TYPE_LABELS) as [LoadType, string][]).map(
              ([loadTypeValue, label]) => (
                <option key={loadTypeValue} value={loadTypeValue}>
                  {label}
                </option>
              ),
            )}
          </Select>
          {errors.loadType && <p className="text-sm text-destructive">{errors.loadType.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="rate">
            Rate ($) <span className="text-destructive">*</span>
          </Label>
          <Input
            id="rate"
            type="number"
            min={0}
            step={0.01}
            placeholder="0.00"
            aria-invalid={!!errors.rate}
            {...register('rate', { valueAsNumber: true })}
          />
          {errors.rate && <p className="text-sm text-destructive">{errors.rate.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="weight">
            Weight (lbs) <span className="text-destructive">*</span>
          </Label>
          <Input
            id="weight"
            type="number"
            min={0}
            step={1}
            placeholder="0"
            aria-invalid={!!errors.weight}
            {...register('weight', { valueAsNumber: true })}
          />
          {errors.weight && <p className="text-sm text-destructive">{errors.weight.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="notes">Notes (optional)</Label>
          <Textarea
            id="notes"
            placeholder="Additional order instructions..."
            className="resize-none"
            {...register('notes')}
          />
        </div>
      </div>
    </section>
  );
}
