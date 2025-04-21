'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function Step6() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [bookingData, setBookingData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    agreeTerms: false
  });
  const [errors, setErrors] = useState<Record<string, string | boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingReference, setBookingReference] = useState('');

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
      if (!parsedData.totalPrice) {
        router.push('/booking/step5');
        return;
      }
      
      setBookingData(parsedData);
      setLoading(false);
    } catch (e) {
      console.error('Error parsing booking data:', e);
      router.push('/booking/step1');
    }
  }, [searchParams, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    let inputValue = type === 'checkbox' ? checked : value;
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      // Remove non-digits
      const digits = value.replace(/\D/g, '');
      // Add space after every 4 digits
      const formatted = digits.replace(/(.{4})/g, '$1 ').trim();
      inputValue = formatted;
    }
    
    // Format expiry date with slash
    if (name === 'expiryDate') {
      // Remove non-digits
      const digits = value.replace(/\D/g, '');
      if (digits.length > 2) {
        inputValue = `${digits.substring(0, 2)}/${digits.substring(2, 4)}`;
      } else {
        inputValue = digits;
      }
    }
    
    setFormData(prev => ({ ...prev, [name]: inputValue }));
    
    // Clear error when user types
    if (errors[name]) {
      // Use empty string instead of null to match the type Record<string, string | boolean>
      setErrors(prev => ({ ...prev, [name]: type === 'checkbox' ? false : '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string | boolean> = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s+/g, ''))) {
      newErrors.phone = 'Phone number is invalid';
    }
    
    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = 'Card number is required';
    } else if (!/^[0-9\s]{16,19}$/.test(formData.cardNumber) || formData.cardNumber.replace(/\s+/g, '').length !== 16) {
      newErrors.cardNumber = 'Card number must be 16 digits';
    }
    
    if (!formData.expiryDate.trim()) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (!/^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Expiry date must be in MM/YY format';
    } else {
      // Check if expiry date is in the future
      const [month, year] = formData.expiryDate.split('/');
      const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
      const currentDate = new Date();
      if (expiryDate < currentDate) {
        newErrors.expiryDate = 'Card has expired';
      }
    }
    
    if (!formData.cvv.trim()) {
      newErrors.cvv = 'CVV is required';
    } else if (!/^[0-9]{3,4}$/.test(formData.cvv)) {
      newErrors.cvv = 'CVV must be 3 or 4 digits';
    }
    
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call to process payment and create booking
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate a random booking reference
      const reference = 'UK-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      setBookingReference(reference);
      
      // Save booking reference to the booking data
      const updatedBookingData = { ...bookingData, reference };
      
      // Store the complete booking data for confirmation page
      localStorage.setItem('completedBooking', JSON.stringify(updatedBookingData));
      
      // Clear booking data from localStorage
      localStorage.removeItem('bookingData');
      
      setBookingComplete(true);
    } catch (error) {
      console.error('Error processing booking:', error);
      setErrors(prev => ({ 
        ...prev, 
        submit: 'There was an error processing your payment. Please try again.' 
      }));
    } finally {
      setIsSubmitting(false);
    }
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

  if (bookingComplete) {
    // Get completed booking data from localStorage
    const completedBookingData = typeof window !== 'undefined' ? 
      JSON.parse(localStorage.getItem('completedBooking') || '{}') : {};
    
    // Use the completed booking data or fall back to the state variable
    const displayData = Object.keys(completedBookingData).length > 0 ? completedBookingData : bookingData;
    
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
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center">Booking Confirmed!</h1>
            <p className="text-lg md:text-xl text-center">Thank you for choosing our removal service</p>
          </div>
        </div>
        
        <div className="w-full max-w-4xl px-6">
          <div className="bg-white rounded-xl shadow-lg p-8 mb-10 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Booking is Confirmed</h2>
            <p className="text-lg text-gray-600 mb-6">Your booking reference is: <span className="font-bold text-blue-600">{displayData.reference || bookingReference}</span></p>
            <p className="text-gray-600 mb-8">We&apos;ve sent a confirmation email with all the details of your booking. Our team will contact you before the scheduled date to confirm all arrangements.</p>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-8 max-w-md mx-auto">
              <h3 className="text-lg font-medium text-blue-800 mb-2">Booking Summary</h3>
              <div className="text-left">
                <p className="text-gray-700"><span className="font-medium">Service Type:</span> {displayData.serviceType === 'residential' ? 'Residential Removal' : 'Business Removal'}</p>
                <p className="text-gray-700"><span className="font-medium">Date:</span> {displayData.date ? new Date(displayData.date).toLocaleDateString('en-GB') : 'N/A'}</p>
                <p className="text-gray-700"><span className="font-medium">Time:</span> {displayData.time || 'N/A'}</p>
                <p className="text-gray-700"><span className="font-medium">Vehicle:</span> {displayData.vehicleName || 'N/A'}</p>
                <p className="text-gray-700"><span className="font-medium">Total Paid:</span> £{displayData.totalPrice || 0}</p>
              </div>
            </div>
            
            <Link 
              href="/"
              className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors inline-block"
            >
              Return to Home
            </Link>
          </div>
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
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center">Step 6: Confirm & Pay</h1>
          <p className="text-lg md:text-xl text-center">Review your booking details and complete payment</p>
        </div>
      </div>
      
      <div className="w-full max-w-4xl px-6">
        <div className="mb-8">
          <Link href="/booking/step5" className="text-blue-600 hover:text-blue-800 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Step 5
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-10">
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '100%' }}></div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-medium text-gray-800 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Booking Summary
            </h3>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-700"><span className="font-medium">Service Type:</span> {bookingData.serviceType === 'residential' ? 'Residential Removal' : 'Business Removal'}</p>
                  <p className="text-gray-700"><span className="font-medium">Vehicle:</span> {bookingData.vehicleName}</p>
                  <p className="text-gray-700"><span className="font-medium">Duration:</span> {bookingData.hours} hours</p>
                </div>
                <div>
                  <p className="text-gray-700"><span className="font-medium">Date:</span> {new Date(bookingData.date).toLocaleDateString('en-GB')}</p>
                  <p className="text-gray-700"><span className="font-medium">Time:</span> {bookingData.time}</p>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-700"><span className="font-medium">Collection:</span> {bookingData.collectionPostcode}</p>
                  </div>
                  <div>
                    <p className="text-gray-700"><span className="font-medium">Delivery:</span> {bookingData.deliveryPostcode}</p>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Base Price ({bookingData.hours} hours):</span>
                  <span className="text-gray-700">£{bookingData.totalHoursPrice}</span>
                </div>
                
                {bookingData.additionalOptions && bookingData.additionalOptions.length > 0 && (
                  <>
                    {bookingData.additionalOptions.map((option: any) => (
                      <div key={option.id} className="flex justify-between items-center">
                        <span className="text-gray-700">{option.name}:</span>
                        <span className="text-gray-700">£{option.price}</span>
                      </div>
                    ))}
                  </>
                )}
                
                <div className="border-t border-gray-300 mt-2 pt-2 flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-800">Total Price:</span>
                  <span className="text-xl font-bold text-blue-600">£{bookingData.totalPrice}</span>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-8">
              <h3 className="text-xl font-medium text-gray-800 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Your Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="fullName" className="block text-gray-700 font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      errors.fullName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-red-500 text-sm">{errors.fullName}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="mt-1 text-red-500 text-sm">{errors.email}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-red-500 text-sm">{errors.phone}</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-xl font-medium text-gray-800 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Payment Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="cardNumber" className="block text-gray-700 font-medium mb-2">Card Number</label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      errors.cardNumber ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    autoComplete="cc-number"
                  />
                  {errors.cardNumber && (
                    <p className="mt-1 text-red-500 text-sm">{errors.cardNumber}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="expiryDate" className="block text-gray-700 font-medium mb-2">Expiry Date</label>
                  <input
                    type="text"
                    id="expiryDate"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      errors.expiryDate ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="MM/YY"
                    maxLength={5}
                    autoComplete="cc-exp"
                  />
                  {errors.expiryDate && (
                    <p className="mt-1 text-red-500 text-sm">{errors.expiryDate}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="cvv" className="block text-gray-700 font-medium mb-2">CVV</label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      errors.cvv ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="123"
                    maxLength={4}
                    autoComplete="cc-csc"
                  />
                  {errors.cvv && (
                    <p className="mt-1 text-red-500 text-sm">{errors.cvv}</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="agreeTerms"
                    name="agreeTerms"
                    type="checkbox"
                    checked={formData.agreeTerms}
                    onChange={handleInputChange}
                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="agreeTerms" className="text-gray-700">
                    I agree to the <a href="#" className="text-blue-600 hover:underline">Terms and Conditions</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                  </label>
                  {errors.agreeTerms && (
                    <p className="mt-1 text-red-500 text-sm">{errors.agreeTerms}</p>
                  )}
                </div>
              </div>
            </div>
            
            {errors.submit && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
                {errors.submit}
              </div>
            )}
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Confirm and Pay'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
