import axios from '@/api/axios';
// import { Cookies } from "react-cookie";
import { useNavigate } from 'react-router-dom';

// const cookies = new Cookies();
function TestKakao() {
  const navigate = useNavigate();

  // const getCookie = (name: string) => {
  //     return cookies.get(name)
  // }
  try {
    // setAccessTokenFetching(true); // Set fetching to true

    axios.get('/auth/kakao', {
      withCredentials: true,
    });

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
