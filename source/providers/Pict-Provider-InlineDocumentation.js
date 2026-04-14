const libPictProvider = require('pict-provider');
const libPictSectionContent = require('pict-section-content');
const libPictContentProvider = libPictSectionContent.PictContentProvider;
const libPictSectionModal = require('pict-section-modal');
const libPictSectionMarkdownEditor = require('pict-section-markdowneditor');
const libLunr = require('lunr');

const libViewLayout = require('../views/Pict-View-InlineDocumentation-Layout.js');
const libViewContent = require('../views/Pict-View-InlineDocumentation-Content.js');
const libViewNav = require('../views/Pict-View-InlineDocumentation-Nav.js');
const libViewTopicManager = require('../views/Pict-View-InlineDocumentation-TopicManager.js');

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
		this._ActiveTooltipBindings = [];
		this._tooltipHelpLinkHandler = null;

		// Instantiate the content provider for markdown parsing
		this._ContentProvider = this.pict.addProviderSingleton('Pict-Content', libPictContentProvider.default_configuration, libPictContentProvider);

		// Register views
		this.pict.addViewSingleton('InlineDoc-Layout', libViewLayout.default_configuration, libViewLayout);
		this.pict.addViewSingleton('InlineDoc-Content', libViewContent.default_configuration, libViewContent);
		this.pict.addViewSingleton('InlineDoc-Nav', libViewNav.default_configuration, libViewNav);
		this.pict.addViewSingleton('InlineDoc-TopicManager', libViewTopicManager.default_configuration, libViewTopicManager);

		// Register pict-section-modal if not already present (needed by topic manager)
		if (!this.pict.views['Pict-Section-Modal'])
		{
			this.pict.addViewSingleton('Pict-Section-Modal', libPictSectionModal.default_configuration, libPictSectionModal);
		}

		// Register the markdown editor for edit mode
		let tmpEditorConfig = JSON.parse(JSON.stringify(libPictSectionMarkdownEditor.default_configuration));
		tmpEditorConfig.DefaultDestinationAddress = '#InlineDoc-Editor-Container';
		tmpEditorConfig.TargetElementAddress = '#InlineDoc-Editor-Container';
		tmpEditorConfig.ContentDataAddress = 'AppData.InlineDocumentation.EditorSegments';
		tmpEditorConfig.DefaultPreviewMode = 'off';
		tmpEditorConfig.Renderables =
		[
			{
				RenderableHash: 'MarkdownEditor-Wrap',
				TemplateHash: 'MarkdownEditor-Container',
				ContentDestinationAddress: '#InlineDoc-Editor-Container'
			}
		];
		this.pict.addViewSingleton('InlineDoc-MarkdownEditor', tmpEditorConfig, libPictSectionMarkdownEditor);
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

		// Navigation outline state
		tmpState.NavCollapsed = true;
		tmpState.CollapsedGroups = {};
		tmpState.ActiveDocumentHeadings = [];
		tmpState.NavFilterText = '';

		// Full-text search state
		tmpState.SearchIndexLoaded = false;
		tmpState.SearchQuery = '';
		tmpState.SearchResults = [];

		// External link resolution — paths starting with / in the
		// sidebar are cross-module references. ExternalDocBaseURL
		// is prepended to make them full URLs opened in a new tab.
		tmpState.ExternalDocBaseURL = tmpOptions.ExternalDocBaseURL || '';

		// Edit mode state — read from pOptions if provided
		if (tmpOptions.EditEnabled !== undefined)
		{
			tmpState.EditEnabled = !!tmpOptions.EditEnabled;
		}
		else
		{
			tmpState.EditEnabled = tmpState.EditEnabled || false;
		}
		tmpState.Editing = false;
		tmpState.EditingPath = '';
		tmpState.EditingContent = '';
		tmpState.TooltipEditMode = false;

		// Store the onSave callback if provided
		if (typeof tmpOptions.onSave === 'function')
		{
			this._onSave = tmpOptions.onSave;
		}

		// Store the onTopicsSave callback if provided
		if (typeof tmpOptions.onTopicsSave === 'function')
		{
			this._onTopicsSave = tmpOptions.onTopicsSave;
		}

		// Store the onImageUpload callback if provided
		if (typeof tmpOptions.onImageUpload === 'function')
		{
			this._onImageUpload = tmpOptions.onImageUpload;
			this._wireEditorImageUpload();
		}

		// Topic manager enabled state
		// If explicitly set, use that; otherwise track EditEnabled
		if (tmpOptions.TopicManagerEnabled !== undefined)
		{
			tmpState.TopicManagerEnabled = !!tmpOptions.TopicManagerEnabled;
			this._topicManagerExplicitlySet = true;
		}
		else
		{
			tmpState.TopicManagerEnabled = tmpState.EditEnabled || false;
			this._topicManagerExplicitlySet = false;
		}

		// Optionally override the layout container address
		if (tmpOptions.ContainerAddress)
		{
			let tmpLayoutView = this.pict.views['InlineDoc-Layout'];
			if (tmpLayoutView && tmpLayoutView.options && tmpLayoutView.options.Renderables)
			{
				for (let i = 0; i < tmpLayoutView.options.Renderables.length; i++)
				{
					tmpLayoutView.options.Renderables[i].ContentDestinationAddress = tmpOptions.ContainerAddress;
				}
			}
		}

		// Load sidebar, topics, and search index in parallel
		let tmpPending = 2;
		if (tmpOptions.SearchIndexURL) tmpPending++;

		let tmpSelf = this;
		let tmpFinish = () =>
		{
			tmpPending--;
			if (tmpPending <= 0)
			{
				// Mark sidebar items as external based on ExternalDocBaseURL
				tmpSelf._markExternalSidebarItems();

				// Render the layout (which contains nav and content containers)
				tmpSelf.pict.views['InlineDoc-Layout'].render();
				// Render the navigation
				tmpSelf.pict.views['InlineDoc-Nav'].render();

				return tmpCallback();
			}
		};

		this._loadSidebar(tmpFinish);
		this._loadTopics(tmpOptions.TopicsURL, tmpFinish);

		if (tmpOptions.SearchIndexURL)
		{
			this._loadSearchIndex(tmpOptions.SearchIndexURL, tmpFinish);
		}
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

		// Parse anchor from path (e.g. 'page.md#section-heading')
		let tmpAnchor = '';
		let tmpPath = pPath;
		let tmpHashIndex = tmpPath.indexOf('#');
		if (tmpHashIndex >= 0)
		{
			tmpAnchor = tmpPath.substring(tmpHashIndex + 1);
			tmpPath = tmpPath.substring(0, tmpHashIndex);
		}

		// Ensure .md extension
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

			// Scroll to anchor if specified
			if (tmpAnchor)
			{
				this._scrollToAnchor(tmpAnchor);
			}

			// Collapse the nav outline and clear search/filter
			tmpState.NavCollapsed = true;
			tmpState.NavFilterText = '';
			tmpState.SearchQuery = '';
			tmpState.SearchResults = [];
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
	 * Get a list of all topics in a UI-friendly array format.
	 *
	 * @returns {Array} Array of { TopicCode, TopicTitle, TopicHelpFilePath, RouteCount }
	 */
	getTopicList()
	{
		let tmpState = this.pict.AppData.InlineDocumentation;
		let tmpResult = [];

		if (!tmpState || !tmpState.Topics)
		{
			return tmpResult;
		}

		let tmpTopicCodes = Object.keys(tmpState.Topics);

		for (let i = 0; i < tmpTopicCodes.length; i++)
		{
			let tmpTopic = tmpState.Topics[tmpTopicCodes[i]];
			tmpResult.push(
			{
				TopicCode: tmpTopicCodes[i],
				TopicTitle: tmpTopic.TopicTitle || tmpTopic.Name || tmpTopicCodes[i],
				TopicHelpFilePath: tmpTopic.TopicHelpFilePath || '',
				RouteCount: (tmpTopic.Routes && Array.isArray(tmpTopic.Routes)) ? tmpTopic.Routes.length : 0
			});
		}

		return tmpResult;
	}

	/**
	 * Update an existing topic definition.
	 *
	 * Merges only the properties present in pUpdates into the topic.
	 *
	 * @param {string} pTopicCode - The topic to update
	 * @param {Object} pUpdates - Properties to merge: { TopicTitle, TopicHelpFilePath, Routes }
	 * @returns {boolean} True if updated, false if topic not found
	 */
	updateTopic(pTopicCode, pUpdates)
	{
		let tmpState = this.pict.AppData.InlineDocumentation;

		if (!pTopicCode || !tmpState.Topics || !tmpState.Topics[pTopicCode])
		{
			return false;
		}

		let tmpTopic = tmpState.Topics[pTopicCode];
		let tmpUpdates = pUpdates || {};

		if (tmpUpdates.hasOwnProperty('TopicTitle'))
		{
			tmpTopic.TopicTitle = tmpUpdates.TopicTitle;
		}
		if (tmpUpdates.hasOwnProperty('TopicHelpFilePath'))
		{
			tmpTopic.TopicHelpFilePath = tmpUpdates.TopicHelpFilePath;
		}
		if (tmpUpdates.hasOwnProperty('Routes'))
		{
			tmpTopic.Routes = tmpUpdates.Routes;
		}

		return true;
	}

	/**
	 * Remove a topic definition.
	 *
	 * If the removed topic is the currently active topic, clears it.
	 *
	 * @param {string} pTopicCode - The topic to remove
	 * @returns {boolean} True if removed, false if topic not found
	 */
	removeTopic(pTopicCode)
	{
		let tmpState = this.pict.AppData.InlineDocumentation;

		if (!pTopicCode || !tmpState.Topics || !tmpState.Topics[pTopicCode])
		{
			return false;
		}

		delete tmpState.Topics[pTopicCode];

		// Clear active topic if it was the one removed
		if (tmpState.Topic === pTopicCode)
		{
			tmpState.Topic = null;
		}

		return true;
	}

	/**
	 * Remove a specific route pattern from a topic.
	 *
	 * @param {string} pTopicCode - The topic to modify
	 * @param {string} pRoutePattern - The route pattern to remove
	 * @returns {boolean} True if removed, false if not found
	 */
	removeRouteFromTopic(pTopicCode, pRoutePattern)
	{
		let tmpState = this.pict.AppData.InlineDocumentation;

		if (!pTopicCode || !tmpState.Topics || !tmpState.Topics[pTopicCode])
		{
			return false;
		}

		let tmpTopic = tmpState.Topics[pTopicCode];

		if (!tmpTopic.Routes || !Array.isArray(tmpTopic.Routes))
		{
			return false;
		}

		let tmpIndex = tmpTopic.Routes.indexOf(pRoutePattern);

		if (tmpIndex < 0)
		{
			return false;
		}

		tmpTopic.Routes.splice(tmpIndex, 1);
		return true;
	}

	/**
	 * Persist the current topics via the onTopicsSave callback.
	 *
	 * If no onTopicsSave handler was provided, succeeds locally.
	 *
	 * @param {Function} [fCallback] - Callback receiving (error)
	 */
	saveTopics(fCallback)
	{
		let tmpCallback = (typeof (fCallback) === 'function') ? fCallback : () => {};
		let tmpState = this.pict.AppData.InlineDocumentation;

		if (typeof this._onTopicsSave === 'function')
		{
			this._onTopicsSave(tmpState.Topics, (pError) =>
			{
				if (pError)
				{
					this.log.warn(`InlineDocumentation: Topics save failed: ${pError}`);
					return tmpCallback(pError);
				}
				return tmpCallback(null);
			});
		}
		else
		{
			// No save handler — succeed locally
			return tmpCallback(null);
		}
	}

	/**
	 * Enable or disable the topic manager UI.
	 *
	 * When enabled, management buttons appear in the navigation toolbar.
	 *
	 * @param {boolean} pEnabled - Whether topic management is available
	 */
	setTopicManagerEnabled(pEnabled)
	{
		let tmpState = this.pict.AppData.InlineDocumentation;
		tmpState.TopicManagerEnabled = !!pEnabled;

		// Re-render navigation to show/hide management buttons
		let tmpNavView = this.pict.views['InlineDoc-Nav'];
		if (tmpNavView)
		{
			tmpNavView.render();
		}
	}

	// -- Wildcard builder helpers --

	/**
	 * Split a route into segments with wildcard pattern options.
	 *
	 * For a route like '/books/detail/5', returns:
	 * [
	 *   { Segment: 'books',  Path: '/books',         WildcardPattern: '/books/*',         Index: 0 },
	 *   { Segment: 'detail', Path: '/books/detail',   WildcardPattern: '/books/detail/*',   Index: 1 },
	 *   { Segment: '5',      Path: '/books/detail/5', WildcardPattern: '/books/detail/5/*', Index: 2 }
	 * ]
	 *
	 * @param {string} pRoute - The route to split
	 * @returns {Array} Array of segment objects
	 */
	getRouteSegments(pRoute)
	{
		if (!pRoute || typeof pRoute !== 'string')
		{
			return [];
		}

		// Strip leading slash and split
		let tmpClean = pRoute.replace(/^\//, '');
		if (!tmpClean)
		{
			return [];
		}

		let tmpParts = tmpClean.split('/');
		let tmpSegments = [];

		for (let i = 0; i < tmpParts.length; i++)
		{
			let tmpPath = '/' + tmpParts.slice(0, i + 1).join('/');
			tmpSegments.push(
			{
				Segment: tmpParts[i],
				Path: tmpPath,
				WildcardPattern: tmpPath + '/*',
				Index: i
			});
		}

		return tmpSegments;
	}

	/**
	 * Build a wildcard pattern from a route at a given segment index.
	 *
	 * The wildcard replaces everything after the segment at pSegmentIndex.
	 * For '/books/detail/5' with index 1, returns '/books/detail/*'.
	 *
	 * @param {string} pRoute - The route
	 * @param {number} pSegmentIndex - The segment index (0-based) where the wildcard starts after
	 * @returns {string} The wildcard pattern, or empty string if invalid
	 */
	buildWildcardPattern(pRoute, pSegmentIndex)
	{
		let tmpSegments = this.getRouteSegments(pRoute);

		if (tmpSegments.length < 1 || pSegmentIndex < 0 || pSegmentIndex >= tmpSegments.length)
		{
			return '';
		}

		return tmpSegments[pSegmentIndex].WildcardPattern;
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

		// If TopicManagerEnabled was not explicitly configured, mirror EditEnabled
		if (!this._topicManagerExplicitlySet)
		{
			tmpState.TopicManagerEnabled = !!pEnabled;

			// Re-render navigation to show/hide management buttons
			let tmpNavView = this.pict.views['InlineDoc-Nav'];
			if (tmpNavView)
			{
				tmpNavView.render();
			}
		}

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
	 * Retrieves the raw markdown from cache and displays it in the markdown editor.
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
		tmpState.EditorSegments = [];

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
	 * Reads the markdown editor content, calls the onSave callback provided by the
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

		// Read content from the markdown editor
		// First marshal editor state to data, then read from the data address
		let tmpMarkdown = '';
		let tmpEditorView = this.pict.views['InlineDoc-MarkdownEditor'];
		if (tmpEditorView && typeof tmpEditorView.marshalFromView === 'function')
		{
			tmpEditorView.marshalFromView();
		}
		if (tmpState.EditorSegments && tmpState.EditorSegments.length > 0)
		{
			tmpMarkdown = tmpState.EditorSegments[0].Content || '';
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
			tmpState.EditorSegments = [];

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

	// -- Tooltip placeholders --

	/**
	 * Enable or disable tooltip edit mode.
	 *
	 * When enabled, all tooltip placeholders are visible and clickable
	 * for content editors to author tooltip content. When disabled,
	 * only placeholders with content show tooltips on hover.
	 *
	 * Automatically re-scans tooltips after toggling.
	 *
	 * @param {boolean} pEnabled - Whether tooltip edit mode is active
	 */
	setTooltipEditMode(pEnabled)
	{
		let tmpState = this.pict.AppData.InlineDocumentation;

		if (!tmpState)
		{
			return;
		}

		tmpState.TooltipEditMode = !!pEnabled;
		this.scanTooltips();
	}

	/**
	 * Get the tooltip content for a key from the active topic.
	 *
	 * Looks up the currently active topic's Tooltips hash for the
	 * given key and returns the Content string, or null if not found.
	 *
	 * @param {string} pTooltipKey - The tooltip key (from data-d-tooltip attribute)
	 * @returns {string|null} The tooltip content, or null
	 */
	getTooltipContent(pTooltipKey)
	{
		let tmpState = this.pict.AppData.InlineDocumentation;

		if (!pTooltipKey || !tmpState || !tmpState.Topic || !tmpState.Topics)
		{
			return null;
		}

		let tmpTopic = tmpState.Topics[tmpState.Topic];

		if (!tmpTopic || !tmpTopic.Tooltips || !tmpTopic.Tooltips[pTooltipKey])
		{
			return null;
		}

		return tmpTopic.Tooltips[pTooltipKey].Content || null;
	}

	/**
	 * Set tooltip content for a key on the active topic.
	 *
	 * Lazily creates the Tooltips hash on the topic if needed.
	 * Passing null or empty string removes the tooltip entry.
	 *
	 * @param {string} pTooltipKey - The tooltip key
	 * @param {string|null} pContent - The markdown content, or null to remove
	 * @returns {boolean} True if set, false if no active topic
	 */
	setTooltipContent(pTooltipKey, pContent)
	{
		let tmpState = this.pict.AppData.InlineDocumentation;

		if (!pTooltipKey || !tmpState || !tmpState.Topic || !tmpState.Topics)
		{
			return false;
		}

		let tmpTopic = tmpState.Topics[tmpState.Topic];

		if (!tmpTopic)
		{
			return false;
		}

		if (!pContent)
		{
			// Remove the entry
			if (tmpTopic.Tooltips && tmpTopic.Tooltips[pTooltipKey])
			{
				delete tmpTopic.Tooltips[pTooltipKey];
			}
			return true;
		}

		// Lazily create Tooltips hash
		if (!tmpTopic.Tooltips)
		{
			tmpTopic.Tooltips = {};
		}

		tmpTopic.Tooltips[pTooltipKey] = { Content: pContent };
		return true;
	}

	/**
	 * Remove all active tooltip bindings from the DOM.
	 *
	 * Destroys tooltip handles, removes click listeners, removes
	 * injected icons, and restores original element state.
	 */
	clearTooltipBindings()
	{
		for (let i = 0; i < this._ActiveTooltipBindings.length; i++)
		{
			let tmpBinding = this._ActiveTooltipBindings[i];

			// Destroy the modal tooltip handle
			if (tmpBinding.TooltipHandle && typeof tmpBinding.TooltipHandle.destroy === 'function')
			{
				tmpBinding.TooltipHandle.destroy();
			}

			// Remove click handler
			if (tmpBinding.ClickHandler && tmpBinding.Element)
			{
				tmpBinding.Element.removeEventListener('click', tmpBinding.ClickHandler);
			}

			// Remove injected icon
			if (tmpBinding.InjectedIcon && tmpBinding.InjectedIcon.parentNode)
			{
				tmpBinding.InjectedIcon.parentNode.removeChild(tmpBinding.InjectedIcon);
			}

			// Remove edit-mode CSS classes
			if (tmpBinding.Element)
			{
				tmpBinding.Element.classList.remove(
					'pict-inline-doc-tooltip-edit-target',
					'pict-inline-doc-tooltip-empty');
			}

			// Restore original display for hidden icon spans
			if (tmpBinding.OriginalDisplay !== undefined && tmpBinding.Element)
			{
				tmpBinding.Element.style.display = tmpBinding.OriginalDisplay;
			}
		}

		this._ActiveTooltipBindings = [];

		// Remove document-level help link handler
		if (this._tooltipHelpLinkHandler && typeof document !== 'undefined')
		{
			document.removeEventListener('click', this._tooltipHelpLinkHandler);
			this._tooltipHelpLinkHandler = null;
		}
	}

	/**
	 * Scan the document for tooltip placeholder elements and wire them up.
	 *
	 * Finds all elements with data-d-tooltip attributes and:
	 * - In normal mode: attaches hover tooltips for those with content
	 * - In edit mode: adds visual indicators and click-to-edit handlers
	 *
	 * Call this after your application views render.
	 */
	scanTooltips()
	{
		this.clearTooltipBindings();

		if (typeof document === 'undefined')
		{
			return;
		}

		let tmpState = this.pict.AppData.InlineDocumentation;

		if (!tmpState)
		{
			return;
		}

		let tmpModal = this.pict.views['Pict-Section-Modal'];
		let tmpElements = document.querySelectorAll('[data-d-tooltip]');
		let tmpEditMode = tmpState.TooltipEditMode || false;

		for (let i = 0; i < tmpElements.length; i++)
		{
			let tmpElement = tmpElements[i];
			let tmpKey = tmpElement.getAttribute('data-d-tooltip');

			if (!tmpKey)
			{
				continue;
			}

			let tmpContent = this.getTooltipContent(tmpKey);
			let tmpIsIcon = tmpElement.hasAttribute('data-d-tooltip-icon');

			let tmpBinding =
			{
				Element: tmpElement,
				Key: tmpKey,
				Type: tmpIsIcon ? 'icon' : 'attribute',
				TooltipHandle: null,
				ClickHandler: null,
				InjectedIcon: null,
				OriginalDisplay: undefined
			};

			if (tmpEditMode)
			{
				this._wireTooltipEditMode(tmpElement, tmpKey, tmpContent, tmpIsIcon, tmpBinding, tmpModal);
			}
			else
			{
				this._wireTooltipNormalMode(tmpElement, tmpKey, tmpContent, tmpIsIcon, tmpBinding, tmpModal);
			}

			this._ActiveTooltipBindings.push(tmpBinding);
		}

		// Install document-level click delegation for help: links in tooltips
		this._installTooltipHelpLinkHandler();
	}

	/**
	 * Install a document-level click handler for help links inside tooltips.
	 *
	 * Tooltip elements are created/destroyed dynamically by the modal system,
	 * so we use event delegation on the document to catch clicks on
	 * [rel^="pict-inline-doc-help:"] links wherever they appear.
	 */
	_installTooltipHelpLinkHandler()
	{
		if (typeof document === 'undefined')
		{
			return;
		}

		// Remove existing handler if any
		if (this._tooltipHelpLinkHandler)
		{
			document.removeEventListener('click', this._tooltipHelpLinkHandler);
		}

		let tmpSelf = this;

		this._tooltipHelpLinkHandler = (pEvent) =>
		{
			let tmpTarget = pEvent.target;

			// Walk up to find the link element
			while (tmpTarget && tmpTarget !== document)
			{
				if (tmpTarget.tagName === 'A' && tmpTarget.getAttribute('rel') && tmpTarget.getAttribute('rel').indexOf('pict-inline-doc-help:') === 0)
				{
					pEvent.preventDefault();
					pEvent.stopPropagation();

					let tmpPath = tmpTarget.getAttribute('rel').replace('pict-inline-doc-help:', '');
					tmpSelf.loadDocument(tmpPath);
					return;
				}
				tmpTarget = tmpTarget.parentNode;
			}
		};

		document.addEventListener('click', this._tooltipHelpLinkHandler);
	}

	/**
	 * Wire a tooltip element for normal (non-edit) mode.
	 *
	 * @param {HTMLElement} pElement - The placeholder element
	 * @param {string} pKey - The tooltip key
	 * @param {string|null} pContent - The tooltip content (or null)
	 * @param {boolean} pIsIcon - Whether this is an icon-type placeholder
	 * @param {Object} pBinding - The binding tracking object
	 * @param {Object} pModal - The modal view instance
	 */
	_wireTooltipNormalMode(pElement, pKey, pContent, pIsIcon, pBinding, pModal)
	{
		if (pIsIcon)
		{
			if (pContent)
			{
				// Inject an icon and attach tooltip
				let tmpIcon = this._createTooltipIcon(pElement);
				pBinding.InjectedIcon = tmpIcon;

				if (pModal && pModal.richTooltip)
				{
					let tmpHTML = this._ContentProvider.parseMarkdown(pContent, this._createTooltipLinkResolver());
					pBinding.TooltipHandle = pModal.richTooltip(pElement, tmpHTML, { interactive: true, maxWidth: '350px' });
				}
			}
			else
			{
				// No content — hide the span
				pBinding.OriginalDisplay = pElement.style.display;
				pElement.style.display = 'none';
			}
		}
		else
		{
			// Attribute tooltip
			if (pContent && pModal && pModal.richTooltip)
			{
				let tmpHTML = this._ContentProvider.parseMarkdown(pContent, this._createTooltipLinkResolver());
				pBinding.TooltipHandle = pModal.richTooltip(pElement, tmpHTML, { interactive: true, maxWidth: '350px' });
			}
			// No content = do nothing, element stays as-is
		}
	}

	/**
	 * Wire a tooltip element for edit mode.
	 *
	 * @param {HTMLElement} pElement - The placeholder element
	 * @param {string} pKey - The tooltip key
	 * @param {string|null} pContent - The tooltip content (or null)
	 * @param {boolean} pIsIcon - Whether this is an icon-type placeholder
	 * @param {Object} pBinding - The binding tracking object
	 * @param {Object} pModal - The modal view instance
	 */
	_wireTooltipEditMode(pElement, pKey, pContent, pIsIcon, pBinding, pModal)
	{
		// Add edit-mode indicator class
		pElement.classList.add('pict-inline-doc-tooltip-edit-target');

		if (pIsIcon)
		{
			// Always show icon in edit mode
			let tmpIcon = this._createTooltipIcon(pElement);
			pBinding.InjectedIcon = tmpIcon;

			if (!pContent)
			{
				pElement.classList.add('pict-inline-doc-tooltip-empty');
			}
		}

		// Click handler to open editor
		let tmpSelf = this;
		let tmpClickHandler = (pEvent) =>
		{
			pEvent.preventDefault();
			pEvent.stopPropagation();
			tmpSelf._showTooltipEditor(pKey);
		};

		pElement.addEventListener('click', tmpClickHandler);
		pBinding.ClickHandler = tmpClickHandler;
	}

	/**
	 * Create and inject a tooltip icon element into a span.
	 *
	 * @param {HTMLElement} pElement - The span element to inject into
	 * @returns {HTMLElement} The created icon element
	 */
	_createTooltipIcon(pElement)
	{
		let tmpIcon = document.createElement('span');
		tmpIcon.className = 'pict-inline-doc-tooltip-icon';

		// Check for custom icon class
		let tmpCustomClass = pElement.getAttribute('data-d-tooltip-icon');
		if (tmpCustomClass && tmpCustomClass !== '')
		{
			tmpIcon.className += ' ' + tmpCustomClass;
		}
		else
		{
			tmpIcon.innerHTML = '&#x2753;';
		}

		pElement.appendChild(tmpIcon);
		return tmpIcon;
	}

	/**
	 * Show the tooltip content editor modal.
	 *
	 * @param {string} pTooltipKey - The tooltip key to edit
	 */
	_showTooltipEditor(pTooltipKey)
	{
		let tmpModal = this.pict.views['Pict-Section-Modal'];

		if (!tmpModal)
		{
			return;
		}

		let tmpCurrentContent = this.getTooltipContent(pTooltipKey) || '';
		let tmpSelf = this;

		let tmpEditorHTML = '<div class="pict-inline-doc-tm-form-group">';
		tmpEditorHTML += '<label class="pict-inline-doc-tm-form-label">Tooltip Key</label>';
		tmpEditorHTML += '<div style="font-family:monospace;font-size:0.85em;color:#8A7F72;padding:0.3em 0;">' + this._escapeTooltipHTML(pTooltipKey) + '</div>';
		tmpEditorHTML += '</div>';
		tmpEditorHTML += '<div class="pict-inline-doc-tm-form-group">';
		tmpEditorHTML += '<label class="pict-inline-doc-tm-form-label">Content (Markdown)</label>';
		tmpEditorHTML += '<textarea class="pict-inline-doc-tooltip-editor-textarea" id="InlineDoc-Tooltip-Editor-Textarea">' + this._escapeTooltipHTML(tmpCurrentContent) + '</textarea>';
		tmpEditorHTML += '</div>';
		tmpEditorHTML += '<div class="pict-inline-doc-tooltip-preview-label">Preview</div>';
		tmpEditorHTML += '<div class="pict-inline-doc-tooltip-preview" id="InlineDoc-Tooltip-Editor-Preview"></div>';

		tmpModal.show(
		{
			title: 'Edit Tooltip',
			content: tmpEditorHTML,
			closeable: true,
			width: '480px',
			buttons:
			[
				{ Hash: 'cancel', Label: 'Cancel' },
				{ Hash: 'save', Label: 'Save', Style: 'primary' }
			],
			onOpen: (pDialog) =>
			{
				let tmpTextarea = document.getElementById('InlineDoc-Tooltip-Editor-Textarea');
				let tmpPreview = document.getElementById('InlineDoc-Tooltip-Editor-Preview');

				if (tmpTextarea && tmpPreview)
				{
					// Initial preview
					let tmpLinkResolver = tmpSelf._createTooltipLinkResolver();
					let tmpInitialHTML = tmpCurrentContent ? tmpSelf._ContentProvider.parseMarkdown(tmpCurrentContent, tmpLinkResolver) : '<span style="color:#8A7F72;">No content yet.</span>';
					tmpPreview.innerHTML = tmpInitialHTML;

					// Live preview on input
					tmpTextarea.addEventListener('input', () =>
					{
						let tmpValue = tmpTextarea.value.trim();
						if (tmpValue)
						{
							tmpPreview.innerHTML = tmpSelf._ContentProvider.parseMarkdown(tmpValue, tmpLinkResolver);
						}
						else
						{
							tmpPreview.innerHTML = '<span style="color:#8A7F72;">No content yet.</span>';
						}
					});

					tmpTextarea.focus();
				}
			}
		}).then((pResult) =>
		{
			if (pResult === 'save')
			{
				let tmpTextarea = document.getElementById('InlineDoc-Tooltip-Editor-Textarea');
				let tmpNewContent = tmpTextarea ? tmpTextarea.value.trim() : '';

				tmpSelf.setTooltipContent(pTooltipKey, tmpNewContent || null);
				tmpSelf.saveTopics();
				tmpSelf.scanTooltips();

				if (tmpModal.toast)
				{
					tmpModal.toast('Tooltip saved.', { type: 'success' });
				}
			}
		});
	}

	/**
	 * Escape HTML for safe insertion into tooltip editor.
	 *
	 * @param {string} pText - Text to escape
	 * @returns {string} Escaped text
	 */
	_escapeTooltipHTML(pText)
	{
		if (!pText)
		{
			return '';
		}
		return pText
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;');
	}

	// -- Image upload --

	/**
	 * Wire the onImageUpload handler onto the markdown editor view.
	 *
	 * Overrides the editor's onImageUpload method so that when a user
	 * drops or pastes an image, it is routed through the host app's
	 * onImageUpload callback with the current document path for context.
	 *
	 * The host callback signature is:
	 *   onImageUpload(pFile, pDocumentPath, fCallback)
	 * where fCallback is fCallback(pError, pRelativeURL).
	 */
	_wireEditorImageUpload()
	{
		let tmpSelf = this;
		let tmpEditorView = this.pict.views['InlineDoc-MarkdownEditor'];

		if (!tmpEditorView)
		{
			return;
		}

		tmpEditorView.onImageUpload = (pFile, pSegmentIndex, fCallback) =>
		{
			if (typeof tmpSelf._onImageUpload !== 'function')
			{
				return false;
			}

			let tmpState = tmpSelf.pict.AppData.InlineDocumentation;
			let tmpDocumentPath = (tmpState && tmpState.EditingPath) ? tmpState.EditingPath : '';

			tmpSelf._onImageUpload(pFile, tmpDocumentPath, (pError, pURL) =>
			{
				if (pError)
				{
					tmpSelf.log.warn(`InlineDocumentation: Image upload failed: ${pError}`);
				}
				fCallback(pError, pURL);
			});

			return true;
		};
	}

	/**
	 * Scroll the content area to a heading that matches an anchor string.
	 *
	 * Looks for headings (h1-h6) in the content body whose text, when
	 * slugified, matches the anchor. Uses the standard GitHub-style
	 * slugification: lowercase, spaces to hyphens, strip non-alphanumeric.
	 *
	 * @param {string} pAnchor - The anchor string (without #)
	 */
	_scrollToAnchor(pAnchor)
	{
		if (typeof document === 'undefined' || !pAnchor)
		{
			return;
		}

		// Delay slightly to ensure content is rendered
		setTimeout(() =>
		{
			let tmpContentBody = document.getElementById('InlineDoc-Content-Body');
			if (!tmpContentBody)
			{
				return;
			}

			let tmpSlug = pAnchor.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');

			// Check for an element with a matching id first
			let tmpTarget = tmpContentBody.querySelector('#' + CSS.escape(tmpSlug));

			// If no id match, search heading text
			if (!tmpTarget)
			{
				let tmpHeadings = tmpContentBody.querySelectorAll('h1, h2, h3, h4, h5, h6');
				for (let i = 0; i < tmpHeadings.length; i++)
				{
					let tmpHeadingText = tmpHeadings[i].textContent || '';
					let tmpHeadingSlug = tmpHeadingText.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
					if (tmpHeadingSlug === tmpSlug)
					{
						tmpTarget = tmpHeadings[i];
						break;
					}
				}
			}

			if (tmpTarget)
			{
				tmpTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
			}
		}, 50);
	}

	// ================================================================
	// Full-text search
	// ================================================================

	/**
	 * Load a lunr.js keyword index from a URL.
	 *
	 * The index file is the same format generated by Indoctrinate's
	 * generate_keyword_index command: { LunrIndex, Documents, DocumentCount }.
	 *
	 * @param {string} pURL - URL to the retold-keyword-index.json file
	 * @param {Function} [fCallback] - Callback when done
	 */
	_loadSearchIndex(pURL, fCallback)
	{
		let tmpCallback = (typeof fCallback === 'function') ? fCallback : () => {};
		let tmpSelf = this;

		if (typeof fetch === 'undefined')
		{
			return tmpCallback();
		}

		fetch(pURL)
			.then((pResponse) =>
			{
				if (!pResponse.ok)
				{
					return null;
				}
				return pResponse.json();
			})
			.then((pIndexData) =>
			{
				if (!pIndexData || !pIndexData.LunrIndex || !pIndexData.Documents)
				{
					if (tmpSelf.log) tmpSelf.log.info('InlineDocumentation: No keyword index found; search unavailable.');
					return tmpCallback();
				}

				try
				{
					tmpSelf._LunrIndex = libLunr.Index.load(pIndexData.LunrIndex);
					tmpSelf._SearchDocuments = pIndexData.Documents;

					let tmpState = tmpSelf.pict.AppData.InlineDocumentation;
					if (tmpState)
					{
						tmpState.SearchIndexLoaded = true;
					}

					if (tmpSelf.log) tmpSelf.log.info('InlineDocumentation: Search index loaded (' + (pIndexData.DocumentCount || 0) + ' documents).');
				}
				catch (pError)
				{
					if (tmpSelf.log) tmpSelf.log.warn('InlineDocumentation: Error hydrating lunr index: ' + pError);
				}

				return tmpCallback();
			})
			.catch((pError) =>
			{
				if (tmpSelf.log) tmpSelf.log.warn('InlineDocumentation: Error loading search index: ' + pError);
				return tmpCallback();
			});
	}

	/**
	 * Search the loaded lunr index.
	 *
	 * @param {string} pQuery - The search query
	 * @returns {Array} Array of { Key, Title, Group, DocPath, Score }
	 */
	search(pQuery)
	{
		if (!this._LunrIndex || !this._SearchDocuments || !pQuery || !pQuery.trim())
		{
			return [];
		}

		let tmpResults = [];

		try
		{
			let tmpLunrResults = this._LunrIndex.search(pQuery);

			for (let i = 0; i < tmpLunrResults.length; i++)
			{
				let tmpRef = tmpLunrResults[i].ref;
				let tmpScore = tmpLunrResults[i].score;
				let tmpDoc = this._SearchDocuments[tmpRef];

				if (!tmpDoc)
				{
					continue;
				}

				tmpResults.push(
				{
					Key: tmpRef,
					Title: tmpDoc.Title || tmpRef,
					Group: tmpDoc.Group || '',
					Module: tmpDoc.Module || '',
					DocPath: tmpDoc.DocPath || tmpRef,
					Score: tmpScore
				});
			}
		}
		catch (pError)
		{
			if (this.log) this.log.warn('InlineDocumentation: Search error: ' + pError);
		}

		return tmpResults;
	}

	// ================================================================
	// External link resolution (catalog-based)
	// ================================================================

	/**
	 * Check if a path is an external reference.
	 *
	 * Paths that started with / in the sidebar are cross-module
	 * references. They get normalized during parsing (leading /
	 * stripped), but they contain 2+ path segments (group/module/).
	 * Simple filenames like README.md are local.
	 *
	 * An ExternalDocBaseURL must be configured for this to return true.
	 *
	 * @param {string} pPath - The normalized document path
	 * @returns {boolean}
	 */
	isExternalPath(pPath)
	{
		if (!pPath) return false;

		let tmpState = this.pict.AppData.InlineDocumentation;
		if (!tmpState || !tmpState.ExternalDocBaseURL) return false;

		// Paths with 2+ segments (e.g., pict/pict/, fable/fable/)
		// are cross-module references. Simple filenames are local.
		let tmpPath = pPath.replace(/^\.\//, '').replace(/^\//, '');
		let tmpParts = tmpPath.split('/').filter((p) => p.length > 0);
		return tmpParts.length >= 2;
	}

	/**
	 * Resolve an external path to a full URL.
	 *
	 * @param {string} pPath - The document path
	 * @returns {string|null} The external URL, or null if not external
	 */
	resolveExternalURL(pPath)
	{
		if (!this.isExternalPath(pPath)) return null;

		let tmpState = this.pict.AppData.InlineDocumentation;
		let tmpBaseURL = (tmpState && tmpState.ExternalDocBaseURL) || '';
		if (!tmpBaseURL) return null;

		let tmpPath = pPath.replace(/^\.\//, '').replace(/^\//, '');
		return tmpBaseURL + tmpPath;
	}

	/**
	 * After sidebar is loaded, mark items that are external
	 * references with External: true and ExternalURL.
	 */
	_markExternalSidebarItems()
	{
		let tmpState = this.pict.AppData.InlineDocumentation;
		if (!tmpState || !tmpState.ExternalDocBaseURL) return;

		let tmpGroups = tmpState.SidebarGroups || [];
		for (let i = 0; i < tmpGroups.length; i++)
		{
			let tmpItems = tmpGroups[i].Items || [];
			for (let j = 0; j < tmpItems.length; j++)
			{
				let tmpItem = tmpItems[j];
				if (this.isExternalPath(tmpItem.Path))
				{
					tmpItem.External = true;
					tmpItem.ExternalURL = this.resolveExternalURL(tmpItem.Path);
				}
			}
		}
	}

	/**
	 * Extract h2 and h3 headings from the rendered content body.
	 *
	 * Queries #InlineDoc-Content-Body for heading elements, extracts
	 * their text, generates slugified IDs for anchor scrolling, and
	 * stores the results in AppData for the nav outline.
	 *
	 * @returns {Array} Array of { Text, Slug, Level }
	 */
	_extractHeadings()
	{
		let tmpHeadings = [];

		if (typeof document === 'undefined')
		{
			return tmpHeadings;
		}

		let tmpContentBody = document.getElementById('InlineDoc-Content-Body');
		if (!tmpContentBody)
		{
			return tmpHeadings;
		}

		let tmpElements = tmpContentBody.querySelectorAll('h2, h3');

		for (let i = 0; i < tmpElements.length; i++)
		{
			let tmpElement = tmpElements[i];
			let tmpText = (tmpElement.textContent || '').trim();
			let tmpLevel = parseInt(tmpElement.tagName.substring(1), 10);
			let tmpSlug = tmpText.toLowerCase()
				.replace(/[^a-z0-9\s-]/g, '')
				.replace(/\s+/g, '-')
				.replace(/-+/g, '-');

			// Assign the ID to the heading element if not already set
			// so scrollIntoView can find it
			if (!tmpElement.id)
			{
				tmpElement.id = tmpSlug;
			}

			tmpHeadings.push({ Text: tmpText, Slug: tmpSlug, Level: tmpLevel });
		}

		let tmpState = this.pict.AppData.InlineDocumentation;
		if (tmpState)
		{
			tmpState.ActiveDocumentHeadings = tmpHeadings;
		}

		return tmpHeadings;
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

			// help: prefix — internal documentation link (e.g. help:book-list.md#section)
			if (pHref.match(/^help:/))
			{
				let tmpHelpPath = pHref.replace(/^help:/, '');
				return {
					href: 'javascript:void(0)',
					target: '',
					rel: 'pict-inline-doc-link:' + tmpHelpPath
				};
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
	 * Create a link resolver for tooltip content.
	 *
	 * Handles help:path.md#anchor links that open documents in the help
	 * panel. These links get a special rel attribute so click handlers
	 * can intercept them.
	 *
	 * External links open in a new tab. All other links are treated as
	 * help: links within the tooltip context.
	 *
	 * @returns {Function} A link resolver callback
	 */
	_createTooltipLinkResolver()
	{
		return (pHref, pLinkText) =>
		{
			// External links — open in new tab
			if (pHref.match(/^https?:\/\//))
			{
				return { href: pHref, target: '_blank', rel: 'noopener' };
			}

			// Strip help: prefix if present
			let tmpPath = pHref.replace(/^help:/, '');
			// Clean relative prefixes
			tmpPath = tmpPath.replace(/^\.\//, '').replace(/^\//, '');

			return {
				href: 'javascript:void(0)',
				target: '',
				rel: 'pict-inline-doc-help:' + tmpPath
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
