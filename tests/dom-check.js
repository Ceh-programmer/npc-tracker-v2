const { JSDOM } = require('jsdom');
const path = require('path');

(async () => {
  try {
    const indexPath = path.join(__dirname, '..', 'index.html');
    const dom = await JSDOM.fromFile(indexPath, {
      runScripts: 'dangerously',
      resources: 'usable',
      url: 'file://' + indexPath
    });

    // Wait for scripts to load and execute
    await new Promise((res) => setTimeout(res, 800));

    const win = dom.window;
    const doc = win.document;

    function state() {
      const el = id => doc.getElementById(id);
      const hidden = (el) => !el ? null : el.classList.contains('hidden');

      return {
        showAllButton_hidden: hidden(el('show-all')),
        showAllButton_class: el('show-all') ? el('show-all').className : null,
        addEntryBtn_hidden: hidden(el('add-entry-btn')),
        addEntryBtn_class: el('add-entry-btn') ? el('add-entry-btn').className : null,
        entrySearch_hidden: hidden(el('entry-search')),
        entrySearch_class: el('entry-search') ? el('entry-search').className : null,
        npcSearch_hidden: hidden(el('npc-search')),
        mapSearch_hidden: hidden(el('map-search')),
        cartoucheSearch_hidden: hidden(el('cartouche-search')),
        librarySearch_hidden: hidden(el('library-search'))
      };
    }

    const results = {};

    // initial state (after load)
    results.afterLoad = state();

    // simulate clicking notebook link
    const notebookLink = doc.getElementById('notebook-link');
    if (notebookLink) {
      notebookLink.click();
      await new Promise((res) => setTimeout(res, 200));
      results.afterNotebookClick = state();
      results.afterNotebookClick._note = 'clicked notebook';
    }

    // simulate clicking home link
    const homeLink = doc.getElementById('home-link');
    if (homeLink) {
      homeLink.click();
      await new Promise((res) => setTimeout(res, 200));
      results.afterHomeClick = state();
      results.afterHomeClick._note = 'clicked home';
    }

    // simulate clicking characters link
    const charactersLink = doc.getElementById('characters-link');
    if (charactersLink) {
      charactersLink.click();
      await new Promise((res) => setTimeout(res, 200));
      results.afterCharactersClick = state();
    }

    // simulate clicking maps link
    const mapsLink = doc.getElementById('maps-link');
    if (mapsLink) {
      mapsLink.click();
      await new Promise((res) => setTimeout(res, 200));
      results.afterMapsClick = state();
    }

    console.log(JSON.stringify(results, null, 2));
    process.exit(0);
  } catch (err) {
    console.error('Error during DOM check:', err);
    process.exit(2);
  }
})();
