import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export const Button = ({
    children,
    variant = 'primary',
    size = 'default',
    className = '',
    loading = false,
    icon: Icon,
    disabled,
    ...props
}) => {

    const variants = {
        primary: "bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_15px_rgba(34,211,238,0.4)] border border-cyan-400/50 font-bold",
        secondary: "bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 hover:border-cyan-500/30 transition-colors",
        danger: "bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/50 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]",
        ghost: "hover:bg-zinc-800/50 text-zinc-400 hover:text-cyan-400",
        outline: "border-2 border-zinc-700 text-zinc-300 hover:border-cyan-500 hover:text-cyan-400 bg-transparent shadow-[0_0_0_rgba(0,0,0,0)] hover:shadow-[0_0_10px_rgba(34,211,238,0.1)]"
    };

    const sizes = {
        sm: "px-3 py-1.5 text-xs",
        default: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base",
        icon: "p-2 aspect-square"
    };

    return (
        <motion.button
            whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
            whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
            className={`
        relative inline-flex items-center justify-center gap-2 font-medium transition-colors rounded-lg 
        disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
        ${variants[variant]} 
        ${sizes[size]} 
        ${className}
      `}
            disabled={disabled || loading}
            {...props}
        >
            {loading && <Loader2 className="animate-spin w-4 h-4" />}
            {!loading && Icon && <Icon size={18} />}
            {children}
        </motion.button>
    );
};
