'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useBooking } from '../../context/BookingContext';
import GooglePlacesAutocomplete from '../../components/GooglePlacesAutocomplete';
import { calculateDistance } from '../../utils/googleMapsUtils';

export default function Step2() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { bookingData, updateBookingData } = useBooking();
  
  const [formData, setFormData] = useState({
    serviceType: '',
    collectionAddress: '',
    collectionPostcode: '',
    collectionPlaceId: '',
    deliveryAddress: '',
    deliveryPostcode: '',
    deliveryPlaceId: '',
    distance: 0,
    duration: 0,
    date: '',
    time: ''
  });
  
  const [errors, setErrors] = useState({
    collectionAddress: false,
    collectionPostcode: false,
    deliveryAddress: false,
    deliveryPostcode: false,
    date: false,
    time: false
  });
  
  const [isCalculatingDistance, setIsCalculatingDistance] = useState(false);
  const [distanceCalculated, setDistanceCalculated] = useState(false);

  useEffect(() => {
    // Get the type from URL query params
    const typeFromUrl = searchParams.get('type');
    if (typeFromUrl === 'residential' || typeFromUrl === 'business') {
      // Load existing booking data if available
      if (bookingData) {
        setFormData(prev => ({
          ...prev,
          serviceType: typeFromUrl,
          collectionAddress: bookingData.collectionAddress || '',
          collectionPostcode: bookingData.collectionPostcode || '',
          collectionPlaceId: bookingData.collectionPlaceId || '',
          deliveryAddress: bookingData.deliveryAddress || '',
          deliveryPostcode: bookingData.deliveryPostcode || '',
          deliveryPlaceId: bookingData.deliveryPlaceId || '',
          distance: bookingData.distance || 0,
          duration: bookingData.duration || 0,
          date: bookingData.date || '',
          time: bookingData.time || ''
        }));
        
        // If we have both place IDs, mark distance as calculated
        if (bookingData.collectionPlaceId && bookingData.deliveryPlaceId && bookingData.distance) {
          setDistanceCalculated(true);
        }
      } else {
        setFormData(prev => ({ ...prev, serviceType: typeFromUrl }));
      }
    } else {
      // Redirect to step 1 if no valid service type
      router.push('/booking/step1');
    }
  }, [searchParams, router, bookingData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (name in errors && errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name as keyof typeof errors]: false }));
    }
    
    // Reset distance calculation if addresses change
    if (name === 'collectionAddress' || name === 'deliveryAddress') {
      setDistanceCalculated(false);
    }
  };
  
  const handleAddressChange = (type: 'collection' | 'delivery', address: string, placeId?: string, postcode?: string) => {
    const addressKey = `${type}Address` as 'collectionAddress' | 'deliveryAddress';
    const postcodeKey = `${type}Postcode` as 'collectionPostcode' | 'deliveryPostcode';
    const placeIdKey = `${type}PlaceId` as 'collectionPlaceId' | 'deliveryPlaceId';
    
    setFormData(prev => ({
      ...prev,
      [addressKey]: address,
      [postcodeKey]: postcode || prev[postcodeKey] || '',
      [placeIdKey]: placeId || ''
    }));
    
    // Clear error
    if (addressKey in errors && errors[addressKey]) {
      setErrors(prev => ({ ...prev, [addressKey]: false }));
    }
    if (postcode && postcodeKey in errors && errors[postcodeKey]) {
      setErrors(prev => ({ ...prev, [postcodeKey]: false }));
    }
    
    // Reset distance calculation
    setDistanceCalculated(false);
  };
  
  // Calculate distance when both addresses are set
  useEffect(() => {
    const calculateDistanceIfPossible = async () => {
      if (
        formData.collectionPlaceId && 
        formData.deliveryPlaceId && 
        !distanceCalculated && 
        !isCalculatingDistance &&
        typeof window !== 'undefined' && 
        window.google && 
        window.google.maps
      ) {
        setIsCalculatingDistance(true);
        try {
          const result = await calculateDistance(
            formData.collectionPlaceId,
            formData.deliveryPlaceId
          );
          
          if (result.status === 'OK') {
            setFormData(prev => ({
              ...prev,
              distance: result.distance,
              duration: result.duration
            }));
            setDistanceCalculated(true);
          }
        } catch (error) {
          console.error('Error calculating distance:', error);
        } finally {
          setIsCalculatingDistance(false);
        }
      }
    };
    
    calculateDistanceIfPossible();
  }, [formData.collectionPlaceId, formData.deliveryPlaceId, distanceCalculated, isCalculatingDistance]);

  const validateForm = () => {
    const newErrors = {
      collectionAddress: !formData.collectionAddress,
      collectionPostcode: !formData.collectionPostcode,
      deliveryAddress: !formData.deliveryAddress,
      deliveryPostcode: !formData.deliveryPostcode,
      date: !formData.date,
      time: !formData.time
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleContinue = () => {
    if (validateForm()) {
      // Update booking context with form data
      updateBookingData(formData);
      router.push(`/booking/step3?type=${formData.serviceType}`);
    }
  };

  // Get tomorrow's date for min date attribute
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <main className="min-h-screen flex flex-col items-center p-0 bg-gray-50">
      {/* Hero Banner */}
      <div className="w-full relative h-[300px] mb-8">
        <Image 
          src="/images/Hero.webp" 
          alt="UK Removals Service" 
          fill 
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white p-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center">Step 2: Enter Addresses & Schedule</h1>
          <p className="text-lg md:text-xl text-center">Provide your collection and delivery addresses, date and time</p>
        </div>
      </div>
      
      <div className="w-full max-w-4xl px-6">
        <div className="mb-8">
          <Link href="/booking/step1" className="text-blue-600 hover:text-blue-800 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Step 1
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-10">
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '33.33%' }}></div>
          </div>
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Step 2: Enter Addresses & Schedule</h1>
            <p className="text-gray-600">Provide collection and delivery addresses, date and time</p>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '33.33%' }}></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-xl font-medium text-gray-800 mb-4">Collection Details</h3>
              
              <div className="mb-4">
                <label htmlFor="collectionAddress" className="block text-gray-700 font-medium mb-2">Address</label>
                {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY !== 'your_google_maps_api_key_here' ? (
                  <GooglePlacesAutocomplete
                    id="collectionAddress"
                    name="collectionAddress"
                    value={formData.collectionAddress}
                    onChange={(address, placeId, postcode) => handleAddressChange('collection', address, placeId, postcode)}
                    placeholder="Enter full collection address"
                    error={errors.collectionAddress}
                  />
                ) : (
                  <textarea
                    id="collectionAddress"
                    name="collectionAddress"
                    value={formData.collectionAddress}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      errors.collectionAddress ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    rows={3}
                    placeholder="Enter full collection address"
                  ></textarea>
                )}
                {errors.collectionAddress && (
                  <p className="mt-1 text-red-500 text-sm">Collection address is required</p>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="collectionPostcode" className="block text-gray-700 font-medium mb-2">Postcode</label>
                <input
                  type="text"
                  id="collectionPostcode"
                  name="collectionPostcode"
                  value={formData.collectionPostcode}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.collectionPostcode ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="Enter postcode"
                />
                {errors.collectionPostcode && (
                  <p className="mt-1 text-red-500 text-sm">Collection postcode is required</p>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-medium text-gray-800 mb-4">Delivery Details</h3>
              
              <div className="mb-4">
                <label htmlFor="deliveryAddress" className="block text-gray-700 font-medium mb-2">Address</label>
                {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY !== 'your_google_maps_api_key_here' ? (
                  <GooglePlacesAutocomplete
                    id="deliveryAddress"
                    name="deliveryAddress"
                    value={formData.deliveryAddress}
                    onChange={(address, placeId, postcode) => handleAddressChange('delivery', address, placeId, postcode)}
                    placeholder="Enter full delivery address"
                    error={errors.deliveryAddress}
                  />
                ) : (
                  <textarea
                    id="deliveryAddress"
                    name="deliveryAddress"
                    value={formData.deliveryAddress}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      errors.deliveryAddress ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    rows={3}
                    placeholder="Enter full delivery address"
                  ></textarea>
                )}
                {errors.deliveryAddress && (
                  <p className="mt-1 text-red-500 text-sm">Delivery address is required</p>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="deliveryPostcode" className="block text-gray-700 font-medium mb-2">Postcode</label>
                <input
                  type="text"
                  id="deliveryPostcode"
                  name="deliveryPostcode"
                  value={formData.deliveryPostcode}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.deliveryPostcode ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="Enter postcode"
                />
                {errors.deliveryPostcode && (
                  <p className="mt-1 text-red-500 text-sm">Delivery postcode is required</p>
                )}
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-medium text-gray-800 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 12.414a1.998 1.998 0 10-2.827 2.827l8.485 8.485a1.998 1.998 0 002.827-2.827l-8.485-8.485z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
              </svg>
              Schedule
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="date" className="block text-gray-700 font-medium mb-2">Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  min={minDate}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.date ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {errors.date && (
                  <p className="mt-1 text-red-500 text-sm">Date is required</p>
                )}
              </div>
              
              <div>
                <label htmlFor="time" className="block text-gray-700 font-medium mb-2">Time</label>
                <select
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.time ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                >
                  <option value="">Select a time</option>
                  <option value="08:00">08:00 AM</option>
                  <option value="09:00">09:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="13:00">01:00 PM</option>
                  <option value="14:00">02:00 PM</option>
                  <option value="15:00">03:00 PM</option>
                  <option value="16:00">04:00 PM</option>
                  <option value="17:00">05:00 PM</option>
                </select>
                {errors.time && (
                  <p className="mt-1 text-red-500 text-sm">Time is required</p>
                )}
              </div>
            </div>
          </div>

          {distanceCalculated && formData.distance > 0 && (
            <div className="mb-8 p-4 bg-blue-50 border border-blue-100 rounded-lg shadow-sm">
              <h3 className="text-xl font-medium text-blue-800 mb-2">Distance Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-700"><span className="font-medium">Estimated Distance:</span> {formData.distance} miles</p>
                </div>
                <div>
                  <p className="text-gray-700"><span className="font-medium">Estimated Duration:</span> {formData.duration} minutes</p>
                </div>
              </div>
            </div>
          )}
          
          {isCalculatingDistance && (
            <div className="mb-8 p-4 bg-blue-50 border border-blue-100 rounded-lg shadow-sm">
              <p className="text-blue-800">Calculating distance between addresses...</p>
            </div>
          )}
          
          <div className="flex justify-between mt-6">
            <Link 
              href="/booking/step1"
              className="py-3 px-6 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md transition-colors"
            >
              Back
            </Link>
            <button
              onClick={handleContinue}
              className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
              disabled={isCalculatingDistance}
            >
              Continue to Step 3
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
