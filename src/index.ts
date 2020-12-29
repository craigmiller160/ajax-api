import { get } from './get';
import { createInstance } from './axiosInstance';
import { ApiConfig } from './types';
import { AxiosInstance } from 'axios';

// TODO need post, put, delete, and graphql
// TODO need CSRF interceptor
// TODO need lots of unit tests

export const createApi = (config: ApiConfig) => {
    const instance: AxiosInstance = createInstance(config.baseURL);
    return {
        get: get(instance, config.defaultErrorHandler)
    };
};