import React from 'react';

const Loader = ({ text = 'Loading...', size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
    xl: 'w-12 h-12 border-4'
  };

  return (
    <div className={`flex flex-col flex-1 h-full items-center justify-center p-8 space-y-4 ${className}`}>
      <div 
        className={`${sizeClasses[size] || sizeClasses.md} rounded-full border-brand-200 dark:border-brand-900 border-t-brand-500 animate-spin`}
        role="status"
      />
      {text && (
        <span className="text-sm font-bold tracking-wider uppercase text-brand-500 animate-pulse">
          {text}
        </span>
      )}
    </div>
  );
};

export default Loader;
