import axios from 'axios';
// Define the DynamicForm component
import type { DefaultValues } from 'react-hook-form';
// import type {LoginType} from '../types/index.ts'
import type {LoginInput } from '../../../shared/schemas/login.schema.ts';




const BASEURL = 'http://localhost:3000/api/v1';


export const axiosPrivate = axios.create({
    baseURL: BASEURL,
    headers: { 'Content-Type': 'application/json', "Access-Control-Allow-Origin": "localhost:5173" },
    withCredentials: true
})


// List content Types
export const getContentType = async () => {
    const response = await axiosPrivate.get('/contentType');
    return response.data;
}

// List Items
export const getItems = async (contentType: string, page: string) => {
    const response = await axios.get(`${BASEURL}/${contentType}?page=${page}`);
    return response.data;
}

// get total number of pages for content type
export const getTotalPages = async (contentType: string) => {
    const response = await axios.get(`${BASEURL}/${contentType}/totalPages`)
    return response.data
}

// Get Item
export const getItem = async (contentType: string, id: string | undefined) => {
    const response = await axios.get(`${BASEURL}/${contentType}/${id}`)
    return response.data;
}

// Update Item
export const updateItem = async <T>(contentType: string, id: string, data: DefaultValues<T>) => {
    try{
        const response = await axiosPrivate.put(`${BASEURL}/${contentType}/${id}`, data)
        return response.data
    }catch(err: any){
        const message = err.response?.data?.message || err.message || "Unknown error";
        throw new Error(message);
    }
}

// Create Item
export const createItem = async <T>(contentType: string, data: DefaultValues<T>) => {
    try{
        const response = await axiosPrivate.post(`${BASEURL}/${contentType}`, data)
        return response.data
    }catch(err: any){
        const message = err.response?.data?.message || err.message || "Unknown error";
        throw new Error(message);
    }
}

// Delete Item
export const deleteItem = async (contentType: string, id: string) => {
    try{
        const response = await axiosPrivate.delete(`${BASEURL}/${contentType}/${id}`)
        return response.data
    }catch(err: any){
        const message = err.response?.data?.message || err.message || "Unknown error";
        throw new Error(message);
    }
}

// Login
export const login = async (data: LoginInput) => {
    try{
        console.log("data: ", data)
        const response = await axiosPrivate.post(`${BASEURL}/auth/login`, data, {
                headers: {"Content-Type": "application/json"}
            })
        return response.data
    }catch (err: any){
        console.log("err: ", err)
        const message = err.response?.data?.message || err.message || "Unknown error";
        throw new Error(message);
    }
}

// Logout
export const logout = async () => {
    try{
        const response = await axios.get(`${BASEURL}/auth/logout`)
        return response.status
    }catch (err: any){
        const message = err.response?.data?.message || err.message || "Unknown error";
        throw new Error(message);
    }
}

// Refresh Token
export const refreshToken = async () => {
    try{
        const response = await axiosPrivate.get(`${BASEURL}/auth/refresh-token`, { withCredentials: true})
        return response.data
    }catch (err: any){
        const message = err.response?.data?.message || err.message || "Unknown error";
        throw new Error(message);
    }
}