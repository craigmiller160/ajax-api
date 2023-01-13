import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { customizeError, ErrorHandler } from '../core/errorHandling';
import { UriBodyRequestConfig } from '../types';
import {
	AUTHORIZATION_HEADER,
	BEARER_TOKEN_KEY
} from '../utils/commonConstants';

export const doDelete =
	(instance: AxiosInstance, handleError?: ErrorHandler) =>
	<R, B = unknown>(
		req: UriBodyRequestConfig<B>
	): Promise<AxiosResponse<R>> => {
		const authHeader = localStorage.getItem(BEARER_TOKEN_KEY)
			? `Bearer ${localStorage.getItem(BEARER_TOKEN_KEY)}`
			: '';
		const config: AxiosRequestConfig = {
			...(req.config ?? {}),
			headers: {
				...(req.config?.headers ?? {}),
				[AUTHORIZATION_HEADER]: authHeader
			},
			data: req.body
		};
		return instance.delete<R>(req.uri, config).catch((ex: Error) => {
			const newError = customizeError(ex, req.errorCustomizer);
			handleError?.(newError, req);
			return Promise.reject(newError);
		});
	};
