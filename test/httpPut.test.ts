import MockAdapter from 'axios-mock-adapter';
import { AxiosError } from 'axios';
import { createApi } from '../src';
import { CSRF_HEADER } from '../src/utils/csrfConstants';
import CsrfError from '../src/errors/CsrfError';
import { mockCsrfPreflight, mockCsrfToken } from '../src/test-utils';
import {
	AUTHORIZATION_HEADER,
	BEARER_TOKEN_KEY
} from '../src/utils/commonConstants';

const baseURL = '/base';
const uri = '/foo/bar';
const defaultErrorHandler = jest.fn();
const message = 'The message';
const body = {
	one: 'two',
	three: 'four'
};
type BodyType = typeof body;

describe('HTTP PUT', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		localStorage.clear();
	});
	it('makes successful request without CSRF', async () => {
		const api = createApi({
			baseURL
		});
		const mockApi = new MockAdapter(api.instance);
		mockApi.onPut(uri, body).reply(200, 'Success');
		const res = await api.put<string, BodyType>({
			uri,
			body
		});
		expect(res.status).toEqual(200);
		expect(res.data).toEqual('Success');
	});

	it('makes successful request with localStorage token', async () => {
		const token = 'TheToken';
		localStorage.setItem(BEARER_TOKEN_KEY, token);
		const api = createApi({
			baseURL
		});
		const mockApi = new MockAdapter(api.instance);
		mockApi.onPut(uri, body).reply((config) => {
			expect(config.headers?.[AUTHORIZATION_HEADER]).toEqual(
				`Bearer ${token}`
			);
			return [200, 'Success'];
		});
		const res = await api.put<string, BodyType>({
			uri,
			body
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
		mockApi.onPut(uri, body).reply((config) => {
			expect(config.headers?.[CSRF_HEADER]).toEqual(mockCsrfToken);
			return [200, 'Success'];
		});
		const res = await api.put<string, BodyType>({
			uri,
			body
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
			await api.put<string, BodyType>({
				uri,
				body,
				errorCustomizer: message
			});
		} catch (ex) {
			expect((ex as Error).cause).toBeInstanceOf(CsrfError);
			const csrfError = (ex as Error).cause as CsrfError;
			expect(csrfError.message).toEqual('Request failed preflight');
			const cause = csrfError.error as AxiosError<string>;
			expect(cause.response?.status).toEqual(404);
			expect(defaultErrorHandler).toHaveBeenCalledWith(0, ex);
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
		mockApi.onPut(uri, body).reply(500, 'Error');
		try {
			await api.put<string, BodyType>({
				uri,
				body,
				errorCustomizer: message
			});
		} catch (ex) {
			const axiosError = (ex as Error).cause as AxiosError<string>;
			expect(axiosError.response?.status).toEqual(500);
			expect(axiosError.response?.data).toEqual('Error');
			expect(defaultErrorHandler).toHaveBeenCalledWith(500, ex);
			return;
		}
		throw new Error('Should have been error');
	});

	it('makes request with 500 error without error handler', async () => {
		const api = createApi({
			baseURL
		});
		const mockApi = new MockAdapter(api.instance);
		mockApi.onPut(uri, body).reply(500, 'Error');
		try {
			await api.put<string, BodyType>({
				uri,
				body,
				errorCustomizer: message
			});
		} catch (ex) {
			const axiosError = (ex as Error).cause as AxiosError<string>;
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
		api.instance.interceptors.request.use(() => {
			throw new Error('Dying');
		});
		try {
			await api.put<string, BodyType>({
				uri,
				body,
				errorCustomizer: message
			});
		} catch (ex) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			expect(((ex as Error).cause as any).response).toBeUndefined();
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			expect(((ex as Error).cause as any).message).toEqual('Dying');
			expect(defaultErrorHandler).toHaveBeenCalledWith(0, ex);
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
		mockApi.onPut(uri, body).reply(500, 'Error');
		try {
			await api.put<string, BodyType>({
				uri,
				body,
				errorCustomizer: message,
				suppressError: () => true
			});
		} catch (ex) {
			const axiosError = (ex as Error).cause as AxiosError<string>;
			expect(axiosError.response?.status).toEqual(500);
			expect(axiosError.response?.data).toEqual('Error');
			expect(defaultErrorHandler).not.toHaveBeenCalled();
			return;
		}
		throw new Error('Should have been error');
	});
});
