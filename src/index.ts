import { AxiosInstance } from 'axios';
import { get } from './methods/get';
import { createInstance } from './core/axiosInstance';
import { ApiConfig } from './types';
import { createErrorHandler, ErrorHandler } from './core/errorHandling';

// TODO need post, put, delete, and graphql
// TODO need lots of unit tests

export const createApi = (config: ApiConfig) => {
    const instance: AxiosInstance = createInstance(config.baseURL, config.useCsrf ?? false);
    let errorHandler: ErrorHandler | undefined;
    if (config.defaultErrorHandler) {
        errorHandler = createErrorHandler(config.defaultErrorHandler);
    }
    return {
        instance,
        get: get(instance, errorHandler)
    };
};
