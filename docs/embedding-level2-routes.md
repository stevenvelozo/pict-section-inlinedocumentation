# Level 2 — Route-Mapped Content

Now the help pane knows where the user is. As they navigate, the reading surface automatically switches to the topic that describes the screen they're looking at. The user never has to search.

Good for: wizard-style apps, CRUD panels, anything with a clear screen-to-concept mapping.

## Prerequisites

- Level 1 is already working.
- Your app uses [`pict-router`](/pict/pict-router/) (or exposes a comparable hash or history router).

## Declare the Map

Route patterns use the same syntax as `pict-router`: colon-prefixed tokens for named params, `*` for a catch-all. The first match wins, so order matters.

```js
_Pict.addSection('InlineDocumentation', libInlineDocs,
{
    DocumentationRoot: '/docs/',
    CatalogURL: '/docs/retold-catalog.json',
    SidebarContainer: '#AppHelpSidebar',
    DefaultTopic: 'overview',
    RouteMap:
    [
        // Exact screens first
        { Pattern: '/records/:entity/new',      Topic: 'records/creating' },
        { Pattern: '/records/:entity/:id/edit', Topic: 'records/editing' },
        { Pattern: '/records/:entity/:id',      Topic: 'records/viewing' },

        // Browse
        { Pattern: '/records/:entity',          Topic: 'records/browsing' },

        // Settings has many children that all share one topic
        { Pattern: '/settings/*',               Topic: 'settings' },

        // Top level
        { Pattern: '/',                         Topic: 'home' }
    ]
});
```

## Attach the Router

If your app registers the router as a provider, the section can pick it up:

```js
_Pict.onAfterInitializeAsync = async () =>
{
    _Pict.views.InlineDocumentation.attachRouter(_Pict.providers.Router);
    await _Pict.views.InlineDocumentation.renderAsync();
};
```

`attachRouter` subscribes to the router's change event and re-evaluates the route map on every navigation.

## Dynamic Topics Per Entity

A common trick: use the route params to pick a more specific topic.

```js
_Pict.views.InlineDocumentation.setRouteMap(
[
    {
        Pattern: '/records/:entity/:id/edit',
        Topic: (pParams) => `records/${pParams.entity}/editing`,
        Fallback: 'records/editing'
    }
]);
```

If the per-entity topic exists it is used; if not, the `Fallback` kicks in. This lets you incrementally add entity-specific copy without a big-bang rewrite.

## Manually Overriding

Sometimes a screen has multiple conceptual modes and the router can't see the difference (e.g., a tabbed view). Call `loadTopicAsync` directly when the user switches tab:

```js
customerTabs.on('change', async (pTabId) =>
{
    await _Pict.views.InlineDocumentation.loadTopicAsync(`customers/tabs/${pTabId}`);
});
```

## When to Graduate

Screen-level help is good for orientation but useless when the user is staring at a specific field and wondering "what goes here?". That is the job of **[Level 3: Hand-Authored Tooltips](#/page/embedding-level3-tooltips.md)**.
