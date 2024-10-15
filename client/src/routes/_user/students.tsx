import { PageWrapper } from '@/components/PageWrapper'
import { StudentsListView } from '@/components/views/StudentListView'
import { useRenderCount } from '@/hooks/useRenderCount'
import { useTitle } from '@/hooks/useTitle'
import { useAdminStore } from '@/lib/storeContext'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/_user/students')({
  component: StudentsRouteComponent,
})

function StudentsRouteComponent() {
  useRenderCount('StudentsRouteComponent')
  useTitle('Students')

  const selectedStudentIds = useAdminStore(state => state.selectedStudentIds)
  const setSelectedStudentIds = useAdminStore(state => state.setSelectedStudentIds)

  useEffect(() => {
    if (selectedStudentIds)
      setSelectedStudentIds(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <PageWrapper title="Students">
      <StudentsListView />
    </PageWrapper>
  )
}