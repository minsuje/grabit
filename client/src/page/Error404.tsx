import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setHeaderInfo } from '@/store/headerSlice';

function Error404() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setHeaderInfo({ title: '404', backPath: -1 }));
  }, [dispatch]);

  return (
    <div>
      <h1 className="flex">404</h1>
      <p>존재하지 않는 페이지입니다</p>
      <Link to={'/main'}>
        <Button>홈으로</Button>
      </Link>
    </div>
  );
}

export default Error404;
