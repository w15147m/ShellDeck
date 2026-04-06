import React, { useState, useEffect } from 'react';
import Modal from '../../../common/components/Modal';

const ItemEditor = ({ item, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    status: 'To-do',
    statusColor: 'blue',
    starred: false,
    date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
  });

  useEffect(() => {
    if (item) {
      setFormData(item);
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
          <button 
            type="button"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
          >
            ✕
          </button>
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
