import { Payment, Receipt } from '@/types/schemas'
import { request } from '@/utils/fetcher'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useMakePayment = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationKey: ['bill'],
    mutationFn: (data: Payment) =>
      request<Omit<Payment, 'bill'>>('/payments/make', 'POST', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bills'] })
  })
}

export const useFetchPayments = (billId: string) => {
  const { data, isFetching, isPending, isError } = useQuery({
    queryKey: ['bills', billId, 'payments'],
    queryFn: () => request<Payment[]>(`/bills/${billId}/payments`, 'GET'),
    select: ({ payload }) => payload,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: !!billId
  })

  return {
    payments: data,
    isLoading: isFetching || isPending,
    isError
  }
}

export const useFetchReceipt = (paymentId: string) => {
  const { data, isFetching, isPending, isError } = useQuery({
    queryKey: ['payments', paymentId, 'receipt'],
    queryFn: () => request<Receipt>(`/payments/${paymentId}/receipt`, 'GET'),
    select: ({ payload: receipt }) => receipt,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: paymentId !== ''
  })

  return {
    receipt: data,
    isLoading: isFetching || isPending,
    isError
  }
}