'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { useRouter } from 'next/navigation';
import RideRequestCard from '@/components/RideRequestCard';
import TripCard from '@/components/TripCard';
import { MapPin, Send, AlertCircle } from 'lucide-react';

export default function RiderPage() {
  const { user, isLoading } = useAuth();
  const { rideRequests, driverTrips, createRideRequest } = useData();
  const router = useRouter();

  const [formData, setFormData] = useState({
    pickupLocation: '',
    destination: '',
    notes: '',
    hasPet: false,
    needsChildSeat: false,
    needsWheelchairAccess: false,
    cargoDescription: '',
  });

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace('/auth/login');
      return;
    }
    if (user.role === 'driver') {
      router.replace('/driver');
      return;
    }

    // Pre-fill rider preferences
    setFormData((prev) => ({
      ...prev,
      hasPet: user.hasPet || false,
      needsChildSeat: user.needsChildSeat || false,
      needsWheelchairAccess: user.needsWheelchairAccess || false,
      cargoDescription: user.cargoNeeds || '',
    }));
  }, [user, isLoading, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    createRideRequest({
      riderId: user.uid,
      riderName: user.name,
      riderPhone: user.phone,
      destination: formData.destination,
      pickupLocation: formData.pickupLocation,
      notes: formData.notes,
      hasPet: formData.hasPet,
      needsChildSeat: formData.needsChildSeat,
      needsWheelchairAccess: formData.needsWheelchairAccess,
      cargoDescription: formData.cargoDescription,
      status: 'pending',
    });

    // Reset form except preferences
    setFormData({
      pickupLocation: '',
      destination: '',
      notes: '',
      hasPet: formData.hasPet,
      needsChildSeat: formData.needsChildSeat,
      needsWheelchairAccess: formData.needsWheelchairAccess,
      cargoDescription: formData.cargoDescription,
    });
  };

  if (isLoading || !user) return null;

  const myRequests = rideRequests.filter((r) => r.riderId === user.uid);
  const activeTrips = driverTrips.filter((t) => t.status === 'active');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Request a Ride</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Request Form */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">New Ride Request</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="pickup" className="block text-sm font-medium text-gray-700 mb-2">
                  Pickup Location *
                </label>
                <input
                  id="pickup"
                  type="text"
                  value={formData.pickupLocation}
                  onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                  placeholder="e.g., 123 Main St"
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
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  placeholder="e.g., Village Bay Ferry Terminal"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Special Requirements</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.hasPet}
                      onChange={(e) => setFormData({ ...formData, hasPet: e.target.checked })}
                      className="h-4 w-4 text-primary-600 rounded"
                    />
                    <span className="ml-3 text-sm text-gray-700">Traveling with pet 🐾</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.needsChildSeat}
                      onChange={(e) => setFormData({ ...formData, needsChildSeat: e.target.checked })}
                      className="h-4 w-4 text-primary-600 rounded"
                    />
                    <span className="ml-3 text-sm text-gray-700">Need child seat 👶</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.needsWheelchairAccess}
                      onChange={(e) => setFormData({ ...formData, needsWheelchairAccess: e.target.checked })}
                      className="h-4 w-4 text-primary-600 rounded"
                    />
                    <span className="ml-3 text-sm text-gray-700">Wheelchair accessible needed ♿</span>
                  </label>
                </div>
              </div>

              <div>
                <label htmlFor="cargo" className="block text-sm font-medium text-gray-700 mb-2">
                  Cargo Description
                </label>
                <input
                  id="cargo"
                  type="text"
                  value={formData.cargoDescription}
                  onChange={(e) => setFormData({ ...formData, cargoDescription: e.target.value })}
                  placeholder="e.g., 3 bags of groceries"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any other details..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <button
                type="submit"
                className="w-full px-4 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 font-semibold flex items-center justify-center"
              >
                <Send className="h-5 w-5 mr-2" />
                Submit Request
              </button>
            </form>

            <div className="mt-4 p-3 bg-blue-50 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800">
                All registered drivers will be notified of your request in real-time. A driver will confirm and contact you.
              </p>
            </div>
          </div>
        </div>

        {/* My Requests */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">My Ride Requests</h2>
          {myRequests.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No ride requests yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myRequests
                .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                .map((request) => (
                  <RideRequestCard key={request.id} request={request} />
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Available Driver Trips */}
      {activeTrips.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Available Driver Trips</h2>
          <p className="text-gray-600 mb-4">
            Drivers have posted these upcoming trips. Contact them directly if you'd like to join!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} showActions={true} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
