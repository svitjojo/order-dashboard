import { ORDER_STATUS } from '@/entities/order/model/types';
import type { OrderStatus } from '@/entities/order/model/types';

const TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [ORDER_STATUS.PENDING]: [ORDER_STATUS.IN_TRANSIT, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.IN_TRANSIT]: [ORDER_STATUS.DELIVERED, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.DELIVERED]: [],
  [ORDER_STATUS.CANCELLED]: [],
};

export const getValidTransitions = (status: OrderStatus): OrderStatus[] => TRANSITIONS[status];
export const isTerminalStatus = (status: OrderStatus): boolean =>
  status === ORDER_STATUS.DELIVERED || status === ORDER_STATUS.CANCELLED;
