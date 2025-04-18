'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function Step1() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serviceType, setServiceType] = useState('');
  
  useEffect(() => {
    // Get the type from URL query params
    const typeFromUrl = searchParams.get('type');
    if (typeFromUrl === 'residential' || typeFromUrl === 'business') {
      setServiceType(typeFromUrl);
    }
  }, [searchParams]);

  const handleContinue = () => {
    if (serviceType) {
      router.push(`/booking/step2?type=${serviceType}`);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center p-6 bg-gray-50">
      <div className="w-full max-w-4xl">
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:text-blue-800 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Home
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Step 1: Select Service Type</h1>
            <p className="text-gray-600">Choose the type of removal service you need</p>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '16.67%' }}></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div 
              className={`p-6 rounded-lg border cursor-pointer transition-all ${
                serviceType === 'residential' 
                  ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500' 
                  : 'bg-gray-50 border-gray-200 hover:bg-blue-50 hover:border-blue-300'
              }`}
              onClick={() => setServiceType('residential')}
            >
              <div className="flex items-center mb-3">
                <div className={`w-6 h-6 rounded-full border flex items-center justify-center mr-3 ${
                  serviceType === 'residential' ? 'border-blue-500 bg-blue-500' : 'border-gray-400'
                }`}>
                  {serviceType === 'residential' && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <h3 className="text-xl font-medium text-gray-800">Residential Removals</h3>
              </div>
              <p className="text-gray-600 ml-9">Moving to a new home? Our residential removal service is perfect for houses, flats, and apartments.</p>
            </div>

            <div 
              className={`p-6 rounded-lg border cursor-pointer transition-all ${
                serviceType === 'business' 
                  ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-500' 
                  : 'bg-gray-50 border-gray-200 hover:bg-indigo-50 hover:border-indigo-300'
              }`}
              onClick={() => setServiceType('business')}
            >
              <div className="flex items-center mb-3">
                <div className={`w-6 h-6 rounded-full border flex items-center justify-center mr-3 ${
                  serviceType === 'business' ? 'border-indigo-500 bg-indigo-500' : 'border-gray-400'
                }`}>
                  {serviceType === 'business' && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <h3 className="text-xl font-medium text-gray-800">Business Removals</h3>
              </div>
              <p className="text-gray-600 ml-9">Relocating your office or business? Our commercial removal service is designed for businesses of all sizes.</p>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleContinue}
              disabled={!serviceType}
              className={`py-3 px-6 rounded-md font-medium transition-colors ${
                serviceType 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Continue to Step 2
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
