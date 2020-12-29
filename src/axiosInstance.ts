import axios, { AxiosInstance } from 'axios';

export const createInstance = (baseURL: string): AxiosInstance =>
    axios.create({
        baseURL,
        withCredentials: true
    });