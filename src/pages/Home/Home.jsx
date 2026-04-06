import React, { useState, useEffect, useRef } from "react";
import AppHeader from "../../common/components/AppHeader";
import FilterBar from "../../common/components/FilterBar";
import SettingsModal from "../../common/components/SettingsModal";
import ItemCard from "./components/ItemCard";
import ItemEditor from "./components/ItemEditor";
import ExecutionModal from "./components/ExecutionModal";
import CommandOutputModal from "./components/CommandOutputModal";
import NoData from "../../common/components/NoData";
import { ThemeProvider } from "../../common/context/ThemeContext";
import { MAX_WINDOW_HEIGHT, APP_PADDING } from "../../common/constants";
import { toastSuccess, toastError, swalConfirm } from "../../common/utils/swal.utils";

const Home = () => {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [pendingExecutionItem, setPendingExecutionItem] = useState(null);
  const [executingItemId, setExecutingItemId] = useState(null);
  const [commandOutputState, setCommandOutputState] = useState(null);
  const [appVersion, setAppVersion] = useState('');
  
  const containerRef = useRef(null);

  // Sync window height with content
  useEffect(() => {
    if (!window.electron || !window.electron.setWindowHeight || !containerRef.current) return;
    const observer = new ResizeObserver(() => {
      if (isEditorOpen) {
        window.electron.setWindowHeight(MAX_WINDOW_HEIGHT);
      } else {
        const contentHeight = containerRef.current.scrollHeight;
        window.electron.setWindowHeight(contentHeight + APP_PADDING);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [isEditorOpen]);

  // Handle Streaming Command Output
  useEffect(() => {
    if (window.electron && window.electron.onCommandOutput) {
      window.electron.onCommandOutput((data) => {
        setCommandOutputState(prev => {
          if (!prev) return prev;
          return { 
            ...prev, 
            output: (prev.output || '') + data.data 
          };
        });
      });

      window.electron.onCommandFinished((data) => {
        setExecutingItemId(null);
        setCommandOutputState(prev => prev ? { ...prev, isRunning: false } : null);
      });
    }

    return () => {
      if (window.electron && window.electron.removeCommandListeners) {
        window.electron.removeCommandListeners();
      }
    };
  }, []);

  // Fetch Items from Database
  const fetchItems = async () => {
    if (window.electron?.dbGetItems) {
      const dbItems = await window.electron.dbGetItems();
      setItems(dbItems);
    }
  };

  useEffect(() => {
    fetchItems();
    if (window.electron?.getAppVersion) {
      window.electron.getAppVersion().then(setAppVersion);
    }
  }, []);

  const handleCreateItem = () => {
    setEditingItem(null);
    setIsEditorOpen(true);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setIsEditorOpen(true);
  };

  const handleSaveItem = async (itemData) => {
    try {
      console.log('Sending item to database:', itemData);
      await window.electron.dbSaveItem(itemData);
      setIsEditorOpen(false);
      fetchItems();
      toastSuccess(editingItem ? "Record updated" : "Record created!");
    } catch (err) {
      console.error('Database Save Failure:', err);
      toastError(err.message);
    }
  };

  const handleDeleteItem = async (id) => {
    const isConfirmed = await swalConfirm({
      title: "Delete Record?",
      text: "This action cannot be undone.",
      confirmText: "Yes, delete it"
    });

    if (isConfirmed.isConfirmed) {
      await window.electron.dbDeleteItem(id);
      fetchItems();
      toastSuccess("Record deleted");
    }
  };

  const handleToggleStar = async (item) => {
    await window.electron.dbSaveItem({ ...item, starred: !item.starred });
    fetchItems();
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setActiveFilter("All");
  };

  const handleRunCommand = (item) => {
    if (item.needsInput || item.needsLocation) {
      setPendingExecutionItem(item);
      return;
    }
    executeFinalCommand(item.content, item.id, item.title);
  };

  const executeFinalCommand = async (commandText, itemId, itemTitle) => {
    try {
      if (!commandText?.trim()) return toastError("No command text found to run.");
      
      // Reset Modal and Show Immediately
      setCommandOutputState({ 
        title: itemTitle, 
        output: '', 
        error: null, 
        isSuccess: true,
        isRunning: true 
      });
      
      if (itemId) setExecutingItemId(itemId);
      
      // Start streaming
      window.electron.executeCommandStream(commandText);
      
    } catch (err) {
      if (itemId) setExecutingItemId(null);
      toastError("Failed to communicate with bridge.");
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || item.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="relative p-2 font-outfit text-gray-900 rounded-[40px] overflow-hidden h-full">
      <div
        ref={containerRef}
        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col shadow-none rounded-3xl transition-colors"
        style={{ 
          height: isEditorOpen ? `${MAX_WINDOW_HEIGHT - APP_PADDING}px` : 'auto',
          minHeight: '200px', 
          maxHeight: `${MAX_WINDOW_HEIGHT - APP_PADDING}px` 
        }}
      >
        <AppHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isFilterMenuOpen={isFilterMenuOpen}
          setIsFilterMenuOpen={setIsFilterMenuOpen}
          filterOptions={['All', 'To-do', 'Ready', 'In-Progress']}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          onAction={handleCreateItem}
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
        <div className="px-6 pb-6 pt-2 space-y-4 flex-1 overflow-y-auto custom-scrollbar bg-gray-50/50 dark:bg-gray-900/50 min-h-[400px]">
          {filteredItems.length > 0 ? (
            <div className="grid gap-3 py-2">
              {filteredItems.map(item => (
                <ItemCard 
                  key={item.id} 
                  item={item} 
                  onEdit={handleEditItem}
                  onDelete={handleDeleteItem}
                  onToggleStar={handleToggleStar}
                  onRun={() => handleRunCommand(item)}
                  isExecuting={executingItemId === item.id}
                />
              ))}
            </div>
          ) : (
            <NoData 
              title="Full Database CRUD Test"
              message="Click the plus button above to add a real record to your SQLite database."
            />
          )}
        </div>

        {/* Version Footer */}
        <div className="w-full flex justify-end opacity-20 select-none px-6 pb-4 pt-2 shrink-0 bg-gray-50/50 dark:bg-gray-900/50">
          <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
            SQLite ACTIVE • {appVersion}
          </span>
        </div>
      </div>

      {isEditorOpen && (
        <ItemEditor 
          item={editingItem}
          onSave={handleSaveItem}
          onDelete={(id) => { handleDeleteItem(id); setIsEditorOpen(false); }}
          onClose={() => setIsEditorOpen(false)}
        />
      )}

      {pendingExecutionItem && (
        <ExecutionModal
          item={pendingExecutionItem}
          onProceed={(finalCommand) => {
            const tempId = pendingExecutionItem.id;
            const tempTitle = pendingExecutionItem.title;
            setPendingExecutionItem(null);
            executeFinalCommand(finalCommand, tempId, tempTitle);
          }}
          onClose={() => setPendingExecutionItem(null)}
        />
      )}

      {commandOutputState && (
        <CommandOutputModal
          title={commandOutputState.title}
          output={commandOutputState.output}
          error={commandOutputState.error}
          isRunning={commandOutputState.isRunning}
          onClose={() => setCommandOutputState(null)}
        />
      )}

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
