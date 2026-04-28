import type { Carrier } from '@/entities/carrier/model/types';

export const ORDER_STATUS = {
  PENDING: 'pending',
  IN_TRANSIT: 'in_transit',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const;
export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

export const STOP_TYPE = {
  PICK_UP: 'pick_up',
  DROP_OFF: 'drop_off',
  STOP: 'stop',
} as const;
export type StopType = (typeof STOP_TYPE)[keyof typeof STOP_TYPE];

export const EQUIPMENT_TYPE = {
  DRY_VAN: 'dry_van',
  REEFER: 'reefer',
  FLATBED: 'flatbed',
  STEP_DECK: 'step_deck',
} as const;
export type EquipmentType = (typeof EQUIPMENT_TYPE)[keyof typeof EQUIPMENT_TYPE];

export const LOAD_TYPE = {
  FTL: 'ftl',
  LTL: 'ltl',
} as const;
export type LoadType = (typeof LOAD_TYPE)[keyof typeof LOAD_TYPE];

export const APPOINTMENT_TYPE = {
  FCFS: 'fcfs',
  FIXED: 'fixed',
  WINDOW: 'window',
} as const;
export type AppointmentType = (typeof APPOINTMENT_TYPE)[keyof typeof APPOINTMENT_TYPE];

export interface Address {
  city: string;
  state: string;
  zip: string;
}

export interface Stop {
  id: string;
  order: number;
  type: StopType;
  locationName?: string | null;
  address: Address;
  refNumber?: string | null;
  appointmentType: AppointmentType;
  appointmentDate?: string | null;
  notes?: string | null;
}

export interface StatusChange {
  from: OrderStatus | null;
  to: OrderStatus;
  changedAt: string;
  note?: string | null;
}

export interface Order {
  id: string;
  referenceNumber: string;
  status: OrderStatus;
  clientName: string;
  carrier: Carrier;
  equipmentType: EquipmentType;
  loadType: LoadType;
  rate: number;
  weight: number;
  stops: Stop[];
  statusHistory: StatusChange[];
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LocalDraft {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  formData: Partial<CreateOrderFormData>;
}

export interface CreateOrderFormData {
  clientName: string;
  referenceNumber: string;
  carrierId: string;
  equipmentType: EquipmentType;
  loadType: LoadType;
  rate: number;
  weight: number;
  notes: string;
  stops: StopFormData[];
}

export interface StopFormData {
  type: StopType;
  locationName: string;
  address: Address;
  refNumber: string;
  appointmentType: AppointmentType;
  appointmentDate: string;
  notes: string;
}

export interface GetOrdersParams {
  page?: number;
  size?: number;
  sort?: string;
  dir?: 'asc' | 'desc';
  status?: OrderStatus[];
  search?: string;
}
