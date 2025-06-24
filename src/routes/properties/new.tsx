import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { PropertyRepository } from '../../services/propertyRepository'

// Material Symbols component
const MaterialIcon = ({ name, className = "w-5 h-5" }: { name: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`} style={{ fontSize: 'inherit' }}>
    {name}
  </span>
);

export const Route = createFileRoute('/properties/new')({
  component: NewPropertyPage,
})

function NewPropertyPage() {
  const navigate = useNavigate()
  const [isSaving, setIsSaving] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    lat: '',
    lng: '',
    price: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

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
      const newProperty = await PropertyRepository.create({
        name: formData.name.trim(),
        lat,
        lng,
        price
      })
      
      navigate({ to: '/properties/$id', params: { id: newProperty.id } })
    } catch (error) {
      console.error('Error creating property:', error)
      alert('Failed to create property')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="h-full bg-gray-100 p-6 overflow-auto">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link to="/properties">
            <button className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 mb-4">
              <MaterialIcon name="arrow_back" className="w-4 h-4 mr-1" />
              Back to Properties
            </button>
          </Link>
          
          <div className="flex items-start mb-4">
            <MaterialIcon name="add_business" className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Property</h1>
              <p className="text-gray-600">Add a new property to your portfolio</p>
            </div>
          </div>
        </div>

        {/* Creation Form */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-300 overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
            <div className="flex items-center">
              <MaterialIcon name="business" className="w-6 h-6 text-white mr-3" />
              <div>
                <h2 className="text-xl font-semibold text-white">Property Information</h2>
                <p className="text-green-100 text-sm">New Property Form</p>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., 850000"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="mt-8 flex items-center justify-end pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-md transition-colors duration-200 shadow-sm"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <MaterialIcon name="add" className="w-4 h-4 mr-2" />
                    Create Property
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start">
            <MaterialIcon name="info" className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-green-900">Creating New Property</h4>
              <p className="text-sm text-green-700 mt-1">
                Fill in the property details below. The system will automatically assign a unique ID when the property is created.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}