import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { setIsLoggedIn, setUserid_num, setAccessToken, setNickname, setRefreshToken } from '@/store/loginSlice';
import { Button } from './ui/button';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { LuChevronLeft, LuMenu } from 'react-icons/lu';
import { useEffect, useState } from 'react';

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state: RootState) => state.login);
  const { title, backPath } = useSelector((state: RootState) => state.header);
  const accessToken = localStorage.getItem('accessToken');
  const [scrollPosition, setScrollPosition] = useState(0);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const { pathname } = useLocation();

  const updateScroll = () => {
    setScrollPosition(window.scrollY || document.documentElement.scrollTop);
  };

  useEffect(() => {
    window.addEventListener('scroll', updateScroll);
  });

  function handleLogout() {
    console.log('로그아웃');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('nickname');
    localStorage.removeItem('userid_num');
    localStorage.removeItem('isLoggedIn');
    dispatch(setIsLoggedIn(false));
    dispatch(setUserid_num(0));
    dispatch(setNickname(''));
    dispatch(setAccessToken(''));
    dispatch(setRefreshToken(''));
    navigate('/');
  }

  function handleLogin() {
    console.log('로그인');
    navigate('/login');
  }

  function handleMenu() {
    setMenuOpen(!menuOpen);
  }

  // useEffect(() => {
  //   setMenuOpen(false);
  // }, [pathname]);

  return menuOpen ? (
    <div className="flex flex-col transition-all">
      <header className="fixed left-0 right-0 top-0 z-[999] flex items-center justify-end bg-white px-4 py-3 transition-all">
        <div onClick={handleMenu} className="flex p-2">
          <LuMenu size={28} />
        </div>
      </header>
      {accessToken ? (
        <div className="fixed z-[901] mt-16 flex w-full flex-col items-center justify-center gap-3 bg-white p-6">
          <Link to={`/main`} onClick={handleMenu}>
            <Button>홈</Button>
          </Link>
          <Link to={`/mypage`} onClick={handleMenu}>
            <Button>마이페이지</Button>
          </Link>
          <Button onClick={handleLogout} className="flex">
            로그아웃
          </Button>
        </div>
      ) : (
        <Button onClick={handleLogin}>로그인</Button>
      )}

      <div className="fixed z-[900] h-screen w-full bg-black/50 backdrop-blur-md" onClick={handleMenu}></div>
    </div>
  ) : (
    <div className="flex flex-col transition-all">
      <header
        className={
          scrollPosition > 50
            ? `fixed left-0 right-0 top-0 z-[999] flex items-center ${title === '홈' ? `justify-end` : `justify-between`} bg-grabit-50/50 px-4 py-3 backdrop-blur-md`
            : `fixed left-0 right-0 top-0 z-[999] flex items-center ${title === '홈' ? `justify-end` : `justify-between`} bg-grabit-50 px-4 py-3`
        }
      >
        {title === '홈' ? null : (
          <div onClick={() => navigate(backPath)} className="flex p-2">
            <LuChevronLeft size={28} />
          </div>
        )}

        {scrollPosition > 50 ? (
          <h1 className="absolute left-0 right-0 z-[-1] w-full text-center text-lg text-grabit-700 transition-all">
            {title === '홈' ? null : title}
          </h1>
        ) : null}

        <div onClick={handleMenu} className="flex p-2">
          <LuMenu size={28} />
        </div>
      </header>
    </div>
  );
}

export default Header;

{
  /* 
      {accessToken ? (
        <div className="flex items-center gap-3 ">
          <Button onClick={handleLogout}>로그아웃</Button>
        </div>
      ) : (
        <Button onClick={handleLogin}>로그인</Button>
      )} */
}
