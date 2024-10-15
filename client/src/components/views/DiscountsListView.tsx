import { discountColumnDefinition } from '@/defs/discounts'
import { useFetchDiscounts } from '@/api/discount'
import { useRenderCount } from '@/hooks/useRenderCount'
import { FormModalHandle } from '@/types/modals'
import { Discount } from '@/types/schemas'
import { Button, Space } from '@mantine/core'
import { getCoreRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table'
import { useMemo, useRef, useState } from 'react'
import { CreateDiscountModal, DeleteDiscountConfirmModal, DeleteDiscountConfirmModalHandle, EditDiscountModal } from '../modals/DiscountModals'
import { DataGrid } from '../tables/Table'
import { TableTopActions } from '../tables/TableTopActions'

const fallbackData: Discount[] = []

export const DiscountsListView = () => {
  useRenderCount('DiscountsListView')

  const { discounts, isLoading, isError } = useFetchDiscounts()

  const [globalFilter, setGlobalFilter] = useState('')
  const createModalRef = useRef<FormModalHandle<Discount>>(null)
  const editModalRef = useRef<FormModalHandle<Discount>>(null)
  const deleteModalRef = useRef<DeleteDiscountConfirmModalHandle>(null)

  const columnDefinition = useMemo(() => discountColumnDefinition(editModalRef, deleteModalRef), [])

  const table = useReactTable({
    columns: columnDefinition,
    data: discounts ?? fallbackData,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: 'auto',
    onGlobalFilterChange: setGlobalFilter,
    enableSorting: false,
    getRowId: row => row.id!,
    initialState: {
      columnVisibility: {
        id: false,
        isPercent: false
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
      Add Discount
    </Button>
  ), [])

  return (
    <>
      <TableTopActions
        actionButtonComponent={actionButtonComponent}
        setGlobalFilter={setGlobalFilter}
        totalRowCount={discounts?.length}
      />
      <Space h="md" />
      <DataGrid
        isLoading={isLoading}
        showTablePlaceholder={isLoading || isError}
        table={table}
        data={discounts}
      />
      <CreateDiscountModal ref={createModalRef} />
      <EditDiscountModal ref={editModalRef} />
      <DeleteDiscountConfirmModal ref={deleteModalRef} />
    </>
  )
}