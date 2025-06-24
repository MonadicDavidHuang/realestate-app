import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import type { Property } from '../types/property';

// Material Symbols component
const MaterialIcon = ({ name, className = "w-5 h-5" }: { name: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`} style={{ fontSize: 'inherit' }}>
    {name}
  </span>
);

interface PropertyTableProps {
  properties: Property[];
  onDelete: (id: string) => void;
  onRefresh: () => void;
}

export const PropertyTable = ({ properties, onDelete, onRefresh }: PropertyTableProps) => {
  const [sortField, setSortField] = useState<keyof Property>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: keyof Property) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedProperties = [...properties].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      await onDelete(id);
      onRefresh();
    }
  };

  const SortableHeader = ({ field, children }: { field: keyof Property; children: React.ReactNode }) => (
    <th 
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        {sortField === field && (
          <MaterialIcon 
            name={sortDirection === 'asc' ? 'keyboard_arrow_up' : 'keyboard_arrow_down'} 
            className="w-4 h-4" 
          />
        )}
      </div>
    </th>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-300 overflow-hidden">
      {/* Header */}
      <div className="bg-slate-900 px-6 py-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-start">
            <MaterialIcon name="table_view" className="w-6 h-6 text-white mr-3 mt-1" />
            <div>
              <h2 className="text-x5 font-semibold text-white">Property Portfolio</h2>
              <p className="text-sm text-slate-300">{properties.length} properties in database</p>
            </div>
          </div>
          <Link to="/properties/new">
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center">
              <MaterialIcon name="add" className="w-4 h-4 mr-2" />
              New Property
            </button>
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <SortableHeader field="name">Property Name</SortableHeader>
              <SortableHeader field="price">Price</SortableHeader>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedProperties.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center">
                    <MaterialIcon name="inbox" className="w-12 h-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Properties Found</h3>
                    <p className="text-gray-500">Start by adding some properties to your portfolio.</p>
                  </div>
                </td>
              </tr>
            ) : (
              sortedProperties.map((property, index) => (
                <tr 
                  key={property.id}
                  className={`hover:bg-gray-50 transition-colors duration-200 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <MaterialIcon name="business" className="w-5 h-5 text-gray-400 mr-3" />
                      <div className="text-sm font-medium text-gray-900">{property.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-green-600">
                      ${property.price.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <Link to="/properties/$id" params={{ id: property.id }}>
                        <button className="inline-flex items-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors duration-200 shadow-sm hover:shadow-md">
                          <MaterialIcon name="info" className="w-4 h-4 mr-2" />
                          Details
                        </button>
                      </Link>
                      {/* <Link to="/properties/$id/edit" params={{ id: property.id }}>
                        <button className="inline-flex items-center px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-md transition-colors duration-200 shadow-sm hover:shadow-md">
                          <MaterialIcon name="edit" className="w-4 h-4 mr-2" />
                          Edit
                        </button>
                      </Link> */}
                      <Link
                        to="/map"
                        search={{ propertyId: property.id }}
                      >
                        <button className="inline-flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors duration-200 shadow-sm hover:shadow-md">
                          <MaterialIcon name="map" className="w-4 h-4 mr-2" />
                          Map
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(property.id, property.name)}
                        className="inline-flex items-center px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors duration-200 shadow-sm hover:shadow-md"
                      >
                        <MaterialIcon name="delete" className="w-4 h-4 mr-2" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {properties.length > 0 && (
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {properties.length} {properties.length === 1 ? 'property' : 'properties'}
            </div>
            <div className="text-sm text-gray-500">
              Total portfolio value: ${properties.reduce((sum, p) => sum + p.price, 0).toLocaleString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};