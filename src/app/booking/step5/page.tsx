'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

// Additional options with details
const additionalOptions = [
  {
    id: 'extra_helper',
    name: 'Extra Helper',
    description: 'Add an additional person to help with loading and unloading',
    price: 25
  },
  {
    id: 'stairs_service',
    name: 'Stairs Service',
    description: 'Special assistance for properties with stairs and no elevator access',
    price: 20
  },
  {
    id: 'specialist_items',
    name: 'Specialist Items Handling',
    description: 'Extra care for fragile, valuable or unusually shaped items',
    price: 30
  },
  {
    id: 'packing_service',
    name: 'Packing Service',
    description: 'Professional packing of your belongings before the move',
    price: 40
  },
  {
    id: 'disassembly',
    name: 'Furniture Disassembly/Assembly',
    description: 'Take apart and reassemble furniture as needed',
    price: 35
  }
];

export default function Step5() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [bookingData, setBookingData] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [basePrice, setBasePrice] = useState(0);
  const [additionalPrice, setAdditionalPrice] = useState(0);
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
      
      // Validate that we have required data
      if (!parsedData.hours || !parsedData.totalHoursPrice) {
        router.push('/booking/step4');
        return;
      }
      
      setBookingData(parsedData);
      setBasePrice(parsedData.totalHoursPrice);
      setTotalPrice(parsedData.totalHoursPrice);
      setLoading(false);
    } catch (e) {
      console.error('Error parsing booking data:', e);
      router.push('/booking/step1');
    }
  }, [searchParams, router]);

  useEffect(() => {
    // Calculate additional options price
    const optionsPrice = selectedOptions.reduce((total, optionId) => {
      const option = additionalOptions.find(opt => opt.id === optionId);
      return total + (option ? option.price : 0);
    }, 0);
    
    setAdditionalPrice(optionsPrice);
    setTotalPrice(basePrice + optionsPrice);
  }, [selectedOptions, basePrice]);

  const handleOptionToggle = (optionId) => {
    setSelectedOptions(prev => {
      if (prev.includes(optionId)) {
        return prev.filter(id => id !== optionId);
      } else {
        return [...prev, optionId];
      }
    });
  };

  const handleContinue = () => {
    if (loading || !bookingData) return;

    // Get selected option details
    const selectedOptionDetails = selectedOptions.map(optionId => {
      const option = additionalOptions.find(opt => opt.id === optionId);
      return {
        id: option.id,
        name: option.name,
        price: option.price
      };
    });

    // Update booking data with selected options and prices
    const updatedBookingData = {
      ...bookingData,
      additionalOptions: selectedOptionDetails,
      additionalOptionsPrice: additionalPrice,
      totalPrice: totalPrice
    };

    // Store updated data
    localStorage.setItem('bookingData', JSON.stringify(updatedBookingData));
    router.push(`/booking/step6?type=${bookingData.serviceType}`);
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
          src="/images/Hero.webp" 
          alt="UK Removals Service" 
          fill 
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white p-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center">Step 5: Additional Options</h1>
          <p className="text-lg md:text-xl text-center">Customize your removal service with extra helpers and special handling</p>
        </div>
      </div>
      
      <div className="w-full max-w-4xl px-6">
        <div className="mb-8">
          <Link href="/booking/step4" className="text-blue-600 hover:text-blue-800 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Step 4
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-10">


          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '83.33%' }}></div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-8 shadow-sm">
            <h3 className="text-lg font-medium text-blue-800 mb-2">Your Booking Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-700"><span className="font-medium">Service Type:</span> {bookingData.serviceType === 'residential' ? 'Residential Removal' : 'Business Removal'}</p>
                <p className="text-gray-700"><span className="font-medium">Vehicle:</span> {bookingData.vehicleName}</p>
                <p className="text-gray-700"><span className="font-medium">Duration:</span> {bookingData.hours} hours</p>
              </div>
              <div>
                <p className="text-gray-700"><span className="font-medium">Date:</span> {new Date(bookingData.date).toLocaleDateString('en-GB')}</p>
                <p className="text-gray-700"><span className="font-medium">Time:</span> {bookingData.time}</p>
                <p className="text-gray-700"><span className="font-medium">Base Price:</span> £{basePrice}</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-medium text-gray-800 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Select Additional Options
            </h3>
            
            <div className="space-y-4 mb-6">
              {additionalOptions.map((option) => (
                <div 
                  key={option.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedOptions.includes(option.id) 
                      ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' 
                      : 'bg-gray-50 border-gray-200 hover:bg-blue-50 hover:border-blue-300'
                  }`}
                  onClick={() => handleOptionToggle(option.id)}
                >
                  <div className="flex items-start">
                    <div className={`w-6 h-6 rounded-md border flex items-center justify-center mr-3 mt-0.5 ${
                      selectedOptions.includes(option.id) ? 'border-blue-500 bg-blue-500' : 'border-gray-400'
                    }`}>
                      {selectedOptions.includes(option.id) && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="text-lg font-medium text-gray-800">{option.name}</h4>
                        <span className="text-blue-600 font-medium">£{option.price}</span>
                      </div>
                      <p className="text-gray-600 mt-1">{option.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700">Base Price:</span>
                  <span className="text-gray-700">£{basePrice}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700">Additional Options:</span>
                  <span className="text-gray-700">£{additionalPrice}</span>
                </div>
                <div className="border-t border-gray-300 my-2 pt-2 flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-800">Total Price:</span>
                  <span className="text-xl font-bold text-blue-600">£{totalPrice}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={handleContinue}
              className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
            >
              Continue to Final Step
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
