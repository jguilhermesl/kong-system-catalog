/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface User {
  id: string;
  email: string;
  name?: string;
  role: 'admin' | 'client' | 'seller';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user data from /me endpoint
  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    
    if (token) {
      try {
        // Fetch user data from /me endpoint
        const response = await axios.get(`${API_URL}/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        const userData: User = {
          id: response.data.data.id,
          email: response.data.data.email,
          name: response.data.data.name,
          role: response.data.data.role,
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      } catch (error) {
        console.error('Error loading user:', error);
        // Token is invalid, clear storage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Load user from localStorage and fetch from /me on initial render
  useEffect(() => {
    const initializeAuth = async () => {
      await loadUser();
      setIsLoading(false);
    };
    
    initializeAuth();
  }, [loadUser]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth`, {
        email,
        password,
        role: 'client',
      });

      const { token, refreshToken } = response.data.data;

      // Save tokens to localStorage
      localStorage.setItem('accessToken', token);
      localStorage.setItem('refreshToken', refreshToken);

      // Load user data from /me endpoint
      await loadUser();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Erro ao fazer login';
      throw new Error(errorMessage);
    }
  }, [loadUser]);

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
