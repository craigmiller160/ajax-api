import MockAdapter from 'axios-mock-adapter';
import { GraphQLQueryResponse } from '../types';

export interface GraphQLMockConfig<R> {
    mockApi: MockAdapter;
    payload: string;
    responseData?: GraphQLQueryResponse<R>;
    overrideUri?: string;
}

export const mockAndValidateGraphQL = <R>(mockConfig: GraphQLMockConfig<R>): void => {
    const uri = mockConfig.overrideUri ?? '/graphql';
    mockConfig.mockApi.onPost(uri)
        .replyOnce((config) => {
            expect(config.data).stringsEqualIgnoreWhitespace(mockConfig.payload);
            return [
                200,
                mockConfig.responseData
            ];
        });
};
