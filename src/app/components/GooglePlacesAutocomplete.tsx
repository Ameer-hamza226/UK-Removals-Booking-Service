'use client';

import { useEffect, useState, useRef } from 'react';

interface GooglePlacesAutocompleteProps {
  id: string;
  name: string;
  value: string;
  onChange: (value: string, placeId?: string, postcode?: string) => void;
  placeholder: string;
  error: boolean;
  className?: string;
}

declare global {
  interface Window {
    google: any;
    initGooglePlacesAutocomplete: () => void;
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

  useEffect(() => {
    // Initialize Google Places Autocomplete when the Google Maps script is loaded
    if (window.google && window.google.maps && !autocomplete && inputRef.current) {
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
    }
  }, [onChange, autocomplete]);

  // Initialize Google Maps script if not already loaded
  useEffect(() => {
    if (!window.google) {
      // Define the callback function
      window.initGooglePlacesAutocomplete = () => {
        setLoaded(true);
      };

      // Create and append the script tag
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&callback=initGooglePlacesAutocomplete`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);

      return () => {
        // Clean up
        document.head.removeChild(script);
        // Safe way to delete the property
        if (window.initGooglePlacesAutocomplete) {
          window.initGooglePlacesAutocomplete = undefined as any;
        }
      };
    }
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
