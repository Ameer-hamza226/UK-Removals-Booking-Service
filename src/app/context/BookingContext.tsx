'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the booking data interface
interface BookingData {
  serviceType: string;
  collectionAddress: string;
  collectionPostcode: string;
  collectionPlaceId: string;
  deliveryAddress: string;
  deliveryPostcode: string;
  deliveryPlaceId: string;
  distance: number;
  duration: number;
  date: string;
  time: string;
  vehicle: string;
  vehicleName: string;
  vehicleBasePrice: number;
  hours: number;
  basePrice: number;
  totalHoursPrice: number;
  additionalOptions: Array<{
    id: string;
    name: string;
    price: number;
  }>;
  additionalOptionsPrice: number;
  totalPrice: number;
}

// Define the context interface
interface BookingContextType {
  bookingData: Partial<BookingData>;
  updateBookingData: (data: Partial<BookingData>) => void;
  clearBookingData: () => void;
}

// Create the context
const BookingContext = createContext<BookingContextType | undefined>(undefined);

// Provider component
export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookingData, setBookingData] = useState<Partial<BookingData>>({});

  // Load data from localStorage on initial render
  useEffect(() => {
    const storedData = localStorage.getItem('bookingData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setBookingData(parsedData);
      } catch (e) {
        console.error('Error parsing booking data from localStorage:', e);
      }
    }
  }, []);

  // Update booking data
  const updateBookingData = (data: Partial<BookingData>) => {
    setBookingData(prev => {
      const updatedData = { ...prev, ...data };
      // Save to localStorage
      localStorage.setItem('bookingData', JSON.stringify(updatedData));
      return updatedData;
    });
  };

  // Clear booking data
  const clearBookingData = () => {
    setBookingData({});
    localStorage.removeItem('bookingData');
  };

  return (
    <BookingContext.Provider value={{ bookingData, updateBookingData, clearBookingData }}>
      {children}
    </BookingContext.Provider>
  );
}

// Custom hook to use the booking context
export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
