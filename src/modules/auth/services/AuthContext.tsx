import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { apiService } from "../../../services/api";
import { User } from "../../../shared/utils/types";

interface AuthContextType {
  user: User | null;
  verifyIdentity: () => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const FullScreenLoader = () => (
  <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-6"></div>
    <p className="text-lg text-blue-700 font-medium">Loading, please wait...</p>
  </div>
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const calledRef = useRef(false);

  const checkAuth = useCallback(async () => {
    try {
      const response = await apiService.checkAuthStatus();
      if (response.success && response.data?.isAuthenticated) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!calledRef.current) {
      checkAuth();
      calledRef.current = true;
    }
  }, [checkAuth]);

  const verifyIdentity = async (): Promise<boolean> => {
    try {
      const response = await apiService.verifyIdentity();
      if (response.success && response.data?.redirectUrl) {
        window.location.href = `${import.meta.env.VITE_REACT_APP_API_URL}${
          response.data.redirectUrl
        }`;
        return true;
      }
      return false;
    } catch (error) {
      console.error("Identity verification failed:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      const response = await apiService.logout();
      console.log("response", response);

      if (response.success && response.data?.redirectUrl) {
        setUser(null);
        window.location.href = response.data.redirectUrl;
      }
      /*  else {
        setUser(null);
        window.location.href = "/login"; // fallback
      } */
    } catch (error) {
      console.error("Logout failed", error);
      setUser(null);
      window.location.href = "/login";
    }
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        verifyIdentity,
        logout,
        isAuthenticated: !!user,
        loading,
        checkAuth,
      }}
    >
      {loading ? <FullScreenLoader /> : children}
    </AuthContext.Provider>
  );
};
