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
export interface ApiConfig {
    baseURL?: string;
    useCsrf?: boolean;
    defaultErrorHandler?: DefaultErrorHandler;
}
```

`baseURL` = 
