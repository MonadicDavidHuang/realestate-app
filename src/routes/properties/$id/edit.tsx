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

export const Route = createFileRoute('/properties/$id/edit')({
  component: PropertyEditPage,
})

function PropertyEditPage() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const [property, setProperty] = useState<Property | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    lat: '',
    lng: '',
    price: ''
  })

  useEffect(() => {
    const loadProperty = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const propertyData = await PropertyRepository.getById(id)
        if (propertyData) {
          setProperty(propertyData)
          setFormData({
            name: propertyData.name,
            lat: propertyData.lat.toString(),
            lng: propertyData.lng.toString(),
            price: propertyData.price.toString()
          })
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!property) return

    const lat = parseFloat(formData.lat)
    const lng = parseFloat(formData.lng)
    const price = parseFloat(formData.price)

    if (isNaN(lat) || isNaN(lng) || isNaN(price)) {
      alert('Please enter valid numbers for coordinates and price')
      return
    }

    if (!formData.name.trim()) {
      alert('Please enter a property name')
      return
    }

    setIsSaving(true)
    try {
      await PropertyRepository.update(property.id, {
        name: formData.name.trim(),
        lat,
        lng,
        price
      })
      
      navigate({ to: '/properties/$id', params: { id: property.id } })
    } catch (error) {
      console.error('Error updating property:', error)
      alert('Failed to update property')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="h-full bg-gray-100 p-4 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Loading property...</span>
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
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link to="/properties/$id" params={{ id: property.id }}>
            <button className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 mb-4">
              <MaterialIcon name="arrow_back" className="w-4 h-4 mr-1" />
              Back to Property Details
            </button>
          </Link>
          
          <div className="flex items-center mb-4">
            <MaterialIcon name="edit" className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Property</h1>
              <p className="text-gray-600">Update property information</p>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-300 overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <div className="flex items-center">
              <MaterialIcon name="business" className="w-6 h-6 text-white mr-3" />
              <div>
                <h2 className="text-xl font-semibold text-white">Property Information</h2>
                <p className="text-blue-100 text-sm">ID: {property.id}</p>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              {/* Property Name */}
              <div>
                <label htmlFor="name" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <MaterialIcon name="business" className="w-4 h-4 mr-2 text-gray-500" />
                  Property Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter property name"
                />
              </div>

              {/* Coordinates Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="lat" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <MaterialIcon name="location_on" className="w-4 h-4 mr-2 text-gray-500" />
                    Latitude
                  </label>
                  <input
                    type="number"
                    id="lat"
                    name="lat"
                    value={formData.lat}
                    onChange={handleInputChange}
                    required
                    step="any"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="e.g., 37.7749"
                  />
                </div>

                <div>
                  <label htmlFor="lng" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <MaterialIcon name="location_on" className="w-4 h-4 mr-2 text-gray-500" />
                    Longitude
                  </label>
                  <input
                    type="number"
                    id="lng"
                    name="lng"
                    value={formData.lng}
                    onChange={handleInputChange}
                    required
                    step="any"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="e.g., -122.4194"
                  />
                </div>
              </div>

              {/* Price */}
              <div>
                <label htmlFor="price" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <MaterialIcon name="attach_money" className="w-4 h-4 mr-2 text-gray-500" />
                  Price (USD)
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., 850000"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="mt-8 flex items-center justify-end pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md transition-colors duration-200 shadow-sm"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <MaterialIcon name="save" className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Current Property Info */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <MaterialIcon name="info" className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-900">Current Property Information</h4>
              <div className="text-sm text-blue-700 mt-1 space-y-1">
                <p><strong>Name:</strong> {property.name}</p>
                <p><strong>Location:</strong> {property.lat.toFixed(6)}, {property.lng.toFixed(6)}</p>
                <p><strong>Price:</strong> ${property.price.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}