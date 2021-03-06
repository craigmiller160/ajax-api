import { AxiosInstance, AxiosResponse } from 'axios';
import { ErrorHandler } from '../core/errorHandling';
import { UriBodyRequestConfig } from '../types';

export const post = (instance: AxiosInstance, handleError?: ErrorHandler) =>
    <B, R>(req: UriBodyRequestConfig<B>): Promise<AxiosResponse<R>> =>
        instance.post<R>(req.uri, req.body, req.config)
            .catch((ex: Error) => {
                handleError?.(ex, req);
                throw ex;
            });
