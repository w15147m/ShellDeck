import React, { useState, useEffect, useRef } from "react";
import AppHeader from "../common/components/AppHeader";
import FilterBar from "../common/components/FilterBar";
import SettingsModal from "../common/components/SettingsModal";
import { ThemeProvider } from "../common/context/ThemeContext";
import { MAX_WINDOW_HEIGHT, APP_PADDING } from "../common/constants";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [appVersion, setAppVersion] = useState('');
  
  const containerRef = useRef(null);

  // Sync window height with content
  useEffect(() => {
    if (!window.electron || !window.electron.setWindowHeight || !containerRef.current) return;
    const observer = new ResizeObserver(() => {
      const contentHeight = containerRef.current.scrollHeight;
      window.electron.setWindowHeight(contentHeight + APP_PADDING);
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Fetch app version
  useEffect(() => {
    if (window.electron?.getAppVersion) {
      window.electron.getAppVersion().then(setAppVersion);
    }
  }, []);

  const handleClearFilters = () => {
    setSearchQuery("");
    setActiveFilter("All");
  };

  return (
    <div className="relative p-2 font-outfit text-gray-900 rounded-[40px] overflow-hidden h-full">
      <div
        ref={containerRef}
        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col shadow-none rounded-3xl transition-colors"
        style={{ minHeight: '200px', maxHeight: `${MAX_WINDOW_HEIGHT - APP_PADDING}px` }}
      >
        <AppHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isFilterMenuOpen={isFilterMenuOpen}
          setIsFilterMenuOpen={setIsFilterMenuOpen}
          filterOptions={['All', 'Example A', 'Example B']}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          onAction={() => console.log("Action Triggered")}
          onClose={() => window.electron.close()}
          onToggleSettings={() => setIsSettingsOpen(true)}
        />

        <FilterBar
          searchQuery={searchQuery}
          statusFilter={activeFilter}
          onClearFilters={handleClearFilters}
          onClearStatus={() => setActiveFilter("All")}
          onClearSearch={() => setSearchQuery("")}
        />

        {/* Dynamic Content Area */}
        <div className="px-6 pb-6 pt-2 space-y-4 flex-1 overflow-y-auto custom-scrollbar bg-gray-50/50 dark:bg-gray-900/50 min-h-[300px]">
          <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
            <div className="p-4 bg-brand-500/10 rounded-full">
              <svg className="size-12 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Welcome to your new App!</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                This is a clean starter template for your next Electron project. Everything is pre-configured and ready to go.
              </p>
            </div>
          </div>

          {/* Version Footer */}
          <div className="w-full flex justify-end opacity-30 select-none mt-auto">
            <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
              {appVersion}
            </span>
          </div>
        </div>
      </div>

      {isSettingsOpen && (
        <SettingsModal onClose={() => setIsSettingsOpen(false)} />
      )}
    </div>
  );
};

const WrappedHome = () => (
  <ThemeProvider>
    <Home />
  </ThemeProvider>
);

export default WrappedHome;
