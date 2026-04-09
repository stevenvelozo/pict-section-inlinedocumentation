# API Reference

Every function a developer is expected to call, with a working snippet for each.

The section is reached via `_Pict.views.InlineDocumentation` after it has been registered with `_Pict.addSection('InlineDocumentation', libInlineDocs, config)`.

---

## `renderAsync()`

Renders the sidebar and reading pane into their configured containers. Call once after the Pict application has initialized.

```js
await _Pict.views.InlineDocumentation.renderAsync();
```

---

## `loadTopicAsync(pTopicKey)`

Loads a single topic by key and renders it into the reading pane. Returns the parsed topic object.

```js
const tmpTopic = await _Pict.views.InlineDocumentation.loadTopicAsync('records/editing');
console.log(tmpTopic.Title, tmpTopic.Category);
```

---

## `getTopicAsync(pTopicKey)`

Returns the parsed topic without touching the DOM. Useful when you want the HTML for your own rendering.

```js
const tmpTopic = await _Pict.views.InlineDocumentation.getTopicAsync('customers/email-field');
document.getElementById('MyCustomPane').innerHTML = tmpTopic.HTML;
```

---

## `setDefaultTopic(pTopicKey)`

Changes the topic rendered when nothing else is selected.

```js
_Pict.views.InlineDocumentation.setDefaultTopic('getting-started');
```

---

## `setRouteMap(pRouteMap)`

Replaces the route map at runtime. Entries are matched top-down; the first match wins.

```js
_Pict.views.InlineDocumentation.setRouteMap(
[
    { Pattern: '/records/:entity',          Topic: 'records/browsing' },
    { Pattern: '/records/:entity/:id/edit', Topic: 'records/editing' },
    { Pattern: '/settings/*',                Topic: 'settings' }
]);
```

---

## `attachRouter(pRouter)`

Subscribes to a `pict-router` instance so that route changes drive the reading pane.

```js
_Pict.views.InlineDocumentation.attachRouter(_Pict.providers.Router);
```

---

## `bindTooltipsAsync(pScopeSelector)`

Finds every element with a `data-help` attribute under the given selector and wires a tooltip to it. Safe to call multiple times; already-bound elements are skipped.

```js
await _Pict.views.InlineDocumentation.bindTooltipsAsync('#CustomerForm');
```

---

## `unbindTooltips(pScopeSelector)`

Removes tooltip wiring for a scope. Use before destroying a view to avoid leaked listeners.

```js
_Pict.views.InlineDocumentation.unbindTooltips('#CustomerForm');
```

---

## `showTooltip(pElement, pTopicKey)`

Imperatively shows a tooltip — handy for validation errors that carry a topic reference.

```js
const tmpInput = document.getElementById('CustomerEmail');
_Pict.views.InlineDocumentation.showTooltip(tmpInput, 'customers/email-invalid');
```

---

## `hideTooltip()`

Hides any currently visible tooltip.

```js
_Pict.views.InlineDocumentation.hideTooltip();
```

---

## `autoGenerateTooltipsAsync(pOptions)`

Walks a Manyfest descriptor, creates topic keys for every hash, and binds tooltips to the matching DOM controls. In `EditMode`, stub topics are created for missing keys and can be edited from the app.

```js
await _Pict.views.InlineDocumentation.autoGenerateTooltipsAsync(
{
    Manyfest: _Pict.providers.CustomerManyfest,
    Scope: '#CustomerForm',
    TopicPrefix: 'customers/',
    EditMode: _Pict.providers.Auth.userHasRole('docs-editor')
});
```

---

## `registerTopicStub(pTopicKey, pStub)`

Adds a stub topic in memory. Useful for testing or for supplying fallback content when the corpus is incomplete.

```js
_Pict.views.InlineDocumentation.registerTopicStub('customers/email-field',
{
    Title: 'Customer Email',
    Markdown: 'The primary email address used for all customer correspondence.'
});
```

---

## `searchAsync(pQuery)`

Runs a keyword search against the loaded corpus. Returns an array of `{ TopicKey, Title, Score, Snippet }`.

```js
const tmpResults = await _Pict.views.InlineDocumentation.searchAsync('password reset');
tmpResults.forEach(r => console.log(r.Score.toFixed(2), r.TopicKey, r.Title));
```

---

## `exportEditedTopicsAsync()`

In edit mode, returns every topic that has been modified in the running session so you can persist them or PR them back into the docs repo.

```js
const tmpEdits = await _Pict.views.InlineDocumentation.exportEditedTopicsAsync();
await fetch('/api/docs/batch', { method: 'POST', body: JSON.stringify(tmpEdits) });
```

---

## `on(pEventName, pHandler)` / `off(pEventName, pHandler)`

Emits lifecycle events:

- `topic-loaded` — `{ TopicKey, Topic }`
- `topic-rendered` — `{ TopicKey, Container }`
- `tooltip-shown` — `{ Element, TopicKey }`
- `tooltip-hidden` — `{ Element }`
- `catalog-loaded` — `{ Catalog }`
- `topic-edited` — `{ TopicKey, Topic }` (edit mode only)

```js
_Pict.views.InlineDocumentation.on('topic-rendered', ({ TopicKey }) =>
{
    _Pict.providers.Analytics.track('help:viewed', { topic: TopicKey });
});
```
