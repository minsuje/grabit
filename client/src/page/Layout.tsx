import Header from '@/components/Header';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Outlet, Navigate } from 'react-router-dom';

function Layout() {
  // const { isLoggedIn } = useSelector((state: RootState) => state.login);
  // console.log(isLoggedIn);

  // const isLoggedIn = Boolean(localStorage.getItem('isLoggedIn'));
  // const isLoggedIn = true;
  const accessToken = localStorage.getItem('accessToken');
  // console.log('Layout accessToken >>>>>', accessToken);

  return accessToken ? (
    <div>
      <Header />
      <div className="container mb-40 mt-16 min-h-40 py-4">
        <Outlet />
      </div>
    </div>
  ) : (
    <Navigate to="/login" />
  );
}

export default Layout;
