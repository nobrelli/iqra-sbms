import { NotFound } from '@/components/views/NotFound'
import { useRenderCount } from '@/hooks/useRenderCount'
import { RouteContextProps } from '@/types/utils'
import '@fontsource-variable/dm-sans'
import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import '@mantine/notifications/styles.css'
import '@mantine/nprogress/styles.css'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'

// const TanStackRouterDevtools =
//   import.meta.env.NODE_ENV === 'production'
//     ? () => null
//     : React.lazy(() =>
//       import('@tanstack/router-devtools').then(res => ({
//         default: res.TanStackRouterDevtools,
//       }))
//     )

// const ReactQueryDevtools =
//   import.meta.env.NODE_ENV === 'production'
//     ? () => null
//     : React.lazy(() =>
//       import('@tanstack/react-query-devtools').then(res => ({
//         default: res.ReactQueryDevtools,
//       }))
//     )

export const Route = createRootRouteWithContext<RouteContextProps>()({
  component: RootRouteComponent,
  notFoundComponent: NotFound,
})

function RootRouteComponent() {
  useRenderCount('RootRouteComponent')

  return (
    <>
      <Outlet />
      {/* <Suspense>
        <ReactQueryDevtools buttonPosition="bottom-left" />
        <TanStackRouterDevtools position="bottom-right" />
      </Suspense> */}
    </>
  )
}