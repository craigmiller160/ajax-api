import { AxiosInstance } from 'axios';
import { get } from './methods/get';
import { createInstance } from './core/axiosInstance';
import { ApiConfig } from './types';
import { createErrorHandler, ErrorHandler } from './core/errorHandling';
import { post } from './methods/post';
import { put } from './methods/put';
import { doDelete } from './methods/delete';

// TODO need graphql
// TODO need lots of unit tests

export const createApi = (config: ApiConfig) => {
    const instance: AxiosInstance = createInstance(config.baseURL, config.useCsrf ?? false);
    let errorHandler: ErrorHandler | undefined;
    if (config.defaultErrorHandler) {
        errorHandler = createErrorHandler(config.defaultErrorHandler);
    }
    return {
        instance,
        get: get(instance, errorHandler),
        post: post(instance, errorHandler),
        put: put(instance, errorHandler),
        delete: doDelete(instance, errorHandler)
    };
};
