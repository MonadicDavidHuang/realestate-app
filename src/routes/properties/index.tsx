import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { PropertyRepository } from '../../services/propertyRepository'
import { PropertyTable } from '../../components/PropertyTable'
import type { Property } from '../../types/property'

export const Route = createFileRoute('/properties/')({
  component: PropertiesPage,
})

function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadProperties = async () => {
    setIsLoading(true)
    try {
      const allProperties = await PropertyRepository.getAll()
      setProperties(allProperties)
    } catch (error) {
      console.error('Error loading properties:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await PropertyRepository.delete(id)
      await loadProperties() // Refresh the list
    } catch (error) {
      console.error('Error deleting property:', error)
    }
  }

  useEffect(() => {
    loadProperties()
  }, [])

  if (isLoading) {
    return (
      <div className="h-full bg-gray-100 p-4 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Loading properties...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full bg-gray-100 p-4">
      <PropertyTable 
        properties={properties}
        onDelete={handleDelete}
        onRefresh={loadProperties}
      />
    </div>
  )
}