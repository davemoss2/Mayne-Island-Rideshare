'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile } from '@/types';

interface AuthContextType {
  user: UserProfile | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (profile: Omit<UserProfile, 'uid' | 'createdAt'> & { password: string }) => Promise<boolean>;
  logout: () => void;
  updateProfile: (profile: UserProfile) => void;
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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage on mount
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        parsed.createdAt = new Date(parsed.createdAt);
        setUser(parsed);
      } catch (e) {
        console.error('Failed to parse stored user:', e);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Demo mode: check localStorage for registered users.
    // WARNING: In production, replace this with a secure server-side auth
    // solution (e.g. Firebase Auth). Never store credentials in localStorage.
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find(
      (u: any) => u.email === email && u.password === password
    );

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      userWithoutPassword.createdAt = new Date(userWithoutPassword.createdAt);
      setUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const register = async (
    profileData: Omit<UserProfile, 'uid' | 'createdAt'> & { password: string }
  ): Promise<boolean> => {
    // Demo mode: store in localStorage.
    // WARNING: In production, replace with a secure server-side auth solution.
    // Passwords must never be stored in plain text in production.
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if email already exists
    if (users.some((u: any) => u.email === profileData.email)) {
      return false;
    }

    const newUser = {
      ...profileData,
      uid: `user_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Auto-login
    const { password: _, ...userWithoutPassword } = newUser;
    const userProfile: UserProfile = {
      ...userWithoutPassword,
      createdAt: new Date(userWithoutPassword.createdAt),
    };
    setUser(userProfile);
    localStorage.setItem('currentUser', JSON.stringify(userProfile));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateProfile = (profile: UserProfile) => {
    setUser(profile);
    localStorage.setItem('currentUser', JSON.stringify(profile));

    // Update in users array
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map((u: any) =>
      u.uid === profile.uid ? { ...u, ...profile } : u
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
