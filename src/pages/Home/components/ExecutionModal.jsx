import React, { useState } from 'react';
import Modal from '../../../common/components/Modal';

const ExecutionModal = ({ item, onProceed, onClose }) => {
  const [inputValue, setInputValue] = useState('');
  const [locationValue, setLocationValue] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');

  const handlePickLocation = async () => {
    try {
      if (window.electron && window.electron.pickPath) {
        // On Linux, mixing openFile and openDirectory can break the 'Select' button.
        // We'll default to openFile as it's the most common requirement for installers/scripts.
        const selectedPath = await window.electron.pickPath({
          properties: ['openFile', 'showHiddenFiles'],
          title: 'Select File'
        });
        
        if (selectedPath) {
          // Extract directory and filename separately
          const pathParts = selectedPath.split(/[/\\]/);
          const fileName = pathParts.pop();
          const dirPath = pathParts.join('/') || '/';
          
          setLocationValue(dirPath);
          setSelectedFileName(fileName || '');
          
          // Auto-fill target name logic removed to prevent double-argument errors (e.g., apt install name file)
          // If you need a custom name, you can still type it manually.
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getFinalCommand = () => {
    let base = item.content;
    if (item.needsInput && inputValue) {
      base += ` ${inputValue}`;
    }
    
    if (item.needsLocation && locationValue) {
      const filePart = selectedFileName ? `./${selectedFileName}` : '';
      return `cd "${locationValue}" && ${base} ${filePart}`;
    }
    
    return base;
  };

  const handleProceed = () => {
    onProceed(getFinalCommand());
  };

  const previewCommand = getFinalCommand();

  const isProceedDisabled = 
    (item.needsInput && !item.needsLocation && !inputValue.trim()) || 
    (item.needsLocation && !locationValue.trim());

  return (
    <Modal 
      isOpen={true} 
      onClose={onClose} 
      title={`Configure: ${item.title}`}
    >
      <div className="space-y-6">
        {item.needsLocation && (
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">File or Directory Location</label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                placeholder="No path selected"
                className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-800 border-[0.5px] border-gray-200 dark:border-gray-700 rounded-xl text-gray-500 dark:text-gray-400 outline-none font-mono text-sm truncate"
                value={locationValue}
              />
              <button
                type="button"
                onClick={handlePickLocation}
                className="px-6 py-3 bg-gray-900 dark:bg-gray-800 text-white font-bold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-700 transition-all shrink-0 shadow-sm"
              >
                Browse
              </button>
            </div>
          </div>
        )}

        {item.needsInput && (
          <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-300">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Target Name</label>
            <input
              autoFocus={!item.needsLocation}
              type="text"
              placeholder={item.needsLocation ? "Optional arguments (e.g. -y, --force)" : "Ex: myapp, update-package, etc."}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-[0.5px] border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-500 transition-all text-gray-900 dark:text-white outline-none font-medium"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
        )}

        <div className="space-y-1.5 pt-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Live Command Preview</label>
          <div className="bg-gray-900 dark:bg-black/40 border border-gray-200 dark:border-gray-800 rounded-xl p-3 shadow-inner overflow-hidden">
            <div className="flex gap-2">
              <span className="text-brand-500 font-mono text-xs font-bold shrink-0">$</span>
              <code className="text-xs font-mono text-gray-300 dark:text-gray-400 break-all leading-relaxed whitespace-pre-wrap">
                {previewCommand}
              </code>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
          <button 
            type="button"
            onClick={handleProceed}
            disabled={isProceedDisabled}
            className={`flex-1 py-3 px-6 text-white font-bold rounded-2xl shadow-lg transition-all ${
              isProceedDisabled 
                ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed opacity-50' 
                : 'bg-green-500 hover:bg-green-600 shadow-green-500/20 active:scale-[0.98]'
            }`}
          >
            Execute Command
          </button>
          <button 
            type="button"
            onClick={onClose}
            className="py-3 px-6 text-gray-500 dark:text-gray-400 font-bold hover:text-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-2xl transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ExecutionModal;
