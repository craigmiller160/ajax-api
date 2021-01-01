import { GraphQLQueryResponse } from '../types';
import { AxiosResponse } from 'axios';

// TODO do I need to type AxiosResponse?
export default class GraphQLError extends Error {
    constructor(message: string, public response: AxiosResponse<any>) {
        super(message);
        Object.setPrototypeOf(this, GraphQLError.prototype);
        this.name = 'GraphQLError';
    }
}
