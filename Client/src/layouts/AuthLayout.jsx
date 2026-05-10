import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden dark">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />

      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 z-10">
        <div className="bg-primary/20 p-2 rounded-lg backdrop-blur-sm border border-primary/30">
          <Activity className="w-6 h-6 text-primary" />
        </div>
        <span className="text-xl font-bold tracking-tight text-foreground">WebTrack</span>
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10 px-4"
      >
        <Outlet />
      </motion.div>
    </div>
  );
};

export default AuthLayout;
