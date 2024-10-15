import { DataGrid } from '@/components/tables/Table'
import { feeColumnDefinition } from '@/defs/fees'
import { useFetchFees } from '@/api/fee'
import { useRenderCount } from "@/hooks/useRenderCount"
import { FormModalHandle } from '@/types/modals'
import { Fee } from '@/types/schemas'
import { Button, Space } from '@mantine/core'
import { getCoreRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table'
import { useMemo, useRef, useState } from 'react'
import { CreateFeeModal, DeleteFeeConfirmModal, DeleteFeeConfirmModalHandle, EditFeeModal } from '../modals/FeeModals'
import { TableTopActions } from '../tables/TableTopActions'

const fallbackData: Fee[] = []

export const FeesListView = () => {
  useRenderCount('FeesListView')

  const { fees, isLoading, isError } = useFetchFees()
  const [globalFilter, setGlobalFilter] = useState('')
  const createModalRef = useRef<FormModalHandle<Fee>>(null)
  const editModalRef = useRef<FormModalHandle<Fee>>(null)
  const deleteModalRef = useRef<DeleteFeeConfirmModalHandle>(null)
  const columnDefinition = useMemo(() => feeColumnDefinition(editModalRef, deleteModalRef), [])

  const table = useReactTable({
    columns: columnDefinition,
    data: fees ?? fallbackData,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: 'auto',
    onGlobalFilterChange: setGlobalFilter,
    enableSorting: false,
    getRowId: row => row.id!,
    initialState: {
      columnVisibility: {
        id: false
      }
    },
    state: {
      globalFilter
    }
  })

  const actionButtonComponent = useMemo(() => (
    <Button
      onClick={() => createModalRef.current?.open()}
    >
      Add Fee
    </Button>
  ), [])

  return (
    <>
      <TableTopActions
        actionButtonComponent={actionButtonComponent}
        setGlobalFilter={setGlobalFilter}
        totalRowCount={fees?.length}
      />
      <Space h="md" />
      <DataGrid
        isLoading={isLoading}
        showTablePlaceholder={isLoading || isError}
        table={table}
        data={fees}
      />
      <CreateFeeModal ref={createModalRef} />
      <EditFeeModal ref={editModalRef} />
      <DeleteFeeConfirmModal ref={deleteModalRef} />
    </>
  )
}