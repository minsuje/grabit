import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { setIsLoggedIn, setUsername, setUserId } from '@/store/loginSlice';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { LuChevronLeft } from 'react-icons/lu';
import { useEffect, useState } from 'react';

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state: RootState) => state.login);
  const { title, backPath } = useSelector((state: RootState) => state.header);

  const [scrollPosition, setScrollPosition] = useState(0);
  const updateScroll = () => {
    setScrollPosition(window.scrollY || document.documentElement.scrollTop);
  };
  useEffect(() => {
    window.addEventListener('scroll', updateScroll);
  });

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
