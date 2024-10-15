/* eslint-disable react-refresh/only-export-components */
import '@/lib/dayjs'
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { PropsWithChildren, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { useRenderCount } from './hooks/useRenderCount'
import { useAdminStore } from './lib/storeContext'
import { colorSchemeManager, theme } from './lib/theme'
import { routeTree } from './routeTree.gen'
import { FetchResponse, RequestError } from './types/utils'
import { notify } from './utils/notif'

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
  context: {
    queryClient: undefined!,
    isAuth: undefined!
  }
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

declare module '@tanstack/react-query' {
  interface Register {
    defaultError: RequestError
  }
}

const QueryClientHolder = ({ children }: PropsWithChildren) => {
  useRenderCount('QueryClientHolder')

  const STALE_TIME = 7 * 60 * 1000 // 7 mins
  const GC_TIME = 5 * 60 * 1000 // 5 mins

  const setError = useAdminStore(state => state.setError)

  const onSuccess = (data: unknown) => {
    const message = (data as FetchResponse<unknown>).meta.message

    if (message) {
      notify({
        title: 'Success',
        message,
        severity: 'success'
      })
    }
  }

  const onError = (error: RequestError) => {
    setError(error)
    notify({
      title: 'Failed',
      message: error.message ?? `An error occurred. Code: ${error.code}`,
      severity: 'error'
    })
  }

  const [queryClient] = useState(new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnReconnect: true,
        staleTime: STALE_TIME,
        gcTime: GC_TIME,
        retry: false,
      },
      mutations: {
        gcTime: GC_TIME,
        retry: false
      }
    },
    queryCache: new QueryCache({
      onSuccess,
      onError
    }),
    mutationCache: new MutationCache({
      onSuccess,
      onError
    })
  }))

  router.update({
    context: {
      queryClient,
      isAuth: undefined!
    }
  })

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

const App = () => {
  useRenderCount('App')

  const isAuth = useAdminStore(state => state.isAuth)

  return (
    <MantineProvider
      theme={theme}
      colorSchemeManager={colorSchemeManager}
      defaultColorScheme="dark"
      classNamesPrefix="iqra"
    >
      <Notifications position="top-right" autoClose={5000} />
      <QueryClientHolder>
        <RouterProvider
          router={router}
          context={{
            isAuth
          }}
          notFoundMode='root'
        />
      </QueryClientHolder>
    </MantineProvider>
  )
}

const rootElement = document.getElementById('iqra-root')!

if (!rootElement.innerHTML) {
  const root = createRoot(rootElement)

  root.render(
    // <StrictMode>
    <App />
    // </StrictMode>
  )
}