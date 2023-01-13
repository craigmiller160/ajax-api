# Making Requests

With an `AjaxApi` instance, any HTTP request can be made.

## HTTP GET & HTTP DELETE

```
import { AxiosResponse } from 'axios';

const getResponsePromise: Promise<AxiosResponse<ResponseDataType>> = 
    api.get<ResponseDataType>({
        uri: '/foo/bar'
        // Other Options
    });

const deleteResponsePromise: Promise<AxiosResponse<ResponseDataType>> = 
    api.delete<ResponseDataType>({
        uri: '/foo/bar'
        // Other Options
    });
```

The HTTP GET/DELETE take the same set of arguments.

| Argument | Required | Description |
|----------|----------|-------------|
| `uri` | Yes | The URI of the request. Either a partial URI or a full URL. If a `baseURL` was set, this will be appended after it. |
| `config` | No | The `AxiosRequestConfig`. HTTP headers and other options can be configured here. |
| `errorMsg` | No | If a `defaultErrorHandler` was set, this message will be passed to it if an error occurs. |
| `suppressError` | No | If a `defaultErrorHandler` was set, this function can override its behavior and prevent it from being called. See the docs on Error Handling for more details. |

## HTTP POST & HTTP PUT

```
import { AxiosResponse } from 'axios';

const body = {
    abc: 'def'
};
type BodyType = typeof body;

const postResponsePromise: Promise<AxiosResponse<ResponseDataType>> = 
    api.post<BodyType,ResponseDataType>({
        uri: '/foo/bar',
        body
        // Other Options
    });

const putResponsePromise: Promise<AxiosResponse<ResponseDataType>> = 
    api.put<BodyType,ResponseDataType>({
        uri: '/foo/bar',
        body
        // Other Options
    });
```

The HTTP POST/PUT take the same set of arguments:

| Argument | Required | Description |
|----------|----------|-------------|
| `uri` | Yes | The URI of the request. Either a partial URI or a full URL. If a `baseURL` was set, this will be appended after it. |
| `body` | No | The request body. By default this will handle a JSON payload and set the `content-type` to `application/json`. Other body types will require header customization. |
| `config` | No | The `AxiosRequestConfig`. HTTP headers and other options can be configured here. |
| `errorMsg` | No | If a `defaultErrorHandler` was set, this message will be passed to it if an error occurs. |
| `suppressError` | No | If a `defaultErrorHandler` was set, this function can override its behavior and prevent it from being called. See the docs on Error Handling for more details. |

## Bearer Tokens

By default, ajaxApi will check `localStorage` for a property called `craigmiller160AjaxApiBearerToken`. If one is present, it will be set as the `Authorization` header.