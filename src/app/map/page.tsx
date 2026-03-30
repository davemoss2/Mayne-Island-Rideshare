'use client';

import dynamic from 'next/dynamic';
import { MapPin } from 'lucide-react';

const MapComponent = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
      <div className="text-center">
        <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2 animate-pulse" />
        <p className="text-gray-600">Loading map...</p>
      </div>
    </div>
  ),
});

export default function MapPage() {
  return (
    <div className="h-[calc(100vh-4rem)] p-4">
      <div className="h-full">
        <MapComponent center={[48.85, -123.3]} zoom={12} />
      </div>
    </div>
  );
}
