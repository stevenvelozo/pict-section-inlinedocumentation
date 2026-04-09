# Level 3 — Hand-Authored Tooltips on Specific Features

Now the help comes to the user. Individual fields, buttons, column headers, and icons get their own tooltip, each backed by a named topic. You write each topic by hand — so the content is as rich as you like, with Markdown, lists, even Mermaid diagrams.

Good for: forms with non-obvious fields, dashboards with domain-specific metrics, anywhere power users live.

## Mark Up the Controls

Add `data-help="<topic-key>"` to any element that should get a tooltip:

```html
<form id="CustomerForm">
    <label>
        Email
        <input name="email" data-help="customers/email-field" />
    </label>

    <label>
        Tax ID
        <input name="taxId" data-help="customers/tax-id-field" />
    </label>

    <button type="submit" data-help="customers/save-button">Save</button>
</form>
```

## Bind Them

After the form has rendered:

```js
await _Pict.views.InlineDocumentation.bindTooltipsAsync('#CustomerForm');
```

Every matching element gets hover- and focus-triggered tooltips. New elements added to the form later are picked up automatically by the section's MutationObserver.

## Write the Topic

Each topic is a plain Markdown file under your docs root:

```markdown
---
title: Customer Email
category: Customers
---

# Customer Email

The primary email address for this customer. Used for:

- Invoice delivery
- Shipment notifications
- Password resets

**Format:** Standard RFC 5322. International addresses are supported.

> Note: changing this address does **not** retroactively update sent invoices.
```

Tooltips render the same Markdown you'd get in the sidebar, trimmed to a sensible size. If a topic has a frontmatter `short` field, that is used in the tooltip; the full body is shown when the user clicks "More" (which links into the sidebar at that topic).

```markdown
---
title: Tax ID
short: Must be a valid VAT, EIN, or local tax identifier. Format is validated on save.
---

# Tax ID

The tax identifier your jurisdiction requires on invoices...
```

## Showing a Tooltip Programmatically

On validation failure it is often useful to force the tooltip open at the right topic:

```js
form.on('validation-error', (pEvent) =>
{
    const tmpField = form.fieldElement(pEvent.field);
    _Pict.views.InlineDocumentation.showTooltip(tmpField, `customers/${pEvent.field}-invalid`);
});
```

Call `hideTooltip()` when the error is cleared.

## Cleanup

When tearing down a view, unbind to avoid leaking listeners:

```js
_Pict.views.InlineDocumentation.unbindTooltips('#CustomerForm');
```

## When to Graduate

Writing `data-help` on every control, and a Markdown file for every `data-help` key, gets old fast. If your form is already described by a Manyfest, **[Level 4: Auto-Generated Tooltips](#/page/embedding-level4-autogen.md)** can do all of this for you.
