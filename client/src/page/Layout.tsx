import Header from '@/components/Header';
// import { useSelector } from 'react-redux';
// import { RootState } from '@/store/store';
import { Outlet, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function Layout() {
  // const { isLoggedIn } = useSelector((state: RootState) => state.login);
  // console.log(isLoggedIn);

  // const isLoggedIn = Boolean(localStorage.getItem('isLoggedIn'));
  // const isLoggedIn = true;
  const accessToken = localStorage.getItem('accessToken');
  console.log('Layout accessToken >>>>>', accessToken);

  return accessToken ? (
    <div>
      <Header />
      <div className="container mb-40 mt-16 min-h-40 py-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          key={location.pathname}
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  ) : (
    <Navigate to="/login" />
  );
}

export default Layout;
