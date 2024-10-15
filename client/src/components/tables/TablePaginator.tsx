import { useRenderCount } from "@/hooks/useRenderCount"
import { TableAction, TableActionType } from "@/hooks/useTableState"
import { Group, Pagination, Paper, Select, Space, Text } from "@mantine/core"
import { PaginationState } from '@tanstack/react-table'
import { memo } from "react"

// eslint-disable-next-line react-refresh/only-export-components
export const defaultPaginationSizes = [10, 25, 50, 75, 100]

interface TablePaginatorProps {
  paginatorSizes?: number[]
  paginationState: PaginationState
  pageCount: number
  setTableState?: (value: TableAction) => void
}

export const TablePaginator = memo((props: TablePaginatorProps) => {
  useRenderCount('TablePaginator')

  const {
    paginatorSizes = defaultPaginationSizes,
    paginationState: { pageSize },
    pageCount,
    setTableState
  } = props

  const handlePageChange = setTableState && ((value: number) => setTableState({
    type: TableActionType.PAGINATE, pagination: {
      pageIndex: value - 1,
      pageSize: pageSize
    }
  }))

  const handlePageSizeChange = setTableState && ((value: number) => setTableState({
    type: TableActionType.PAGINATE, pagination: {
      pageIndex: 0,
      pageSize: value!
    }
  }))

  return (
    <Paper withBorder shadow="sm" p="md">
      <Group justify="center" align="center">
        <Text>Showing</Text>
        <Select
          w="10%"
          defaultValue={pageSize.toString()}
          data={paginatorSizes.map(size => size.toString())}
          onChange={value => handlePageSizeChange && handlePageSizeChange(parseInt(value!))}
        />
        <Text>rows per page</Text>
        <Space w="md" />
        <Pagination
          hideWithOnePage={true}
          onChange={handlePageChange}
          total={pageCount}
        />
      </Group>
    </Paper>
  )
})