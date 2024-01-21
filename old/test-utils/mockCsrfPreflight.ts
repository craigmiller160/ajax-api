import MockAdapter from 'axios-mock-adapter';
import { CSRF_HEADER } from '../../src/utils/csrfConstants';
import { expect } from 'vitest';

export const mockCsrfToken = 'ABCDEFG';

export const mockCsrfPreflight = (mockApi: MockAdapter, uri: string) =>
	mockApi.onOptions(uri).reply((config) => {
		expect(config.headers?.[CSRF_HEADER]).toEqual('fetch');
		return [
			200,
			null,
			{
				[CSRF_HEADER]: mockCsrfToken
			}
		];
	});
