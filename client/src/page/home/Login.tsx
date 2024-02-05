import axios from '@/api/axios';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setIsLoggedIn, setUserid_num, setNickname, setAccessToken, setRefreshToken } from '@/store/loginSlice';
// import { Cookies } from 'react-cookie';
import { setHeaderInfo } from '@/store/headerSlice';

export default function Login() {
  // const cookies = new Cookies();
  const [userid, setUserid] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setHeaderInfo({ title: '로그인', backPath: '/' }));
  }, [dispatch]);

  // const handleLogin = async () => {
  //     try {
  //         const response = await axios.post('/login', { userid, password });
  //         console.log('로그인 성공:>>>>>', response);

  //         // JWT 토큰 response.data 저장
  //         const token = response.data;
  //         if (response.data === 'noPassword' || response.data === 'none') {
  //             setErrorMessage('유효하지 않은 사용자 정보입니다.');
  //         } else {
  //             // 다른 로그인 실패 조건 처리
  //             setErrorMessage('로그인에 실패했습니다.');
  //             sessionStorage.setItem('sessionToken', token); // 세션 스토리지에 저장
  //             navigate('/main');
  //         }
  //     } catch (error) {
  //         console.error('로그인 실패:', error);
  //         setErrorMessage('로그인 시스템에 오류가 발생했습니다.');
  //     }
  // };

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        'http://52.79.228.200:3000/login',
        { userid, password },
        { headers: { 'Content-Type': 'application/json' }, withCredentials: true },
      );

      console.log('로그인 성공:>>>>>', response.data);

      navigate('/main');

      if (response.data === 'false' || response.data.none === 'none') {
        setErrorMessage('유효하지 않은 사용자 정보입니다.');
      } else {
        setErrorMessage('로그인에 성공했습니다.');

        const { nickname, userid_num, accessToken, refreshToken, login_type } = response.data;

        // console.log('cookies get accessToken', cookies.get('accessToken'));

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('nickname', nickname);
        localStorage.setItem('userid_num', userid_num);
        localStorage.setItem('login_type', login_type);

        console.log('🚀 ~ handleLogin ~ userid_num:', userid_num);
        console.log('🚀 ~ handleLogin ~ nickname:', nickname);
        console.log('🚀 ~ handleLogin ~ refreshToken:', refreshToken);
        console.log('🚀 ~ handleLogin ~ accessToken:', accessToken);

        dispatch(setIsLoggedIn(true));
        dispatch(setNickname(nickname));
        dispatch(setUserid_num(userid_num));
        dispatch(setAccessToken(accessToken));
        dispatch(setRefreshToken(refreshToken));

        navigate('/main');
      }
    } catch (error) {
      console.error('로그인 실패:', error);
      setErrorMessage('유효하지 않은 사용자 정보입니다.');
    }
  };

  return (
    <div className="flex justify-center">
      <div className="mt-20 flex w-full flex-col items-center justify-center">
        <h1 className="w-full">로그인</h1>
        <div className="mt-10 flex w-full max-w-sm flex-col items-center gap-4">
          <Label className="flex w-full" htmlFor="username">
            아이디
          </Label>
          <Input
            type="text"
            id="username"
            placeholder="아이디"
            className="flex"
            value={userid}
            onChange={(e) => setUserid(e.target.value)}
          />
        </div>
        <div className="mt-10 flex w-full max-w-sm flex-col items-center gap-4">
          <Label className="flex w-full" htmlFor="password">
            비밀번호
          </Label>
          <Input
            type="password"
            id="password"
            placeholder="비밀번호"
            className="flex"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errorMessage && <p className="text-xs text-red-500">{errorMessage}</p>}
        </div>
        <br />
        <Button variant="default" className="w-full max-w-sm" onClick={handleLogin} disabled={!userid || !password}>
          로그인
        </Button>
      </div>
    </div>
  );
}
