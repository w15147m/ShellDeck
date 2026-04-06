import React from 'react';

const ItemCard = ({ item, onEdit, onDelete, onToggleStar }) => {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl flex items-center justify-between group transition-all hover:border-brand-500/30">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => onToggleStar(item)}
          className={`text-xl transition-colors ${item.starred ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-200'}`}
        >
          {item.starred ? '★' : '☆'}
        </button>
        
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-900 dark:text-white">{item.title}</h3>
            {item.status && (
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                item.statusColor === 'success' ? 'bg-green-100 text-green-600' :
                item.statusColor === 'error' ? 'bg-red-100 text-red-600' :
                'bg-blue-100 text-blue-600'
              }`}>
                {item.status}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-md line-clamp-2">
            {item.content}
          </p>
          <div className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">
            {item.date}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={() => onEdit(item)}
          className="p-2 text-gray-400 hover:text-brand-500 hover:bg-brand-50 rounded-lg transition-all"
          title="Edit"
        >
          <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button 
          onClick={() => onDelete(item.id)}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
          title="Delete"
        >
          <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ItemCard;
