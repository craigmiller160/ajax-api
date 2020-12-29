import { AxiosError, AxiosRequestConfig } from 'axios';

export type SuppressErrorFn = (ex: Error) => Boolean;

export interface RequestConfig {
    uri: string;
    config?: AxiosRequestConfig;
    errorMsg?: string;
    suppressError?: SuppressErrorFn;
}

export interface ErrorHandlingConfig {
    defaultErrorHandler: (error: Error) => void;
    unauthorizedErrorHandler?: <R>(error: AxiosError<R>) => void;
}

export interface ApiConfig {
    baseURL: string;
    useCsrf?: boolean;
    errorHandling?: ErrorHandlingConfig;
}
