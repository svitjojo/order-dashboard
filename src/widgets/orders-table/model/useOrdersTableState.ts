import { useGetOrdersQuery } from '@/entities/order/api/orderApi'
import { useOrderFilters } from '@/features/order-filters/model/useOrderFilters'

export function useOrdersTableState() {
  const filterState = useOrderFilters()
  const { data, isLoading, isFetching, isError, refetch } = useGetOrdersQuery(filterState.filters)

  return {
    orders: data?.data ?? [],
    total: data?.total ?? 0,
    totalPages: data?.totalPages ?? 0,
    isLoading,
    isFetching,
    isError,
    refetch,
    ...filterState,
  }
}
