import { Button } from '@/components/ui/button';
import Lottie from 'lottie-react';
import rabbit from './Animation - 1705488595485.json';
import { Link } from 'react-router-dom';

export function Home() {
    const Rabbit = () => {
        return <Lottie animationData={rabbit} width={0} height={0} />;
    };
    return (
        <div className="flex flex-col h-screen justify-center items-center">
            <div className=" text-6xl">Grabit</div>

            <div className="max-w-md max-h-md">
                <Rabbit />
            </div>

            <div className="flex flex-col ">
                <Button variant="default">로그인</Button>
                <Link to="/register" className="mt-[5%] ">
                    <Button variant="default">회원가입</Button>
                </Link>
            </div>
        </div>
    );
}
