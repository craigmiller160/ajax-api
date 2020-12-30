import { AxiosError, AxiosRequestConfig } from 'axios';

export type SuppressErrorFn = (ex: Error) => Boolean;

export interface RequestConfig {
    uri: string;
    config?: AxiosRequestConfig;
    errorMsg?: string;
    suppressError?: SuppressErrorFn;
}

// TODO need 3 options, default, 401, and axios error
// TODO maybe a single method that takes the error and a parameter that defines the type?
// TODO or a wrapper object that defines the type and has the error... parent class and sub-classes? polymorphism?
export interface ErrorHandlingConfig {
    defaultErrorHandler: (error: Error) => void;
    unauthorizedErrorHandler?: <R>(error: AxiosError<R>) => void;
}

export interface ApiConfig {
    baseURL: string;
    useCsrf?: boolean;
    errorHandling?: ErrorHandlingConfig;
}
