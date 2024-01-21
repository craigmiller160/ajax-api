import { expect, beforeEach, describe, it, vi } from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import { AxiosError } from 'axios';
import { createApi } from '../src';
import {
	AUTHORIZATION_HEADER,
	BEARER_TOKEN_KEY
} from '../src/utils/commonConstants';

const baseURL = '/base';
const uri = '/foo/bar';
const defaultErrorHandler = vi.fn();
const message = 'The message';

describe('HTTP GET', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		localStorage.clear();
	});
	it('makes successful request', async () => {
		const api = createApi({
			baseURL
		});
		const mockApi = new MockAdapter(api.instance);
		mockApi.onGet(uri).reply(200, 'Success');
		const res = await api.get<string>({
			uri
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
		mockApi.onGet(uri).reply((config) => {
			expect(config.headers?.[AUTHORIZATION_HEADER]).toEqual(
				`Bearer ${token}`
			);
			return [200, 'Success'];
		});
		const res = await api.get<string>({
			uri
		});
		expect(res.status).toEqual(200);
		expect(res.data).toEqual('Success');
	});

	it('makes request with 500 error and error handler', async () => {
		const api = createApi({
			baseURL,
			defaultErrorHandler
		});
		const mockApi = new MockAdapter(api.instance);
		mockApi.onGet(uri).reply(500, 'Error');
		try {
			await api.get<string>({
				uri,
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

	it('makes request with 500 error, with error handler, with suppress error', async () => {
		const api = createApi({
			baseURL,
			defaultErrorHandler
		});
		const mockApi = new MockAdapter(api.instance);
		mockApi.onGet(uri).reply(500, 'Error');
		try {
			await api.get<string>({
				uri,
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

	it('makes request with 500 error without error handler', async () => {
		const api = createApi({
			baseURL
		});
		const mockApi = new MockAdapter(api.instance);
		mockApi.onGet(uri).reply(500, 'Error');
		try {
			await api.get<string>({
				uri,
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
		new MockAdapter(api.instance);
		api.instance.interceptors.request.use(() => {
			throw new Error('Dying');
		});
		try {
			await api.get<string>({
				uri,
				errorCustomizer: message
			});
		} catch (ex) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
			expect(((ex as Error).cause as any).response).toBeUndefined();
			// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
			expect(((ex as Error).cause as any).message).toEqual('Dying');
			expect(defaultErrorHandler).toHaveBeenCalledWith(0, ex);
			return;
		}
		throw new Error('Should have been error');
	});
});
