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