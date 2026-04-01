# Advanced Topics

This page covers advanced usage of the inline documentation system.

## Custom Container

By default the layout renders into an element with id `InlineDoc-Container`. You can override this:

```javascript
tmpDocProvider.initializeDocumentation({
	DocsBaseURL: 'docs/',
	ContainerAddress: '#my-custom-container'
});
```

## Programmatic Navigation

The navigation sidebar is loaded from `_sidebar.md`, but you can also set it programmatically via AppData:

```javascript
pict.AppData.InlineDocumentation.SidebarGroups = [
	{
		Name: 'Guide',
		Key: 'guide',
		Path: 'README.md',
		Items: [
			{ Name: 'Getting Started', Path: 'getting-started.md' },
			{ Name: 'Advanced', Path: 'advanced-topics.md' }
		]
	}
];
```

## Content Caching

Documents are cached after first load. To clear the cache (e.g. after docs are updated), change the base URL or create a new provider instance.

## Upcoming Features

These features are planned for future releases:

- **Edit Mode** — In-place markdown editing
- **Tooltips** — Hover documentation for terms and concepts
- **Localization** — Multi-language document support
- **Search** — Full-text search across documents
- **AI Integration** — Contextual AI assistance
- **Advanced Docking** — Resizable, detachable documentation panels
