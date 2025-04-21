'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

// Vehicle options with details
const vehicles = [
  {
    id: 'small_van',
    name: 'Small Van',
    description: 'Ideal for small moves, studio flats, or single items',
    capacity: 'Up to 500 cubic feet',
    maxWeight: '800 kg',
    image: '/small-van.jpg', // You'll need to add these images to public folder
    basePrice: 45
  },
  {
    id: 'medium_van',
    name: 'Medium Van',
    description: 'Perfect for 1-2 bedroom flats or small office moves',
    capacity: 'Up to 1000 cubic feet',
    maxWeight: '1200 kg',
    image: '/medium-van.jpg',
    basePrice: 65
  },
  {
    id: 'large_van',
    name: 'Large Van',
    description: 'Suitable for 2-3 bedroom houses or medium office moves',
    capacity: 'Up to 1500 cubic feet',
    maxWeight: '1500 kg',
    image: '/large-van.jpg',
    basePrice: 85
  },
  {
    id: 'luton_van',
    name: 'Luton Van',
    description: 'Ideal for 3-4 bedroom houses or larger office relocations',
    capacity: 'Up to 2000 cubic feet',
    maxWeight: '2000 kg',
    image: '/luton-van.jpg',
    basePrice: 110
  }
];

export default function Step3() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [bookingData, setBookingData] = useState<Record<string, any> | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    // Get the type from URL query params and validate
    const typeFromUrl = searchParams.get('type');
    if (typeFromUrl !== 'residential' && typeFromUrl !== 'business') {
      router.push('/booking/step1');
      return;
    }

    // Retrieve booking data from localStorage
    const storedData = localStorage.getItem('bookingData');
    if (!storedData) {
      router.push('/booking/step1');
      return;
    }

    try {
      const parsedData = JSON.parse(storedData);
      setBookingData(parsedData);
    } catch (e) {
      console.error('Error parsing booking data:', e);
      router.push('/booking/step1');
    }
  }, [searchParams, router]);

  const handleVehicleSelect = (vehicleId: string) => {
    setSelectedVehicle(vehicleId);
    setError(false);
  };

  const handleContinue = () => {
    if (!selectedVehicle) {
      setError(true);
      return;
    }

    // Update booking data with selected vehicle
    const selectedVehicleData = vehicles.find(v => v.id === selectedVehicle);
    
    if (!selectedVehicleData) {
      setError(true);
      return;
    }
    
    const updatedBookingData = {
      ...bookingData,
      vehicle: selectedVehicle,
      vehicleName: selectedVehicleData.name,
      vehicleBasePrice: selectedVehicleData.basePrice
    };

    // Store updated data
    localStorage.setItem('bookingData', JSON.stringify(updatedBookingData));
    router.push(`/booking/step4?type=${bookingData?.serviceType || 'residential'}`);
  };

  return (
    <main className="min-h-screen flex flex-col items-center p-0 bg-gray-50">
      {/* Hero Banner */}
      <div className="w-full relative h-[300px] mb-8">
        <Image 
          src="/images/Business Removals.webp" 
          alt="UK Removals Service" 
          fill 
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white p-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center">Step 3: Select Vehicle</h1>
          <p className="text-lg md:text-xl text-center">Choose the appropriate vehicle for your removal needs</p>
        </div>
      </div>
      
      <div className="w-full max-w-4xl px-6">
        <div className="mb-8">
          <Link href="/booking/step2" className="text-blue-600 hover:text-blue-800 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Step 2
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-10">
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '50%' }}></div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-medium text-gray-800 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Select Your Vehicle
            </h3>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
              Please select a vehicle to continue
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 mb-8">
            {vehicles.map((vehicle) => (
              <div 
                key={vehicle.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedVehicle === vehicle.id 
                    ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500' 
                    : 'bg-gray-50 border-gray-200 hover:bg-blue-50 hover:border-blue-300'
                }`}
                onClick={() => handleVehicleSelect(vehicle.id)}
              >
                <div className="flex flex-col md:flex-row items-start">
                  <div className="flex items-center mb-4 md:mb-0">
                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center mr-3 ${
                      selectedVehicle === vehicle.id ? 'border-blue-500 bg-blue-500' : 'border-gray-400'
                    }`}>
                      {selectedVehicle === vehicle.id && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="md:w-32 md:h-24 relative bg-gray-200 rounded-md overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:ml-6 flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-medium text-gray-800">{vehicle.name}</h3>
                      <span className="text-lg font-semibold text-blue-600">£{vehicle.basePrice}/hr</span>
                    </div>
                    <p className="text-gray-600 mt-1 mb-2">{vehicle.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span>Capacity: {vehicle.capacity}</span>
                      </div>
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>Max Weight: {vehicle.maxWeight}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={handleContinue}
              className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
            >
              Continue to Step 4
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
