import axios from 'axios';

export const createInstance = (baseURL: string) =>
    axios.create({
        baseURL,
        withCredentials: true
    });