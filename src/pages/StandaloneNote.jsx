import React, { useState, useEffect, useRef } from 'react';
import { ThemeProvider } from '../common/context/ThemeContext';
import { STANDALONE_HEIGHT, STANDALONE_WIDTH } from '../common/constants';
import TinyMCEEditor from './components/TinyMCEEditor';
import ColorPicker from './components/ColorPicker';
import { getRandomStickyColor, getStickyColorById } from '../common/utils/stickyColors';

const StandaloneNoteContent = ({ noteId }) => {
  const [note, setNote] = useState(null);
  const [isExpanded, setIsExpanded] = useState(() => {
    const saved = localStorage.getItem(`standalone-expanded-${noteId}`);
    return saved === 'true';
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isAlwaysOnTop, setIsAlwaysOnTop] = useState(() => {
    // We can default to the global app setting, but for now default to false
    // so it doesn't conflict unexpectedly unless they toggle it
    return false;
  });
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [colorScheme, setColorScheme] = useState(() => getRandomStickyColor());
  const containerRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(`standalone-expanded-${noteId}`, isExpanded);
  }, [isExpanded, noteId]);

  useEffect(() => {
    const loadNote = () => {
      const savedNotes = localStorage.getItem('sticky-notes');
      if (savedNotes) {
        const notes = JSON.parse(savedNotes);
        const foundNote = notes.find(n => n.id === parseInt(noteId));
        setNote(foundNote);
        if (foundNote) {
          setEditTitle(foundNote.title);
          setEditContent(foundNote.content);
          
          if (foundNote.colorId) {
            setColorScheme(getStickyColorById(foundNote.colorId));
          }
        } else {
          // GHOST NOTE DETECTED: Note data is missing from localStorage.
          // Self-destruct by notifying the main process to close this window and clear persistent state.
          if (window.electron && window.electron.deleteNote) {
            console.log(`Ghost note ${noteId} detected. Self-destructing...`);
            window.electron.deleteNote(parseInt(noteId));
          }
        }
      }
    };

    loadNote();

    const handleStorage = (e) => {
      if (e.key === 'sticky-notes') {
        loadNote();
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [noteId]);

  // Sync window size with content when expanded
  useEffect(() => {
    if (!window.electron || !window.electron.setWindowSize) return;

    if (!isExpanded && !isEditing) {
      window.electron.setWindowSize(STANDALONE_WIDTH, STANDALONE_HEIGHT);
      return;
    }

    // Always expand sufficiently when editing
    if (isEditing) {
      window.electron.setWindowSize(Math.max(window.innerWidth, 400), Math.max(window.innerHeight, 500));
    }

    const observer = new ResizeObserver(() => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const padding = 2; // Minor buffer
        window.electron.setWindowSize(
          Math.max(Math.ceil(rect.width) + padding, isEditing ? 300 : STANDALONE_WIDTH),
          Math.max(Math.ceil(rect.height) + padding, isEditing ? 400 : 0)
        );
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [isExpanded, isEditing]);

  const handleSaveNote = (directContent) => {
    const finalContent = directContent !== undefined ? directContent : editContent;
    const savedNotes = localStorage.getItem('sticky-notes');
    if (savedNotes) {
      const notes = JSON.parse(savedNotes);
      const updatedNotes = notes.map(n => 
        n.id === parseInt(noteId) 
          ? { ...n, title: editTitle, content: finalContent, date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) } 
          : n
      );
      localStorage.setItem('sticky-notes', JSON.stringify(updatedNotes));
      
      // Update local state
      const updatedNote = updatedNotes.find(n => n.id === parseInt(noteId));
      setNote(updatedNote);
      setEditContent(finalContent);
      setIsEditing(false);
    }
  };

  const handleUpdateColor = (colorId) => {
    const savedNotes = localStorage.getItem('sticky-notes');
    if (savedNotes) {
      const notes = JSON.parse(savedNotes);
      const updatedNotes = notes.map(n => 
        n.id === parseInt(noteId) 
          ? { ...n, colorId } 
          : n
      );
      localStorage.setItem('sticky-notes', JSON.stringify(updatedNotes));
      
      // Update local state
      const updatedColor = colorId ? getStickyColorById(colorId) : getRandomStickyColor();
      setColorScheme(updatedColor);
      setNote(updatedNotes.find(n => n.id === parseInt(noteId)));
      setIsPickerOpen(false);
    }
  };

  const handleToggleStar = () => {
    const savedNotes = localStorage.getItem('sticky-notes');
    if (savedNotes) {
      const notes = JSON.parse(savedNotes);
      const updatedNotes = notes.map(n => 
        n.id === parseInt(noteId) 
          ? { ...n, starred: !n.starred } 
          : n
      );
      localStorage.setItem('sticky-notes', JSON.stringify(updatedNotes));
      setNote(updatedNotes.find(n => n.id === parseInt(noteId)));
    }
  };

  const handleTogglePin = () => {
    const savedNotes = localStorage.getItem('sticky-notes');
    if (savedNotes) {
      const notes = JSON.parse(savedNotes);
      const updatedNotes = notes.map(n => 
        n.id === parseInt(noteId) 
          ? { ...n, pinned: !n.pinned } 
          : n
      );
      const isPinned = !note.pinned;
      if (window.electron && window.electron.setPinnedNote) {
        window.electron.setPinnedNote(parseInt(noteId), isPinned);
      }
      localStorage.setItem('sticky-notes', JSON.stringify(updatedNotes));
      setNote(updatedNotes.find(n => n.id === parseInt(noteId)));
    }
  };

  const handleToggleAlwaysOnTop = () => {
    const newState = !isAlwaysOnTop;
    setIsAlwaysOnTop(newState);
    if (window.electron && window.electron.toggleStandaloneAlwaysOnTop) {
      window.electron.toggleStandaloneAlwaysOnTop(noteId, newState);
    }
  };

  if (!note) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-amber-200 rounded-2xl text-amber-900">
        <p>Loading...</p>
      </div>
    );
  }

  const isDarkColor = colorScheme.text === '#FFFFFF';

  return (
    <div 
      ref={containerRef}
      className={`flex flex-col rounded-2xl shadow-xl select-none group border-t border-white/30 ${isExpanded || isEditing ? 'w-fit max-w-[450px] min-w-[300px]' : 'w-[300px] h-[300px]'}`}
      style={{ 
        WebkitAppRegion: isEditing ? 'no-drag' : 'drag',
        backgroundColor: colorScheme.bg,
        borderColor: colorScheme.border,
        // Ensure rounded corners still work without overflow-hidden on parent
        borderRadius: '1rem' 
      }}
    >
      {/* Header / Grab Handle */}
      <div className="flex justify-between items-center mb-2 transition-opacity p-4 pb-0 shrink-0">
         {isEditing ? (
           <div className="flex-1 mr-4">
             <input
               type="text"
               value={editTitle}
               onChange={(e) => setEditTitle(e.target.value)}
               className={`w-full bg-black/5 rounded px-2 py-0.5 outline-none font-bold text-sm ${!editTitle.trim() ? 'border border-error-500' : ''}`}
               style={{ color: colorScheme.title }}
               placeholder="Title..."
               autoFocus
             />
             {!editTitle.trim() && (
               <div className="text-[9px] text-error-500 font-bold uppercase mt-1 animate-pulse">Required</div>
             )}
           </div>
         ) : (
           <span 
             className="text-sm font-bold truncate max-w-[180px] opacity-90 shadow-sm font-outfit"
             style={{ color: colorScheme.title }}
             title={note.title}
           >
             {note.title || 'Note'}
           </span>
         )}
         <div className="flex gap-1 ml-4" style={{ WebkitAppRegion: 'no-drag' }}>
           {!isEditing && (
             <>
                <button 
                  onClick={handleTogglePin}
                  className={`p-1 rounded-lg transition-colors hover:bg-black/5 ${note.pinned ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}
                  style={{ color: colorScheme.text }}
                  title={note.pinned ? "Unpin from desktop" : "Pin to desktop"}
                >
                  <svg 
                    className={`size-4 transition-transform duration-200`} 
                    fill="currentColor" 
                    viewBox="0 0 640 640"
                    style={{ transform: 'rotate(45deg)' }}
                  >
                    {note.pinned ? (
                      <path d="M160 96C160 78.3 174.3 64 192 64L448 64C465.7 64 480 78.3 480 96C480 113.7 465.7 128 448 128L418.5 128L428.8 262.1C465.9 283.3 494.6 318.5 507 361.8L510.8 375.2C513.6 384.9 511.6 395.2 505.6 403.3C499.6 411.4 490 416 480 416L160 416C150 416 140.5 411.3 134.5 403.3C128.5 395.3 126.5 384.9 129.3 375.2L133 361.8C145.4 318.5 174 283.3 211.2 262.1L221.5 128L192 128C174.3 128 160 113.7 160 96zM288 464L352 464L352 576C352 593.7 337.7 608 320 608C302.3 608 288 593.7 288 576L288 464z" />
                    ) : (
                      <path d="M73 39.1C63.6 29.7 48.4 29.7 39.1 39.1C29.8 48.5 29.7 63.7 39 73.1L567 601.1C576.4 610.5 591.6 610.5 600.9 601.1C610.2 591.7 610.3 576.5 600.9 567.2L449.8 416L480 416C490 416 499.5 411.3 505.5 403.3C511.5 395.3 513.5 384.9 510.7 375.2L507 361.8C494.6 318.5 466 283.3 428.8 262.1L418.5 128L448 128C465.7 128 480 113.7 480 96C480 78.3 465.7 64 448 64L192 64C184.6 64 177.9 66.5 172.5 70.6L222.1 120.3L217.3 183.4L73 39.1zM314.2 416L181.7 283.6C159 304.1 141.9 331 133 361.9L129.2 375.3C126.4 385 128.4 395.3 134.4 403.4C140.4 411.5 150 416 160 416L314.2 416zM288 576C288 593.7 302.3 608 320 608C337.7 608 352 593.7 352 576L352 464L288 464L288 576z" />
                    )}
                  </svg>
                </button>
               <button 
                 onClick={handleToggleAlwaysOnTop}
                 className={`p-1 rounded-lg transition-colors hover:bg-black/5 ${isAlwaysOnTop ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}
                 style={{ color: colorScheme.text }}
                 title={isAlwaysOnTop ? "Remove Always on Top" : "Keep Always on Top"}
               >
                 <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   {isAlwaysOnTop ? (
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                   ) : (
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                   )}
                 </svg>
               </button>
               <button 
                 onClick={() => setIsExpanded(!isExpanded)}
                 className={`p-1 rounded-lg transition-colors hover:bg-black/5`}
                 style={{ color: colorScheme.text }}
                 title={isExpanded ? "Collapse" : "Show full content"}
               >
                 <svg className={`size-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                 </svg>
               </button>
                
                <div className="relative">
                  <button 
                    onClick={() => setIsPickerOpen(!isPickerOpen)}
                    className="p-1 hover:bg-black/5 rounded-lg transition-colors"
                    style={{ color: colorScheme.text }}
                    title="Change color"
                  >
                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                  </button>
                  {isPickerOpen && (
                    <ColorPicker 
                      selectedColorId={note.colorId}
                      onSelect={handleUpdateColor}
                      onClose={() => setIsPickerOpen(false)}
                    />
                  )}
                </div>

               <button 
                 onClick={() => setIsEditing(true)}
                 className="p-1 hover:bg-black/5 rounded-lg transition-colors"
                 style={{ color: colorScheme.text }}
                 title="Edit note"
               >
                 <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                 </svg>
               </button>
             </>
           )}
           {isEditing && (
             <button 
               onClick={() => setIsEditing(false)}
               className="p-1 hover:bg-black/10 rounded-lg transition-colors"
               style={{ color: colorScheme.text }}
               title="Cancel editing"
             >
               <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
               </svg>
             </button>
           )}
           {!isEditing && (
             <button 
               onClick={() => window.electron.close()}
               className="p-1 hover:bg-black/10 rounded-lg transition-colors"
               style={{ color: colorScheme.text }}
             >
               <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 8l-8 8m0-8l8 8" />
               </svg>
             </button>
           )}
         </div>
      </div>

      <div className="p-4 pt-0 flex flex-col h-full overflow-hidden w-fit max-w-full">
        {isEditing ? (
          <div className="w-[450px] flex flex-col space-y-3 p-1">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full px-2 py-1 text-base font-bold bg-white/20 border border-black/10 rounded-lg focus:ring-1 focus:ring-black/20 outline-none font-outfit"
              style={{ color: colorScheme.title }}
              placeholder="Title..."
              autoFocus
            />
            <div className="flex-1 min-h-[300px] border border-black/10 rounded-xl overflow-hidden shadow-inner bg-white/50">
               <TinyMCEEditor 
                 value={editContent} 
                 onChange={setEditContent} 
                 onSave={handleSaveNote}
                 theme="light"
               />
            </div>
          </div>
        ) : (
          <>
            <div 
              className={`text-[14px] prose prose-sm max-w-none prose-p:my-1 font-outfit ${isExpanded ? 'w-fit min-w-[200px]' : 'flex-1 overflow-hidden w-full'}`}
              style={{ 
                color: colorScheme.text,
                '--tw-prose-body': colorScheme.text,
                '--tw-prose-headings': colorScheme.title,
                '--tw-prose-bullets': colorScheme.text,
                '--tw-prose-counters': colorScheme.text,
              }}
              dangerouslySetInnerHTML={{ __html: note.content }}
            />

            <div 
              className="mt-3 pt-3 border-t flex justify-between items-center transition-opacity w-full"
              style={{ borderTopColor: 'rgba(0,0,0,0.1)' }}
            >
               <span 
                 className="text-[10px] font-bold uppercase whitespace-nowrap opacity-60 mr-4"
                 style={{ color: colorScheme.text }}
               >
                 {note.date}
               </span>
                <div className="flex gap-1 items-center ml-4">
                  <button 
                    onClick={handleToggleStar}
                    className="p-1 hover:bg-black/5 rounded-lg transition-colors"
                    title={note.starred ? "Unstar" : "Star"}
                  >
                    <svg 
                      className={`size-3.5 transition-all ${note.starred ? 'fill-current text-amber-500' : 'text-gray-400 opacity-40 hover:opacity-100'}`} 
                      fill={note.starred ? 'currentColor' : 'none'}
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={note.starred ? 0 : 2.5}
                    >
                      <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.921-.755 1.688-1.54 1.118l-3.976-2.888a1 1 0 00-1.175 0l-3.976 2.888c-.784.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </button>
                </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const StandaloneNote = ({ noteId }) => (
  <ThemeProvider>
    <StandaloneNoteContent noteId={noteId} />
  </ThemeProvider>
);

export default StandaloneNote;
