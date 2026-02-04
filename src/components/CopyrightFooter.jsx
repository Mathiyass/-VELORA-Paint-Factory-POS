import React from 'react';

const CopyrightFooter = () => {
  return (
    <footer className="w-full py-2 px-4 text-center">
      <a
        href="https://mathiyass.github.io/MAportfolio/"
        target="_blank"
        rel="noopener noreferrer"
        className="
        inline-flex items-center justify-center gap-2 
        px-4 py-1.5 
        rounded-full 
        bg-zinc-900/50 backdrop-blur-md 
        border border-zinc-800/50 
        shadow-lg
        text-xs font-medium text-zinc-500
        transition-all duration-300 
        hover:text-zinc-300 hover:border-zinc-700 hover:scale-105 hover:bg-zinc-800/50
        cursor-pointer
      ">
        <span>&copy; {new Date().getFullYear()}</span>
        <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
        <span className="bg-gradient-to-r from-zinc-400 to-zinc-600 bg-clip-text text-transparent transition-all duration-300 hover:from-white hover:to-zinc-400">
          Mathisha Angirasa (MATHIYA)
        </span>
      </a>
    </footer>
  );
};

export default CopyrightFooter;
