import Header from '@/components/Header';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Outlet, Navigate } from 'react-router-dom';

function Layout() {
  // const { isLoggedIn } = useSelector((state: RootState) => state.login);
  // console.log(isLoggedIn);

  const isLoggedIn = Boolean(localStorage.getItem('isLoggedIn'));
  console.log(isLoggedIn);

  return isLoggedIn ? (
    <div>
      <Header />
      <div className="container mb-40 mt-12 py-4">
        <Outlet />
      </div>
    </div>
  ) : (
    <Navigate to="/login" />
  );
}

export default Layout;
