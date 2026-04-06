import React, { useState } from 'react';
import Modal from '../../../common/components/Modal';

const ExecutionModal = ({ item, onProceed, onClose }) => {
  const [inputValue, setInputValue] = useState('');
  const [locationValue, setLocationValue] = useState('');
  const [sudoPassword, setSudoPassword] = useState('');

  const handlePickLocation = async () => {
    try {
      if (window.electron && window.electron.pickPath) {
        const path = await window.electron.pickPath({
          properties: ['openFile', 'openDirectory']
        });
        if (path) {
          setLocationValue(path);
        }
      } else {
        alert("Electron IPC not available.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleProceed = () => {
    let finalCommand = item.content;
    if (item.needsInput && inputValue) {
      finalCommand += ` ${inputValue}`;
    }
    if (item.needsLocation && locationValue) {
      finalCommand += ` "${locationValue}"`;
    }
    // Wrap with sudo -S if required (pipes password via stdin)
    if (item.needsSudo && sudoPassword) {
      finalCommand = `echo '${sudoPassword.replace(/'/g, `'\''`)}' | sudo -S -p '' ${finalCommand}`;
    }
    onProceed(finalCommand);
  };

  const isProceedDisabled = 
    (item.needsInput && !inputValue.trim()) || 
    (item.needsLocation && !locationValue.trim()) ||
    (item.needsSudo && !sudoPassword.trim());

  return (
    <Modal 
      isOpen={true} 
      onClose={onClose} 
      title={`Configure: ${item.title}`}
    >
      <div className="space-y-6">
        {item.needsInput && (
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Target Name</label>
            <input
              autoFocus
              type="text"
              placeholder="Ex: myapp, update-package, etc."
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-[0.5px] border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-500 transition-all text-gray-900 dark:text-white outline-none font-medium"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
        )}

        {item.needsLocation && (
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">File or Directory Location</label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                placeholder="No path selected"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-[0.5px] border-gray-200 dark:border-gray-700 rounded-xl text-gray-500 dark:text-gray-400 outline-none font-mono text-sm"
                value={locationValue}
              />
              <button
                type="button"
                onClick={handlePickLocation}
                className="px-6 py-3 bg-gray-900 dark:bg-gray-700 text-white font-bold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-600 transition-all shrink-0 shadow-sm"
              >
                Browse
              </button>
            </div>
          </div>
        )}

        {item.needsSudo && (
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-red-500 ml-1">Sudo Password</label>
            <div className="relative">
              <input
                type="password"
                placeholder="Enter your system password"
                className="w-full px-4 py-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/50 rounded-xl focus:ring-2 focus:ring-red-500 transition-all text-gray-900 dark:text-white outline-none font-medium"
                value={sudoPassword}
                onChange={(e) => setSudoPassword(e.target.value)}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
            <p className="text-[10px] text-red-500/70 ml-1">Used once for this execution only. Never stored.</p>
          </div>
        )}

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
