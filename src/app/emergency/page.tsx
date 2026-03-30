'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { AlertTriangle, Phone, Shield, MapPin, Info, FileText } from 'lucide-react';

export default function EmergencyPage() {
  const { user } = useAuth();
  const { rideRequests } = useData();
  const [activeRide, setActiveRide] = useState<any>(null);

  useEffect(() => {
    if (!user) return;

    // Check if user has an active ride
    const myActiveRide = rideRequests.find(
      (r) =>
        r.status === 'confirmed' &&
        (r.riderId === user.uid || r.confirmedDriverId === user.uid)
    );

    setActiveRide(myActiveRide);
  }, [user, rideRequests]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 mb-8">
        <div className="flex items-center mb-4">
          <AlertTriangle className="h-8 w-8 text-red-600 mr-3" />
          <h1 className="text-3xl font-bold text-red-900">Emergency Assistance</h1>
        </div>
        <p className="text-red-800">
          If you're in immediate danger, call 911 immediately. This page provides emergency contacts and safety resources.
        </p>
      </div>

      {/* Emergency Contacts */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
          <Phone className="h-6 w-6 mr-2 text-red-600" />
          Emergency Contacts
        </h2>
        <div className="space-y-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <h3 className="font-semibold text-red-900 mb-2">BC Emergency Services</h3>
            <a href="tel:911" className="text-2xl font-bold text-red-600 hover:underline">
              911
            </a>
            <p className="text-sm text-red-700 mt-1">Police, Fire, Ambulance</p>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h3 className="font-semibold text-blue-900 mb-2">Mayne Island RCMP (Non-Emergency)</h3>
            <a href="tel:250-539-3466" className="text-xl font-bold text-blue-600 hover:underline">
              250-539-3466
            </a>
          </div>

          <div className="p-4 bg-ocean-50 border border-ocean-200 rounded-md">
            <h3 className="font-semibold text-ocean-900 mb-2">Canadian Coast Guard</h3>
            <a href="tel:1-800-567-5803" className="text-xl font-bold text-ocean-600 hover:underline">
              1-800-567-5803
            </a>
            <p className="text-sm text-ocean-700 mt-1">Marine emergencies</p>
          </div>

          <div className="p-4 bg-purple-50 border border-purple-200 rounded-md">
            <h3 className="font-semibold text-purple-900 mb-2">BC Crisis Line</h3>
            <a href="tel:1-800-784-2433" className="text-xl font-bold text-purple-600 hover:underline">
              1-800-784-2433
            </a>
            <p className="text-sm text-purple-700 mt-1">24/7 crisis support</p>
          </div>
        </div>
      </div>

      {/* Active Ride Contact */}
      {activeRide && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
            <MapPin className="h-6 w-6 mr-2 text-green-600" />
            Your Active Ride
          </h2>

          {user?.uid === activeRide.riderId && activeRide.confirmedDriverName && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <h3 className="font-semibold text-green-900 mb-3">Driver Contact Information</h3>
              <div className="space-y-2">
                <p className="text-gray-900">
                  <strong>Driver:</strong> {activeRide.confirmedDriverName}
                </p>
                <p className="text-gray-900">
                  <strong>Phone:</strong>{' '}
                  <a href={`tel:${activeRide.confirmedDriverPhone}`} className="text-green-600 hover:underline font-semibold">
                    {activeRide.confirmedDriverPhone}
                  </a>
                </p>
                {activeRide.confirmedDriverVehicle && (
                  <p className="text-gray-900">
                    <strong>Vehicle:</strong> {activeRide.confirmedDriverVehicle}
                  </p>
                )}
                <p className="text-gray-700 mt-3">
                  <strong>Destination:</strong> {activeRide.destination}
                </p>
              </div>
            </div>
          )}

          {user?.uid === activeRide.confirmedDriverId && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
              <h3 className="font-semibold text-blue-900 mb-3">Rider Contact Information</h3>
              <div className="space-y-2">
                <p className="text-gray-900">
                  <strong>Rider:</strong> {activeRide.riderName}
                </p>
                <p className="text-gray-900">
                  <strong>Phone:</strong>{' '}
                  <a href={`tel:${activeRide.riderPhone}`} className="text-blue-600 hover:underline font-semibold">
                    {activeRide.riderPhone}
                  </a>
                </p>
                <p className="text-gray-700 mt-3">
                  <strong>Pickup:</strong> {activeRide.pickupLocation}
                </p>
                <p className="text-gray-700">
                  <strong>Destination:</strong> {activeRide.destination}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Safety Guidelines */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
          <Shield className="h-6 w-6 mr-2 text-blue-600" />
          Safety Guidelines
        </h2>
        <div className="space-y-4 text-gray-700">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Before the Ride</h3>
            <ul className="list-disc ml-6 space-y-1">
              <li>Share your ride details with a friend or family member</li>
              <li>Confirm the driver's name, vehicle description, and phone number</li>
              <li>Meet in a well-lit, public location when possible</li>
              <li>Trust your instincts - if something feels wrong, don't get in the vehicle</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">During the Ride</h3>
            <ul className="list-disc ml-6 space-y-1">
              <li>Sit in the back seat when possible</li>
              <li>Keep your phone charged and accessible</li>
              <li>Follow the route on your GPS/map app</li>
              <li>If you feel uncomfortable, ask to be let out in a safe, public area</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">If Something Goes Wrong</h3>
            <ul className="list-disc ml-6 space-y-1">
              <li>Call 911 if you're in immediate danger</li>
              <li>Contact the other party (driver/rider) if there's a miscommunication</li>
              <li>For non-emergency issues, contact Mayne Island RCMP at 250-539-3466</li>
              <li>Report any safety concerns to community administrators</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Report Incident */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
          <FileText className="h-6 w-6 mr-2 text-orange-600" />
          Report an Incident
        </h2>
        <div className="p-4 bg-orange-50 border border-orange-200 rounded-md">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-orange-600 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-orange-900 mb-3">
                If you experienced a safety issue or incident during a ride, please report it to:
              </p>
              <ul className="list-disc ml-6 space-y-2 text-orange-800">
                <li>
                  <strong>Emergency situations:</strong> Call 911 immediately
                </li>
                <li>
                  <strong>Non-emergency incidents:</strong> Contact Mayne Island RCMP at 250-539-3466
                </li>
                <li>
                  <strong>Community concerns:</strong> Document the incident details (date, time, names, description) and contact local community organizers
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Emergency Contact */}
      {user?.emergencyContact && (
        <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
            <Phone className="h-6 w-6 mr-2 text-purple-600" />
            Your Emergency Contact
          </h2>
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-md">
            <p className="text-gray-900">
              <strong>Name:</strong> {user.emergencyContact.name}
            </p>
            <p className="text-gray-900 mt-2">
              <strong>Phone:</strong>{' '}
              <a href={`tel:${user.emergencyContact.phone}`} className="text-purple-600 hover:underline font-semibold">
                {user.emergencyContact.phone}
              </a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
