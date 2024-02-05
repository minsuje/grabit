import axios from 'axios';

export default axios.create({
  baseURL: import.meta.env.VITE_AWS_EC2_URL,
});

//토큰을 함께 보내는 instance
export const privateApi = axios.create({
  baseURL: import.meta.env.VITE_AWS_EC2_URL,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
  },
});

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
//               console.log('만료되었습니다');
//               window.location.replace('/sign-in');
//             } else {
//               console.log('로그인 실패');
//             }
//           }
//         }
//       }
//     }
//     return Promise.reject(error);
//   },
// );
