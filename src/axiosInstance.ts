import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const CSRF_METHODS = [ 'post', 'put', 'delete' ];
const CSRF_HEADER = 'x-csrf-token';

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
                .catch(() => {
                    throw new Error('Request failed preflight'); // TODO validate this
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
