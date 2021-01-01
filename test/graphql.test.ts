import MockAdapter from 'axios-mock-adapter';
import { createApi } from '../src';
import { GraphQLQueryResponse } from '../src/types';

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

describe('graphql', () => {
    it('makes successful request without CSRF', async () => {
        const api = createApi({
            baseURL
        });
        const mockApi = new MockAdapter(api.instance);
        mockApi.onPost(graphqlUri, payload)
            .reply(200, successResponse);
        const res = await api.graphql({
            payload
        });
        expect(res.status).toEqual(200);
        expect(res.data).toEqual(successResponse);
    });

    it('makes successful request without CSRF with overrideUri', () => {
        throw new Error();
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

    it('makes request with GraphQL Error and error handler', () => {
        throw new Error();
    });
});
