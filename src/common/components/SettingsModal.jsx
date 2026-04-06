import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { WINDOW_WIDTH, DEFAULT_HEIGHT } from '../constants';

const SettingsModal = ({ onClose }) => {
  const { theme, toggleTheme } = useTheme();
  const [settings, setSettings] = React.useState({ 
    launchOnStartup: false, 
    startInBackground: false,
    alwaysOnTop: false 
  });

  React.useEffect(() => {
    if (window.electron && window.electron.getAppSettings) {
      window.electron.getAppSettings().then(setSettings);
    }
  }, []);

  const handleToggle = (key) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    if (window.electron && window.electron.updateAppSettings) {
      window.electron.updateAppSettings(newSettings);
    }
  };

  return (
    <div 
      className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-[2px]"
      style={{ WebkitAppRegion: 'no-drag' }}
    >
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-sm w-full p-6 space-y-6 border border-gray-50 dark:border-gray-800 transition-colors">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Settings</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Dark Mode</span>
            <button 
              onClick={toggleTheme}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${theme === 'dark' ? 'bg-brand-500' : 'bg-gray-200'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Launch on Startup</span>
            <button 
              onClick={() => handleToggle('launchOnStartup')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.launchOnStartup ? 'bg-brand-500' : 'bg-gray-200'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.launchOnStartup ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Always on Top</span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400">Keep app over other windows</span>
            </div>
            <button 
              onClick={() => handleToggle('alwaysOnTop')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.alwaysOnTop ? 'bg-brand-500' : 'bg-gray-200'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.alwaysOnTop ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          {settings.launchOnStartup && (
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-xl animate-fade-in-down">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Start in Background</span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400">Keep main window hidden</span>
              </div>
              <button 
                onClick={() => handleToggle('startInBackground')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.startInBackground ? 'bg-brand-500' : 'bg-gray-200'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.startInBackground ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
