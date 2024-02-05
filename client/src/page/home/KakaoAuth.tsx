// KakaoLogin.js

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { privateApi } from '@/api/axios';

function KakaoAuth() {
  const navigate = useNavigate();
  // const [accessTokenFetching, setAccessTokenFetching] = useState(false);

  // Access Token 받아오기
  const getAccessToken = async () => {
    if (accessTokenFetching) return; // Return early if fetching

    console.log('getAccessToken 호출');

    try {
      setAccessTokenFetching(true); // Set fetching to true
      

      const response = await axios.post('http://localhost:5173/auth/kakao/', {
        withCredentials: true,
      });
      console.log('response:', response);
      const accessToken = response.data;
      console.log('accessToken:', accessToken);

      setAccessTokenFetching(false); // Reset fetching to false
      navigate('/');
    } catch (error) {
      console.error('Error:', error);
      setAccessTokenFetching(false); // Reset fetching even in case of error
    }


    const response = await axios.post(`http://localhost:3000/auth/kakao`, { withCredentials: true });
  };

  // useEffect(() => {
  //   getAccessToken();
  // }, []);

  return <div>Loading...</div>;
}

export default KakaoAuth;
