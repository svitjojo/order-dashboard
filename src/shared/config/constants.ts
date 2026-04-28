import type { AppointmentType, EquipmentType, LoadType, OrderStatus } from '@/entities/order/model/types';

export const MAX_DRAFT_TABS = 5;
export const PAGE_SIZE_OPTIONS = [10, 25, 50] as const;

export const DRAFT_INDEX_KEY = 'draft:index';
export const getDraftKey = (id: string) => `draft:${id}`;
export const MOCK_ORDERS_KEY = 'tms_mock_orders';
export const MOCK_CARRIERS_KEY = 'tms_mock_carriers';

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pending',
  in_transit: 'In Transit',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export const EQUIPMENT_LABELS: Record<EquipmentType, string> = {
  dry_van: 'Dry Van',
  reefer: 'Reefer',
  flatbed: 'Flatbed',
  step_deck: 'Step Deck',
};

export const LOAD_TYPE_LABELS: Record<LoadType, string> = {
  ftl: 'Full Truckload (FTL)',
  ltl: 'Less Than Truckload (LTL)',
};

export const APPOINTMENT_LABELS: Record<AppointmentType, string> = {
  fcfs: 'FCFS',
  fixed: 'Fixed',
  window: 'Window',
};
