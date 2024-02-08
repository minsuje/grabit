import { Button } from '@/components/ui/button';
// import Lottie from 'lottie-react';
// import rabbit from './Animation - 1705488595485.json';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
// import { setIsLoggedIn } from '@/store/loginSlice';
// import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { setHeaderInfo } from '@/store/headerSlice';

export default function Home() {
  const REST_API_KEY = import.meta.env.VITE_REST_API_KEY;
  const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;

  // const Rabbit = () => {
  //   return <Lottie animationData={rabbit} width={0} height={0} />;
  // };

  const dispatch = useDispatch();
  // const navigate = useNavigate();

  useEffect(() => {
    dispatch(setHeaderInfo({ title: '', backPath: '/' }));
  }, [dispatch]);

  // function handleLogin() {
  //   dispatch(setIsLoggedIn(true));
  //   localStorage.setItem('isLoggedIn', 'true');
  //   navigate('/main');
  // }

  return (
    <div className="flex w-screen flex-col items-center justify-center">
      <div className="relative flex max-w-md flex-col items-center justify-center gap-4 text-center">
        {/* <div className="flex w-40">
          <Rabbit />
        </div> */}
        <div className="flex min-h-screen w-screen -translate-y-20 items-center justify-center">
          <img src="/grabit_logo.svg" alt="" width={160} />
        </div>
        {/* <Button onClick={handleLogin}>임시 로그인</Button> */}
        <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-4 p-8">
          <Link to="/login" className="">
            <Button variant="default" className="w-full">
              로그인
            </Button>
          </Link>
          <Link to="/register/normal" className=" ">
            <Button variant="default" className="w-full">
              회원가입
            </Button>
          </Link>
          {/* <Link
            to={`https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`}
          >
            카카오회원가입
          </Link>
          <a
            href={`https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`}
          >
            a 태그 카카오
          </a> */}
          {/* <a
            href={`https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`}
          > */}
          <Link
            to={`https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`}
          >
            <Button variant="default" className="flex w-full gap-2 bg-[#FEE500] text-[#191919] hover:bg-[#fff40d]">
              <img src="/kakao.svg" alt="" width={18} />
              <span>카카오 로그인</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
