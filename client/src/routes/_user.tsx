import { AppShell, Burger, useComputedColorScheme, useMantineTheme } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { useEffect, useLayoutEffect, useRef } from 'react'

import { Header } from '@/components/Header'
import { LoadingOverlay } from '@/components/LoadingOverlay'
import { ReauthModal } from '@/components/modals/ReauthModal'
import { Sidebar } from '@/components/Sidebar'
import { ErrorComponent } from '@/components/views/Error'
import { useRenderCount } from '@/hooks/useRenderCount'
import { useAdminStore } from '@/lib/storeContext'
import { HttpStatusCode } from '@/types/http'
import { FormModalHandle } from '@/types/modals'
import { LoginFields } from '@/types/schemas'


export const Route = createFileRoute('/_user')({
  component: UserLayoutComponent,
  errorComponent: ErrorComponent,
  beforeLoad: ({ context, location }) => {
    if (!context.isAuth) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href
        }
      })
    }
  }
})

const AuthManager = () => {
  useRenderCount('AuthManager')

  const error = useAdminStore(state => state.error)
  const isLoggingOut = useAdminStore(state => state.isLoggingOut)
  const reauthModalRef = useRef<FormModalHandle<LoginFields>>(null)

  useEffect(() => {
    if (error && error.code === HttpStatusCode.Unauthorized)
      reauthModalRef.current?.open()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error?.message, error?.code])

  return (
    <>
      <LoadingOverlay visible={isLoggingOut} zIndex={999} />
      <ReauthModal ref={reauthModalRef} />
    </>
  )
}

function UserLayoutComponent() {
  useRenderCount('UserLayoutComponent')

  const [opened, { toggle }] = useDisclosure()
  const colorScheme = useComputedColorScheme()
  const theme = useMantineTheme()
  const appShellMainRef = useRef<HTMLElement>(null)

  const bgColor = colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[1]

  useLayoutEffect(() => {
    if (appShellMainRef.current) {
      appShellMainRef.current.style.backgroundColor = bgColor
    }
  }, [bgColor])

  return (
    <>
      <AuthManager />
      <AppShell
        header={{ height: 80 }}
        navbar={{
          width: 300,
          breakpoint: "sm",
          collapsed: { mobile: !opened }
        }}
        transitionDuration={500}
        transitionTimingFunction='ease-in-out'
      >
        <AppShell.Navbar>
          <Sidebar />
        </AppShell.Navbar>
        <AppShell.Header>
          <Header burger={
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
          }
          />
        </AppShell.Header>
        <AppShell.Main ref={appShellMainRef}>
          <Outlet />
        </AppShell.Main>
      </AppShell>
    </>
  )
}
