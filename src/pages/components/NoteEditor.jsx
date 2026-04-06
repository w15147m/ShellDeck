import React, { useState, useEffect } from 'react';
import { useTheme } from '../../common/context/ThemeContext';
import TinyMCEEditor from './TinyMCEEditor';
import CreatableSelect from 'react-select/creatable';

const statusOptions = [
  { value: 'To-do', label: 'To-do', color: 'primary' },
  { value: 'Presentation', label: 'Presentation', color: 'brand' },
  { value: 'Hot Fix', label: 'Hot Fix', color: 'error' },
  { value: 'Ready to Present', label: 'Ready to Present', color: 'success' },
];

const getCustomStyles = (theme) => ({
  control: (base, state) => ({
    ...base,
    border: 'none',
    boxShadow: 'none',
    minHeight: 'auto',
    background: 'transparent',
    cursor: 'pointer',
    padding: 0,
    fontSize: '0.875rem', // theme-sm
    fontWeight: '700', // bold
    color: theme === 'dark' ? '#F9FAFB' : '#111827', // gray-50 or gray-900
    '&:hover': {
      border: 'none',
    },
  }),
  valueContainer: (base) => ({
    ...base,
    padding: 0,
  }),
  input: (base) => ({
    ...base,
    margin: 0,
    padding: 0,
    color: theme === 'dark' ? '#F9FAFB' : '#111827',
  }),
  singleValue: (base) => ({
    ...base,
    color: theme === 'dark' ? '#F9FAFB' : '#111827',
  }),
  placeholder: (base) => ({
    ...base,
    color: theme === 'dark' ? '#4B5563' : '#D1D5DB', // gray-600 or gray-300
  }),
  dropdownIndicator: (base) => ({
    ...base,
    padding: 0,
    color: '#9CA3AF', // gray-400
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  menu: (base) => ({
    ...base,
    borderRadius: '1rem',
    overflow: 'hidden',
    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    border: theme === 'dark' ? '1px solid #374151' : '1px solid #F3F4F6',
    backgroundColor: theme === 'dark' ? '#111827' : 'white',
    zIndex: 100,
  }),
  option: (base, { isFocused, isSelected }) => ({
    ...base,
    fontSize: '0.8125rem',
    fontWeight: '500',
    backgroundColor: isSelected 
      ? '#3B82F6' 
      : isFocused 
        ? (theme === 'dark' ? '#1F2937' : '#EFF6FF') 
        : 'transparent',
    color: isSelected ? 'white' : (theme === 'dark' ? '#D1D5DB' : '#374151'),
    cursor: 'pointer',
    '&:active': {
      backgroundColor: theme === 'dark' ? '#374151' : '#DBEAFE',
    },
  }),
});

const CUSTOM_STATUS_KEY = 'custom-status-options';

const NoteEditor = ({ note, onSave, onClose }) => {
  const { theme } = useTheme();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState(null);
  const [starred, setStarred] = useState(false);
  const [errors, setErrors] = useState({});
  const customStyles = getCustomStyles(theme);
  const [options, setOptions] = useState(() => {
    const saved = localStorage.getItem(CUSTOM_STATUS_KEY);
    const custom = saved ? JSON.parse(saved) : [];
    return [...statusOptions, ...custom];
  });

  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setContent(note.content || '');
      setStatus(note.status || null);
      setStarred(note.starred || false);
      
      if (note.status && !options.find(opt => opt.value === note.status)) {
        const newOpt = { value: note.status, label: note.status, color: note.statusColor || 'primary' };
        setOptions(prev => [...prev, newOpt]);
      }
    }
  }, [note]);

  const validate = (finalContent) => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = true;
    if (!status) newErrors.status = true;
    
    // TinyMCE often leaves empty paragraphs like <p><br></p> or just <p></p>
    const plainText = finalContent.replace(/<[^>]*>/g, '').trim();
    if (!plainText && !finalContent.includes('<img')) newErrors.content = true;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (directContent) => {
    const finalContent = directContent !== undefined ? directContent : content;
    
    if (!validate(finalContent)) {
      return;
    }

    const currentStatusOption = options.find(opt => opt.value === status);
    onSave({
      ...note,
      title,
      content: finalContent,
      starred,
      status: status,
      statusColor: currentStatusOption?.color || 'primary',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
    });
  };

  const handleCreateStatus = (inputValue) => {
    const newOption = { value: inputValue, label: inputValue, color: 'primary' };
    const updatedOptions = [...options, newOption];
    setOptions(updatedOptions);
    setStatus(inputValue);
    
    // Persist only the custom ones
    const customOptions = updatedOptions.filter(opt => !statusOptions.find(defaultOpt => defaultOpt.value === opt.value));
    localStorage.setItem(CUSTOM_STATUS_KEY, JSON.stringify(customOptions));
  };

  return (
    <div 
      className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-[2px]"
      style={{ WebkitAppRegion: 'no-drag' }}
    >
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-2xl w-full max-h-full flex flex-col overflow-hidden border border-gray-50 dark:border-gray-800 transition-colors">
        {/* Simplified Minimalist Header */}
        <div className="px-8 pt-4 pb-2 flex justify-between items-center bg-white dark:bg-gray-900">
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="text-gray-900 dark:text-gray-100 hover:text-brand-500 transition-colors cursor-pointer p-1">
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h2 className="text-theme-sm font-bold text-gray-900 dark:text-white">Note</h2>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                // We'll store this locally in the component state
                setStarred(!starred);
              }}
              className={`p-1 transition-colors ${starred ? 'text-warning-500 hover:text-warning-600' : 'text-gray-400 hover:text-warning-400'}`}
              title={starred ? "Unstar" : "Star"}
            >
              <svg className={`size-5 ${starred ? 'fill-current' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.921-.755 1.688-1.54 1.118l-3.976-2.888a1 1 0 00-1.175 0l-3.976 2.888c-.784.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors cursor-pointer p-1">
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="px-8 pb-8 space-y-2 flex-1 flex flex-col min-h-0">
          <div className={`grid grid-cols-2 gap-10 border rounded-2xl p-4 transition-all ${Object.keys(errors).some(k => k === 'title' || k === 'status') ? 'border-error-500 bg-error-50/10' : 'border-gray-100 dark:border-gray-800'}`}>
            <div className={`group border-b focus-within:border-brand-500 transition-colors py-1 ${errors.title ? 'border-error-500' : 'border-gray-50 dark:border-gray-800'}`}>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors(prev => ({ ...prev, title: false }));
                }}
                className="w-full px-0 py-0 text-theme-sm font-bold border-none dark:bg-gray-900 focus:ring-0 outline-none placeholder:text-gray-300 dark:placeholder:text-gray-600 transition-all text-gray-900 dark:text-white"
                placeholder={errors.title ? "Title is required!" : "Enter title..."}
              />
            </div>

            <div className={`group border-b focus-within:border-brand-500 transition-colors py-1 ${errors.status ? 'border-error-500' : 'border-gray-50 dark:border-gray-800'}`}>
              <CreatableSelect
                value={options.find(opt => opt.value === status)}
                onChange={(option) => {
                  setStatus(option ? option.value : null);
                  if (errors.status) setErrors(prev => ({ ...prev, status: false }));
                }}
                onCreateOption={handleCreateStatus}
                options={options}
                styles={customStyles}
                isSearchable={true}
                isClearable={true}
                placeholder={errors.status ? "Status required!" : "status..."}
              />
            </div>
          </div>

          <div className={`flex-1 flex flex-col min-h-0 rounded-xl overflow-hidden border transition-all ${errors.content ? 'border-error-500 bg-error-50/10' : 'border-transparent'}`}>
             <TinyMCEEditor 
               value={content} 
               onChange={(val) => {
                 setContent(val);
                 if (errors.content) setErrors(prev => ({ ...prev, content: false }));
               }} 
               onSave={handleSave}
               theme={theme}
             />
          </div>
          {Object.keys(errors).length > 0 && (
            <p className="text-error-500 text-[10px] font-bold uppercase tracking-wider animate-pulse pt-2 text-center">
              Please fill in all required fields to save.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;
