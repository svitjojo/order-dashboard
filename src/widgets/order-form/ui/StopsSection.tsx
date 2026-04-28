import { useFieldArray, useFormContext } from 'react-hook-form';
import { PlusIcon } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import type { CreateOrderInput } from '@/entities/order/model/schemas';
import { StopCard } from './StopCard';
import { STOP_TYPE } from '@/entities/order/model/types';

const MAX_STOPS = 5;
const MIN_STOPS = 2;

const EMPTY_STOP: CreateOrderInput['stops'][number] = {
  type: STOP_TYPE.PICK_UP,
  address: { city: '', state: '', zip: '' },
  appointmentType: 'fcfs',
};

export function StopsSection() {
  const form = useFormContext<CreateOrderInput>();
  const {
    formState: { errors },
  } = form;
  const { fields, insert, remove, swap } = useFieldArray({
    control: form.control,
    name: 'stops',
  });

  const isAtMaxStops = fields.length >= MAX_STOPS;
  const canDeleteStop = fields.length > MIN_STOPS;

  const handleAddStop = () => {
    const hasPickup = fields.some((f) => f.type === STOP_TYPE.PICK_UP);
    const hasDropoff = fields.some((f) => f.type === STOP_TYPE.DROP_OFF);
    if (!hasPickup) {
      insert(0, { ...EMPTY_STOP, type: STOP_TYPE.PICK_UP });
    } else if (!hasDropoff) {
      insert(fields.length, { ...EMPTY_STOP, type: STOP_TYPE.DROP_OFF });
    } else {
      const dropoffIdx = fields.findIndex((f) => f.type === STOP_TYPE.DROP_OFF);
      insert(dropoffIdx, { ...EMPTY_STOP, type: STOP_TYPE.STOP });
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Stops ({fields.length}/{MAX_STOPS})
        </h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddStop}
          disabled={isAtMaxStops}
        >
          <PlusIcon />
          Add Stop
        </Button>
      </div>

      {errors.stops && !Array.isArray(errors.stops) && (
        <p className="text-sm text-destructive">{errors.stops.message}</p>
      )}

      <div className="space-y-3">
        {fields.map((field, index) => (
          <StopCard
            key={field.id}
            index={index}
            totalStops={fields.length}
            form={form}
            onMoveUp={() => swap(index, index - 1)}
            onMoveDown={() => swap(index, index + 1)}
            onDelete={() => remove(index)}
            canDelete={canDeleteStop}
          />
        ))}
      </div>
    </section>
  );
}
