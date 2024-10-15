import { Outflow, Paginated } from '@/types/schemas'
import { TableServerQuery, TableState } from '@/types/ui'
import { request } from '@/utils/fetcher'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useMakeCashout = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: Outflow) =>
      request('/cashout/make', 'POST', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['outflows'] })
  })
}

export const useFetchOutflows = ({ pagination, globalFilter }: TableState) => {
  const query: TableServerQuery = {
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize,
    filterQuery: globalFilter
  }

  const { data, isFetching, isPending, isError } = useQuery({
    queryKey: ['outflows', pagination, globalFilter],
    queryFn: () => request<Outflow[], TableServerQuery>('/cashout/get_all', 'GET', query),
    select: ({ payload, meta }) => ({
      fields: payload,
      pageCount: meta.pageCount,
      rowCount: meta.rowCount
    } as Paginated<Outflow>),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  })

  return {
    paginatedResult: data,
    isLoading: isFetching || isPending,
    isError
  }
}

export const useDeleteCashout = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => request('/cashout/delete', 'DELETE', { id }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['outflows'] })
  })
}