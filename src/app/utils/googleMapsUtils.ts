/**
 * Utility functions for Google Maps API integration
 */

// Add type declaration for window.google
declare global {
  interface Window {
    google: any;
    initGooglePlacesAutocomplete?: () => void;
  }
}

/**
 * Calculate distance between two addresses using Google Distance Matrix API
 * @param originPlaceId The place ID of the origin location
 * @param destinationPlaceId The place ID of the destination location
 * @returns Promise with distance in miles and duration in minutes
 */
export async function calculateDistance(originPlaceId: string, destinationPlaceId: string): Promise<{
  distance: number;
  duration: number;
  status: string;
}> {
  try {
    // Initialize the Distance Matrix service
    const service = new window.google.maps.DistanceMatrixService();
    
    return new Promise((resolve, reject) => {
      service.getDistanceMatrix(
        {
          origins: [{ placeId: originPlaceId }],
          destinations: [{ placeId: destinationPlaceId }],
          travelMode: window.google.maps.TravelMode.DRIVING,
          unitSystem: window.google.maps.UnitSystem.IMPERIAL, // Use miles
        },
        (response: any, status: string) => {
          if (status === 'OK' && response) {
            const result = response.rows[0].elements[0];
            
            if (result.status === 'OK') {
              // Convert meters to miles and seconds to minutes
              const distanceInMiles = result.distance.value / 1609.34;
              const durationInMinutes = Math.ceil(result.duration.value / 60);
              
              resolve({
                distance: parseFloat(distanceInMiles.toFixed(1)),
                duration: durationInMinutes,
                status: 'OK'
              });
            } else {
              resolve({
                distance: 0,
                duration: 0,
                status: result.status
              });
            }
          } else {
            reject(new Error(`Distance Matrix request failed with status: ${status}`));
          }
        }
      );
    });
  } catch (error) {
    console.error('Error calculating distance:', error);
    return {
      distance: 0,
      duration: 0,
      status: 'ERROR'
    };
  }
}
