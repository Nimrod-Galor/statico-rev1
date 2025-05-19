import axios from 'axios';

const BASEURL = 'http://localhost:3000/api/v1';

export const getContentType = async () => {
    const response = await axios.get(`${BASEURL}/contentType`);
    return response.data;
}

export const getItems = async (category: string, page: string) => {
    const response = await axios.get(`${BASEURL}/${category}?page=${page}`);
    return response.data;
}

export const getTotalPages = async (category: string) => {
    const response = await axios.get(`${BASEURL}/${category}/totalPages`)
    return response.data
}