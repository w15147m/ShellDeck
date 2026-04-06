import React from 'react';
import { GithubPicker } from 'react-color';
import { STICKY_COLORS } from '../../common/utils/stickyColors';

const ColorPicker = ({ selectedColorId, onSelect, onClose }) => {
  const hexColors = STICKY_COLORS.map(c => c.bg);
  const selectedColor = STICKY_COLORS.find(c => c.id === selectedColorId);

  const handleChangeComplete = (color) => {
    const found = STICKY_COLORS.find(c => c.bg.toLowerCase() === color.hex.toLowerCase());
    if (found) {
      onSelect(found.id);
    }
  };

  return (
    <div 
      className="absolute top-10 right-0 z-[100] animate-in fade-in zoom-in duration-200 select-none"
      style={{ WebkitAppRegion: 'no-drag' }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="relative">
        <GithubPicker
          color={selectedColor ? selectedColor.bg : '#ffffff'}
          colors={hexColors}
          onChangeComplete={handleChangeComplete}
          width="212px"
          triangle="top-right"
        />
        
        {/* custom reset overlay or button if needed, but GithubPicker is quite compact */}
        <div className="bg-white dark:bg-[#222] border-t border-gray-100 dark:border-gray-800 p-2 rounded-b-md shadow-sm">
          <button 
            onClick={() => onSelect(null)}
            className="w-full py-1 px-3 text-[10px] font-bold text-gray-500 bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex items-center justify-center gap-2 border border-black/5 dark:border-white/5"
          >
            <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset to Random
          </button>
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;
