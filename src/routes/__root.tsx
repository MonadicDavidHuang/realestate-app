import { createRootRoute, Outlet } from '@tanstack/react-router'
import { Header } from '../components/Header'

export const Route = createRootRoute({
  component: () => (
    <div className="h-screen flex flex-col bg-gray-100">
      <Header />
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  ),
})