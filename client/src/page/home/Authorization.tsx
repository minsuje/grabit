import axios from 'axios';
import { Navigate } from 'react-router-dom';

// 사용자 인증 상태 확인
const isAuthenticated = () => {
    const token = sessionStorage.getItem('jwtToken');
    return !!token; // token이 있으면 true, 없으면 false 반환
};

// API 요청 예시
const fetchData = async () => {
    const token = sessionStorage.getItem('jwtToken');
    try {
        const response = await axios.get('/api/protected-route', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        // 데이터 처리
    } catch (error) {
        // 에러 처리
    }
};

// 로그아웃 함수
const logout = () => {
    sessionStorage.removeItem('jwtToken');
    // 로그인 페이지로 리다이렉트
    Navigate('/login');
};
