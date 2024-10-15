import { DataGrid } from '@/components/tables/Table'
import { cashoutColumnDefinition } from '@/defs/cashout'
import { useFetchOutflows } from '@/api/cashout'
import { useRenderCount } from "@/hooks/useRenderCount"
import { TableActionType, useTableState } from '@/hooks/useTableState'
import { FormModalHandle } from '@/types/modals'
import { Outflow } from '@/types/schemas'
import { Button, Stack } from '@mantine/core'
import { useDebouncedCallback } from '@mantine/hooks'
import { getCoreRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table'
import { useMemo, useRef } from 'react'
import { CashoutModal } from '../modals/CashoutModal'
import { TablePaginator } from '../tables/TablePaginator'
import { TableTopActions } from '../tables/TableTopActions'

const fallbackData: Outflow[] = []
const FILTER_DELAY = 500

export const CashoutListView = () => {
  useRenderCount('CashoutListView')

  const {
    tableState: {
      pagination,
      globalFilter
    },
    setTableState
  } = useTableState()

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
  } = useFetchOutflows({ pagination, globalFilter })
  const createModalRef = useRef<FormModalHandle<Outflow>>(null)

  const table = useReactTable({
    columns: cashoutColumnDefinition,
    data: paginatedResult?.fields ?? fallbackData,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: 'auto',
    enableSorting: false,
    manualPagination: true, // Use server-side
    manualFiltering: true, // Use server-side
    rowCount: paginatedResult?.rowCount,
    state: {
      globalFilter,
      pagination
    }
  })

  const actionButtonComponent = useMemo(() => (
    <Button
      onClick={() => createModalRef.current?.open()}
    >
      Cash out
    </Button>
  ), [])

  return (
    <Stack>
      <TableTopActions
        actionButtonComponent={actionButtonComponent}
        setGlobalFilter={setGlobalFilter}
        totalRowCount={paginatedResult?.rowCount}
      />
      <DataGrid
        isLoading={isLoading}
        showTablePlaceholder={isLoading || isError}
        table={table}
        data={paginatedResult?.fields}
      />
      <TablePaginator
        paginationState={pagination}
        pageCount={paginatedResult?.pageCount ?? 1}
        setTableState={setTableState}
      />
      <CashoutModal ref={createModalRef} />
    </Stack>
  )
}