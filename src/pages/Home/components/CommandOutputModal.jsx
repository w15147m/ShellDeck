import React, { useEffect, useRef } from 'react';
import Modal from '../../../common/components/Modal';

const CommandOutputModal = ({ title, output, error, isRunning, onClose }) => {
  const isError = !!error;
  const preRef = useRef(null);

  useEffect(() => {
    if (preRef.current) {
      preRef.current.scrollTop = preRef.current.scrollHeight;
    }
  }, [output, error]);

  return (
    <Modal 
      isOpen={true} 
      onClose={onClose} 
      title={`Terminal Output: ${title}`}
    >
      <div className="space-y-4">
        {isError && (
          <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl font-bold text-sm">
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Execution Failed
          </div>
        )}

        <div className="bg-gray-900 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 shadow-inner">
          <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
              <span className="ml-2 text-[10px] font-bold tracking-widest text-gray-400 uppercase select-none">
                Bash Console
              </span>
            </div>
            {isRunning && (
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse"></div>
                <span className="text-[9px] font-bold text-brand-500 uppercase tracking-tighter">Live Stream</span>
              </div>
            )}
          </div>
          
          <pre 
            ref={preRef}
            className="p-4 text-xs font-mono text-gray-300 overflow-x-auto max-h-[300px] overflow-y-auto custom-scrollbar whitespace-pre-wrap"
          >
            {output || error || (isRunning ? 'Initializing stream...' : 'No output recorded.')}
            {isRunning && <span className="inline-block w-2 h-4 ml-1 bg-brand-500 animate-pulse align-middle"></span>}
          </pre>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button 
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-6 text-gray-700 dark:text-white font-bold bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-all"
          >
            {isRunning ? 'Run in Background' : 'Close Terminal'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CommandOutputModal;
