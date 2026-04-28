import { configureStore } from '@reduxjs/toolkit';
import { orderApi } from '@/entities/order/api/orderApi';
import { carrierApi } from '@/entities/carrier/api/carrierApi';
import draftsReducer from '@/features/draft-management/model/draftsSlice';

export const store = configureStore({
  reducer: {
    [orderApi.reducerPath]: orderApi.reducer,
    [carrierApi.reducerPath]: carrierApi.reducer,
    drafts: draftsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(orderApi.middleware, carrierApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
