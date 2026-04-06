import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { WINDOW_WIDTH, DEFAULT_HEIGHT } from '../constants';
import Modal from './Modal';

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
    <Modal 
      isOpen={true} 
      onClose={onClose} 
      title="Settings"
      maxWidth="max-w-sm"
    >
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
    </Modal>
  );
};

export default SettingsModal;
