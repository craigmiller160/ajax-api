import { AxiosError } from 'axios';

// TODO see if it's possible to make this generic
export const isAxiosError = (ex: any): ex is AxiosError<object> => ex.response !== undefined;

export const handleError = (error: Error): void => {
    // TODO handle the error globally
};