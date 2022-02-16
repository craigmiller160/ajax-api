import MockAdapter from 'axios-mock-adapter';
import { AxiosError } from 'axios';
import { createApi } from '../src';
import { CSRF_HEADER } from '../src/utils/csrfConstants';
import CsrfError from '../src/errors/CsrfError';
import { mockCsrfPreflight, mockCsrfToken } from '../src/test-utils';

const baseURL = '/base';
const uri = '/foo/bar';
const defaultErrorHandler = jest.fn();
const message = 'The message';

describe('HTTP DELETE', () => {
	it('makes successful request without CSRF', async () => {
		const api = createApi({
			baseURL
		});
		const mockApi = new MockAdapter(api.instance);
		mockApi.onDelete(uri).reply(200, 'Success');
		const res = await api.delete<string>({
			uri
		});
		expect(res.status).toEqual(200);
		expect(res.data).toEqual('Success');
	});

	it('makes successful request with CSRF', async () => {
		const api = createApi({
			baseURL,
			useCsrf: true
		});
		const mockApi = new MockAdapter(api.instance);
		mockCsrfPreflight(mockApi, uri);
		mockApi.onDelete(uri).reply((config) => {
			expect(config.headers?.[CSRF_HEADER]).toEqual(mockCsrfToken);
			return [200, 'Success'];
		});
		const res = await api.delete<string>({
			uri
		});
		expect(res.status).toEqual(200);
		expect(res.data).toEqual('Success');
	});

	it('has error with CSRF preflight with error handler', async () => {
		const api = createApi({
			baseURL,
			useCsrf: true,
			defaultErrorHandler
		});
		new MockAdapter(api.instance); // eslint-disable-line no-new
		try {
			await api.delete<string>({
				uri,
				errorMsg: message
			});
		} catch (ex) {
			expect(ex).toBeInstanceOf(CsrfError);
			const csrfError = ex as CsrfError;
			expect(csrfError.message).toEqual('Request failed preflight');
			const cause = csrfError.error as AxiosError<string>;
			expect(cause.response?.status).toEqual(404);
			expect(defaultErrorHandler).toHaveBeenCalledWith(0, ex, message);
			return;
		}
		throw new Error('Should have been error');
	});

	it('makes request with 500 error and error handler', async () => {
		const api = createApi({
			baseURL,
			defaultErrorHandler
		});
		const mockApi = new MockAdapter(api.instance);
		mockApi.onDelete(uri).reply(500, 'Error');
		try {
			await api.delete<string>({
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

	it('makes request with 500 error without error handler', async () => {
		const api = createApi({
			baseURL
		});
		const mockApi = new MockAdapter(api.instance);
		mockApi.onDelete(uri).reply(500, 'Error');
		try {
			await api.delete<string>({
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

	it('makes request with generic error and error handler', async () => {
		const api = createApi({
			baseURL,
			defaultErrorHandler
		});
		new MockAdapter(api.instance); // eslint-disable-line no-new
		api.instance.interceptors.request.use((config) => {
			throw new Error('Dying');
		});
		try {
			await api.delete<string>({
				uri,
				errorMsg: message
			});
		} catch (ex) {
			expect((ex as any).response).toBeUndefined();
			expect((ex as any).message).toEqual('Dying');
			expect(defaultErrorHandler).toHaveBeenCalledWith(0, ex, message);
			return;
		}
		throw new Error('Should have been error');
	});

	it('makes request with 500 error, with error handler, with suppress error', async () => {
		const api = createApi({
			baseURL,
			defaultErrorHandler
		});
		const mockApi = new MockAdapter(api.instance);
		mockApi.onDelete(uri).reply(500, 'Error');
		try {
			await api.delete<string>({
				uri,
				errorMsg: message,
				suppressError: (ex) => true
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
});
