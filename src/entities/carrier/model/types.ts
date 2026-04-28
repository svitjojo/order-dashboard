export interface Carrier {
  id: string;
  name: string;
  mcNumber: string;
  phone: string;
  rating: number;
}

export interface GetCarriersParams {
  search?: string;
}
