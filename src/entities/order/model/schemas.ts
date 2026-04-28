import { z } from 'zod';
import { ORDER_STATUS, STOP_TYPE, EQUIPMENT_TYPE, LOAD_TYPE, APPOINTMENT_TYPE } from './types';

const stopTypeValues = Object.values(STOP_TYPE);
const equipmentTypeValues = Object.values(EQUIPMENT_TYPE);
const loadTypeValues = Object.values(LOAD_TYPE);
const appointmentTypeValues = Object.values(APPOINTMENT_TYPE);
const orderStatusValues = Object.values(ORDER_STATUS);

export const addressSchema = z.object({
  city: z.string().min(1, 'City is required'),
  state: z.string().length(2, 'State must be a 2-letter code'),
  zip: z.string().regex(/^\d{5}$/, 'ZIP must be 5 digits'),
});

export const stopSchema = z.object({
  type: z.enum(stopTypeValues, { error: 'Stop type is required' }),
  address: addressSchema,
  appointmentType: z.enum(appointmentTypeValues, { error: 'Appointment type is required' }),
  locationName: z.string().nullish(),
  refNumber: z.string().nullish(),
  appointmentDate: z.string().nullish(),
  notes: z.string().nullish(),
});

const orderObjectSchema = z.object({
  clientName: z.string().min(1, 'Client name is required'),
  referenceNumber: z.string().optional(),
  carrierId: z.string().min(1, 'Carrier is required'),
  equipmentType: z.enum(equipmentTypeValues, { error: 'Equipment type is required' }),
  loadType: z.enum(loadTypeValues, { error: 'Load type is required' }),
  rate: z.number({ error: 'Rate is required' }).gt(0, 'Rate must be greater than 0'),
  weight: z.number({ error: 'Weight is required' }).gt(0, 'Weight must be greater than 0'),
  notes: z.string().nullish(),
  stops: z
    .array(stopSchema)
    .min(2, 'At least 2 stops are required')
    .max(5, 'Maximum 5 stops allowed'),
});

export const createOrderSchema = orderObjectSchema.superRefine((data, ctx) => {
  const pickups = data.stops.filter((s) => s.type === 'pick_up');
  const dropoffs = data.stops.filter((s) => s.type === 'drop_off');
  if (pickups.length !== 1)
    ctx.addIssue({ code: 'custom', path: ['stops'], message: 'Exactly one pick up stop required' });
  if (dropoffs.length !== 1)
    ctx.addIssue({
      code: 'custom',
      path: ['stops'],
      message: 'Exactly one drop off stop required',
    });
  const pickupIdx = data.stops.findIndex((s) => s.type === 'pick_up');
  const dropoffIdx = data.stops.findIndex((s) => s.type === 'drop_off');
  if (pickupIdx !== -1 && dropoffIdx !== -1 && pickupIdx > dropoffIdx)
    ctx.addIssue({
      code: 'custom',
      path: ['stops'],
      message: 'Pick up must come before drop off',
    });
});

export const updateOrderSchema = orderObjectSchema.partial();

export const statusChangeSchema = z.object({
  to: z.enum(orderStatusValues, { error: 'Invalid status' }),
  note: z.string().nullish(),
});

export const cancelOrderSchema = z.object({
  note: z.string().min(1, 'Cancellation reason is required'),
});

export type AddressInput = z.infer<typeof addressSchema>;
export type StopInput = z.infer<typeof stopSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;
export type StatusChangeInput = z.infer<typeof statusChangeSchema>;
export type CancelOrderInput = z.infer<typeof cancelOrderSchema>;
