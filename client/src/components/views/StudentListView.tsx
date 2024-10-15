import { useFetchStudents } from '@/api/student'
import { studentColDefs } from '@/defs/students'
import { useRenderCount } from '@/hooks/useRenderCount'
import { initTableState, TableActionType, useTableState } from '@/hooks/useTableState'
import { useAdminStore } from '@/lib/storeContext'
import { Student } from '@/types/schemas'
import { Button, Stack } from "@mantine/core"
import { useDebouncedCallback, useDidUpdate } from '@mantine/hooks'
import { useNavigate, useRouter } from '@tanstack/react-router'
import { getCoreRowModel, getFilteredRowModel, RowSelectionState, SortingState, Updater, useReactTable } from "@tanstack/react-table"
import { forwardRef, useImperativeHandle, useMemo, useRef } from "react"
import { DataGrid } from '../tables/Table'
import { TablePaginator } from '../tables/TablePaginator'
import { TableTopActions } from '../tables/TableTopActions'

const fallbackData: Student[] = []
const FILTER_DELAY = 500

type StudentsHolderHandle = { setStudents: (items: Set<string>) => void }

const StudentsHolder = forwardRef<StudentsHolderHandle>((_, ref) => {
  const selectedStudentIds = useAdminStore(state => state.selectedStudentIds)
  const setSelectedStudentIds = useAdminStore(state => state.setSelectedStudentIds)
  const router = useRouter()
  const navigate = useNavigate()

  useImperativeHandle(ref, () => ({
    setStudents(items) {
      setSelectedStudentIds(items)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [])

  useDidUpdate(() => {
    if (selectedStudentIds) {
      (async () => {
        await router.invalidate()
        navigate({ to: '/bills/make' })
      })()
    }
  }, [selectedStudentIds])

  return <></>
})

export const StudentsListView = () => {
  useRenderCount('StudentsListView')

  const {
    tableState: {
      pagination,
      sorting,
      globalFilter,
      rowSelection
    },
    setTableState
  } = useTableState({
    ...initTableState,
    sorting: [{
      id: 'lastName',
      desc: false,
    }],
  })

  const setGlobalFilter = useDebouncedCallback((value: string) => {
    setTableState({
      type: TableActionType.GLOBAL_FILTER,
      globalFilter: value
    })
  }, FILTER_DELAY)

  const {
    paginatedResult,
    isLoading,
    isError
  } = useFetchStudents({ pagination, sorting, globalFilter })
  const studentsHolderRef = useRef<StudentsHolderHandle>(null)
  const selectedRowCount = Object.keys(rowSelection!).length
  const showTablePlaceholder = isLoading || isError

  const handleRowSelectionChange = (updaterOrValue: Updater<RowSelectionState>) => setTableState({
    type: TableActionType.ROW_SELECT,
    rowSelection: typeof updaterOrValue === 'function'
      ? updaterOrValue(rowSelection!)
      : updaterOrValue
  })

  const handleSortingChange = (updaterOrValue: Updater<SortingState>) => setTableState({
    type: TableActionType.SORT,
    sorting: typeof updaterOrValue === 'function'
      ? updaterOrValue(sorting!)
      : updaterOrValue
  })

  const actionButtonComponent = useMemo(() => (
    <Button
      onClick={() => studentsHolderRef.current?.setStudents(new Set(Object.keys(rowSelection!)))}
      disabled={!selectedRowCount}
    >
      Create bill {selectedRowCount > 0 && `(${selectedRowCount})`}
    </Button>
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [rowSelection])

  const table = useReactTable({
    columns: studentColDefs,
    data: paginatedResult?.fields ?? fallbackData,
    getRowId: row => row.id.toString(),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: 'auto',
    onRowSelectionChange: handleRowSelectionChange,
    onSortingChange: handleSortingChange,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    rowCount: paginatedResult?.rowCount,
    enableMultiSort: true,
    state: {
      globalFilter,
      rowSelection,
      pagination,
      sorting
    }
  })

  useDidUpdate(() => {
    // reset selection
    setTableState({ type: TableActionType.ROW_SELECT, rowSelection: {} })
  }, [sorting, globalFilter])

  return (
    <Stack>
      <StudentsHolder ref={studentsHolderRef} />
      <TableTopActions
        actionButtonComponent={actionButtonComponent}
        setGlobalFilter={setGlobalFilter}
        totalRowCount={paginatedResult?.rowCount}
      />
      <DataGrid
        xScrollable={true}
        isLoading={isLoading}
        showTablePlaceholder={showTablePlaceholder}
        table={table}
        data={paginatedResult?.fields}
      />
      <TablePaginator
        paginationState={pagination}
        pageCount={paginatedResult?.pageCount ?? 1}
        setTableState={setTableState}
      />
    </Stack>
  )
}