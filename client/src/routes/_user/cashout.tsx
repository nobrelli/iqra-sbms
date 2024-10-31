import { CashoutListView } from '@/components/views/CashoutListView'
import { PageWrapper } from '@/components/PageWrapper'
import { useRenderCount } from '@/hooks/useRenderCount'
import { useTitle } from '@/hooks/useTitle'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_user/cashout')({
  component: CashoutRouteComponent,
})

function CashoutRouteComponent() {
  useRenderCount('CashoutRouteComponent')
  useTitle('Cash out')
  
  return (
    <PageWrapper title="Cash Outflows">
      <CashoutListView />
    </PageWrapper>
  )
}