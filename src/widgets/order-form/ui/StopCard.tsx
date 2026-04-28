import { type UseFormReturn } from 'react-hook-form';
import { ArrowDownIcon, ArrowUpIcon, Trash2Icon } from 'lucide-react';
import { Input } from '@/shared/ui/input';
import { Select } from '@/shared/ui/select';
import { Label } from '@/shared/ui/label';
import { Button } from '@/shared/ui/button';
import type { CreateOrderInput } from '@/entities/order/model/schemas';
import { STOP_TYPE } from '@/entities/order/model/types';

interface StopCardProps {
  index: number;
  totalStops: number;
  form: UseFormReturn<CreateOrderInput>;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  canDelete: boolean;
}

export function StopCard({
  index,
  totalStops,
  form,
  onMoveUp,
  onMoveDown,
  onDelete,
  canDelete,
}: StopCardProps) {
  const {
    register,
    formState: { errors },
  } = form;

  const stopErrors = errors.stops?.[index];

  return (
    <div className="rounded-lg border border-border bg-muted/30 p-4">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-medium">Stop {index + 1}</span>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onMoveUp}
            disabled={index === 0}
            aria-label="Move stop up"
          >
            <ArrowUpIcon />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onMoveDown}
            disabled={index === totalStops - 1}
            aria-label="Move stop down"
          >
            <ArrowDownIcon />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onDelete}
            disabled={!canDelete}
            aria-label="Delete stop"
            className="text-destructive hover:text-destructive"
          >
            <Trash2Icon />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor={`stop-type-${index}`}>
            Type <span className="text-destructive">*</span>
          </Label>
          <Select
            id={`stop-type-${index}`}
            aria-invalid={!!stopErrors?.type}
            {...register(`stops.${index}.type`)}
          >
            <option value={STOP_TYPE.PICK_UP}>Pick Up</option>
            <option value={STOP_TYPE.DROP_OFF}>Drop Off</option>
            <option value={STOP_TYPE.STOP}>Stop</option>
          </Select>
          {stopErrors?.type && (
            <p className="text-sm text-destructive">{stopErrors.type.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={`stop-location-${index}`}>Location Name</Label>
          <Input
            id={`stop-location-${index}`}
            placeholder="Warehouse A"
            {...register(`stops.${index}.locationName`)}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={`stop-ref-${index}`}>Ref #</Label>
          <Input
            id={`stop-ref-${index}`}
            placeholder="REF-001"
            {...register(`stops.${index}.refNumber`)}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={`stop-city-${index}`}>
            City <span className="text-destructive">*</span>
          </Label>
          <Input
            id={`stop-city-${index}`}
            placeholder="Chicago"
            aria-invalid={!!stopErrors?.address?.city}
            {...register(`stops.${index}.address.city`)}
          />
          {stopErrors?.address?.city && (
            <p className="text-sm text-destructive">{stopErrors.address.city.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={`stop-state-${index}`}>
            State <span className="text-destructive">*</span>
          </Label>
          <Input
            id={`stop-state-${index}`}
            placeholder="IL"
            maxLength={2}
            aria-invalid={!!stopErrors?.address?.state}
            {...register(`stops.${index}.address.state`)}
          />
          {stopErrors?.address?.state && (
            <p className="text-sm text-destructive">{stopErrors.address.state.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={`stop-zip-${index}`}>
            ZIP <span className="text-destructive">*</span>
          </Label>
          <Input
            id={`stop-zip-${index}`}
            placeholder="60601"
            maxLength={5}
            aria-invalid={!!stopErrors?.address?.zip}
            {...register(`stops.${index}.address.zip`)}
          />
          {stopErrors?.address?.zip && (
            <p className="text-sm text-destructive">{stopErrors.address.zip.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={`stop-appt-type-${index}`}>
            Appointment Type <span className="text-destructive">*</span>
          </Label>
          <Select
            id={`stop-appt-type-${index}`}
            aria-invalid={!!stopErrors?.appointmentType}
            {...register(`stops.${index}.appointmentType`)}
          >
            <option value="fcfs">FCFS</option>
            <option value="fixed">Fixed</option>
            <option value="window">Window</option>
          </Select>
          {stopErrors?.appointmentType && (
            <p className="text-sm text-destructive">{stopErrors.appointmentType.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={`stop-appt-date-${index}`}>Appointment Date</Label>
          <Input
            id={`stop-appt-date-${index}`}
            type="datetime-local"
            {...register(`stops.${index}.appointmentDate`)}
          />
        </div>

        <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
          <Label htmlFor={`stop-notes-${index}`}>Notes</Label>
          <Input
            id={`stop-notes-${index}`}
            placeholder="Delivery instructions..."
            {...register(`stops.${index}.notes`)}
          />
        </div>
      </div>
    </div>
  );
}
