import React from 'react';

const NoData = ({ 
  title = "No Data Found", 
  message = "There are currently no items to display.", 
  actionButton = null,
  className = "" 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center space-y-4 h-full min-h-[250px] ${className}`}>
      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full mb-2">
        <svg 
          className="size-10 text-gray-400 dark:text-gray-500" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" 
          />
        </svg>
      </div>
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wide">
          {title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto mt-1">
          {message}
        </p>
      </div>
      {actionButton && (
        <div className="mt-4 pt-2">
          {actionButton}
        </div>
      )}
    </div>
  );
};

export default NoData;
