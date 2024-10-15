import { TableLoader } from '@/components/tables/TableLoader'
import classes from '@/styles/utils.module.css'
import { Collapse, Flex, Paper, Table, Text, Tooltip } from "@mantine/core"
import { IconArrowsSort, IconSortAscending, IconSortDescending } from "@tabler/icons-react"
import { flexRender, SortDirection, useReactTable } from "@tanstack/react-table"
import { AnimatedProgress } from '../AnimatedProgress'
import { ReactElement, ReactNode } from 'react'

interface DataGridProps<DataType> {
  xScrollable?: boolean
  isLoading: boolean
  showTablePlaceholder: boolean
  table: ReturnType<typeof useReactTable<DataType>>
  data?: DataType[]
}

const sortIcons: Record<SortDirection, ReactElement> = {
  asc: <Tooltip label="Sorted in ascending order"><IconSortAscending /></Tooltip>,
  desc: <Tooltip label="Sorted in descending order"><IconSortDescending /></Tooltip>
}

export const TableScrollContainer = ({
  xScrollable = false, children }
  : { xScrollable: boolean, children: ReactNode }) => {
  return (
    xScrollable ? (
      <Table.ScrollContainer minWidth={1200} type="native">
        {children}
      </Table.ScrollContainer>
    ) : (
      <>{children}</>
    )
  )
}

export const DataGrid = <DataType,>(props: DataGridProps<DataType>) => {
  const {
    xScrollable = false,
    isLoading,
    showTablePlaceholder,
    table,
    data
  } = props

  return (
    <Paper withBorder shadow="sm" className={classes.table}>
      <AnimatedProgress in={isLoading} />
      <TableScrollContainer xScrollable={xScrollable}>
        <Table
          horizontalSpacing="md"
          verticalSpacing="md"
          withColumnBorders
        >
          <Table.Thead className={classes.tableHead}>
            {table.getHeaderGroups().map(headerGroup => (
              <Table.Tr key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  const sortable = header.column.getCanSort()
                  const headerContent = header.isPlaceholder
                    ? null
                    : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )
                  return (
                    <Table.Th
                      key={header.id}
                      tt="uppercase"
                      w={header.getSize()}
                      style={sortable ? { cursor: 'pointer' } : undefined}
                      onClick={sortable ? header.column.getToggleSortingHandler() : undefined}
                    >
                      {sortable ? (
                        <Flex justify="space-between" align="center" gap="sm">
                          {headerContent}
                          {header.column.getCanSort()
                            ? sortIcons[header.column.getIsSorted() as SortDirection]
                            ?? <Tooltip label="Unsorted"><IconArrowsSort /></Tooltip>
                            : null}
                        </Flex>
                      ) : headerContent}
                    </Table.Th>
                  )
                })}
              </Table.Tr>
            ))}
          </Table.Thead>
          <Table.Tbody>
            {(!data || !data.length) ? (
              <Table.Tr>
                <Table.Td colSpan={table.getVisibleFlatColumns().length}>
                  <Collapse in={showTablePlaceholder}>
                    <TableLoader isError={!isLoading && showTablePlaceholder} />
                  </Collapse>
                  <Collapse in={!table.getFilteredRowModel().rows.length && !showTablePlaceholder}>
                    <Text ta="center">No results</Text>
                  </Collapse>
                </Table.Td>
              </Table.Tr>
            ) :
              table.getRowModel().rows.map(row => (
                <Table.Tr key={row.id} className={classes.tableBodyRow}>
                  {row.getVisibleCells().map(cell => (
                    <Table.Td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </Table.Td>
                  ))}
                </Table.Tr>
              ))
            }
          </Table.Tbody>
        </Table>
      </TableScrollContainer>
      <AnimatedProgress in={isLoading} />
    </Paper>
  )
}