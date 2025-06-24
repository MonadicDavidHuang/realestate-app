import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { PropertyRepository } from '../services/propertyRepository';
import type { Property } from '../types/property';

// Material Symbols component
const MaterialIcon = ({ name, className = "w-5 h-5" }: { name: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`} style={{ fontSize: 'inherit' }}>
    {name}
  </span>
);

interface GoogleMapProps {
  focusPropertyId?: string;
}

export const GoogleMap = ({ focusPropertyId }: GoogleMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowsRef = useRef<google.maps.InfoWindow[]>([]);
  const focusedOpenedRef = useRef<string | null>(null);

  useEffect(() => {
    const loadProperties = async () => {
      try {
        let allProperties = await PropertyRepository.getAll();
        
        // If no properties exist, add sample data
        if (allProperties.length === 0) {
          allProperties = await PropertyRepository.addSampleData();
        }
        
        setProperties(allProperties);
      } catch (error) {
        console.error('Error loading properties:', error);
      }
    };

    loadProperties();
  }, []);

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
        version: 'weekly',
      });

      try {
        await loader.load();
        
        if (mapRef.current && !mapInstanceRef.current) {
          mapInstanceRef.current = new google.maps.Map(mapRef.current, {
            center: { lat: 37.7749, lng: -122.4194 }, // San Francisco
            zoom: 12,
          });
        }
      } catch (error) {
        console.error('Error loading Google Maps:', error);
      }
    };

    initMap();
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers and info windows
    markersRef.current.forEach(marker => marker.setMap(null));
    infoWindowsRef.current.forEach(infoWindow => infoWindow.close());
    markersRef.current = [];
    infoWindowsRef.current = [];
    
    // Reset focused tracking when properties or focusPropertyId changes
    if (focusedOpenedRef.current !== focusPropertyId) {
      focusedOpenedRef.current = null;
    }

    const focusedProperty = properties.find(property => focusPropertyId === property.id);
    let focusedInfoWindow: google.maps.InfoWindow | null = null;

    // Add markers for each property
    properties.forEach(property => {
      const isFocused = focusPropertyId === property.id;

      const marker = new google.maps.Marker({
        position: { lat: property.lat, lng: property.lng },
        map: mapInstanceRef.current,
        title: property.name,
        icon: isFocused ? {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: '#ef4444',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 3,
        } : undefined,
        zIndex: isFocused ? 1000 : 1,
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: #111827;">${property.name}</h3>
            <p style="margin: 0 0 12px 0; font-weight: bold; color: #059669; font-size: 18px;">$${property.price.toLocaleString()}</p>
            ${isFocused ? '<p style="margin: 0 0 12px 0; color: #ef4444; font-size: 12px; font-weight: 500;">📍 Focused Property</p>' : ''}
            <a href="/properties/${property.id}" style="display: inline-flex; align-items: center; padding: 8px 16px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 500; transition: background-color 0.2s;">
              <span style="margin-right: 6px;">📋</span>
              View Details
            </a>
          </div>
        `
      });

      marker.addListener('click', () => {
        // Close all other info windows
        infoWindowsRef.current.forEach(iw => iw.close());
        infoWindow.open(mapInstanceRef.current, marker);
      });

      markersRef.current.push(marker);
      infoWindowsRef.current.push(infoWindow);

      // Store the focused info window and marker to open it later
      if (isFocused) {
        focusedInfoWindow = infoWindow;
      }
    });

    // Auto-open info window for focused property after all markers are created
    if (focusedInfoWindow && focusedProperty && focusedOpenedRef.current !== focusPropertyId) {
      // Use a slight delay to ensure all DOM operations are complete
      requestAnimationFrame(() => {
        // Close all info windows first
        infoWindowsRef.current.forEach(iw => iw.close());
        // Open only the focused one
        const focusedMarker = markersRef.current.find(marker => 
          marker.getPosition()?.lat() === focusedProperty.lat && 
          marker.getPosition()?.lng() === focusedProperty.lng
        );
        if (focusedMarker && focusedInfoWindow && focusedOpenedRef.current !== focusPropertyId) {
          focusedInfoWindow.open(mapInstanceRef.current, focusedMarker);
          focusedOpenedRef.current = focusPropertyId || null;
        }
      });
    }

    // Handle map centering and zoom
    if (focusedProperty) {
      // Focus on specific property
      mapInstanceRef.current.setCenter({ 
        lat: focusedProperty.lat, 
        lng: focusedProperty.lng 
      });
      mapInstanceRef.current.setZoom(16);
    } else if (properties.length > 1) {
      // Fit bounds to show all properties
      const bounds = new google.maps.LatLngBounds();
      properties.forEach(property => {
        bounds.extend({ lat: property.lat, lng: property.lng });
      });
      mapInstanceRef.current.fitBounds(bounds);
    } else if (properties.length === 1) {
      // Center on single property
      const property = properties[0];
      mapInstanceRef.current.setCenter({ 
        lat: property.lat, 
        lng: property.lng 
      });
      mapInstanceRef.current.setZoom(15);
    }
  }, [properties, focusPropertyId]);


  const handleShowAllMarkers = () => {
    // Open all info windows
    infoWindowsRef.current.forEach((infoWindow, index) => {
      const marker = markersRef.current[index];
      if (marker && infoWindow) {
        infoWindow.open(mapInstanceRef.current, marker);
      }
    });
  };

  const handleHideAllMarkers = () => {
    // Close all info windows
    infoWindowsRef.current.forEach(infoWindow => {
      infoWindow.close();
    });
  };

  return (
    <div className="w-full h-full bg-gray-100 p-4 flex flex-col">
      {/* Control Buttons Header */}
      <div className="flex justify-start mb-4">
        <div className="flex space-x-2">
          <button
            onClick={handleShowAllMarkers}
            className="inline-flex items-center px-3 py-2 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-md shadow-lg border border-gray-300 transition-colors duration-200"
            title="Show all property info windows"
          >
            <MaterialIcon name="visibility" className="w-4 h-4 mr-2" />
            Show All
          </button>
          
          <button
            onClick={handleHideAllMarkers}
            className="inline-flex items-center px-3 py-2 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-md shadow-lg border border-gray-300 transition-colors duration-200"
            title="Hide all property info windows"
          >
            <MaterialIcon name="visibility_off" className="w-4 h-4 mr-2" />
            Hide All
          </button>
        </div>
      </div>

      {/* Google Map */}
      <div className="flex-1">
        <div 
          ref={mapRef} 
          className="w-full h-full rounded-lg shadow-lg border border-gray-300"
        />
      </div>
    </div>
  );
};