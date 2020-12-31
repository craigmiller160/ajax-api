
export default class CsrfError extends Error {
    constructor(message: string, public error: Error) {
        super (message);
        Object.setPrototypeOf(this, CsrfError.prototype);
        this.name = 'CsrfError';
    }
}
