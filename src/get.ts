import { AxiosInstance, AxiosResponse } from 'axios';
import { RequestConfig } from './types';
import { handleError } from './utils';

export const get = <R>(instance: AxiosInstance, req: RequestConfig) =>
    instance.get<R>(req.uri, req.config)
        .catch((ex: Error) => {
            handleError(ex);
            throw ex;
        });