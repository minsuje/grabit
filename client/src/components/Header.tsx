import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { setIsLoggedIn, setUsername, setUserId } from '@/store/loginSlice';
import { Button } from './ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { LuChevronLeft } from 'react-icons/lu';
import { useEffect, useState } from 'react';
import axios from 'axios';

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoggedIn, loginToken, refreshToken } = useSelector((state: RootState) => state.login);
  const { title, backPath } = useSelector((state: RootState) => state.header);

  const [scrollPosition, setScrollPosition] = useState(0);
  const updateScroll = () => {
    setScrollPosition(window.scrollY || document.documentElement.scrollTop);
  };
  useEffect(() => {
    window.addEventListener('scroll', updateScroll);
  });

  // useEffect(() => {
  //   refreshAccessToken();
  //   async function refreshAccessToken() {
  //     console.log('loginToken', loginToken);
  //     console.log('refreshToken', refreshToken);
  //     await axios
  //       .get('/refresh', { withCredentials: true, headers: { Authorization: `Bearer ${loginToken}` } })
  //       .then((response) => {
  //         console.log('Refresh token success', response);
  //         console.log(location);

  //         // const newAccessToken = response.data.accessToken;
  //         // axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
  //       })
  //       .catch((error) => {
  //         console.error('Refresh token error', error);
  //       });
  //   }
  // }, [location, refreshToken, loginToken]);

  function handleLogout() {
    console.log('로그아웃');
    dispatch(setIsLoggedIn(false));
    dispatch(setUsername(''));
    dispatch(setUserId(0));
    navigate('/');
  }

  function handleLogin() {
    console.log('로그인');
    dispatch(setIsLoggedIn(true));
    dispatch(setUsername('홍길동'));
    dispatch(setUserId(1));
    navigate('/main');
  }

  return (
    <header
      className={
        scrollPosition > 50
          ? 'fixed left-0 right-0 top-0 z-[999] flex items-center justify-between bg-white/50 px-4 py-3 backdrop-blur-md transition-all'
          : 'fixed left-0 right-0 top-0 z-[999] flex items-center justify-between bg-white px-4 py-3 transition-all'
      }
    >
      <div onClick={() => navigate(backPath)} className="flex p-2">
        <LuChevronLeft size={28} />
      </div>

      {scrollPosition > 50 ? (
        <h1 className="absolute left-0 right-0 z-[-1] w-full text-center text-lg text-stone-700 transition-all">
          {title}
        </h1>
      ) : null}

      {isLoggedIn ? (
        <div className="flex items-center gap-3 ">
          <Button onClick={handleLogout}>로그아웃</Button>
        </div>
      ) : (
        <Button onClick={handleLogin}>로그인</Button>
      )}
    </header>
  );
}

export default Header;
