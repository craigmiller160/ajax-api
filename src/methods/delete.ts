import { AxiosInstance, AxiosResponse } from 'axios';
import { customizeError, ErrorHandler } from '../core/errorHandling';
import { UriRequestConfig } from '../types';

export const doDelete =
	(instance: AxiosInstance, handleError?: ErrorHandler) =>
	<R>(req: UriRequestConfig): Promise<AxiosResponse<R>> =>
		instance.delete<R>(req.uri, req.config).catch((ex: Error) => {
			const newError = customizeError(ex, req.errorCustomizer);
			handleError?.(newError, req);
			return Promise.reject(newError);
		});
