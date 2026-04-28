import { v4 as uuidv4 } from 'uuid';
import { simulateNetworkDelay } from '@/shared/lib/delay';
import { loadOrders, persistOrders, loadCarriers } from './db';
import {
  type Order,
  type GetOrdersParams,
  type OrderStatus,
  STOP_TYPE,
} from '@/entities/order/model/types';
import type { Carrier, GetCarriersParams } from '@/entities/carrier/model/types';
import type { PaginatedResponse } from '@/shared/types/pagination';
import type { CreateOrderInput, UpdateOrderInput } from '@/entities/order/model/schemas';

async function executeWithMockBehavior<T>(produceResult: () => T): Promise<T> {
  await simulateNetworkDelay();
  if (Math.random() < 0.05) throw new Error('Network error (mock)');
  return produceResult();
}

function generateOrderReferenceNumber(): string {
  const year = new Date().getFullYear();
  const orders = loadOrders();
  const maxExistingNumber = orders
    .map((order) => {
      const parts = order.referenceNumber.split('-');
      return parseInt(parts[2] ?? '0', 10);
    })
    .reduce((max, current) => Math.max(max, current), 0);
  return `ORD-${year}-${String(maxExistingNumber + 1).padStart(4, '0')}`;
}

export async function getOrders(params: GetOrdersParams): Promise<PaginatedResponse<Order>> {
  return executeWithMockBehavior(() => {
    let orders = loadOrders();

    if (params.status && params.status.length > 0) {
      orders = orders.filter((order) => params.status!.includes(order.status));
    }

    if (params.search) {
      const searchQuery = params.search.toLowerCase();
      orders = orders.filter(
        (order) =>
          order.clientName.toLowerCase().includes(searchQuery) ||
          order.referenceNumber.toLowerCase().includes(searchQuery) ||
          order.carrier.name.toLowerCase().includes(searchQuery),
      );
    }

    const sortField = params.sort ?? 'createdAt';
    const sortDirection = params.dir ?? 'desc';

    orders = [...orders].sort((orderA, orderB) => {
      let valueA: string | number;
      let valueB: string | number;

      switch (sortField) {
        case 'pickupDate': {
          const dateA = orderA.stops.find(
            (stop) => stop.type === STOP_TYPE.PICK_UP,
          )?.appointmentDate;
          const dateB = orderB.stops.find(
            (stop) => stop.type === STOP_TYPE.PICK_UP,
          )?.appointmentDate;
          valueA = dateA ? new Date(dateA).getTime() : 0;
          valueB = dateB ? new Date(dateB).getTime() : 0;
          break;
        }
        case 'rate':
          valueA = orderA.rate;
          valueB = orderB.rate;
          break;
        case 'referenceNumber':
          valueA = orderA.referenceNumber;
          valueB = orderB.referenceNumber;
          break;
        case 'clientName':
          valueA = orderA.clientName;
          valueB = orderB.clientName;
          break;
        case 'status':
          valueA = orderA.status;
          valueB = orderB.status;
          break;
        default:
          valueA = orderA.createdAt;
          valueB = orderB.createdAt;
      }

      if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    const currentPage = params.page ?? 1;
    const pageSize = params.size ?? 25;
    const totalOrders = orders.length;
    const totalPages = Math.ceil(totalOrders / pageSize);
    const sliceStart = (currentPage - 1) * pageSize;
    const pageData = orders.slice(sliceStart, sliceStart + pageSize);

    return { data: pageData, total: totalOrders, page: currentPage, size: pageSize, totalPages };
  });
}

export async function getOrder(id: string): Promise<Order> {
  return executeWithMockBehavior(() => {
    const orders = loadOrders();
    const order = orders.find((order) => order.id === id);
    if (!order) throw new Error(`Order ${id} not found`);
    return order;
  });
}

export async function createOrder(data: CreateOrderInput): Promise<Order> {
  return executeWithMockBehavior(() => {
    const carriers = loadCarriers();
    const carrier = carriers.find((carrier) => carrier.id === data.carrierId);
    if (!carrier) throw new Error('Carrier not found');

    const orders = loadOrders();
    const now = new Date().toISOString();
    const newOrderId = uuidv4();

    const newOrder: Order = {
      id: newOrderId,
      referenceNumber: data.referenceNumber?.trim() || generateOrderReferenceNumber(),
      status: 'pending',
      clientName: data.clientName,
      carrier: carrier,
      equipmentType: data.equipmentType,
      loadType: data.loadType,
      rate: data.rate,
      weight: data.weight,
      notes: data.notes ?? null,
      createdAt: now,
      updatedAt: now,
      stops: data.stops.map((stopData, index) => ({
        id: uuidv4(),
        order: index,
        type: stopData.type,
        address: stopData.address,
        locationName: stopData.locationName ?? null,
        refNumber: stopData.refNumber ?? null,
        appointmentType: stopData.appointmentType,
        appointmentDate: stopData.appointmentDate ?? null,
        notes: stopData.notes ?? null,
      })),
      statusHistory: [
        {
          from: null,
          to: 'pending' as const,
          changedAt: now,
          note: null,
        },
      ],
    };

    persistOrders([...orders, newOrder]);
    return newOrder;
  });
}

export async function updateOrder(id: string, data: UpdateOrderInput): Promise<Order> {
  return executeWithMockBehavior(() => {
    const orders = loadOrders();
    const orderIndex = orders.findIndex((order) => order.id === id);
    if (orderIndex === -1) throw new Error(`Order ${id} not found`);

    const existingOrder = orders[orderIndex]!;
    const carriers = loadCarriers();
    const updatedCarrierId = data.carrierId ?? existingOrder.carrier.id;
    const matchedCarrier = carriers.find((carrier) => carrier.id === updatedCarrierId);
    const updatedCarrier = matchedCarrier ?? existingOrder.carrier;

    const now = new Date().toISOString();
    const updatedOrder: Order = {
      ...existingOrder,
      clientName: data.clientName ?? existingOrder.clientName,
      referenceNumber: data.referenceNumber?.trim() || existingOrder.referenceNumber,
      carrier: updatedCarrier,
      equipmentType: data.equipmentType ?? existingOrder.equipmentType,
      loadType: data.loadType ?? existingOrder.loadType,
      rate: data.rate ?? existingOrder.rate,
      weight: data.weight ?? existingOrder.weight,
      notes: data.notes !== undefined ? (data.notes ?? null) : existingOrder.notes,
      stops: data.stops
        ? data.stops.map((stopData, index) => ({
            id: uuidv4(),
            order: index,
            type: stopData.type,
            address: stopData.address,
            locationName: stopData.locationName ?? null,
            refNumber: stopData.refNumber ?? null,
            appointmentType: stopData.appointmentType,
            appointmentDate: stopData.appointmentDate ?? null,
            notes: stopData.notes ?? null,
          }))
        : existingOrder.stops,
      updatedAt: now,
    };

    const updatedOrders = [...orders];
    updatedOrders[orderIndex] = updatedOrder;
    persistOrders(updatedOrders);
    return updatedOrder;
  });
}

export async function deleteOrder(id: string): Promise<void> {
  await executeWithMockBehavior(() => {
    const orders = loadOrders();
    const order = orders.find((order) => order.id === id);
    if (!order) throw new Error(`Order ${id} not found`);
    if (order.status !== 'pending') throw new Error('Only pending orders can be deleted');
    persistOrders(orders.filter((order) => order.id !== id));
  });
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  note?: string,
): Promise<Order> {
  return executeWithMockBehavior(() => {
    const orders = loadOrders();
    const orderIndex = orders.findIndex((order) => order.id === id);
    if (orderIndex === -1) throw new Error(`Order ${id} not found`);

    const existingOrder = orders[orderIndex]!;
    const now = new Date().toISOString();
    const updatedOrder: Order = {
      ...existingOrder,
      status,
      statusHistory: [
        ...existingOrder.statusHistory,
        { from: existingOrder.status, to: status, changedAt: now, note: note ?? null },
      ],
      updatedAt: now,
    };

    const updatedOrders = [...orders];
    updatedOrders[orderIndex] = updatedOrder;
    persistOrders(updatedOrders);
    return updatedOrder;
  });
}

export async function getCarriers(params?: GetCarriersParams): Promise<Carrier[]> {
  return executeWithMockBehavior(() => {
    let carriers = loadCarriers();
    if (params?.search) {
      const searchQuery = params.search.toLowerCase();
      carriers = carriers.filter((carrier) => carrier.name.toLowerCase().includes(searchQuery));
    }
    return carriers;
  });
}
