import React from 'react';

const ItemCard = ({ item, onEdit, onDelete, onRun }) => {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl flex items-center justify-between group transition-all hover:border-brand-500/30">
      <div className="flex items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-900 dark:text-white">{item.title}</h3>
          </div>
          <p className="text-sm font-mono text-gray-500 dark:text-gray-400 leading-relaxed max-w-md line-clamp-2">
            {item.content}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-end gap-3 transition-opacity">
        <div className="flex items-center gap-1">
          <button 
            onClick={() => onEdit(item)}
            className="p-1.5 text-gray-400 hover:text-brand-500 hover:bg-brand-50 rounded-lg transition-all"
            title="Edit"
          >
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button 
            onClick={() => onDelete(item.id)}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
            title="Delete"
          >
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
        
        <button 
          onClick={() => onRun && onRun(item)}
          className="px-4 py-1.5 text-xs font-bold text-white bg-green-500 hover:bg-green-600 shadow-sm rounded-lg transition-all"
          title="Run Command"
        >
          Run Command
        </button>
      </div>
    </div>
  );
};

export default ItemCard;
