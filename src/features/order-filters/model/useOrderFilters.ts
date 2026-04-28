import { useDeferredValue, useMemo, useState, useTransition } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { GetOrdersParams, OrderStatus } from '@/entities/order/model/types'
import { PAGE_SIZE_OPTIONS } from '@/shared/config/constants'
import { debounce } from '@/shared/lib/debounce'

const DEFAULT_PAGE = 1
const DEFAULT_SIZE = PAGE_SIZE_OPTIONS[0]

export function useOrderFilters() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearchLocal] = useState(() => searchParams.get('search') ?? '')
  const deferredSearch = useDeferredValue(search)
  const [isPending, startTransition] = useTransition()

  const updateSearchInUrl = useMemo(
    () =>
      debounce((value: string) => {
        startTransition(() => {
          setSearchParams((prev) => {
            const next = new URLSearchParams(prev)
            if (value) {
              next.set('search', value)
            } else {
              next.delete('search')
            }
            next.set('page', String(DEFAULT_PAGE))
            return next
          })
        })
      }, 300),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  function setSearch(value: string) {
    setSearchLocal(value)
    updateSearchInUrl(value)
  }

  function setStatus(statuses: OrderStatus[]) {
    startTransition(() => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        next.delete('status')
        statuses.forEach((s) => next.append('status', s))
        next.set('page', String(DEFAULT_PAGE))
        return next
      })
    })
  }

  function setSort(field: string) {
    startTransition(() => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        const currentSort = prev.get('sort')
        const currentDir = prev.get('dir') ?? 'asc'
        if (currentSort === field) {
          next.set('dir', currentDir === 'asc' ? 'desc' : 'asc')
        } else {
          next.set('sort', field)
          next.set('dir', 'asc')
        }
        return next
      })
    })
  }

  function setPage(page: number) {
    startTransition(() => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        next.set('page', String(page))
        return next
      })
    })
  }

  function setSize(size: number) {
    startTransition(() => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        next.set('size', String(size))
        next.set('page', String(DEFAULT_PAGE))
        return next
      })
    })
  }

  function clearFilters() {
    setSearchLocal('')
    startTransition(() => {
      setSearchParams(new URLSearchParams())
    })
  }

  const rawStatuses = searchParams.getAll('status') as OrderStatus[]

  const filters: GetOrdersParams = {
    search: deferredSearch || undefined,
    status: rawStatuses.length > 0 ? rawStatuses : undefined,
    sort: searchParams.get('sort') ?? undefined,
    dir: (searchParams.get('dir') as GetOrdersParams['dir']) ?? undefined,
    page: Number(searchParams.get('page') ?? DEFAULT_PAGE),
    size: Number(searchParams.get('size') ?? DEFAULT_SIZE),
  }

  return {
    filters,
    search,
    isPending,
    setSearch,
    setStatus,
    setSort,
    setPage,
    setSize,
    clearFilters,
  }
}
