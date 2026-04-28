import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import * as handlers from '@/shared/mock/handlers';
import type { GetOrdersParams, OrderStatus } from '@/entities/order/model/types';
import type { GetCarriersParams } from '@/entities/carrier/model/types';
import type { CreateOrderInput, UpdateOrderInput } from '@/entities/order/model/schemas';

export type MockArgs =
  | { method: 'getOrders'; params: GetOrdersParams }
  | { method: 'getOrder'; id: string }
  | { method: 'createOrder'; data: CreateOrderInput }
  | { method: 'updateOrder'; id: string; data: UpdateOrderInput }
  | { method: 'deleteOrder'; id: string }
  | { method: 'updateOrderStatus'; id: string; status: OrderStatus; note?: string }
  | { method: 'getCarriers'; params?: GetCarriersParams };

async function dispatchToHandler(args: MockArgs): Promise<unknown> {
  switch (args.method) {
    case 'getOrders':
      return handlers.getOrders(args.params);
    case 'getOrder':
      return handlers.getOrder(args.id);
    case 'createOrder':
      return handlers.createOrder(args.data);
    case 'updateOrder':
      return handlers.updateOrder(args.id, args.data);
    case 'deleteOrder':
      return handlers.deleteOrder(args.id);
    case 'updateOrderStatus':
      return handlers.updateOrderStatus(args.id, args.status, args.note);
    case 'getCarriers':
      return handlers.getCarriers(args.params);
  }
}

export const mockBaseQuery: BaseQueryFn<MockArgs, unknown, { message: string }> = async (args) => {
  try {
    return { data: await dispatchToHandler(args) };
  } catch (e) {
    return { error: { message: e instanceof Error ? e.message : 'Unknown error' } };
  }
};
