import MockAdapter from 'axios-mock-adapter';
import { AxiosError } from 'axios';
import { createApi } from '../src';
import { GraphQLQueryResponse } from '../src/types';
import CsrfError from '../src/errors/CsrfError';
import GraphQLError from '../src/errors/GraphQLError';
import { mockAndValidateGraphQL, mockCsrfPreflight } from '../src/test-utils';
import { BEARER_TOKEN_KEY } from '../src/utils/commonConstants';

const baseURL = '/base';
const graphqlUri = '/graphql';
const defaultErrorHandler = jest.fn();
const message = 'The message';
const payload = `
    query: {
        clients {
            id
            name
        }
    }    
`;
const responseData = {
	clients: [
		{
			id: 1,
			name: 'Client'
		}
	]
};
type ResponseDataType = typeof responseData;
const successResponse: GraphQLQueryResponse<ResponseDataType> = {
	data: responseData
};
const errorResponse: GraphQLQueryResponse<ResponseDataType | null> = {
	data: null,
	errors: [
		{
			message: 'First error'
		},
		{
			message: 'Second error'
		}
	]
};
const graphqlErrorMessage = 'First error\nSecond error';

describe('graphql', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		localStorage.clear();
	});
	it('makes successful request without CSRF', async () => {
		const api = createApi({
			baseURL
		});
		const mockApi = new MockAdapter(api.instance);
		mockAndValidateGraphQL<ResponseDataType>({
			mockApi,
			payload,
			responseData: successResponse
		});
		const res = await api.graphql<ResponseDataType>({
			payload
		});
		expect(res.status).toEqual(200);
		expect(res.data).toEqual(successResponse);
	});

	it('makes successful request with localStorage token', async () => {
		const token = 'TheToken';
		localStorage.setItem(BEARER_TOKEN_KEY, token);
		const api = createApi({
			baseURL
		});
		const mockApi = new MockAdapter(api.instance);
		mockAndValidateGraphQL<ResponseDataType>({
			mockApi,
			payload,
			responseData: successResponse,
			bearerToken: token
		});
		const res = await api.graphql<ResponseDataType>({
			payload
		});
		expect(res.status).toEqual(200);
		expect(res.data).toEqual(successResponse);
	});

	it('makes successful request without CSRF with overrideUri', async () => {
		const overrideUri = '/foo/bar';
		const api = createApi({
			baseURL
		});
		const mockApi = new MockAdapter(api.instance);
		mockAndValidateGraphQL<ResponseDataType>({
			overrideUri,
			mockApi,
			payload,
			responseData: successResponse
		});
		const res = await api.graphql<ResponseDataType>({
			payload,
			overrideUri
		});
		expect(res.status).toEqual(200);
		expect(res.data).toEqual(successResponse);
	});

	it('makes successful request with CSRF', async () => {
		const api = createApi({
			baseURL,
			useCsrf: true
		});
		const mockApi = new MockAdapter(api.instance);
		mockCsrfPreflight(mockApi, graphqlUri);
		mockAndValidateGraphQL<ResponseDataType>({
			mockApi,
			payload,
			responseData: successResponse
		});
		const res = await api.graphql<ResponseDataType>({
			payload
		});
		expect(res.status).toEqual(200);
		expect(res.data).toEqual(successResponse);
	});

	it('has error with CSRF preflight with error handler', async () => {
		const api = createApi({
			baseURL,
			useCsrf: true,
			defaultErrorHandler
		});
		new MockAdapter(api.instance); // eslint-disable-line no-new
		try {
			await api.graphql<ResponseDataType>({
				payload,
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
		mockApi.onPost(graphqlUri, payload).reply(500, 'Error');
		try {
			await api.graphql<ResponseDataType>({
				payload,
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
		mockApi.onPost(graphqlUri, payload).reply(500, 'Error');
		try {
			await api.graphql<ResponseDataType>({
				payload,
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
			await api.graphql<ResponseDataType>({
				payload,
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
		mockApi.onPost(graphqlUri, payload).reply(500, 'Error');
		try {
			await api.graphql<ResponseDataType>({
				payload,
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

	it('makes request with GraphQL Error and error handler', async () => {
		const api = createApi({
			baseURL,
			defaultErrorHandler
		});
		const mockApi = new MockAdapter(api.instance);
		mockAndValidateGraphQL<ResponseDataType | null>({
			mockApi,
			payload,
			responseData: errorResponse
		});
		try {
			await api.graphql<ResponseDataType>({
				payload,
				errorCustomizer: message
			});
		} catch (ex) {
			expect((ex as Error).cause).toBeInstanceOf(GraphQLError);
			const gqlError = (ex as Error).cause as GraphQLError;
			expect(gqlError.message).toEqual(graphqlErrorMessage);
			const res = gqlError.response;
			expect(res.status).toEqual(200);
			expect(res.data).toEqual(errorResponse);
			expect(defaultErrorHandler).toHaveBeenCalledWith(200, ex);
			return;
		}
		throw new Error('Should have been error');
	});
});
