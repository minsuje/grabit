// KakaoLogin.js

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function KakaoAuth() {
  const navigate = useNavigate();
  const [accessTokenFetching, setAccessTokenFetching] = useState(false);

  // Access Token 받아오기
  const getAccessToken = async () => {
    if (accessTokenFetching) return; // Return early if fetching

    console.log('getAccessToken 호출');

    try {
      setAccessTokenFetching(true); // Set fetching to true

      const response = await axios.post('http://localhost:3000/auth/kakao/login', {
        withCredentials: true,
      });
      const accessToken = response.data.accessToken;
      console.log('accessToken:', accessToken);

      setAccessTokenFetching(false); // Reset fetching to false
      navigate('/');
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
