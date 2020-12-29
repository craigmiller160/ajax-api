import { get } from './get';
import { createInstance } from './axiosInstance';
import { ApiConfig } from './types';
import { AxiosInstance } from 'axios';

export const createApi = (config: ApiConfig) => {
    const instance: AxiosInstance = createInstance(config.baseURL);
    return {
        get: get(instance, () => {})
    };
};