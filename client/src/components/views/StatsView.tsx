import { StatCard } from '@/components/StatCard'
import { useStats } from '@/api/stats'
import { useRenderCount } from '@/hooks/useRenderCount'
import { formatAmount } from '@/utils/formatters'
import { SimpleGrid } from '@mantine/core'

export const StatsView = () => {
  useRenderCount('StatsView')

  const {
    balance,
    studentsCount,
    activeBillsCount,
    isLoading
  } = useStats()

  return (
    <SimpleGrid cols={{ sm: 1, md: 2, lg: 3 }}>
      <StatCard title="Total students" isLoading={isLoading} value={studentsCount} />
      <StatCard title="Active bills" isLoading={isLoading} value={activeBillsCount} />
      <StatCard title="Net income" isLoading={isLoading} value={formatAmount(balance ?? 0)} />
    </SimpleGrid>
  )
}