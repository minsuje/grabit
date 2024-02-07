// KakaoLogin.js

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '@/api/axios';

function KakaoAuth() {
  const navigate = useNavigate();
  const [accessTokenFetching, setAccessTokenFetching] = useState(false);

  // Access Token 받아오기
  const getAccessToken = async () => {
    if (accessTokenFetching) return; // Return early if fetching

    try {
      setAccessTokenFetching(true); // Set fetching to true

      const response = await axios.get('/auth/kakao/redirect', {
        withCredentials: true,
      });

      const { accessToken, refreshToken, nickname, userid_num, login_type } = response.data;

      localStorage.setItem('accessToken', accessToken), localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('nickname', nickname);
      localStorage.setItem('userid_num', userid_num);
      localStorage.setItem('login_type', login_type);

      setAccessTokenFetching(false); // Reset fetching to false

      navigate('/main');
    } catch (error) {
      console.error('Error:', error);
      setAccessTokenFetching(false); // Reset fetching even in case of error
    }
  };

  useEffect(() => {
    getAccessToken();
  }, []);

  return <div>Loading...</div>;
}

export default KakaoAuth;
