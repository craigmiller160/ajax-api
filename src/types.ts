import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export type SuppressErrorFn = (ex: Error) => boolean;

export interface BaseRequestConfig {
	config?: AxiosRequestConfig;
	errorMsg?: string;
	suppressError?: SuppressErrorFn;
}

export interface UriRequestConfig extends BaseRequestConfig {
	uri: string;
}

export interface UriBodyRequestConfig<B> extends UriRequestConfig {
	body?: B;
}

export interface GraphQLRequestConfig extends BaseRequestConfig {
	payload: string;
	overrideUri?: string;
}

export type DefaultErrorHandler = (
	status: number,
	error: Error,
	requestMessage?: string
) => void;

export interface ApiConfig {
	baseURL?: string;
	useCsrf?: boolean;
	defaultErrorHandler?: DefaultErrorHandler;
}

export interface GraphQLResponseError {
	message: string;
}

export interface GraphQLQueryResponse<R> {
	data: R;
	errors?: Array<GraphQLResponseError>;
}

export interface AjaxApi {
	instance: AxiosInstance;
	get: <R>(req: UriRequestConfig) => Promise<AxiosResponse<R>>;
	post: <B, R>(req: UriBodyRequestConfig<B>) => Promise<AxiosResponse<R>>;
	put: <B, R>(req: UriBodyRequestConfig<B>) => Promise<AxiosResponse<R>>;
	delete: <R>(req: UriRequestConfig) => Promise<AxiosResponse<R>>;
	graphql: <R>(
		req: GraphQLRequestConfig
	) => Promise<AxiosResponse<GraphQLQueryResponse<R>>>;
}
