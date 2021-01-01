import { AxiosError } from 'axios';
import { BaseRequestConfig, DefaultErrorHandler, UriRequestConfig } from '../types';

export const isAxiosError = <R>(ex: any): ex is AxiosError<R> =>
    ex.response !== undefined && ex.response !== null;

export type ErrorHandler = (error: Error, config: BaseRequestConfig) => void;

export const createErrorHandler = (errorHandler: DefaultErrorHandler) =>
    (error: Error, config: UriRequestConfig): void => {
        if (!config.suppressError?.(error)) {
            let status = 0;
            if (isAxiosError<any>(error)) {
                status = error?.response?.status ?? 0;
            }
            errorHandler(status, error, config.errorMsg);
        }
    };
