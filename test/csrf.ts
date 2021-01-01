import MockAdapter from 'axios-mock-adapter';
import { CSRF_HEADER } from '../src/utils/csrfConstants';

export const mockCsrfToken = 'ABCDEFG';

export const prepareCsrfMock = (mockApi: MockAdapter, uri: string) =>
    mockApi.onOptions(uri)
        .reply((config) => {
            expect(config.headers[CSRF_HEADER]).toEqual('fetch');
            return [
                200,
                'CSRF Success',
                {
                    [CSRF_HEADER]: mockCsrfToken
                }
            ];
        });
