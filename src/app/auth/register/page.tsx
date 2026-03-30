'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserPlus, AlertCircle, Info } from 'lucide-react';
import { UserProfile } from '@/types';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'both' as 'rider' | 'driver' | 'both',
    // Driver fields
    vehicleDescription: '',
    petsAllowed: 'case-by-case' as 'yes' | 'no' | 'case-by-case',
    childSeatsAvailable: 0,
    wheelchairAccessible: false,
    cargoCapacity: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    // Rider fields
    hasPet: false,
    needsChildSeat: false,
    needsWheelchairAccess: false,
    cargoNeeds: '',
  });

  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!agreed) {
      setError('Please agree to the community guidelines');
      return;
    }

    setLoading(true);

    try {
      type RegisterData = Omit<UserProfile, 'uid' | 'createdAt'> & { password: string };
      const profileData: RegisterData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
        vehicleDescription: (formData.role === 'driver' || formData.role === 'both') ? formData.vehicleDescription : undefined,
        petsAllowed: (formData.role === 'driver' || formData.role === 'both') ? formData.petsAllowed : undefined,
        childSeatsAvailable: (formData.role === 'driver' || formData.role === 'both') ? formData.childSeatsAvailable : undefined,
        wheelchairAccessible: (formData.role === 'driver' || formData.role === 'both') ? formData.wheelchairAccessible : undefined,
        cargoCapacity: (formData.role === 'driver' || formData.role === 'both') ? formData.cargoCapacity : undefined,
        emergencyContact: (formData.role === 'driver' || formData.role === 'both') && formData.emergencyContactName && formData.emergencyContactPhone
          ? { name: formData.emergencyContactName, phone: formData.emergencyContactPhone }
          : undefined,
        hasPet: (formData.role === 'rider' || formData.role === 'both') ? formData.hasPet : undefined,
        needsChildSeat: (formData.role === 'rider' || formData.role === 'both') ? formData.needsChildSeat : undefined,
        needsWheelchairAccess: (formData.role === 'rider' || formData.role === 'both') ? formData.needsWheelchairAccess : undefined,
        cargoNeeds: (formData.role === 'rider' || formData.role === 'both') ? formData.cargoNeeds : undefined,
      };

      const success = await register(profileData);
      if (success) {
        router.push('/');
      } else {
        setError('Email already registered');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const showDriverFields = formData.role === 'driver' || formData.role === 'both';
  const showRiderFields = formData.role === 'rider' || formData.role === 'both';

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-primary-100 rounded-full mb-4">
            <UserPlus className="h-8 w-8 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join Our Community</h1>
          <p className="text-gray-600">Create your free account</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                  minLength={6}
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password *
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              I want to register as: *
            </label>
            <div className="space-y-2">
              <label className="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="role"
                  value="rider"
                  checked={formData.role === 'rider'}
                  onChange={(e) => setFormData({ ...formData, role: 'rider' })}
                  className="h-4 w-4 text-primary-600"
                />
                <span className="ml-3 text-gray-900">Rider (I need rides)</span>
              </label>
              <label className="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="role"
                  value="driver"
                  checked={formData.role === 'driver'}
                  onChange={(e) => setFormData({ ...formData, role: 'driver' })}
                  className="h-4 w-4 text-primary-600"
                />
                <span className="ml-3 text-gray-900">Driver (I can give rides)</span>
              </label>
              <label className="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="role"
                  value="both"
                  checked={formData.role === 'both'}
                  onChange={(e) => setFormData({ ...formData, role: 'both' })}
                  className="h-4 w-4 text-primary-600"
                />
                <span className="ml-3 text-gray-900">Both (I can drive and need rides)</span>
              </label>
            </div>
          </div>

          {/* Driver-specific fields */}
          {showDriverFields && (
            <div className="border-t pt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Driver Information</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="vehicleDescription" className="block text-sm font-medium text-gray-700 mb-2">
                    Vehicle Description *
                  </label>
                  <input
                    id="vehicleDescription"
                    type="text"
                    value={formData.vehicleDescription}
                    onChange={(e) => setFormData({ ...formData, vehicleDescription: e.target.value })}
                    placeholder="e.g., Blue Toyota Camry 2018"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required={showDriverFields}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pets Allowed
                  </label>
                  <select
                    value={formData.petsAllowed}
                    onChange={(e) => setFormData({ ...formData, petsAllowed: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                    <option value="case-by-case">Case by case</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="childSeats" className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Child Seats Available
                  </label>
                  <input
                    id="childSeats"
                    type="number"
                    min="0"
                    value={formData.childSeatsAvailable}
                    onChange={(e) => setFormData({ ...formData, childSeatsAvailable: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.wheelchairAccessible}
                      onChange={(e) => setFormData({ ...formData, wheelchairAccessible: e.target.checked })}
                      className="h-4 w-4 text-primary-600 rounded"
                    />
                    <span className="ml-3 text-sm text-gray-700">Wheelchair Accessible Vehicle</span>
                  </label>
                </div>

                <div>
                  <label htmlFor="cargoCapacity" className="block text-sm font-medium text-gray-700 mb-2">
                    Cargo Capacity Description
                  </label>
                  <textarea
                    id="cargoCapacity"
                    value={formData.cargoCapacity}
                    onChange={(e) => setFormData({ ...formData, cargoCapacity: e.target.value })}
                    placeholder="e.g., Can fit 2 large suitcases in trunk"
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div className="bg-blue-50 p-4 rounded-md">
                  <h3 className="text-sm font-semibold text-blue-900 mb-3">Emergency Contact (Recommended)</h3>
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="emergencyContactName" className="block text-sm font-medium text-blue-900 mb-1">
                        Contact Name
                      </label>
                      <input
                        id="emergencyContactName"
                        type="text"
                        value={formData.emergencyContactName}
                        onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                        className="w-full px-3 py-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="emergencyContactPhone" className="block text-sm font-medium text-blue-900 mb-1">
                        Contact Phone
                      </label>
                      <input
                        id="emergencyContactPhone"
                        type="tel"
                        value={formData.emergencyContactPhone}
                        onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                        className="w-full px-3 py-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Rider-specific fields */}
          {showRiderFields && (
            <div className="border-t pt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Rider Preferences</h2>
              <div className="space-y-4">
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.hasPet}
                      onChange={(e) => setFormData({ ...formData, hasPet: e.target.checked })}
                      className="h-4 w-4 text-primary-600 rounded"
                    />
                    <span className="ml-3 text-sm text-gray-700">I often travel with a pet</span>
                  </label>
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.needsChildSeat}
                      onChange={(e) => setFormData({ ...formData, needsChildSeat: e.target.checked })}
                      className="h-4 w-4 text-primary-600 rounded"
                    />
                    <span className="ml-3 text-sm text-gray-700">I need a child seat</span>
                  </label>
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.needsWheelchairAccess}
                      onChange={(e) => setFormData({ ...formData, needsWheelchairAccess: e.target.checked })}
                      className="h-4 w-4 text-primary-600 rounded"
                    />
                    <span className="ml-3 text-sm text-gray-700">I need wheelchair accessibility</span>
                  </label>
                </div>

                <div>
                  <label htmlFor="cargoNeeds" className="block text-sm font-medium text-gray-700 mb-2">
                    Typical Cargo Needs
                  </label>
                  <textarea
                    id="cargoNeeds"
                    value={formData.cargoNeeds}
                    onChange={(e) => setFormData({ ...formData, cargoNeeds: e.target.value })}
                    placeholder="e.g., Grocery shopping bags"
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Community Guidelines Agreement */}
          <div className="border-t pt-6">
            <div className="bg-yellow-50 p-4 rounded-md mb-4">
              <h3 className="text-sm font-semibold text-yellow-900 mb-2 flex items-center">
                <Info className="h-4 w-4 mr-2" />
                Community Guidelines
              </h3>
              <ul className="text-sm text-yellow-800 space-y-1 ml-6 list-disc">
                <li>This is a FREE volunteer service - no payment accepted</li>
                <li>Be respectful and courteous to all members</li>
                <li>Communicate clearly and be punctual</li>
                <li>Drivers must have valid license and insurance</li>
                <li>Safety first - trust your instincts</li>
              </ul>
            </div>

            <label className="flex items-start">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="h-4 w-4 text-primary-600 rounded mt-1"
                required
              />
              <span className="ml-3 text-sm text-gray-700">
                I agree to follow the community guidelines and understand that this is a free volunteer service *
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-primary-600 hover:text-primary-700 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
