'use client';

import React, { useState, useEffect, useRef } from 'react';

interface GooglePlacesAutocompleteProps {
  id: string;
  name: string;
  value: string;
  onChange: (value: string, placeId?: string, postcode?: string) => void;
  placeholder: string;
  error: boolean;
  className?: string;
}

// Global type declaration for Google Maps API
declare global {
  interface Window {
    google: any;
  }
}

export default function GooglePlacesAutocomplete({
  id,
  name,
  value,
  onChange,
  placeholder,
  error,
  className = '',
}: GooglePlacesAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [autocomplete, setAutocomplete] = useState<any>(null);

  // Function to initialize autocomplete
  const initAutocomplete = () => {
    if (inputRef.current && window.google && window.google.maps && window.google.maps.places) {
      try {
        const autocompleteInstance = new window.google.maps.places.Autocomplete(inputRef.current, {
          componentRestrictions: { country: 'gb' }, // Restrict to UK
          fields: ['address_components', 'formatted_address', 'place_id', 'geometry'],
        });

        autocompleteInstance.addListener('place_changed', () => {
          const place = autocompleteInstance.getPlace();
          if (place && place.formatted_address) {
            // Extract postcode from address components
            let postcode = '';
            if (place.address_components) {
              for (const component of place.address_components) {
                if (component.types.includes('postal_code')) {
                  postcode = component.long_name;
                  break;
                }
              }
            }
            onChange(place.formatted_address, place.place_id, postcode);
          }
        });

        setAutocomplete(autocompleteInstance);
        setLoaded(true);
      } catch (error) {
        console.error('Error initializing Google Places Autocomplete:', error);
      }
    }
  };

  // Load Google Maps API script
  useEffect(() => {
    // Skip on server-side
    if (typeof window === 'undefined') return;

    // If Google Maps is already loaded
    if (window.google && window.google.maps && window.google.maps.places) {
      initAutocomplete();
      return;
    }

    // Get API key, with fallback for deployment
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'placeholder_key';
    
    // Load the script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.id = 'google-maps-script';
    
    // Set up script load handler
    script.onload = () => {
      initAutocomplete();
    };
    
    // Handle errors
    script.onerror = () => {
      console.error('Failed to load Google Maps API script');
    };
    
    // Add script to document
    document.head.appendChild(script);

    // Cleanup
    return () => {
      const existingScript = document.getElementById('google-maps-script');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  return (
    <input
      ref={inputRef}
      type="text"
      id={id}
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
        error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
      } ${className}`}
      disabled={!loaded}
    />
  );
}
