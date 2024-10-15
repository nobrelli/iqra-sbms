import logo from '@/assets/logo.png'
import { LoginForm } from '@/components/forms/LoginForm'
import { useRenderCount } from '@/hooks/useRenderCount'
import { useTitle } from '@/hooks/useTitle'
import { useAdminStore } from '@/lib/storeContext'
import { Card, Container, Image, Stack, Title } from '@mantine/core'
import { createFileRoute, Navigate, redirect } from '@tanstack/react-router'
import { useEffect } from 'react'

type SearchParams = {
  redirect?: string
}

export const Route = createFileRoute('/login')({
  component: LoginRouteComponent,
  validateSearch: (search: SearchParams): SearchParams => ({
    redirect: search.redirect
  }),
  beforeLoad: ({ context, search }) => {
    if (context.isAuth) {
      throw redirect({ to: search.redirect || '/' })
    }
  }
})

function LoginRouteComponent() {
  useRenderCount('LoginRouteComponent')
  useTitle('Log in')

  const redirect = Route.useSearch().redirect
  const { isAuth, isLoggingOut, setIsLoggingOut } = useAdminStore()

  useEffect(() => {
    setIsLoggingOut(false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggingOut])
  
  return isAuth ? <Navigate to={redirect || '/'} /> : (
    <Container size="xs" mt="100">
      <Stack align="center" mb="lg">
        <Image src={logo} radius="xl" w={100} h={100} />
        <Title order={3}>
          Admin Log in
        </Title>
      </Stack>
      <Card withBorder>
        <LoginForm />
      </Card>
    </Container>
  )
}
