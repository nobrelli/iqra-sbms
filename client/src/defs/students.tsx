import { lookupPayingStatus } from '@/utils/lookups'
import { Student } from '@/types/schemas'
import { Anchor, Center, Checkbox, Text, Tooltip } from "@mantine/core"
import { Link } from '@tanstack/react-router'
import { createColumnHelper } from "@tanstack/react-table"
import { joinNames } from '@/utils/formatters'

const columnHelper = createColumnHelper<Student>()

export const studentColDefs = [
  columnHelper.display({
    id: 'actions',
    size: 'auto' as unknown as number,
    header: ({ table }) => (
      <Tooltip label="Toggle check all visible records" >
        <Checkbox
          checked={table.getIsAllRowsSelected()}
          indeterminate={table.getIsSomeRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
          mx="auto"
        />
      </Tooltip>
    ),
    cell: ({ row }) => (
      <Center>
        <Checkbox
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onChange={row.getToggleSelectedHandler()}
        />
      </Center>
    )
  }),
  columnHelper.accessor('id', {
    header: 'ID',
    size: 1,
    cell: cell =>
      <Anchor
        component={Link}
        to={`/students/${cell.getValue()}`}
        fw="bold"
        size="sm"
      >
        {cell.getValue()}
      </Anchor>
  }),
  columnHelper.accessor(({ lastName, firstName, midName }) =>
    joinNames(lastName, firstName, midName), {
    id: 'lastName',
    header: 'Full Name',
    size: 500
  }),
  columnHelper.accessor('course', {
    header: 'Course',
  }),
  columnHelper.accessor('yearLevel', {
    header: 'Year Level',
  }),
  columnHelper.accessor('phone', {
    header: 'Phone',
    enableSorting: false,
    size: 300
  }),
  columnHelper.accessor('enrollmentStatus', {
    header: () => (
      <Tooltip label="PE = partially enrolled, FE = fully enrolled">
        <Text size="sm" fw="bold">Enrollment Status</Text>
      </Tooltip>
    ),
    enableSorting: false,
  }),
  columnHelper.accessor('payingStatus', {
    header: 'Paying Status',
    enableSorting: false,
    size: 300,
    cell: cell => lookupPayingStatus(cell.getValue())
  })
]