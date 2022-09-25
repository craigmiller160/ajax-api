import { AxiosInstance, AxiosResponse } from 'axios';
import { customizeError, ErrorHandler } from '../core/errorHandling';
import { UriBodyRequestConfig } from '../types';

export const post =
	(instance: AxiosInstance, handleError?: ErrorHandler) =>
	<R, B>(req: UriBodyRequestConfig<B>): Promise<AxiosResponse<R>> =>
		instance.post<R>(req.uri, req.body, req.config).catch((ex: Error) => {
			const newError = customizeError(ex, req.errorCustomizer);
			handleError?.(newError, req);
			return Promise.reject(newError);
		});
