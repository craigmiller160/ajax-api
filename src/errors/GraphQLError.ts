import { AxiosResponse } from 'axios';
import { GraphQLQueryResponse } from '../types';

export default class GraphQLError extends Error {
    constructor(message: string, public response: AxiosResponse<GraphQLQueryResponse<unknown>>) {
        super(message);
        Object.setPrototypeOf(this, GraphQLError.prototype);
        this.name = 'GraphQLError';
    }
}
