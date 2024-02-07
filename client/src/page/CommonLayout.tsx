import { Outlet, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import HeaderTitle from '@/components/HeaderTitle';

function Layout() {
  const isLoggedIn = Boolean(localStorage.getItem('isLoggedIn'));

  return !isLoggedIn ? (
    <div>
      <HeaderTitle />
      <div className="container mb-40 mt-12 py-4">
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
    <Navigate to="/main" />
  );
}

export default Layout;
