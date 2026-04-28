import type { CreateOrderInput } from '@/entities/order/model/schemas';
import type { Order } from '@/entities/order/model/types';

export function mapOrderToFormValues(order: Order): Partial<CreateOrderInput> {
  return {
    clientName: order.clientName,
    referenceNumber: order.referenceNumber,
    carrierId: order.carrier.id,
    equipmentType: order.equipmentType,
    loadType: order.loadType,
    rate: order.rate,
    weight: order.weight,
    notes: order.notes ?? '',
    stops: order.stops
      .slice()
      .sort((a, b) => a.order - b.order)
      .map((stop) => ({
        type: stop.type,
        locationName: stop.locationName ?? undefined,
        address: stop.address,
        refNumber: stop.refNumber ?? undefined,
        appointmentType: stop.appointmentType,
        appointmentDate: stop.appointmentDate ?? undefined,
        notes: stop.notes ?? undefined,
      })),
  };
}
