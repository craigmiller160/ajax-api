import { AxiosInstance, AxiosResponse } from 'axios';
import { RequestConfig } from '../types';
import { ErrorHandler } from '../core/errorHandling';

export const get = <R>(instance: AxiosInstance, handleError?: ErrorHandler) =>
    (req: RequestConfig): Promise<AxiosResponse<R>> =>
        instance.get<R>(req.uri, req.config)
            .catch((ex: Error) => { // TODO this catch block is going to be the same for all requests... make it generic and shared
                if (!req.suppressError?.(ex)) {
                    handleError?.(ex, req);
                }
                throw ex; // TODO make sure this fully propagates the error
            });
