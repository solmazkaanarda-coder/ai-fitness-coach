import Constants from 'expo-constants';
import { API_BASE_URL } from '../../constants/appConfig';

const DEFAULT_BACKEND_HOST = '192.168.1.3';
const BACKEND_PORT = 8000;

export const getBackendUrl = (): string => {
  const debuggerHost = (Constants.manifest as any)?.debuggerHost || (Constants.expoConfig as any)?.debuggerHost;
  if (debuggerHost) {
    const host = debuggerHost.split(':')[0];
    if (host && host !== 'localhost' && host !== '127.0.0.1') {
      console.log(`[API CONFIG] Using debugger host as backend host: ${host}`);
      return `http://${host}:${BACKEND_PORT}`;
    }
  }

  console.log(`[API CONFIG] Using fallback backend host: ${DEFAULT_BACKEND_HOST}`);
  return API_BASE_URL;
};

const handleResponse = async (res: Response) => {
  if (!res.ok) {
    const text = await res.text();
    let message = text;
    try {
      const data = JSON.parse(text);
      message = data?.message || JSON.stringify(data);
    } catch (e) {
      // keep raw text
    }
    throw new Error(`${res.status} ${res.statusText}: ${message}`);
  }
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) return res.json();
  return res.text();
};

export const get = async <T = any>(endpoint: string, signal?: AbortSignal): Promise<T> => {
  const url = `${getBackendUrl()}${endpoint}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    signal,
  });
  return handleResponse(res);
};

export const post = async <T = any>(endpoint: string, body?: any, signal?: AbortSignal): Promise<T> => {
  const url = `${getBackendUrl()}${endpoint}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
    signal,
  });
  return handleResponse(res);
};

export default { get, post, getBackendUrl };
