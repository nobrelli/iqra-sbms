import { initTableState } from '@/hooks/useTableState'
import { getStudents } from '@/lib/students'
import { Paginated, Student } from '@/types/schemas'
import { TableState } from '@/types/ui'
import { request } from '@/utils/fetcher'
import { keepPreviousData, useQueries, useQuery } from '@tanstack/react-query'
import Fuse, { IFuseOptions } from 'fuse.js'
import { chunk, sort } from 'moderndash'

const fuseOptions: IFuseOptions<Student> = {
  keys: [
    'id',
    'lastName',
    'firstName',
    'midName',
    'course',
    'yearLevel',
    'payingStatus',
    'enrollmentStatus'
  ],
  isCaseSensitive: false,
  threshold: 0.2
}

const DELAY = 1000 // Simulate network delay

export const fetchMockStudents = (props: Partial<TableState>) => {
  const {
    pagination = initTableState.pagination,
    sorting = initTableState.sorting,
    globalFilter = ''
  } = props

  const MULTIPLIER = 1
  const students = getStudents(MULTIPLIER)

  return new Promise<Paginated<Student>>((resolve, reject) => {
    if (!students.length) {
      setTimeout(() =>
        reject(new Error('Students not found')), DELAY
      )
    }

    const sortRules: Parameters<typeof sort<Student>>[1][] = sorting!.map(sortProp => ({
      order: sortProp.desc ? 'desc' : 'asc',
      by: item => item[sortProp.id as keyof Student]
    }))

    const fakedData = sort<Student>(students, ...sortRules)
    const chunkedData = chunk(globalFilter
      ? new Fuse(fakedData, fuseOptions)
        .search(globalFilter)
        .map(result => result.item)
      : fakedData,
      pagination.pageSize
    )

    setTimeout(() => resolve({
      fields: chunkedData[pagination.pageIndex],
      pageCount: chunkedData.length,
      rowCount: students.length * MULTIPLIER
    }), DELAY)
  })
}

const fetchMockStudent = (studentId: string) => {
  const students = getStudents()

  return new Promise<Student | null>((resolve, reject) => {
    if (!students.length) {
      setTimeout(() =>
        reject(new Error('Students not found')), DELAY
      )
    }

    const data = students.find(student => student.id === studentId)

    setTimeout(() => resolve(data ?? null), DELAY)
  })
}

export const useFetchMockStudents = (props: TableState) => {
  const { data, isFetching, isPending, isLoadingError, isError } = useQuery({
    queryKey: ['students', props],
    queryFn: () => fetchMockStudents(props),
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

export const useFetchMockStudent = (studentId: string) => {
  const { data, isFetching, isPending } = useQuery({
    queryKey: ['student', studentId],
    queryFn: () => fetchMockStudent(studentId),
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    enabled: studentId !== ''
  })

  return {
    student: data,
    isLoading: isFetching || isPending
  }
}

export const useFetchMockStudentsByIds = (studentIds: Set<string>) => {
  const { data, isLoading } = useQueries({
    queries: Array.from(studentIds.values()).map(id => ({
      queryKey: ['student', id],
      queryFn: () => fetchMockStudent(id)
    })),
    combine: results => ({
      data: results.map(result => result.data) as Student[],
      isLoading: results.some(result => result.isPending || result.isFetching)
    })
  })

  return {
    students: data,
    isLoading
  }
}

export const useCountMockStudents = () => {
  const { data, isFetching, isPending } = useQuery({
    queryKey: ['student_count'],
    queryFn: () => fetchMockStudents({}),
    select: data => data.rowCount,
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