import { createApi } from '@reduxjs/toolkit/query/react';
import { mockBaseQuery } from '@/shared/api/baseQuery';
import type { Carrier, GetCarriersParams } from '@/entities/carrier/model/types';

export const carrierApi = createApi({
  reducerPath: 'carrierApi',
  baseQuery: mockBaseQuery,
  tagTypes: ['Carrier'],
  endpoints: (build) => ({
    getCarriers: build.query<Carrier[], GetCarriersParams | undefined>({
      query: (params) => ({ method: 'getCarriers', params }),
      providesTags: [{ type: 'Carrier', id: 'LIST' }],
    }),
  }),
});

export const { useGetCarriersQuery } = carrierApi;
