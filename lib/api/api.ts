import axios, { type AxiosInstance } from 'axios';

//===========================================================================

const DEFAULT_CAMPERS_API_URL = 'https://campers-api.goit.study';

const CAMPERS_API_URL = process.env.CAMPERS_API_URL || DEFAULT_CAMPERS_API_URL;

//===========================================================================

function getAppBaseUrl() {
  if (typeof window !== 'undefined') {
    return '';
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  return 'http://localhost:3000';
}

//===========================================================================

export const campersServerApi: AxiosInstance = axios.create({
  baseURL: CAMPERS_API_URL,
  headers: {
    Accept: 'application/json',
  },
});

//===========================================================================

export const nextApi: AxiosInstance = axios.create({
  baseURL: `${getAppBaseUrl()}/api`,
  headers: {
    Accept: 'application/json',
  },
});
