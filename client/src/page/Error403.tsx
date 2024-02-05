import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setHeaderInfo } from '@/store/headerSlice';

function Error403() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setHeaderInfo({ title: '403', backPath: -1 }));
  }, [dispatch]);

  return (
    <div>
      <h1 className="flex">403</h1>
      <p>권한이 없습니다</p>
      <Link to={'/main'}>
        <Button>홈으로</Button>
      </Link>
    </div>
  );
}

export default Error403;
