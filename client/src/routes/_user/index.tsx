import { StatsView } from '@/components/views/StatsView'
import { PageWrapper } from '@/components/PageWrapper'
import { useRenderCount } from '@/hooks/useRenderCount'
import { useTitle } from '@/hooks/useTitle'
import {
  createFileRoute
} from '@tanstack/react-router'

export const Route = createFileRoute('/_user/')({
  component: DashboardRouteComponent,
})

function DashboardRouteComponent() {
  useRenderCount('DashboardRouteComponent')
  useTitle('Dashboard')

  return (
    <PageWrapper title="Dashboard">
      <StatsView />
    </PageWrapper>
  )
}
