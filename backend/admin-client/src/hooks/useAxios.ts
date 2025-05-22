import { useEffect } from "react";
import axios from 'axios';
import { useAuth } from '../context/AuthProvider';
import { refreshToken } from '../api/index.ts'

const BASEURL = 'http://localhost:3000/api/v1';

axios.create({
    baseURL: BASEURL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
})


function useAxios() {
    const { authToken } = useAuth()

    useEffect(() => {

        const requestIntercept = axios.interceptors.request.use(
            config => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${authToken}`;
                }
                return config;
            }, (error) => Promise.reject(error)
        );

        const responseIntercept = axios.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config;
                if (error?.response?.status === 403 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    const newAccessToken = await refreshToken();
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return axios(prevRequest);
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.request.eject(requestIntercept);
            axios.interceptors.response.eject(responseIntercept);
        }
    }, [authToken])



    return axios
}

export default useAxios