import axios, { AxiosInstance } from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

const SERVER_ADDRESS: string = import.meta.env.VITE_AWS_EC2_URL;

export const customAxios: AxiosInstance = axios.create({
  baseURL: `${SERVER_ADDRESS}`,
});

customAxios.interceptors.request.use((config) => {
  const { refreshToken } = useSelector((state: RootState) => state.login);
  if (refreshToken) {
    config.headers.Authorization = `Bearer ${refreshToken}`;
  }
  return config;
});
