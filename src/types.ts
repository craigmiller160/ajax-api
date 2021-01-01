import { AxiosError, AxiosRequestConfig } from 'axios';

export type SuppressErrorFn = (ex: Error) => Boolean;

export interface BaseRequestConfig {
    config?: AxiosRequestConfig;
    errorMsg?: string;
    suppressError?: SuppressErrorFn;
}

export interface UriRequestConfig extends BaseRequestConfig {
    uri: string;
}

export interface UriBodyRequestConfig<B> extends UriRequestConfig {
    body?: B;
}

export interface GraphQLRequestConfig extends BaseRequestConfig {
    payload: string;
    overrideUri?: string;
}

export type ErrorType<R> = Error | AxiosError<R>;
export type DefaultErrorHandler = <R>(status: number, error: ErrorType<R>, requestMessage?: string) => void;

export interface ApiConfig {
    baseURL: string;
    useCsrf?: boolean;
    defaultErrorHandler?: DefaultErrorHandler;
}

export interface GraphQLResponseError {
    message: string;
}

export interface GraphQLQueryResponse<R> {
    data: R | null;
    errors?: Array<GraphQLResponseError>;
}
