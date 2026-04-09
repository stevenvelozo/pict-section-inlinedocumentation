# Overview

`pict-section-inlinedocumentation` is a Pict section — a composable, self-contained view module — that turns a folder of Markdown files into live, context-aware documentation inside any Pict application. It lets you go from "no help at all" to "every field has a tooltip and every screen has a help pane" without rewriting your app.

## What It Does

- Loads a corpus of Markdown topics from a URL, a static bundle, or a `pict-docuserve` catalog.
- Renders a sidebar with a table of contents plus a main reading pane.
- Maps help topics to application routes so the content updates as the user navigates.
- Serves tooltip content to any control that asks for it by topic key.
- In edit mode, generates tooltip topics dynamically for every control exposed by a Manyfest-backed content model.

## Why It Exists

Most applications bolt documentation on the side — a separate site, a separate deploy, stale the day it ships. `pict-section-inlinedocumentation` treats docs as a runtime dependency of the UI: the same content loaded by `pict-docuserve` for your public docs site can be embedded directly in the running app, and individual topics can be addressed by fragment to power inline tooltips.

## Four Levels of Embeddedness

The module exposes four progressively deeper integration modes. You pick the level that matches how much investment you want to make.

| Level | What You Get | Effort |
|---|---|---|
| **1. Sidebar + ToC** | A collapsible pane showing all docs with a table of contents | A few lines of config |
| **2. Route-Mapped Content** | Help pane auto-switches to the topic for the current route | Add a route map |
| **3. Hand-Authored Tooltips** | Specific fields/buttons show tooltips sourced from named topics | A `data-help` attribute per control |
| **4. Auto-Generated Tooltips** | Every Manyfest-managed control gets a tooltip automatically, and content editors can edit them live | Wire once, author forever |

Each level is a strict superset of the one before it. You can start at level 1 and upgrade later without rewriting anything.

## What You Need

- A Pict application (`pict@^1`)
- A folder of Markdown files, either served statically or bundled
- Optionally, a `retold-catalog.json` if you want cross-module search and navigation
- Optionally, a Manyfest descriptor if you want level-4 auto-generation

## Relationship to Other Modules

- Uses [`pict-view`](/pict/pict-view/) as its base class.
- Optionally consumes catalogs produced by [`pict-docuserve`](/pict/pict-docuserve/).
- Uses [`manyfest`](/utility/manyfest/) descriptors to enumerate controls at level 4.
- Uses [`pict-template-markdown`](/pict/pict-template-markdown/) or an equivalent renderer to turn Markdown into HTML at runtime.
