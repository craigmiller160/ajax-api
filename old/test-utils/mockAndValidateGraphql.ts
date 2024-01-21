import MockAdapter from 'axios-mock-adapter';
import { GraphQLQueryResponse } from '../../src/types';
import { expect } from 'vitest';

export interface GraphQLMockConfig<R> {
	mockApi: MockAdapter;
	payload: string;
	responseData?: GraphQLQueryResponse<R>;
	overrideUri?: string;
	bearerToken?: string;
}

export const mockAndValidateGraphQL = <R>(
	mockConfig: GraphQLMockConfig<R>
): void => {
	const uri = mockConfig.overrideUri ?? '/graphql';
	mockConfig.mockApi.onPost(uri).replyOnce((config) => {
		expect(config.data).stringsEqualIgnoreWhitespace(mockConfig.payload);
		if (mockConfig.bearerToken) {
			expect(config.headers).toEqual(
				expect.objectContaining({
					Authorization: `Bearer ${mockConfig.bearerToken}`
				})
			);
		}
		return [200, mockConfig.responseData];
	});
};
