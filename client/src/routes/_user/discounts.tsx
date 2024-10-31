import { DiscountsListView } from '@/components/views/DiscountsListView'
import { PageWrapper } from '@/components/PageWrapper'
import { useRenderCount } from '@/hooks/useRenderCount'
import { useTitle } from '@/hooks/useTitle'
import { createFileRoute } from '@tanstack/react-router'


export const Route = createFileRoute('/_user/discounts')({
  component: DiscountsRouteComponent
})

function DiscountsRouteComponent() {
  useRenderCount('DiscountsRouteComponent')
  useTitle('Discounts')

  return (
    <PageWrapper title="Discounts">
      <DiscountsListView />
    </PageWrapper>
  )
}