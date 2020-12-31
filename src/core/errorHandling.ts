import { AxiosError } from 'axios';
import { DefaultErrorHandler, RequestConfig } from '../types';

export const isAxiosError = <R>(ex: any): ex is AxiosError<R> =>
    ex.response !== undefined && ex.response !== null;

export type ErrorHandler = (error: Error, config: RequestConfig) => void;

export const createErrorHandler = (errorHandler: DefaultErrorHandler) =>
    (error: Error, config: RequestConfig): void => {
        let status = 0;
        if (isAxiosError<any>(error)) {
            status = error?.response?.status ?? 0;
        }
        errorHandler(status, error, config.errorMsg);
    };
