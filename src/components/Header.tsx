import { Link } from '@tanstack/react-router'

// Material Symbols component
const MaterialIcon = ({ name, className = "w-5 h-5" }: { name: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`} style={{ fontSize: 'inherit' }}>
    {name}
  </span>
);

export const Header = () => {
  return (
    <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mr-4 shadow-lg">
              <MaterialIcon name="business" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">RealEstate Manager</h1>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center space-x-3">
            <Link to="/map" search={{ propertyId: undefined }}>
              {({ isActive }) => (
                <button
                  className={`
                    relative flex items-center justify-center w-32 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group
                    ${isActive 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25' 
                      : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 shadow-md hover:shadow-lg border border-gray-200'
                    }
                  `}
                >
                  <MaterialIcon 
                    name="map" 
                    className={`w-5 h-5 mr-3 transition-transform duration-300 group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-gray-500'
                    }`} 
                  />
                  <span>Map</span>
                  {!isActive && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  )}
                </button>
              )}
            </Link>
            
            <Link to="/properties">
              {({ isActive }) => (
                <button
                  className={`
                    relative flex items-center justify-center w-32 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group
                    ${isActive 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25' 
                      : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 shadow-md hover:shadow-lg border border-gray-200'
                    }
                  `}
                >
                  <MaterialIcon 
                    name="table_view" 
                    className={`w-5 h-5 mr-3 transition-transform duration-300 group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-gray-500'
                    }`} 
                  />
                  <span>Portfolio</span>
                  {!isActive && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  )}
                </button>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};