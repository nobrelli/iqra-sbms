import { BillsDataGrid } from '@/components/views/BillsListView'
import { PageWrapper } from '@/components/PageWrapper'
import { useRenderCount } from '@/hooks/useRenderCount'
import { useTitle } from '@/hooks/useTitle'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_user/bills')({
  component: BillsRouteComponent,
})

function BillsRouteComponent() {
  useRenderCount('BillsRouteComponent')
  useTitle('Bills')


  return (
    <PageWrapper title="Bills">
      <BillsDataGrid />
    </PageWrapper>
  )
}