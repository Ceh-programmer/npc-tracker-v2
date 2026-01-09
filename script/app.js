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
      <h2 class="npc-name" data-id="${npcData.id}">${npcData.name} ${npcData.companion ? '<span class="companion-badge">Companion</span>' : ''} ${npcData.enemy ? '<span class="enemy-badge">Enemy</span>' : ''}</h2>
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
      document.getElementById('is-enemy').checked = !!npcData.enemy;

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
function renderMaps(mapList) {
  const container = document.getElementById("map-cards");
  container.innerHTML = "";

  if (mapList.length === 0) {
    return;
  }

  mapList.forEach((mapData) => {
    const card = document.createElement("article");
    card.classList.add("map-card");
    card.innerHTML = `
      <h2 class="map-name" data-id="${mapData.id}">${mapData.name}</h2>
      <img src="${mapData.image}" alt="${mapData.name}" />
      <p><strong>Cartouches:</strong> ${mapData.cartouches}</p>
      <p><strong>Notes:</strong> ${mapData.notes}</p>
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
      msgBox.textContent = `${mapData.name}`;
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
      document.getElementById('map-notes').value = mapData.notes || '';

      window.editingMapId = mapData.id;

      const submitBtn = document.querySelector('#map-form button[type="submit"]');
      if (submitBtn) submitBtn.innerHTML = '<i class="fa-solid fa-save"></i> Save Changes';

      const addForm = document.getElementById('add-map-form');
      const cards = document.getElementById('map-cards');
      if (addForm) addForm.classList.remove('hidden');
      if (cards) cards.classList.add('hidden');
      const cancelBtn = document.getElementById('map-cancel-edit');
      if (cancelBtn) cancelBtn.classList.remove('hidden');
    });
  });
}
function renderEntries(entryList) {
  const container = document.getElementById("notebook-entries");
  container.innerHTML = "";

  if (entryList.length === 0) {
    return;
  }

  entryList.forEach((entryData) => {
    const entry = document.createElement("article");
    entry.classList.add("notebook-entry");
    
    const dateObj = new Date(entryData.date);
    const formattedDate = dateObj.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    entry.innerHTML = `
      <div class="notebook-entry-date">${formattedDate}</div>
      <div class="notebook-entry-content">${entryData.content}</div>
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
    entry.appendChild(actions);

    container.appendChild(entry);

    // Delete handler
    delBtn.addEventListener('click', () => {
      const confirmed = window.confirm(`Delete entry from ${formattedDate}? This cannot be undone.`);
      if (confirmed) {
        const removed = notebook.deleteEntry(entryData.id);
        if (removed) {
          renderEntries(notebook.getEntries());
        }
      }
    });

    // Edit handler
    editBtn.addEventListener('click', () => {
      document.getElementById('entry-date').value = entryData.date;
      document.getElementById('entry-content').value = entryData.content;

      window.editingEntryId = entryData.id;

      const submitBtn = document.querySelector('#entry-form button[type="submit"]');
      if (submitBtn) submitBtn.innerHTML = '<i class="fa-solid fa-save"></i> Save Changes';

      const addForm = document.getElementById('add-entry-form');
      const entries = document.getElementById('notebook-entries');
      if (addForm) addForm.classList.remove('hidden');
      if (entries) entries.classList.add('hidden');
      const cancelBtn = document.getElementById('entry-cancel-edit');
      if (cancelBtn) cancelBtn.classList.remove('hidden');
    });
  });
}
document.addEventListener("DOMContentLoaded", () => {
  // DOM references for elements we’ll interact with
  const searchInput = document.getElementById("npc-search");
  const locationSearchInput = document.getElementById("location-search");
  const characterFilters = document.getElementById("character-filters");
  const filterCompanionCheckbox = document.getElementById("filter-companion");
  const filterEnemyCheckbox = document.getElementById("filter-enemy");
  const mapSearchInput = document.getElementById("map-search");
  const cartoucheSearchInput = document.getElementById("cartouche-search");
  const librarySearchInput = document.getElementById("library-search");
  const clearAllButton = document.getElementById("clear-all");
  const showAllButton = document.getElementById("show-all");
  const addCharacterBtn = document.getElementById("add-character-btn");
  const addMapBtn = document.getElementById("add-map-btn");
  const addEntryBtn = document.getElementById("add-entry-btn");
  const campToggle = document.getElementById("toggle-camp");
  const npcForm = document.getElementById("npc-form");
  const mapForm = document.getElementById("map-form");
  const entryForm = document.getElementById("entry-form");
  const npcCardsSection = document.getElementById("npc-cards");
  const mapCardsSection = document.getElementById("map-cards");
  const addNpcFormSection = document.getElementById("add-npc-form");
  const addMapFormSection = document.getElementById("add-map-form");
  const addEntryFormSection = document.getElementById("add-entry-form");
  const entrySearchInput = document.getElementById("entry-search");
  const notebookEntriesSection = document.getElementById("notebook-entries");
  const cancelEditBtn = document.getElementById("cancel-edit");
  const mapCancelEditBtn = document.getElementById("map-cancel-edit");
  const entryCancelEditBtn = document.getElementById("entry-cancel-edit");
  const homeLink = document.getElementById("home-link");
  const charactersLink = document.getElementById("characters-link");
  const mapsLink = document.getElementById("maps-link");
  const notebookLink = document.getElementById("notebook-link");

  // Image upload elements
  const dragDropZone = document.getElementById("drag-drop-zone");
  const imageFileInput = document.getElementById("image-file-input");
  const imagePreviewContainer = document.getElementById("image-preview-container");
  const imagePreview = document.getElementById("image-preview");
  const removeImageBtn = document.getElementById("remove-image-btn");
  const imagePathInput = document.getElementById("image");

  // Image upload elements for maps
  const mapDragDropZone = document.getElementById("map-drag-drop-zone");
  const mapImageFileInput = document.getElementById("map-image-file-input");
  const mapImagePreviewContainer = document.getElementById("map-image-preview-container");
  const mapImagePreview = document.getElementById("map-image-preview");
  const mapRemoveImageBtn = document.getElementById("map-remove-image-btn");
  const mapImagePathInput = document.getElementById("map-image");

  // Handle drag-and-drop zone clicks to open file picker
  dragDropZone.addEventListener("click", () => {
    imageFileInput.click();
  });

  // Handle file selection from input
  imageFileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      displayImagePreview(file);
    }
  });

  // Handle drag over
  dragDropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dragDropZone.classList.add("drag-over");
  });

  // Handle drag leave
  dragDropZone.addEventListener("dragleave", () => {
    dragDropZone.classList.remove("drag-over");
  });

  // Handle drop
  dragDropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dragDropZone.classList.remove("drag-over");
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        displayImagePreview(file);
      } else {
        alert("Please drop an image file");
      }
    }
  });

  // Handle image preview removal
  removeImageBtn.addEventListener("click", (e) => {
    e.preventDefault();
    imageFileInput.value = "";
    imagePathInput.value = "";
    imagePreviewContainer.classList.add("hidden");
    dragDropZone.classList.remove("hidden");
  });

  // Function to display image preview
  function displayImagePreview(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.src = e.target.result;
      imagePathInput.value = file.name; // Store the filename
      dragDropZone.classList.add("hidden");
      imagePreviewContainer.classList.remove("hidden");
    };
    reader.readAsDataURL(file);
  }

  // Map image upload handlers
  mapDragDropZone.addEventListener("click", () => {
    mapImageFileInput.click();
  });

  mapImageFileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      displayMapImagePreview(file);
    }
  });

  mapDragDropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    mapDragDropZone.classList.add("drag-over");
  });

  mapDragDropZone.addEventListener("dragleave", () => {
    mapDragDropZone.classList.remove("drag-over");
  });

  mapDragDropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    mapDragDropZone.classList.remove("drag-over");
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        displayMapImagePreview(file);
      } else {
        alert("Please drop an image file");
      }
    }
  });

  mapRemoveImageBtn.addEventListener("click", (e) => {
    e.preventDefault();
    mapImageFileInput.value = "";
    mapImagePathInput.value = "";
    mapImagePreviewContainer.classList.add("hidden");
    mapDragDropZone.classList.remove("hidden");
  });

  function displayMapImagePreview(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      mapImagePreview.src = e.target.result;
      mapImagePathInput.value = file.name;
      mapDragDropZone.classList.add("hidden");
      mapImagePreviewContainer.classList.remove("hidden");
    };
    reader.readAsDataURL(file);
  }

  // Restore theme from localStorage on page load (supports 'camp' and 'travel')
  const savedTheme = localStorage.getItem("theme");
  const legacyCamp = localStorage.getItem("campMode") === "true";
  if (savedTheme === "camp" || (!savedTheme && legacyCamp)) {
    document.body.classList.add("camp-mode");
    campToggle.innerHTML = '<i class="fa-solid fa-shoe-prints"></i> Travel';
  } else if (savedTheme === "travel") {
    document.body.classList.add("travel-mode");
    campToggle.innerHTML = '<i class="fa-solid fa-fire"></i> Camp';
  }

  // Home page - show all search inputs and empty results
  homeLink.addEventListener("click", (e) => {
    e.preventDefault();
    // Show all search inputs for home page
    searchInput.classList.remove("hidden");
    locationSearchInput.classList.remove("hidden");
    characterFilters.classList.add("hidden");
    addCharacterBtn.classList.add("hidden");
    addMapBtn.classList.add("hidden");
    // ensure the Add Entry button is hidden on Home
    if (addEntryBtn) addEntryBtn.classList.add("hidden");
    mapSearchInput.classList.remove("hidden");
    cartoucheSearchInput.classList.remove("hidden");
    librarySearchInput.classList.remove("hidden");
    // Clear all search inputs
    searchInput.value = "";
    locationSearchInput.value = "";
    mapSearchInput.value = "";
    cartoucheSearchInput.value = "";
    librarySearchInput.value = "";
    // hide the Show All button on Home
    if (showAllButton) showAllButton.classList.add('hidden');
    // (maps handler) ensure entry search remains hidden on Maps view
    // Hide forms and show empty results
    addNpcFormSection.classList.add("hidden");
    addMapFormSection.classList.add("hidden");
    addEntryFormSection.classList.add("hidden");
    if (cancelEditBtn) cancelEditBtn.classList.add('hidden');
    if (mapCancelEditBtn) mapCancelEditBtn.classList.add('hidden');
    if (entryCancelEditBtn) entryCancelEditBtn.classList.add('hidden');
    npcCardsSection.classList.remove("hidden");
    mapCardsSection.classList.add("hidden");
    // Display empty results
    renderNPCs([]);
  });

  // Characters page: Show add form and all characters
  charactersLink.addEventListener("click", (e) => {
    e.preventDefault();
    searchInput.classList.remove("hidden");
    locationSearchInput.classList.remove("hidden");
    characterFilters.classList.remove("hidden");
    addCharacterBtn.classList.remove("hidden");
    mapSearchInput.classList.add("hidden");
    cartoucheSearchInput.classList.add("hidden");
    // hide entry search on Characters view
    if (entrySearchInput) entrySearchInput.classList.add('hidden');
    // ensure Show All is visible on Characters
    if (showAllButton) showAllButton.classList.remove('hidden');
    searchInput.value = "";
    locationSearchInput.value = "";
    addNpcFormSection.classList.add("hidden");
    addMapFormSection.classList.add("hidden");
    addEntryFormSection.classList.add("hidden");
    mapCardsSection.classList.add("hidden");
    if (cancelEditBtn) cancelEditBtn.classList.add('hidden');
    if (mapCancelEditBtn) mapCancelEditBtn.classList.add('hidden');
    if (entryCancelEditBtn) entryCancelEditBtn.classList.add('hidden');
    npcCardsSection.classList.remove("hidden");
    // Reset form to add mode
    npcForm.reset();
    imageFileInput.value = "";
    imagePreviewContainer.classList.add("hidden");
    dragDropZone.classList.remove("hidden");
    const submitBtn = document.querySelector('#npc-form button[type="submit"]');
    if (submitBtn) submitBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Character';
    window.editingId = null;
    renderNPCs([]);
    // ensure the Add Entry button is hidden on Characters
    if (addEntryBtn) addEntryBtn.classList.add("hidden");
  });

  // Maps page: placeholder
  mapsLink.addEventListener("click", (e) => {
    e.preventDefault();
    searchInput.classList.add("hidden");
    locationSearchInput.classList.add("hidden");
    characterFilters.classList.add("hidden");
    addCharacterBtn.classList.add("hidden");
    addMapBtn.classList.remove("hidden");
    mapSearchInput.classList.remove("hidden");
    cartoucheSearchInput.classList.remove("hidden");
    mapSearchInput.value = "";
    cartoucheSearchInput.value = "";
    addNpcFormSection.classList.add("hidden");
    addEntryFormSection.classList.add("hidden");
    npcCardsSection.classList.add("hidden");
    // ensure entry search is visible on Home (single home page with entries search)
    if (entrySearchInput) entrySearchInput.classList.remove('hidden');
    addMapFormSection.classList.add("hidden");
    mapCardsSection.classList.remove("hidden");
    mapForm.reset();
    mapImageFileInput.value = "";
    mapImagePreviewContainer.classList.add("hidden");
    mapDragDropZone.classList.remove("hidden");
    const submitBtn = document.querySelector('#map-form button[type="submit"]');
    if (submitBtn) submitBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Map';
    window.editingMapId = null;
    if (mapCancelEditBtn) mapCancelEditBtn.classList.add('hidden');
    renderMaps([]);
    // ensure the Add Entry button is hidden on Maps
    if (addEntryBtn) addEntryBtn.classList.add("hidden");
    // hide entry search on Maps view
    if (entrySearchInput) entrySearchInput.classList.add('hidden');
    // ensure Show All is visible on Maps
    if (showAllButton) showAllButton.classList.remove('hidden');
  });

  // Notebook page: placeholder
  notebookLink.addEventListener("click", (e) => {
    e.preventDefault();
    searchInput.classList.add("hidden");
    locationSearchInput.classList.add("hidden");
    characterFilters.classList.add("hidden");
    addCharacterBtn.classList.add("hidden");
    addMapBtn.classList.add("hidden");
    addEntryBtn.classList.remove("hidden");
    mapSearchInput.classList.add("hidden");
    cartoucheSearchInput.classList.add("hidden");
    librarySearchInput.classList.add("hidden");
    entrySearchInput.classList.remove("hidden");
    // ensure Show All is visible on Notebook
    if (showAllButton) showAllButton.classList.remove('hidden');
    addNpcFormSection.classList.add("hidden");
    addMapFormSection.classList.add("hidden");
    addEntryFormSection.classList.add("hidden");
    npcCardsSection.classList.add("hidden");
    mapCardsSection.classList.add("hidden");
    notebookEntriesSection.classList.remove("hidden");
    if (cancelEditBtn) cancelEditBtn.classList.add('hidden');
    if (mapCancelEditBtn) mapCancelEditBtn.classList.add('hidden');
    if (entryCancelEditBtn) entryCancelEditBtn.classList.add('hidden');
    entryForm.reset();
    const submitBtn = document.querySelector('#entry-form button[type="submit"]');
    if (submitBtn) submitBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Entry';
    window.editingEntryId = null;
    entrySearchInput.value = "";
    renderEntries(notebook.getEntries());
  });

  // cancel / abort edit button handler
  if (cancelEditBtn) {
    cancelEditBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.editingId = null;
      npcForm.reset();
      imageFileInput.value = "";
      imagePreviewContainer.classList.add("hidden");
      dragDropZone.classList.remove("hidden");
      addNpcFormSection.classList.add('hidden');
      npcCardsSection.classList.remove('hidden');
      const submitBtn = document.querySelector('#npc-form button[type="submit"]');
      if (submitBtn) submitBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Character';
      cancelEditBtn.classList.add('hidden');
    });
  }

  // Map form cancel button handler
  if (mapCancelEditBtn) {
    mapCancelEditBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.editingMapId = null;
      mapForm.reset();
      mapImageFileInput.value = "";
      mapImagePreviewContainer.classList.add("hidden");
      mapDragDropZone.classList.remove("hidden");
      addMapFormSection.classList.add('hidden');
      mapCardsSection.classList.remove('hidden');
      const submitBtn = document.querySelector('#map-form button[type="submit"]');
      if (submitBtn) submitBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Map';
      mapCancelEditBtn.classList.add('hidden');
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
      companion: document.getElementById("is-companion").checked === true,
      enemy: document.getElementById("is-enemy").checked === true
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
      imageFileInput.value = "";
      imagePreviewContainer.classList.add("hidden");
      dragDropZone.classList.remove("hidden");
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
    imageFileInput.value = "";
    imagePreviewContainer.classList.add("hidden");
    dragDropZone.classList.remove("hidden");

    // Hide the form and show NPC cards after submission
    addNpcFormSection.classList.add("hidden");
    if (cancelEditBtn) cancelEditBtn.classList.add('hidden');
    npcCardsSection.classList.remove("hidden");
  });

  // Handle map form submission
  mapForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formValues = {
      name: document.getElementById("map-name").value,
      location: document.getElementById("map-location").value,
      cartouches: document.getElementById("cartouches").value,
      image: document.getElementById("map-image").value || "img/default.png"
    };

    // if we are editing an existing entry, update it
    if (window.editingMapId) {
      const updatedMap = { id: window.editingMapId, ...formValues };
      const ok = maps.updateMap(updatedMap);
      if (ok) {
        renderMaps(maps.getMaps());
      }
      // reset editing state
      window.editingMapId = null;
      const submitBtn = document.querySelector('#map-form button[type="submit"]');
      if (submitBtn) submitBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Map';
      mapForm.reset();
      mapImageFileInput.value = "";
      mapImagePreviewContainer.classList.add("hidden");
      mapDragDropZone.classList.remove("hidden");
      addMapFormSection.classList.add("hidden");
      if (mapCancelEditBtn) mapCancelEditBtn.classList.add('hidden');
      mapCardsSection.classList.remove("hidden");
      return;
    }

    // otherwise create a new id (avoid collisions) and add
    const current = maps.getMaps();
    const nextId = current.reduce((max, it) => Math.max(max, it.id || 0), 0) + 1;
    const newMap = { id: nextId, ...formValues };
    maps.addMap(newMap);
    renderMaps(maps.getMaps());
    mapForm.reset();
    mapImageFileInput.value = "";
    mapImagePreviewContainer.classList.add("hidden");
    mapDragDropZone.classList.remove("hidden");

    // Hide the form and show map cards after submission
    addMapFormSection.classList.add("hidden");
    if (mapCancelEditBtn) mapCancelEditBtn.classList.add('hidden');
    mapCardsSection.classList.remove("hidden");
  });

  // Live filter: general search across multiple NPC fields
  // Helper function to apply all character filters
  function applyCharacterFilters() {
    const characterSearchTerm = searchInput.value.toLowerCase().trim();
    const locationSearchTerm = locationSearchInput.value.toLowerCase().trim();
    const filterCompanion = filterCompanionCheckbox.checked;
    const filterEnemy = filterEnemyCheckbox.checked;
    
    let results = npc.getNpcs();
    
    // Apply character name/details filter if filled
    if (characterSearchTerm !== "") {
      results = results.filter(character => npc.searchNpcs(characterSearchTerm).includes(character));
    }
    
    // Apply notes filter if filled
    if (locationSearchTerm !== "") {
      results = results.filter(character =>
        character.notes.toLowerCase().includes(locationSearchTerm)
      );
    }
    
    // Apply companion filter if checked
    if (filterCompanion) {
      results = results.filter(character => character.companion === true);
    }
    
    // Apply enemy filter if checked
    if (filterEnemy) {
      results = results.filter(character => character.enemy === true);
    }
    
    addNpcFormSection.classList.add("hidden");
    if (cancelEditBtn) cancelEditBtn.classList.add('hidden');
    npcCardsSection.classList.remove("hidden");
    renderNPCs(results);
  }

  // Helper function to apply all map filters
  function applyMapFilters() {
    const mapSearchTerm = mapSearchInput.value.toLowerCase().trim();
    const cartoucheSearchTerm = cartoucheSearchInput.value.toLowerCase().trim();
    
    let results = maps.getMaps();
    
    // Apply map name filter if filled
    if (mapSearchTerm !== "") {
      results = results.filter(map => maps.searchMaps(mapSearchTerm).includes(map));
    }
    
    // Apply cartouche filter if filled
    if (cartoucheSearchTerm !== "") {
      results = results.filter(map => maps.searchCartouches(cartoucheSearchTerm).includes(map));
    }
    
    addMapFormSection.classList.add("hidden");
    if (mapCancelEditBtn) mapCancelEditBtn.classList.add('hidden');
    mapCardsSection.classList.remove("hidden");
    renderMaps(results);
  }

  // Character search with filters
  searchInput.addEventListener("input", () => {
    applyCharacterFilters();
  });

  // Location search with filters
  locationSearchInput.addEventListener("input", () => {
    applyCharacterFilters();
  });

  // Companion filter with checkboxes
  filterCompanionCheckbox.addEventListener("change", () => {
    applyCharacterFilters();
  });

  // Enemy filter with checkboxes
  filterEnemyCheckbox.addEventListener("change", () => {
    applyCharacterFilters();
  });

  // Map search with filters
  mapSearchInput.addEventListener("input", () => {
    applyMapFilters();
  });

  // Cartouche search with filters
  cartoucheSearchInput.addEventListener("input", () => {
    applyMapFilters();
  });

  // Clear search results
  clearAllButton.addEventListener("click", () => {
    // hide add form and show cards, then clear results
    searchInput.value = "";
    locationSearchInput.value = "";
    mapSearchInput.value = "";
    cartoucheSearchInput.value = "";
    librarySearchInput.value = "";
    addNpcFormSection.classList.add("hidden");
    addMapFormSection.classList.add("hidden");
    if (cancelEditBtn) cancelEditBtn.classList.add('hidden');
    if (mapCancelEditBtn) mapCancelEditBtn.classList.add('hidden');
    npcCardsSection.classList.remove("hidden");
    mapCardsSection.classList.add("hidden");
    renderNPCs([]);
  });

  // Library search - searches across all databases (only on home page)
  librarySearchInput.addEventListener("input", (event) => {
    const searchTerm = event.target.value;
    let npcResults = [];
    let mapResults = [];
    
    if (searchTerm.trim() !== "") {
      npcResults = npc.searchNpcs(searchTerm);
      mapResults = maps.searchMaps(searchTerm);
      // Also search cartouches
      const cartoucheResults = maps.searchCartouches(searchTerm);
      mapResults = [...new Set([...mapResults, ...cartoucheResults])]; // Combine and remove duplicates
    }
    
    // Show both NPC and map cards
    addNpcFormSection.classList.add("hidden");
    addMapFormSection.classList.add("hidden");
    if (cancelEditBtn) cancelEditBtn.classList.add('hidden');
    if (mapCancelEditBtn) mapCancelEditBtn.classList.add('hidden');
    npcCardsSection.classList.remove("hidden");
    mapCardsSection.classList.remove("hidden");
    
    renderNPCs(npcResults);
    renderMaps(mapResults);
  });

  // Show all button - context aware (characters, maps, or notebook)
  showAllButton.addEventListener("click", () => {
    // Check which page is currently visible
    if (!mapCardsSection.classList.contains("hidden")) {
      // Maps page - show all maps
      addMapFormSection.classList.add("hidden");
      if (mapCancelEditBtn) mapCancelEditBtn.classList.add('hidden');
      mapCardsSection.classList.remove("hidden");
      renderMaps(map.getMaps());
    } else if (!notebookEntriesSection.classList.contains("hidden")) {
      // Notebook page - show all notes
      addEntryFormSection.classList.add("hidden");
      if (entryCancelEditBtn) entryCancelEditBtn.classList.add('hidden');
      notebookEntriesSection.classList.remove("hidden");
      renderEntries(notebook.getEntries());
    } else {
      // Characters page - show all characters
      addNpcFormSection.classList.add("hidden");
      if (cancelEditBtn) cancelEditBtn.classList.add('hidden');
      npcCardsSection.classList.remove("hidden");
      renderNPCs(npc.getNpcs());
    }
  });

  // Add character button - show the add character form
  addCharacterBtn.addEventListener("click", () => {
    addNpcFormSection.classList.remove("hidden");
    npcCardsSection.classList.add("hidden");
    npcForm.reset();
    imageFileInput.value = "";
    imagePreviewContainer.classList.add("hidden");
    dragDropZone.classList.remove("hidden");
    const submitBtn = document.querySelector('#npc-form button[type="submit"]');
    if (submitBtn) submitBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Character';
    window.editingId = null;
    if (cancelEditBtn) cancelEditBtn.classList.add('hidden');
  });

  // Add map button - show the add map form
  addMapBtn.addEventListener("click", () => {
    addMapFormSection.classList.remove("hidden");
    mapCardsSection.classList.add("hidden");
    mapForm.reset();
    mapImageFileInput.value = "";
    mapImagePreviewContainer.classList.add("hidden");
    mapDragDropZone.classList.remove("hidden");
    const submitBtn = document.querySelector('#map-form button[type="submit"]');
    if (submitBtn) submitBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Map';
    window.editingMapId = null;
    if (mapCancelEditBtn) mapCancelEditBtn.classList.add('hidden');
  });

  // Add entry button - show the add entry form
  addEntryBtn.addEventListener("click", () => {
    addEntryFormSection.classList.remove("hidden");
    notebookEntriesSection.classList.add("hidden");
    entryForm.reset();
    const submitBtn = document.querySelector('#entry-form button[type="submit"]');
    if (submitBtn) submitBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Entry';
    window.editingEntryId = null;
    if (entryCancelEditBtn) entryCancelEditBtn.classList.add('hidden');
  });

  // Entry form submission
  entryForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formValues = {
      date: document.getElementById("entry-date").value,
      content: document.getElementById("entry-content").value
    };

    // if we are editing an existing entry, update it
    if (window.editingEntryId) {
      const updatedEntry = { id: window.editingEntryId, ...formValues };
      const ok = notebook.updateEntry(updatedEntry);
      if (ok) {
        renderEntries(notebook.getEntries());
      }
      // reset editing state
      window.editingEntryId = null;
      const submitBtn = document.querySelector('#entry-form button[type="submit"]');
      if (submitBtn) submitBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Entry';
      entryForm.reset();
      addEntryFormSection.classList.add("hidden");
      if (entryCancelEditBtn) entryCancelEditBtn.classList.add('hidden');
      notebookEntriesSection.classList.remove("hidden");
      return;
    }

    // otherwise create a new entry and add
    notebook.addEntry(formValues);
    renderEntries(notebook.getEntries());
    entryForm.reset();

    // Hide the form and show entries after submission
    addEntryFormSection.classList.add("hidden");
    if (entryCancelEditBtn) entryCancelEditBtn.classList.add('hidden');
    notebookEntriesSection.classList.remove("hidden");
  });

  // Entry search
  entrySearchInput.addEventListener("input", () => {
    const searchTerm = entrySearchInput.value.toLowerCase().trim();
    let results = notebook.getEntries();
    
    if (searchTerm !== "") {
      results = notebook.searchEntries(searchTerm);
    }
    
    addEntryFormSection.classList.add("hidden");
    if (entryCancelEditBtn) entryCancelEditBtn.classList.add('hidden');
    notebookEntriesSection.classList.remove("hidden");
    renderEntries(results);
  });

  // Entry cancel/abort edit button handler
  if (entryCancelEditBtn) {
    entryCancelEditBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.editingEntryId = null;
      addEntryFormSection.classList.add('hidden');
      notebookEntriesSection.classList.remove('hidden');
      entryForm.reset();
      const submitBtn = document.querySelector('#entry-form button[type="submit"]');
      if (submitBtn) submitBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Entry';
      if (entryCancelEditBtn) entryCancelEditBtn.classList.add('hidden');
    });
  }

  // Toggle between camp-mode and travel-mode (cycles) and persist the choice
  campToggle.addEventListener("click", () => {
    if (document.body.classList.contains("camp-mode")) {
      // switch to travel
      document.body.classList.remove("camp-mode");
      document.body.classList.add("travel-mode");
      localStorage.setItem("theme", "travel");
      localStorage.setItem("campMode", false);
      campToggle.innerHTML = '<i class="fa-solid fa-fire"></i> Camp';
    } else if (document.body.classList.contains("travel-mode")) {
      // switch to camp
      document.body.classList.remove("travel-mode");
      document.body.classList.add("camp-mode");
      localStorage.setItem("theme", "camp");
      localStorage.setItem("campMode", true);
      campToggle.innerHTML = '<i class="fa-solid fa-shoe-prints"></i> Travel';
    } else {
      // no theme active -> default to camp
      document.body.classList.add("camp-mode");
      localStorage.setItem("theme", "camp");
      localStorage.setItem("campMode", true);
      campToggle.innerHTML = '<i class="fa-solid fa-shoe-prints"></i> Travel';
    }
  });
});
