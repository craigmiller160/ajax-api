# Testing

When writing tests, it is common to use the `axios-mock-adapter` library. The `AjaxApi` supports this, however the `AxiosInstance` it wraps around is what must be passed to the mock adapter.

```
import ajaxApiInstance from './path/to/api';
import MockAdapter from 'axios-mock-adapter';

const mockApi = new MockAdapter(ajaxApiIntance.instance);
```
