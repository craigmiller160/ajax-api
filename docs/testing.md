# Testing

A few helpful tips and bundled utilities to help with writing tests.

## Using `axios-mock-adapter`

When writing tests, it is common to use the `axios-mock-adapter` library. The `AjaxApi` supports this, however the `AxiosInstance` it wraps around is what must be passed to the mock adapter.

```
import ajaxApiInstance from './path/to/api';
import MockAdapter from 'axios-mock-adapter';

const mockApi = new MockAdapter(ajaxApiIntance.instance);
```

## Mocking CSRF Preflight

It is common to need to mock the CSRF OPTIONS preflight request, and even to validate that the CSRF token is properly set. To accomplish this, the following exports exist via `@craigmiller160/ajax-api/lib/test-utils`.

| Export Name | Description |
|-------------|-------------|
| mockCsrfToken | A mocked CSRF token used by the mocked preflight and set on the request header. Used for performing any kind of CSRF token validation. |
| mockCsrfPreflight | A utility function that takes in the `axios-mock-adapter` instance and request URI to mock the OPTIONS preflight. |

## Mocking GraphQL

Mocking GraphQL can be challenging because of the payload. Properly indented GraphQL payloads may not match the payload in a test because of different indenting. Therefore a special export exists via `@craigmiller160/ajax-api/lib/test-utils` to mock GraphQL. It will use `axios-mock-adapter` to properly mock the call, and it will validate the payload while ignoring whitespace.

The export is called `mockAndValidateGraphql`. It takes in an object with the following properties as configuration:

| Name | Required | Description |
|------|----------|-------------|
| mockApi | Yes | An instance of `axios-mock-adapter` |
| payload | Yes | The graphql request payload |
| responseData | No | A response to return, if you want one. This should conform to the `GraphQLQueryResponse` type |
| overrideUri | No | By default, all requests are sent to `/graphql`. If a different URI is used, pass it here. |

NOTE: This feature depends on a custom Jest matcher provided by a library. Install this library with:

```
yarn add --dev @craigmiller160/jest-matchers-common
```

Then in your test setup file, add this line:

```
import '@craigmiller160/jest-matchers-common';
```
