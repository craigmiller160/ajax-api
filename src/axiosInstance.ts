import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const CSRF_METHODS = ['post', 'put', 'delete'];
const CSRF_HEADER = 'x-csrf-token';

const createCsrfHandlingInterceptor = (instance: AxiosInstance) => async (config: AxiosRequestConfig): Promise<AxiosRequestConfig> => {
    if (CSRF_METHODS.includes(config.method ?? '')) {
        return instance.options(config.url ?? '', {
            headers: {
                [CSRF_HEADER]: 'fetch'
            }
        })
            .then((res: AxiosResponse) => {
                const token = res.headers[CSRF_HEADER];
                config.headers[CSRF_HEADER] = token;
                return config;
            })
            .catch(() => {
                throw new Error('Request failed preflight'); // TODO validate this
            });
    }
    return config;
};

export const createInstance = (baseURL: string): AxiosInstance => {
    const instance: AxiosInstance = axios.create({
        baseURL,
        withCredentials: true
    });

    instance.interceptors.request.use(createCsrfHandlingInterceptor(instance), (error) => Promise.reject(error));

    return instance;
}