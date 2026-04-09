# Level 1 — Sidebar + Table of Contents

The lightest touch. You drop in a sidebar that lists every topic in your docs corpus and lets the user click through. No route mapping, no tooltips, no manifest wiring — just a reading surface.

Good for: internal tools, admin panels, anything where "there's a help pane in the corner" is enough.

## What You End Up With

- A collapsible sidebar pane (or drawer) with a tree of topics grouped by category
- A reading surface that renders the selected topic as HTML
- Keyword search across the corpus (if a keyword index is present)

## HTML

Add a single container element wherever you want the help panel to live:

```html
<aside id="AppHelpSidebar" class="app-help"></aside>
```

## JavaScript

```js
const libPict = require('pict');
const libInlineDocs = require('pict-section-inlinedocumentation');

const _Pict = new libPict({ Product: 'My App', Version: '1.0.0' });

_Pict.addSection('InlineDocumentation', libInlineDocs,
{
    DocumentationRoot: '/docs/',
    CatalogURL: '/docs/retold-catalog.json',
    KeywordIndexURL: '/docs/retold-keyword-index.json',
    DefaultTopic: 'overview',
    SidebarContainer: '#AppHelpSidebar'
});

_Pict.onAfterInitializeAsync = async () =>
{
    await _Pict.views.InlineDocumentation.renderAsync();
};
```

That's it. The section owns the sidebar, owns the reading pane (it creates an internal one if `ReadingPaneContainer` is not provided), and owns the click handlers.

## Toggling Visibility

Most apps hide help behind a button. Bind it to a provider flag:

```js
document.getElementById('HelpToggleButton').addEventListener('click', () =>
{
    const tmpPane = document.getElementById('AppHelpSidebar');
    tmpPane.classList.toggle('open');
});
```

The section doesn't care whether its container is visible — it only renders when asked.

## Grouping and Ordering

Topic grouping is taken from the catalog's `Category` field, which `pict-docuserve prepare-docs` populates from frontmatter. Add frontmatter to your Markdown:

```markdown
---
title: Editing Records
category: Records
order: 20
---

# Editing Records

...
```

Topics are sorted by `order` within each category, then by title.

## Search

If you pointed at a `retold-keyword-index.json`, the sidebar automatically gets a search box at the top. To drive search from your own UI instead:

```js
document.getElementById('MyHelpSearch').addEventListener('input', async (e) =>
{
    const tmpResults = await _Pict.views.InlineDocumentation.searchAsync(e.target.value);
    renderResults(tmpResults);
});
```

## When to Graduate

If users are having to hunt for the right topic, it's time to jump to **[Level 2: Route-Mapped Content](#/page/embedding-level2-routes.md)** so the help pane follows them automatically.
