'use client';

import { DriverTrip } from '@/types';
import { Clock, MapPin, Users, Phone, Share2, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface TripCardProps {
  trip: DriverTrip;
  showActions?: boolean;
  onDelete?: () => void;
}

export default function TripCard({ trip, showActions = true, onDelete }: TripCardProps) {
  const [copied, setCopied] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.origin + '/board' : '';
  const shareText = `${trip.driverName} is heading to ${trip.destination} from ${trip.departureLocation} on ${formatDate(trip.departureTime)}. ${trip.availableSeats} seats available!`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareToWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText + '\n' + shareUrl)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-lg text-gray-900">{trip.driverName}</h3>
          <p className="text-sm text-gray-500 flex items-center mt-1">
            <Clock className="h-4 w-4 mr-1" />
            {formatDate(trip.departureTime)}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            trip.status === 'active'
              ? 'bg-green-100 text-green-800'
              : trip.status === 'full'
              ? 'bg-orange-100 text-orange-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {trip.status.toUpperCase()}
        </span>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-start">
          <MapPin className="h-4 w-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
          <div>
            <p className="text-xs text-gray-500">From</p>
            <p className="text-sm font-medium">{trip.departureLocation}</p>
          </div>
        </div>
        <div className="flex items-start">
          <MapPin className="h-4 w-4 text-red-600 mr-2 mt-1 flex-shrink-0" />
          <div>
            <p className="text-xs text-gray-500">To</p>
            <p className="text-sm font-medium">{trip.destination}</p>
          </div>
        </div>
      </div>

      <div className="mb-3 p-3 bg-blue-50 rounded-md">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-blue-900 flex items-center">
            <Users className="h-4 w-4 mr-2" />
            {trip.availableSeats} seat{trip.availableSeats !== 1 ? 's' : ''} available
          </p>
        </div>
        <div className="space-y-1 text-sm text-blue-800">
          {trip.petsAllowed && <p>🐾 Pets allowed</p>}
          {trip.childSeatsAvailable > 0 && (
            <p>👶 {trip.childSeatsAvailable} child seat{trip.childSeatsAvailable !== 1 ? 's' : ''}</p>
          )}
          {trip.wheelchairAccessible && <p>♿ Wheelchair accessible</p>}
        </div>
      </div>

      {trip.notes && (
        <div className="mb-3 p-3 bg-gray-50 rounded-md">
          <p className="text-xs font-semibold text-gray-700 mb-1">Notes:</p>
          <p className="text-sm text-gray-600">{trip.notes}</p>
        </div>
      )}

      {showActions && (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Phone className="h-4 w-4 text-gray-600" />
            <a href={`tel:${trip.driverPhone}`} className="text-sm text-primary-600 hover:underline">
              {trip.driverPhone}
            </a>
          </div>

          <div className="pt-2 border-t border-gray-200">
            <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center">
              <Share2 className="h-4 w-4 mr-1" />
              Share this trip:
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={copyToClipboard}
                className="px-3 py-1.5 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-xs flex items-center"
              >
                {copied ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={shareToFacebook}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-xs"
              >
                Facebook
              </button>
              <button
                onClick={shareToTwitter}
                className="px-3 py-1.5 bg-sky-500 text-white rounded-md hover:bg-sky-600 text-xs"
              >
                Twitter
              </button>
              <button
                onClick={shareToWhatsApp}
                className="px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 text-xs"
              >
                WhatsApp
              </button>
            </div>
          </div>

          {onDelete && (
            <button
              onClick={onDelete}
              className="w-full mt-2 px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 text-sm font-medium"
            >
              Delete Trip
            </button>
          )}
        </div>
      )}
    </div>
  );
}
