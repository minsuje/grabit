import { Button } from '@/components/ui/button';
import Lottie from 'lottie-react';
import rabbit from './Animation - 1705488595485.json';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setIsLoggedIn, setUsername, setUserId } from '@/store/loginSlice';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const REST_API_KEY = import.meta.env.VITE_REST_API_KEY;
  const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
  const link = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

  const Rabbit = () => {
    return <Lottie animationData={rabbit} width={0} height={0} />;
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleLogin() {
    console.log('로그인');
    dispatch(setIsLoggedIn(true));
    dispatch(setUsername('홍길동'));
    dispatch(setUserId(1));
    navigate('/main');
  }

  return (
    <div className="flex flex-col h-screen justify-center items-center">
      <div className=" text-6xl">Grabit</div>

      <div className="max-w-md max-h-md">
        <Rabbit />
      </div>

      <div className="flex flex-col">
        <Link to="/login" className="mb-[5%]">
          <Button variant="default" className="w-[100%]">
            로그인
          </Button>
        </Link>
        <Button onClick={handleLogin}>임시 로그인</Button>
        <a href={link}>카카오 로그인</a>
        <Link to="/register/normal" className="mt-[5%] ">
          <Button variant="default" className="w-[100%]">
            회원가입
          </Button>
        </Link>
        <Link
          to={`https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`}
        >
          카카오회원가입
        </Link>
      </div>
    </div>
  );
}
