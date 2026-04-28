import { createApi } from '@reduxjs/toolkit/query/react';
import { mockBaseQuery } from '@/shared/api/baseQuery';
import type { Order, GetOrdersParams, OrderStatus } from '@/entities/order/model/types';
import type { PaginatedResponse } from '@/shared/types/pagination';
import type { CreateOrderInput, UpdateOrderInput } from '@/entities/order/model/schemas';

export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: mockBaseQuery,
  tagTypes: ['Order'],
  endpoints: (build) => ({
    getOrders: build.query<PaginatedResponse<Order>, GetOrdersParams>({
      query: (params) => ({ method: 'getOrders', params }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Order' as const, id })),
              { type: 'Order', id: 'LIST' },
            ]
          : [{ type: 'Order', id: 'LIST' }],
    }),

    getOrder: build.query<Order, string>({
      query: (id) => ({ method: 'getOrder', id }),
      providesTags: (_result, _err, id) => [{ type: 'Order', id }],
    }),

    createOrder: build.mutation<Order, CreateOrderInput>({
      query: (data) => ({ method: 'createOrder', data }),
      invalidatesTags: [{ type: 'Order', id: 'LIST' }],
    }),

    updateOrder: build.mutation<Order, { id: string; data: UpdateOrderInput }>({
      query: ({ id, data }) => ({ method: 'updateOrder', id, data }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: 'Order', id },
        { type: 'Order', id: 'LIST' },
      ],
    }),

    deleteOrder: build.mutation<void, string>({
      query: (id) => ({ method: 'deleteOrder', id }),
      invalidatesTags: [{ type: 'Order', id: 'LIST' }],
    }),

    updateOrderStatus: build.mutation<Order, { id: string; status: OrderStatus; note?: string }>({
      query: ({ id, status, note }) => ({
        method: 'updateOrderStatus',
        id,
        status,
        note,
      }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: 'Order', id },
        { type: 'Order', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
  useUpdateOrderStatusMutation,
} = orderApi;
