# Getting Started

This guide walks you through embedding the inline documentation browser in your application.

## Installation

```bash
npm install pict-section-inlinedocumentation
```

## Basic Setup

1. Add the provider to your Pict instance
2. Call `initializeDocumentation()` with your docs base URL
3. Load a document

```javascript
const libPict = require('pict');
const libInlineDoc = require('pict-section-inlinedocumentation');

let tmpPict = new libPict({ Product: 'MyApp' });

// Add the inline documentation provider
let tmpDocProvider = tmpPict.addProvider(
	'Pict-InlineDocumentation',
	libInlineDoc.default_configuration,
	libInlineDoc);

// Initialize with your docs folder URL
tmpDocProvider.initializeDocumentation(
	{ DocsBaseURL: 'docs/' },
	() =>
	{
		// Load the first document
		tmpDocProvider.loadDocument('README.md');
	});
```

## Topics

Topics let you scope the navigation sidebar to a subset of documents. Define topics in a `_topics.json` file:

```json
{
	"getting-started": {
		"Name": "Getting Started",
		"Documents": ["README.md", "getting-started.md"]
	}
}
```

Then activate a topic:

```javascript
tmpDocProvider.setTopic('getting-started');
```

## API Reference

| Method | Description |
|--------|-------------|
| `initializeDocumentation(options, callback)` | Initialize the documentation system |
| `loadDocument(path, callback)` | Load and display a document |
| `setTopic(topicKey)` | Filter navigation to a topic |
| `clearTopic()` | Show all navigation |
| `navigateBack(callback)` | Go to previous document |
| `setDocsBaseURL(url)` | Change the docs root URL |
| `getNavigationHistory()` | Get visited document paths |

Back to [Home](README.md).
