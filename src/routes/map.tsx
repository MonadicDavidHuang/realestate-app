import { createFileRoute } from '@tanstack/react-router'
import { GoogleMap } from '../components/GoogleMap'

export const Route = createFileRoute('/map')({
  component: MapPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      propertyId: search.propertyId as string | undefined,
    }
  },
})

function MapPage() {
  const { propertyId } = Route.useSearch()
  
  return <GoogleMap focusPropertyId={propertyId} />
}