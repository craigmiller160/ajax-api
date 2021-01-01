export default class GraphQLError extends Error {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, GraphQLError.prototype);
        this.name = 'GraphQLError';
    }
}
