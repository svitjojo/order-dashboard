import { MOCK_ORDERS_KEY, MOCK_CARRIERS_KEY } from '@/shared/config/constants';
import type { Order } from '@/entities/order/model/types';
import type { Carrier } from '@/entities/carrier/model/types';
import { seedOrders, SEED_CARRIERS } from './seed';

export function loadOrders(): Order[] {
  const raw = localStorage.getItem(MOCK_ORDERS_KEY);
  if (!raw) {
    const orders = seedOrders();
    persistOrders(orders);
    return orders;
  }
  try {
    return JSON.parse(raw) as Order[];
  } catch {
    const orders = seedOrders();
    persistOrders(orders);
    return orders;
  }
}

export function persistOrders(orders: Order[]): void {
  localStorage.setItem(MOCK_ORDERS_KEY, JSON.stringify(orders));
}

export function loadCarriers(): Carrier[] {
  const raw = localStorage.getItem(MOCK_CARRIERS_KEY);
  if (!raw) {
    persistCarriers(SEED_CARRIERS);
    return SEED_CARRIERS;
  }
  try {
    return JSON.parse(raw) as Carrier[];
  } catch {
    return SEED_CARRIERS;
  }
}

export function persistCarriers(carriers: Carrier[]): void {
  localStorage.setItem(MOCK_CARRIERS_KEY, JSON.stringify(carriers));
}
