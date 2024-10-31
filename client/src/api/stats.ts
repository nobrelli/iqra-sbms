import { request } from "@/utils/fetcher"
import { useQuery } from "@tanstack/react-query"
import { useCountStudents } from "./student"

export const useGetAccountBalance = () => {
  const { data, isFetching, isPending } = useQuery({
    queryKey: ['balance'],
    queryFn: () => request<number>('/check_balance', 'GET'),
    select: ({ payload: balance }) => balance,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  })

  return {
    balance: data ?? 0,
    isPending,
    isFetching
  }
}

export const useCountActiveBills = () => {
  const { data, isFetching, isPending } = useQuery({
    queryKey: ['active_bills_count'],
    queryFn: () => request<number>('/count_active_bills', 'GET'),
    select: ({ payload: count }) => count,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  })

  return {
    count: data ?? 0,
    isPending,
    isFetching
  }
}

export const useStats = () => {
  const { 
    count: studentsCount, 
    isPending: isStudentsCountPending, 
    isFetching: isStudentsCountFetching
  } = useCountStudents()
  const { 
    balance, 
    isPending: isBalancePending,
    isFetching: isBalanceFetching
  } = useGetAccountBalance()
  const { 
    count: activeBillsCount, 
    isPending: isActiveBillsCountPending,
    isFetching: isActiveBillsCountFetching
  } = useCountActiveBills()

  const isLoading = 
    isStudentsCountPending 
    || isStudentsCountFetching
    || isBalancePending
    || isBalanceFetching 
    || isActiveBillsCountPending
    || isActiveBillsCountFetching
  
  return {
    balance,
    studentsCount,
    activeBillsCount,
    isLoading
  }
}