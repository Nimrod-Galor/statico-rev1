import axios from 'axios';

const BASERUL = 'http://localhost:3000/api/v1';

export const getCategories = async () => {
    const response = await axios.get(`${BASERUL}/categories`);
    return response.data;
}

export const getItems = async (category: string) => {
    const response = await axios.get(`${BASERUL}/${category}`);
    return response.data;
}