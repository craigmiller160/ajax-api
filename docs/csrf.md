# CSRF Tokens

All applications in my suite are secured using Tomcat's `RestCsrfPreventionFilter`. This filter enforces the synchronizer token pattern for defending against CSRF attacks. This library has an option to turn on CSRF handling that conforms to this pattern.

## How CSRF Handling Works

1. CSRF protection must be enabled when the `AjaxApi` instance is created.
1. CSRF protection is only enforced on modifying requests (POST, PUT, DELETE).
1. When one of those methods is called, an OPTIONS preflight is performed to retrieve a valid CSRF token for the request.
1. The token is automatically added to the original request before it proceeds.
1. If the preflight fails, an error is thrown.

## CsrfError

A special error type, the `CsrfError`, is thrown if the CSRF preflight fails. It contains a `message` property with a base error message, and the `Error` object that defines the exact problem that caused the preflight to fail. This may be an `AxiosError` if the request itself failed, or another type of error if something else went wrong.

This error is passed to the default error handler, if it exists. It can also be accessed in the `catch` of the promise returned by the request.
