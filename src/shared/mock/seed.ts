import type { Order, OrderStatus, EquipmentType, LoadType, StopType, AppointmentType } from '@/entities/order/model/types';
import type { Carrier } from '@/entities/carrier/model/types';

type StopSpecification = {
  type: StopType;
  city: string;
  state: string;
  zip: string;
  appointmentType: AppointmentType;
  date: string | null;
  locationName?: string;
};

type StatusHistorySpecification = { from: OrderStatus | null; to: OrderStatus; changedAt: string; note?: string };

function buildSeedOrder(
  id: string,
  referenceNumber: string,
  status: OrderStatus,
  clientName: string,
  carrier: Carrier,
  equipmentType: EquipmentType,
  loadType: LoadType,
  rate: number,
  weight: number,
  stopSpecifications: StopSpecification[],
  statusHistorySpecifications: StatusHistorySpecification[],
  createdAt: string,
  notes?: string,
): Order {
  return {
    id,
    referenceNumber,
    status,
    clientName,
    carrier,
    equipmentType,
    loadType,
    rate,
    weight,
    notes: notes ?? null,
    createdAt,
    updatedAt: statusHistorySpecifications.at(-1)?.changedAt ?? createdAt,
    stops: stopSpecifications.map((stopSpec, index) => ({
      id: `${id}-s${index}`,
      order: index,
      type: stopSpec.type,
      address: { city: stopSpec.city, state: stopSpec.state, zip: stopSpec.zip },
      appointmentType: stopSpec.appointmentType,
      appointmentDate: stopSpec.date,
      locationName: stopSpec.locationName ?? null,
      refNumber: null,
      notes: null,
    })),
    statusHistory: statusHistorySpecifications.map((historyEntry) => ({
      from: historyEntry.from,
      to: historyEntry.to,
      changedAt: historyEntry.changedAt,
      note: historyEntry.note ?? null,
    })),
  };
}

function makePickupStop(city: string, state: string, zip: string, date: string | null): StopSpecification {
  return { type: 'pick_up', city, state, zip, appointmentType: 'fixed', date };
}

function makeDropoffStop(city: string, state: string, zip: string, date: string | null): StopSpecification {
  return { type: 'drop_off', city, state, zip, appointmentType: 'fixed', date };
}

function makeStatusHistoryEntry(from: OrderStatus | null, to: OrderStatus, changedAt: string, note?: string): StatusHistorySpecification {
  return { from, to, changedAt, note };
}

export const SEED_CARRIERS: Carrier[] = [
  { id: 'c01', name: 'Swift Transport',         mcNumber: 'MC-123456', phone: '(312) 555-0101', rating: 4.2 },
  { id: 'c02', name: 'Heartland Freight',        mcNumber: 'MC-234567', phone: '(214) 555-0102', rating: 3.8 },
  { id: 'c03', name: 'Pacific Haulers',          mcNumber: 'MC-345678', phone: '(206) 555-0103', rating: 4.7 },
  { id: 'c04', name: 'Eagle Logistics',          mcNumber: 'MC-456789', phone: '(303) 555-0104', rating: 3.5 },
  { id: 'c05', name: 'Atlas Carriers',           mcNumber: 'MC-567890', phone: '(305) 555-0105', rating: 4.9 },
  { id: 'c06', name: 'Blue Ridge Transport',     mcNumber: 'MC-678901', phone: '(704) 555-0106', rating: 4.1 },
  { id: 'c07', name: 'Midwest Express',          mcNumber: 'MC-789012', phone: '(612) 555-0107', rating: 3.9 },
  { id: 'c08', name: 'Southern Star Freight',    mcNumber: 'MC-890123', phone: '(615) 555-0108', rating: 4.4 },
  { id: 'c09', name: 'Rocky Mountain Haulers',   mcNumber: 'MC-901234', phone: '(720) 555-0109', rating: 4.6 },
  { id: 'c10', name: 'Coastal Shipping Co.',     mcNumber: 'MC-112345', phone: '(415) 555-0110', rating: 3.2 },
  { id: 'c11', name: 'Lone Star Logistics',      mcNumber: 'MC-223456', phone: '(972) 555-0111', rating: 4.3 },
  { id: 'c12', name: 'Great Lakes Transport',    mcNumber: 'MC-334567', phone: '(317) 555-0112', rating: 3.7 },
  { id: 'c13', name: 'Gulf Coast Carriers',      mcNumber: 'MC-445678', phone: '(504) 555-0113', rating: 4.0 },
  { id: 'c14', name: 'New England Freight',      mcNumber: 'MC-556789', phone: '(617) 555-0114', rating: 4.5 },
  { id: 'c15', name: 'Desert Sun Transport',     mcNumber: 'MC-667890', phone: '(480) 555-0115', rating: 3.6 },
];

function getCarrierByIndex(index: number): Carrier {
  return SEED_CARRIERS[index] as Carrier;
}

export function seedOrders(): Order[] {
  return [
    // ── PENDING (8) ──────────────────────────────────────────────────────────
    buildSeedOrder('ord-001', 'ORD-2026-0001', 'pending', 'Apex Distribution Co.',
      getCarrierByIndex(0), 'dry_van', 'ftl', 3200, 35000,
      [makePickupStop('Chicago',   'IL', '60601', '2026-05-05T08:00:00.000Z'),
       makeDropoffStop('New York', 'NY', '10001', '2026-05-07T14:00:00.000Z')],
      [makeStatusHistoryEntry(null, 'pending', '2026-04-15T09:00:00.000Z'),
       makeStatusHistoryEntry('pending', 'pending', '2026-04-15T09:05:00.000Z', 'Dispatched to carrier')],
      '2026-04-15T09:00:00.000Z'),

    buildSeedOrder('ord-002', 'ORD-2026-0002', 'pending', 'Nexus Industrial Supply',
      getCarrierByIndex(1), 'flatbed', 'ftl', 1800, 28000,
      [makePickupStop('Dallas',  'TX', '75201', '2026-05-08T07:00:00.000Z'),
       makeDropoffStop('Houston','TX', '77001', '2026-05-09T12:00:00.000Z')],
      [makeStatusHistoryEntry(null, 'pending', '2026-04-18T10:00:00.000Z'),
       makeStatusHistoryEntry('pending', 'pending', '2026-04-18T10:05:00.000Z', 'Dispatched to carrier')],
      '2026-04-18T10:00:00.000Z'),

    buildSeedOrder('ord-003', 'ORD-2026-0003', 'pending', 'Summit Retail Group',
      getCarrierByIndex(2), 'reefer', 'ltl', 4500, 22000,
      [makePickupStop('Seattle',   'WA', '98101', '2026-05-10T06:00:00.000Z'),
       makeDropoffStop('Portland', 'OR', '97201', '2026-05-11T10:00:00.000Z'),
       makeDropoffStop('Denver',   'CO', '80201', '2026-05-13T16:00:00.000Z')],
      [makeStatusHistoryEntry(null, 'pending', '2026-04-20T11:00:00.000Z'),
       makeStatusHistoryEntry('pending', 'pending', '2026-04-20T11:05:00.000Z', 'Dispatched to carrier')],
      '2026-04-20T11:00:00.000Z'),

    buildSeedOrder('ord-004', 'ORD-2026-0004', 'pending', 'Horizon Manufacturing',
      getCarrierByIndex(3), 'dry_van', 'ltl', 2100, 15000,
      [makePickupStop('Atlanta', 'GA', '30301', '2026-05-12T08:00:00.000Z'),
       makeDropoffStop('Miami',  'FL', '33101', '2026-05-14T17:00:00.000Z')],
      [makeStatusHistoryEntry(null, 'pending', '2026-04-22T08:30:00.000Z'),
       makeStatusHistoryEntry('pending', 'pending', '2026-04-22T08:35:00.000Z', 'Dispatched to carrier')],
      '2026-04-22T08:30:00.000Z'),

    buildSeedOrder('ord-005', 'ORD-2026-0005', 'pending', 'Pinnacle Consumer Goods',
      getCarrierByIndex(4), 'dry_van', 'ftl', 1500, 40000,
      [makePickupStop('Los Angeles', 'CA', '90001', '2026-05-06T07:00:00.000Z'),
       makeDropoffStop('Phoenix',    'AZ', '85001', '2026-05-07T15:00:00.000Z')],
      [makeStatusHistoryEntry(null, 'pending', '2026-04-23T09:15:00.000Z'),
       makeStatusHistoryEntry('pending', 'pending', '2026-04-23T09:20:00.000Z', 'Dispatched to carrier')],
      '2026-04-23T09:15:00.000Z'),

    buildSeedOrder('ord-006', 'ORD-2026-0006', 'pending', 'Coastal Imports Ltd.',
      getCarrierByIndex(5), 'reefer', 'ltl', 1200, 12000,
      [makePickupStop('San Francisco', 'CA', '94101', '2026-05-07T06:30:00.000Z'),
       makeDropoffStop('Los Angeles',  'CA', '90001', '2026-05-08T14:00:00.000Z')],
      [makeStatusHistoryEntry(null, 'pending', '2026-04-24T10:00:00.000Z'),
       makeStatusHistoryEntry('pending', 'pending', '2026-04-24T10:05:00.000Z', 'Dispatched to carrier')],
      '2026-04-24T10:00:00.000Z'),

    buildSeedOrder('ord-007', 'ORD-2026-0007', 'pending', 'Inland Empire Wholesale',
      getCarrierByIndex(6), 'flatbed', 'ftl', 2800, 38000,
      [makePickupStop('Chicago',       'IL', '60601', '2026-05-09T07:00:00.000Z'),
       makeDropoffStop('Indianapolis', 'IN', '46201', '2026-05-10T11:00:00.000Z'),
       makeDropoffStop('St. Louis',    'MO', '63101', '2026-05-11T16:00:00.000Z')],
      [makeStatusHistoryEntry(null, 'pending', '2026-04-25T08:00:00.000Z'),
       makeStatusHistoryEntry('pending', 'pending', '2026-04-25T08:05:00.000Z', 'Dispatched to carrier')],
      '2026-04-25T08:00:00.000Z'),

    buildSeedOrder('ord-008', 'ORD-2026-0008', 'pending', 'Great Plains Distributors',
      getCarrierByIndex(7), 'dry_van', 'ltl', 1900, 18000,
      [makePickupStop('Minneapolis', 'MN', '55401', '2026-05-14T08:00:00.000Z'),
       makeDropoffStop('Chicago',    'IL', '60601', '2026-05-15T18:00:00.000Z')],
      [makeStatusHistoryEntry(null, 'pending', '2026-04-26T09:00:00.000Z'),
       makeStatusHistoryEntry('pending', 'pending', '2026-04-26T09:05:00.000Z', 'Dispatched to carrier')],
      '2026-04-26T09:00:00.000Z'),

    // ── IN TRANSIT (8) ───────────────────────────────────────────────────────
    buildSeedOrder('ord-009', 'ORD-2026-0009', 'in_transit', 'Northern Steel Works',
      getCarrierByIndex(8), 'flatbed', 'ftl', 3500, 42000,
      [makePickupStop('Chicago',  'IL', '60601', '2026-04-20T07:00:00.000Z'),
       makeDropoffStop('Detroit', 'MI', '48201', '2026-04-30T16:00:00.000Z')],
      [makeStatusHistoryEntry(null, 'pending',    '2026-04-10T09:00:00.000Z'),
       makeStatusHistoryEntry('pending', 'in_transit', '2026-04-20T07:30:00.000Z')],
      '2026-04-10T09:00:00.000Z'),

    buildSeedOrder('ord-010', 'ORD-2026-0010', 'in_transit', 'Eastern Produce Co.',
      getCarrierByIndex(9), 'reefer', 'ltl', 1600, 16000,
      [makePickupStop('Atlanta',    'GA', '30301', '2026-04-22T06:00:00.000Z'),
       makeDropoffStop('Charlotte', 'NC', '28201', '2026-04-29T14:00:00.000Z')],
      [makeStatusHistoryEntry(null, 'pending',    '2026-04-12T10:00:00.000Z'),
       makeStatusHistoryEntry('pending', 'in_transit', '2026-04-22T06:30:00.000Z')],
      '2026-04-12T10:00:00.000Z'),

    buildSeedOrder('ord-011', 'ORD-2026-0011', 'in_transit', 'Southland Foods Inc.',
      getCarrierByIndex(10), 'reefer', 'ftl', 2200, 30000,
      [makePickupStop('Dallas',         'TX', '75201', '2026-04-21T07:00:00.000Z'),
       makeDropoffStop('Oklahoma City', 'OK', '73101', '2026-04-25T12:00:00.000Z'),
       makeDropoffStop('Memphis',       'TN', '38101', '2026-04-30T17:00:00.000Z')],
      [makeStatusHistoryEntry(null, 'pending',    '2026-04-14T08:00:00.000Z'),
       makeStatusHistoryEntry('pending', 'in_transit', '2026-04-21T07:30:00.000Z')],
      '2026-04-14T08:00:00.000Z'),

    buildSeedOrder('ord-012', 'ORD-2026-0012', 'in_transit', 'Mountain West Logistics',
      getCarrierByIndex(11), 'dry_van', 'ltl', 2400, 20000,
      [makePickupStop('Denver',    'CO', '80201', '2026-04-23T08:00:00.000Z'),
       makeDropoffStop('Las Vegas','NV', '89101', '2026-05-01T14:00:00.000Z')],
      [makeStatusHistoryEntry(null, 'pending',    '2026-04-15T09:00:00.000Z'),
       makeStatusHistoryEntry('pending', 'in_transit', '2026-04-23T08:30:00.000Z')],
      '2026-04-15T09:00:00.000Z'),

    buildSeedOrder('ord-013', 'ORD-2026-0013', 'in_transit', 'Pacific Rim Trading',
      getCarrierByIndex(12), 'step_deck', 'ftl', 5200, 36000,
      [makePickupStop('Seattle',        'WA', '98101', '2026-04-24T06:00:00.000Z'),
       makeDropoffStop('Portland',      'OR', '97201', '2026-04-26T12:00:00.000Z'),
       makeDropoffStop('Sacramento',    'CA', '95814', '2026-04-29T16:00:00.000Z'),
       makeDropoffStop('San Francisco', 'CA', '94101', '2026-05-02T10:00:00.000Z')],
      [makeStatusHistoryEntry(null, 'pending',    '2026-04-16T10:00:00.000Z'),
       makeStatusHistoryEntry('pending', 'in_transit', '2026-04-24T06:30:00.000Z')],
      '2026-04-16T10:00:00.000Z'),

    buildSeedOrder('ord-014', 'ORD-2026-0014', 'in_transit', 'Central Valley Farms',
      getCarrierByIndex(13), 'reefer', 'ltl', 1700, 14000,
      [makePickupStop('Los Angeles', 'CA', '90001', '2026-04-25T07:00:00.000Z'),
       makeDropoffStop('Las Vegas',  'NV', '89101', '2026-04-27T13:00:00.000Z'),
       makeDropoffStop('Phoenix',    'AZ', '85001', '2026-04-30T17:00:00.000Z')],
      [makeStatusHistoryEntry(null, 'pending',    '2026-04-17T08:30:00.000Z'),
       makeStatusHistoryEntry('pending', 'in_transit', '2026-04-25T07:30:00.000Z')],
      '2026-04-17T08:30:00.000Z'),

    buildSeedOrder('ord-015', 'ORD-2026-0015', 'in_transit', 'Gulf Coast Petroleum',
      getCarrierByIndex(14), 'step_deck', 'ftl', 6800, 44000,
      [makePickupStop('Houston', 'TX', '77001', '2026-04-24T05:00:00.000Z'),
       makeDropoffStop('Miami',  'FL', '33101', '2026-05-03T18:00:00.000Z')],
      [makeStatusHistoryEntry(null, 'pending',    '2026-04-18T09:00:00.000Z'),
       makeStatusHistoryEntry('pending', 'in_transit', '2026-04-24T05:30:00.000Z')],
      '2026-04-18T09:00:00.000Z',
      'Oversized heavy haul — pilot car required'),

    buildSeedOrder('ord-016', 'ORD-2026-0016', 'in_transit', 'Apex Distribution Co.',
      getCarrierByIndex(0), 'dry_van', 'ltl', 1400, 11000,
      [makePickupStop('Nashville',  'TN', '37201', '2026-04-26T08:00:00.000Z'),
       makeDropoffStop('Louisville','KY', '40202', '2026-04-28T12:00:00.000Z'),
       makeDropoffStop('Atlanta',   'GA', '30301', '2026-05-01T16:00:00.000Z')],
      [makeStatusHistoryEntry(null, 'pending',    '2026-04-19T10:00:00.000Z'),
       makeStatusHistoryEntry('pending', 'in_transit', '2026-04-26T08:30:00.000Z')],
      '2026-04-19T10:00:00.000Z'),

    // ── DELIVERED (8) ────────────────────────────────────────────────────────
    buildSeedOrder('ord-017', 'ORD-2026-0017', 'delivered', 'Nexus Industrial Supply',
      getCarrierByIndex(1), 'dry_van', 'ltl', 1100, 9000,
      [makePickupStop('New York',   'NY', '10001', '2026-03-05T08:00:00.000Z'),
       makeDropoffStop('Baltimore', 'MD', '21201', '2026-03-06T14:00:00.000Z')],
      [makeStatusHistoryEntry(null, 'pending',    '2026-02-26T09:00:00.000Z'),
       makeStatusHistoryEntry('pending', 'in_transit', '2026-03-05T08:30:00.000Z'),
       makeStatusHistoryEntry('in_transit', 'delivered',  '2026-03-08T11:00:00.000Z')],
      '2026-02-26T09:00:00.000Z'),

    buildSeedOrder('ord-018', 'ORD-2026-0018', 'delivered', 'Summit Retail Group',
      getCarrierByIndex(2), 'dry_van', 'ftl', 2600, 32000,
      [makePickupStop('Chicago',      'IL', '60601', '2026-03-10T07:00:00.000Z'),
       makeDropoffStop('Milwaukee',   'WI', '53201', '2026-03-11T11:00:00.000Z'),
       makeDropoffStop('Minneapolis', 'MN', '55401', '2026-03-14T16:00:00.000Z')],
      [makeStatusHistoryEntry(null, 'pending',    '2026-03-01T10:00:00.000Z'),
       makeStatusHistoryEntry('pending', 'in_transit', '2026-03-10T07:30:00.000Z'),
       makeStatusHistoryEntry('in_transit', 'delivered',  '2026-03-14T17:00:00.000Z')],
      '2026-03-01T10:00:00.000Z'),

    buildSeedOrder('ord-019', 'ORD-2026-0019', 'delivered', 'Horizon Manufacturing',
      getCarrierByIndex(3), 'flatbed', 'ltl', 1300, 25000,
      [makePickupStop('Seattle',  'WA', '98101', '2026-03-12T06:00:00.000Z'),
       makeDropoffStop('Portland','OR', '97201', '2026-03-15T14:00:00.000Z')],
      [makeStatusHistoryEntry(null, 'pending',    '2026-03-05T09:00:00.000Z'),
       makeStatusHistoryEntry('pending', 'in_transit', '2026-03-12T06:30:00.000Z'),
       makeStatusHistoryEntry('in_transit', 'delivered',  '2026-03-15T15:00:00.000Z')],
      '2026-03-05T09:00:00.000Z'),

    buildSeedOrder('ord-020', 'ORD-2026-0020', 'delivered', 'Pinnacle Consumer Goods',
      getCarrierByIndex(4), 'dry_van', 'ftl', 3100, 39000,
      [makePickupStop('Dallas',     'TX', '75201', '2026-03-15T08:00:00.000Z'),
       makeDropoffStop('St. Louis', 'MO', '63101', '2026-03-19T16:00:00.000Z')],
      [makeStatusHistoryEntry(null, 'pending',    '2026-03-08T08:00:00.000Z'),
       makeStatusHistoryEntry('pending', 'in_transit', '2026-03-15T08:30:00.000Z'),
       makeStatusHistoryEntry('in_transit', 'delivered',  '2026-03-19T17:00:00.000Z')],
      '2026-03-08T08:00:00.000Z'),

    buildSeedOrder('ord-021', 'ORD-2026-0021', 'delivered', 'Coastal Imports Ltd.',
      getCarrierByIndex(5), 'reefer', 'ltl', 2300, 13000,
      [makePickupStop('Miami',          'FL', '33101', '2026-03-18T07:00:00.000Z'),
       makeDropoffStop('Jacksonville',  'FL', '32201', '2026-03-19T12:00:00.000Z'),
       makeDropoffStop('Atlanta',       'GA', '30301', '2026-03-22T17:00:00.000Z')],
      [makeStatusHistoryEntry(null, 'pending',    '2026-03-12T09:00:00.000Z'),
       makeStatusHistoryEntry('pending', 'in_transit', '2026-03-18T07:30:00.000Z'),
       makeStatusHistoryEntry('in_transit', 'delivered',  '2026-03-22T18:00:00.000Z')],
      '2026-03-12T09:00:00.000Z'),

    buildSeedOrder('ord-022', 'ORD-2026-0022', 'delivered', 'Inland Empire Wholesale',
      getCarrierByIndex(6), 'dry_van', 'ftl', 2700, 37000,
      [makePickupStop('Denver',         'CO', '80201', '2026-03-22T08:00:00.000Z'),
       makeDropoffStop('Oklahoma City', 'OK', '73101', '2026-03-26T17:00:00.000Z')],
      [makeStatusHistoryEntry(null, 'pending',    '2026-03-15T10:00:00.000Z'),
       makeStatusHistoryEntry('pending', 'in_transit', '2026-03-22T08:30:00.000Z'),
       makeStatusHistoryEntry('in_transit', 'delivered',  '2026-03-26T18:00:00.000Z')],
      '2026-03-15T10:00:00.000Z'),

    buildSeedOrder('ord-023', 'ORD-2026-0023', 'delivered', 'Great Plains Distributors',
      getCarrierByIndex(7), 'step_deck', 'ftl', 4800, 41000,
      [makePickupStop('Los Angeles',    'CA', '90001', '2026-03-25T06:00:00.000Z'),
       makeDropoffStop('Las Vegas',     'NV', '89101', '2026-03-27T14:00:00.000Z'),
       makeDropoffStop('Salt Lake City','UT', '84101', '2026-03-29T16:00:00.000Z'),
       makeDropoffStop('Denver',        'CO', '80201', '2026-03-30T18:00:00.000Z')],
      [makeStatusHistoryEntry(null, 'pending',    '2026-03-18T09:00:00.000Z'),
       makeStatusHistoryEntry('pending', 'in_transit', '2026-03-25T06:30:00.000Z'),
       makeStatusHistoryEntry('in_transit', 'delivered',  '2026-03-30T19:00:00.000Z')],
      '2026-03-18T09:00:00.000Z'),

    buildSeedOrder('ord-024', 'ORD-2026-0024', 'delivered', 'Northern Steel Works',
      getCarrierByIndex(8), 'step_deck', 'ftl', 7200, 45000,
      [makePickupStop('Houston',   'TX', '77001', '2026-03-28T05:00:00.000Z'),
       makeDropoffStop('Nashville','TN', '37201', '2026-04-02T18:00:00.000Z')],
      [makeStatusHistoryEntry(null, 'pending',    '2026-03-22T08:00:00.000Z'),
       makeStatusHistoryEntry('pending', 'in_transit', '2026-03-28T05:30:00.000Z'),
       makeStatusHistoryEntry('in_transit', 'delivered',  '2026-04-02T19:00:00.000Z')],
      '2026-03-22T08:00:00.000Z',
      'Heavy haul permit obtained — max 105,500 lbs'),

    // ── CANCELLED (8) ────────────────────────────────────────────────────────
    buildSeedOrder('ord-025', 'ORD-2026-0025', 'cancelled', 'Eastern Produce Co.',
      getCarrierByIndex(9), 'reefer', 'ltl', 1500, 10000,
      [makePickupStop('Chicago',       'IL', '60601', '2026-03-18T08:00:00.000Z'),
       makeDropoffStop('Indianapolis', 'IN', '46201', '2026-03-19T14:00:00.000Z')],
      [makeStatusHistoryEntry(null, 'pending',   '2026-03-10T09:00:00.000Z'),
       makeStatusHistoryEntry('pending', 'cancelled', '2026-03-15T11:00:00.000Z', 'Customer cancelled order — product recall')],
      '2026-03-10T09:00:00.000Z'),

    buildSeedOrder('ord-026', 'ORD-2026-0026', 'cancelled', 'Southland Foods Inc.',
      getCarrierByIndex(10), 'dry_van', 'ltl', 1800, 17000,
      [makePickupStop('Atlanta',    'GA', '30301', '2026-03-28T07:00:00.000Z'),
       makeDropoffStop('Charlotte', 'NC', '28201', '2026-03-29T14:00:00.000Z')],
      [makeStatusHistoryEntry(null, 'pending',   '2026-03-20T10:00:00.000Z'),
       makeStatusHistoryEntry('pending', 'cancelled', '2026-03-25T09:00:00.000Z', 'Rate dispute — carrier rejected load')],
      '2026-03-20T10:00:00.000Z'),

    buildSeedOrder('ord-027', 'ORD-2026-0027', 'cancelled', 'Mountain West Logistics',
      getCarrierByIndex(11), 'dry_van', 'ftl', 3800, 34000,
      [makePickupStop('San Francisco', 'CA', '94101', '2026-04-02T08:00:00.000Z'),
       makeDropoffStop('Denver',       'CO', '80201', '2026-04-04T18:00:00.000Z')],
      [makeStatusHistoryEntry(null, 'pending',   '2026-03-25T11:00:00.000Z'),
       makeStatusHistoryEntry('pending', 'cancelled', '2026-03-30T14:00:00.000Z', 'No available capacity — carrier equipment breakdown')],
      '2026-03-25T11:00:00.000Z'),

    buildSeedOrder('ord-028', 'ORD-2026-0028', 'cancelled', 'Pacific Rim Trading',
      getCarrierByIndex(12), 'flatbed', 'ltl', 2000, 19000,
      [makePickupStop('New York',   'NY', '10001', '2026-04-08T07:00:00.000Z'),
       makeDropoffStop('Baltimore', 'MD', '21201', '2026-04-09T13:00:00.000Z')],
      [makeStatusHistoryEntry(null, 'pending',   '2026-04-01T09:00:00.000Z'),
       makeStatusHistoryEntry('pending', 'cancelled', '2026-04-05T10:00:00.000Z', 'Shipper not ready — freight delayed at origin')],
      '2026-04-01T09:00:00.000Z'),

    buildSeedOrder('ord-029', 'ORD-2026-0029', 'cancelled', 'Central Valley Farms',
      getCarrierByIndex(13), 'reefer', 'ftl', 2500, 29000,
      [makePickupStop('Dallas',  'TX', '75201', '2026-04-12T07:00:00.000Z'),
       makeDropoffStop('Houston','TX', '77001', '2026-04-13T15:00:00.000Z')],
      [makeStatusHistoryEntry(null, 'pending',   '2026-04-05T08:00:00.000Z'),
       makeStatusHistoryEntry('pending', 'cancelled', '2026-04-10T09:30:00.000Z', 'Temperature-controlled unit unavailable')],
      '2026-04-05T08:00:00.000Z'),

    buildSeedOrder('ord-030', 'ORD-2026-0030', 'cancelled', 'Gulf Coast Petroleum',
      getCarrierByIndex(14), 'step_deck', 'ftl', 8500, 44000,
      [makePickupStop('Seattle', 'WA', '98101', '2026-04-14T05:00:00.000Z'),
       makeDropoffStop('Phoenix','AZ', '85001', '2026-04-17T18:00:00.000Z')],
      [makeStatusHistoryEntry(null, 'pending',    '2026-04-08T09:00:00.000Z'),
       makeStatusHistoryEntry('pending', 'in_transit', '2026-04-14T05:30:00.000Z'),
       makeStatusHistoryEntry('in_transit', 'cancelled',  '2026-04-15T14:00:00.000Z', 'Mechanical failure — driver broke down en route')],
      '2026-04-08T09:00:00.000Z'),

    buildSeedOrder('ord-031', 'ORD-2026-0031', 'cancelled', 'Apex Distribution Co.',
      getCarrierByIndex(0), 'dry_van', 'ftl', 2900, 33000,
      [makePickupStop('Miami',   'FL', '33101', '2026-04-16T08:00:00.000Z'),
       makeDropoffStop('Atlanta','GA', '30301', '2026-04-18T17:00:00.000Z')],
      [makeStatusHistoryEntry(null, 'pending',    '2026-04-10T10:00:00.000Z'),
       makeStatusHistoryEntry('pending', 'in_transit', '2026-04-16T08:30:00.000Z'),
       makeStatusHistoryEntry('in_transit', 'cancelled',  '2026-04-17T09:00:00.000Z', 'Consignee warehouse closed — delivery refused')],
      '2026-04-10T10:00:00.000Z'),

    buildSeedOrder('ord-032', 'ORD-2026-0032', 'cancelled', 'Nexus Industrial Supply',
      getCarrierByIndex(1), 'flatbed', 'ltl', 2200, 26000,
      [makePickupStop('Chicago',    'IL', '60601', '2026-04-20T07:00:00.000Z'),
       makeDropoffStop('St. Louis', 'MO', '63101', '2026-04-21T15:00:00.000Z')],
      [makeStatusHistoryEntry(null, 'pending',   '2026-04-12T09:00:00.000Z'),
       makeStatusHistoryEntry('pending', 'cancelled', '2026-04-16T11:00:00.000Z', 'Customer revised shipping plan — will reorder next week')],
      '2026-04-12T09:00:00.000Z'),
  ];
}
