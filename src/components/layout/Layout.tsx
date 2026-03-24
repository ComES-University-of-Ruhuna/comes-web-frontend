// ============================================
// ComES Website - Main Layout Component
// ============================================

import type { FC } from "react";
import { Outlet } from "react-router";
import { motion } from "framer-motion";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export const Layout: FC = () => {
  return (
    <div className="font-body flex min-h-screen flex-col bg-[#050A14] text-[#F0F6FF]">
      <Navbar />
      <motion.main
        className="flex-1 pt-16 md:pt-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Outlet />
      </motion.main>
      <Footer />
    </div>
  );
};

export default Layout;
