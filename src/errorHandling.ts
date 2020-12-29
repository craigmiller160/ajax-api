import { AxiosError } from 'axios';
import { ErrorHandlingConfig } from './types';

// TODO delete this file if unused

export const isAxiosError = <R>(ex: any): ex is AxiosError<R> =>
    ex.response !== undefined && ex.response !== null;

export const defaultErrorHandlingConfig: ErrorHandlingConfig = {
    defaultErrorHandler: (e) => {}
};

export const createErrorHandler = (config: ErrorHandlingConfig = defaultErrorHandlingConfig) =>
    (error: Error): void => {
        if (isAxiosError<object>(error)) {
            error.response.status
        }
    };
