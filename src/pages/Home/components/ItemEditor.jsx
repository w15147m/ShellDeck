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

  const footer = (
    <>
      <button 
        type="submit"
        form="item-form"
        className="flex-1 py-3 px-6 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-2xl shadow-lg shadow-brand-500/20 active:scale-[0.98] transition-all"
      >
        {item ? 'Save Changes' : 'Create Record'}
      </button>
      <button 
        type="button"
        onClick={onClose}
        className="py-3 px-6 text-gray-500 dark:text-gray-400 font-bold hover:text-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-2xl transition-all"
      >
        Cancel
      </button>
    </>
  );

  return (
    <Modal 
      isOpen={true} 
      onClose={onClose} 
      title={item ? 'Edit Record' : 'New Database Record'}
      footer={footer}
    >
      <form id="item-form" onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Title</label>
          <input
            autoFocus
            type="text"
            placeholder="Ex: Weekly Report"
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-[0.5px] border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-500 transition-all text-gray-900 dark:text-white outline-none font-medium"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Status</label>
          <div className="flex gap-2">
            {['To-do', 'Ready', 'In-Progress'].map(s => (
              <button
                key={s}
                type="button"
                onClick={() => setFormData({ 
                    ...formData, 
                    status: s, 
                    statusColor: s === 'Ready' ? 'success' : s === 'To-do' ? 'blue' : 'error' 
                })}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                  formData.status === s 
                  ? 'bg-brand-500 border-brand-500 text-white' 
                  : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-400 hover:bg-brand-50'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Content</label>
          <textarea
            placeholder="Add details..."
            rows={4}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-[0.5px] border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-500 transition-all text-gray-900 dark:text-white outline-none resize-none"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            required
          />
        </div>
      </form>
    </Modal>
  );
};

export default ItemEditor;
