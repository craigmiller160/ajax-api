import { AxiosError, AxiosRequestConfig } from 'axios';

export type SuppressErrorFn = (ex: Error) => Boolean;

export interface RequestConfig {
    uri: string;
    config?: AxiosRequestConfig;
    errorMsg?: string;
    suppressError?: SuppressErrorFn;
}

export type ErrorType<R> = Error | AxiosError<R>;
export type DefaultErrorHandler = <R>(status: number, error: ErrorType<R>, requestMessage?: string) => void;

export interface ApiConfig {
    baseURL: string;
    useCsrf?: boolean;
    defaultErrorHandler?: DefaultErrorHandler;
}
