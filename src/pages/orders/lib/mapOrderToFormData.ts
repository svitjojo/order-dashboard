import type { CreateOrderFormData, Order } from '@/entities/order/model/types';

export function mapOrderToFormData(order: Order): CreateOrderFormData {
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
        locationName: stop.locationName ?? '',
        address: stop.address,
        refNumber: stop.refNumber ?? '',
        appointmentType: stop.appointmentType,
        appointmentDate: stop.appointmentDate ?? '',
        notes: stop.notes ?? '',
      })),
  };
}
