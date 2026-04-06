import React from 'react';

const ItemCard = ({ item, onEdit, onDelete, onRun, isExecuting }) => {
  return (
    <div className={`p-4 bg-white dark:bg-gray-800 border ${isExecuting ? 'border-brand-500 shadow-md shadow-brand-500/10' : 'border-gray-100 dark:border-gray-700'} rounded-xl flex items-center justify-between group transition-all hover:border-brand-500/30`}>
      <div className={`flex items-center gap-4 flex-1 overflow-hidden mr-4 ${isExecuting ? 'opacity-50' : ''}`}>
        <button 
          onClick={() => !isExecuting && onEdit(item)}
          disabled={isExecuting}
          className="text-left w-full hover:underline decoration-brand-500/30 underline-offset-4"
        >
          <h3 className="font-bold text-gray-900 dark:text-white truncate">{item.title}</h3>
        </button>
      </div>

      <div className="flex shrink-0 items-center transition-opacity">
        <button 
          onClick={() => onRun && onRun(item)}
          disabled={isExecuting}
          className={`flex items-center gap-2 px-4 py-1.5 text-xs font-bold text-white shadow-sm rounded-lg transition-all ${
            isExecuting 
              ? 'bg-brand-500 cursor-wait' 
              : 'bg-green-500 hover:bg-green-600'
          }`}
          title="Run Command"
        >
          {isExecuting ? (
            <>
              <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Executing...
            </>
          ) : (
            'Run Command'
          )}
        </button>
      </div>
    </div>
  );
};

export default ItemCard;
