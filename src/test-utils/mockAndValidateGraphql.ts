import MockAdapter from 'axios-mock-adapter';
import { GraphQLQueryResponse } from '../types';

export const mockAndValidateGraphQL = <R>(
    mockApi: MockAdapter, uri: string, payload: string, responseData: GraphQLQueryResponse<R>
) =>
    mockApi.onPost(uri)
        .reply((config) => {
            expect(config.data).stringsEqualIgnoreWhitespace(payload);
            return [
                200,
                responseData
            ];
        });
