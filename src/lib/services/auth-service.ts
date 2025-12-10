/**
 * Authentication Service
 * 
 * Handles all authentication API calls to the backend.
 * API Docs: https://blueskyapi-production.up.railway.app/docs
 */

import type { 
  User, 
  UserCreate, 
  TokenResponse, 
  LoginCredentials,
  UserUpdate 
} from '@/types/auth';

// ============================================================================
// API CONFIGURATION
// ============================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Token storage keys
const ACCESS_TOKEN_KEY = 'atlas_access_token';
const REFRESH_TOKEN_KEY = 'atlas_refresh_token';

// ============================================================================
// TOKEN MANAGEMENT
// ============================================================================

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setTokens(accessToken: string, refreshToken: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function clearTokens(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

// ============================================================================
// API HELPERS
// ============================================================================

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
    throw new Error(error.detail || `Error: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

function getAuthHeaders(): HeadersInit {
  const token = getAccessToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ============================================================================
// AUTH API FUNCTIONS
// ============================================================================

/**
 * Register a new user
 * POST /auth/register
 */
export async function register(userData: UserCreate): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  
  return handleResponse<User>(response);
}

/**
 * Login with email and password
 * POST /auth/login
 * Note: Uses OAuth2 password grant format (application/x-www-form-urlencoded)
 */
export async function login(credentials: LoginCredentials): Promise<TokenResponse> {
  const formData = new URLSearchParams();
  formData.append('username', credentials.email); // API uses 'username' for email
  formData.append('password', credentials.password);
  formData.append('grant_type', 'password');

  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString(),
  });
  
  const tokenResponse = await handleResponse<TokenResponse>(response);
  
  // Store tokens
  setTokens(tokenResponse.access_token, tokenResponse.refresh_token);
  
  return tokenResponse;
}

/**
 * Refresh access token
 * POST /auth/refresh
 */
export async function refreshAccessToken(): Promise<TokenResponse> {
  const refreshToken = getRefreshToken();
  
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
  
  const tokenResponse = await handleResponse<TokenResponse>(response);
  
  // Update tokens
  setTokens(tokenResponse.access_token, tokenResponse.refresh_token);
  
  return tokenResponse;
}

/**
 * Get Google OAuth login URL
 * GET /auth/google
 */
export function getGoogleLoginUrl(): string {
  // The frontend redirect URL for Google OAuth callback
  const frontendUrl = typeof window !== 'undefined' ? window.location.origin : '';
  return `${API_BASE_URL}/auth/google?redirect_uri=${encodeURIComponent(frontendUrl + '/auth/callback')}`;
}

/**
 * Initiate Google OAuth login
 * Redirects user to Google login page
 */
export function initiateGoogleLogin(): void {
  if (typeof window !== 'undefined') {
    window.location.href = getGoogleLoginUrl();
  }
}

/**
 * Get current user info
 * GET /auth/me
 */
export async function getCurrentUser(): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  
  return handleResponse<User>(response);
}

/**
 * Update current user
 * PATCH /auth/me
 */
export async function updateCurrentUser(data: UserUpdate): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  
  return handleResponse<User>(response);
}

/**
 * Logout - clears tokens
 */
export function logout(): void {
  clearTokens();
}

/**
 * Check if user is authenticated (has valid access token)
 */
export function isAuthenticated(): boolean {
  return !!getAccessToken();
}

// ============================================================================
// EXPORT AUTH SERVICE
// ============================================================================

export const authService = {
  register,
  login,
  logout,
  refreshAccessToken,
  getCurrentUser,
  updateCurrentUser,
  initiateGoogleLogin,
  getGoogleLoginUrl,
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
  isAuthenticated,
};
