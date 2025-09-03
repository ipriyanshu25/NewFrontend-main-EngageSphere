// src/contexts/AuthContext.tsx

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import axios from '../api/axios';
import { signInWithGooglePopup } from '../lib/firebase';

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */
export interface User {
  id        : string;
  name      : string;
  email     : string;
  phone     : string;
  countryId : string;   // <-- country _id (backend expects this for local users)
  callingId : string;   // <-- dial-code _id
  gender    : string;   // "0" | "1" | "2" | ""
  createdAt : string;
}

interface RegisterData {
  name      : string;
  email     : string;
  phone     : string;
  countryId : string;
  callingId : string;
  gender    : string;
  password  : string;
}

/* OTP helpers ------------------------------------------------------ */
type RequestOtp = (email: string) => Promise<boolean>;
type VerifyOtp  = (email: string, otp: string) => Promise<boolean>;

interface AuthContextType {
  user           : User | null;
  token          : string | null;
  isAuthenticated: boolean;
  loading        : boolean;
  login          : (email: string, password: string) => Promise<boolean>;
  register       : (data: RegisterData) => Promise<boolean>;
  logout         : () => void;
  requestOtp     : RequestOtp;
  verifyOtp      : VerifyOtp;
  setUser        : React.Dispatch<React.SetStateAction<User | null>>;
  googleLogin    : () => Promise<boolean>; // NEW
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};

const buildFallbackUser = (id: string, email: string): User => ({
  id,
  name      : email.split('@')[0] ?? 'User',
  email,
  phone     : '',
  countryId : '',
  callingId : '',
  gender    : '',
  createdAt : new Date().toISOString(),
});

/* ------------------------------------------------------------------ */
/* Provider                                                            */
/* ------------------------------------------------------------------ */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user,  setUser ] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoad] = useState(true);

  /* Hydrate session ------------------------------------------------ */
  useEffect(() => {
    const t  = localStorage.getItem('token');
    const id = localStorage.getItem('userId');
    const em = localStorage.getItem('email');
    if (t) {
      setToken(t);
      if (id && em) setUser(buildFallbackUser(id, em));
    }
    setLoad(false);
  }, []);

  /* OTP ------------------------------------------------------------ */
  const requestOtp: RequestOtp = async (email) => {
    try {
      await axios.post('/user/request-otp', { email });
      return true;
    } catch {
      return false;
    }
  };

  const verifyOtp: VerifyOtp = async (email, otp) => {
    try {
      await axios.post('/user/verify-otp', { email, otp });
      return true;
    } catch {
      return false;
    }
  };

  /* Register (auto-login) ----------------------------------------- */
  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      await axios.post('/user/register', data);
      return await login(data.email, data.password);
    } catch {
      return false;
    }
  };

  /* Email/Password Login ------------------------------------------ */
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data } = await axios.post<{
        token : string;
        userId: string;
        user ?: Partial<User>;
      }>('/user/login', { email, password });

      localStorage.setItem('token',  data.token);
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('email',  email);

      setToken(data.token);
      setUser(
        data.user?.name
          ? {
              id        : data.userId,
              name      : data.user.name!,
              email     : data.user.email     ?? email,
              phone     : data.user.phone     ?? '',
              countryId : data.user.countryId ?? '',
              callingId : data.user.callingId ?? '',
              gender    : data.user.gender    ?? '',
              createdAt : data.user.createdAt ?? new Date().toISOString(),
            }
          : buildFallbackUser(data.userId, email),
      );
      return true;
    } catch {
      return false;
    }
  };

  /* Google Login --------------------------------------------------- */
  const googleLogin = async (): Promise<boolean> => {
    try {
      // 1) Get Firebase ID token from client
      const idToken = await signInWithGooglePopup();

      // 2) Exchange for your app JWT and user object
      const { data } = await axios.post<{
        token : string;
        userId: string;
        user  : Partial<User> & {
          picture?: string;
          emailVerified?: boolean;
          authProvider?: string;
        };
      }>('/user/google', { idToken });

      // 3) Persist session
      localStorage.setItem('token',  data.token);
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('email',  data.user?.email ?? '');

      setToken(data.token);
      setUser({
        id        : data.userId,
        name      : data.user.name ?? (data.user.email?.split('@')[0] ?? 'User'),
        email     : data.user.email ?? '',
        phone     : data.user.phone ?? '',
        countryId : data.user.countryId ?? '',
        callingId : data.user.callingId ?? '',
        gender    : data.user.gender ?? '',
        createdAt : data.user.createdAt ?? new Date().toISOString(),
      });

      return true;
    } catch {
      return false;
    }
  };

  /* Logout --------------------------------------------------------- */
  const logout = () => {
    localStorage.clear();
    setUser(null);
    setToken(null);
  };

  /* Context value -------------------------------------------------- */
  const ctxValue: AuthContextType = {
    user,
    token,
    isAuthenticated: Boolean(token),
    loading,
    login,
    register,
    logout,
    requestOtp,
    verifyOtp,
    setUser,
    googleLogin, // NEW
  };

  return <AuthContext.Provider value={ctxValue}>{children}</AuthContext.Provider>;
};
