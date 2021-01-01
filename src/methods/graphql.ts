import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ErrorHandler } from '../core/errorHandling';
import { GraphQLQueryResponse, GraphQLRequestConfig } from '../types';

// TODO create graphql constants file

const DEFAULT_GRAPHQL_URI = '/graphql';

export const graphql = (instance: AxiosInstance, handleError?: ErrorHandler) =>
    <R>(req: GraphQLRequestConfig): Promise<AxiosResponse<GraphQLQueryResponse<R>>> => {
        const config: AxiosRequestConfig = {
            ...(req.config ?? {}),
            headers: {
                ...(req.config?.headers ?? {}),
                'content-type': 'application/graphql'
            }
        };

        const uri = req.overrideUri ?? DEFAULT_GRAPHQL_URI;

        return instance.post<GraphQLQueryResponse<R>>(uri, req.payload, config)
            .then((res) => {
                // TODO check for error
                return res;
            })
            .catch((ex: Error) => {
                handleError?.(ex, req); // TODO unify this with other request interfaces
                throw ex;
            });
    };
