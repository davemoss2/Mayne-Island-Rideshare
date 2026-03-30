'use client';

import { RideRequest } from '@/types';
import { Clock, MapPin, Check, Phone, Car, AlertCircle } from 'lucide-react';

interface RideRequestCardProps {
  request: RideRequest;
  onConfirm?: () => void;
  showActions?: boolean;
}

export default function RideRequestCard({ request, onConfirm, showActions = false }: RideRequestCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-lg text-gray-900">{request.riderName}</h3>
          <p className="text-sm text-gray-500 flex items-center mt-1">
            <Clock className="h-4 w-4 mr-1" />
            {formatDate(request.createdAt)}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            request.status === 'pending'
              ? 'bg-yellow-100 text-yellow-800'
              : request.status === 'confirmed'
              ? 'bg-green-100 text-green-800'
              : request.status === 'completed'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {request.status.toUpperCase()}
        </span>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-start">
          <MapPin className="h-4 w-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
          <div>
            <p className="text-xs text-gray-500">Pickup</p>
            <p className="text-sm font-medium">{request.pickupLocation}</p>
          </div>
        </div>
        <div className="flex items-start">
          <MapPin className="h-4 w-4 text-red-600 mr-2 mt-1 flex-shrink-0" />
          <div>
            <p className="text-xs text-gray-500">Destination</p>
            <p className="text-sm font-medium">{request.destination}</p>
          </div>
        </div>
      </div>

      {(request.hasPet || request.needsChildSeat || request.needsWheelchairAccess || request.cargoDescription) && (
        <div className="mb-3 p-3 bg-blue-50 rounded-md">
          <p className="text-xs font-semibold text-blue-900 mb-2">Special Requirements:</p>
          <div className="space-y-1 text-sm text-blue-800">
            {request.hasPet && <p>🐾 Traveling with pet</p>}
            {request.needsChildSeat && <p>👶 Child seat needed</p>}
            {request.needsWheelchairAccess && <p>♿ Wheelchair accessible vehicle needed</p>}
            {request.cargoDescription && <p>📦 Cargo: {request.cargoDescription}</p>}
          </div>
        </div>
      )}

      {request.notes && (
        <div className="mb-3 p-3 bg-gray-50 rounded-md">
          <p className="text-xs font-semibold text-gray-700 mb-1">Notes:</p>
          <p className="text-sm text-gray-600">{request.notes}</p>
        </div>
      )}

      {request.status === 'confirmed' && request.confirmedDriverName && (
        <div className="mb-3 p-3 bg-green-50 rounded-md border-2 border-green-200">
          <p className="text-sm font-semibold text-green-900 flex items-center mb-2">
            <Check className="h-4 w-4 mr-2" />
            Driver Confirmed!
          </p>
          <div className="space-y-1 text-sm text-green-800">
            <p className="flex items-center">
              <Car className="h-4 w-4 mr-2" />
              {request.confirmedDriverName}
            </p>
            {request.confirmedDriverPhone && (
              <p className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                <a href={`tel:${request.confirmedDriverPhone}`} className="underline">
                  {request.confirmedDriverPhone}
                </a>
              </p>
            )}
            {request.confirmedDriverVehicle && (
              <p className="text-xs">Vehicle: {request.confirmedDriverVehicle}</p>
            )}
          </div>
        </div>
      )}

      {showActions && request.status === 'pending' && onConfirm && (
        <button
          onClick={onConfirm}
          className="w-full mt-3 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 font-medium flex items-center justify-center"
        >
          <Check className="h-5 w-5 mr-2" />
          Confirm & Contact Rider
        </button>
      )}

      {!showActions && request.status === 'pending' && (
        <div className="mt-3 p-2 bg-yellow-50 rounded-md flex items-center text-sm text-yellow-800">
          <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
          <span>Waiting for driver confirmation...</span>
        </div>
      )}
    </div>
  );
}
