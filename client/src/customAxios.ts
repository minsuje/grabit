import axios, { AxiosInstance } from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

const SERVER_ADDRESS: string = 'http://localhost:3000';

export const customAxios: AxiosInstance = axios.create({
  baseURL: `${SERVER_ADDRESS}`,
});

customAxios.interceptors.request.use((config) => {
  const { refreshToken } = useSelector((state: RootState) => state.login);
  console.log('refreshToken: ', refreshToken);
  if (refreshToken) {
    config.headers.Authorization = `Bearer ${refreshToken}`;
  }
  return config;
});
