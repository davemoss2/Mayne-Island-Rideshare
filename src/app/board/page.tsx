'use client';

import { useData } from '@/contexts/DataContext';
import TripCard from '@/components/TripCard';
import { MessageSquare, Car } from 'lucide-react';

export default function BoardPage() {
  const { driverTrips } = useData();

  const activeTrips = driverTrips
    .filter((t) => t.status === 'active')
    .sort((a, b) => new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="bg-primary-100 p-3 rounded-full">
            <MessageSquare className="h-10 w-10 text-primary-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Community Message Board</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Drivers post their planned trips here. If you need a ride and see a trip going your way, contact the driver directly!
        </p>
      </div>

      {activeTrips.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Active Trips Posted</h2>
          <p className="text-gray-600 mb-4">
            There are no driver trips posted at the moment. Check back later!
          </p>
          <p className="text-sm text-gray-500">
            Are you a driver? Post your planned trips to help community members get where they need to go.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} showActions={true} />
          ))}
        </div>
      )}
    </div>
  );
}
