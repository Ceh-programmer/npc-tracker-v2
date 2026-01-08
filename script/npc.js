let npc = {
  // Key used for storing characters in localStorage
  STORAGE_KEY: 'characters',

  allNpcs: [
    {
      id: 1,
      name: "Gyark Sniggy",
      image: "img/gyark-sniggy.png",
      profession: "Thief",
      alignment: "Chaotic Neutral",
      race: "Goblin",
      gender: "Male",
      location: "Underdark",
      association: "Zhentarim",
      status: "Alive",
      notes: "Unpredictable, not to be trusted",
      companion: false
    },
    {
        id: 2,
        name: "Horida Bella",
        image: "img/horida-bella.png",
        profession: "Barkeep",
        alignment: "Lawful Neutral",
        race: "Half-Orc",
        gender: "Female",
        location: "Baldur's Gate",
        association: "Bartender Watch",
        status: "Alive",
        notes: "Retired sellsword",
        companion: false
      },
      {
        id: 3,
        name: "Fennel Tater",
        image: "img/fennel-tater.png",
        profession: "Herbalist",
        alignment: "True Neutral",
        race: "Halfling",
        gender: "Male",
        location: "High Moor",
        association: "None",
        status: "Unknown",
        notes: "Mediocre healing abilities",
        companion: false
      },
      {
        id: 4,
        name: "Tungg Stohn",
        image: "img/tungg-stohn.png",
        profession: "Smith",
        alignment: "Neutral Good",
        race: "Dwarf",
        gender: "Male",
        location: "Mithral Hall",
        association: "Hammer Guild",
        status: "Imprisoned",
        notes: "Mention Taured from the Crossing for a discount",
        companion: false
      },
      {
        id: 5,
        name: "Meriganna",
        image: "img/meriganna.png",
        profession: "Red Wizard",
        alignment: "Lawful Evil",
        race: "Human",
        gender: "Female",
        location: "High Moor",
        association: "Szass Tam",
        status: "Undead",
        notes: "Very dangerous enemy",
        companion: false
      },
      {
        id: 6,
        name: "Mod Testa",
        image: "img/mod-testa.png",
        profession: "Deus Ex Machina",
        alignment: "Lawful Good",
        race: "Elf",
        gender: "Female",
        location: "Neverwinter",
        association: "None",
        status: "Dead",
        notes: "",
        companion: false
      },
],

getNpcs() {
    return this.allNpcs;
},

searchNpcs(searchTerm) {
  const term = searchTerm.toLowerCase().trim();
  if (term === "") {
    return [];
  }
    return this.allNpcs.filter(npc =>
    {
        const nameMatch = npc.name.toLowerCase().includes(searchTerm.toLowerCase());
        const professionMatch = npc.profession.toLowerCase().includes(searchTerm.toLowerCase());
        const alignmentMatch = npc.alignment.toLowerCase().includes(searchTerm.toLowerCase());
        const raceMatch = npc.race.toLowerCase().includes(searchTerm.toLowerCase());
        const genderMatch = npc.gender.toLowerCase().includes(searchTerm.toLowerCase());
        const locationMatch = npc.location.toLowerCase().includes(searchTerm.toLowerCase());
        const associationMatch = npc.association.toLowerCase().includes(searchTerm.toLowerCase());
        const statusMatch = npc.status.toLowerCase().includes(searchTerm.toLowerCase());
        return nameMatch || 
            professionMatch ||
            alignmentMatch ||
            raceMatch ||
            genderMatch ||
            locationMatch ||
            associationMatch ||
            statusMatch
    })
},
searchNotes(searchTerm) {
  const term = searchTerm.toLowerCase().trim();
  if (term === "") {
    return [];
  }
    return this.allNpcs.filter(npc =>
    {
        const notesMatch = npc.notes.toLowerCase().includes(searchTerm.toLowerCase());
        return notesMatch;
    })
},
addNpc(npcObj) {
  this.allNpcs.push(npcObj);
  this.saveAll();
}
,

// Persist current list to localStorage
saveAll() {
  try {
    const toSave = this.allNpcs.map(item => ({ companion: false, ...item }));
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(toSave));
  } catch (e) {
    console.error('Failed to save characters to localStorage', e);
  }
},

// Remove NPC by id and persist
removeNpc(id) {
  const idx = this.allNpcs.findIndex(n => n.id === id);
  if (idx !== -1) {
    this.allNpcs.splice(idx, 1);
    this.saveAll();
    return true;
  }
  return false;
},

// Update an existing NPC (matched by id) and persist
updateNpc(updated) {
  const idx = this.allNpcs.findIndex(n => n.id === updated.id);
  if (idx !== -1) {
    this.allNpcs[idx] = { ...this.allNpcs[idx], ...updated };
    this.saveAll();
    return true;
  }
  return false;
}
};

// Try to load saved characters from localStorage on script load
try {
  if (typeof localStorage !== 'undefined') {
    const raw = localStorage.getItem(npc.STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // normalize entries to ensure companion property exists
        npc.allNpcs = parsed.map(p => ({ companion: false, ...p }));
      }
    }
  }
} catch (e) {
  console.error('Failed to load characters from localStorage', e);
}

// Maps manager
let maps = {
  // Key used for storing maps in localStorage
  STORAGE_KEY: 'maps',

  allMaps: [
    {
      id: 1,
      name: "Waterdeep City Map",
      image: "img/waterdeep-map.png",
      cartouches: "City districts, notable locations",
      notes: "Main hub for trade routes"
    },
    {
      id: 2,
      name: "The Underdark",
      image: "img/underdark-map.png",
      cartouches: "Drow settlements, cave systems",
      notes: "Dangerous territory, watch for encounters"
    },
    {
      id: 3,
      name: "Sword Coast Map",
      image: "img/sword-coast-map.png",
      cartouches: "Cities, towns, landmarks",
      notes: "Primary travel route between cities"
    }
  ],

  getMaps() {
    return this.allMaps;
  },

  searchMaps(searchTerm) {
    const term = searchTerm.toLowerCase().trim();
    if (term === "") {
      return [];
    }
    return this.allMaps.filter(map =>
      map.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  },

  searchCartouches(searchTerm) {
    const term = searchTerm.toLowerCase().trim();
    if (term === "") {
      return [];
    }
    return this.allMaps.filter(map =>
      map.cartouches.toLowerCase().includes(searchTerm.toLowerCase())
    );
  },

  addMap(mapObj) {
    this.allMaps.push(mapObj);
    this.saveAll();
  },

  // Persist current list to localStorage
  saveAll() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.allMaps));
    } catch (e) {
      console.error('Failed to save maps to localStorage', e);
    }
  },

  // Remove map by id and persist
  removeMap(id) {
    const idx = this.allMaps.findIndex(m => m.id === id);
    if (idx !== -1) {
      this.allMaps.splice(idx, 1);
      this.saveAll();
      return true;
    }
    return false;
  },

  // Update an existing map (matched by id) and persist
  updateMap(updated) {
    const idx = this.allMaps.findIndex(m => m.id === updated.id);
    if (idx !== -1) {
      this.allMaps[idx] = { ...this.allMaps[idx], ...updated };
      this.saveAll();
      return true;
    }
    return false;
  }
};

// Try to load saved maps from localStorage on script load
try {
  if (typeof localStorage !== 'undefined') {
    const raw = localStorage.getItem(maps.STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        maps.allMaps = parsed;
      }
    }
  }
} catch (e) {
  console.error('Failed to load maps from localStorage', e);
}

