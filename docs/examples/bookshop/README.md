# Bookshop - Inline Contextual Documentation in Practice

<!-- docuserve:example-launch:start -->
> **[Launch the live app](examples/bookshop/index.html)** - runs in your browser, opens in a new tab.
<!-- docuserve:example-launch:end -->

A small e-commerce demo that puts the documentation **right next to the
UI it describes**. Browse a book catalog, click a book to open its
store page, and at every step the right-hand help panel knows which
route you're on and what to show. Hover an icon for a markdown
tooltip, press **F1** to toggle the whole panel, click a `?` button
next to a section header to jump to a specific topic - all backed by
one provider, one topics manifest, and a folder of plain markdown
files.

This is the reference example for **embedding levels 3 and 4** from
the inline-documentation module: route-mapped contextual help, plus
data-attribute-driven tooltips that resolve content from the same
topics manifest. The application code does no markdown parsing of its
own - the provider owns everything from file loading to tooltip
positioning.

## What it demonstrates

| Capability | Where you see it |
|------------|------------------|
| Inline-documentation provider registered as `Pict-InlineDocumentation` | `addProvider('Pict-InlineDocumentation', libInlineDocumentation.default_configuration, libInlineDocumentation)` |
| Topics manifest pre-loaded into AppData | `AppData.InlineDocumentation.Topics = _TopicsData` before `initializeDocumentation()` |
| Route-mapped help panel | `tmpDocProvider.navigateToRoute('/books/store/' + pBookID)` switches the topic in the help panel |
| `data-d-tooltip` attribute -> markdown tooltip | `<span data-d-tooltip="catalog-info" data-d-tooltip-icon></span>` - provider scans on render, attaches hover/focus tooltips |
| Topic-keyed help buttons | `tmpApp.showHelp('BOOKSHOP-STORE')` triggers a specific topic regardless of current route |
| F1 keyboard shortcut for the help panel | `document.addEventListener('keydown', ...)` in `_setupKeyboardShortcuts()` |
| `initializeDocumentation` with save/upload handlers | Demo wires `onSave`, `onTopicsSave`, `onImageUpload` callbacks the provider invokes |
| Edit-mode toggle | `tmpDocProvider.setEditEnabled(true)` lets the demo edit the topic markdown live |
| `loadTopicDocument(topicCode)` API | The application's `showHelp(topicCode)` reaches into the provider to swap topics on demand |
| Markdown-with-help-links | `[Book Catalog Help](help:book-list.md)` - `help:` URLs resolve via the documentation provider, not the browser |
| Wildcard route matching | `"Routes": ["/books/store/*"]` matches `/books/store/1`, `/books/store/2`, ... |
| Tooltips co-located with topics | Each topic record carries a `Tooltips: {...}` block that the provider auto-registers |

## Key files

- `Pict-Application-Bookshop.js` - the application. Registers the
  inline-documentation provider, three views (BookList, Store,
  HelpToggle), bootstraps `AppData.Bookshop` + `AppData.InlineDocumentation`,
  calls `initializeDocumentation` with the demo save callbacks, wires
  the F1 shortcut, and owns the `toggleHelp` / `showHelp` /
  `showBook` / `showBookList` / `filterByGenre` navigation methods.
- `Pict-Application-Bookshop-Configuration.json` - the Pict
  application stanza. Disables `AutoRenderMainViewportViewAfterInitialize`
  so the application can do the initial render after the provider has
  finished loading its topics.
- `data/BookshopData.json` - the books seed data
  (`Title` / `Author` / `Price` / `Genre` / `Cover` / `Description` / `InStock`).
- `data/pict_documentation_topics.json` - the topics manifest. Five
  topics, two of them carrying inline tooltip records that the
  provider auto-registers.
- `docs/welcome.md`, `book-list.md`, `book-detail.md`, `store.md`,
  `search-filter.md` - the topic content as plain markdown files. Each
  referenced by `TopicHelpFilePath` in the manifest.
- `views/PictView-Bookshop-BookList.js` - grid of book cards with
  genre filter. Sprinkles `data-d-tooltip="..."` and
  `data-d-tooltip-icon` attributes everywhere; calls
  `tmpDocProvider.scanTooltips()` after every render.
- `views/PictView-Bookshop-Store.js` - single-book store page. Same
  pattern as BookList - `data-d-tooltip` attributes plus a `?` help
  button that triggers `showHelp('BOOKSHOP-STORE')`.
- `views/PictView-Bookshop-HelpToggle.js` - a stub view for the
  help-toggle slot, included for symmetry with future expansion.
- `html/index.html` - defines the layout shell: a header bar with the
  help button, a content area, a slide-in help panel on the right, and
  an F1 hint pinned to the bottom-right.

## The data model

Two AppData roots, populated in `onAfterInitializeAsync`:

```js
this.pict.AppData.Bookshop =
{
    Books: _BookshopData.Books,        // the catalog
    CurrentBook: null,                  // selected book when in Store view
    CurrentView: 'BookList',            // 'BookList' or 'Store'
    GenreFilter: '',                    // current genre filter, '' = show all
    HelpVisible: false,                 // is the right-side panel open?
    HelpTopicCode: 'BOOKSHOP-WELCOME'   // initial topic
};

this.pict.AppData.InlineDocumentation = {};
this.pict.AppData.InlineDocumentation.Topics = _TopicsData;
```

The provider keys its state under `AppData.InlineDocumentation.*`. Pre-loading
`Topics` before calling `initializeDocumentation` is a stash-then-init
pattern: the provider picks the topics up out of AppData rather than
needing them in the constructor, which makes hot-reload and
edit-mode-driven topic changes trivial.

The five-topic manifest (`pict_documentation_topics.json`) is the
canonical shape:

```json
{
    "BOOKSHOP-STORE": {
        "TopicCode": "BOOKSHOP-STORE",
        "TopicHelpFilePath": "store.md",
        "TopicTitle": "The Store Page",
        "Routes": ["/books/store/*"],
        "Tooltips": {
            "genre-badge": { "Content": "Books are categorized by genre to help you find similar titles.\n\nSee the [full catalog](help:book-list.md) to browse by genre." },
            "store-price": { "Content": "The listed price is the final price in **USD**, tax included.\n\n[Pricing details](help:store.md#pricing)" }
            // ... three more
        }
    },
    // ... four more topics
}
```

`Routes` is an array of route patterns the topic matches; `*` is a
wildcard. `Tooltips` is a `data-d-tooltip` -> `{Content}` map that the
provider auto-registers when the topic loads.

---

## Feature 1 - Initializing the documentation provider

The application's constructor adds the provider with its default
configuration. The actual initialisation happens in
`onAfterInitializeAsync`, where the demo wires three callbacks the
provider invokes:

```js
let tmpDocProvider = this.pict.providers['Pict-InlineDocumentation'];
tmpDocProvider.initializeDocumentation(
    {
        DocsBaseURL: 'docs/',
        onSave: (pSaveData, fSaveCallback) =>
        {
            // Demo save handler - log to console
            this.log.info(`Bookshop: Saving document [${pSaveData.Path}] (${pSaveData.Content.length} chars)`);
            // In a real app, this would PUT to an API
            return fSaveCallback(null);
        },
        onTopicsSave: (pTopics, fSaveCallback) =>
        {
            // Demo topics save handler - log to console
            this.log.info(`Bookshop: Saving topics (${Object.keys(pTopics).length} topics)`);
            // In a real app, this would PUT to an API
            return fSaveCallback(null);
        },
        onImageUpload: (pFile, pDocumentPath, fCallback) =>
        {
            // Demo image upload handler - log to console
            this.log.info(`Bookshop: Image upload [${pFile.name}] (${pFile.size} bytes) for document [${pDocumentPath}]`);
            // In a real app, this would POST the file to a server
            return fCallback('Demo mode: no upload server configured');
        }
    },
    () =>
    {
        // Enable edit mode for demo
        tmpDocProvider.setEditEnabled(true);

        // Render the main book list
        this.pict.views['Bookshop-BookList'].render();

        // Load help for the initial route
        tmpDocProvider.navigateToRoute('/books');

        // Set up F1 keyboard listener
        this._setupKeyboardShortcuts();

        return super.onAfterInitializeAsync(fCallback);
    });
```

Three things happen in the initialisation callback:

1. **`setEditEnabled(true)`** - switches the help panel into edit mode,
   so clicking the **Edit** button in the panel reveals a markdown
   editor for the current topic. The `onSave` callback fires on Save;
   the demo just logs to console.
2. **`navigateToRoute('/books')`** - primes the help panel with the
   topic that matches the initial route. This is how route-aware help
   works: the application tells the provider what URL the user is on;
   the provider looks up the matching topic from the manifest's
   `Routes` arrays.
3. **`_setupKeyboardShortcuts()`** - registers a `keydown` listener for
   the F1 key. The legitimate exception to the no-`addEventListener`
   rule: this is a window-level shortcut, not a per-view re-rendered
   element.

The initial render only happens *inside* this callback because the
provider's initialisation is async (it loads markdown files via fetch
in real deployments). Rendering the BookList view earlier would risk
the help panel being empty when the user first sees the page.

---

## Feature 2 - Topics manifest with route mapping

The manifest is the single source of truth for *which topic shows
when*. Each topic has a `Routes` array:

```json
"BOOKSHOP-WELCOME": {
    "TopicCode": "BOOKSHOP-WELCOME",
    "TopicHelpFilePath": "welcome.md",
    "TopicTitle": "Welcome to the Bookshop",
    "Routes": ["/"]
},
"BOOKSHOP-BOOKLIST": {
    "TopicCode": "BOOKSHOP-BOOKLIST",
    "TopicHelpFilePath": "book-list.md",
    "TopicTitle": "Browsing the Book Catalog",
    "Routes": ["/books", "/books/catalog"]
},
"BOOKSHOP-STORE": {
    "TopicCode": "BOOKSHOP-STORE",
    "TopicHelpFilePath": "store.md",
    "TopicTitle": "The Store Page",
    "Routes": ["/books/store/*"]
}
```

`Routes: ["/"]` is the literal root; `["/books", "/books/catalog"]` is
two aliases for the same topic; `["/books/store/*"]` is a wildcard
that matches every store page regardless of the book id.

The application calls `navigateToRoute(...)` whenever it changes
"page":

```js
showBook(pBookID)
{
    let tmpState = this.pict.AppData.Bookshop;
    let tmpDocProvider = this.pict.providers['Pict-InlineDocumentation'];

    for (let i = 0; i < tmpState.Books.length; i++)
    {
        if (tmpState.Books[i].IDBook === pBookID)
        {
            tmpState.CurrentBook = tmpState.Books[i];
            tmpState.CurrentView = 'Store';
            this.pict.views['Bookshop-Store'].render();

            // Update help for the store route
            tmpDocProvider.navigateToRoute('/books/store/' + pBookID);
            return;
        }
    }
}
```

The route is fabricated - the bookshop is a single-page app with no
real URL changes. The route is just a string the application invents
to tell the documentation provider *what context* the user is in. In a
router-driven app the same call lives in the router's `onRouteChange`
callback.

---

## Feature 3 - `data-d-tooltip` attributes for inline tooltips

The BookList view sprinkles tooltip attributes through its HTML:

```js
// Section header with help button
tmpHTML += '<div class="bookshop-section-header">';
tmpHTML += '<h2 class="bookshop-section-title" data-d-tooltip="catalog-title">Book Catalog</h2>';
tmpHTML += '<span data-d-tooltip="catalog-info" data-d-tooltip-icon></span>';
tmpHTML += '<button class="bookshop-help-btn" id="Bookshop-Help-BookList" title="Help: Book Catalog">?</button>';
tmpHTML += '</div>';

// Filter bar with help button
tmpHTML += '<div class="bookshop-filter-bar">';
tmpHTML += '<label data-d-tooltip="genre-filter">Genre:</label>';
// ...
```

`data-d-tooltip="catalog-info"` is the tooltip key. The provider
matches it against the current topic's `Tooltips` block:

```json
"Tooltips": {
    "catalog-title": { "Content": "Browse our full collection of books. Click any book to view details and purchase.\n\nSee [Book Catalog Help](help:book-list.md) for the full guide." },
    "catalog-info":  { "Content": "**Tip:** Use the genre filter to narrow results, or click a book card to visit its store page.\n\nLearn more: [Searching & Filtering](help:search-filter.md)" },
    "genre-filter":  { "Content": "Filter the catalog by literary genre. Select **All Genres** to see everything.\n\nFor advanced filtering tips, see [Search & Filter Guide](help:search-filter.md)." }
}
```

`data-d-tooltip-icon` (no value) tells the provider to **render a
small info icon into that span**. Elements without `data-d-tooltip-icon`
just gain hover behaviour on the existing content. The provider scans
on demand:

```js
tmpContainer.innerHTML = tmpHTML;

// Wire click handlers
this._wireHandlers(tmpContainer);

// Scan for tooltip placeholders
let tmpDocProvider = this.pict.providers['Pict-InlineDocumentation'];
if (tmpDocProvider)
{
    tmpDocProvider.scanTooltips();
}
```

Calling `scanTooltips()` after every render is the contract - the
provider walks the DOM, finds every `data-d-tooltip` attribute, and
re-attaches its hover/focus tooltips. New elements added by a
re-render are picked up; orphaned references are cleaned up. The
provider also installs a MutationObserver as a fallback so
dynamically-injected nodes pick up tooltips even without an explicit
scan call.

---

## Feature 4 - Topic-keyed help buttons

The `?` button next to each section header bypasses route mapping and
jumps straight to a specific topic:

```js
let tmpHelpBookList = pContainer.querySelector('#Bookshop-Help-BookList');
if (tmpHelpBookList)
{
    tmpHelpBookList.addEventListener('click', (pEvent) =>
    {
        pEvent.stopPropagation();
        if (tmpApp)
        {
            tmpApp.showHelp('BOOKSHOP-BOOKLIST');
        }
    });
}
```

The application's `showHelp` opens the panel (if it isn't already
open) and calls the provider's `loadTopicDocument` with the topic
code:

```js
showHelp(pTopicCode)
{
    let tmpState = this.pict.AppData.Bookshop;
    let tmpDocProvider = this.pict.providers['Pict-InlineDocumentation'];

    tmpState.HelpTopicCode = pTopicCode;

    // Ensure help panel is visible
    if (!tmpState.HelpVisible)
    {
        tmpState.HelpVisible = true;
        let tmpHelpPanel = document.getElementById('Bookshop-Help-Panel');
        let tmpContentArea = document.getElementById('Bookshop-Content-Area');
        if (tmpHelpPanel) { tmpHelpPanel.classList.add('visible'); }
        if (tmpContentArea) { tmpContentArea.classList.add('help-open'); }
    }

    // Load the topic document
    tmpDocProvider.loadTopicDocument(pTopicCode);
}
```

`loadTopicDocument(pTopicCode)` is the provider's "show this exact
topic" API. It loads the markdown file declared in `TopicHelpFilePath`,
renders it into the help panel, and **registers any `Tooltips` block
attached to that topic** so they activate for the current view.

`navigateToRoute('...')` is the "show whatever matches this route"
API. Use it when the application changes context. `loadTopicDocument`
is for explicit user requests - clicking a `?` button, opening a
"how do I..." link, restoring a deep-linked help URL.

---

## Feature 5 - F1 keyboard shortcut

F1 is the universal "help me" key. The application registers it once
at boot:

```js
_setupKeyboardShortcuts()
{
    if (typeof document === 'undefined')
    {
        return;
    }

    document.addEventListener('keydown', (pEvent) =>
    {
        if (pEvent.key === 'F1')
        {
            pEvent.preventDefault();
            this.toggleHelp();
        }
    });
}
```

`toggleHelp()` flips `AppData.Bookshop.HelpVisible` and toggles the
`visible` class on the panel + the `help-open` class on the content
area:

```js
toggleHelp()
{
    let tmpState = this.pict.AppData.Bookshop;
    tmpState.HelpVisible = !tmpState.HelpVisible;

    let tmpHelpPanel = document.getElementById('Bookshop-Help-Panel');
    let tmpContentArea = document.getElementById('Bookshop-Content-Area');

    if (tmpState.HelpVisible)
    {
        if (tmpHelpPanel) { tmpHelpPanel.classList.add('visible'); }
        if (tmpContentArea) { tmpContentArea.classList.add('help-open'); }
    }
    else
    {
        if (tmpHelpPanel) { tmpHelpPanel.classList.remove('visible'); }
        if (tmpContentArea) { tmpContentArea.classList.remove('help-open'); }
    }
}
```

The slide-in animation lives in CSS (the panel's `transform: translateX(100%)`
toggles to `translateX(0)` on `.visible`); the content area's
`margin-right` animates from `0` to `380px` on `.help-open` to make
room.

Window-level keyboard handlers and `MutationObserver` callbacks are
the explicit exceptions to Pict's "no `addEventListener`" rule. There's
no inline-handler equivalent for keyboard shortcuts on the document,
and the listener is installed once at boot - it does not get torn
down by view re-renders.

---

## Feature 6 - Markdown topics with `help:` links

Each topic's markdown file is plain CommonMark, with one extension:
the `help:` URL scheme is intercepted by the provider so cross-topic
links don't navigate the browser.

```markdown
# Browsing the Book Catalog

The catalog shows every book currently available, with cover, title,
author, and price. Click any card to open the [store page for that
book](help:store.md).

## Filtering by Genre

The genre filter narrows the list. Pick **All Genres** to clear it.
For more advanced searches see the [Search & Filter guide](help:search-filter.md).
```

`[Search & Filter guide](help:search-filter.md)` resolves to a click
that calls `loadTopicDocument(...)` for the topic whose
`TopicHelpFilePath` is `search-filter.md`. The browser stays on the
same page; the help panel swaps content.

Tooltip content uses the same syntax - every `Tooltips` entry's
`Content` field is markdown that may contain `help:` links, so a hover
tooltip can deep-link into a long-form topic.

The demo's `DocsBaseURL: 'docs/'` is the directory prefix the
provider prepends to every `TopicHelpFilePath`. In production this
typically points at a server endpoint or a CDN; locally it's just
the `docs/` folder copied next to the bundle.

---

## Feature 7 - Edit-mode demo with save callbacks

`setEditEnabled(true)` turns the help panel's content area into an
editable region. The user can edit a topic's markdown, click Save, and
the provider invokes the `onSave` callback the host supplied:

```js
onSave: (pSaveData, fSaveCallback) =>
{
    // Demo save handler - log to console
    this.log.info(`Bookshop: Saving document [${pSaveData.Path}] (${pSaveData.Content.length} chars)`);
    // In a real app, this would PUT to an API
    return fSaveCallback(null);
}
```

`pSaveData` is `{ Path, Content }`. The demo just logs and resolves
the callback with no error. In production the same callback typically
does:

```js
return fetch('/api/docs/' + pSaveData.Path, { method: 'PUT', body: pSaveData.Content })
    .then(() => fSaveCallback(null))
    .catch((e) => fSaveCallback(e));
```

`onTopicsSave` fires when the user edits the topics manifest itself
(via the topic-manager view); `onImageUpload` fires when a user drops
an image into the markdown editor. All three callbacks are async; the
provider waits for the host's `fSaveCallback(err)` before declaring
the save complete. The demo's `onImageUpload` deliberately errors out
with `'Demo mode: no upload server configured'` to show the panel's
inline error state.

---

## Running the example

```bash
cd example_applications/bookshop
npm install
npm run build      # quack build -> quack copy -> dist/
# Open dist/index.html in a browser, or serve dist/ statically:
#   cd dist && python3 -m http.server 8080
#   visit http://localhost:8080
```

The build's `copyFiles` is what stages the markdown documents and the
topics manifest into `dist/docs/`, where the provider's
`DocsBaseURL: 'docs/'` finds them at runtime.

## Things to try in the running app

- **Hover the `?` icons next to "Book Catalog" and "Genre"** - markdown
  tooltips appear, with `help:` links you can click to jump to the
  full topic.
- **Click the help button in the header** (top-right `?` Help) - the
  panel slides in from the right. The content area shrinks to make
  room.
- **Press F1** - same thing. F1 again to close.
- **Click any book card** - the store page loads, *and* the help
  panel content swaps to the store topic because
  `navigateToRoute('/books/store/' + id)` matched the wildcard route.
- **Click the `?` button next to a section header** -
  `showHelp('BOOKSHOP-...')` opens the panel (if closed) and loads the
  specific topic regardless of current route.
- **Hover the price** on the store page - a tooltip explains
  pricing and links to the longer topic.
- **Click the Edit button in the help panel** - the content area
  becomes editable. Make a change, click Save, watch the console log
  the `onSave` callback firing with the document path and content
  length.
- **Filter by Genre** - the catalog updates immediately. The help
  panel doesn't change because the route is still `/books`.

## Takeaways

1. **The application doesn't render documentation.** It tells the
   provider what route the user is on and what tooltip keys are
   relevant; the provider does everything from markdown parsing to
   hover/focus event wiring to error rendering.
2. **The topics manifest is the contract.** Route mapping, tooltip
   binding, and topic content all flow from the same JSON file. Adding
   a new section is "add a topic with its `Routes` and `Tooltips`"; no
   code change.
3. **`scanTooltips()` after every render is the rule.** Re-renders
   wipe the DOM; the provider needs to know to re-attach handlers.
   Calling it is cheap (it's idempotent) and forgetting it manifests
   as "tooltips work the first time then go silent after a filter."
4. **`navigateToRoute` and `loadTopicDocument` are different verbs.**
   Route changes follow user navigation; explicit help buttons override
   the route for targeted jumps. Both end up calling the same provider
   internals; the distinction is who's driving.
5. **Save callbacks let the host own persistence.** The provider
   reads, parses, edits, and re-renders markdown - but a host that
   keeps its docs on a CMS, in a Git repo, or in S3 plugs into the
   exact same callbacks. No subclassing required.

## Related documentation

- [Overview](../../overview.md) - what inline documentation does and why
- [Quickstart](../../quickstart.md) - minimum-viable wiring
- [Embedding Level 3 - Hand-Authored Tooltips](../../embedding-level3-tooltips.md) - the `data-d-tooltip` pattern the bookshop uses
- [Embedding Level 4 - Auto-Generated Tooltips](../../embedding-level4-autogen.md) - the next step after this example
- [API Reference](../../api-reference.md) - every provider method (`initializeDocumentation`, `navigateToRoute`, `loadTopicDocument`, `scanTooltips`, `setEditEnabled`, ...)
- [Architecture](../../architecture.md) - how the provider, layout view, and topics manifest fit together
