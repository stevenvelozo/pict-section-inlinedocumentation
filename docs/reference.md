# Implementation Reference

A tour of the source tree for contributors.

## Project Layout

```
pict-section-inlinedocumentation/
├── package.json
├── source/
│   ├── Pict-Section-InlineDocumentation.js   // Main section class
│   ├── services/
│   │   ├── TopicStore.js
│   │   ├── TopicRenderer.js
│   │   ├── TooltipBinder.js
│   │   └── AutoTooltipGenerator.js
│   ├── views/
│   │   ├── SidebarView.js
│   │   ├── ReadingPaneView.js
│   │   └── TooltipView.js
│   ├── templates/
│   │   ├── sidebar.tpl
│   │   ├── reading-pane.tpl
│   │   └── tooltip.tpl
│   └── util/
│       ├── routeMatch.js
│       └── topicKey.js
└── test/
    ├── TopicStore.tests.js
    ├── TooltipBinder.tests.js
    ├── AutoTooltipGenerator.tests.js
    └── Section.tests.js
```

## Class Summary

- **`PictSectionInlineDocumentation`** extends `libPictViewClass`. Holds config, instantiates services, exposes the public API.
- **`TopicStore`** -- loader, cache, search.
- **`TopicRenderer`** -- Markdown to HTML with Pict template integration.
- **`TooltipBinder`** -- DOM event + observer wiring.
- **`AutoTooltipGenerator`** -- Manyfest walker.
- **`SidebarView`**, **`ReadingPaneView`**, **`TooltipView`** -- `pict-view` subclasses, one per rendered surface.

## Configuration Schema

```js
{
    DocumentationRoot: String,     // URL or path to markdown folder
    CatalogURL: String,            // Optional, else walk the folder
    KeywordIndexURL: String,       // Optional
    DefaultTopic: String,          // Key rendered when nothing else is selected
    SidebarContainer: String,      // CSS selector
    ReadingPaneContainer: String,  // CSS selector (optional)
    RouteMap: Array,               // Level 2
    EditMode: Boolean,             // Enables level-4 edit affordances
    EditEndpoint: String,          // POST target for edited topics
    TooltipDelayMs: Number,        // Default 400
    TooltipPlacement: String,      // 'auto' | 'top' | 'bottom' | 'left' | 'right'
    MaxCachedTopics: Number        // Default 128
}
```

## Testing

- Unit tests run under Mocha TDD. `TopicStore` is tested against an in-memory fetch stub; `TooltipBinder` is tested against a JSDOM environment; `AutoTooltipGenerator` uses a fixture Manyfest.
- Run `npm test` for the full suite, `npx mocha -u tdd test/TopicStore.tests.js` for a single file.
- Coverage via `npm run coverage`.

## Extending

- **Custom renderers** -- subclass `TopicRenderer` and set `RendererClass` in config.
- **Custom tooltip UI** -- subclass `TooltipView`; set `TooltipViewClass` in config.
- **Alternate storage** -- implement the `TopicStore` interface (`loadCatalogAsync`, `loadTopicAsync`, `searchAsync`) and pass it as `TopicStoreInstance`.
