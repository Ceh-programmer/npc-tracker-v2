let npc = {
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
      notes: "Unpredictable, not to be trusted"
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
        notes: "Retired sellsword"
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
        notes: "Mediocre healing abilities"
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
        notes: "Mention Taured from the Crossing for a discount"
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
        notes: "Very dangerous enemy"
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
        notes: ""
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
}
};

