import {
  createContext,
  useContext,
  useLayoutEffect,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';


import { axiosPrivate, login, logout, refreshToken } from '../api/index.ts';
// import type { User, LoginType } from '../types/index.ts';

import type { UserInput } from '../../../shared/schemas/user.schema.ts';
import type { LoginInput } from '../../../shared/schemas/login.schema.ts';

import type {PropsWithChildren} from 'react'
import type { InternalAxiosRequestConfig } from 'axios';

type AuthContext = {
  authToken?: string | null;
  user?: UserInput | null;
  userId?: string | null;
  loading: boolean;
  handleLogin: (data: LoginInput) => Promise<void>;
  handleLogout: () => Promise<void>;
};

const AuthContext = createContext<AuthContext | undefined>(undefined)

type AuthProviderProps = PropsWithChildren

export default function AuthProvider({ children }: AuthProviderProps) {

    const [user, setUser] = useState(null)
    const [userId, setUserId] = useState<string | null>(null)
    const [authToken, setAuthToken] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate()

    useLayoutEffect(() => {
      console.log("useLayoutEffect")
      // refresh acces token on page reload
      const tryRefresh = async () => {
        try {
          const res = await refreshToken() // uses HttpOnly cookie
          setUser(res.userName)
          setUserId(res.userId)
          setAuthToken(res.accessToken); // stored only in memory
          // navigate('/admin/')
        } catch (err) {
          console.log("refresh token error", err)
          setUser(null)
          setUserId(null)
          setAuthToken(null)
        }finally {
          setLoading(false)
        }
      }
      tryRefresh()
    }, [])


    useLayoutEffect(() => {
      console.log("layerEffect")
      const requestIntercept = axiosPrivate.interceptors.request.use((config: InternalAxiosRequestConfig) => {
        // Ensure _retry property exists for later use in response interceptor
        (config as any)._retry = (config as any)._retry ?? false
        config.headers['Authorization'] =  !(config as any)._retry && authToken ? `Bearer ${authToken}` : config.headers['Authorization']
        return config
      })

      const responseIntercept = axiosPrivate.interceptors.response.use(
          response => response,
          async (error) => {
              const prevRequest = error?.config;
              if (error?.response?.status === 403 && !prevRequest?.sent) {
                  prevRequest.sent = true;
                  const newAccessToken = await refreshToken();
                  prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                  return axiosPrivate(prevRequest);
              }
              return Promise.reject(error);
          }
      );

      return () => {
        console.log("unmount")
          axiosPrivate.interceptors.request.eject(requestIntercept);
          axiosPrivate.interceptors.response.eject(responseIntercept);
      }
    }, [authToken])

    const handleLogin = async (data:LoginInput) => {
        try {
          const response = await login(data)
          
          setUser(response.userName)
          setUserId(response.userId)
          setAuthToken(response.accessToken)

          navigate("/admin/")
          return Promise.resolve()
        }catch (err) {
          // Instead of throwing, return a rejected promise with the error message
          return Promise.reject((err as { message?: string }).message || 'Login failed')
        }
    }

    const handleLogout = async () => {
      console.log("handleLogout")
        try{
            const response = await logout()
            if(response != 204){
                throw new Error('logout error')
            }
            setUser(null);
            setAuthToken('');
            navigate("/login");
        }catch (err) {
            console.error(err);
        }
    }


  return (
    <AuthContext.Provider
      value={{
        authToken,
        user,
        userId,
        loading,
        handleLogin,
        handleLogout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used inside of a AuthProvider');
  }

  return context;
}