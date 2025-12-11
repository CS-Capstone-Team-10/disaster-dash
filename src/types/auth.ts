/**
 * Authentication Types
 * Matches the backend API at https://blueskyapi-production.up.railway.app/docs
 */

// User creation request (registration)
export interface UserCreate {
  email: string;
  password: string;
  full_name: string;
}

// User response from API
export interface User {
  id: number;
  email: string;
  full_name: string;
  role: 'user' | 'admin';
  is_active: boolean;
  is_verified: boolean;
  auth_provider: 'local' | 'google';
  created_at: string;
  last_login: string | null;
}

// Token response from login
export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: 'bearer';
  expires_in: number;
}

// Login credentials
export interface LoginCredentials {
  email: string;
  password: string;
}

// User update request
export interface UserUpdate {
  full_name?: string;
  email?: string;
}

// Auth state for context
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Auth context type
export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: UserCreate) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  googleLogin: () => void;
  updateUser: (data: UserUpdate) => Promise<void>;
  clearError: () => void;
}
