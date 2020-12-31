import { AxiosInstance } from 'axios';
import { get } from './get';
import { createInstance } from './axiosInstance';
import { ApiConfig } from './types';
import { createErrorHandler, ErrorHandler } from './errorHandling';

// TODO need post, put, delete, and graphql
// TODO need lots of unit tests
// TODO integrate multiple error handlers (401, standard)

export const createApi = (config: ApiConfig) => {
    const instance: AxiosInstance = createInstance(config.baseURL, config.useCsrf ?? false);
    let errorHandler: ErrorHandler | undefined = undefined;
    if (config.defaultErrorHandler) {
        errorHandler = createErrorHandler(config.defaultErrorHandler);
    }
    return {
        get: get(instance, errorHandler)
    };
};
