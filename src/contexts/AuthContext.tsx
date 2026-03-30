'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile } from '@/types';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: UserProfile | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (profile: Omit<UserProfile, 'uid' | 'createdAt'> & { password: string }) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (profile: UserProfile) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Map a Supabase profiles row (snake_case) to our UserProfile type (camelCase).
function rowToProfile(row: Record<string, unknown>): UserProfile {
  return {
    uid: row.id as string,
    name: row.name as string,
    email: row.email as string,
    phone: row.phone as string,
    role: row.role as UserProfile['role'],
    vehicleDescription: (row.vehicle_description as string) ?? undefined,
    petsAllowed: (row.pets_allowed as UserProfile['petsAllowed']) ?? undefined,
    childSeatsAvailable: (row.child_seats_available as number) ?? undefined,
    wheelchairAccessible: (row.wheelchair_accessible as boolean) ?? undefined,
    cargoCapacity: (row.cargo_capacity as string) ?? undefined,
    emergencyContact: (row.emergency_contact as UserProfile['emergencyContact']) ?? undefined,
    hasPet: (row.has_pet as boolean) ?? undefined,
    needsChildSeat: (row.needs_child_seat as boolean) ?? undefined,
    needsWheelchairAccess: (row.needs_wheelchair_access as boolean) ?? undefined,
    cargoNeeds: (row.cargo_needs as string) ?? undefined,
    createdAt: new Date(row.created_at as string),
  };
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChange fires immediately with INITIAL_SESSION (existing session or null),
    // then again for every subsequent sign-in / sign-out event.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          setUser(data ? rowToProfile(data) : null);
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return !error;
  };

  const register = async (
    profileData: Omit<UserProfile, 'uid' | 'createdAt'> & { password: string }
  ): Promise<boolean> => {
    const { password, ...profile } = profileData;

    const { data, error } = await supabase.auth.signUp({ email: profile.email, password });
    if (error || !data.user) return false;

    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      role: profile.role,
      vehicle_description: profile.vehicleDescription ?? null,
      pets_allowed: profile.petsAllowed ?? null,
      child_seats_available: profile.childSeatsAvailable ?? null,
      wheelchair_accessible: profile.wheelchairAccessible ?? null,
      cargo_capacity: profile.cargoCapacity ?? null,
      emergency_contact: profile.emergencyContact ?? null,
      has_pet: profile.hasPet ?? null,
      needs_child_seat: profile.needsChildSeat ?? null,
      needs_wheelchair_access: profile.needsWheelchairAccess ?? null,
      cargo_needs: profile.cargoNeeds ?? null,
    });

    return !profileError;
  };

  const logout = async (): Promise<void> => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const updateProfile = async (profile: UserProfile): Promise<void> => {
    const { error } = await supabase.from('profiles').upsert({
      id: profile.uid,
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      role: profile.role,
      vehicle_description: profile.vehicleDescription ?? null,
      pets_allowed: profile.petsAllowed ?? null,
      child_seats_available: profile.childSeatsAvailable ?? null,
      wheelchair_accessible: profile.wheelchairAccessible ?? null,
      cargo_capacity: profile.cargoCapacity ?? null,
      emergency_contact: profile.emergencyContact ?? null,
      has_pet: profile.hasPet ?? null,
      needs_child_seat: profile.needsChildSeat ?? null,
      needs_wheelchair_access: profile.needsWheelchairAccess ?? null,
      cargo_needs: profile.cargoNeeds ?? null,
    });
    if (!error) setUser(profile);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
