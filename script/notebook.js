let notebook = {
  // Key used for storing entries in localStorage
  STORAGE_KEY: 'notebook_entries',

  allEntries: [],
  nextId: 1,

  // Initialize by loading from localStorage or using empty array
  init: function() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        this.allEntries = JSON.parse(stored);
        this.nextId = (this.allEntries.length > 0 ? Math.max(...this.allEntries.map(e => e.id)) : 0) + 1;
      } catch (e) {
        this.allEntries = [];
        this.nextId = 1;
      }
    }
  },

  // Get all entries sorted by date in descending order (newest first)
  getEntries: function() {
    return [...this.allEntries].sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  // Add a new entry
  addEntry: function(entry) {
    const newEntry = { id: this.nextId++, ...entry };
    this.allEntries.push(newEntry);
    this.save();
    return newEntry;
  },

  // Update an existing entry
  updateEntry: function(entry) {
    const index = this.allEntries.findIndex(e => e.id === entry.id);
    if (index !== -1) {
      this.allEntries[index] = entry;
      this.save();
      return true;
    }
    return false;
  },

  // Delete an entry
  deleteEntry: function(id) {
    const index = this.allEntries.findIndex(e => e.id === id);
    if (index !== -1) {
      this.allEntries.splice(index, 1);
      this.save();
      return true;
    }
    return false;
  },

  // Search entries by content or date
  searchEntries: function(term) {
    const lowerTerm = term.toLowerCase();
    return this.getEntries().filter(entry =>
      entry.date.toLowerCase().includes(lowerTerm) ||
      entry.content.toLowerCase().includes(lowerTerm)
    );
  },

  // Save to localStorage
  save: function() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.allEntries));
  }
};

// Initialize notebook on page load
notebook.init();

