import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { UriRequestConfig } from '../types';
import { customizeError, ErrorHandler } from '../core/errorHandling';
import {
	AUTHORIZATION_HEADER,
	BEARER_TOKEN_KEY
} from '../utils/commonConstants';

export const get =
	(instance: AxiosInstance, handleError?: ErrorHandler) =>
	<R>(req: UriRequestConfig): Promise<AxiosResponse<R>> => {
		const authHeader = localStorage.getItem(BEARER_TOKEN_KEY)
			? `Bearer ${localStorage.getItem(BEARER_TOKEN_KEY)}`
			: '';
		const config: AxiosRequestConfig = {
			...(req.config ?? {}),
			headers: {
				...(req.config?.headers ?? {}),
				[AUTHORIZATION_HEADER]: authHeader
			}
		};
		return instance.get<R>(req.uri, config).catch((ex: Error) => {
			const newError = customizeError(ex, req.errorCustomizer);
			handleError?.(newError, req);
			return Promise.reject(newError);
		});
	};
