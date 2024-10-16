import { initTableState } from '@/hooks/useTableState'
import { Paginated, Student } from '@/types/schemas'
import { TableServerQuery, TableState } from '@/types/ui'
import { request } from '@/utils/fetcher'
import { keepPreviousData, useQueries, useQuery } from '@tanstack/react-query'

export const useFetchStudents = ({ pagination, globalFilter }: TableState) => {
  const query: TableServerQuery = {
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize,
    filterQuery: globalFilter
  }
  
  const { data, isFetching, isPending, isLoadingError, isError } = useQuery({
    queryKey: ['students', pagination, globalFilter],
    queryFn: () => request<Student[], TableServerQuery>('/students/', 'GET', query),
    select: ({ payload, meta }) => ({
      fields: payload,
      pageCount: meta.pageCount,
      rowCount: meta.rowCount
    } as Paginated<Student>),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  })

  return {
    paginatedResult: data,
    isLoading: isFetching || isPending,
    isError: isLoadingError || isError
  }
}

export const useFetchStudent = (studentId: string) => {
  const { data, isFetching, isPending } = useQuery({
    queryKey: ['student', studentId],
    queryFn: () => request<Student>(`/students/${studentId}`, 'GET'),
    select: ({ payload: student }) => student,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    enabled: !!studentId
  })

  return {
    student: data,
    isLoading: isFetching || isPending
  }
}

export const useFetchStudentsByIds = (studentIds: Set<string>) => {
  const { data, isLoading } = useQueries({
    queries: Array.from(studentIds.values()).map(id => ({
      queryKey: ['student', id],
      queryFn: () => request<Student>(`/students/${id}`, 'GET'),
    })),
    combine: results => ({
      data: results.map(result => result.data?.payload) as Student[],
      isLoading: results.some(result => result.isPending || result.isFetching)
    })
  })

  return {
    students: data,
    isLoading
  }
}

export const useCountStudents = () => {
  const { data, isFetching, isPending } = useQuery({
    queryKey: ['student_count'],
    queryFn: () => request<Student[], TableState>('/students/', 'GET', {
      ...initTableState,
      rowSelection: undefined
    }),
    select: ({ meta }) => meta.rowCount,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  })

  return {
    count: data ?? 0,
    isPending,
    isFetching
  }
}

export const useGetStudentBalance = (studentId: string) => {
  const { data, isFetching, isPending } = useQuery({
    queryKey: ['student', studentId, 'balance'],
    queryFn: () => request<number>(`/students/${studentId}/check_balance`, 'GET'),
    select: ({ payload: balance }) => balance ?? 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    enabled: !!studentId
  })

  return {
    balance: data ?? 0,
    isLoading: isPending || isFetching
  }
}