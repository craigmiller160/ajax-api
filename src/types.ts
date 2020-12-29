import { AxiosRequestConfig } from 'axios';

export type SuppressErrorFn = (ex: Error) => Boolean

export interface RequestConfig {
    uri: string;
    config?: AxiosRequestConfig;
    errorMsg?: string;
    suppressError?: SuppressErrorFn
}

export interface ApiConfig {
    baseURL: string;
}