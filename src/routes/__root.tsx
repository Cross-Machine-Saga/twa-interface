import { Outlet, createRootRoute } from '@tanstack/react-router'
import { Provider } from '@/providers'
import { NotFoundPage } from "./not-found";
// import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
// import { TanStackDevtools } from '@tanstack/react-devtools'


export const Route = createRootRoute({
  component: () => (
    <Provider>
      <Outlet />
      {/* <TanStackDevtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      /> */}
    </ Provider>
  ),
  notFoundComponent: NotFoundPage
})
