# Error Handling

Any API errors can be given a default error handler when the `AjaxApi` instance is created. This is a callback function that is invoked and passed data on any error that has occurred. This allows for something like always displaying an alert in the UI whenever there is an error with an API call.

## Setting the Default Error Handler

There is a property when creating the `AjaxApi` instance for the default error handler. See that section of the docs for how to set this property.

## Default Error Handler Signature

```
(status: number, error: Error, requestMessage?: string) => void;
```

There are three arguments that get passed to this function whenever it is invoked:

| Argument | Description |
|----------|-------------|
| `status` | The HTTP status code of the response. If the error is not from a failed request, this will be 0. |
| `error` | The error object. It will always be an object that extends the built-in Error object. Please see the section below about the different types of Errors and how to response to them. |
| `requestMessage` | In each individual request, an `errorMsg` property can be set. This is an additional custom message that will be passed to this error handler to further describe the error. This may or may not be present, depending on if the request method set this property or not. Please see the section on making requests to see how to set this. |

## Error Types

There are several types of Errors handled by this function. Here is a description of each one and how to test for it.

| Error | How to Test | Description | Special Properties |
|-------|-------------|-------------|--------------------|
| `CsrfError` | The `status` argument will be 0, since this occurs prior to the actual method call. There should also be an `instanceof` check against the class. | This error only occurs if CSRF token handling is enabled. It means that the preflight operation to get a CSRF token has failed. | `message`, the error message. `error`, the original error that caused the CSRF failure, usually an `AxiosError`. |
| `GraphQLError` | The `status` argument will be 200, since GraphQL errors still have a 200 status code. There should also be an `instanceof` check against the class. | GraphQL errors are determined by testing the contents of the response body for an `errors` array. This error is thrown if the `AjaxApi` finds this to be true following a GraphQL call. | `message`, the error message. `response`, the original `AxiosResponse` wrapping a `GraphQLQueryResponse`. |
| `AxiosError` | The `status` argument will be 400 or greater. There should also be an `instanceof` check against the class. | This is an error returned by the API. | `config`, the original request config. `response`, the full HTTP response object. |
| `Error` | The `status` argument will be 0, since this means no HTTP call was made. It also means none of the other classes were the error. | This is any other error condition that may occur. | `message`, the error message. |

## Handling The Error Locally

Even if a default error handler is provided, the error is still propagated and the calling code handling the request promise can still react to it.

## Suppressing the Error Handler

In advanced use cases, a default error handler can be provided but in certain circumstances you don't want it to be invoked. Each request has an optional parameter for an error suppression function. The function has this signature:

```
(ex: Error) => Boolean;
```

If this function returns `true`, then the default error handler will not be invoked. This is done on a request-by-request basis. See the section on making requests to see how to configure this.