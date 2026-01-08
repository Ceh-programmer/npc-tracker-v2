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

document.addEventListener("DOMContentLoaded", () => {
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
});
