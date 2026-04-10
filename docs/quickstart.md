# Quickstart

Get a sidebar of documentation rendering inside your Pict application in under five minutes.

## 1. Install

```bash
npm install pict-section-inlinedocumentation
```

## 2. Register the Section

In your Pict application bootstrap:

```js
const libPict = require('pict');
const libInlineDocs = require('pict-section-inlinedocumentation');

const _Pict = new libPict(
{
    Product: 'My Awesome App',
    Version: '1.0.0'
});

_Pict.addSection('InlineDocumentation', libInlineDocs,
{
    DocumentationRoot: '/docs/',
    CatalogURL: '/docs/retold-catalog.json',
    DefaultTopic: 'overview',
    SidebarContainer: '#AppHelpSidebar'
});

_Pict.onAfterInitializeAsync = async () =>
{
    await _Pict.views.InlineDocumentation.renderAsync();
};
```

## 3. Add a Container to Your HTML

```html
<aside id="AppHelpSidebar"></aside>
```

Reload. You should see the topic list populated from your docs folder, with the default topic rendered on click.

## 4. (Optional) Map Content to Routes

```js
_Pict.addSection('InlineDocumentation', libInlineDocs,
{
    DocumentationRoot: '/docs/',
    RouteMap:
    [
        { Pattern: '/records/:entity',         Topic: 'records/browsing' },
        { Pattern: '/records/:entity/:id/edit', Topic: 'records/editing' },
        { Pattern: '/settings/*',               Topic: 'settings' }
    ]
});
```

Now when the user navigates, the help pane tracks them automatically.

## 5. (Optional) Mark Up a Tooltip

```html
<input id="CustomerEmail" data-help="customers/email-field" />
```

```js
_Pict.views.InlineDocumentation.bindTooltipsAsync('#CustomerForm');
```

Every element with a `data-help` attribute in the scope will get a tooltip driven by the matching topic.

## 6. (Optional) Turn On Auto-Generation

If your form is built from a Manyfest descriptor:

```js
_Pict.views.InlineDocumentation.autoGenerateTooltipsAsync(
{
    Manyfest: _Pict.providers.CustomerManyfest,
    Scope: '#CustomerForm',
    EditMode: _Pict.providers.Auth.userHasRole('docs-editor')
});
```

Every hash in the manifest becomes a topic key. Missing topics are created as stubs that editors can fill in from the running app.

## Next Steps

- [Architecture](#/page/architecture.md) -- how the pieces fit together
- [API Reference](#/page/api-reference.md) -- every exposed function with code snippets
- [Embedding Level 1: Sidebar](#/page/embedding-level1-sidebar.md) through [Level 4: Auto-Gen](#/page/embedding-level4-autogen.md)
