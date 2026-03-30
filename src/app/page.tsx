'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Car, Users, CheckCircle, ArrowRight, Heart, Shield, MapPin } from 'lucide-react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { user } = useAuth();
  const { rideRequests, driverTrips } = useData();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      if (user.role === 'rider') {
        router.replace('/rider');
      } else if (user.role === 'driver') {
        router.replace('/driver');
      } else if (user.role === 'both') {
        router.replace('/rider');
      }
    }
  }, [user, router]);

  const completedRides = rideRequests.filter((r) => r.status === 'completed').length;
  const activeDrivers = new Set(driverTrips.map((t) => t.driverId)).size;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="flex justify-center mb-6">
          <div className="bg-primary-100 p-4 rounded-full">
            <Car className="h-16 w-16 text-primary-600" />
          </div>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
          Mayne Island Rideshare
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          A free, community-driven volunteer rideshare service connecting neighbors on Mayne Island, BC
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/auth/register"
            className="px-8 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-semibold text-lg flex items-center justify-center shadow-lg"
          >
            I Need a Ride
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <Link
            href="/auth/register"
            className="px-8 py-4 bg-ocean-600 text-white rounded-lg hover:bg-ocean-700 font-semibold text-lg flex items-center justify-center shadow-lg"
          >
            I'm a Driver
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <Users className="h-12 w-12 text-primary-600 mx-auto mb-3" />
          <p className="text-3xl font-bold text-gray-900">{activeDrivers}+</p>
          <p className="text-gray-600">Active Volunteer Drivers</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
          <p className="text-3xl font-bold text-gray-900">{completedRides}+</p>
          <p className="text-gray-600">Rides Completed</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <Heart className="h-12 w-12 text-red-600 mx-auto mb-3" />
          <p className="text-3xl font-bold text-gray-900">100%</p>
          <p className="text-gray-600">Free & Volunteer</p>
        </div>
      </div>

      {/* How It Works */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* For Riders */}
          <div>
            <h3 className="text-2xl font-semibold text-primary-700 mb-6 flex items-center">
              <Users className="h-6 w-6 mr-2" />
              For Riders
            </h3>
            <div className="space-y-6">
              <div className="flex">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900 mb-1">Sign Up & Request</h4>
                  <p className="text-gray-600">Create an account and submit your ride request with pickup/destination details</p>
                </div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900 mb-1">Get Matched</h4>
                  <p className="text-gray-600">All registered drivers are notified in real-time about your request</p>
                </div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900 mb-1">Connect & Go</h4>
                  <p className="text-gray-600">A driver confirms, you get their contact info, and coordinate your ride!</p>
                </div>
              </div>
            </div>
          </div>

          {/* For Drivers */}
          <div>
            <h3 className="text-2xl font-semibold text-ocean-700 mb-6 flex items-center">
              <Car className="h-6 w-6 mr-2" />
              For Drivers
            </h3>
            <div className="space-y-6">
              <div className="flex">
                <div className="flex-shrink-0 w-8 h-8 bg-ocean-600 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900 mb-1">Register as Driver</h4>
                  <p className="text-gray-600">Sign up with your vehicle details and accommodation preferences</p>
                </div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0 w-8 h-8 bg-ocean-600 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900 mb-1">See Requests & Post Trips</h4>
                  <p className="text-gray-600">View ride requests in real-time or post your own planned trips</p>
                </div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0 w-8 h-8 bg-ocean-600 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900 mb-1">Confirm & Help</h4>
                  <p className="text-gray-600">Confirm rides you can help with and connect directly with riders</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Community Guidelines */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8 flex items-center justify-center">
          <Shield className="h-8 w-8 mr-3 text-primary-600" />
          Community Guidelines
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="space-y-3">
            <h3 className="font-semibold text-lg text-gray-900 mb-3">Core Values</h3>
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-gray-700">Be respectful and courteous to all community members</p>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-gray-700">This is a FREE volunteer service - no payment accepted</p>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-gray-700">Communicate clearly about special needs (pets, accessibility, cargo)</p>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-gray-700">Be punctual and communicate if plans change</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="font-semibold text-lg text-gray-900 mb-3">Safety First</h3>
            <div className="flex items-start">
              <Shield className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-gray-700">All drivers should have valid license and insurance</p>
            </div>
            <div className="flex items-start">
              <Shield className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-gray-700">Emergency contact info is recommended for all users</p>
            </div>
            <div className="flex items-start">
              <Shield className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-gray-700">Use the Emergency page if you need assistance</p>
            </div>
            <div className="flex items-start">
              <Shield className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-gray-700">Trust your instincts - safety is paramount</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <MapPin className="h-10 w-10 text-primary-600 mb-4" />
            <h3 className="font-semibold text-xl text-gray-900 mb-2">Interactive Map</h3>
            <p className="text-gray-600">
              Plan routes with Leaflet maps, export to Google Maps or Waze for turn-by-turn navigation
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <Users className="h-10 w-10 text-ocean-600 mb-4" />
            <h3 className="font-semibold text-xl text-gray-900 mb-2">Message Board</h3>
            <p className="text-gray-600">
              Drivers post their planned trips, visible to the whole community with easy social sharing
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <Heart className="h-10 w-10 text-red-600 mb-4" />
            <h3 className="font-semibold text-xl text-gray-900 mb-2">Inclusive Design</h3>
            <p className="text-gray-600">
              Support for pets, child seats, wheelchair accessibility, and cargo needs
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center bg-gradient-to-r from-primary-600 to-ocean-600 rounded-lg shadow-xl p-12 text-white">
        <h2 className="text-3xl font-bold mb-4">Join Our Community Today</h2>
        <p className="text-xl mb-8 opacity-90">
          Help make transportation accessible for everyone on Mayne Island
        </p>
        <Link
          href="/auth/register"
          className="inline-block px-8 py-4 bg-white text-primary-700 rounded-lg hover:bg-gray-100 font-semibold text-lg shadow-lg"
        >
          Get Started - It's Free!
        </Link>
      </div>
    </div>
  );
}
