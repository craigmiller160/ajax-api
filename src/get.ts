import { AxiosInstance, AxiosResponse } from 'axios';
import { RequestConfig } from './types';

export const get = <R>(instance: AxiosInstance, handleError: (error: Error) => void) => (req: RequestConfig) =>
    instance.get<R>(req.uri, req.config)
        .catch((ex: Error) => {
            handleError(ex);
            throw ex;
        });