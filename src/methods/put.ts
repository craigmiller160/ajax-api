import { ErrorHandler } from '../core/errorHandling';
import { AxiosInstance, AxiosResponse } from 'axios';
import { RequestBodyConfig } from '../types';

export const put = (instance: AxiosInstance, handleError?: ErrorHandler) =>
    <B,R>(req: RequestBodyConfig<B>): Promise<AxiosResponse<R>> =>
        instance.put<R>(req.uri, req.body, req.config)
            .catch((ex: Error) => {
                handleError?.(ex, req);
                throw ex;
            });
