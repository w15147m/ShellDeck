import React from 'react';

const StickyHeader = ({ 
  searchQuery, 
  setSearchQuery, 
  isFilterMenuOpen, 
  setIsFilterMenuOpen, 
  statusFilter, 
  setStatusFilter,
  onAddNote,
  onMinimize,
  onClose,
  onToggleSettings
}) => {
  return (
    <div 
      className="px-6 py-3 flex items-center gap-3 bg-white dark:bg-gray-900 z-10"
      style={{ WebkitAppRegion: 'drag' }}
    >
      {/* Search Bar */}
      <div className="flex-1 max-w-[280px] flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden" style={{ WebkitAppRegion: 'no-drag' }}>
        <input 
          type="text" 
          placeholder="Search title . . ." 
          className="flex-1 px-4 py-1.5 border-none dark:bg-gray-800 dark:text-white focus:ring-0 outline-none text-[13px] placeholder:text-gray-300 dark:placeholder:text-gray-600"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="px-2.5 py-1 border-l border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <svg className="size-4 text-gray-900 dark:text-gray-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
      
      {/* Filter Button */}
      <div className="relative">
        <button 
          onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
          className="p-1 bg-brand-500 text-white rounded-lg shadow-theme-sm hover:bg-brand-600 transition-all focus:outline-none"
          style={{ WebkitAppRegion: 'no-drag' }}
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
        </button>

        {isFilterMenuOpen && (
          <>
            <div 
              className="fixed inset-0 z-20" 
              onClick={() => setIsFilterMenuOpen(false)}
            ></div>
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 z-30 overflow-hidden" style={{ WebkitAppRegion: 'no-drag' }}>
              {['All', 'To-do', 'Presentation', 'Hot Fix', 'Ready to Present'].map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setStatusFilter(status);
                    setIsFilterMenuOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-theme-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 ${
                    statusFilter === status ? 'text-brand-500 font-bold bg-brand-50/20 dark:bg-brand-500/10' : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Window Controls */}
      <div className="flex items-center gap-1 ml-auto" style={{ WebkitAppRegion: 'no-drag' }}>
        <button onClick={onToggleSettings} className="p-0.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800">
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
        <button onClick={onAddNote} className="p-0.5 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors focus:outline-none">
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
        <button 
          className="p-0.5 text-gray-900 dark:text-gray-100 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 rounded-lg transition-all focus:outline-none" 
          onClick={onClose}
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default StickyHeader;
