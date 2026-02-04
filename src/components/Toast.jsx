import React, { useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const Toast = ({ message, type, duration, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const variants = {
    initial: { opacity: 0, y: 50, scale: 0.9 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
  };

  const styles = {
    success: 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200',
    error: 'bg-red-950/90 border-red-500/50 text-red-200',
    info: 'bg-blue-950/90 border-blue-500/50 text-blue-200',
    warning: 'bg-orange-950/90 border-orange-500/50 text-orange-200',
  };

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle,
  };

  const Icon = icons[type] || Info;

  return (
    <motion.div
      layout
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`pointer-events-auto min-w-[300px] max-w-md p-4 rounded-xl border backdrop-blur-md shadow-2xl flex items-start gap-3 ${styles[type]}`}
    >
      <Icon size={20} className="mt-0.5 shrink-0" />
      <div className="flex-1 text-sm font-medium">{message}</div>
      <button onClick={onClose} className="opacity-70 hover:opacity-100 transition-opacity">
        <X size={16} />
      </button>
    </motion.div>
  );
};

export default Toast;
