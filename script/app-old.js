// Drag and Drop Image Upload Handler
function setupImageDropZone() {
  const dropZone = document.getElementById('image-drop-zone');
  const fileInput = document.getElementById('image-file-input');
  const imagePathInput = document.getElementById('image');
  const openPathBtn = document.getElementById('open-path-btn');

  // Click the drop zone to open file dialog
  dropZone.addEventListener('click', () => {
    fileInput.click();
  });

  // Handle file selection from input
  fileInput.addEventListener('change', (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleImageFile(files[0], imagePathInput);
    }
  });

  // Drag over
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.add('drag-over');
  });

  // Drag leave
  dropZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.remove('drag-over');
  });

  // Drop
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        handleImageFile(file, imagePathInput);
      } else {
        alert('Please drop an image file');
      }
    }
  });

  // Open path button - open the folder containing the image
  openPathBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const imagePath = imagePathInput.value.trim();
    if (imagePath) {
      // Check if we have access to Electron API
      if (window.electronAPI && window.electronAPI.openPath) {
        window.electronAPI.openPath(imagePath);
      } else {
        // Fallback for web version - show alert with path
        alert('Path: ' + imagePath + '\n\nTo open this location, use File Explorer.');
      }
    } else {
      alert('Please enter an image path first');
    }
  });
}

// Handle image file processing
function handleImageFile(file, imagePathInput) {
  const reader = new FileReader();
  
  reader.onload = (e) => {
    const base64Data = e.target.result;
    // Store the full path or just the filename with img/ prefix
    const fileName = file.name.toLowerCase().replace(/[^a-z0-9.-]/g, '_');
    const imagePath = `img/${fileName}`;
    imagePathInput.value = imagePath;
    
    // Optional: Show preview
    const msgBox = document.getElementById('message-box');
    msgBox.textContent = `Image selected: ${fileName}`;
    msgBox.classList.remove('hidden');
    setTimeout(() => {
      msgBox.classList.add('hidden');
    }, 2000);
  };
  
  reader.readAsDataURL(file);
}

// Drag and Drop for Map Images
function setupMapImageDropZone() {
  const dropZone = document.getElementById('map-image-drop-zone');
  const fileInput = document.getElementById('map-image-file-input');
  const imagePathInput = document.getElementById('map-image');
  const openPathBtn = document.getElementById('open-map-path-btn');

  // Click the drop zone to open file dialog
  dropZone.addEventListener('click', () => {
    fileInput.click();
  });

  // Handle file selection from input
  fileInput.addEventListener('change', (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleMapImageFile(files[0], imagePathInput);
    }
  });

  // Drag over
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.add('drag-over');
  });

  // Drag leave
  dropZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.remove('drag-over');
  });

  // Drop
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        handleMapImageFile(file, imagePathInput);
      } else {
        alert('Please drop an image file');
      }
    }
  });

  // Open path button
  openPathBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const imagePath = imagePathInput.value.trim();
    if (imagePath) {
      if (window.electronAPI && window.electronAPI.openPath) {
        window.electronAPI.openPath(imagePath);
      } else {
        alert('Path: ' + imagePath + '\n\nTo open this location, use File Explorer.');
      }
    } else {
      alert('Please enter an image path first');
    }
  });
}

// Handle map image file processing
function handleMapImageFile(file, imagePathInput) {
  const reader = new FileReader();
  
  reader.onload = (e) => {
    const base64Data = e.target.result;
    const fileName = file.name.toLowerCase().replace(/[^a-z0-9.-]/g, '_');
    const imagePath = `img/${fileName}`;
    imagePathInput.value = imagePath;
    
    const msgBox = document.getElementById('message-box');
    msgBox.textContent = `Map image selected: ${fileName}`;
    msgBox.classList.remove('hidden');
    setTimeout(() => {
      msgBox.classList.add('hidden');
    }, 2000);
  };
  
  reader.readAsDataURL(file);
}

function renderNPCs(npcList) {
  const container = document.getElementById("npc-cards");
  container.innerHTML = "";

  if (npcList.length === 0) {
    container.innerHTML = "<p>No characters to display. Try a new search or click 'Show All'.</p>";
    return;
  }

  npcList.forEach((npcData) => {
    const card = document.createElement("article");
    card.classList.add("npc-card");
    card.innerHTML = `
      <h2 class="npc-name" data-id="${npcData.id}">${npcData.name} ${npcData.companion ? '<span class="companion-badge">Companion</span>' : ''}</h2>
      <img src="${npcData.image}" alt="Portrait of ${npcData.name}" />
      <p><strong>Profession:</strong> ${npcData.profession}</p>
      <p><strong>Alignment:</strong> ${npcData.alignment}</p>
      <p><strong>Race:</strong> ${npcData.race}</p>
      <p><strong>Gender:</strong> ${npcData.gender}</p>
      <p><strong>Location:</strong> ${npcData.location}</p>
      <p><strong>Association:</strong> ${npcData.association}</p>
      <p><strong>Status:</strong> ${npcData.status}</p>
      <p><strong>Notes:</strong> ${npcData.notes}</p>
    `;

    const actions = document.createElement('div');
    actions.className = 'card-actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Edit';

    const delBtn = document.createElement('button');
    delBtn.className = 'delete-btn';
    delBtn.innerHTML = '<i class="fa-solid fa-trash"></i> Delete';

    actions.appendChild(editBtn);
    actions.appendChild(delBtn);
    card.appendChild(actions);

    container.appendChild(card);

    // Name click
    const npcName = card.querySelector(".npc-name");
    npcName.addEventListener("click", () => {
      const msgBox = document.getElementById("message-box");
      msgBox.textContent = `${npcData.name}: ${npcData.race} ${npcData.profession}`;
      msgBox.classList.remove("hidden");

      setTimeout(() => {
        msgBox.classList.add("hidden");
      }, 3000);
    });

    // ✅ Delete handler using the GLOBAL npc manager
    delBtn.addEventListener('click', () => {
      const confirmed = window.confirm(`Delete character "${npcData.name}"? This cannot be undone.`);
      if (confirmed) {
        const removed = npc.removeNpc(npcData.id);
        if (removed) {
          renderNPCs(npc.getNpcs());
        } else {
          console.warn("Could not find NPC to remove with id:", npcData.id);
        }
      }
    });

    // Edit handler – same idea, just switch to npcData
    editBtn.addEventListener('click', () => {
      document.getElementById('name').value = npcData.name || '';
      document.getElementById('image').value = (npcData.image && npcData.image !== 'img/default.png') ? npcData.image : '';
      document.getElementById('profession').value = npcData.profession || '';
      document.getElementById('alignment').value = npcData.alignment || '';
      document.getElementById('race').value = npcData.race || '';
      document.getElementById('gender').value = npcData.gender || '';
      document.getElementById('location').value = npcData.location || '';
      document.getElementById('association').value = npcData.association || '';
      document.getElementById('status').value = npcData.status || '';
      document.getElementById('notes').value = npcData.notes || '';
      document.getElementById('is-companion').checked = !!npcData.companion;

      window.editingId = npcData.id;

      const submitBtn = document.querySelector('#npc-form button[type="submit"]');
      if (submitBtn) submitBtn.innerHTML = '<i class="fa-solid fa-save"></i> Save Changes';

      const addForm = document.getElementById('add-npc-form');
      const cards = document.getElementById('npc-cards');
      if (addForm) addForm.classList.remove('hidden');
      if (cards) cards.classList.add('hidden');
      // show the cancel X when editing so the user can abort changes
      const cancelBtn = document.getElementById('cancel-edit');
      if (cancelBtn) cancelBtn.classList.remove('hidden');
    });
  });
}
function renderMaps(mapsList) {
  const container = document.getElementById("maps-cards");
  container.innerHTML = "";

  if (mapsList.length === 0) {
    container.innerHTML = "<p>No maps to display. Try a new search or click 'Show All'.</p>";
    return;
  }

  mapsList.forEach((mapData) => {
    const card = document.createElement("article");
    card.classList.add("npc-card");
    card.innerHTML = `
      <h2 class="map-name" data-id="${mapData.id}">${mapData.name}</h2>
      <img src="${mapData.image}" alt="Map of ${mapData.name}" />
      <p><strong>Cartouches:</strong> ${mapData.cartouches}</p>
    `;

    const actions = document.createElement('div');
    actions.className = 'card-actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Edit';

    const delBtn = document.createElement('button');
    delBtn.className = 'delete-btn';
    delBtn.innerHTML = '<i class="fa-solid fa-trash"></i> Delete';

    actions.appendChild(editBtn);
    actions.appendChild(delBtn);
    card.appendChild(actions);

    container.appendChild(card);

    // Map name click
    const mapName = card.querySelector(".map-name");
    mapName.addEventListener("click", () => {
      const msgBox = document.getElementById("message-box");
      msgBox.textContent = `Map: ${mapData.name}`;
      msgBox.classList.remove("hidden");

      setTimeout(() => {
        msgBox.classList.add("hidden");
      }, 3000);
    });

    // Delete handler
    delBtn.addEventListener('click', () => {
      const confirmed = window.confirm(`Delete map "${mapData.name}"? This cannot be undone.`);
      if (confirmed) {
        const removed = maps.removeMap(mapData.id);
        if (removed) {
          renderMaps(maps.getMaps());
        } else {
          console.warn("Could not find map to remove with id:", mapData.id);
        }
      }
    });

    // Edit handler
    editBtn.addEventListener('click', () => {
      document.getElementById('map-name').value = mapData.name || '';
      document.getElementById('map-image').value = (mapData.image && mapData.image !== 'img/default.png') ? mapData.image : '';
      document.getElementById('cartouches').value = mapData.cartouches || '';

      window.editingMapId = mapData.id;

      const submitBtn = document.querySelector('#map-form button[type="submit"]');
      if (submitBtn) submitBtn.innerHTML = '<i class="fa-solid fa-save"></i> Save Changes';

      const addForm = document.getElementById('add-map-form');
      const cards = document.getElementById('maps-cards');
      if (addForm) addForm.classList.remove('hidden');
      if (cards) cards.classList.add('hidden');
      // show the cancel button when editing
      const cancelBtn = document.getElementById('cancel-map-edit');
      if (cancelBtn) cancelBtn.classList.remove('hidden');
    });
  });
}
document.addEventListener("DOMContentLoaded", () => {  // Setup image drop zone on page load
  setupImageDropZone();
    // DOM references for elements we’ll interact with
  const searchInput = document.getElementById("npc-search");
  const searchTextInput = document.getElementById("text-search");
  const showAllButton = document.getElementById("show-all");
  const clearAllButton = document.getElementById("clear-all");
  const campToggle = document.getElementById("toggle-camp");
  const npcForm = document.getElementById("npc-form");
  const addNpcLink = document.getElementById("add-npc-link");
  const addNpcFormSection = document.getElementById("add-npc-form");
  const npcCardsSection = document.getElementById("npc-cards");
  const cancelEditBtn = document.getElementById("cancel-edit");
  const companionsLink = document.getElementById("companions-link");
  const homeLink = document.getElementById("home-link");

  // Restore theme from localStorage on page load (supports 'camp' and 'travel')
  const savedTheme = localStorage.getItem("theme");
  const legacyCamp = localStorage.getItem("campMode") === "true";
  if (savedTheme === "camp" || (!savedTheme && legacyCamp)) {
    document.body.classList.add("camp-mode");
    campToggle.innerHTML = '<i class="fa-solid fa-shoe-prints"></i> Travel Mode';
  } else if (savedTheme === "travel") {
    document.body.classList.add("travel-mode");
    campToggle.innerHTML = '<i class="fa-solid fa-fire"></i> Camp Mode';
  }

  // Reload the page when Home is clicked (preserves camp mode due to localStorage)
  homeLink.addEventListener("click", (e) => {
    e.preventDefault();
    location.reload();
  });

  // Toggle between form view and NPC cards view when "Add NPC" is clicked
  addNpcLink.addEventListener("click", (e) => {
    e.preventDefault();
    // Hide maps elements
    mapsSearchBar.classList.add("hidden");
    mapsCardsSection.classList.add("hidden");
    addMapBtnUI.style.display = 'none';
    
    // Show character elements
    document.getElementById("search-bar").classList.remove("hidden");
    const formIsHidden = addNpcFormSection.classList.contains("hidden");

    if (formIsHidden) {
      // when opening the form for adding, ensure cancel is hidden (only used for edit)
      if (cancelEditBtn) cancelEditBtn.classList.add('hidden');
      addNpcFormSection.classList.remove("hidden");
      npcCardsSection.classList.add("hidden");
    } else {
      addNpcFormSection.classList.add("hidden");
      npcCardsSection.classList.remove("hidden");
    }
  });

  // cancel / abort edit button handler
  if (cancelEditBtn) {
    cancelEditBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.editingId = null;
      npcForm.reset();
      addNpcFormSection.classList.add('hidden');
      npcCardsSection.classList.remove('hidden');
      const submitBtn = document.querySelector('#npc-form button[type="submit"]');
      if (submitBtn) submitBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Character';
      cancelEditBtn.classList.add('hidden');
    });
  }

  // Handle submission of new NPC from form
  npcForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formValues = {
      name: document.getElementById("name").value,
      image: document.getElementById("image").value || "img/default.png",
      profession: document.getElementById("profession").value,
      alignment: document.getElementById("alignment").value,
      race: document.getElementById("race").value,
      gender: document.getElementById("gender").value,
      location: document.getElementById("location").value,
      association: document.getElementById("association").value,
      status: document.getElementById("status").value,
      notes: document.getElementById("notes").value,
      companion: document.getElementById("is-companion").checked === true
    };

    // if we are editing an existing entry, update it
    if (window.editingId) {
      const updatedNpc = { id: window.editingId, ...formValues };
      const ok = npc.updateNpc(updatedNpc);
      if (ok) {
        renderNPCs(npc.getNpcs());
      }
      // reset editing state
      window.editingId = null;
      const submitBtn = document.querySelector('#npc-form button[type="submit"]');
      if (submitBtn) submitBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Character';
      npcForm.reset();
      addNpcFormSection.classList.add("hidden");
      if (cancelEditBtn) cancelEditBtn.classList.add('hidden');
      npcCardsSection.classList.remove("hidden");
      return;
    }

    // otherwise create a new id (avoid collisions) and add
    const current = npc.getNpcs();
    const nextId = current.reduce((max, it) => Math.max(max, it.id || 0), 0) + 1;
    const newNpc = { id: nextId, ...formValues };
    npc.addNpc(newNpc);
    renderNPCs(npc.getNpcs());
    npcForm.reset();

    // Hide the form and show NPC cards after submission
    addNpcFormSection.classList.add("hidden");
    if (cancelEditBtn) cancelEditBtn.classList.add('hidden');
    npcCardsSection.classList.remove("hidden");
  });

  // Show companions only when the Companions nav link is clicked
  if (companionsLink) {
    companionsLink.addEventListener("click", (e) => {
      e.preventDefault();
      // Hide maps elements
      mapsSearchBar.classList.add("hidden");
      mapsCardsSection.classList.add("hidden");
      addMapBtnUI.style.display = 'none';
      
      // Show character elements
      document.getElementById("search-bar").classList.remove("hidden");
      // hide add form and show cards
      addNpcFormSection.classList.add("hidden");
      if (cancelEditBtn) cancelEditBtn.classList.add('hidden');
      npcCardsSection.classList.remove("hidden");
      // render only NPCs flagged as companions
      const companions = npc.getNpcs().filter((n) => n.companion === true);
      renderNPCs(companions);
    });
  }

  // Live filter: general search across multiple NPC fields
  searchInput.addEventListener("input", (event) => {
    const searchTerm = event.target.value;
    const results = npc.searchNpcs(searchTerm);
    renderNPCs(results);
  });

  // Live filter: notes-only search
  searchTextInput.addEventListener("input", (event) => {
    const searchTerm = event.target.value;
    const results = npc.searchNotes(searchTerm);
    renderNPCs(results);
  });

  // Show all NPCs
  showAllButton.addEventListener("click", () => {
    // ensure we're showing the NPC cards (hide the add form if visible)
    searchInput.value = "";
    addNpcFormSection.classList.add("hidden");
    if (cancelEditBtn) cancelEditBtn.classList.add('hidden');
    npcCardsSection.classList.remove("hidden");
    renderNPCs(npc.getNpcs());
  });

  // Clear search results
  clearAllButton.addEventListener("click", () => {
    // hide add form and show cards, then clear results
    searchInput.value = "";
    addNpcFormSection.classList.add("hidden");
    if (cancelEditBtn) cancelEditBtn.classList.add('hidden');
    npcCardsSection.classList.remove("hidden");
    renderNPCs([]);
  });

  // Toggle between camp-mode and travel-mode (cycles) and persist the choice
  campToggle.addEventListener("click", () => {
    if (document.body.classList.contains("camp-mode")) {
      // switch to travel
      document.body.classList.remove("camp-mode");
      document.body.classList.add("travel-mode");
      localStorage.setItem("theme", "travel");
      localStorage.setItem("campMode", false);
      campToggle.innerHTML = '<i class="fa-solid fa-fire"></i> Camp Mode';
    } else if (document.body.classList.contains("travel-mode")) {
      // switch to camp
      document.body.classList.remove("travel-mode");
      document.body.classList.add("camp-mode");
      localStorage.setItem("theme", "camp");
      localStorage.setItem("campMode", true);
      campToggle.innerHTML = '<i class="fa-solid fa-shoe-prints"></i> Travel Mode';
    } else {
      // no theme active -> default to camp
      document.body.classList.add("camp-mode");
      localStorage.setItem("theme", "camp");
      localStorage.setItem("campMode", true);
      campToggle.innerHTML = '<i class="fa-solid fa-shoe-prints"></i> Travel Mode';
    }
  });

  // =============== MAPS SECTION ===============
  const mapsLink = document.getElementById("maps-link");
  const mapsSearchBar = document.getElementById("maps-search-bar");
  const mapsCardsSection = document.getElementById("maps-cards");
  const addMapFormSection = document.getElementById("add-map-form");
  const mapForm = document.getElementById("map-form");
  const cancelMapEditBtn = document.getElementById("cancel-map-edit");
  const mapsSearchInput = document.getElementById("maps-search");
  const cartouchesSearchInput = document.getElementById("cartouches-search");
  const showAllMapsButton = document.getElementById("show-all-maps");
  const clearAllMapsButton = document.getElementById("clear-all-maps");
  const toggleCampMaps = document.getElementById("toggle-camp-maps");

  // Maps navigation link
  mapsLink.addEventListener("click", (e) => {
    e.preventDefault();
    // Hide character elements
    document.getElementById("search-bar").classList.add("hidden");
    npcCardsSection.classList.add("hidden");
    addNpcFormSection.classList.add("hidden");
    if (cancelEditBtn) cancelEditBtn.classList.add('hidden');
    
    // Show maps elements
    mapsSearchBar.classList.remove("hidden");
    addMapBtnUI.style.display = 'inline-block';
    mapsCardsSection.classList.remove("hidden");
    addMapFormSection.classList.add("hidden");
    if (cancelMapEditBtn) cancelMapEditBtn.classList.add('hidden');
    
    // Render all maps
    renderMaps(maps.getMaps());
  });

  // Setup map image drop zone
  setupMapImageDropZone();

  // Maps - Add form toggle
  const addMapBtn = document.createElement('button');
  addMapBtn.id = 'add-map-link';
  addMapBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Map';
  addMapBtn.style.display = 'none';
  
  // Create visible add map button in the search bar
  const addMapBtnUI = document.createElement('button');
  addMapBtnUI.id = 'add-map-ui-btn';
  addMapBtnUI.className = 'add-map-btn';
  addMapBtnUI.innerHTML = '<i class="fa-solid fa-plus"></i> Add Map';
  addMapBtnUI.style.display = 'none';

  // Insert it into maps search bar
  mapsSearchBar.appendChild(addMapBtnUI);

  // Show add map button when on maps page, toggle form
  const originalMapsLinkClick = mapsLink.onclick;
  mapsLink.addEventListener("click", (e) => {
    addMapBtnUI.style.display = 'inline-block';
    addNpcLink.style.display = 'none';
  });

  addMapBtnUI.addEventListener("click", (e) => {
    e.preventDefault();
    const formIsHidden = addMapFormSection.classList.contains("hidden");

    if (formIsHidden) {
      if (cancelMapEditBtn) cancelMapEditBtn.classList.add('hidden');
      addMapFormSection.classList.remove("hidden");
      mapsCardsSection.classList.add("hidden");
    } else {
      addMapFormSection.classList.add("hidden");
      mapsCardsSection.classList.remove("hidden");
    }
  });

  // Cancel map edit
  if (cancelMapEditBtn) {
    cancelMapEditBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.editingMapId = null;
      mapForm.reset();
      addMapFormSection.classList.add('hidden');
      mapsCardsSection.classList.remove('hidden');
      const submitBtn = document.querySelector('#map-form button[type="submit"]');
      if (submitBtn) submitBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Map';
      cancelMapEditBtn.classList.add('hidden');
    });
  }

  // Map form submission
  mapForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formValues = {
      name: document.getElementById("map-name").value,
      image: document.getElementById("map-image").value || "img/default.png",
      cartouches: document.getElementById("cartouches").value
    };

    // If editing an existing map
    if (window.editingMapId) {
      const updatedMap = { id: window.editingMapId, ...formValues };
      const ok = maps.updateMap(updatedMap);
      if (ok) {
        renderMaps(maps.getMaps());
      }
      window.editingMapId = null;
      const submitBtn = document.querySelector('#map-form button[type="submit"]');
      if (submitBtn) submitBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Map';
      mapForm.reset();
      addMapFormSection.classList.add("hidden");
      if (cancelMapEditBtn) cancelMapEditBtn.classList.add('hidden');
      mapsCardsSection.classList.remove("hidden");
      return;
    }

    // Create new map
    const current = maps.getMaps();
    const nextId = current.reduce((max, it) => Math.max(max, it.id || 0), 0) + 1;
    const newMap = { id: nextId, ...formValues };
    maps.addMap(newMap);
    renderMaps(maps.getMaps());
    mapForm.reset();

    // Hide form and show maps
    addMapFormSection.classList.add("hidden");
    if (cancelMapEditBtn) cancelMapEditBtn.classList.add('hidden');
    mapsCardsSection.classList.remove("hidden");
  });

  // Maps search by name
  mapsSearchInput.addEventListener("input", (event) => {
    const searchTerm = event.target.value;
    const results = maps.searchMaps(searchTerm);
    renderMaps(results);
  });

  // Maps search by cartouches
  cartouchesSearchInput.addEventListener("input", (event) => {
    const searchTerm = event.target.value;
    const results = maps.searchCartouches(searchTerm);
    renderMaps(results);
  });

  // Show all maps
  showAllMapsButton.addEventListener("click", () => {
    mapsSearchInput.value = "";
    cartouchesSearchInput.value = "";
    addMapFormSection.classList.add("hidden");
    if (cancelMapEditBtn) cancelMapEditBtn.classList.add('hidden');
    mapsCardsSection.classList.remove("hidden");
    renderMaps(maps.getMaps());
  });

  // Clear all maps
  clearAllMapsButton.addEventListener("click", () => {
    mapsSearchInput.value = "";
    cartouchesSearchInput.value = "";
    addMapFormSection.classList.add("hidden");
    if (cancelMapEditBtn) cancelMapEditBtn.classList.add('hidden');
    mapsCardsSection.classList.remove("hidden");
    renderMaps([]);
  });

  // Map camp toggle
  toggleCampMaps.addEventListener("click", () => {
    if (document.body.classList.contains("camp-mode")) {
      document.body.classList.remove("camp-mode");
      document.body.classList.add("travel-mode");
      localStorage.setItem("theme", "travel");
      localStorage.setItem("campMode", false);
      toggleCampMaps.innerHTML = '<i class="fa-solid fa-fire"></i> Camp Mode';
    } else if (document.body.classList.contains("travel-mode")) {
      document.body.classList.remove("travel-mode");
      document.body.classList.add("camp-mode");
      localStorage.setItem("theme", "camp");
      localStorage.setItem("campMode", true);
      toggleCampMaps.innerHTML = '<i class="fa-solid fa-shoe-prints"></i> Travel Mode';
    } else {
      document.body.classList.add("camp-mode");
      localStorage.setItem("theme", "camp");
      localStorage.setItem("campMode", true);
      toggleCampMaps.innerHTML = '<i class="fa-solid fa-shoe-prints"></i> Travel Mode';
    }
  });
});
