import React from 'react';

const ItemCard = ({ item, onEdit, onDelete, onRun }) => {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl flex items-center justify-between group transition-all hover:border-brand-500/30">
      <div className="flex items-center gap-4 flex-1 overflow-hidden mr-4">
        <button 
          onClick={() => onEdit(item)}
          className="text-left w-full hover:underline decoration-brand-500/30 underline-offset-4"
        >
          <h3 className="font-bold text-gray-900 dark:text-white truncate">{item.title}</h3>
        </button>
      </div>

      <div className="flex shrink-0 items-center transition-opacity">
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
