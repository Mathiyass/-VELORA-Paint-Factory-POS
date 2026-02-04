import React from 'react';

export const Input = ({ label, error, icon: Icon, className = '', ...props }) => {
    return (
        <div className={`space-y-1.5 ${className}`}>
            {label && <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider ml-1">{label}</label>}
            <div className="relative group">
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-red-500 transition-colors">
                        <Icon size={18} />
                    </div>
                )}
                <input
                    className={`
            w-full bg-zinc-900/50 border border-zinc-800 rounded-lg 
            ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5
            text-zinc-100 placeholder:text-zinc-600 outline-none
            focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 focus:bg-zinc-900
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
                    {...props}
                />
            </div>
            {error && <p className="text-red-500 text-xs ml-1 mt-1 font-medium">{error}</p>}
        </div>
    );
};

export const TextArea = ({ label, error, className = '', rows = 3, ...props }) => {
    return (
        <div className={`space-y-1.5 ${className}`}>
            {label && <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider ml-1">{label}</label>}
            <textarea
                rows={rows}
                className={`
          w-full bg-zinc-900/50 border border-zinc-800 rounded-lg p-3
          text-zinc-100 placeholder:text-zinc-600 outline-none
          focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 focus:bg-zinc-900
          transition-all duration-200 resize-none
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
                {...props}
            />
            {error && <p className="text-red-500 text-xs ml-1 mt-1 font-medium">{error}</p>}
        </div>
    );
};
