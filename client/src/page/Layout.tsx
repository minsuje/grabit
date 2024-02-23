import Header from '@/components/Header';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

function Layout() {
  const location = useLocation();
  const accessToken = localStorage.getItem('accessToken');

  return accessToken ? (
    <div>
      <Header />
      <div className="container mb-40 mt-16 min-h-40 px-6 py-4">
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
