import { GraphQLQueryResponse } from '../types';
import { AxiosResponse } from 'axios';

export default class GraphQLError<R = any> extends Error {
    constructor(message: string, public response: AxiosResponse<GraphQLQueryResponse<R>>) {
        super(message);
        Object.setPrototypeOf(this, GraphQLError.prototype);
        this.name = 'GraphQLError';
    }
}
