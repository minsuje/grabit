import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

function AnimatedRootRoutes() {
  return (
    <div>
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
  );
}

export default AnimatedRootRoutes;
