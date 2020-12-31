import { AxiosInstance, AxiosResponse } from 'axios';
import { RequestConfig } from '../types';
import { ErrorHandler } from '../core/errorHandling';

export const get = <R>(instance: AxiosInstance, handleError?: ErrorHandler) =>
    (req: RequestConfig): Promise<AxiosResponse<R>> =>
        instance.get<R>(req.uri, req.config)
            .catch((ex: Error) => {
                handleError?.(ex, req);
                throw ex;
            });
