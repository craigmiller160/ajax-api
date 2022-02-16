import MockAdapter from 'axios-mock-adapter';
import { AxiosError } from 'axios';
import { createApi } from '../src';

const baseURL = '/base';
const uri = '/foo/bar';
const defaultErrorHandler = jest.fn();
const message = 'The message';

describe('HTTP GET', () => {
	beforeEach(() => {
		jest.clearAllMocks();
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
				errorMsg: message,
				suppressError: () => true
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

	it('makes request with 500 error without error handler', async () => {
		const api = createApi({
			baseURL
		});
		const mockApi = new MockAdapter(api.instance);
		mockApi.onGet(uri).reply(500, 'Error');
		try {
			await api.get<string>({
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
		new MockAdapter(api.instance);
		api.instance.interceptors.request.use(() => {
			throw new Error('Dying');
		});
		try {
			await api.get<string>({
				uri,
				errorMsg: message
			});
		} catch (ex) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			expect((ex as any).response).toBeUndefined();
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			expect((ex as any).message).toEqual('Dying');
			expect(defaultErrorHandler).toHaveBeenCalledWith(0, ex, message);
			return;
		}
		throw new Error('Should have been error');
	});
});
