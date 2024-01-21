import { AxiosError } from 'axios';
import { BaseRequestConfig, DefaultErrorHandler } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isAxiosError = <R>(ex: any): ex is AxiosError<R> =>
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	ex.response !== undefined && ex.response !== null;

export const customizeError = (
	error: Error,
	errorCustomizer?: string | ((e: Error) => Error)
): Error => {
	if (errorCustomizer !== undefined && typeof errorCustomizer === 'string') {
		return new Error(errorCustomizer, {
			cause: error
		});
	}

	if (errorCustomizer !== undefined) {
		return errorCustomizer(error);
	}
	return error;
};

export type ErrorHandler = (error: Error, config: BaseRequestConfig) => void;

export const createErrorHandler =
	(errorHandler: DefaultErrorHandler) =>
	(error: Error, config: BaseRequestConfig): void => {
		if (!config.suppressError?.(error)) {
			let status = 0;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			if (isAxiosError<any>(error)) {
				status = error?.response?.status ?? 0;
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} else if (isAxiosError<any>(error?.cause)) {
				status = error?.cause?.response?.status ?? 0;
			}
			errorHandler(status, error);
		}
	};
