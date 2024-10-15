import { Bill, Paginated } from '@/types/schemas'
import { TableServerQuery, TableState } from '@/types/ui'
import { request } from '@/utils/fetcher'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useMakeBill = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { bills: Bill[] }) =>
      request('/bills/make', 'POST', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bills'] })
  })
}

export const useFetchBills = ({ pagination, globalFilter }: TableState) => {
  const query: TableServerQuery = {
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize,
    filterQuery: globalFilter
  }

  const { data, isFetching, isPending, isError } = useQuery({
    queryKey: ['bills', pagination, globalFilter],
    queryFn: () => request<Bill[], TableServerQuery>('/bills/', 'GET', query),
    select: ({ payload, meta }) => ({
      fields: payload,
      pageCount: meta.pageCount,
      rowCount: meta.rowCount
    } as Paginated<Bill>),
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData
  })
  
  return {
    paginatedResult: data,
    isLoading: isFetching || isPending,
    isError
  }
}

export const useFetchBill = (billId: string) => {
  const { data, isFetching, isPending, isError, refetch } = useQuery({
    queryKey: ['bill', billId],
    queryFn: () => request<Bill>(`/bills/${billId}`, 'GET'),
    select: ({ payload }) => payload,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    enabled: !!billId
  })

  return {
    bill: data,
    isLoading: isFetching || isPending,
    isError,
    refetch
  }
}