import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ErrorHandler } from '../core/errorHandling';
import { GraphQLQueryResponse, GraphQLRequestConfig } from '../types';
import GraphQLError from '../errors/GraphQLError';

// TODO create graphql constants file

const DEFAULT_GRAPHQL_URI = '/graphql';

const getGraphQLErrorMessage = <R> (data: GraphQLQueryResponse<R>): string =>
    data.errors
        ?.map((error) => error.message)
        ?.join('\n') ??
    '';

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
                if (res.data.errors?.length > 0) {
                    const message = getGraphQLErrorMessage(res.data);
                    throw new GraphQLError(message, res);
                }
                return res;
            })
            .catch((ex: Error) => {
                handleError?.(ex, req); // TODO unify this with other request interfaces
                throw ex;
            });
    };
