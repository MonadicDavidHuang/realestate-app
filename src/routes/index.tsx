import { createFileRoute, Navigate } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return <Navigate to="/map" search={{ propertyId: undefined }} />
}