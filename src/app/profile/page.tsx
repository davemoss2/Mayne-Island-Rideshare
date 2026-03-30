'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { User, Car, Save, AlertCircle } from 'lucide-react';
import { UserProfile } from '@/types';

export default function ProfilePage() {
  const { user, updateProfile, isLoading } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'rider' as 'rider' | 'driver' | 'both',
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

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace('/auth/login');
      return;
    }

    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      vehicleDescription: user.vehicleDescription || '',
      petsAllowed: user.petsAllowed || 'case-by-case',
      childSeatsAvailable: user.childSeatsAvailable || 0,
      wheelchairAccessible: user.wheelchairAccessible || false,
      cargoCapacity: user.cargoCapacity || '',
      emergencyContactName: user.emergencyContact?.name || '',
      emergencyContactPhone: user.emergencyContact?.phone || '',
      hasPet: user.hasPet || false,
      needsChildSeat: user.needsChildSeat || false,
      needsWheelchairAccess: user.needsWheelchairAccess || false,
      cargoNeeds: user.cargoNeeds || '',
    });
  }, [user, isLoading, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const updatedProfile: UserProfile = {
      ...user,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      vehicleDescription: (formData.role === 'driver' || formData.role === 'both') ? formData.vehicleDescription : user.vehicleDescription,
      petsAllowed: (formData.role === 'driver' || formData.role === 'both') ? formData.petsAllowed : user.petsAllowed,
      childSeatsAvailable: (formData.role === 'driver' || formData.role === 'both') ? formData.childSeatsAvailable : user.childSeatsAvailable,
      wheelchairAccessible: (formData.role === 'driver' || formData.role === 'both') ? formData.wheelchairAccessible : user.wheelchairAccessible,
      cargoCapacity: (formData.role === 'driver' || formData.role === 'both') ? formData.cargoCapacity : user.cargoCapacity,
      emergencyContact: (formData.role === 'driver' || formData.role === 'both') && formData.emergencyContactName && formData.emergencyContactPhone
        ? { name: formData.emergencyContactName, phone: formData.emergencyContactPhone }
        : user.emergencyContact,
      hasPet: (formData.role === 'rider' || formData.role === 'both') ? formData.hasPet : user.hasPet,
      needsChildSeat: (formData.role === 'rider' || formData.role === 'both') ? formData.needsChildSeat : user.needsChildSeat,
      needsWheelchairAccess: (formData.role === 'rider' || formData.role === 'both') ? formData.needsWheelchairAccess : user.needsWheelchairAccess,
      cargoNeeds: (formData.role === 'rider' || formData.role === 'both') ? formData.cargoNeeds : user.cargoNeeds,
    };

    updateProfile(updatedProfile);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (isLoading || !user) return null;

  const showDriverFields = formData.role === 'driver' || formData.role === 'both';
  const showRiderFields = formData.role === 'rider' || formData.role === 'both';

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center mb-8">
          <div className="bg-primary-100 p-3 rounded-full mr-4">
            <User className="h-8 w-8 text-primary-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600">Manage your account settings</p>
          </div>
        </div>

        {saved && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md flex items-center">
            <Save className="h-5 w-5 text-green-600 mr-2" />
            <p className="text-sm text-green-800 font-semibold">Profile updated successfully!</p>
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Role */}
          <div className="border-t pt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              My Role *
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
                <span className="ml-3 text-gray-900">Rider only</span>
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
                <span className="ml-3 text-gray-900">Driver only</span>
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
                <span className="ml-3 text-gray-900">Both (driver and rider)</span>
              </label>
            </div>
          </div>

          {/* Driver-specific fields */}
          {showDriverFields && (
            <div className="border-t pt-6">
              <div className="flex items-center mb-4">
                <Car className="h-6 w-6 text-primary-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Driver Information</h2>
              </div>
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="bg-blue-50 p-4 rounded-md">
                  <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Emergency Contact (Recommended)
                  </h3>
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full px-4 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 font-semibold flex items-center justify-center"
          >
            <Save className="h-5 w-5 mr-2" />
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
