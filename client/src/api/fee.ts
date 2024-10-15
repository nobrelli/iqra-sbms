import { Fee } from '@/types/schemas'
import { request } from '@/utils/fetcher'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useMakeFee = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Fee) =>
      request('/fees/make', 'POST', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['fees'] })
  })
}

export const useFetchFees = () => {
  const { data, isFetching, isPending, isError } = useQuery({
    queryKey: ['fees'],
    queryFn: () => request<Fee[]>('/fees/', 'GET'),
    select: ({ payload: fees }) => fees,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  })

  return {
    fees: data,
    isLoading: isFetching || isPending,
    isError
  }
}

export const useEditFee = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Fee) =>
      request(`/fees/${data.id}/edit`, 'PATCH', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['fees'] })
  })
}

export const useDeleteFee = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => request(`/fees/${id}/delete`, 'DELETE'),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['fees'] })
  })
}