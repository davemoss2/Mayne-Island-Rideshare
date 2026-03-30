'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { RideRequest, DriverTrip } from '@/types';

interface DataContextType {
  rideRequests: RideRequest[];
  driverTrips: DriverTrip[];
  createRideRequest: (request: Omit<RideRequest, 'id' | 'createdAt'>) => void;
  confirmRideRequest: (requestId: string, driverId: string, driverName: string, driverPhone: string, driverVehicle: string) => void;
  cancelRideRequest: (requestId: string) => void;
  createDriverTrip: (trip: Omit<DriverTrip, 'id' | 'createdAt'>) => void;
  updateDriverTrip: (tripId: string, updates: Partial<DriverTrip>) => void;
  deleteDriverTrip: (tripId: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [rideRequests, setRideRequests] = useState<RideRequest[]>([]);
  const [driverTrips, setDriverTrips] = useState<DriverTrip[]>([]);

  useEffect(() => {
    // Load data from localStorage
    const storedRequests = localStorage.getItem('rideRequests');
    const storedTrips = localStorage.getItem('driverTrips');

    if (storedRequests) {
      try {
        const parsed = JSON.parse(storedRequests);
        setRideRequests(
          parsed.map((r: any) => ({
            ...r,
            createdAt: new Date(r.createdAt),
          }))
        );
      } catch (e) {
        console.error('Failed to parse ride requests:', e);
      }
    }

    if (storedTrips) {
      try {
        const parsed = JSON.parse(storedTrips);
        setDriverTrips(
          parsed.map((t: any) => ({
            ...t,
            createdAt: new Date(t.createdAt),
          }))
        );
      } catch (e) {
        console.error('Failed to parse driver trips:', e);
      }
    }

    // Poll for updates every 5 seconds to simulate real-time
    const interval = setInterval(() => {
      const currentRequests = localStorage.getItem('rideRequests');
      const currentTrips = localStorage.getItem('driverTrips');

      if (currentRequests) {
        try {
          const parsed = JSON.parse(currentRequests);
          setRideRequests(
            parsed.map((r: any) => ({
              ...r,
              createdAt: new Date(r.createdAt),
            }))
          );
        } catch (e) {
          // Ignore parse errors
        }
      }

      if (currentTrips) {
        try {
          const parsed = JSON.parse(currentTrips);
          setDriverTrips(
            parsed.map((t: any) => ({
              ...t,
              createdAt: new Date(t.createdAt),
            }))
          );
        } catch (e) {
          // Ignore parse errors
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const createRideRequest = (request: Omit<RideRequest, 'id' | 'createdAt'>) => {
    const newRequest: RideRequest = {
      ...request,
      id: `request_${Date.now()}`,
      createdAt: new Date(),
    };

    const updated = [...rideRequests, newRequest];
    setRideRequests(updated);
    localStorage.setItem('rideRequests', JSON.stringify(updated));
  };

  const confirmRideRequest = (requestId: string, driverId: string, driverName: string, driverPhone: string, driverVehicle: string) => {
    const updated = rideRequests.map((r) =>
      r.id === requestId
        ? {
            ...r,
            status: 'confirmed' as const,
            confirmedDriverId: driverId,
            confirmedDriverName: driverName,
            confirmedDriverPhone: driverPhone,
            confirmedDriverVehicle: driverVehicle,
          }
        : r
    );
    setRideRequests(updated);
    localStorage.setItem('rideRequests', JSON.stringify(updated));
  };

  const cancelRideRequest = (requestId: string) => {
    const updated = rideRequests.map((r) =>
      r.id === requestId ? { ...r, status: 'cancelled' as const } : r
    );
    setRideRequests(updated);
    localStorage.setItem('rideRequests', JSON.stringify(updated));
  };

  const createDriverTrip = (trip: Omit<DriverTrip, 'id' | 'createdAt'>) => {
    const newTrip: DriverTrip = {
      ...trip,
      id: `trip_${Date.now()}`,
      createdAt: new Date(),
    };

    const updated = [...driverTrips, newTrip];
    setDriverTrips(updated);
    localStorage.setItem('driverTrips', JSON.stringify(updated));
  };

  const updateDriverTrip = (tripId: string, updates: Partial<DriverTrip>) => {
    const updated = driverTrips.map((t) =>
      t.id === tripId ? { ...t, ...updates } : t
    );
    setDriverTrips(updated);
    localStorage.setItem('driverTrips', JSON.stringify(updated));
  };

  const deleteDriverTrip = (tripId: string) => {
    const updated = driverTrips.filter((t) => t.id !== tripId);
    setDriverTrips(updated);
    localStorage.setItem('driverTrips', JSON.stringify(updated));
  };

  return (
    <DataContext.Provider
      value={{
        rideRequests,
        driverTrips,
        createRideRequest,
        confirmRideRequest,
        cancelRideRequest,
        createDriverTrip,
        updateDriverTrip,
        deleteDriverTrip,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
