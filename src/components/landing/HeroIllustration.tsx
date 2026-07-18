import React from 'react';
import { motion } from 'framer-motion';

export const HeroIllustration: React.FC = () => {
  const flowLineVariants = {
    animate: {
      strokeDashoffset: [0, -40],
      transition: {
        strokeDasharray: "10 5",
        repeat: Infinity,
        ease: "linear" as const,
        duration: 2,
      },
    },
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [0.6, 1, 0.6],
      transition: {
        repeat: Infinity,
        duration: 3,
        ease: "easeInOut" as const,
      },
    },
  };

  return (
    <div className="relative flex h-full w-full items-center justify-center p-4">
      <svg
        viewBox="0 0 600 300"
        className="w-full max-w-lg text-brand-muted"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Connection Paths (Flow lines) */}
        {/* Source -> Ship */}
        <motion.path
          d="M 120 150 L 250 150"
          stroke="#2563eb"
          strokeWidth="2"
          strokeDasharray="5 5"
          variants={flowLineVariants}
          animate="animate"
        />
        {/* Ship -> Refinery */}
        <motion.path
          d="M 280 150 Q 350 80 420 150"
          stroke="#10b981"
          strokeWidth="2"
          strokeDasharray="5 5"
          variants={flowLineVariants}
          animate="animate"
        />
        {/* Refinery -> City */}
        <motion.path
          d="M 450 150 L 510 150"
          stroke="#f59e0b"
          strokeWidth="2"
          strokeDasharray="5 5"
          variants={flowLineVariants}
          animate="animate"
        />

        {/* Node 1: Supply Source (Offshore Rig) */}
        <motion.g variants={pulseVariants} animate="animate" className="cursor-pointer">
          <circle cx="90" cy="150" r="30" fill="#151b26" stroke="#2563eb" strokeWidth="2" />
          <path
            d="M 85 160 L 95 160 L 95 140 L 90 132 L 85 140 Z M 90 132 L 90 140"
            stroke="#2563eb"
            strokeWidth="1.5"
          />
          <text x="90" y="195" textAnchor="middle" fill="#9ca3af" fontSize="10" fontWeight="bold">
            EXTRACTION
          </text>
        </motion.g>

        {/* Node 2: Maritime Logistics (Tanker Ship) */}
        <motion.g variants={pulseVariants} animate="animate" className="cursor-pointer">
          <circle cx="265" cy="150" r="30" fill="#151b26" stroke="#2563eb" strokeWidth="2" />
          <path
            d="M 252 153 L 278 153 L 274 160 L 256 160 Z M 260 153 L 260 144 L 270 144 L 270 153"
            stroke="#2563eb"
            strokeWidth="1.5"
          />
          <text x="265" y="195" textAnchor="middle" fill="#9ca3af" fontSize="10" fontWeight="bold">
            SHIPPING
          </text>
        </motion.g>

        {/* Node 3: Refining Plant (Processing) */}
        <motion.g variants={pulseVariants} animate="animate" className="cursor-pointer">
          <circle cx="435" cy="150" r="30" fill="#151b26" stroke="#10b981" strokeWidth="2" />
          <path
            d="M 425 160 L 425 142 L 433 148 L 433 142 L 441 148 L 441 160 Z"
            stroke="#10b981"
            strokeWidth="1.5"
          />
          <text x="435" y="195" textAnchor="middle" fill="#9ca3af" fontSize="10" fontWeight="bold">
            REFINERY
          </text>
        </motion.g>

        {/* Node 4: Power Grid (Terminal / City) */}
        <motion.g variants={pulseVariants} animate="animate" className="cursor-pointer">
          <circle cx="540" cy="150" r="25" fill="#151b26" stroke="#f59e0b" strokeWidth="2" />
          <path
            d="M 533 158 L 540 142 L 547 158 M 537 150 L 543 150"
            stroke="#f59e0b"
            strokeWidth="1.5"
          />
          <text x="540" y="195" textAnchor="middle" fill="#9ca3af" fontSize="10" fontWeight="bold">
            GRID
          </text>
        </motion.g>
      </svg>
    </div>
  );
};

export default HeroIllustration;
