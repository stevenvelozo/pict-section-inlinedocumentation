const libPict = require('pict');
const libInlineDocumentation = require('../source/Pict-Section-InlineDocumentation.js');

const libAssert = require('assert');

suite
(
	'Pict-Section-InlineDocumentation',
	() =>
	{
		setup(() => { });

		suite
		(
			'Module Exports',
			() =>
			{
				test
				(
					'Module should export the provider as the default export',
					(fDone) =>
					{
						libAssert.strictEqual(typeof libInlineDocumentation, 'function', 'Default export should be a constructor');
						libAssert.ok(libInlineDocumentation.default_configuration, 'Should export default_configuration');
						libAssert.strictEqual(libInlineDocumentation.default_configuration.ProviderIdentifier, 'Pict-InlineDocumentation');
						return fDone();
					}
				);
				test
				(
					'Module should export view classes',
					(fDone) =>
					{
						libAssert.strictEqual(typeof libInlineDocumentation.InlineDocumentationLayoutView, 'function', 'Should export layout view');
						libAssert.strictEqual(typeof libInlineDocumentation.InlineDocumentationContentView, 'function', 'Should export content view');
						libAssert.strictEqual(typeof libInlineDocumentation.InlineDocumentationNavView, 'function', 'Should export nav view');
						return fDone();
					}
				);
			}
		);

		suite
		(
			'Provider Registration',
			() =>
			{
				test
				(
					'Provider should register with Pict and instantiate views',
					(fDone) =>
					{
						let tmpPict = new libPict({ Product: 'InlineDocTest' });

						let tmpProvider = tmpPict.addProvider(
							'Pict-InlineDocumentation',
							libInlineDocumentation.default_configuration,
							libInlineDocumentation);

						libAssert.ok(tmpProvider, 'Provider should be created');
						libAssert.ok(tmpPict.providers['Pict-InlineDocumentation'], 'Provider should be registered');

						// Views should be registered
						libAssert.ok(tmpPict.views['InlineDoc-Layout'], 'Layout view should be registered');
						libAssert.ok(tmpPict.views['InlineDoc-Content'], 'Content view should be registered');
						libAssert.ok(tmpPict.views['InlineDoc-Nav'], 'Nav view should be registered');

						// Content provider should be registered
						libAssert.ok(tmpPict.providers['Pict-Content'], 'Content provider should be registered');

						return fDone();
					}
				);

				test
				(
					'Provider should have expected API methods',
					(fDone) =>
					{
						let tmpPict = new libPict({ Product: 'InlineDocTest' });

						let tmpProvider = tmpPict.addProvider(
							'Pict-InlineDocumentation',
							libInlineDocumentation.default_configuration,
							libInlineDocumentation);

						libAssert.strictEqual(typeof tmpProvider.initializeDocumentation, 'function', 'Should have initializeDocumentation');
						libAssert.strictEqual(typeof tmpProvider.loadDocument, 'function', 'Should have loadDocument');
						libAssert.strictEqual(typeof tmpProvider.setTopic, 'function', 'Should have setTopic');
						libAssert.strictEqual(typeof tmpProvider.clearTopic, 'function', 'Should have clearTopic');
						libAssert.strictEqual(typeof tmpProvider.setDocsBaseURL, 'function', 'Should have setDocsBaseURL');
						libAssert.strictEqual(typeof tmpProvider.getNavigationHistory, 'function', 'Should have getNavigationHistory');
						libAssert.strictEqual(typeof tmpProvider.navigateBack, 'function', 'Should have navigateBack');

						return fDone();
					}
				);
			}
		);

		suite
		(
			'State Management',
			() =>
			{
				test
				(
					'setDocsBaseURL should update state and clear cache',
					(fDone) =>
					{
						let tmpPict = new libPict({ Product: 'InlineDocTest' });

						let tmpProvider = tmpPict.addProvider(
							'Pict-InlineDocumentation',
							libInlineDocumentation.default_configuration,
							libInlineDocumentation);

						tmpProvider.setDocsBaseURL('https://example.com/docs/');

						libAssert.strictEqual(
							tmpPict.AppData.InlineDocumentation.DocsBaseURL,
							'https://example.com/docs/');

						return fDone();
					}
				);

				test
				(
					'getNavigationHistory should return empty array initially',
					(fDone) =>
					{
						let tmpPict = new libPict({ Product: 'InlineDocTest' });

						let tmpProvider = tmpPict.addProvider(
							'Pict-InlineDocumentation',
							libInlineDocumentation.default_configuration,
							libInlineDocumentation);

						let tmpHistory = tmpProvider.getNavigationHistory();
						libAssert.ok(Array.isArray(tmpHistory), 'Should return an array');
						libAssert.strictEqual(tmpHistory.length, 0, 'Should be empty initially');

						return fDone();
					}
				);
			}
		);

		suite
		(
			'Sidebar Parsing',
			() =>
			{
				test
				(
					'Should parse _sidebar.md format into groups and items',
					(fDone) =>
					{
						let tmpPict = new libPict({ Product: 'InlineDocTest' });

						let tmpProvider = tmpPict.addProvider(
							'Pict-InlineDocumentation',
							libInlineDocumentation.default_configuration,
							libInlineDocumentation);

						let tmpSidebar = '- [Home](README.md)\n'
							+ '- Guide\n'
							+ '  - [Getting Started](getting-started.md)\n'
							+ '  - [Advanced](advanced-topics.md)\n';

						let tmpGroups = tmpProvider._parseSidebarMarkdown(tmpSidebar);

						libAssert.strictEqual(tmpGroups.length, 2, 'Should have 2 groups');

						// First group: Home (link)
						libAssert.strictEqual(tmpGroups[0].Name, 'Home');
						libAssert.strictEqual(tmpGroups[0].Path, 'README.md');
						libAssert.strictEqual(tmpGroups[0].Items.length, 0);

						// Second group: Guide (plain text header with children)
						libAssert.strictEqual(tmpGroups[1].Name, 'Guide');
						libAssert.strictEqual(tmpGroups[1].Path, '');
						libAssert.strictEqual(tmpGroups[1].Items.length, 2);
						libAssert.strictEqual(tmpGroups[1].Items[0].Name, 'Getting Started');
						libAssert.strictEqual(tmpGroups[1].Items[0].Path, 'getting-started.md');
						libAssert.strictEqual(tmpGroups[1].Items[1].Name, 'Advanced');
						libAssert.strictEqual(tmpGroups[1].Items[1].Path, 'advanced-topics.md');

						return fDone();
					}
				);

				test
				(
					'Should handle leading slashes and ./ in paths',
					(fDone) =>
					{
						let tmpPict = new libPict({ Product: 'InlineDocTest' });

						let tmpProvider = tmpPict.addProvider(
							'Pict-InlineDocumentation',
							libInlineDocumentation.default_configuration,
							libInlineDocumentation);

						let tmpSidebar = '- [Page One](/page-one.md)\n'
							+ '- [Page Two](./page-two.md)\n';

						let tmpGroups = tmpProvider._parseSidebarMarkdown(tmpSidebar);

						libAssert.strictEqual(tmpGroups.length, 2);
						libAssert.strictEqual(tmpGroups[0].Path, 'page-one.md');
						libAssert.strictEqual(tmpGroups[1].Path, 'page-two.md');

						return fDone();
					}
				);
			}
		);

		suite
		(
			'Link Resolution',
			() =>
			{
				test
				(
					'Should resolve external links with target blank',
					(fDone) =>
					{
						let tmpPict = new libPict({ Product: 'InlineDocTest' });

						let tmpProvider = tmpPict.addProvider(
							'Pict-InlineDocumentation',
							libInlineDocumentation.default_configuration,
							libInlineDocumentation);

						let tmpResolver = tmpProvider._createLinkResolver();
						let tmpResult = tmpResolver('https://example.com', 'Example');

						libAssert.strictEqual(tmpResult.href, 'https://example.com');
						libAssert.strictEqual(tmpResult.target, '_blank');
						libAssert.strictEqual(tmpResult.rel, 'noopener');

						return fDone();
					}
				);

				test
				(
					'Should resolve internal links with doc path data',
					(fDone) =>
					{
						let tmpPict = new libPict({ Product: 'InlineDocTest' });

						let tmpProvider = tmpPict.addProvider(
							'Pict-InlineDocumentation',
							libInlineDocumentation.default_configuration,
							libInlineDocumentation);

						let tmpResolver = tmpProvider._createLinkResolver();
						let tmpResult = tmpResolver('getting-started.md', 'Getting Started');

						libAssert.strictEqual(tmpResult.href, 'javascript:void(0)');
						libAssert.ok(tmpResult.rel.indexOf('pict-inline-doc-link:getting-started.md') >= 0);

						return fDone();
					}
				);
			}
		);

		suite
		(
			'Image Resolution',
			() =>
			{
				test
				(
					'Should resolve relative images against doc URL',
					(fDone) =>
					{
						let tmpPict = new libPict({ Product: 'InlineDocTest' });

						let tmpProvider = tmpPict.addProvider(
							'Pict-InlineDocumentation',
							libInlineDocumentation.default_configuration,
							libInlineDocumentation);

						let tmpResolver = tmpProvider._createImageResolver('https://example.com/docs/guide/page.md');

						let tmpResult = tmpResolver('diagram.png', 'Diagram');
						libAssert.strictEqual(tmpResult, 'https://example.com/docs/guide/diagram.png');

						return fDone();
					}
				);

				test
				(
					'Should leave absolute image URLs unchanged',
					(fDone) =>
					{
						let tmpPict = new libPict({ Product: 'InlineDocTest' });

						let tmpProvider = tmpPict.addProvider(
							'Pict-InlineDocumentation',
							libInlineDocumentation.default_configuration,
							libInlineDocumentation);

						let tmpResolver = tmpProvider._createImageResolver('https://example.com/docs/page.md');

						let tmpAbsolute = tmpResolver('https://cdn.example.com/image.png', 'Image');
						libAssert.strictEqual(tmpAbsolute, 'https://cdn.example.com/image.png');

						let tmpData = tmpResolver('data:image/png;base64,abc', 'Data');
						libAssert.strictEqual(tmpData, 'data:image/png;base64,abc');

						return fDone();
					}
				);
			}
		);

		suite
		(
			'Error Handling',
			() =>
			{
				test
				(
					'loadDocument should callback with error for empty path',
					(fDone) =>
					{
						let tmpPict = new libPict({ Product: 'InlineDocTest' });

						let tmpProvider = tmpPict.addProvider(
							'Pict-InlineDocumentation',
							libInlineDocumentation.default_configuration,
							libInlineDocumentation);

						tmpProvider.loadDocument('', (pError) =>
						{
							libAssert.ok(pError, 'Should return an error');
							return fDone();
						});
					}
				);

				test
				(
					'setTopic should warn for unknown topic',
					(fDone) =>
					{
						let tmpPict = new libPict({ Product: 'InlineDocTest' });

						let tmpProvider = tmpPict.addProvider(
							'Pict-InlineDocumentation',
							libInlineDocumentation.default_configuration,
							libInlineDocumentation);

						tmpProvider.setDocsBaseURL('/docs/');

						// Should not throw
						tmpProvider.setTopic('nonexistent-topic');

						return fDone();
					}
				);
			}
		);

		suite
		(
			'Route Matching',
			() =>
			{
				test
				(
					'Should match exact routes',
					(fDone) =>
					{
						let tmpPict = new libPict({ Product: 'InlineDocTest' });

						let tmpProvider = tmpPict.addProvider(
							'Pict-InlineDocumentation',
							libInlineDocumentation.default_configuration,
							libInlineDocumentation);

						tmpProvider.setDocsBaseURL('/docs/');
						tmpPict.AppData.InlineDocumentation.Topics = {
							'TOPIC-A': { TopicCode: 'TOPIC-A', Routes: ['/books'] },
							'TOPIC-B': { TopicCode: 'TOPIC-B', Routes: ['/settings'] }
						};

						libAssert.strictEqual(tmpProvider.resolveHelpForRoute('/books'), 'TOPIC-A');
						libAssert.strictEqual(tmpProvider.resolveHelpForRoute('/settings'), 'TOPIC-B');
						libAssert.strictEqual(tmpProvider.resolveHelpForRoute('/unknown'), null);

						return fDone();
					}
				);

				test
				(
					'Should match wildcard routes',
					(fDone) =>
					{
						let tmpPict = new libPict({ Product: 'InlineDocTest' });

						let tmpProvider = tmpPict.addProvider(
							'Pict-InlineDocumentation',
							libInlineDocumentation.default_configuration,
							libInlineDocumentation);

						tmpProvider.setDocsBaseURL('/docs/');
						tmpPict.AppData.InlineDocumentation.Topics = {
							'STORE': { TopicCode: 'STORE', Routes: ['/books/store/*'] }
						};

						libAssert.strictEqual(tmpProvider.resolveHelpForRoute('/books/store/123'), 'STORE');
						libAssert.strictEqual(tmpProvider.resolveHelpForRoute('/books/store/123/details'), 'STORE');
						libAssert.strictEqual(tmpProvider.resolveHelpForRoute('/books/store'), 'STORE');
						libAssert.strictEqual(tmpProvider.resolveHelpForRoute('/books'), null);

						return fDone();
					}
				);

				test
				(
					'Should prefer longest matching pattern',
					(fDone) =>
					{
						let tmpPict = new libPict({ Product: 'InlineDocTest' });

						let tmpProvider = tmpPict.addProvider(
							'Pict-InlineDocumentation',
							libInlineDocumentation.default_configuration,
							libInlineDocumentation);

						tmpProvider.setDocsBaseURL('/docs/');
						tmpPict.AppData.InlineDocumentation.Topics = {
							'BOOKS': { TopicCode: 'BOOKS', Routes: ['/books/*'] },
							'STORE': { TopicCode: 'STORE', Routes: ['/books/store/*'] }
						};

						// /books/store/5 matches both, but STORE has longer prefix
						libAssert.strictEqual(tmpProvider.resolveHelpForRoute('/books/store/5'), 'STORE');
						// /books/catalog matches only BOOKS
						libAssert.strictEqual(tmpProvider.resolveHelpForRoute('/books/catalog'), 'BOOKS');

						return fDone();
					}
				);

				test
				(
					'Should handle topics without Routes array',
					(fDone) =>
					{
						let tmpPict = new libPict({ Product: 'InlineDocTest' });

						let tmpProvider = tmpPict.addProvider(
							'Pict-InlineDocumentation',
							libInlineDocumentation.default_configuration,
							libInlineDocumentation);

						tmpProvider.setDocsBaseURL('/docs/');
						tmpPict.AppData.InlineDocumentation.Topics = {
							'NO-ROUTES': { TopicCode: 'NO-ROUTES', TopicHelpFilePath: 'test.md' },
							'HAS-ROUTES': { TopicCode: 'HAS-ROUTES', Routes: ['/test'] }
						};

						libAssert.strictEqual(tmpProvider.resolveHelpForRoute('/test'), 'HAS-ROUTES');
						libAssert.strictEqual(tmpProvider.resolveHelpForRoute('/other'), null);

						return fDone();
					}
				);

				test
				(
					'navigateToRoute should return true for matched routes',
					(fDone) =>
					{
						let tmpPict = new libPict({ Product: 'InlineDocTest' });

						let tmpProvider = tmpPict.addProvider(
							'Pict-InlineDocumentation',
							libInlineDocumentation.default_configuration,
							libInlineDocumentation);

						tmpProvider.setDocsBaseURL('/docs/');
						tmpPict.AppData.InlineDocumentation.NavigationHistory = [];
						tmpPict.AppData.InlineDocumentation.CurrentPath = '';
						tmpPict.AppData.InlineDocumentation.Topics = {
							'FOUND': { TopicCode: 'FOUND', TopicHelpFilePath: 'found.md', Routes: ['/found'] }
						};

						// navigateToRoute calls loadTopicDocument which calls loadDocument
						// which will fail to fetch, but that's fine — we're testing the return value
						libAssert.strictEqual(tmpProvider.navigateToRoute('/found'), true);
						libAssert.strictEqual(tmpProvider.navigateToRoute('/not-found'), false);
						libAssert.strictEqual(tmpPict.AppData.InlineDocumentation.CurrentRoute, '/not-found');

						return fDone();
					}
				);
			}
		);

		suite
		(
			'Edit Mode',
			() =>
			{
				test
				(
					'setEditEnabled should update state',
					(fDone) =>
					{
						let tmpPict = new libPict({ Product: 'InlineDocTest' });

						let tmpProvider = tmpPict.addProvider(
							'Pict-InlineDocumentation',
							libInlineDocumentation.default_configuration,
							libInlineDocumentation);

						tmpProvider.setDocsBaseURL('/docs/');
						// EditEnabled is only initialized by initializeDocumentation,
						// but setEditEnabled creates it if missing
						tmpProvider.setEditEnabled(false);
						libAssert.strictEqual(tmpPict.AppData.InlineDocumentation.EditEnabled, false);

						tmpProvider.setEditEnabled(true);
						libAssert.strictEqual(tmpPict.AppData.InlineDocumentation.EditEnabled, true);

						tmpProvider.setEditEnabled(false);
						libAssert.strictEqual(tmpPict.AppData.InlineDocumentation.EditEnabled, false);

						return fDone();
					}
				);

				test
				(
					'Provider should have edit API methods',
					(fDone) =>
					{
						let tmpPict = new libPict({ Product: 'InlineDocTest' });

						let tmpProvider = tmpPict.addProvider(
							'Pict-InlineDocumentation',
							libInlineDocumentation.default_configuration,
							libInlineDocumentation);

						libAssert.strictEqual(typeof tmpProvider.setEditEnabled, 'function');
						libAssert.strictEqual(typeof tmpProvider.toggleEdit, 'function');
						libAssert.strictEqual(typeof tmpProvider.beginEdit, 'function');
						libAssert.strictEqual(typeof tmpProvider.cancelEdit, 'function');
						libAssert.strictEqual(typeof tmpProvider.saveEdit, 'function');

						return fDone();
					}
				);

				test
				(
					'Provider should have route API methods',
					(fDone) =>
					{
						let tmpPict = new libPict({ Product: 'InlineDocTest' });

						let tmpProvider = tmpPict.addProvider(
							'Pict-InlineDocumentation',
							libInlineDocumentation.default_configuration,
							libInlineDocumentation);

						libAssert.strictEqual(typeof tmpProvider.resolveHelpForRoute, 'function');
						libAssert.strictEqual(typeof tmpProvider.navigateToRoute, 'function');

						return fDone();
					}
				);

				test
				(
					'Cache should store both html and markdown',
					(fDone) =>
					{
						let tmpPict = new libPict({ Product: 'InlineDocTest' });

						let tmpProvider = tmpPict.addProvider(
							'Pict-InlineDocumentation',
							libInlineDocumentation.default_configuration,
							libInlineDocumentation);

						// Manually populate cache to test format
						tmpProvider._ContentCache['test.md'] = { html: '<p>test</p>', markdown: '# test' };

						let tmpEntry = tmpProvider._ContentCache['test.md'];
						libAssert.ok(tmpEntry.html, 'Cache entry should have html');
						libAssert.ok(tmpEntry.markdown, 'Cache entry should have markdown');
						libAssert.strictEqual(tmpEntry.html, '<p>test</p>');
						libAssert.strictEqual(tmpEntry.markdown, '# test');

						return fDone();
					}
				);
			}
		);

		suite
		(
			'Topic CRUD',
			() =>
			{
				test
				(
					'getTopicList should return array of topic summaries',
					(fDone) =>
					{
						let tmpPict = new libPict({ Product: 'InlineDocTest' });

						let tmpProvider = tmpPict.addProvider(
							'Pict-InlineDocumentation',
							libInlineDocumentation.default_configuration,
							libInlineDocumentation);

						tmpProvider.setDocsBaseURL('/docs/');
						tmpPict.AppData.InlineDocumentation.Topics = {
							'TOPIC-A': { TopicCode: 'TOPIC-A', TopicTitle: 'Topic Alpha', TopicHelpFilePath: 'alpha.md', Routes: ['/alpha', '/alpha/*'] },
							'TOPIC-B': { TopicCode: 'TOPIC-B', TopicTitle: 'Topic Beta', TopicHelpFilePath: 'beta.md', Routes: [] }
						};

						let tmpList = tmpProvider.getTopicList();

						libAssert.ok(Array.isArray(tmpList), 'Should return an array');
						libAssert.strictEqual(tmpList.length, 2, 'Should have 2 topics');
						libAssert.strictEqual(tmpList[0].TopicCode, 'TOPIC-A');
						libAssert.strictEqual(tmpList[0].TopicTitle, 'Topic Alpha');
						libAssert.strictEqual(tmpList[0].TopicHelpFilePath, 'alpha.md');
						libAssert.strictEqual(tmpList[0].RouteCount, 2);
						libAssert.strictEqual(tmpList[1].RouteCount, 0);

						return fDone();
					}
				);

				test
				(
					'getTopicList should return empty array when no topics',
					(fDone) =>
					{
						let tmpPict = new libPict({ Product: 'InlineDocTest' });

						let tmpProvider = tmpPict.addProvider(
							'Pict-InlineDocumentation',
							libInlineDocumentation.default_configuration,
							libInlineDocumentation);

						let tmpList = tmpProvider.getTopicList();
						libAssert.ok(Array.isArray(tmpList));
						libAssert.strictEqual(tmpList.length, 0);

						return fDone();
					}
				);

				test
				(
					'updateTopic should merge only specified fields',
					(fDone) =>
					{
						let tmpPict = new libPict({ Product: 'InlineDocTest' });

						let tmpProvider = tmpPict.addProvider(
							'Pict-InlineDocumentation',
							libInlineDocumentation.default_configuration,
							libInlineDocumentation);

						tmpProvider.setDocsBaseURL('/docs/');
						tmpPict.AppData.InlineDocumentation.Topics = {
							'MY-TOPIC': { TopicCode: 'MY-TOPIC', TopicTitle: 'Original', TopicHelpFilePath: 'orig.md', Routes: ['/orig'] }
						};

						let tmpResult = tmpProvider.updateTopic('MY-TOPIC', { TopicTitle: 'Updated Title' });

						libAssert.strictEqual(tmpResult, true);
						libAssert.strictEqual(tmpPict.AppData.InlineDocumentation.Topics['MY-TOPIC'].TopicTitle, 'Updated Title');
						libAssert.strictEqual(tmpPict.AppData.InlineDocumentation.Topics['MY-TOPIC'].TopicHelpFilePath, 'orig.md');
						libAssert.deepStrictEqual(tmpPict.AppData.InlineDocumentation.Topics['MY-TOPIC'].Routes, ['/orig']);

						return fDone();
					}
				);

				test
				(
					'updateTopic should return false for nonexistent topic',
					(fDone) =>
					{
						let tmpPict = new libPict({ Product: 'InlineDocTest' });

						let tmpProvider = tmpPict.addProvider(
							'Pict-InlineDocumentation',
							libInlineDocumentation.default_configuration,
							libInlineDocumentation);

						tmpProvider.setDocsBaseURL('/docs/');
						tmpPict.AppData.InlineDocumentation.Topics = {};

						libAssert.strictEqual(tmpProvider.updateTopic('NOPE', { TopicTitle: 'Test' }), false);

						return fDone();
					}
				);

				test
				(
					'removeTopic should delete topic and clear active if matched',
					(fDone) =>
					{
						let tmpPict = new libPict({ Product: 'InlineDocTest' });

						let tmpProvider = tmpPict.addProvider(
							'Pict-InlineDocumentation',
							libInlineDocumentation.default_configuration,
							libInlineDocumentation);

						tmpProvider.setDocsBaseURL('/docs/');
						tmpPict.AppData.InlineDocumentation.Topics = {
							'REMOVE-ME': { TopicCode: 'REMOVE-ME', TopicTitle: 'Doomed' }
						};
						tmpPict.AppData.InlineDocumentation.Topic = 'REMOVE-ME';

						let tmpResult = tmpProvider.removeTopic('REMOVE-ME');

						libAssert.strictEqual(tmpResult, true);
						libAssert.strictEqual(tmpPict.AppData.InlineDocumentation.Topics['REMOVE-ME'], undefined);
						libAssert.strictEqual(tmpPict.AppData.InlineDocumentation.Topic, null);

						return fDone();
					}
				);

				test
				(
					'removeTopic should return false for nonexistent topic',
					(fDone) =>
					{
						let tmpPict = new libPict({ Product: 'InlineDocTest' });

						let tmpProvider = tmpPict.addProvider(
							'Pict-InlineDocumentation',
							libInlineDocumentation.default_configuration,
							libInlineDocumentation);

						tmpProvider.setDocsBaseURL('/docs/');
						tmpPict.AppData.InlineDocumentation.Topics = {};

						libAssert.strictEqual(tmpProvider.removeTopic('NOPE'), false);

						return fDone();
					}
				);

				test
				(
					'removeRouteFromTopic should splice route from array',
					(fDone) =>
					{
						let tmpPict = new libPict({ Product: 'InlineDocTest' });

						let tmpProvider = tmpPict.addProvider(
							'Pict-InlineDocumentation',
							libInlineDocumentation.default_configuration,
							libInlineDocumentation);

						tmpProvider.setDocsBaseURL('/docs/');
						tmpPict.AppData.InlineDocumentation.Topics = {
							'TOPIC-X': { TopicCode: 'TOPIC-X', Routes: ['/one', '/two', '/three'] }
						};

						libAssert.strictEqual(tmpProvider.removeRouteFromTopic('TOPIC-X', '/two'), true);
						libAssert.deepStrictEqual(tmpPict.AppData.InlineDocumentation.Topics['TOPIC-X'].Routes, ['/one', '/three']);
						libAssert.strictEqual(tmpProvider.removeRouteFromTopic('TOPIC-X', '/two'), false);

						return fDone();
					}
				);

				test
				(
					'saveTopics should call onTopicsSave callback',
					(fDone) =>
					{
						let tmpPict = new libPict({ Product: 'InlineDocTest' });

						let tmpProvider = tmpPict.addProvider(
							'Pict-InlineDocumentation',
							libInlineDocumentation.default_configuration,
							libInlineDocumentation);

						tmpProvider.setDocsBaseURL('/docs/');
						tmpPict.AppData.InlineDocumentation.Topics = {
							'TEST': { TopicCode: 'TEST', TopicTitle: 'Test' }
						};

						let tmpSavedTopics = null;
						tmpProvider._onTopicsSave = (pTopics, fCallback) =>
						{
							tmpSavedTopics = pTopics;
							fCallback(null);
						};

						tmpProvider.saveTopics((pError) =>
						{
							libAssert.strictEqual(pError, null);
							libAssert.ok(tmpSavedTopics);
							libAssert.ok(tmpSavedTopics['TEST']);
							return fDone();
						});
					}
				);

				test
				(
					'saveTopics should succeed without callback handler',
					(fDone) =>
					{
						let tmpPict = new libPict({ Product: 'InlineDocTest' });

						let tmpProvider = tmpPict.addProvider(
							'Pict-InlineDocumentation',
							libInlineDocumentation.default_configuration,
							libInlineDocumentation);

						tmpProvider.setDocsBaseURL('/docs/');
						tmpPict.AppData.InlineDocumentation.Topics = {};

						tmpProvider.saveTopics((pError) =>
						{
							libAssert.strictEqual(pError, null);
							return fDone();
						});
					}
				);

				test
				(
					'setTopicManagerEnabled should update state',
					(fDone) =>
					{
						let tmpPict = new libPict({ Product: 'InlineDocTest' });

						let tmpProvider = tmpPict.addProvider(
							'Pict-InlineDocumentation',
							libInlineDocumentation.default_configuration,
							libInlineDocumentation);

						tmpProvider.setDocsBaseURL('/docs/');

						tmpProvider.setTopicManagerEnabled(true);
						libAssert.strictEqual(tmpPict.AppData.InlineDocumentation.TopicManagerEnabled, true);

						tmpProvider.setTopicManagerEnabled(false);
						libAssert.strictEqual(tmpPict.AppData.InlineDocumentation.TopicManagerEnabled, false);

						return fDone();
					}
				);

				test
				(
					'Provider should have topic CRUD API methods',
					(fDone) =>
					{
						let tmpPict = new libPict({ Product: 'InlineDocTest' });

						let tmpProvider = tmpPict.addProvider(
							'Pict-InlineDocumentation',
							libInlineDocumentation.default_configuration,
							libInlineDocumentation);

						libAssert.strictEqual(typeof tmpProvider.getTopicList, 'function');
						libAssert.strictEqual(typeof tmpProvider.updateTopic, 'function');
						libAssert.strictEqual(typeof tmpProvider.removeTopic, 'function');
						libAssert.strictEqual(typeof tmpProvider.removeRouteFromTopic, 'function');
						libAssert.strictEqual(typeof tmpProvider.saveTopics, 'function');
						libAssert.strictEqual(typeof tmpProvider.setTopicManagerEnabled, 'function');

						return fDone();
					}
				);

				test
				(
					'TopicManager view should be registered',
					(fDone) =>
					{
						let tmpPict = new libPict({ Product: 'InlineDocTest' });

						tmpPict.addProvider(
							'Pict-InlineDocumentation',
							libInlineDocumentation.default_configuration,
							libInlineDocumentation);

						libAssert.ok(tmpPict.views['InlineDoc-TopicManager'], 'TopicManager view should be registered');

						return fDone();
					}
				);

				test
				(
					'Module should export TopicManager view class',
					(fDone) =>
					{
						libAssert.strictEqual(typeof libInlineDocumentation.InlineDocumentationTopicManagerView, 'function');
						return fDone();
					}
				);
			}
		);

		suite
		(
			'Wildcard Builder Helpers',
			() =>
			{
				test
				(
					'getRouteSegments should split route into segments',
					(fDone) =>
					{
						let tmpPict = new libPict({ Product: 'InlineDocTest' });

						let tmpProvider = tmpPict.addProvider(
							'Pict-InlineDocumentation',
							libInlineDocumentation.default_configuration,
							libInlineDocumentation);

						let tmpSegments = tmpProvider.getRouteSegments('/books/detail/5');

						libAssert.strictEqual(tmpSegments.length, 3);

						libAssert.strictEqual(tmpSegments[0].Segment, 'books');
						libAssert.strictEqual(tmpSegments[0].Path, '/books');
						libAssert.strictEqual(tmpSegments[0].WildcardPattern, '/books/*');
						libAssert.strictEqual(tmpSegments[0].Index, 0);

						libAssert.strictEqual(tmpSegments[1].Segment, 'detail');
						libAssert.strictEqual(tmpSegments[1].Path, '/books/detail');
						libAssert.strictEqual(tmpSegments[1].WildcardPattern, '/books/detail/*');
						libAssert.strictEqual(tmpSegments[1].Index, 1);

						libAssert.strictEqual(tmpSegments[2].Segment, '5');
						libAssert.strictEqual(tmpSegments[2].Path, '/books/detail/5');
						libAssert.strictEqual(tmpSegments[2].WildcardPattern, '/books/detail/5/*');
						libAssert.strictEqual(tmpSegments[2].Index, 2);

						return fDone();
					}
				);

				test
				(
					'getRouteSegments should return empty array for empty/invalid input',
					(fDone) =>
					{
						let tmpPict = new libPict({ Product: 'InlineDocTest' });

						let tmpProvider = tmpPict.addProvider(
							'Pict-InlineDocumentation',
							libInlineDocumentation.default_configuration,
							libInlineDocumentation);

						libAssert.deepStrictEqual(tmpProvider.getRouteSegments(''), []);
						libAssert.deepStrictEqual(tmpProvider.getRouteSegments(null), []);
						libAssert.deepStrictEqual(tmpProvider.getRouteSegments(undefined), []);
						libAssert.deepStrictEqual(tmpProvider.getRouteSegments('/'), []);

						return fDone();
					}
				);

				test
				(
					'buildWildcardPattern should create correct patterns',
					(fDone) =>
					{
						let tmpPict = new libPict({ Product: 'InlineDocTest' });

						let tmpProvider = tmpPict.addProvider(
							'Pict-InlineDocumentation',
							libInlineDocumentation.default_configuration,
							libInlineDocumentation);

						libAssert.strictEqual(tmpProvider.buildWildcardPattern('/books/detail/5', 0), '/books/*');
						libAssert.strictEqual(tmpProvider.buildWildcardPattern('/books/detail/5', 1), '/books/detail/*');
						libAssert.strictEqual(tmpProvider.buildWildcardPattern('/books/detail/5', 2), '/books/detail/5/*');

						return fDone();
					}
				);

				test
				(
					'buildWildcardPattern should return empty string for invalid input',
					(fDone) =>
					{
						let tmpPict = new libPict({ Product: 'InlineDocTest' });

						let tmpProvider = tmpPict.addProvider(
							'Pict-InlineDocumentation',
							libInlineDocumentation.default_configuration,
							libInlineDocumentation);

						libAssert.strictEqual(tmpProvider.buildWildcardPattern('', 0), '');
						libAssert.strictEqual(tmpProvider.buildWildcardPattern('/books', -1), '');
						libAssert.strictEqual(tmpProvider.buildWildcardPattern('/books', 5), '');

						return fDone();
					}
				);

				test
				(
					'getTopicsForRoute should return all matching topics sorted by match length',
					(fDone) =>
					{
						let tmpPict = new libPict({ Product: 'InlineDocTest' });

						let tmpProvider = tmpPict.addProvider(
							'Pict-InlineDocumentation',
							libInlineDocumentation.default_configuration,
							libInlineDocumentation);

						tmpProvider.setDocsBaseURL('/docs/');
						tmpPict.AppData.InlineDocumentation.Topics = {
							'BOOKS': { TopicCode: 'BOOKS', Routes: ['/books/*'] },
							'STORE': { TopicCode: 'STORE', Routes: ['/books/store/*'] },
							'SETTINGS': { TopicCode: 'SETTINGS', Routes: ['/settings'] }
						};

						let tmpMatches = tmpProvider.getTopicsForRoute('/books/store/5');

						libAssert.strictEqual(tmpMatches.length, 2);
						libAssert.strictEqual(tmpMatches[0].TopicCode, 'STORE');
						libAssert.strictEqual(tmpMatches[1].TopicCode, 'BOOKS');

						return fDone();
					}
				);
			}
		);

		suite
		(
			'Tooltip Content',
			() =>
			{
				test
				(
					'getTooltipContent should return content from active topic',
					(fDone) =>
					{
						let tmpPict = new libPict({ Product: 'InlineDocTest' });

						let tmpProvider = tmpPict.addProvider(
							'Pict-InlineDocumentation',
							libInlineDocumentation.default_configuration,
							libInlineDocumentation);

						tmpProvider.setDocsBaseURL('/docs/');
						tmpPict.AppData.InlineDocumentation.Topics = {
							'HELP-TOPIC': {
								TopicCode: 'HELP-TOPIC',
								TopicTitle: 'Help',
								Tooltips: {
									'field_name': { Content: '**Bold** help text' },
									'empty_tip': { Content: '' }
								}
							}
						};
						tmpPict.AppData.InlineDocumentation.Topic = 'HELP-TOPIC';

						libAssert.strictEqual(tmpProvider.getTooltipContent('field_name'), '**Bold** help text');
						libAssert.strictEqual(tmpProvider.getTooltipContent('empty_tip'), null);
						libAssert.strictEqual(tmpProvider.getTooltipContent('nonexistent'), null);

						return fDone();
					}
				);

				test
				(
					'getTooltipContent should return null when no active topic',
					(fDone) =>
					{
						let tmpPict = new libPict({ Product: 'InlineDocTest' });

						let tmpProvider = tmpPict.addProvider(
							'Pict-InlineDocumentation',
							libInlineDocumentation.default_configuration,
							libInlineDocumentation);

						tmpProvider.setDocsBaseURL('/docs/');
						tmpPict.AppData.InlineDocumentation.Topics = {
							'HELP-TOPIC': {
								TopicCode: 'HELP-TOPIC',
								Tooltips: { 'tip': { Content: 'Some content' } }
							}
						};
						tmpPict.AppData.InlineDocumentation.Topic = null;

						libAssert.strictEqual(tmpProvider.getTooltipContent('tip'), null);

						return fDone();
					}
				);

				test
				(
					'getTooltipContent should return null when topic has no Tooltips',
					(fDone) =>
					{
						let tmpPict = new libPict({ Product: 'InlineDocTest' });

						let tmpProvider = tmpPict.addProvider(
							'Pict-InlineDocumentation',
							libInlineDocumentation.default_configuration,
							libInlineDocumentation);

						tmpProvider.setDocsBaseURL('/docs/');
						tmpPict.AppData.InlineDocumentation.Topics = {
							'NO-TIPS': { TopicCode: 'NO-TIPS', TopicTitle: 'No Tips' }
						};
						tmpPict.AppData.InlineDocumentation.Topic = 'NO-TIPS';

						libAssert.strictEqual(tmpProvider.getTooltipContent('anything'), null);

						return fDone();
					}
				);

				test
				(
					'setTooltipContent should create Tooltips hash lazily',
					(fDone) =>
					{
						let tmpPict = new libPict({ Product: 'InlineDocTest' });

						let tmpProvider = tmpPict.addProvider(
							'Pict-InlineDocumentation',
							libInlineDocumentation.default_configuration,
							libInlineDocumentation);

						tmpProvider.setDocsBaseURL('/docs/');
						tmpPict.AppData.InlineDocumentation.Topics = {
							'MY-TOPIC': { TopicCode: 'MY-TOPIC', TopicTitle: 'Test' }
						};
						tmpPict.AppData.InlineDocumentation.Topic = 'MY-TOPIC';

						let tmpResult = tmpProvider.setTooltipContent('new_tip', 'Hello world');

						libAssert.strictEqual(tmpResult, true);
						libAssert.ok(tmpPict.AppData.InlineDocumentation.Topics['MY-TOPIC'].Tooltips);
						libAssert.strictEqual(
							tmpPict.AppData.InlineDocumentation.Topics['MY-TOPIC'].Tooltips['new_tip'].Content,
							'Hello world');

						return fDone();
					}
				);

				test
				(
					'setTooltipContent should remove entry when content is null',
					(fDone) =>
					{
						let tmpPict = new libPict({ Product: 'InlineDocTest' });

						let tmpProvider = tmpPict.addProvider(
							'Pict-InlineDocumentation',
							libInlineDocumentation.default_configuration,
							libInlineDocumentation);

						tmpProvider.setDocsBaseURL('/docs/');
						tmpPict.AppData.InlineDocumentation.Topics = {
							'MY-TOPIC': {
								TopicCode: 'MY-TOPIC',
								Tooltips: { 'old_tip': { Content: 'Remove me' } }
							}
						};
						tmpPict.AppData.InlineDocumentation.Topic = 'MY-TOPIC';

						libAssert.strictEqual(tmpProvider.setTooltipContent('old_tip', null), true);
						libAssert.strictEqual(
							tmpPict.AppData.InlineDocumentation.Topics['MY-TOPIC'].Tooltips['old_tip'],
							undefined);

						return fDone();
					}
				);

				test
				(
					'setTooltipContent should return false when no active topic',
					(fDone) =>
					{
						let tmpPict = new libPict({ Product: 'InlineDocTest' });

						let tmpProvider = tmpPict.addProvider(
							'Pict-InlineDocumentation',
							libInlineDocumentation.default_configuration,
							libInlineDocumentation);

						tmpProvider.setDocsBaseURL('/docs/');
						tmpPict.AppData.InlineDocumentation.Topics = {};
						tmpPict.AppData.InlineDocumentation.Topic = null;

						libAssert.strictEqual(tmpProvider.setTooltipContent('tip', 'content'), false);

						return fDone();
					}
				);

				test
				(
					'clearTooltipBindings should empty the bindings array',
					(fDone) =>
					{
						let tmpPict = new libPict({ Product: 'InlineDocTest' });

						let tmpProvider = tmpPict.addProvider(
							'Pict-InlineDocumentation',
							libInlineDocumentation.default_configuration,
							libInlineDocumentation);

						tmpProvider._ActiveTooltipBindings.push(
						{
							Element: null,
							Key: 'test',
							Type: 'attribute',
							TooltipHandle: null,
							ClickHandler: null,
							InjectedIcon: null,
							OriginalDisplay: undefined
						});

						libAssert.strictEqual(tmpProvider._ActiveTooltipBindings.length, 1);
						tmpProvider.clearTooltipBindings();
						libAssert.strictEqual(tmpProvider._ActiveTooltipBindings.length, 0);

						return fDone();
					}
				);

				test
				(
					'Provider should have tooltip API methods',
					(fDone) =>
					{
						let tmpPict = new libPict({ Product: 'InlineDocTest' });

						let tmpProvider = tmpPict.addProvider(
							'Pict-InlineDocumentation',
							libInlineDocumentation.default_configuration,
							libInlineDocumentation);

						libAssert.strictEqual(typeof tmpProvider.getTooltipContent, 'function');
						libAssert.strictEqual(typeof tmpProvider.setTooltipContent, 'function');
						libAssert.strictEqual(typeof tmpProvider.clearTooltipBindings, 'function');
						libAssert.strictEqual(typeof tmpProvider.scanTooltips, 'function');

						return fDone();
					}
				);
			}
		);
	}
);
