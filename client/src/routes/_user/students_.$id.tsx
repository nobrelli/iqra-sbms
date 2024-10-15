import { useFetchStudent } from '@/api/student'
import { LoadingOverlay } from '@/components/LoadingOverlay'
import { PageWrapper } from '@/components/PageWrapper'
import { StudentInfo } from '@/components/views/StudentInfo'
import { useTitle } from '@/hooks/useTitle'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_user/students/$id')({
  component: StudentRouteComponent,
})

function StudentRouteComponent() {
  useTitle('Student')

  const { student, isLoading } = useFetchStudent(Route.useParams().id)

  return (
    <PageWrapper title="Student Data">
      <LoadingOverlay visible={isLoading} />
      {!isLoading && student && <StudentInfo student={student} />}
    </PageWrapper>
  )
}
