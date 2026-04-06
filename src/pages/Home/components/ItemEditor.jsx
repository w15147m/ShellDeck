import React, { useState, useEffect } from 'react';
import Modal from '../../../common/components/Modal';

const ItemEditor = ({ item, onSave, onDelete, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    needsInput: false,
    needsLocation: false,
    needsSudo: false,
    status: 'To-do',
    statusColor: 'blue',
    starred: false,
    date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
  });

  useEffect(() => {
    if (item) {
      setFormData({
        status: 'To-do',
        statusColor: 'blue',
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
        ...item,
        // Ensure booleans are always proper booleans, not 0/1 from SQLite
        needsInput: !!item?.needsInput,
        needsLocation: !!item?.needsLocation,
        needsSudo: !!item?.needsSudo,
        starred: !!item?.starred,
      });
    }
  }, [item]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal 
      isOpen={true} 
      onClose={onClose} 
      hideHeader={true}
      title={null}
      footer={null}
    >
      <form id="item-form" onSubmit={handleSubmit} className="space-y-3">
        
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {item ? 'Edit Command' : 'New Command Build'}
          </h2>
          <div className="flex items-center gap-1">
            {item && (
              <button 
                type="button"
                onClick={() => onDelete(item.id)}
                className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                title="Delete Command"
              >
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
            <button 
              type="button"
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
            >
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Command Name</label>
          <input
            autoFocus
            type="text"
            placeholder="Ex: Weekly System Update"
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-[0.5px] border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-500 transition-all text-gray-900 dark:text-white outline-none font-medium"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Terminal Command</label>
          <textarea
            autoFocus={!!item}
            placeholder='Ex: echo "System is active"'
            rows={4}
            className="w-full font-mono px-4 py-3 bg-gray-50 dark:bg-gray-800 border-[0.5px] border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-500 transition-all text-gray-900 dark:text-white outline-none resize-none"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            required
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                handleSubmit(e);
              }
            }}
          />
        </div>

        <div className="space-y-3 py-3 border-t border-gray-100 dark:border-gray-800">
          <div 
            onClick={() => setFormData(prev => ({ ...prev, needsInput: !prev.needsInput }))}
            className="flex items-center justify-between cursor-pointer group"
          >
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors uppercase tracking-wider select-none">
              Need Target Name
            </span>
            <div className={`w-9 h-5 rounded-full relative transition-colors ${formData.needsInput ? 'bg-brand-500' : 'bg-gray-200 dark:bg-gray-700'}`}>
              <div className={`absolute top-[2px] left-[2px] bg-white border-gray-300 border rounded-full h-4 w-4 transition-transform ${formData.needsInput ? 'translate-x-full border-white' : ''}`}></div>
            </div>
          </div>
          
          <div 
            onClick={() => setFormData(prev => ({ ...prev, needsLocation: !prev.needsLocation }))}
            className="flex items-center justify-between cursor-pointer group"
          >
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors uppercase tracking-wider select-none">
              Need File/Location
            </span>
            <div className={`w-9 h-5 rounded-full relative transition-colors ${formData.needsLocation ? 'bg-brand-500' : 'bg-gray-200 dark:bg-gray-700'}`}>
              <div className={`absolute top-[2px] left-[2px] bg-white border-gray-300 border rounded-full h-4 w-4 transition-transform ${formData.needsLocation ? 'translate-x-full border-white' : ''}`}></div>
            </div>
          </div>
          
          <div 
            onClick={() => setFormData(prev => ({ ...prev, needsSudo: !prev.needsSudo }))}
            className="flex items-center justify-between cursor-pointer group"
          >
            <span className="text-xs font-bold text-red-500 dark:text-red-400 group-hover:text-red-600 dark:group-hover:text-red-300 transition-colors uppercase tracking-wider select-none">
              Requires Root / Sudo
            </span>
            <div className={`w-9 h-5 rounded-full relative transition-colors ${formData.needsSudo ? 'bg-red-500' : 'bg-gray-200 dark:bg-gray-700'}`}>
              <div className={`absolute top-[2px] left-[2px] bg-white border-gray-300 border rounded-full h-4 w-4 transition-transform ${formData.needsSudo ? 'translate-x-full border-white' : ''}`}></div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button 
            type="submit"
            className="flex-1 py-3 px-6 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-2xl shadow-lg shadow-brand-500/20 active:scale-[0.98] transition-all"
          >
            {item ? 'Save Command' : 'Create Command'}
          </button>
          <button 
            type="button"
            onClick={onClose}
            className="py-3 px-6 text-gray-500 dark:text-gray-400 font-bold hover:text-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-2xl transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ItemEditor;
