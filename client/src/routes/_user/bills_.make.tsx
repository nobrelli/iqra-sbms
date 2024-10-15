import { PageWrapper } from '@/components/PageWrapper'
import { BillMaker } from '@/components/views/BillMaker'
import { useTitle } from '@/hooks/useTitle'
import { useAdminStore } from '@/lib/storeContext'
import { createFileRoute, Navigate } from '@tanstack/react-router'

export const Route = createFileRoute('/_user/bills/make')({
  component: BillMakerRouteComponent
})

function BillMakerRouteComponent() {
  useTitle('BillMakerRouteComponent')

  const selectedStudentIds = useAdminStore(state => state.selectedStudentIds)

  if (!selectedStudentIds) {
    return <Navigate to="/students" />
  }

  return (
    <PageWrapper title="Create bill">
      <BillMaker />
    </PageWrapper>
  )
}