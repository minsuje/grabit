import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Button } from './ui/button';
import { setIsLoggedIn, setUsername, setUserId } from '@/store/loginSlice';
import { useNavigate } from 'react-router-dom';
import { LuChevronLeft } from 'react-icons/lu';

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state: RootState) => state.login);
  const { title, backPath } = useSelector((state: RootState) => state.header);

  console.log(isLoggedIn);
  console.log(useSelector((state: RootState) => state.login));

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
    <header className="flex justify-between items-center py-3 px-4">
      <div onClick={() => navigate(backPath)} className="flex p-4">
        <LuChevronLeft size={28} />
      </div>

      <h1>{title}</h1>

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
