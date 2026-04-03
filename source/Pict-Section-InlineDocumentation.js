// The container for all the Pict-Section-InlineDocumentation related code.

// The main inline documentation provider (primary API surface)
module.exports = require('./providers/Pict-Provider-InlineDocumentation.js');

// Exported views for advanced usage
module.exports.InlineDocumentationLayoutView = require('./views/Pict-View-InlineDocumentation-Layout.js');
module.exports.InlineDocumentationContentView = require('./views/Pict-View-InlineDocumentation-Content.js');
module.exports.InlineDocumentationNavView = require('./views/Pict-View-InlineDocumentation-Nav.js');
module.exports.InlineDocumentationTopicManagerView = require('./views/Pict-View-InlineDocumentation-TopicManager.js');
