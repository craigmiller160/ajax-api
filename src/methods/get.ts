import { AxiosInstance, AxiosResponse } from 'axios';
import { RequestConfig } from '../types';
import { ErrorHandler } from '../core/errorHandling';

export const get = (instance: AxiosInstance, handleError?: ErrorHandler) =>
    <R>(req: RequestConfig): Promise<AxiosResponse<R>> =>
        instance.get<R>(req.uri, req.config)
            .catch((ex: Error) => {
                handleError?.(ex, req);
                throw ex;
            });
