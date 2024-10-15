import { billColumnDefinition } from '@/defs/bills'
import { useFetchBills } from '@/api/bill'
import { useRenderCount } from "@/hooks/useRenderCount"
import { TableActionType, useTableState } from '@/hooks/useTableState'
import { useAdminStore } from '@/lib/storeContext'
import { FormModalHandle } from '@/types/modals'
import { Bill, Payment } from '@/types/schemas'
import { Stack } from '@mantine/core'
import { useDebouncedCallback } from '@mantine/hooks'
import { getCoreRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table'
import { useEffect, useMemo, useRef } from 'react'
import { PaymentsModal } from '../modals/PaymentsModal'
import { SettleModal } from '../modals/SettleModal'
import { DataGrid } from '../tables/Table'
import { TablePaginator } from '../tables/TablePaginator'
import { TableTopActions } from '../tables/TableTopActions'

const fallbackData: Bill[] = []
const FILTER_DELAY = 500

export const BillsDataGrid = () => {
  useRenderCount('BillsDataGrid')

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
    isError,
  } = useFetchBills({ pagination, globalFilter })

  const { selectedStudentIds, setSelectedStudentIds } = useAdminStore()
  const settleModalRef = useRef<FormModalHandle<Payment['billId']>>(null)
  const viewModalRef = useRef<FormModalHandle<Payment['billId']>>(null)
  const columns = useMemo(() => billColumnDefinition(settleModalRef, viewModalRef), [])

  const table = useReactTable({
    columns,
    data: paginatedResult?.fields ?? fallbackData,
    getRowId: row => row.id!,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableSorting: false,
    manualPagination: true, // Use server-side
    manualFiltering: true, // Use server-side
    rowCount: paginatedResult?.rowCount,
    state: {
      globalFilter,
      pagination
    }
  })

  useEffect(() => {
    if (selectedStudentIds)
      setSelectedStudentIds(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Stack>
      <TableTopActions
        setGlobalFilter={setGlobalFilter}
        totalRowCount={paginatedResult?.rowCount}
      />
      <DataGrid
        xScrollable={true}
        isLoading={isLoading}
        showTablePlaceholder={isLoading || isError}
        table={table}
        data={paginatedResult?.fields}
      />
      <TablePaginator
        setTableState={setTableState}
        paginationState={pagination}
        pageCount={paginatedResult?.pageCount ?? 1}
      />
      <SettleModal ref={settleModalRef} />
      <PaymentsModal ref={viewModalRef} />
    </Stack>
  )
}