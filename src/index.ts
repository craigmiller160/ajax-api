import { AxiosInstance } from 'axios';
import { get } from './methods/get';
import { createInstance } from './core/axiosInstance';
import { AjaxApi, ApiConfig } from './types';
import { createErrorHandler, ErrorHandler } from './core/errorHandling';
import { post } from './methods/post';
import { put } from './methods/put';
import { doDelete } from './methods/delete';
import { graphql } from './methods/graphql';

export { default as GraphQLError } from './errors/GraphQLError';
export { default as CsrfError } from './errors/CsrfError';
export { isAxiosError } from './core/errorHandling';
export * from './types';
export { BEARER_TOKEN_KEY } from './utils/commonConstants';

export const createApi = (config?: ApiConfig): AjaxApi => {
	const baseURL = config?.baseURL ?? '/';
	const useCsrf = config?.useCsrf ?? false;
	const instance: AxiosInstance = createInstance(baseURL, useCsrf);
	let errorHandler: ErrorHandler | undefined;
	if (config?.defaultErrorHandler) {
		errorHandler = createErrorHandler(config.defaultErrorHandler);
	}
	return {
		instance,
		get: get(instance, errorHandler),
		post: post(instance, errorHandler),
		put: put(instance, errorHandler),
		delete: doDelete(instance, errorHandler),
		graphql: graphql(instance, errorHandler)
	};
};
