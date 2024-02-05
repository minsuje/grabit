import axios from '@/api/axios';
// import { Cookies } from "react-cookie";
import { useNavigate } from 'react-router-dom';

// const cookies = new Cookies();
function TestKakao() {
  const navigate = useNavigate();
  console.log('아니 들어오긴 함?');

  // const getCookie = (name: string) => {
  //     console.log("쿠키!!! > ", cookies.get(name))
  //     return cookies.get(name)
  // }
  try {
    // setAccessTokenFetching(true); // Set fetching to true
    console.log('들어오긴 함?');

    const response = axios.get('http://localhost:3000/auth/kakao', {
      withCredentials: true,
    });
    console.log('response:', response);
    const accessToken = response;
    console.log('accessToken:', accessToken);

    // setAccessTokenFetching(false); // Reset fetching to false
    navigate('/');
  } catch (error) {
    console.error('Error:', error);
    // setAccessTokenFetching(false); // Reset fetching even in case of error
  }

  return (
    <>
      <h1>test</h1>
    </>
  );
}

export default TestKakao;
