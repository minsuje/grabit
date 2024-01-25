import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { setIsLoggedIn, setUsername, setUserId } from '@/store/loginSlice';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoggedIn, username } = useSelector((state: RootState) => state.login);

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
    <header className="flex justify-between py-3 px-4">
      <h1>GRABIT</h1>
      {isLoggedIn ? (
        <div className="flex items-center gap-3 ">
          <span>{username}님</span>
          <Button onClick={handleLogout}>로그아웃</Button>
        </div>
      ) : (
        <Button onClick={handleLogin}>로그인</Button>
      )}
    </header>
  );
}

export default Header;
