'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';

// Fix for default marker icons in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapComponentProps {
  center?: [number, number];
  zoom?: number;
}

export default function MapComponent({ center = [48.85, -123.3], zoom = 12 }: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [startPoint, setStartPoint] = useState<[number, number] | null>(null);
  const [endPoint, setEndPoint] = useState<[number, number] | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const startMarkerRef = useRef<L.Marker | null>(null);
  const endMarkerRef = useRef<L.Marker | null>(null);
  const routeLineRef = useRef<L.Polyline | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize map
    const map = L.map(mapContainerRef.current).setView(center, zoom);
    mapRef.current = map;

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Add some common locations on Mayne Island
    const locations = [
      { name: 'Village Bay Ferry Terminal', coords: [48.848, -123.296] as [number, number] },
      { name: 'Miners Bay', coords: [48.854, -123.287] as [number, number] },
      { name: 'Agricultural Hall', coords: [48.853, -123.285] as [number, number] },
      { name: 'Dinner Bay Park', coords: [48.831, -123.272] as [number, number] },
    ];

    locations.forEach((loc) => {
      L.marker(loc.coords)
        .addTo(map)
        .bindPopup(`<b>${loc.name}</b>`)
        .openPopup();
    });

    // Add click handler
    map.on('click', (e: L.LeafletMouseEvent) => {
      if (!startPoint) {
        setStartPoint([e.latlng.lat, e.latlng.lng]);
      } else if (!endPoint) {
        setEndPoint([e.latlng.lat, e.latlng.lng]);
      } else {
        // Reset
        setStartPoint([e.latlng.lat, e.latlng.lng]);
        setEndPoint(null);
        setDistance(null);
      }
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [center, zoom]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Update start marker
    if (startMarkerRef.current) {
      mapRef.current.removeLayer(startMarkerRef.current);
    }

    if (startPoint) {
      const greenIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      startMarkerRef.current = L.marker(startPoint, { icon: greenIcon })
        .addTo(mapRef.current)
        .bindPopup('<b>Start Point</b>')
        .openPopup();
    }

    // Update end marker
    if (endMarkerRef.current) {
      mapRef.current.removeLayer(endMarkerRef.current);
    }

    if (endPoint) {
      const redIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      endMarkerRef.current = L.marker(endPoint, { icon: redIcon })
        .addTo(mapRef.current)
        .bindPopup('<b>End Point</b>')
        .openPopup();
    }

    // Draw route line
    if (routeLineRef.current) {
      mapRef.current.removeLayer(routeLineRef.current);
    }

    if (startPoint && endPoint) {
      routeLineRef.current = L.polyline([startPoint, endPoint], {
        color: '#22c55e',
        weight: 4,
        opacity: 0.7,
      }).addTo(mapRef.current);

      // Calculate distance
      const dist = mapRef.current.distance(startPoint, endPoint);
      setDistance(dist);

      // Fit bounds to show both markers
      mapRef.current.fitBounds([startPoint, endPoint], { padding: [50, 50] });
    }
  }, [startPoint, endPoint]);

  const openInGoogleMaps = () => {
    if (startPoint && endPoint) {
      const url = `https://www.google.com/maps/dir/?api=1&origin=${startPoint[0]},${startPoint[1]}&destination=${endPoint[0]},${endPoint[1]}`;
      window.open(url, '_blank');
    }
  };

  const openInWaze = () => {
    if (endPoint) {
      const url = `https://www.waze.com/ul?ll=${endPoint[0]},${endPoint[1]}&navigate=yes`;
      window.open(url, '_blank');
    }
  };

  const clearRoute = () => {
    setStartPoint(null);
    setEndPoint(null);
    setDistance(null);
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="w-full h-full rounded-lg shadow-lg" />
      
      <div className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-lg z-[1000] max-w-xs">
        <h3 className="font-semibold text-lg mb-2 flex items-center">
          <Navigation className="h-5 w-5 mr-2 text-primary-600" />
          Route Planner
        </h3>
        <p className="text-sm text-gray-600 mb-3">
          Click on the map to set start and end points
        </p>
        
        {startPoint && (
          <div className="mb-2 text-sm flex items-start">
            <MapPin className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
            <span>Start: {startPoint[0].toFixed(4)}, {startPoint[1].toFixed(4)}</span>
          </div>
        )}
        
        {endPoint && (
          <div className="mb-2 text-sm flex items-start">
            <MapPin className="h-4 w-4 text-red-600 mr-2 mt-0.5" />
            <span>End: {endPoint[0].toFixed(4)}, {endPoint[1].toFixed(4)}</span>
          </div>
        )}
        
        {distance && (
          <div className="mb-3 text-sm font-semibold text-primary-700">
            Distance: {(distance / 1000).toFixed(2)} km
          </div>
        )}

        {startPoint && endPoint && (
          <div className="space-y-2">
            <button
              onClick={openInGoogleMaps}
              className="w-full px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center text-sm"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in Google Maps
            </button>
            <button
              onClick={openInWaze}
              className="w-full px-3 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 flex items-center justify-center text-sm"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in Waze
            </button>
            <button
              onClick={clearRoute}
              className="w-full px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
            >
              Clear Route
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
