import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ErrorHandler } from '../core/errorHandling';
import { GraphQLQueryResponse, GraphQLRequest } from '../types';

export const graphql = (instance: AxiosInstance, handleError?: ErrorHandler) =>
    <R>(req: GraphQLRequest): Promise<AxiosResponse<GraphQLQueryResponse<R>>> => {
        const config: AxiosRequestConfig = {
            ...(req.config ?? {}),
            headers: {
                ...(req.config?.headers ?? {}),
                'content-type': 'application/graphql'
            }
        };

        // TODO allow for overriding URI
        return instance.post<GraphQLQueryResponse<R>>('/graphql', req.payload, config)
            .then((res) => {
                // TODO check for error
                return res;
            })
            .catch((ex: Error) => {
                handleError?.(ex, req); // TODO unify this with other request interfaces
                throw ex;
            });
    };
