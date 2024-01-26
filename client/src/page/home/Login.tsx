import axios from 'axios';
import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import HeaderTitle from '@/components/HeaderTitle';

export default function Login() {
  // const cookies = new Cookies();
  const [userid, setUserid] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const navigate = useNavigate();

  // const handleLogin = async () => {
  //     try {
  //         const response = await axios.post('http://localhost:3000/login', { userid, password });
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
        'http://localhost:3000/login',
        { userid, password },
        { headers: { 'Content-Type': 'application/json' }, withCredentials: true },
      );

      console.log('로그인 성공:>>>>>', response);
      console.log('로그인 성공:>>>>>', response.data);

      // JWT 토큰 response.data 저장
      // const token = response.data;
      if (response.data === 'noPassword' || response.data === 'none') {
        setErrorMessage('유효하지 않은 사용자 정보입니다.');
      } else {
        setErrorMessage('로그인에 성공했습니다.');
        // // sessionStorage.setItem('sessionToken', token); // 세션 스토리지에 저장
        navigate('/main');
      }
    } catch (error) {
      console.error('로그인 실패:', error);
      setErrorMessage('로그인 시스템에 오류가 발생했습니다.');
    }
  };

  return (
    <div className="container flex justify-center">
      <HeaderTitle />
      <div className="container mt-20 flex flex-col items-center justify-center">
        <h1>로그인</h1>
        <div className="mt-10 flex grid w-full max-w-sm items-center gap-2 ">
          <Label className="flex" htmlFor="username">
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
        <div className="mt-10 flex grid w-full max-w-sm items-center gap-2">
          <Label className="flex" htmlFor="password">
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
