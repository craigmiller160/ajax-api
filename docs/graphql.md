# GraphQL

A special method is provided for making GraphQL requests. This method adds the following special behavior:

1. Defaults the URI to `/graphql`.
1. Sets the `content-type` to `application/graphql`.
1. Automatically checks the GraphQL response for errors.

## Making a Request

```
import { AxiosResponse } from 'axios';

const graphqlResponse: Promise<AxiosResponse<GraphQLQueryResponse<ResponseType>> = 
    api.graphql<ResponseType>({
        payload: `
            query: {
                clients: {
                    id
                    name
                }
            }
        `
        // Other Options 
    });
```

GraphQL requests take the following arguments:

| Argument | Required | Description |
|----------|----------|-------------|
| `payload` | Yes | The GraphQL query to be executed. |
| `overrideUri` | No | If the URI for the GraphQL request is not `/graphql`, provide a different one here. |
| `config` | No | The `AxiosRequestConfig`. HTTP headers and other options can be configured here. |
| `errorMsg` | No | If a `defaultErrorHandler` was set, this message will be passed to it if an error occurs. |
| `suppressError` | No | If a `defaultErrorHandler` was set, this function can override its behavior and prevent it from being called. See the docs on Error Handling for more details. |

## Error Handling

If the `errors` array in the GraphQL response is populated, a `GraphQLError` will be thrown. This error will contain a special error message built out of the error array, as well as the full HTTP response that was returned.

This error can be handled either by the default error handler or by the `catch` of the promise returned from the graphql method.
