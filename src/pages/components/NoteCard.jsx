import React, { useState } from 'react';
import Badge from '../../common/components/Badge';
import ColorPicker from './ColorPicker';
import { getStickyColorById } from '../../common/utils/stickyColors';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const NoteCard = ({ note, onEdit, onDelete, onToggleStar, onUpdateColor, onTogglePin }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: note.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : (isPickerOpen ? 50 : 'auto'),
    opacity: isDragging ? 0.5 : 1,
    scale: isDragging ? 1.02 : 1,
  };

  const colorScheme = note.colorId ? getStickyColorById(note.colorId) : null;

  return (
    <div 
      ref={setNodeRef}
      style={{ ...style, ... (colorScheme ? { 
        backgroundColor: colorScheme.bg, 
        borderColor: colorScheme.border,
        color: colorScheme.text
      } : {})}}
      className={`rounded-xl border p-5 shadow-theme-xs hover:shadow-theme-md transition-all group relative flex flex-col ${colorScheme ? '' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700'} ${isDragging ? 'shadow-2xl z-50' : ''}`}
    >
      <div 
        className="flex justify-between items-start mb-3 cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <div className="flex items-center gap-2 flex-1">
          <h3 className={`text-theme-sm font-semibold truncate ${colorScheme ? '' : 'text-gray-900 dark:text-white'}`} style={colorScheme ? { color: colorScheme.title } : {}}>
            {note.title}
          </h3>
        </div>
        <div className="flex gap-1.5 transition-opacity" onPointerDown={e => e.stopPropagation()}>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className={`p-1.5 rounded-lg transition-colors ${colorScheme ? 'hover:bg-black/5' : (isExpanded ? 'text-brand-500 bg-brand-50' : 'text-gray-400 hover:text-brand-500 hover:bg-brand-50')}`}
            style={colorScheme ? { color: colorScheme.text } : {}}
            title={isExpanded ? "Collapse" : "Show full content"}
          >
            <svg className={`size-4.5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setIsPickerOpen(!isPickerOpen)}
              className={`p-1.5 rounded-lg transition-colors ${colorScheme ? 'hover:bg-black/5' : 'text-gray-400 hover:text-brand-500 hover:bg-brand-50'}`}
              style={colorScheme ? { color: colorScheme.text } : {}}
              title="Change color"
            >
              <svg className="size-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </button>
            {isPickerOpen && (
              <ColorPicker 
                selectedColorId={note.colorId}
                onSelect={(id) => {
                  onUpdateColor(note.id, id);
                  setIsPickerOpen(false);
                }}
                onClose={() => setIsPickerOpen(false)}
              />
            )}
          </div>

          <button 
            onClick={() => window.electron.detachNote(note)}
            className={`p-1.5 rounded-lg transition-colors ${colorScheme ? 'hover:bg-black/5' : 'text-gray-400 hover:text-brand-500 hover:bg-brand-50'}`}
            style={colorScheme ? { color: colorScheme.text } : {}}
            title="Stick to screen"
          >
            <svg className="size-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.414a4 4 0 00-5.656-5.656l-6.415 6.414a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>
          <button 
            onClick={() => onEdit(note)}
            className={`p-1.5 rounded-lg transition-colors ${colorScheme ? 'hover:bg-black/5' : 'text-gray-400 hover:text-brand-500 hover:bg-brand-50'}`}
            style={colorScheme ? { color: colorScheme.text } : {}}
          >
            <svg className="size-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button 
            onClick={() => onDelete(note.id)}
            className={`p-1.5 rounded-lg transition-colors ${colorScheme ? 'hover:bg-black/10' : 'text-gray-400 hover:text-error-500 hover:bg-error-50'}`}
            style={colorScheme ? { color: colorScheme.text } : {}}
          >
            <svg className="size-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      
      <div 
        className={`text-theme-sm mb-4 overflow-hidden prose prose-sm max-w-none ${isExpanded ? '' : 'line-clamp-2'} ${colorScheme ? '' : 'text-gray-600 dark:text-gray-400'}`}
        dangerouslySetInnerHTML={{ __html: note.content }}
        style={colorScheme ? { 
          color: colorScheme.text,
          '--tw-prose-body': colorScheme.text,
          '--tw-prose-headings': colorScheme.title,
          '--tw-prose-bullets': colorScheme.text,
          '--tw-prose-counters': colorScheme.text,
        } : {}}
      />

      <div 
        className="flex justify-between items-center mt-auto cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <Badge 
          color={note.statusColor || 'primary'} 
          size="sm" 
          variant={colorScheme ? 'solid' : 'solid'}
          className={colorScheme ? 'bg-black/10 text-inherit border-none' : ''}
          style={colorScheme ? { color: colorScheme.text, backgroundColor: 'rgba(0,0,0,0.1)' } : {}}
        >
          {note.status}
        </Badge>
        <div className={`flex items-center gap-2 text-theme-xs ${colorScheme ? '' : 'text-gray-400'}`} style={colorScheme ? { color: colorScheme.text } : {}}>
        <div className="flex gap-2 items-center" onPointerDown={e => e.stopPropagation()}>
          <button 
            onClick={(e) => { e.stopPropagation(); onToggleStar(note.id); }}
            className={`p-1 hover:bg-black/5 rounded-lg transition-colors`}
            style={colorScheme ? { color: colorScheme.text } : {}}
            title={note.starred ? "Unstar" : "Star"}
          >
            <svg 
              className={`size-4.5 transition-all ${note.starred ? 'fill-current text-amber-400' : 'text-gray-300 dark:text-gray-600 opacity-40 hover:opacity-100 hover:text-amber-400'}`} 
              fill={note.starred ? 'currentColor' : 'none'}
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth={note.starred ? 0 : 2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.921-.755 1.688-1.54 1.118l-3.976-2.888a1 1 0 00-1.175 0l-3.976 2.888c-.784.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </button>
          <span className={`text-[11px] font-medium ${colorScheme ? '' : 'text-gray-400 dark:text-gray-500'}`} style={colorScheme ? { color: colorScheme.text, opacity: 0.6 } : {}}>
            {note.date}
          </span>
        </div>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
