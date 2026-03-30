'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { useRouter } from 'next/navigation';
import RideRequestCard from '@/components/RideRequestCard';
import TripCard from '@/components/TripCard';
import { Car, AlertCircle, Plus } from 'lucide-react';

export default function DriverPage() {
  const { user } = useAuth();
  const { rideRequests, driverTrips, confirmRideRequest, createDriverTrip, deleteDriverTrip } = useData();
  const router = useRouter();

  const [showTripForm, setShowTripForm] = useState(false);
  const [tripFormData, setTripFormData] = useState({
    destination: '',
    departureTime: '',
    departureLocation: '',
    availableSeats: 1,
    notes: '',
  });

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    if (user.role === 'rider') {
      router.push('/rider');
      return;
    }
  }, [user, router]);

  const handleConfirmRide = (requestId: string) => {
    if (!user) return;
    confirmRideRequest(
      requestId,
      user.uid,
      user.name,
      user.phone,
      user.vehicleDescription || 'Vehicle'
    );
  };

  const handleSubmitTrip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    createDriverTrip({
      driverId: user.uid,
      driverName: user.name,
      driverPhone: user.phone,
      destination: tripFormData.destination,
      departureTime: tripFormData.departureTime,
      departureLocation: tripFormData.departureLocation,
      availableSeats: tripFormData.availableSeats,
      petsAllowed: user.petsAllowed === 'yes',
      childSeatsAvailable: user.childSeatsAvailable || 0,
      wheelchairAccessible: user.wheelchairAccessible || false,
      notes: tripFormData.notes,
      status: 'active',
    });

    setTripFormData({
      destination: '',
      departureTime: '',
      departureLocation: '',
      availableSeats: 1,
      notes: '',
    });
    setShowTripForm(false);
  };

  if (!user) return null;

  const pendingRequests = rideRequests.filter((r) => r.status === 'pending');
  const myTrips = driverTrips.filter((t) => t.driverId === user.uid);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Driver Dashboard</h1>

      {/* Pending Ride Requests */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Pending Ride Requests</h2>
          {pendingRequests.length > 0 && (
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
              {pendingRequests.length} New
            </span>
          )}
        </div>

        {pendingRequests.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Car className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No pending ride requests at the moment</p>
            <p className="text-sm text-gray-500 mt-2">Check back later or post your own trip!</p>
          </div>
        ) : (
          <>
            <div className="mb-4 p-4 bg-blue-50 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-blue-800 font-semibold">Real-time Requests</p>
                <p className="text-sm text-blue-700">
                  These are live ride requests from community members. Click "Confirm" to help someone out!
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingRequests
                .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                .map((request) => (
                  <RideRequestCard
                    key={request.id}
                    request={request}
                    showActions={true}
                    onConfirm={() => handleConfirmRide(request.id)}
                  />
                ))}
            </div>
          </>
        )}
      </div>

      {/* My Posted Trips */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">My Posted Trips</h2>
          <button
            onClick={() => setShowTripForm(!showTripForm)}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 font-semibold flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Post New Trip
          </button>
        </div>

        {showTripForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Post a Trip</h3>
            <form onSubmit={handleSubmitTrip} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="departureLocation" className="block text-sm font-medium text-gray-700 mb-2">
                    Departure Location *
                  </label>
                  <input
                    id="departureLocation"
                    type="text"
                    value={tripFormData.departureLocation}
                    onChange={(e) => setTripFormData({ ...tripFormData, departureLocation: e.target.value })}
                    placeholder="e.g., Miners Bay"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-2">
                    Destination *
                  </label>
                  <input
                    id="destination"
                    type="text"
                    value={tripFormData.destination}
                    onChange={(e) => setTripFormData({ ...tripFormData, destination: e.target.value })}
                    placeholder="e.g., Village Bay Ferry"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="departureTime" className="block text-sm font-medium text-gray-700 mb-2">
                    Departure Time *
                  </label>
                  <input
                    id="departureTime"
                    type="datetime-local"
                    value={tripFormData.departureTime}
                    onChange={(e) => setTripFormData({ ...tripFormData, departureTime: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="availableSeats" className="block text-sm font-medium text-gray-700 mb-2">
                    Available Seats *
                  </label>
                  <input
                    id="availableSeats"
                    type="number"
                    min="1"
                    max="8"
                    value={tripFormData.availableSeats}
                    onChange={(e) => setTripFormData({ ...tripFormData, availableSeats: parseInt(e.target.value) || 1 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="tripNotes" className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  id="tripNotes"
                  value={tripFormData.notes}
                  onChange={(e) => setTripFormData({ ...tripFormData, notes: e.target.value })}
                  placeholder="Any additional information..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Your vehicle accommodations:</strong>
                </p>
                <ul className="text-sm text-gray-600 space-y-1 ml-4 list-disc">
                  <li>Pets: {user.petsAllowed || 'Not specified'}</li>
                  <li>Child seats: {user.childSeatsAvailable || 0}</li>
                  <li>Wheelchair accessible: {user.wheelchairAccessible ? 'Yes' : 'No'}</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 font-semibold"
                >
                  Post Trip
                </button>
                <button
                  type="button"
                  onClick={() => setShowTripForm(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {myTrips.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Car className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">You haven't posted any trips yet</p>
            <p className="text-sm text-gray-500 mt-2">Post your planned trips to help community members!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myTrips
              .sort((a, b) => new Date(b.departureTime).getTime() - new Date(a.departureTime).getTime())
              .map((trip) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  showActions={true}
                  onDelete={() => deleteDriverTrip(trip.id)}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
