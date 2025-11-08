// Renders a list of NPCs into the #npc-cards section
function renderNPCs(npcList) {
  const container = document.getElementById("npc-cards");
  container.innerHTML = "";

  if (npcList.length === 0) {
    container.innerHTML = "<p>No characters to display. Try a new search or click 'Show All'.</p>";
    return;
  }

  npcList.forEach((npc) => {
    const card = document.createElement("article");
    card.classList.add("npc-card");
    card.innerHTML = `
      <h2 class="npc-name" data-id="${npc.id}">${npc.name} ${npc.companion ? '<span class="companion-badge">Companion</span>' : ''}</h2>
      <img src="${npc.image}" alt="Portrait of ${npc.name}" />
      <p><strong>Profession:</strong> ${npc.profession}</p>
      <p><strong>Alignment:</strong> ${npc.alignment}</p>
      <p><strong>Race:</strong> ${npc.race}</p>
      <p><strong>Gender:</strong> ${npc.gender}</p>
      <p><strong>Location:</strong> ${npc.location}</p>
      <p><strong>Association:</strong> ${npc.association}</p>
      <p><strong>Status:</strong> ${npc.status}</p>
      <p><strong>Notes:</strong> ${npc.notes}</p>
    `;
    container.appendChild(card);

    // Adds click interaction to show name + profession in a temporary message
    const npcName = card.querySelector(".npc-name");
    npcName.addEventListener("click", () => {
      const msgBox = document.getElementById("message-box");
      msgBox.textContent = `${npc.name}: ${npc.race} ${npc.profession}`;
      msgBox.classList.remove("hidden");

      setTimeout(() => {
        msgBox.classList.add("hidden");
      }, 3000);
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
      addNpcFormSection.classList.remove("hidden");
      npcCardsSection.classList.add("hidden");
    } else {
      addNpcFormSection.classList.add("hidden");
      npcCardsSection.classList.remove("hidden");
    }
  });

  // Handle submission of new NPC from form
  npcForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const newNpc = {
      id: npc.getNpcs().length + 1,
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

    // Add the new NPC to the list and re-render
    npc.addNpc(newNpc);
    renderNPCs(npc.getNpcs());
    npcForm.reset();

    // Hide the form and show NPC cards after submission
    addNpcFormSection.classList.add("hidden");
    npcCardsSection.classList.remove("hidden");
  });

  // Show companions only when the Companions nav link is clicked
  if (companionsLink) {
    companionsLink.addEventListener("click", (e) => {
      e.preventDefault();
      // hide add form and show cards
      addNpcFormSection.classList.add("hidden");
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
    npcCardsSection.classList.remove("hidden");
    renderNPCs(npc.getNpcs());
  });

  // Clear search results
  clearAllButton.addEventListener("click", () => {
    // hide add form and show cards, then clear results
    searchInput.value = "";
    addNpcFormSection.classList.add("hidden");
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
