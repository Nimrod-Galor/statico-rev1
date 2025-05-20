import axios from 'axios';
// Define the DynamicForm component
import type { DefaultValues } from 'react-hook-form';

const BASEURL = 'http://localhost:3000/api/v1';

// List content Types
export const getContentType = async () => {
    const response = await axios.get(`${BASEURL}/contentType`);
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
        const response = await axios.put(`${BASEURL}/${contentType}/${id}`, data)
        return response.data
    }catch(err: any){
        const message = err.response?.data?.message || err.message || "Unknown error";
        throw new Error(message);
    }
}

// Create Item
export const createItem = async <T>(contentType: string, data: DefaultValues<T>) => {
    try{
        const response = await axios.post(`${BASEURL}/${contentType}`, data)
        return response.data
    }catch(err: any){
        const message = err.response?.data?.message || err.message || "Unknown error";
        throw new Error(message);
    }
}

// Delete Item
export const deleteItem = async (contentType: string, id: string) => {
    try{
        const response = await axios.delete(`${BASEURL}/${contentType}/${id}`)
        return response.data
    }catch(err: any){
        const message = err.response?.data?.message || err.message || "Unknown error";
        throw new Error(message);
    }
}