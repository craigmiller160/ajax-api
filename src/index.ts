import { AxiosInstance } from 'axios';
import { get } from './get';
import { createInstance } from './axiosInstance';
import { ApiConfig } from './types';

// TODO need post, put, delete, and graphql
// TODO need CSRF interceptor
// TODO need lots of unit tests

export const createApi = (config: ApiConfig) => {
    const instance: AxiosInstance = createInstance(config.baseURL, config.useCsrf ?? false);
    return {
        get: get(instance, config.defaultErrorHandler)
    };
};
