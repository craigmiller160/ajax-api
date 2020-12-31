import { createApi } from '../src';
import MockAdapter from 'axios-mock-adapter';
import { AxiosError } from 'axios';

const baseURL = '/base';
const uri = '/foo/bar';
const defaultErrorHandler = jest.fn();
const message = 'The message';

describe('HTTP GET', () => {
    it('makes successful request', async () => {
        const api = createApi({
            baseURL
        });
        const mockApi = new MockAdapter(api.instance);
        mockApi.onGet(uri)
            .reply(200, 'Success');
        const res = await api.get({
            uri
        });
        expect(res.status).toEqual(200);
        expect(res.data).toEqual('Success');
    });

    it('makes request with 500 error and error handling', async () => {
        const api = createApi({
            baseURL,
            defaultErrorHandler
        });
        const mockApi = new MockAdapter(api.instance);
        mockApi.onGet(uri)
            .reply(500, 'Error');
        try {
            const res = await api.get({
                uri,
                errorMsg: message
            });
        } catch (ex) {
            const axiosError = ex as AxiosError<string>;
            expect(axiosError.response?.status).toEqual(500);
            expect(axiosError.response?.data).toEqual('Error');
            expect(defaultErrorHandler).toHaveBeenCalledWith(500, ex, message);
            return;
        }
        throw new Error('Should have been error');
    });

    it('makes request with 500 error without error handling', async () => {
        const api = createApi({
            baseURL
        });
        const mockApi = new MockAdapter(api.instance);
        mockApi.onGet(uri)
            .reply(500, 'Error');
        try {
            const res = await api.get({
                uri,
                errorMsg: message
            });
        } catch (ex) {
            const axiosError = ex as AxiosError<string>;
            expect(axiosError.response?.status).toEqual(500);
            expect(axiosError.response?.data).toEqual('Error');
            expect(defaultErrorHandler).not.toHaveBeenCalled();
            return;
        }
        throw new Error('Should have been error');
    });

    it('makes request with generic error and error handling', async () => {
        const api = createApi({
            baseURL,
            defaultErrorHandler
        });
        const mockApi = new MockAdapter(api.instance);
        api.instance.interceptors.request.use((config) => {
            throw new Error('Dying');
        });
        try {
            const res = await api.get({
                uri,
                errorMsg: message
            });
        } catch (ex) {
            expect((ex as any).response).toBeUndefined();
            expect(ex.message).toEqual('Dying');
            expect(defaultErrorHandler).toHaveBeenCalledWith(0, ex, message);
            return;
        }
        throw new Error('Should have been error');
    });
});
