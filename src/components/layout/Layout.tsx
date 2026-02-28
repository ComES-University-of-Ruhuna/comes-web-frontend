// ============================================
// ComES Website - Main Layout Component
// ============================================

import type { FC } from "react";
import { Outlet } from "react-router";
import { motion } from "framer-motion";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { useThemeStore } from "@/store";

export const Layout: FC = () => {
  const { resolvedTheme } = useThemeStore();

  return (
    <div
      className={`font-comes flex min-h-screen flex-col transition-colors duration-300 ${
        resolvedTheme === "dark" ? "bg-slate-950 text-gray-100" : "bg-white text-gray-900"
      }`}
    >
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
