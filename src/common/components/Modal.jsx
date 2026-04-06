import React from 'react';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer,
  maxWidth = 'max-w-lg',
  hideCloseButton = false,
  hideHeader = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className={`bg-white dark:bg-gray-900 w-full ${maxWidth} rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]`}>
        
        {/* Header */}
        {!hideHeader && (
          <div className="px-8 pt-6 pb-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between shrink-0">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {title}
            </h2>
            {!hideCloseButton && (
              <button 
                onClick={onClose}
                className="p-2 -mr-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
                aria-label="Close modal"
              >
                ✕
              </button>
            )}
          </div>
        )}

        {/* Body (Scrollable) */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-8 py-5 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex items-center gap-3 shrink-0">
            {footer}
          </div>
        )}

      </div>
    </div>
  );
};

export default Modal;
