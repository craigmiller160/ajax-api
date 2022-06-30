import { AxiosInstance, AxiosResponse } from 'axios';
import { UriRequestConfig } from '../types';
import { customizeError, ErrorHandler } from '../core/errorHandling';

export const get =
	(instance: AxiosInstance, handleError?: ErrorHandler) =>
	<R>(req: UriRequestConfig): Promise<AxiosResponse<R>> =>
		instance.get<R>(req.uri, req.config).catch((ex: Error) => {
			const newError = customizeError(ex, req.errorCustomizer);
			handleError?.(newError, req);
			return Promise.reject(newError);
		});
