import { useState } from 'react';
import type { Property } from '../types/property';

// Material Symbols component
const MaterialIcon = ({ name, className = "w-6 h-6" }: { name: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`} style={{ fontSize: 'inherit' }}>
    {name}
  </span>
);

interface PropertyFormProps {
  onSubmit: (property: Omit<Property, 'id'>) => void;
}

export const PropertyForm = ({ onSubmit }: PropertyFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    lat: 37.7749,
    lng: -122.4194,
    price: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && Number(formData.price) > 0) {
      onSubmit({
        ...formData,
        price: Number(formData.price)
      });
      // Reset form after successful submission
      setFormData({
        name: '',
        lat: 37.7749,
        lng: -122.4194,
        price: ''
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' && name !== 'price' ? Number(value) : value
    }));
  };

  return (
    <div className="h-full bg-white rounded-lg shadow-lg border border-gray-300">
      {/* Header Section */}
      <div className="bg-slate-900 px-8 py-6 border-b rounded-t-lg">
        <div className="flex items-center mb-2">
          <div className="w-8 h-8 bg-blue-500 rounded-sm flex items-center justify-center mr-3">
            <MaterialIcon name="business" className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white">Property Management</h1>
            <p className="text-sm text-slate-300">Add new property listing</p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Property Information Card */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4 border-b border-gray-200 pb-2">
              Property Information
            </h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Property Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-sm"
                  placeholder="Enter property name"
                />
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  Price (USD) *
                </label>
                <div className="relative">
                  {/* <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm font-medium">$</span> */}
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-sm"
                    placeholder="Enter price"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Location Card */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4 border-b border-gray-200 pb-2">
              Geographic Coordinates
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="lat" className="block text-sm font-medium text-gray-700 mb-2">
                  Latitude *
                </label>
                <input
                  type="number"
                  id="lat"
                  name="lat"
                  value={formData.lat}
                  onChange={handleChange}
                  required
                  step="any"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-sm font-mono"
                  placeholder="37.7749"
                />
              </div>

              <div>
                <label htmlFor="lng" className="block text-sm font-medium text-gray-700 mb-2">
                  Longitude *
                </label>
                <input
                  type="number"
                  id="lng"
                  name="lng"
                  value={formData.lng}
                  onChange={handleChange}
                  required
                  step="any"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-sm font-mono"
                  placeholder="-122.4194"
                />
              </div>
            </div>
            
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-xs text-blue-700">
                <MaterialIcon name="info" className="w-4 h-4 inline mr-1" />
                Coordinates will be used to position the property marker on the map
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 border-t border-gray-200">
            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 px-6 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
            >
              <span className="flex items-center justify-center">
                <MaterialIcon name="add_business" className="w-5 h-5 mr-2" />
                Add Property to Portfolio
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};