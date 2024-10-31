import { Discount } from '@/types/schemas'
import { request } from '@/utils/fetcher'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useMakeDiscount = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Discount) =>
      request('/discounts/make', 'POST', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['discounts'] })
  })
}

export const useFetchDiscounts = () => {
  const { data, isFetching, isPending, isError } = useQuery({
    queryKey: ['discounts'],
    queryFn: () => request<Discount[]>('/discounts/', 'GET'),
    select: ({ payload: discounts }) => discounts,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  })

  return {
    discounts: data,
    isLoading: isFetching || isPending,
    isError
  }
}

export const useEditDiscount = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Discount) =>
      request(`/discounts/${data.id}/edit`, 'PATCH', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['discounts'] })
  })
}

export const useDeleteDiscount = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => request(`/discounts/${id}/delete`, 'DELETE'),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['discounts'] })
  })
}