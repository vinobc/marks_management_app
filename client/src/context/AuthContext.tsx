import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  authService,
  AuthResponse,
  LoginCredentials,
  RegisterData,
  ProfileUpdateData,
} from "../services/authService";

interface AuthContextType {
  user: Omit<AuthResponse, "token"> | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (profileData: ProfileUpdateData) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<Omit<AuthResponse, "token"> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      try {
        const isTokenInitialized = authService.initialize();

        if (isTokenInitialized) {
          // If we have a token, fetch the user profile
          const profile = await authService.getProfile();
          setUser(profile);
        }
      } catch (err) {
        console.error("Failed to initialize auth:", err);
        // If there's an error during initialization, clear the token
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    setError(null);
    try {
      const userData = await authService.login(credentials);
      setUser({
        _id: userData._id,
        name: userData.name,
        email: userData.email,
        department: userData.department,
        isAdmin: userData.isAdmin,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to login");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.register(userData);
      setUser({
        _id: response._id,
        name: response.name,
        email: response.email,
        department: response.department,
        isAdmin: response.isAdmin,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to register");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateProfile = async (profileData: ProfileUpdateData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedProfile = await authService.updateProfile(profileData);
      setUser(updatedProfile);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update profile");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
