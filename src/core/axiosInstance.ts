import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import CsrfError from './CsrfError';
import { CSRF_HEADER, CSRF_METHODS } from './csrfConstants';

const createCsrfHandlingInterceptor = (instance: AxiosInstance) =>
    async (config: AxiosRequestConfig): Promise<AxiosRequestConfig> => {
        if (CSRF_METHODS.includes(config.method ?? '')) {
            return instance.options(config.url ?? '', {
                headers: {
                    [CSRF_HEADER]: 'fetch'
                }
            })
                .then((res: AxiosResponse) => {
                    config.headers[CSRF_HEADER] = res.headers[CSRF_HEADER]; // eslint-disable-line no-param-reassign
                    return config;
                })
                .catch((ex) => {
                    throw new CsrfError('Request failed preflight', ex); // TODO validate this
                });
        }
        return config;
    };

export const createInstance = (baseURL: string, useCsrf: boolean): AxiosInstance => {
    const instance: AxiosInstance = axios.create({
        baseURL,
        withCredentials: true
    });

    if (useCsrf) {
        instance.interceptors.request.use(createCsrfHandlingInterceptor(instance), (error) => Promise.reject(error));
    }

    return instance;
};
