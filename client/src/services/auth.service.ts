import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { LoginRequest } from '@/types/types';

export const authAPI = createApi({
  reducerPath: 'authAPI',
  tagTypes: ['Post'],
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000/auth/',
  }),
  endpoints: (build) => ({
    login: build.mutation<unknown, LoginRequest>({
      query: ({ userid, password }) => ({
        url: `login`,
        method: 'POST',
        body: { userid, password },
      }),
    }),
  }),
});

export const { useLoginMutation } = authAPI;
