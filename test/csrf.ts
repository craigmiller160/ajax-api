import MockAdapter from 'axios-mock-adapter';

export const mockCsrfToken = 'ABCDEFG';

export const prepareCsrfMock = (mockApi: MockAdapter, uri: string) =>
    mockApi.onOptions(uri)
        .reply((config) => {
            expect(config.headers['x-csrf-token']).toEqual('fetch');
            return [
                200,
                'CSRF Success',
                {
                    'x-csrf-token': mockCsrfToken
                }
            ]
        });
