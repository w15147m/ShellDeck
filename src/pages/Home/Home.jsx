import React, { useState, useEffect, useRef } from "react";
import AppHeader from "../../common/components/AppHeader";
import FilterBar from "../../common/components/FilterBar";
import SettingsModal from "../../common/components/SettingsModal";
import ItemCard from "./components/ItemCard";
import ItemEditor from "./components/ItemEditor";
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

  const handleRunCommand = async (item) => {
    try {
      const command = item.content || '';
      if (!command.trim()) return toastError("No command text found to run.");
      
      const result = await window.electron.executeCommand(command);
      
      if (result.success) {
        toastSuccess("Process Finished");
        console.log("Bash Output:", result.output);
      } else {
        toastError("Process Failed");
        console.error("Bash Error:", result.error);
      }
    } catch (err) {
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
                  onRun={handleRunCommand}
                />
              ))}
            </div>
          ) : (
            <NoData 
              title="Full Database CRUD Test"
              message="Click the plus button above to add a real record to your SQLite database."
            />
          )}

          {/* Version Footer */}
          <div className="w-full flex justify-end opacity-20 select-none mt-auto pt-4">
            <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
              SQLite ACTIVE • {appVersion}
            </span>
          </div>
        </div>
      </div>

      {isEditorOpen && (
        <ItemEditor 
          item={editingItem}
          onSave={handleSaveItem}
          onClose={() => setIsEditorOpen(false)}
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
