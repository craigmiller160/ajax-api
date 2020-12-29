import { AxiosInstance, AxiosResponse } from 'axios';
import { RequestConfig } from './types';

export const get = <R>(instance: AxiosInstance, handleError?: (error: Error) => void) =>
    (req: RequestConfig): Promise<AxiosResponse<R>> =>
        instance.get<R>(req.uri, req.config)
            .catch((ex: Error) => {
                if (!req.suppressError?.(ex)) {
                    handleError?.(ex);
                }
                throw ex; // TODO make sure this fully propagates the error
            });
