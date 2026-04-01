# Inline Documentation Example

Welcome to the inline documentation browser example. This demonstrates embedding a documentation viewer inside a Pict application.

## Features

- **Markdown Rendering** — Full markdown support including code blocks, tables, and blockquotes
- **Sidebar Navigation** — Hierarchical document navigation loaded from `_sidebar.md`
- **Topic Filtering** — Scope navigation to specific topics for contextual help
- **Internal Links** — Click links to navigate between documents without leaving the page

## Getting Started

See the [Getting Started](getting-started.md) guide for setup instructions.

## Architecture

The inline documentation provider manages all views and state. You interact with it through a simple API:

```javascript
let tmpProvider = pict.providers['Pict-InlineDocumentation'];
tmpProvider.loadDocument('getting-started.md');
```

## Code Example

Here is a simple code block:

```javascript
const libPict = require('pict');
const libInlineDoc = require('pict-section-inlinedocumentation');

let tmpPict = new libPict({ Product: 'MyApp' });

tmpPict.addProvider('Pict-InlineDocumentation',
	libInlineDoc.default_configuration,
	libInlineDoc);
```

> This is a blockquote demonstrating the markdown rendering capabilities.
