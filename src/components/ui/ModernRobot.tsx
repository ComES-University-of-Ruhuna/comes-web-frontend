// ============================================
// ComES Website - Modern Robot Illustration
// Animated 3D-style robot for landing page
// ============================================

import { motion } from 'framer-motion';
import { cn } from '@/utils';

interface ModernRobotProps {
  className?: string;
  isDark?: boolean;
}

export const ModernRobot = ({ className, isDark = false }: ModernRobotProps) => {
  return (
    <div className={cn('relative', className)}>
      {/* Glow effect behind robot */}
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className={cn(
          'absolute inset-0 rounded-full blur-3xl',
          isDark ? 'bg-blue-500/30' : 'bg-comesBlue/20'
        )}
      />

      <motion.svg
        viewBox="0 0 200 240"
        className="w-full h-full relative z-10"
        initial={{ y: 0 }}
        animate={{ y: [0, -10, 0] }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="robotBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isDark ? "#3b82f6" : "#003366"} />
            <stop offset="100%" stopColor={isDark ? "#1d4ed8" : "#002244"} />
          </linearGradient>
          
          <linearGradient id="robotAccent" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isDark ? "#22d3ee" : "#0ea5e9"} />
            <stop offset="100%" stopColor={isDark ? "#06b6d4" : "#0284c7"} />
          </linearGradient>
          
          <linearGradient id="robotGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={isDark ? "#60a5fa" : "#38bdf8"} />
            <stop offset="100%" stopColor={isDark ? "#3b82f6" : "#0284c7"} />
          </linearGradient>
          
          <linearGradient id="robotVisor" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isDark ? "#22d3ee" : "#06b6d4"} />
            <stop offset="50%" stopColor={isDark ? "#06b6d4" : "#0891b2"} />
            <stop offset="100%" stopColor={isDark ? "#0891b2" : "#0e7490"} />
          </linearGradient>

          <filter id="robotShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor={isDark ? "#1e40af" : "#003366"} floodOpacity="0.3"/>
          </filter>

          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Antenna */}
        <motion.g
          animate={{ rotate: [-5, 5, -5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: '100px 25px' }}
        >
          <line 
            x1="100" y1="45" x2="100" y2="20" 
            stroke={isDark ? "#60a5fa" : "#0284c7"} 
            strokeWidth="3"
            strokeLinecap="round"
          />
          <motion.circle 
            cx="100" cy="15" r="8" 
            fill="url(#robotAccent)"
            filter="url(#glow)"
            animate={{ 
              opacity: [1, 0.5, 1],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.g>

        {/* Head */}
        <motion.g filter="url(#robotShadow)">
          <rect 
            x="55" y="45" 
            width="90" height="65" 
            rx="20" 
            fill="url(#robotBody)"
          />
          
          {/* Visor/Eyes */}
          <rect 
            x="65" y="60" 
            width="70" height="30" 
            rx="15" 
            fill="url(#robotVisor)"
            filter="url(#glow)"
          />
          
          {/* Eye highlights */}
          <motion.circle 
            cx="85" cy="75" r="8" 
            fill="white"
            animate={{ 
              opacity: [0.9, 0.4, 0.9],
              x: [-2, 2, -2]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.circle 
            cx="115" cy="75" r="8" 
            fill="white"
            animate={{ 
              opacity: [0.9, 0.4, 0.9],
              x: [2, -2, 2]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          {/* Eye pupils */}
          <motion.circle 
            cx="85" cy="75" r="4" 
            fill={isDark ? "#0f172a" : "#001122"}
            animate={{ x: [-1, 1, -1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.circle 
            cx="115" cy="75" r="4" 
            fill={isDark ? "#0f172a" : "#001122"}
            animate={{ x: [1, -1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.g>

        {/* Neck */}
        <rect 
          x="85" y="110" 
          width="30" height="15" 
          fill="url(#robotBody)"
        />

        {/* Body */}
        <motion.g filter="url(#robotShadow)">
          <rect 
            x="45" y="125" 
            width="110" height="80" 
            rx="15" 
            fill="url(#robotBody)"
          />
          
          {/* Chest panel */}
          <rect 
            x="60" y="140" 
            width="80" height="50" 
            rx="10" 
            fill={isDark ? "#1e3a5f" : "#002244"}
          />
          
          {/* Core energy circle */}
          <motion.circle 
            cx="100" cy="165" r="20" 
            fill="url(#robotAccent)"
            filter="url(#glow)"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.circle 
            cx="100" cy="165" r="12" 
            fill="white"
            animate={{ 
              opacity: [0.9, 0.6, 0.9]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          
          {/* Status lights */}
          <motion.circle 
            cx="70" cy="145" r="4" 
            fill="#22c55e"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <motion.circle 
            cx="85" cy="145" r="4" 
            fill="#eab308"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
          />
          <motion.circle 
            cx="115" cy="145" r="4" 
            fill="#22c55e"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
          />
          <motion.circle 
            cx="130" cy="145" r="4" 
            fill="#3b82f6"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
          />
        </motion.g>

        {/* Left Arm */}
        <motion.g
          animate={{ rotate: [-3, 3, -3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: '45px 140px' }}
        >
          <rect 
            x="20" y="130" 
            width="25" height="55" 
            rx="10" 
            fill="url(#robotBody)"
            filter="url(#robotShadow)"
          />
          {/* Arm joint */}
          <circle cx="32" cy="140" r="8" fill="url(#robotAccent)" />
          {/* Hand */}
          <ellipse cx="32" cy="195" rx="12" ry="10" fill="url(#robotBody)" />
        </motion.g>

        {/* Right Arm */}
        <motion.g
          animate={{ rotate: [3, -3, 3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: '155px 140px' }}
        >
          <rect 
            x="155" y="130" 
            width="25" height="55" 
            rx="10" 
            fill="url(#robotBody)"
            filter="url(#robotShadow)"
          />
          {/* Arm joint */}
          <circle cx="168" cy="140" r="8" fill="url(#robotAccent)" />
          {/* Hand */}
          <ellipse cx="168" cy="195" rx="12" ry="10" fill="url(#robotBody)" />
        </motion.g>

        {/* Decorative circuit lines */}
        <motion.path 
          d="M60 130 L60 125 L70 125" 
          stroke={isDark ? "#60a5fa" : "#0ea5e9"} 
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.path 
          d="M140 130 L140 125 L130 125" 
          stroke={isDark ? "#60a5fa" : "#0ea5e9"} 
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        />
      </motion.svg>

      {/* Floating particles around robot */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className={cn(
            'absolute w-2 h-2 rounded-full',
            isDark ? 'bg-blue-400' : 'bg-comesBlue'
          )}
          style={{
            top: `${20 + (i * 15)}%`,
            left: i % 2 === 0 ? '-5%' : '95%',
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 2 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        />
      ))}
    </div>
  );
};

export default ModernRobot;
