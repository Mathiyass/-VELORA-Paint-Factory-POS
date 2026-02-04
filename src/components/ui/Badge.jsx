import React from 'react';

const variants = {
    default: "bg-zinc-800 text-zinc-300 border-zinc-700",
    success: "bg-emerald-950/30 text-emerald-400 border-emerald-900/50",
    warning: "bg-orange-950/30 text-orange-400 border-orange-900/50",
    danger: "bg-red-950/30 text-red-400 border-red-900/50",
    info: "bg-blue-950/30 text-blue-400 border-blue-900/50",
};

export const Badge = ({ children, variant = 'default', className = '' }) => {
    return (
        <span className={`
      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
      ${variants[variant] || variants.default}
      ${className}
    `}>
            {children}
        </span>
    );
};
