import { AxiosInstance, AxiosResponse } from 'axios';
import { ErrorHandler } from '../core/errorHandling';
import { RequestConfig } from '../types';

export const doDelete = (instance: AxiosInstance, handleError?: ErrorHandler) =>
    <R>(req: RequestConfig): Promise<AxiosResponse<R>> =>
        instance.delete<R>(req.uri, req.config)
            .catch((ex: Error) => {
                handleError?.(ex, req);
                throw ex;
            });
