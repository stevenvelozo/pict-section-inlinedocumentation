# Level 4 -- Auto-Generated Tooltips for Every Editable Control

The deepest integration. Every control in your application that is managed by a [Manyfest](/utility/manyfest/) descriptor gets a tooltip automatically, with zero `data-help` markup. Missing topics are materialized as stubs on the fly. When a privileged user enters **edit mode**, they can click any tooltip to open an inline editor and write the copy right there in the running app -- no repo checkouts, no deploys.

Good for: mature products with a content-owning team that isn't going to wait for engineering to merge every typo fix.

## Prerequisites

- Levels 1-3 are in place (you don't need to have used them, but the API is shared).
- Your form is built from a Manyfest descriptor. Anything produced by `pict-form` or `meadow-endpoints`' schema exporter qualifies.
- You have an identity provider with a role that identifies "content editors".
- An HTTP endpoint that accepts edited topic payloads (typically `retold-content-system` or similar).

## One-Line Bootstrap

```js
await _Pict.views.InlineDocumentation.autoGenerateTooltipsAsync(
{
    Manyfest: _Pict.providers.CustomerManyfest,
    Scope: '#CustomerForm',
    TopicPrefix: 'customers/',
    EditMode: _Pict.providers.Auth.userHasRole('docs-editor'),
    EditEndpoint: '/api/docs/topics'
});
```

Here's what happens under the hood:

1. The generator walks every hash in `CustomerManyfest`.
2. For each hash `customer.email`, it computes a topic key: `customers/customer.email`.
3. It asks the `TopicStore` for that topic. If it exists, it binds it to the matching element (located by the Manyfest's `DataElementAddress` resolver).
4. If the topic does not exist, a stub is created with the hash's `Description` as the body. The stub is flagged so the UI can render it differently (e.g. dimmed or marked "needs writing").
5. When `EditMode` is true, every tooltip grows a tiny pencil icon. Clicking it opens an in-place editor (a textarea with a Markdown preview). Saving POSTs the content to `EditEndpoint` and updates the live corpus.

## Manyfest Descriptor Example

```js
{
    Scope: 'customer',
    Descriptors:
    {
        'customer.email':
        {
            Hash: 'customer.email',
            DataElementAddress: 'input[name="email"]',
            Name: 'Customer Email',
            Description: 'Primary correspondence address',
            DataType: 'String'
        },
        'customer.taxId':
        {
            Hash: 'customer.taxId',
            DataElementAddress: 'input[name="taxId"]',
            Name: 'Tax ID',
            Description: 'Jurisdiction-specific tax identifier',
            DataType: 'String'
        }
    }
}
```

Running the generator against this produces `customers/customer.email` and `customers/customer.taxId` topics, each bound to the correct `<input>`.

## Edit Mode UX

In edit mode, the tooltip's footer shows three affordances:

- **Edit** -- opens the in-place editor
- **Open in docs** -- opens the topic in the sidebar for full-length editing
- **Revert** -- drops the in-memory edit and reloads the original

The editor renders a side-by-side Markdown preview using the same `TopicRenderer` as the reading pane, so what the editor sees is exactly what end-users will see.

## Persistence

`autoGenerateTooltipsAsync` only creates stubs *in memory*. To persist:

- The built-in editor POSTs to `EditEndpoint` with `{ TopicKey, Markdown, Frontmatter }`.
- Or call `exportEditedTopicsAsync()` to pull the full set of session edits and persist them in a batch.

```js
document.getElementById('PublishDocsButton').addEventListener('click', async () =>
{
    const tmpEdits = await _Pict.views.InlineDocumentation.exportEditedTopicsAsync();
    await fetch('/api/docs/batch',
    {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(tmpEdits)
    });
});
```

## Multiple Scopes

A single call handles one Manyfest. Large apps call it once per form:

```js
await _Pict.views.InlineDocumentation.autoGenerateTooltipsAsync({ Manyfest: _Pict.providers.CustomerManyfest, Scope: '#CustomerForm', TopicPrefix: 'customers/', EditMode });
await _Pict.views.InlineDocumentation.autoGenerateTooltipsAsync({ Manyfest: _Pict.providers.InvoiceManyfest,  Scope: '#InvoiceForm',  TopicPrefix: 'invoices/',  EditMode });
await _Pict.views.InlineDocumentation.autoGenerateTooltipsAsync({ Manyfest: _Pict.providers.ProductManyfest,  Scope: '#ProductForm',  TopicPrefix: 'products/',  EditMode });
```

## Audit Trail

Every save emits a `topic-edited` event with the editor's identity (pulled from your auth provider) and the diff. Wire it to whatever audit store you already have:

```js
_Pict.views.InlineDocumentation.on('topic-edited', (pEvent) =>
{
    _Pict.providers.Audit.record('docs:edit',
    {
        topic: pEvent.TopicKey,
        author: pEvent.Author,
        before: pEvent.Previous,
        after: pEvent.Topic.Markdown
    });
});
```

## Guard Rails

- Stubs are never silently promoted to "real" topics -- they must be explicitly saved.
- Edit mode is opt-in per page; `EditMode: false` renders regular tooltips with no editing affordances at all.
- `EditEndpoint` is required for persistence; omitting it means stubs stay in memory for the session only (useful for demos).
- All edited Markdown runs through the same safe renderer as imported content; script tags and `javascript:` URLs are stripped before display.
