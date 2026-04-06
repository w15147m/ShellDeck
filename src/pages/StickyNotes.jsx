import React, { useState, useEffect, useRef } from "react";
import NoteCard from "./components/NoteCard";
import NoteEditor from "./components/NoteEditor";
import AppHeader from "../common/components/AppHeader";
import FilterBar from "../common/components/FilterBar";
import SettingsModal from "../common/components/SettingsModal";
import { MAX_WINDOW_HEIGHT, APP_PADDING } from "../common/constants";
import { ThemeProvider } from "../common/context/ThemeContext";
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

const StickyNotes = () => {
  const [notes, setNotes] = useState([]);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [appVersion, setAppVersion] = useState('');

  // DND Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Avoid accidental drags
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Load notes from localStorage
  useEffect(() => {
    const loadNotes = () => {
      const savedNotes = localStorage.getItem("sticky-notes");
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      } else {
        // Sample data based on mockup
        const sampleNotes = [
          {
            id: 1,
            title: "Presentation",
            content:
              "Add Membership on sidbar and show only for admin and compony Refine code Add users count o ...",
            status: "Ready to Present",
            statusColor: "success",
            date: "03 Feb",
            starred: true,
          },
          {
            id: 2,
            title: "To-do",
            content: "Setup database for plan item",
            status: "Hot Fix",
            statusColor: "error",
            date: "03 Feb",
            starred: true,
          },
        ];
        setNotes(sampleNotes);
        localStorage.setItem("sticky-notes", JSON.stringify(sampleNotes));
      }
    };

    loadNotes();

    const handleStorage = (e) => {
      if (e.key === "sticky-notes" && e.newValue) {
        setNotes(JSON.parse(e.newValue));
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Fetch app version from main process
  useEffect(() => {
    const fetchVersion = async () => {
      if (window.electron?.getAppVersion) {
        const version = await window.electron.getAppVersion();
        setAppVersion(version);
      }
    };
    fetchVersion();
  }, []);

  // Save notes to localStorage
  const saveNotes = (newNotes) => {
    setNotes(newNotes);
    localStorage.setItem("sticky-notes", JSON.stringify(newNotes));
  };

  const handleAddNote = () => {
    setEditingNote(null);
    setIsEditorOpen(true);
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setIsEditorOpen(true);
  };

  const handleDeleteNote = (id) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      saveNotes(notes.filter((n) => n.id !== id));
      if (window.electron && window.electron.deleteNote) {
        window.electron.deleteNote(id);
      }
    }
  };

  const handleSaveNote = (noteData) => {
    if (editingNote) {
      saveNotes(
        notes.map((n) =>
          n.id === editingNote.id ? { ...noteData, id: n.id } : n,
        ),
      );
    } else {
      saveNotes([...notes, { ...noteData, id: Date.now() }]);
    }
    setIsEditorOpen(false);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("All");
  };

  const handleToggleStar = (id) => {
    saveNotes(
      notes.map((n) => (n.id === id ? { ...n, starred: !n.starred } : n)),
    );
  };

  const handleUpdateNoteColor = (id, colorId) => {
    saveNotes(notes.map((n) => (n.id === id ? { ...n, colorId } : n)));
  };

  const handleTogglePin = (id) => {
    const updatedNotes = notes.map((n) => {
      if (n.id === id) {
        const isPinned = !n.pinned;
        // If pinning, auto-detach
        if (isPinned && window.electron && window.electron.detachNote) {
          window.electron.detachNote(n);
        }
        if (window.electron && window.electron.setPinnedNote) {
          window.electron.setPinnedNote(n.id, isPinned);
        }
        return { ...n, pinned: isPinned };
      }
      return n;
    });
    saveNotes(updatedNotes);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = notes.findIndex((n) => n.id === active.id);
      const newIndex = notes.findIndex((n) => n.id === over.id);

      const newOrder = arrayMove(notes, oldIndex, newIndex);
      saveNotes(newOrder);
    }
  };

  const filteredNotes = notes
    .filter((note) => {
      const matchesSearch =
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "All" || note.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

  const containerRef = useRef(null);

  // Sync window height with content
  useEffect(() => {
    if (!window.electron || !window.electron.setWindowHeight) return;

    const observer = new ResizeObserver(() => {
      if (isEditorOpen) {
        window.electron.setWindowHeight(MAX_WINDOW_HEIGHT);
      } else if (containerRef.current) {
        const contentHeight = containerRef.current.scrollHeight;
        window.electron.setWindowHeight(contentHeight + APP_PADDING);
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [isEditorOpen]);

  return (
    <div className="relative p-2 font-outfit text-gray-900 rounded-[40px] overflow-hidden h-full">
      {/* Main App Container - Auto-resizes based on content height, but forced to full height when editor is open */}
      <div
        ref={containerRef}
        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col shadow-none rounded-3xl transition-colors"
        style={{
          height: isEditorOpen
            ? `${MAX_WINDOW_HEIGHT - APP_PADDING}px`
            : "auto",
          maxHeight: `${MAX_WINDOW_HEIGHT - APP_PADDING}px`,
        }}
      >
        <AppHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isFilterMenuOpen={isFilterMenuOpen}
          setIsFilterMenuOpen={setIsFilterMenuOpen}
          filterOptions={['All', 'To-do', 'Presentation', 'Hot Fix', 'Ready to Present']}
          activeFilter={statusFilter}
          onFilterChange={setStatusFilter}
          onAction={handleAddNote}
          onClose={() => window.electron.close()}
          onToggleSettings={() => setIsSettingsOpen(true)}
        />

        <FilterBar
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          onClearFilters={handleClearFilters}
          onClearStatus={() => setStatusFilter("All")}
          onClearSearch={() => setSearchQuery("")}
        />

        {/* Note List */}
        <div className="px-6 pb-6 pt-2 space-y-4 flex-1 overflow-y-auto custom-scrollbar bg-gray-50/50 dark:bg-gray-900/50">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={filteredNotes.map((n) => n.id)}
              strategy={verticalListSortingStrategy}
            >
              {filteredNotes.length > 0 ? (
                filteredNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onEdit={handleEditNote}
                    onDelete={handleDeleteNote}
                    onToggleStar={handleToggleStar}
                    onUpdateColor={handleUpdateNoteColor}
                    onTogglePin={handleTogglePin}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-400 dark:text-gray-500">
                    No notes found matching your search.
                  </p>
                </div>
              )}
            </SortableContext>
          </DndContext>

          {/* Version Footer */}
          <div className="w-full flex justify-end opacity-30 select-none">
            <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
              {appVersion}
            </span>
          </div>
        </div>
      </div>

      {/* Editor Modal - Independent overlay that covers the whole 700px window */}
      {isEditorOpen && (
        <NoteEditor
          note={editingNote}
          onSave={handleSaveNote}
          onClose={() => setIsEditorOpen(false)}
        />
      )}

      {isSettingsOpen && (
        <SettingsModal onClose={() => setIsSettingsOpen(false)} />
      )}
    </div>
  );
};

const WrappedStickyNotes = () => (
  <ThemeProvider>
    <StickyNotes />
  </ThemeProvider>
);

export default WrappedStickyNotes;
