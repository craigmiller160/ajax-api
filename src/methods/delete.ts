import { AxiosInstance, AxiosResponse } from 'axios';
import { ErrorHandler } from '../core/errorHandling';
import { UriRequestConfig } from '../types';

export const doDelete =
	(instance: AxiosInstance, handleError?: ErrorHandler) =>
	<R>(req: UriRequestConfig): Promise<AxiosResponse<R>> =>
		instance.delete<R>(req.uri, req.config).catch((ex: Error) => {
			handleError?.(ex, req);
			throw ex;
		});
