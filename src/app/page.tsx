import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center p-0 bg-gray-50">
      {/* Hero Banner */}
      <div className="w-full relative h-[400px] mb-8">
        <Image 
          src="/images/Hero.webp" 
          alt="UK Removals Service" 
          fill 
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white p-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">UK Removals Booking Service</h1>
          <p className="text-xl md:text-2xl text-center">Professional House & Office Removals Services</p>
        </div>
      </div>
      
      <div className="w-full max-w-4xl px-6">
        <header className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-blue-800 mb-4">Your Trusted Removal Partner</h2>
          <p className="text-xl text-gray-600">Book your seamless moving experience today</p>
        </header>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Book Your Removal Service in 6 Simple Steps</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-md">
              <div className="relative h-48">
                <Image 
                  src="/images/Residential Removals.jpg" 
                  alt="Residential Removals" 
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-medium text-blue-800 mb-3">Residential Removals</h3>
                <p className="text-gray-600 mb-4">Moving to a new home? We offer comprehensive house removal services to make your move stress-free.</p>
                <Link 
                  href="/booking/step1?type=residential" 
                  className="block w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md text-center transition-colors"
                >
                  Book Residential Removal
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-md">
              <div className="relative h-48">
                <Image 
                  src="/images/Business Removals.webp" 
                  alt="Business Removals" 
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-medium text-indigo-800 mb-3">Business Removals</h3>
                <p className="text-gray-600 mb-4">Relocating your office? Our business removal services ensure minimal disruption to your operations.</p>
                <Link 
                  href="/booking/step1?type=business" 
                  className="block w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md text-center transition-colors"
                >
                  Book Business Removal
                </Link>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-700 mb-3">Why Choose Our Removal Services?</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Professional & experienced staff</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Fully insured service</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Transparent pricing</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Nationwide coverage</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Flexible scheduling</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Secure handling of belongings</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Our 6-Step Booking Process</h2>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">1</div>
              <div className="ml-4">
                <h3 className="font-medium text-lg text-gray-800">Select Service Type</h3>
                <p className="text-gray-600">Choose between residential or business removals</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">2</div>
              <div className="ml-4">
                <h3 className="font-medium text-lg text-gray-800">Enter Addresses & Schedule</h3>
                <p className="text-gray-600">Provide collection and delivery addresses, date and time</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">3</div>
              <div className="ml-4">
                <h3 className="font-medium text-lg text-gray-800">Select Vehicle</h3>
                <p className="text-gray-600">Choose the appropriate vehicle for your needs</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">4</div>
              <div className="ml-4">
                <h3 className="font-medium text-lg text-gray-800">Choose Duration</h3>
                <p className="text-gray-600">Select how many hours you need the driver</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">5</div>
              <div className="ml-4">
                <h3 className="font-medium text-lg text-gray-800">Additional Options</h3>
                <p className="text-gray-600">Add extra helpers, stair service, or specialist item handling</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-1">6</div>
              <div className="ml-4">
                <h3 className="font-medium text-lg text-gray-800">Confirm & Pay</h3>
                <p className="text-gray-600">Review your booking, make payment, and receive confirmation</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="mt-12 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} UK Removals Service. All rights reserved.</p>
      </footer>
    </main>
  );
}
