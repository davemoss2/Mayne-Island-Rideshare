export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone: string;
  role: 'rider' | 'driver' | 'both';
  // Driver-specific
  vehicleDescription?: string;
  petsAllowed?: 'yes' | 'no' | 'case-by-case';
  childSeatsAvailable?: number;
  wheelchairAccessible?: boolean;
  cargoCapacity?: string;
  emergencyContact?: { name: string; phone: string };
  // Rider preferences
  hasPet?: boolean;
  needsChildSeat?: boolean;
  needsWheelchairAccess?: boolean;
  cargoNeeds?: string;
  createdAt: Date;
}

export interface RideRequest {
  id: string;
  riderId: string;
  riderName: string;
  riderPhone: string;
  destination: string;
  pickupLocation: string;
  notes: string;
  hasPet: boolean;
  needsChildSeat: boolean;
  needsWheelchairAccess: boolean;
  cargoDescription: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  confirmedDriverId?: string;
  confirmedDriverName?: string;
  confirmedDriverPhone?: string;
  confirmedDriverVehicle?: string;
  createdAt: Date;
}

export interface DriverTrip {
  id: string;
  driverId: string;
  driverName: string;
  driverPhone: string;
  destination: string;
  departureTime: string;
  departureLocation: string;
  availableSeats: number;
  petsAllowed: boolean;
  childSeatsAvailable: number;
  wheelchairAccessible: boolean;
  notes: string;
  status: 'active' | 'full' | 'completed';
  createdAt: Date;
}
