import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import TanStackQueryDevtools from '../components/tanstack-query/devtools'
import { Provider as ReactQueryProvider } from '../components/tanstack-query/root-provider'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'
import { NavigationBar } from '@/components/util/navigation-bar'
import { NotFound } from '@/components/util/not-found'
import { Toaster } from '@/components/ui/sonner'
import { getThemeServerFn } from '@/lib/theme'
import { ThemeProvider } from '@/components/util/theme-provider'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Type A Traveler',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  loader: () => getThemeServerFn(),
  shellComponent: RootDocument,
  notFoundComponent: () => <NotFound />,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const theme = Route.useLoaderData()
  const { queryClient } = Route.useRouteContext()

  return (
    <html lang="en" className={theme}>
      <head>
        <HeadContent />
      </head>
      <body className="h-full flex flex-col">
        <ReactQueryProvider queryClient={queryClient}>
          <ThemeProvider theme={theme}>
            <NavigationBar />
            <main className="flex-1 min-h-0">{children}</main>
            <Toaster />
          </ThemeProvider>
        </ReactQueryProvider>
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
