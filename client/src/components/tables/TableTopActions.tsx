import { useRenderCount } from "@/hooks/useRenderCount"
import { formatIfSingularOrPlural } from "@/utils/formatters"
import { Group, Paper, Text, TextInput } from "@mantine/core"
import { IconSearch } from "@tabler/icons-react"
import { memo, ReactElement } from "react"

interface TableTopActionsProps {
  actionButtonComponent?: ReactElement
  setGlobalFilter: (filter: string) => void
  totalRowCount?: number
}

export const TableTopActions = memo((props: TableTopActionsProps) => {
  useRenderCount('TableTopActions')

  const { 
    actionButtonComponent = null,
    setGlobalFilter,
    totalRowCount = 0
  } = props

  return (
    <Paper withBorder shadow="sm" p="md">
      <Group justify="space-between" align="center">
        <Group>
          {actionButtonComponent}
          <TextInput
            type="search"
            id="table-search"
            placeholder="Search"
            leftSection={<IconSearch />}
            w={400}
            autoComplete="off"
            onChange={e => setGlobalFilter(e.currentTarget.value)}
          />
        </Group>
        <Text>{formatIfSingularOrPlural(totalRowCount, 'row')}</Text>
      </Group>
    </Paper>
  )
})