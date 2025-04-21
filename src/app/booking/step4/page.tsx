'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function Step4() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [bookingData, setBookingData] = useState<Record<string, any> | null>(null);
  const [hours, setHours] = useState(2); // Default to 2 hours
  const [basePrice, setBasePrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);

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
      
      // Validate that we have vehicle data
      if (!parsedData.vehicle || !parsedData.vehicleBasePrice) {
        router.push('/booking/step3');
        return;
      }
      
      setBookingData(parsedData);
      setBasePrice(parsedData.vehicleBasePrice);
      setTotalPrice(parsedData.vehicleBasePrice * hours);
      setLoading(false);
    } catch (e) {
      console.error('Error parsing booking data:', e);
      router.push('/booking/step1');
    }
  }, [searchParams, router, hours]);

  const handleHoursChange = (newHours: number) => {
    // Ensure hours is between 2 and 12
    const validHours = Math.max(2, Math.min(12, newHours));
    setHours(validHours);
    setTotalPrice(basePrice * validHours);
  };

  const handleContinue = () => {
    if (loading || !bookingData) return;

    // Update booking data with hours and price
    const updatedBookingData = {
      ...(bookingData || {}),
      hours: hours,
      basePrice: basePrice,
      totalHoursPrice: totalPrice
    };

    // Store updated data
    localStorage.setItem('bookingData', JSON.stringify(updatedBookingData));
    router.push(`/booking/step5?type=${bookingData?.serviceType || 'residential'}`);
  };

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center p-0 bg-gray-50">
      {/* Hero Banner */}
      <div className="w-full relative h-[300px] mb-8">
        <Image 
          src="/images/Residential Removals.jpg" 
          alt="UK Removals Service" 
          fill 
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white p-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center">Step 4: Choose Duration</h1>
          <p className="text-lg md:text-xl text-center">Select how many hours you need the driver and vehicle</p>
        </div>
      </div>
      
      <div className="w-full max-w-4xl px-6">
        <div className="mb-8">
          <Link href="/booking/step3" className="text-blue-600 hover:text-blue-800 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Step 3
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-10">


          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '66.67%' }}></div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-8 shadow-sm">
            <h3 className="text-lg font-medium text-blue-800 mb-2">Your Selected Vehicle</h3>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-700"><span className="font-medium">Vehicle:</span> {bookingData?.vehicleName || 'Not specified'}</p>
                <p className="text-gray-700"><span className="font-medium">Base Rate:</span> £{basePrice}/hour</p>
              </div>
              <div className="text-right">
                <p className="text-gray-700"><span className="font-medium">Date:</span> {bookingData?.date ? new Date(bookingData.date).toLocaleDateString('en-GB') : 'Not specified'}</p>
                <p className="text-gray-700"><span className="font-medium">Time:</span> {bookingData?.time || 'Not specified'}</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-medium text-gray-800 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Select Number of Hours
            </h3>
            
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="hours" className="text-gray-700 font-medium">Hours: {hours}</label>
                <span className="text-gray-600 text-sm">Minimum 2 hours, maximum 12 hours</span>
              </div>
              
              <div className="flex items-center">
                <button 
                  onClick={() => handleHoursChange(hours - 1)}
                  disabled={hours <= 2}
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    hours <= 2 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                
                <div className="flex-1 mx-4">
                  <input
                    type="range"
                    id="hours"
                    min="2"
                    max="12"
                    step="1"
                    value={hours}
                    onChange={(e) => handleHoursChange(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                
                <button 
                  onClick={() => handleHoursChange(hours + 1)}
                  disabled={hours >= 12}
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    hours >= 12 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-700">Base Rate: £{basePrice}/hour</p>
                  <p className="text-gray-700">Number of Hours: {hours}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-blue-600">Total: £{totalPrice}</p>
                  <p className="text-xs text-gray-500">Additional options in next step</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={handleContinue}
              className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
            >
              Continue to Step 5
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
