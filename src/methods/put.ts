import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { customizeError, ErrorHandler } from '../core/errorHandling';
import { UriBodyRequestConfig } from '../types';
import {
	AUTHORIZATION_HEADER,
	BEARER_TOKEN_KEY
} from '../utils/commonConstants';

export const put =
	(instance: AxiosInstance, handleError?: ErrorHandler) =>
	<R, B>(req: UriBodyRequestConfig<B>): Promise<AxiosResponse<R>> => {
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
		return instance.put<R>(req.uri, req.body, config).catch((ex: Error) => {
			const newError = customizeError(ex, req.errorCustomizer);
			handleError?.(newError, req);
			return Promise.reject(newError);
		});
	};
