'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { RideRequest, DriverTrip } from '@/types';
import { supabase } from '@/lib/supabase';

interface DataContextType {
  rideRequests: RideRequest[];
  driverTrips: DriverTrip[];
  createRideRequest: (request: Omit<RideRequest, 'id' | 'createdAt'>) => Promise<void>;
  confirmRideRequest: (requestId: string, driverId: string, driverName: string, driverPhone: string, driverVehicle: string) => Promise<void>;
  cancelRideRequest: (requestId: string) => Promise<void>;
  createDriverTrip: (trip: Omit<DriverTrip, 'id' | 'createdAt'>) => Promise<void>;
  updateDriverTrip: (tripId: string, updates: Partial<DriverTrip>) => Promise<void>;
  deleteDriverTrip: (tripId: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};

// Map a Supabase ride_requests row to our RideRequest type.
function rowToRideRequest(row: Record<string, unknown>): RideRequest {
  return {
    id: row.id as string,
    riderId: row.rider_id as string,
    riderName: row.rider_name as string,
    riderPhone: row.rider_phone as string,
    destination: row.destination as string,
    pickupLocation: row.pickup_location as string,
    notes: (row.notes as string) ?? '',
    hasPet: (row.has_pet as boolean) ?? false,
    needsChildSeat: (row.needs_child_seat as boolean) ?? false,
    needsWheelchairAccess: (row.needs_wheelchair_access as boolean) ?? false,
    cargoDescription: (row.cargo_description as string) ?? '',
    status: row.status as RideRequest['status'],
    confirmedDriverId: (row.confirmed_driver_id as string) ?? undefined,
    confirmedDriverName: (row.confirmed_driver_name as string) ?? undefined,
    confirmedDriverPhone: (row.confirmed_driver_phone as string) ?? undefined,
    confirmedDriverVehicle: (row.confirmed_driver_vehicle as string) ?? undefined,
    createdAt: new Date(row.created_at as string),
  };
}

// Map a Supabase driver_trips row to our DriverTrip type.
function rowToDriverTrip(row: Record<string, unknown>): DriverTrip {
  return {
    id: row.id as string,
    driverId: row.driver_id as string,
    driverName: row.driver_name as string,
    driverPhone: row.driver_phone as string,
    destination: row.destination as string,
    departureTime: row.departure_time as string,
    departureLocation: row.departure_location as string,
    availableSeats: row.available_seats as number,
    petsAllowed: (row.pets_allowed as boolean) ?? false,
    childSeatsAvailable: (row.child_seats_available as number) ?? 0,
    wheelchairAccessible: (row.wheelchair_accessible as boolean) ?? false,
    notes: (row.notes as string) ?? '',
    status: row.status as DriverTrip['status'],
    createdAt: new Date(row.created_at as string),
  };
}

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [rideRequests, setRideRequests] = useState<RideRequest[]>([]);
  const [driverTrips, setDriverTrips] = useState<DriverTrip[]>([]);

  const loadRideRequests = async () => {
    const { data } = await supabase
      .from('ride_requests')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setRideRequests(data.map(rowToRideRequest));
  };

  const loadDriverTrips = async () => {
    const { data } = await supabase
      .from('driver_trips')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setDriverTrips(data.map(rowToDriverTrip));
  };

  useEffect(() => {
    // Initial data load
    loadRideRequests();
    loadDriverTrips();

    // Realtime subscriptions — reload the affected table on any row change.
    const requestsSub = supabase
      .channel('ride_requests_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ride_requests' }, loadRideRequests)
      .subscribe();

    const tripsSub = supabase
      .channel('driver_trips_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'driver_trips' }, loadDriverTrips)
      .subscribe();

    return () => {
      supabase.removeChannel(requestsSub);
      supabase.removeChannel(tripsSub);
    };
  }, []);

  const createRideRequest = async (request: Omit<RideRequest, 'id' | 'createdAt'>) => {
    await supabase.from('ride_requests').insert({
      rider_id: request.riderId,
      rider_name: request.riderName,
      rider_phone: request.riderPhone,
      destination: request.destination,
      pickup_location: request.pickupLocation,
      notes: request.notes,
      has_pet: request.hasPet,
      needs_child_seat: request.needsChildSeat,
      needs_wheelchair_access: request.needsWheelchairAccess,
      cargo_description: request.cargoDescription,
      status: request.status,
    });
  };

  const confirmRideRequest = async (
    requestId: string,
    driverId: string,
    driverName: string,
    driverPhone: string,
    driverVehicle: string,
  ) => {
    await supabase.from('ride_requests').update({
      status: 'confirmed',
      confirmed_driver_id: driverId,
      confirmed_driver_name: driverName,
      confirmed_driver_phone: driverPhone,
      confirmed_driver_vehicle: driverVehicle,
    }).eq('id', requestId);
  };

  const cancelRideRequest = async (requestId: string) => {
    await supabase.from('ride_requests').update({ status: 'cancelled' }).eq('id', requestId);
  };

  const createDriverTrip = async (trip: Omit<DriverTrip, 'id' | 'createdAt'>) => {
    await supabase.from('driver_trips').insert({
      driver_id: trip.driverId,
      driver_name: trip.driverName,
      driver_phone: trip.driverPhone,
      destination: trip.destination,
      departure_time: trip.departureTime,
      departure_location: trip.departureLocation,
      available_seats: trip.availableSeats,
      pets_allowed: trip.petsAllowed,
      child_seats_available: trip.childSeatsAvailable,
      wheelchair_accessible: trip.wheelchairAccessible,
      notes: trip.notes,
      status: trip.status,
    });
  };

  const updateDriverTrip = async (tripId: string, updates: Partial<DriverTrip>) => {
    const dbUpdates: Record<string, unknown> = {};
    if (updates.destination !== undefined) dbUpdates.destination = updates.destination;
    if (updates.departureTime !== undefined) dbUpdates.departure_time = updates.departureTime;
    if (updates.departureLocation !== undefined) dbUpdates.departure_location = updates.departureLocation;
    if (updates.availableSeats !== undefined) dbUpdates.available_seats = updates.availableSeats;
    if (updates.petsAllowed !== undefined) dbUpdates.pets_allowed = updates.petsAllowed;
    if (updates.childSeatsAvailable !== undefined) dbUpdates.child_seats_available = updates.childSeatsAvailable;
    if (updates.wheelchairAccessible !== undefined) dbUpdates.wheelchair_accessible = updates.wheelchairAccessible;
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    await supabase.from('driver_trips').update(dbUpdates).eq('id', tripId);
  };

  const deleteDriverTrip = async (tripId: string) => {
    await supabase.from('driver_trips').delete().eq('id', tripId);
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
