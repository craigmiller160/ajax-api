import MockAdapter from 'axios-mock-adapter';
import { createApi } from '../src';
import { mockCsrfToken, prepareCsrfMock } from './csrf';

const baseURL = '/base';
const uri = '/foo/bar';
const defaultErrorHandler = jest.fn();
const message = 'The message';

describe('HTTP DELETE', () => {
    it('makes successful request without CSRF', async () => {
        const api = createApi({
            baseURL,
            useCsrf: true
        });
        const mockApi = new MockAdapter(api.instance);
        prepareCsrfMock(mockApi, uri);
        mockApi.onDelete(uri)
            .reply((config) => {
                expect(config.headers['x-csrf-token']).toEqual(mockCsrfToken);
                return [
                    200,
                    'Success'
                ];
            });
        const res = await api.delete<string>({
            uri
        });
        expect(res.status).toEqual(200);
        expect(res.data).toEqual('Success');
    });

    it('makes successful request with CSRF', () => {
        throw new Error();
    });

    it('has error with CSRF preflight with error handler', () => {
        throw new Error();
    });

    it('makes request with 500 error and error handler', () => {
        throw new Error();
    });

    it('makes request with 500 error without error handler', () => {
        throw new Error();
    });

    it('makes request with generic error and error handler', () => {
        throw new Error();
    });

    it('makes request with 500 error, with error handler, with suppress error', () => {
        throw new Error();
    });
});
