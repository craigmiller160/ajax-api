import { GraphQLQueryResponse } from '../types';
import { AxiosResponse } from 'axios';

export default class GraphQLError extends Error {
    constructor(message: string, public response: AxiosResponse<GraphQLQueryResponse<unknown>>) {
        super(message);
        Object.setPrototypeOf(this, GraphQLError.prototype);
        this.name = 'GraphQLError';
    }
}
