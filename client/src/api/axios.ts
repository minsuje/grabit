import axios from 'axios';

const privateApi = axios.create({
  baseURL: import.meta.env.VITE_AWS_EC2_URL,
});

privateApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default axios.create({
  baseURL: import.meta.env.VITE_AWS_EC2_URL,
});

export { privateApi };

// //리프레시토큰 요청 api
// function postRefreshToken() {
//   const response = axios.post('/refresh', {
//     refreshToken: localStorage.getItem('refreshToken'),
//   });
//   return response;
// }

// //리프레시 토큰 구현
// privateApi.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async (error) => {
//     const {
//       config,
//       response: { status },
//     } = error;

//     if (status === 401) {
//       if (error.response.data.message === 'Unauthorized') {
//         const originRequest = config;
//         try {
//           const tokenResponse = await postRefreshToken();
//           if (tokenResponse.status === 201) {
//             const newAccessToken = tokenResponse.data.accessToken;
//             localStorage.setItem('accessToken', tokenResponse.data.accessToken);
//             localStorage.setItem('refreshToken', tokenResponse.data.refreshToken);
//             axios.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
//             originRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//             return axios(originRequest);
//           }
//         } catch (error) {
//           if (axios.isAxiosError(error)) {
//             if (error.response?.status === 404 || error.response?.status === 422) {
//               window.location.replace('/sign-in');
//             } else {
//             }
//           }
//         }
//       }
//     }
//     return Promise.reject(error);
//   },
// );
