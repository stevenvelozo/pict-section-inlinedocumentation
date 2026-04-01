const libPictProvider = require('pict-provider');
const libPictSectionContent = require('pict-section-content');
const libPictContentProvider = libPictSectionContent.PictContentProvider;

const libViewLayout = require('../views/Pict-View-InlineDocumentation-Layout.js');
const libViewContent = require('../views/Pict-View-InlineDocumentation-Content.js');
const libViewNav = require('../views/Pict-View-InlineDocumentation-Nav.js');

/**
 * Inline Documentation Provider
 *
 * The primary API for embedding a documentation browser in a Pict application.
 * Instantiates all necessary views and sub-providers, manages documentation
 * state, and exposes methods for loading documents and navigating topics.
 */
class InlineDocumentationProvider extends libPictProvider
{
	constructor(pFable, pOptions, pServiceHash)
	{
		let tmpOptions = Object.assign({},
			JSON.parse(JSON.stringify(_DefaultConfiguration)),
			pOptions);
		super(pFable, tmpOptions, pServiceHash);

		this._ContentCache = {};

		// Instantiate the content provider for markdown parsing
		this._ContentProvider = this.pict.addProviderSingleton('Pict-Content', libPictContentProvider.default_configuration, libPictContentProvider);

		// Register views
		this.pict.addViewSingleton('InlineDoc-Layout', libViewLayout.default_configuration, libViewLayout);
		this.pict.addViewSingleton('InlineDoc-Content', libViewContent.default_configuration, libViewContent);
		this.pict.addViewSingleton('InlineDoc-Nav', libViewNav.default_configuration, libViewNav);
	}

	/**
	 * Initialize the inline documentation system.
	 *
	 * Sets up application state, loads sidebar navigation and optionally
	 * topic definitions, then renders the layout.
	 *
	 * @param {Object} [pOptions] - Options: { DocsBaseURL, TopicsURL, ContainerAddress }
	 * @param {Function} [fCallback] - Callback when initialization is complete
	 */
	initializeDocumentation(pOptions, fCallback)
	{
		let tmpCallback = (typeof (fCallback) === 'function') ? fCallback : () => {};
		let tmpOptions = pOptions || {};

		// Initialize application state
		if (!this.pict.AppData.InlineDocumentation)
		{
			this.pict.AppData.InlineDocumentation = {};
		}

		let tmpState = this.pict.AppData.InlineDocumentation;
		tmpState.DocsBaseURL = tmpOptions.DocsBaseURL || tmpState.DocsBaseURL || '';
		tmpState.CurrentPath = '';
		tmpState.CurrentRoute = '';
		tmpState.SidebarGroups = tmpState.SidebarGroups || [];
		tmpState.Topic = null;
		tmpState.Topics = tmpState.Topics || {};
		tmpState.NavigationHistory = [];

		// Edit mode state
		tmpState.EditEnabled = tmpState.EditEnabled || false;
		tmpState.Editing = false;
		tmpState.EditingPath = '';
		tmpState.EditingContent = '';

		// Store the onSave callback if provided
		if (typeof tmpOptions.onSave === 'function')
		{
			this._onSave = tmpOptions.onSave;
		}

		// Optionally override the layout container address
		if (tmpOptions.ContainerAddress)
		{
			let tmpLayoutView = this.pict.views['InlineDoc-Layout'];
			if (tmpLayoutView && tmpLayoutView.options && tmpLayoutView.options.Renderables)
			{
				for (let i = 0; i < tmpLayoutView.options.Renderables.length; i++)
				{
					tmpLayoutView.options.Renderables[i].DestinationAddress = tmpOptions.ContainerAddress;
				}
			}
		}

		// Load sidebar and topics in parallel
		let tmpPending = 2;
		let tmpFinish = () =>
		{
			tmpPending--;
			if (tmpPending <= 0)
			{
				// Render the layout (which contains nav and content containers)
				this.pict.views['InlineDoc-Layout'].render();
				// Render the navigation
				this.pict.views['InlineDoc-Nav'].render();

				return tmpCallback();
			}
		};

		this._loadSidebar(tmpFinish);
		this._loadTopics(tmpOptions.TopicsURL, tmpFinish);
	}

	/**
	 * Load and display a markdown document.
	 *
	 * Fetches the document relative to DocsBaseURL, parses it to HTML via
	 * pict-section-content, and displays it in the content view.
	 *
	 * @param {string} pPath - Relative document path (e.g. 'getting-started.md')
	 * @param {Function} [fCallback] - Callback receiving (error, htmlContent)
	 */
	loadDocument(pPath, fCallback)
	{
		let tmpCallback = (typeof (fCallback) === 'function') ? fCallback : () => {};

		if (!pPath)
		{
			return tmpCallback('No document path provided');
		}

		let tmpState = this.pict.AppData.InlineDocumentation;
		let tmpContentView = this.pict.views['InlineDoc-Content'];

		// Ensure .md extension
		let tmpPath = pPath;
		if (!tmpPath.match(/\.md$/))
		{
			tmpPath = tmpPath + '.md';
		}

		// Update state
		tmpState.CurrentPath = tmpPath;
		tmpState.NavigationHistory.push(tmpPath);

		// Render the content view template (creates the container element)
		tmpContentView.render();
		// Show loading indicator
		tmpContentView.showLoading();

		// Fetch the document
		let tmpURL = (tmpState.DocsBaseURL || '') + tmpPath;
		this._fetchDocument(tmpURL, (pError, pHTML) =>
		{
			if (pError)
			{
				tmpContentView.displayContent(this._getErrorPageHTML(tmpPath));
				return tmpCallback(pError);
			}

			tmpContentView.displayContent(pHTML);

			// Update nav to reflect active document
			this.pict.views['InlineDoc-Nav'].render();

			return tmpCallback(null, pHTML);
		});
	}

	/**
	 * Set the active topic, filtering navigation to that topic's documents.
	 *
	 * @param {string} pTopicKey - The topic key (TopicCode from pict_documentation_topics.json)
	 */
	setTopic(pTopicKey)
	{
		let tmpState = this.pict.AppData.InlineDocumentation;

		if (!pTopicKey || !tmpState.Topics || !tmpState.Topics[pTopicKey])
		{
			this.log.warn(`InlineDocumentation: Topic [${pTopicKey}] not found.`);
			return;
		}

		tmpState.Topic = pTopicKey;

		// Re-render navigation with topic filter
		this.pict.views['InlineDoc-Nav'].render();
	}

	/**
	 * Load and display a topic's help document by TopicCode.
	 *
	 * Looks up the topic in the pict_documentation_topics.json format,
	 * sets it as active, and loads its TopicHelpFilePath.
	 *
	 * @param {string} pTopicCode - The TopicCode (e.g. 'BOOKSHOP-BOOKLIST')
	 * @param {Function} [fCallback] - Callback receiving (error, htmlContent)
	 */
	loadTopicDocument(pTopicCode, fCallback)
	{
		let tmpState = this.pict.AppData.InlineDocumentation;

		if (!pTopicCode || !tmpState.Topics || !tmpState.Topics[pTopicCode])
		{
			this.log.warn(`InlineDocumentation: Topic [${pTopicCode}] not found.`);
			if (typeof fCallback === 'function')
			{
				return fCallback('Topic not found');
			}
			return;
		}

		let tmpTopic = tmpState.Topics[pTopicCode];
		tmpState.Topic = pTopicCode;

		// Re-render navigation
		this.pict.views['InlineDoc-Nav'].render();

		// Load the topic's help file
		let tmpPath = tmpTopic.TopicHelpFilePath || '';
		if (tmpPath)
		{
			this.loadDocument(tmpPath, fCallback);
		}
	}

	/**
	 * Clear the active topic, showing full navigation.
	 */
	clearTopic()
	{
		let tmpState = this.pict.AppData.InlineDocumentation;
		tmpState.Topic = null;

		// Re-render navigation without filter
		this.pict.views['InlineDoc-Nav'].render();
	}

	/**
	 * Add a new topic definition at runtime.
	 *
	 * @param {string} pTopicCode - Unique topic code
	 * @param {Object} pTopicDefinition - Topic object: { TopicCode, TopicHelpFilePath, TopicTitle, Routes }
	 */
	addTopic(pTopicCode, pTopicDefinition)
	{
		let tmpState = this.pict.AppData.InlineDocumentation;

		if (!pTopicCode)
		{
			this.log.warn('InlineDocumentation: addTopic requires a TopicCode.');
			return;
		}

		if (!tmpState.Topics)
		{
			tmpState.Topics = {};
		}

		let tmpDefinition = Object.assign({ TopicCode: pTopicCode }, pTopicDefinition || {});
		tmpState.Topics[pTopicCode] = tmpDefinition;
	}

	/**
	 * Add a route pattern to an existing topic.
	 *
	 * @param {string} pTopicCode - The topic to add the route to
	 * @param {string} pRoutePattern - Route pattern (e.g. '/settings', '/admin/*')
	 */
	addRouteToTopic(pTopicCode, pRoutePattern)
	{
		let tmpState = this.pict.AppData.InlineDocumentation;

		if (!pTopicCode || !tmpState.Topics || !tmpState.Topics[pTopicCode])
		{
			this.log.warn(`InlineDocumentation: Topic [${pTopicCode}] not found for addRouteToTopic.`);
			return;
		}

		let tmpTopic = tmpState.Topics[pTopicCode];

		if (!tmpTopic.Routes)
		{
			tmpTopic.Routes = [];
		}

		if (tmpTopic.Routes.indexOf(pRoutePattern) < 0)
		{
			tmpTopic.Routes.push(pRoutePattern);
		}
	}

	/**
	 * Get all topics whose Routes match a given route.
	 *
	 * Unlike resolveHelpForRoute (which returns only the best match),
	 * this returns all matching topic codes — useful when multiple
	 * documents are relevant to the same route.
	 *
	 * @param {string} pRoute - The application route
	 * @returns {Array} Array of { TopicCode, Pattern, MatchLength } objects, sorted by match length descending
	 */
	getTopicsForRoute(pRoute)
	{
		let tmpState = this.pict.AppData.InlineDocumentation;
		let tmpMatches = [];

		if (!pRoute || !tmpState.Topics)
		{
			return tmpMatches;
		}

		let tmpTopicCodes = Object.keys(tmpState.Topics);

		for (let i = 0; i < tmpTopicCodes.length; i++)
		{
			let tmpTopic = tmpState.Topics[tmpTopicCodes[i]];

			if (!tmpTopic.Routes || !Array.isArray(tmpTopic.Routes))
			{
				continue;
			}

			for (let j = 0; j < tmpTopic.Routes.length; j++)
			{
				let tmpPattern = tmpTopic.Routes[j];

				if (!tmpPattern)
				{
					continue;
				}

				let tmpMatchLength = 0;
				let tmpIsMatch = false;

				if (tmpPattern.endsWith('/*'))
				{
					let tmpPrefix = tmpPattern.slice(0, -2);
					if (pRoute === tmpPrefix || pRoute.indexOf(tmpPrefix + '/') === 0)
					{
						tmpIsMatch = true;
						tmpMatchLength = tmpPrefix.length;
					}
				}
				else
				{
					if (pRoute === tmpPattern)
					{
						tmpIsMatch = true;
						tmpMatchLength = tmpPattern.length;
					}
				}

				if (tmpIsMatch)
				{
					tmpMatches.push({ TopicCode: tmpTopicCodes[i], Pattern: tmpPattern, MatchLength: tmpMatchLength });
				}
			}
		}

		// Sort by match length descending (best match first)
		tmpMatches.sort((a, b) => b.MatchLength - a.MatchLength);

		return tmpMatches;
	}

	/**
	 * Change the documentation base URL.
	 *
	 * @param {string} pURL - The new base URL
	 */
	setDocsBaseURL(pURL)
	{
		if (!this.pict.AppData.InlineDocumentation)
		{
			this.pict.AppData.InlineDocumentation = {};
		}
		this.pict.AppData.InlineDocumentation.DocsBaseURL = pURL || '';
		// Clear cache when base URL changes
		this._ContentCache = {};
	}

	/**
	 * Get the navigation history.
	 *
	 * @returns {Array} Array of visited document paths
	 */
	getNavigationHistory()
	{
		let tmpState = this.pict.AppData.InlineDocumentation;
		return (tmpState && tmpState.NavigationHistory) ? tmpState.NavigationHistory : [];
	}

	/**
	 * Navigate back to the previous document.
	 *
	 * @param {Function} [fCallback] - Callback when navigation is complete
	 */
	navigateBack(fCallback)
	{
		let tmpHistory = this.getNavigationHistory();

		if (tmpHistory.length < 2)
		{
			return;
		}

		// Remove current page
		tmpHistory.pop();
		// Get previous page
		let tmpPreviousPath = tmpHistory.pop();

		this.loadDocument(tmpPreviousPath, fCallback);
	}

	// -- Edit mode --

	/**
	 * Enable or disable edit permissions.
	 *
	 * When enabled, a pencil icon appears in the content area allowing
	 * the user to toggle into edit mode.
	 *
	 * @param {boolean} pEnabled - Whether edit mode is available
	 */
	setEditEnabled(pEnabled)
	{
		let tmpState = this.pict.AppData.InlineDocumentation;
		tmpState.EditEnabled = !!pEnabled;

		// Re-render content view to show/hide edit toolbar
		let tmpContentView = this.pict.views['InlineDoc-Content'];
		if (tmpContentView)
		{
			tmpContentView.renderEditToolbar();
		}
	}

	/**
	 * Toggle between view and edit mode.
	 */
	toggleEdit()
	{
		let tmpState = this.pict.AppData.InlineDocumentation;

		if (tmpState.Editing)
		{
			this.cancelEdit();
		}
		else
		{
			this.beginEdit();
		}
	}

	/**
	 * Enter edit mode for the current document.
	 *
	 * Retrieves the raw markdown from cache and displays it in a textarea.
	 */
	beginEdit()
	{
		let tmpState = this.pict.AppData.InlineDocumentation;

		if (!tmpState.EditEnabled || !tmpState.CurrentPath)
		{
			return;
		}

		// Get the raw markdown from cache
		let tmpURL = (tmpState.DocsBaseURL || '') + tmpState.CurrentPath;
		let tmpCacheEntry = this._ContentCache[tmpURL];
		let tmpMarkdown = (tmpCacheEntry && tmpCacheEntry.markdown) ? tmpCacheEntry.markdown : '';

		tmpState.Editing = true;
		tmpState.EditingPath = tmpState.CurrentPath;
		tmpState.EditingContent = tmpMarkdown;

		// Show the editor
		let tmpContentView = this.pict.views['InlineDoc-Content'];
		if (tmpContentView)
		{
			tmpContentView.showEditor(tmpMarkdown);
		}
	}

	/**
	 * Cancel editing and restore the rendered view.
	 */
	cancelEdit()
	{
		let tmpState = this.pict.AppData.InlineDocumentation;

		tmpState.Editing = false;
		tmpState.EditingPath = '';
		tmpState.EditingContent = '';

		// Restore the rendered content
		let tmpContentView = this.pict.views['InlineDoc-Content'];
		if (tmpContentView)
		{
			tmpContentView.hideEditor();

			// Re-display the cached HTML
			let tmpURL = (tmpState.DocsBaseURL || '') + tmpState.CurrentPath;
			let tmpCacheEntry = this._ContentCache[tmpURL];
			if (tmpCacheEntry && tmpCacheEntry.html)
			{
				tmpContentView.displayContent(tmpCacheEntry.html);
			}
		}
	}

	/**
	 * Save the current edits.
	 *
	 * Reads the textarea content, calls the onSave callback provided by the
	 * host app, re-parses the markdown, and returns to view mode.
	 *
	 * @param {Function} [fCallback] - Callback receiving (error)
	 */
	saveEdit(fCallback)
	{
		let tmpCallback = (typeof (fCallback) === 'function') ? fCallback : () => {};
		let tmpState = this.pict.AppData.InlineDocumentation;
		let tmpContentView = this.pict.views['InlineDoc-Content'];

		if (!tmpState.Editing)
		{
			return tmpCallback('Not in edit mode');
		}

		// Read the current textarea content
		let tmpMarkdown = '';
		if (typeof document !== 'undefined')
		{
			let tmpTextarea = document.getElementById('InlineDoc-Edit-Textarea');
			if (tmpTextarea)
			{
				tmpMarkdown = tmpTextarea.value;
			}
		}

		let tmpPath = tmpState.EditingPath;
		let tmpURL = (tmpState.DocsBaseURL || '') + tmpPath;

		let tmpSaveData = { Path: tmpPath, Content: tmpMarkdown };

		let tmpFinishSave = () =>
		{
			// Re-parse the markdown and update cache
			let tmpHTML = this._ContentProvider.parseMarkdown(
				tmpMarkdown,
				this._createLinkResolver(),
				this._createImageResolver(tmpURL));
			this._ContentCache[tmpURL] = { html: tmpHTML, markdown: tmpMarkdown };

			// Exit edit mode
			tmpState.Editing = false;
			tmpState.EditingPath = '';
			tmpState.EditingContent = '';

			// Display the updated content
			if (tmpContentView)
			{
				tmpContentView.hideEditor();
				tmpContentView.displayContent(tmpHTML);
			}

			return tmpCallback(null);
		};

		// Call the onSave callback if provided
		if (typeof this._onSave === 'function')
		{
			this._onSave(tmpSaveData, (pError) =>
			{
				if (pError)
				{
					this.log.warn(`InlineDocumentation: Save failed: ${pError}`);
					return tmpCallback(pError);
				}
				tmpFinishSave();
			});
		}
		else
		{
			// No save handler — just update locally
			tmpFinishSave();
		}
	}

	// -- Route-based help --

	/**
	 * Find the best-matching topic for a given route.
	 *
	 * Iterates all topics looking for ones with a Routes array. Supports
	 * exact match and wildcard suffix (e.g. "/books/store/*" matches
	 * "/books/store/123"). Returns the TopicCode with the longest matching
	 * route pattern, or null if no match.
	 *
	 * @param {string} pRoute - The application route (e.g. '/books/store/5')
	 * @returns {string|null} The TopicCode of the best match, or null
	 */
	resolveHelpForRoute(pRoute)
	{
		let tmpState = this.pict.AppData.InlineDocumentation;

		if (!pRoute || !tmpState.Topics)
		{
			return null;
		}

		let tmpBestMatch = null;
		let tmpBestLength = -1;

		let tmpTopicCodes = Object.keys(tmpState.Topics);

		for (let i = 0; i < tmpTopicCodes.length; i++)
		{
			let tmpTopic = tmpState.Topics[tmpTopicCodes[i]];

			if (!tmpTopic.Routes || !Array.isArray(tmpTopic.Routes))
			{
				continue;
			}

			for (let j = 0; j < tmpTopic.Routes.length; j++)
			{
				let tmpPattern = tmpTopic.Routes[j];

				if (!tmpPattern)
				{
					continue;
				}

				let tmpMatches = false;
				let tmpMatchLength = 0;

				if (tmpPattern.endsWith('/*'))
				{
					// Wildcard suffix — match if route starts with prefix
					let tmpPrefix = tmpPattern.slice(0, -2);
					if (pRoute === tmpPrefix || pRoute.indexOf(tmpPrefix + '/') === 0)
					{
						tmpMatches = true;
						tmpMatchLength = tmpPrefix.length;
					}
				}
				else
				{
					// Exact match
					if (pRoute === tmpPattern)
					{
						tmpMatches = true;
						tmpMatchLength = tmpPattern.length;
					}
				}

				if (tmpMatches && tmpMatchLength > tmpBestLength)
				{
					tmpBestMatch = tmpTopicCodes[i];
					tmpBestLength = tmpMatchLength;
				}
			}
		}

		return tmpBestMatch;
	}

	/**
	 * Navigate help to the topic matching a given route.
	 *
	 * Convenience method: resolves the route to a topic, then loads it.
	 * If no topic matches, does nothing.
	 *
	 * @param {string} pRoute - The application route
	 * @param {Function} [fCallback] - Callback receiving (error, htmlContent)
	 * @returns {boolean} True if a matching topic was found
	 */
	navigateToRoute(pRoute, fCallback)
	{
		let tmpState = this.pict.AppData.InlineDocumentation;
		tmpState.CurrentRoute = pRoute || '';

		let tmpTopicCode = this.resolveHelpForRoute(pRoute);

		if (tmpTopicCode)
		{
			this.loadTopicDocument(tmpTopicCode, fCallback);
			return true;
		}

		return false;
	}

	// -- Internal methods --

	/**
	 * Fetch a markdown document and convert it to HTML.
	 *
	 * @param {string} pURL - The URL to fetch
	 * @param {Function} fCallback - Callback receiving (error, htmlContent)
	 */
	_fetchDocument(pURL, fCallback)
	{
		let tmpCallback = (typeof (fCallback) === 'function') ? fCallback : () => {};

		if (!pURL)
		{
			return tmpCallback('No URL provided', '');
		}

		// Check cache
		if (this._ContentCache[pURL])
		{
			return tmpCallback(null, this._ContentCache[pURL].html);
		}

		fetch(pURL)
			.then((pResponse) =>
			{
				if (!pResponse.ok)
				{
					return null;
				}
				return pResponse.text();
			})
			.then((pMarkdown) =>
			{
				if (!pMarkdown)
				{
					return tmpCallback('Document not found', '');
				}

				let tmpHTML = this._ContentProvider.parseMarkdown(
					pMarkdown,
					this._createLinkResolver(),
					this._createImageResolver(pURL));
				this._ContentCache[pURL] = { html: tmpHTML, markdown: pMarkdown };
				return tmpCallback(null, tmpHTML);
			})
			.catch((pError) =>
			{
				this.log.warn(`InlineDocumentation: Error fetching [${pURL}]: ${pError}`);
				return tmpCallback(pError, '');
			});
	}

	/**
	 * Create a link resolver that converts internal doc links to provider API calls.
	 *
	 * Internal links (relative .md paths) get converted to javascript:void(0) with
	 * a data attribute so the content view's click handler can intercept them and
	 * call loadDocument().
	 *
	 * @returns {Function} A link resolver callback
	 */
	_createLinkResolver()
	{
		return (pHref, pLinkText) =>
		{
			// Only intercept internal markdown links
			if (pHref.match(/^https?:\/\//))
			{
				// External link — open in new tab
				return { href: pHref, target: '_blank', rel: 'noopener' };
			}

			// Internal doc link — mark for interception
			let tmpPath = pHref.replace(/^\.\//, '').replace(/^\//, '');
			return {
				href: 'javascript:void(0)',
				// Use a data attribute for the click handler
				// The content view will wire up click interception
				target: '',
				rel: 'pict-inline-doc-link:' + tmpPath
			};
		};
	}

	/**
	 * Create an image resolver closure.
	 *
	 * @param {string} pDocURL - The URL the document was fetched from
	 * @returns {Function} An image resolver callback
	 */
	_createImageResolver(pDocURL)
	{
		let tmpBaseDir = '';
		if (pDocURL)
		{
			let tmpLastSlash = pDocURL.lastIndexOf('/');
			if (tmpLastSlash >= 0)
			{
				tmpBaseDir = pDocURL.substring(0, tmpLastSlash + 1);
			}
		}

		return (pSrc, pAlt) =>
		{
			if (pSrc.match(/^https?:\/\//) || pSrc.match(/^data:/) || pSrc.match(/^\//))
			{
				return pSrc;
			}
			return tmpBaseDir + pSrc;
		};
	}

	/**
	 * Load and parse _sidebar.md from the docs base URL.
	 *
	 * @param {Function} fCallback - Callback when done
	 */
	_loadSidebar(fCallback)
	{
		let tmpCallback = (typeof (fCallback) === 'function') ? fCallback : () => {};
		let tmpState = this.pict.AppData.InlineDocumentation;
		let tmpDocsBase = tmpState.DocsBaseURL || '';

		fetch(tmpDocsBase + '_sidebar.md')
			.then((pResponse) =>
			{
				if (!pResponse.ok)
				{
					return null;
				}
				return pResponse.text();
			})
			.then((pMarkdown) =>
			{
				if (!pMarkdown)
				{
					this.log.info('InlineDocumentation: No _sidebar.md found.');
					return tmpCallback();
				}

				tmpState.SidebarGroups = this._parseSidebarMarkdown(pMarkdown);
				return tmpCallback();
			})
			.catch((pError) =>
			{
				this.log.warn(`InlineDocumentation: Error loading _sidebar.md: ${pError}`);
				return tmpCallback();
			});
	}

	/**
	 * Load topic definitions from a JSON file.
	 *
	 * Expected format:
	 *   {
	 *     "getting-started": {
	 *       "Name": "Getting Started",
	 *       "Documents": ["README.md", "getting-started.md"]
	 *     }
	 *   }
	 *
	 * @param {string} [pTopicsURL] - URL to fetch topics from (defaults to DocsBaseURL + '_topics.json')
	 * @param {Function} fCallback - Callback when done
	 */
	_loadTopics(pTopicsURL, fCallback)
	{
		let tmpCallback = (typeof (fCallback) === 'function') ? fCallback : () => {};
		let tmpState = this.pict.AppData.InlineDocumentation;
		let tmpDocsBase = tmpState.DocsBaseURL || '';

		let tmpURL = pTopicsURL || (tmpDocsBase + '_topics.json');

		fetch(tmpURL)
			.then((pResponse) =>
			{
				if (!pResponse.ok)
				{
					return null;
				}
				return pResponse.json();
			})
			.then((pTopics) =>
			{
				if (pTopics)
				{
					tmpState.Topics = pTopics;
					this.log.info(`InlineDocumentation: Topics loaded (${Object.keys(pTopics).length} topics).`);
				}
				else
				{
					this.log.info('InlineDocumentation: No _topics.json found.');
				}
				return tmpCallback();
			})
			.catch((pError) =>
			{
				this.log.info(`InlineDocumentation: No topics loaded (${pError}).`);
				return tmpCallback();
			});
	}

	/**
	 * Parse _sidebar.md into a navigation structure.
	 *
	 * Returns an array of group objects:
	 *   [{ Name, Key, Path, Items: [{ Name, Path }] }]
	 *
	 * @param {string} pMarkdown - Raw _sidebar.md content
	 * @returns {Array} Parsed sidebar groups
	 */
	_parseSidebarMarkdown(pMarkdown)
	{
		let tmpGroups = [];
		let tmpCurrentGroup = null;
		let tmpLines = pMarkdown.split('\n');

		for (let i = 0; i < tmpLines.length; i++)
		{
			let tmpLine = tmpLines[i];

			if (!tmpLine.trim())
			{
				continue;
			}

			let tmpIndentMatch = tmpLine.match(/^(\s*)/);
			let tmpIndent = tmpIndentMatch ? tmpIndentMatch[1].length : 0;
			let tmpContent = tmpLine.trim();

			let tmpListMatch = tmpContent.match(/^[-*+]\s+(.*)/);
			if (!tmpListMatch)
			{
				continue;
			}

			let tmpItemContent = tmpListMatch[1].trim();
			let tmpLinkMatch = tmpItemContent.match(/^\[([^\]]+)\]\(([^)]+)\)/);

			if (tmpIndent < 2)
			{
				// Top-level item — group header
				if (tmpLinkMatch)
				{
					let tmpName = tmpLinkMatch[1].trim();
					let tmpPath = tmpLinkMatch[2].trim();

					tmpCurrentGroup = {
						Name: tmpName,
						Key: tmpName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
						Path: this._normalizePath(tmpPath),
						Items: []
					};
					tmpGroups.push(tmpCurrentGroup);
				}
				else
				{
					tmpCurrentGroup = {
						Name: tmpItemContent,
						Key: tmpItemContent.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
						Path: '',
						Items: []
					};
					tmpGroups.push(tmpCurrentGroup);
				}
			}
			else if (tmpCurrentGroup)
			{
				// Indented item — document within the current group
				if (tmpLinkMatch)
				{
					tmpCurrentGroup.Items.push({
						Name: tmpLinkMatch[1].trim(),
						Path: this._normalizePath(tmpLinkMatch[2].trim())
					});
				}
				else
				{
					tmpCurrentGroup.Items.push({
						Name: tmpItemContent,
						Path: ''
					});
				}
			}
		}

		return tmpGroups;
	}

	/**
	 * Normalize a document path from sidebar links.
	 * Strips leading slashes and ./ prefixes.
	 *
	 * @param {string} pPath - The raw path
	 * @returns {string} The normalized path
	 */
	_normalizePath(pPath)
	{
		if (!pPath)
		{
			return '';
		}
		return pPath.replace(/^\.\//, '').replace(/^\//, '');
	}

	/**
	 * Get an error page HTML block for a missing document.
	 *
	 * @param {string} pPath - The path that was not found
	 * @returns {string} HTML to display
	 */
	_getErrorPageHTML(pPath)
	{
		let tmpPath = this._ContentProvider.escapeHTML(pPath || 'unknown');
		return '<div class="pict-inline-doc-not-found">'
			+ '<h2>Page Not Found</h2>'
			+ '<p>The document <code>' + tmpPath + '</code> could not be loaded.</p>'
			+ '</div>';
	}
}

const _DefaultConfiguration =
{
	ProviderIdentifier: "Pict-InlineDocumentation",

	AutoInitialize: true,
	AutoInitializeOrdinal: 0
};

module.exports = InlineDocumentationProvider;

module.exports.default_configuration = _DefaultConfiguration;
