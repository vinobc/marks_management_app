import api from "./api";

// Define types
export interface AuthResponse {
  _id: string;
  name: string;
  email: string;
  department: string;
  isAdmin: boolean;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  department: string;
}

export interface ProfileUpdateData {
  name?: string;
  email?: string;
  department?: string;
  currentPassword?: string;
  newPassword?: string;
}

// Token storage functions
const setToken = (token: string) => {
  localStorage.setItem("userToken", token);
  // Update axios header for future requests
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

const removeToken = () => {
  localStorage.removeItem("userToken");
  delete api.defaults.headers.common["Authorization"];
};

// Auth service
export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await api.post("/api/auth/login", credentials);
      const data = response.data;

      // Store token and update axios
      setToken(data.token);

      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  register: async (userData: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await api.post("/api/auth/register", userData);
      const data = response.data;

      // Store token and update axios
      setToken(data.token);

      return data;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  },

  logout: () => {
    removeToken();
  },

  getProfile: async (): Promise<Omit<AuthResponse, "token">> => {
    try {
      const response = await api.get("/api/auth/profile");
      return response.data;
    } catch (error) {
      console.error("Get profile error:", error);
      throw error;
    }
  },

  updateProfile: async (
    profileData: ProfileUpdateData
  ): Promise<Omit<AuthResponse, "token">> => {
    try {
      const response = await api.put("/api/faculty/profile", profileData);
      return response.data;
    } catch (error) {
      console.error("Update profile error:", error);
      throw error;
    }
  },

  // Initialize the auth state from localStorage
  initialize: () => {
    const token = localStorage.getItem("userToken");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      return true;
    }
    return false;
  },
};
