import Header from '@/components/Header';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Outlet, Navigate } from 'react-router-dom';

function Layout() {
  const { isLoggedIn } = useSelector((state: RootState) => state.login);

  return isLoggedIn ? (
    <div>
      <Header />
      <Outlet />
    </div>
  ) : (
    <Navigate to="/" />
  );
}

export default Layout;
