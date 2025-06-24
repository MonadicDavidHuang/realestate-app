import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { PropertyRepository } from '../../../services/propertyRepository'
import type { Property } from '../../../types/property'

// Material Symbols component
const MaterialIcon = ({ name, className = "w-5 h-5" }: { name: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`} style={{ fontSize: 'inherit' }}>
    {name}
  </span>
);

export const Route = createFileRoute('/properties/$id/')({
  component: PropertyDetailPage,
})

function PropertyDetailPage() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const [property, setProperty] = useState<Property | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProperty = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const propertyData = await PropertyRepository.getById(id)
        if (propertyData) {
          setProperty(propertyData)
        } else {
          setError('Property not found')
        }
      } catch (error) {
        console.error('Error loading property:', error)
        setError('Failed to load property')
      } finally {
        setIsLoading(false)
      }
    }

    loadProperty()
  }, [id])

  const handleDelete = async () => {
    if (!property) return
    
    if (confirm(`Are you sure you want to delete "${property.name}"?`)) {
      try {
        await PropertyRepository.delete(property.id)
        navigate({ to: '/properties' })
      } catch (error) {
        console.error('Error deleting property:', error)
        alert('Failed to delete property')
      }
    }
  }

  if (isLoading) {
    return (
      <div className="h-full bg-gray-100 p-4 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Loading property details...</span>
        </div>
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="h-full bg-gray-100 p-4 flex items-center justify-center">
        <div className="text-center">
          <MaterialIcon name="error" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Property Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The requested property could not be found.'}</p>
          <Link to="/properties">
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200">
              <MaterialIcon name="arrow_back" className="w-4 h-4 mr-2" />
              Back to Properties
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full bg-gray-100 p-6 overflow-auto">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link to="/properties">
            <button className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 mb-4">
              <MaterialIcon name="arrow_back" className="w-4 h-4 mr-1" />
              Back to Portfolio
            </button>
          </Link>
          
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center mb-2">
                <MaterialIcon name="business" className="w-8 h-8 text-blue-600 mr-3" />
                <h1 className="text-3xl font-bold text-gray-900">{property.name}</h1>
              </div>
              <div className="flex items-center text-gray-600 ml-11">
                Property Detail
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Link to="/properties/$id/edit" params={{ id: property.id }}>
                <button className="inline-flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md transition-colors duration-200 shadow-sm">
                  <MaterialIcon name="edit" className="w-4 h-4 mr-2" />
                  Edit Property
                </button>
              </Link>
              
              <Link to="/map" search={{ propertyId: property.id }}>
                <button className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 shadow-sm">
                  <MaterialIcon name="map" className="w-4 h-4 mr-2" />
                  View on Map
                </button>
              </Link>
              
              <button
                onClick={handleDelete}
                className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-200 shadow-sm"
              >
                <MaterialIcon name="delete" className="w-4 h-4 mr-2" />
                Delete Property
              </button>
            </div>
          </div>
        </div>

        {/* Property Details Card */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-300 overflow-hidden">
          {/* Price Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  ${property.price.toLocaleString()}
                </h2>
                <p className="text-green-100">Property Value</p>
              </div>
              <MaterialIcon name="attach_money" className="w-12 h-12 text-green-100" />
            </div>
          </div>

          {/* Property Information */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <MaterialIcon name="info" className="w-5 h-5 mr-2 text-blue-600" />
                    Property Information
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Property ID</span>
                      <span className="font-mono text-sm text-gray-900">{property.id}</span>
                    </div>
                    
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Property Name</span>
                      <span className="font-semibold text-gray-900">{property.name}</span>
                    </div>
                    
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Market Value</span>
                      <span className="font-bold text-green-600">${property.price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <MaterialIcon name="location_on" className="w-5 h-5 mr-2 text-red-600" />
                    Location Details
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Latitude</span>
                      <span className="font-mono text-sm text-gray-900">{property.lat.toFixed(6)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Longitude</span>
                      <span className="font-mono text-sm text-gray-900">{property.lng.toFixed(6)}</span>
                    </div>
                    
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Property ID: {property.id}
          </div>
          
        </div>
      </div>
    </div>
  )
}