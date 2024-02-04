import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { setIsLoggedIn, setUserid_num, setAccessToken, setNickname, setRefreshToken } from '@/store/loginSlice';
import { Button } from './ui/button';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { LuChevronLeft, LuMenu } from 'react-icons/lu';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state: RootState) => state.login);
  const { title, backPath } = useSelector((state: RootState) => state.header);
  const accessToken = localStorage.getItem('accessToken');
  const [scrollPosition, setScrollPosition] = useState(0);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

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

  return (
    <header className="flex flex-col transition-all">
      {menuOpen ? (
        <div className={`fixed left-0 right-0 top-0 z-[999] flex items-center justify-end bg-white px-4 py-3`}>
          <div onClick={handleMenu} className="flex p-2">
            <LuMenu size={28} />
          </div>
        </div>
      ) : (
        <div
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
        </div>
      )}
      <AnimatePresence>
        {menuOpen ? (
          <div>
            <motion.div
              className="fixed top-16 z-[998] flex h-fit w-full flex-col gap-2 bg-white p-8"
              key="menu"
              initial={{ opacity: 0, y: -200 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -200 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <Link
                to={`/main`}
                onClick={handleMenu}
                className="flex py-2 text-lg font-medium text-stone-600 no-underline"
              >
                <span>홈</span>
              </Link>
              <Link
                to={`/mypage`}
                onClick={handleMenu}
                className="flex py-2 text-lg font-medium text-stone-600 no-underline"
              >
                <span>마이페이지</span>
              </Link>
              <div onClick={handleLogout} className="flex w-fit py-2 text-lg font-medium text-stone-600 no-underline">
                <span>로그아웃</span>
              </div>
            </motion.div>
            <motion.div
              className="fixed top-16 z-[997] h-screen w-full bg-black/80 backdrop-blur-md"
              onClick={handleMenu}
              key="menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            ></motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </header>
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
