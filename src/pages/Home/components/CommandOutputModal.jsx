import React, { useEffect, useRef, useState } from 'react';
import Modal from '../../../common/components/Modal';

const CommandOutputModal = ({ title, output, error, isRunning, onClose }) => {
  const isError = !!error;
  const preRef = useRef(null);
  const [userInput, setUserInput] = useState('');

  useEffect(() => {
    if (preRef.current) {
      preRef.current.scrollTop = preRef.current.scrollHeight;
    }
  }, [output, error]);

  const handleSendInput = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    
    if (window.electron && window.electron.sendCommandInput) {
      window.electron.sendCommandInput(userInput);
      setUserInput('');
    }
  };

  return (
    <Modal 
      isOpen={true} 
      onClose={onClose} 
      hideHeader={true}
    >
      <div className="flex flex-col">
        {/* Compact Custom Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[200px]">
              Terminal: {title}
            </span>
            {isRunning && (
              <span className="flex items-center gap-1 bg-brand-500/10 text-brand-500 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-tighter animate-pulse">
                Live
              </span>
            )}
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="bg-gray-900 overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 shadow-inner">
          <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
              <span className="ml-2 text-[10px] font-bold tracking-widest text-gray-400 uppercase select-none">
                Bash Console
              </span>
            </div>
          </div>
          
          <div className="flex flex-col h-[350px]">
            <pre 
              ref={preRef}
              className="p-4 text-xs font-mono text-gray-300 overflow-x-auto overflow-y-auto custom-scrollbar whitespace-pre-wrap flex-1 bg-black/20"
            >
              {output || error || (isRunning ? 'Starting session...' : 'No output recorded.')}
              {isRunning && <span className="inline-block w-2 h-4 ml-1 bg-brand-500 animate-pulse align-middle"></span>}
            </pre>

            {isRunning && (
              <form 
                onSubmit={handleSendInput}
                className="flex items-center gap-2 p-3 bg-black/40 border-t border-gray-800"
              >
                <span className="text-brand-500 font-mono text-xs font-bold">$</span>
                <input
                  autoFocus
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Type password or command..."
                  className="flex-1 bg-transparent border-none outline-none text-xs font-mono text-white placeholder:text-gray-600"
                />
                <button 
                  type="submit"
                  className="text-[10px] bg-brand-500/20 text-brand-500 px-2 py-0.5 rounded font-bold hover:bg-brand-500/30 transition-colors"
                >
                  SEND
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CommandOutputModal;
