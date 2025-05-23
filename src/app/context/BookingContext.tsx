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
    // Check if window is defined (client-side only)
    if (typeof window !== 'undefined') {
      try {
        const storedData = localStorage.getItem('bookingData');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setBookingData(parsedData);
        }
      } catch (e) {
        console.error('Error parsing booking data from localStorage:', e);
        // Clear invalid data
        try {
          localStorage.removeItem('bookingData');
        } catch (e) {
          console.error('Error removing invalid booking data from localStorage:', e);
        }
      }
    }
  }, []);

  // Update booking data
  const updateBookingData = (data: Partial<BookingData>) => {
    setBookingData(prev => {
      const updatedData = { ...prev, ...data };
      // Save to localStorage (client-side only)
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('bookingData', JSON.stringify(updatedData));
        } catch (e) {
          console.error('Error saving booking data to localStorage:', e);
        }
      }
      return updatedData;
    });
  };

  // Clear booking data
  const clearBookingData = () => {
    setBookingData({});
    // Remove from localStorage (client-side only)
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('bookingData');
      } catch (e) {
        console.error('Error removing booking data from localStorage:', e);
      }
    }
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
