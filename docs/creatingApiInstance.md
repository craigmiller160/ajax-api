# Creating API Instance

The first thing to do is to create an API instance to work with. `axios` provides the ability to generate individual, customized instances of its client. This is handled via the `createApi` function exported from this library.

```
import { createApi, AjaxApi } from '@craigmiller160/ajax-api';

const defaultApi: AjaxApi = createApi();

const apiWithOptions: AjaxApi = createApi({
    // Options
});
```

## ApiConfig options

The options for `createApi` can be found in the `ApiConfig` type. All options are optional, if none are provided defaults are set.

```
import { AxiosError } from 'axios';

export interface ApiConfig {
    baseURL?: string;
    useCsrf?: boolean;
    defaultErrorHandler?: <R>(status: number, error: Error | AxiosError<R>, requestMessage?: string) => void;
}
```

| Option | Default | Description |
|--------|---------|-------------|
| baseURL | `'/'` | The base URL, or prefix, to put before any URI in the request methods. Can be a full domain name + URI or just a URI. |
| useCsrf | `false` | Enables the CSRF synchronizer token handling, if set to `true`. See the CSRF section for more details on what this does. |
| defaultErrorHandler | `undefined` | A function that is called for any API error that occurs. See the section on error handling for more details. |
