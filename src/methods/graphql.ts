import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { customizeError, ErrorHandler } from '../core/errorHandling';
import { GraphQLQueryResponse, GraphQLRequestConfig } from '../types';
import GraphQLError from '../errors/GraphQLError';
import {
	AUTHORIZATION_HEADER,
	BEARER_TOKEN_KEY,
	CONTENT_TYPE_HEADER
} from '../utils/commonConstants';
import {
	DEFAULT_GRAPHQL_URI,
	GRAPHQL_CONTENT_TYPE
} from '../utils/graphqlConstants';

const getGraphQLErrorMessage = <R>(data: GraphQLQueryResponse<R>): string =>
	data.errors?.map((error) => error.message)?.join('\n') ?? '';

export const graphql =
	(instance: AxiosInstance, handleError?: ErrorHandler) =>
	<R>(
		req: GraphQLRequestConfig
	): Promise<AxiosResponse<GraphQLQueryResponse<R>>> => {
		const authHeader = localStorage.getItem(BEARER_TOKEN_KEY)
			? `Bearer ${localStorage.getItem(BEARER_TOKEN_KEY)}`
			: '';
		const config: AxiosRequestConfig = {
			...(req.config ?? {}),
			headers: {
				...(req.config?.headers ?? {}),
				[CONTENT_TYPE_HEADER]: GRAPHQL_CONTENT_TYPE,
				[AUTHORIZATION_HEADER]: authHeader
			}
		};

		const uri = req.overrideUri ?? DEFAULT_GRAPHQL_URI;

		return instance
			.post<GraphQLQueryResponse<R | null>>(uri, req.payload, config)
			.then((res) => {
				if ((res.data.errors?.length ?? 0) > 0) {
					const message = getGraphQLErrorMessage(res.data);
					throw new GraphQLError(message, res);
				}
				return res as AxiosResponse<GraphQLQueryResponse<R>>;
			})
			.catch((ex: Error) => {
				const newError = customizeError(ex, req.errorCustomizer);
				handleError?.(newError, req);
				return Promise.reject(newError);
			});
	};
