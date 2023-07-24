import axios, {
	AxiosInstance,
	AxiosResponse,
	InternalAxiosRequestConfig
} from 'axios';
import CsrfError from '../errors/CsrfError';
import { CSRF_HEADER, CSRF_METHODS } from '../utils/csrfConstants';

const createCsrfHandlingInterceptor =
	(instance: AxiosInstance) =>
	async (
		config: InternalAxiosRequestConfig
	): Promise<InternalAxiosRequestConfig> => {
		if (CSRF_METHODS.includes(config.method ?? '')) {
			return instance
				.options(config.url ?? '', {
					headers: {
						[CSRF_HEADER]: 'fetch'
					}
				})
				.then((res: AxiosResponse) => {
					const newConfig: InternalAxiosRequestConfig = { ...config };
					newConfig.headers[CSRF_HEADER] = res.headers[CSRF_HEADER];
					return config;
				})
				.catch((ex) => {
					throw new CsrfError('Request failed preflight', ex);
				});
		}
		return config;
	};

export const createInstance = (
	baseURL: string,
	useCsrf: boolean
): AxiosInstance => {
	const instance: AxiosInstance = axios.create({
		baseURL,
		withCredentials: true
	});

	if (useCsrf) {
		instance.interceptors.request.use(
			createCsrfHandlingInterceptor(instance),
			(error) => Promise.reject(error)
		);
	}

	return instance;
};
