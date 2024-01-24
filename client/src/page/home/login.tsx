import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Cookies } from 'react-cookie';

export function Login() {

    const cookies = new Cookies();
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
            const response = await axios.post('http://localhost:3000/login',  { userid, password }, 
            {headers:{ 'Content-Type':'application/json'},
            withCredentials: true});
            console.log('로그인 성공:>>>>>', response);
            console.log('로그인 성공:>>>>>', response.data);

            // JWT 토큰 response.data 저장
            const token = response.data;
            if (response.data === 'noPassword' || response.data === 'none') {
                setErrorMessage('유효하지 않은 사용자 정보입니다.');
            } else {
                setErrorMessage('로그인에 성공했습니다.');
                // // sessionStorage.setItem('sessionToken', token); // 세션 스토리지에 저장
                // navigate('/main');
            }
        } catch (error) {
            console.error('로그인 실패:', error);
            setErrorMessage('로그인 시스템에 오류가 발생했습니다.');
        }
    };

    return (
        <>
            <div className="grid w-full max-w-sm items-center gap-1.5  mt-10">
                <Label htmlFor="username">아이디</Label>
                <Input
                    type="text"
                    id="username"
                    placeholder="아이디"
                    value={userid}
                    onChange={(e) => setUserid(e.target.value)}
                />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5  mt-10">
                <Label htmlFor="password">비밀번호</Label>
                <Input
                    type="password"
                    id="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {errorMessage && <p className="text-red-500 text-xs">{errorMessage}</p>}
            </div>

            <Button variant="default" className="w-full" onClick={handleLogin} disabled={!userid || !password}>
                로그인
            </Button>
            <Link to="/main" className="mb-[5%]"></Link>
        </>
    );
}
