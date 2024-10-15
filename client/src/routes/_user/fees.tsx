import { PageWrapper } from '@/components/PageWrapper'
import { FeesListView } from '@/components/views/FeesListView'
import { useRenderCount } from '@/hooks/useRenderCount'
import { useTitle } from '@/hooks/useTitle'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_user/fees')({
  component: FeesRouteComponent,
})

function FeesRouteComponent() {
  useRenderCount('FeesRouteComponent')
  useTitle('Fees')

  return (
    <PageWrapper title="Fees">
      <FeesListView />
    </PageWrapper>
  )
}