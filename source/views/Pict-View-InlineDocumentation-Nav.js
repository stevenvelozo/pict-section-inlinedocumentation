const libPictView = require('pict-view');

const _ViewConfiguration =
{
	ViewIdentifier: "InlineDoc-Nav",

	DefaultRenderable: "InlineDoc-Nav-Display",
	DefaultContentDestinationAddress: "#InlineDoc-Nav-Container",

	AutoRender: false,

	CSS: /*css*/`
		.pict-inline-doc-nav {
			display: flex;
			flex-direction: column;
			height: 100%;
		}
		.pict-inline-doc-nav-collapsed-header {
			display: flex;
			align-items: center;
			padding: 0.5em 0.8em;
			cursor: pointer;
			border-bottom: 1px solid #EAE3D8;
			background: #F7F5F0;
			user-select: none;
		}
		.pict-inline-doc-nav-collapsed-header:hover {
			background: #EDE8DF;
		}
		.pict-inline-doc-nav-chevron {
			font-size: 0.6em;
			transition: transform 0.2s ease;
			color: #8A7F72;
			display: inline-flex;
			align-items: center;
			margin-right: 0.5em;
		}
		.pict-inline-doc-nav-chevron.expanded {
			transform: rotate(90deg);
		}
		.pict-inline-doc-nav-current-title {
			font-size: 0.9em;
			font-weight: 500;
			color: #3D3229;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			flex: 1;
		}
		.pict-inline-doc-nav-outline {
			display: none;
			overflow-y: auto;
		}
		.pict-inline-doc-nav-outline.expanded {
			display: block;
		}
		.pict-inline-doc-nav-filter {
			padding: 0.3em 0.6em;
			border-bottom: 1px solid #EAE3D8;
		}
		.pict-inline-doc-nav-filter input {
			width: 100%;
			box-sizing: border-box;
			padding: 0.3em 0.5em;
			border: 1px solid #DDD6CA;
			border-radius: 3px;
			font-size: 0.85em;
			outline: none;
		}
		.pict-inline-doc-nav-filter input:focus {
			border-color: #2E7D74;
		}
		.pict-inline-doc-nav-group {
			margin-bottom: 0;
		}
		.pict-inline-doc-nav-group-header {
			display: flex;
			align-items: center;
			padding: 0.4em 0.8em;
			font-weight: 600;
			font-size: 0.7em;
			color: #5E5549;
			text-transform: uppercase;
			letter-spacing: 0.03em;
			cursor: pointer;
			user-select: none;
		}
		.pict-inline-doc-nav-group-header:hover {
			color: #3D3229;
			background: #F0ECE4;
		}
		.pict-inline-doc-nav-group-toggle {
			margin-right: 0.35em;
			font-size: 0.65em;
			transition: transform 0.15s ease;
			display: inline-flex;
			align-items: center;
		}
		.pict-inline-doc-nav-group-toggle.collapsed {
			transform: rotate(-90deg);
		}
		.pict-inline-doc-nav-group.collapsed .pict-inline-doc-nav-group-items {
			display: none;
		}
		.pict-inline-doc-nav-item {
			display: block;
			padding: 0.25em 0.8em 0.25em 1.6em;
			color: #5E5549;
			text-decoration: none;
			font-size: 0.85em;
			cursor: pointer;
			border-left: 3px solid transparent;
			transition: background 0.1s ease, border-color 0.1s ease;
		}
		.pict-inline-doc-nav-item:hover {
			background: #EDE8DF;
		}
		.pict-inline-doc-nav-item.active {
			background: #E8E3D8;
			color: #2E7D74;
			border-left-color: #2E7D74;
			font-weight: 500;
		}
		.pict-inline-doc-nav-heading {
			display: block;
			padding: 0.15em 0.8em 0.15em 2.4em;
			color: #8A7F72;
			font-size: 0.78em;
			cursor: pointer;
			border-left: 3px solid transparent;
			transition: background 0.1s ease, color 0.1s ease;
		}
		.pict-inline-doc-nav-heading:hover {
			background: #EDE8DF;
			color: #5E5549;
		}
		.pict-inline-doc-nav-heading.h3 {
			padding-left: 3.2em;
			font-size: 0.72em;
		}
		/* Search icon in collapsed header */
		.pict-inline-doc-nav-search-icon {
			display: inline-flex;
			align-items: center;
			color: #8A7F72;
			opacity: 0.5;
			transition: opacity 0.2s;
			flex-shrink: 0;
			margin-left: 0.3em;
		}
		.pict-inline-doc-nav-search-icon:hover {
			opacity: 1;
			color: #2E7D74;
		}
		/* Search results section */
		.pict-inline-doc-nav-search-results {
			border-bottom: 1px solid #EAE3D8;
			padding: 0.3em 0;
		}
		.pict-inline-doc-nav-search-status {
			padding: 0.2em 0.8em;
			font-size: 0.7em;
			color: #8A7F72;
			text-transform: uppercase;
			letter-spacing: 0.03em;
		}
		.pict-inline-doc-nav-search-result {
			display: flex;
			align-items: baseline;
			padding: 0.25em 0.8em 0.25em 1.2em;
			cursor: pointer;
			font-size: 0.82em;
			color: #3D3229;
			text-decoration: none;
			transition: background 0.1s ease;
			gap: 0.5em;
		}
		.pict-inline-doc-nav-search-result:hover {
			background: #EDE8DF;
		}
		.pict-inline-doc-nav-search-result-title {
			flex: 1;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		.pict-inline-doc-nav-search-result-group {
			font-size: 0.75em;
			color: #8A7F72;
			white-space: nowrap;
		}
		/* External link indicator */
		.pict-inline-doc-nav-item-external {
			color: #8A7F72;
		}
		.pict-inline-doc-nav-item-external:hover {
			color: #2E7D74;
		}
		.pict-inline-doc-nav-external-icon {
			display: inline;
			margin-left: 0.3em;
			opacity: 0.5;
			vertical-align: -0.05em;
		}
		.pict-inline-doc-nav-topic-badge {
			display: inline-block;
			margin: 0.5em 1em;
			padding: 0.3em 0.7em;
			background: #2E7D74;
			color: #fff;
			border-radius: 4px;
			font-size: 0.8em;
			font-weight: 500;
		}
		.pict-inline-doc-nav-topic-clear {
			margin-left: 0.5em;
			cursor: pointer;
			opacity: 0.8;
		}
		.pict-inline-doc-nav-topic-clear:hover {
			opacity: 1;
		}
		.pict-inline-doc-nav-toolbar {
			display: flex;
			align-items: center;
			gap: 0.3em;
			padding: 0.3em 1em;
			border-bottom: 1px solid #EAE3D8;
		}
		.pict-inline-doc-nav-toolbar-btn {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			width: 28px;
			height: 28px;
			border: 1px solid #DDD6CA;
			border-radius: 3px;
			background: #fff;
			color: #5E5549;
			font-size: 0.9em;
			cursor: pointer;
			transition: background 0.1s, border-color 0.1s;
		}
		.pict-inline-doc-nav-toolbar-btn:hover {
			background: #F0ECE4;
			border-color: #C4BDB3;
		}
		.pict-inline-doc-nav-toolbar-btn.accent {
			border-color: #2E7D74;
			color: #2E7D74;
		}
		.pict-inline-doc-nav-toolbar-btn.accent:hover {
			background: #F0F9F7;
		}
		.pict-inline-doc-nav-toolbar-btn.active {
			background: #2E7D74;
			color: #fff;
			border-color: #2E7D74;
		}
		.pict-inline-doc-nav-toolbar-btn.active:hover {
			background: #266D65;
		}
		.pict-inline-doc-nav-toolbar-spacer {
			flex: 1;
		}
	`,

	Templates:
	[
		{
			Hash: "InlineDoc-Nav-Template",
			Template: /*html*/`<div class="pict-inline-doc-nav" id="InlineDoc-Nav-Body"></div>`
		}
	],

	Renderables:
	[
		{
			RenderableHash: "InlineDoc-Nav-Display",
			TemplateHash: "InlineDoc-Nav-Template",
			ContentDestinationAddress: "#InlineDoc-Nav-Container",
			RenderMethod: "replace"
		}
	]
};

class InlineDocumentationNavView extends libPictView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
	}

	onAfterRender()
	{
		this._renderNavigation();
		return super.onAfterRender();
	}

	/**
	 * Build and inject the navigation HTML into the nav body.
	 */
	_renderNavigation()
	{
		if (typeof document === 'undefined')
		{
			return;
		}

		let tmpContainer = document.getElementById('InlineDoc-Nav-Body');
		if (!tmpContainer)
		{
			return;
		}

		let tmpState = this.pict.AppData.InlineDocumentation;
		if (!tmpState)
		{
			return;
		}

		let tmpProvider = this.pict.providers['Pict-InlineDocumentation'];
		let tmpHeadings = [];
		if (tmpProvider && typeof tmpProvider._extractHeadings === 'function')
		{
			tmpHeadings = tmpProvider._extractHeadings();
		}

		let tmpCurrentPath = tmpState.CurrentPath || '';
		let tmpIsCollapsed = tmpState.NavCollapsed !== false;
		let tmpFilterText = tmpState.NavFilterText || '';
		let tmpCurrentDocName = this._resolveCurrentDocName(tmpState, tmpCurrentPath);

		let tmpHTML = '';

		let tmpSearchQuery = tmpState.SearchQuery || '';
		let tmpSearchResults = tmpState.SearchResults || [];

		// 1. Collapsed header with search icon
		let tmpChevronClass = 'pict-inline-doc-nav-chevron' + (tmpIsCollapsed ? '' : ' expanded');
		tmpHTML += '<div class="pict-inline-doc-nav-collapsed-header">';
		tmpHTML += '<span class="' + tmpChevronClass + '" id="InlineDoc-Nav-CollapseToggle">';
		tmpHTML += '<svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6,3 11,8 6,13"/></svg>';
		tmpHTML += '</span>';
		tmpHTML += '<span class="pict-inline-doc-nav-current-title" id="InlineDoc-Nav-TitleToggle">' + this._escapeHTML(tmpCurrentDocName) + '</span>';
		tmpHTML += '<span class="pict-inline-doc-nav-search-icon" id="InlineDoc-Nav-SearchBtn" title="Search documentation">';
		tmpHTML += '<svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="7" cy="7" r="4.5"/><line x1="10.5" y1="10.5" x2="14" y2="14"/></svg>';
		tmpHTML += '</span>';
		tmpHTML += '</div>';

		// 2. Outline body
		let tmpOutlineClass = 'pict-inline-doc-nav-outline' + (tmpIsCollapsed ? '' : ' expanded');
		tmpHTML += '<div class="' + tmpOutlineClass + '" id="InlineDoc-Nav-Outline">';

		// Search / filter input
		let tmpPlaceholder = tmpState.SearchIndexLoaded ? 'Search documentation...' : 'Filter...';
		tmpHTML += '<div class="pict-inline-doc-nav-filter">';
		tmpHTML += '<input type="text" id="InlineDoc-Nav-FilterInput" placeholder="' + tmpPlaceholder + '" value="' + this._escapeHTML(tmpSearchQuery || tmpFilterText) + '" />';
		tmpHTML += '</div>';

		// Search results (when full-text search is active)
		if (tmpSearchResults.length > 0 && tmpSearchQuery)
		{
			tmpHTML += '<div class="pict-inline-doc-nav-search-results">';
			tmpHTML += '<div class="pict-inline-doc-nav-search-status">' + tmpSearchResults.length + ' result' + (tmpSearchResults.length !== 1 ? 's' : '') + '</div>';
			for (let i = 0; i < tmpSearchResults.length && i < 15; i++)
			{
				let tmpResult = tmpSearchResults[i];
				tmpHTML += '<a class="pict-inline-doc-nav-search-result" data-search-path="' + this._escapeHTML(tmpResult.DocPath) + '">';
				tmpHTML += '<span class="pict-inline-doc-nav-search-result-title">' + this._escapeHTML(tmpResult.Title) + '</span>';
				if (tmpResult.Group)
				{
					tmpHTML += '<span class="pict-inline-doc-nav-search-result-group">' + this._escapeHTML(tmpResult.Group) + '</span>';
				}
				tmpHTML += '</a>';
			}
			tmpHTML += '</div>';
		}

		// Topic badge
		tmpHTML += this._renderTopicBadge(tmpState);

		// Toolbar
		tmpHTML += this._renderToolbar(tmpState);

		// Group tree
		tmpHTML += this._renderGroupTree(tmpState, tmpCurrentPath, tmpHeadings, tmpFilterText);

		tmpHTML += '</div>';

		tmpContainer.innerHTML = tmpHTML;

		// Wire up click handlers
		this._wireClickHandlers(tmpContainer);
	}

	/**
	 * Resolve the display name for the currently loaded document.
	 *
	 * Searches SidebarGroups for a matching item name; falls back to the path.
	 *
	 * @param {object} pState - The InlineDocumentation state
	 * @param {string} pCurrentPath - The current document path
	 * @returns {string} The resolved document name
	 */
	_resolveCurrentDocName(pState, pCurrentPath)
	{
		if (!pCurrentPath)
		{
			return 'Documentation';
		}

		let tmpGroups = pState.SidebarGroups || [];

		for (let i = 0; i < tmpGroups.length; i++)
		{
			let tmpGroup = tmpGroups[i];

			// Check if the group itself matches
			if (tmpGroup.Path && tmpGroup.Path === pCurrentPath)
			{
				return tmpGroup.Name || pCurrentPath;
			}

			let tmpItems = tmpGroup.Items || [];
			for (let j = 0; j < tmpItems.length; j++)
			{
				if (tmpItems[j].Path === pCurrentPath)
				{
					return tmpItems[j].Name || pCurrentPath;
				}
			}
		}

		return pCurrentPath;
	}

	/**
	 * Render the topic badge HTML if a topic is active.
	 *
	 * @param {object} pState - The InlineDocumentation state
	 * @returns {string} HTML string for the topic badge, or empty string
	 */
	_renderTopicBadge(pState)
	{
		let tmpActiveTopic = pState.Topic;

		if (!tmpActiveTopic || !pState.Topics || !pState.Topics[tmpActiveTopic])
		{
			return '';
		}

		let tmpTopicDef = pState.Topics[tmpActiveTopic];
		let tmpTopicName = tmpTopicDef.TopicTitle || tmpTopicDef.Name || tmpActiveTopic;

		let tmpHTML = '<div class="pict-inline-doc-nav-topic-badge">'
			+ this._escapeHTML(tmpTopicName)
			+ '<span class="pict-inline-doc-nav-topic-clear" id="InlineDoc-Nav-ClearTopic">'
			+ '<svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">'
			+ '<line x1="4" y1="4" x2="12" y2="12"/><line x1="12" y1="4" x2="4" y2="12"/>'
			+ '</svg></span>'
			+ '</div>';

		return tmpHTML;
	}

	/**
	 * Render the topic management toolbar HTML.
	 *
	 * @param {object} pState - The InlineDocumentation state
	 * @returns {string} HTML string for the toolbar, or empty string
	 */
	_renderToolbar(pState)
	{
		if (!pState.TopicManagerEnabled)
		{
			return '';
		}

		let tmpHTML = '<div class="pict-inline-doc-nav-toolbar">';
		tmpHTML += '<button class="pict-inline-doc-nav-toolbar-btn" id="InlineDoc-Nav-ManageTopics" title="Manage Topics">'
			+ '<svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">'
			+ '<circle cx="8" cy="8" r="2.5"/>'
			+ '<path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41"/>'
			+ '</svg></button>';

		if (pState.CurrentRoute)
		{
			tmpHTML += '<button class="pict-inline-doc-nav-toolbar-btn accent" id="InlineDoc-Nav-BindTopic" title="Bind topic to current route">'
				+ '<svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">'
				+ '<path d="M6.5 9.5a3.5 3.5 0 005 0l2-2a3.5 3.5 0 00-5-5l-1 1"/>'
				+ '<path d="M9.5 6.5a3.5 3.5 0 00-5 0l-2 2a3.5 3.5 0 005 5l1-1"/>'
				+ '</svg></button>';
		}

		let tmpTooltipEditActive = pState.TooltipEditMode ? ' active' : '';
		tmpHTML += '<button class="pict-inline-doc-nav-toolbar-btn' + tmpTooltipEditActive + '" id="InlineDoc-Nav-TooltipEditMode" title="Toggle tooltip edit mode">'
			+ '<svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">'
			+ '<path d="M14 10a1.5 1.5 0 01-1.5 1.5H4l-3 3V3A1.5 1.5 0 012.5 1.5h10A1.5 1.5 0 0114 3z"/>'
			+ '</svg></button>';

		tmpHTML += '<span class="pict-inline-doc-nav-toolbar-spacer"></span>';
		tmpHTML += '</div>';

		return tmpHTML;
	}

	/**
	 * Build the group/item/heading tree HTML.
	 *
	 * @param {object} pState - The InlineDocumentation state
	 * @param {string} pCurrentPath - The current document path
	 * @param {Array} pHeadings - Array of { Text, Slug, Level } from _extractHeadings
	 * @param {string} pFilterText - The current filter text
	 * @returns {string} HTML string for the group tree
	 */
	_renderGroupTree(pState, pCurrentPath, pHeadings, pFilterText)
	{
		let tmpHTML = '';
		let tmpGroups = pState.SidebarGroups || [];
		let tmpActiveTopic = pState.Topic;
		let tmpTopicDocuments = null;
		let tmpFilterLower = (pFilterText || '').toLowerCase();

		// Resolve topic document filter
		if (tmpActiveTopic && pState.Topics && pState.Topics[tmpActiveTopic])
		{
			let tmpTopicDef = pState.Topics[tmpActiveTopic];

			if (tmpTopicDef.TopicHelpFilePath)
			{
				tmpTopicDocuments = [tmpTopicDef.TopicHelpFilePath];
			}
			else if (tmpTopicDef.Documents)
			{
				tmpTopicDocuments = tmpTopicDef.Documents;
			}
			else
			{
				tmpTopicDocuments = [];
			}
		}

		for (let i = 0; i < tmpGroups.length; i++)
		{
			let tmpGroup = tmpGroups[i];
			let tmpGroupItems = tmpGroup.Items || [];

			// Apply topic filter
			if (tmpTopicDocuments)
			{
				tmpGroupItems = tmpGroupItems.filter((pItem) =>
				{
					return tmpTopicDocuments.indexOf(pItem.Path) >= 0;
				});

				let tmpGroupMatches = tmpTopicDocuments.indexOf(tmpGroup.Path) >= 0;

				if (tmpGroupItems.length < 1 && !tmpGroupMatches)
				{
					continue;
				}
			}

			// Apply text filter — match item names AND headings of the active document
			if (tmpFilterLower)
			{
				tmpGroupItems = tmpGroupItems.filter((pItem) =>
				{
					if ((pItem.Name || '').toLowerCase().indexOf(tmpFilterLower) >= 0)
					{
						return true;
					}
					// For the active document, also check heading text
					if (pItem.Path === pCurrentPath && pHeadings.length > 0)
					{
						for (let h = 0; h < pHeadings.length; h++)
						{
							if ((pHeadings[h].Text || '').toLowerCase().indexOf(tmpFilterLower) >= 0)
							{
								return true;
							}
						}
					}
					return false;
				});

				let tmpGroupNameMatches = (tmpGroup.Name || '').toLowerCase().indexOf(tmpFilterLower) >= 0;

				if (tmpGroupItems.length < 1 && !tmpGroupNameMatches)
				{
					continue;
				}
			}

			let tmpGroupKey = tmpGroup.Key || tmpGroup.Name || ('group-' + i);
			let tmpIsGroupCollapsed = pState.CollapsedGroups && pState.CollapsedGroups[tmpGroupKey];
			let tmpGroupClass = 'pict-inline-doc-nav-group' + (tmpIsGroupCollapsed ? ' collapsed' : '');
			let tmpToggleClass = 'pict-inline-doc-nav-group-toggle' + (tmpIsGroupCollapsed ? ' collapsed' : '');

			tmpHTML += '<div class="' + tmpGroupClass + '" data-group="' + this._escapeHTML(tmpGroupKey) + '">';
			tmpHTML += '<div class="pict-inline-doc-nav-group-header">';
			tmpHTML += '<span class="' + tmpToggleClass + '">&#x25BC;</span>';
			tmpHTML += this._escapeHTML(tmpGroup.Name);
			tmpHTML += '</div>';

			tmpHTML += '<div class="pict-inline-doc-nav-group-items">';

			// If the group itself has a path, show it as the first item
			if (tmpGroup.Path)
			{
				let tmpActive = (pCurrentPath === tmpGroup.Path) ? ' active' : '';
				tmpHTML += '<a class="pict-inline-doc-nav-item' + tmpActive
					+ '" data-doc-path="' + this._escapeHTML(tmpGroup.Path) + '">'
					+ this._escapeHTML(tmpGroup.Name)
					+ '</a>';

				// If this is the active item, render heading sub-items
				if (pCurrentPath === tmpGroup.Path)
				{
					tmpHTML += this._renderHeadingSubItems(pHeadings, tmpFilterLower);
				}
			}

			for (let j = 0; j < tmpGroupItems.length; j++)
			{
				let tmpItem = tmpGroupItems[j];
				if (!tmpItem.Path)
				{
					tmpHTML += '<span class="pict-inline-doc-nav-item">' + this._escapeHTML(tmpItem.Name) + '</span>';
					continue;
				}

				if (tmpItem.External && tmpItem.ExternalURL)
				{
					// External link — opens in a new tab
					tmpHTML += '<a class="pict-inline-doc-nav-item pict-inline-doc-nav-item-external'
						+ '" data-external-url="' + this._escapeHTML(tmpItem.ExternalURL) + '">'
						+ this._escapeHTML(tmpItem.Name)
						+ '<svg class="pict-inline-doc-nav-external-icon" width="0.75em" height="0.75em" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1h4"/><polyline points="8,2 14,2 14,8"/><line x1="14" y1="2" x2="7" y2="9"/></svg>'
						+ '</a>';
				}
				else
				{
					let tmpActive = (pCurrentPath === tmpItem.Path) ? ' active' : '';
					tmpHTML += '<a class="pict-inline-doc-nav-item' + tmpActive
						+ '" data-doc-path="' + this._escapeHTML(tmpItem.Path) + '">'
						+ this._escapeHTML(tmpItem.Name)
						+ '</a>';

					// If this is the active item, render heading sub-items
					if (pCurrentPath === tmpItem.Path)
					{
						tmpHTML += this._renderHeadingSubItems(pHeadings, tmpFilterLower);
					}
				}
			}

			tmpHTML += '</div>';
			tmpHTML += '</div>';
		}

		return tmpHTML;
	}

	/**
	 * Render heading sub-items (h2 and h3) beneath the active nav item.
	 *
	 * @param {Array} pHeadings - Array of { Text, Slug, Level }
	 * @param {string} pFilterText - Lowercase filter text
	 * @returns {string} HTML string for heading sub-items
	 */
	_renderHeadingSubItems(pHeadings, pFilterText)
	{
		if (!pHeadings || pHeadings.length < 1)
		{
			return '';
		}

		let tmpHTML = '';

		for (let i = 0; i < pHeadings.length; i++)
		{
			let tmpHeading = pHeadings[i];
			let tmpText = tmpHeading.Text || '';

			// Apply filter
			if (pFilterText && tmpText.toLowerCase().indexOf(pFilterText) < 0)
			{
				continue;
			}

			let tmpLevelClass = (tmpHeading.Level === 3) ? ' h3' : '';
			tmpHTML += '<a class="pict-inline-doc-nav-heading' + tmpLevelClass
				+ '" data-heading-slug="' + this._escapeHTML(tmpHeading.Slug) + '">'
				+ this._escapeHTML(tmpText)
				+ '</a>';
		}

		return tmpHTML;
	}

	/**
	 * Wire click handlers on navigation items, group headers, and controls.
	 *
	 * @param {HTMLElement} pContainer - The nav container element
	 */
	_wireClickHandlers(pContainer)
	{
		let tmpProvider = this.pict.providers['Pict-InlineDocumentation'];
		let tmpState = this.pict.AppData.InlineDocumentation;

		let tmpSelf = this;

		// Collapse toggle (chevron)
		let tmpCollapseToggle = pContainer.querySelector('#InlineDoc-Nav-CollapseToggle');
		if (tmpCollapseToggle)
		{
			tmpCollapseToggle.addEventListener('click', () =>
			{
				if (tmpState)
				{
					tmpState.NavCollapsed = !tmpState.NavCollapsed;
				}
				tmpSelf._renderNavigation();
			});
		}

		// Title click also toggles
		let tmpTitleToggle = pContainer.querySelector('#InlineDoc-Nav-TitleToggle');
		if (tmpTitleToggle)
		{
			tmpTitleToggle.addEventListener('click', () =>
			{
				if (tmpState)
				{
					tmpState.NavCollapsed = !tmpState.NavCollapsed;
				}
				tmpSelf._renderNavigation();
			});
		}

		// Search icon — expands outline and focuses search input
		let tmpSearchBtn = pContainer.querySelector('#InlineDoc-Nav-SearchBtn');
		if (tmpSearchBtn)
		{
			tmpSearchBtn.addEventListener('click', (pEvent) =>
			{
				pEvent.stopPropagation();
				if (tmpState)
				{
					tmpState.NavCollapsed = false;
				}
				tmpSelf._renderNavigation();

				let tmpInput = document.getElementById('InlineDoc-Nav-FilterInput');
				if (tmpInput)
				{
					tmpInput.focus();
				}
			});
		}

		// Search / filter input
		let tmpFilterInput = pContainer.querySelector('#InlineDoc-Nav-FilterInput');
		if (tmpFilterInput)
		{
			let tmpDebounceTimer = null;

			tmpFilterInput.addEventListener('input', (pEvent) =>
			{
				let tmpValue = pEvent.target.value || '';

				if (tmpState)
				{
					tmpState.NavFilterText = tmpValue;
				}

				// If search index is loaded, debounce full-text search
				if (tmpState && tmpState.SearchIndexLoaded && tmpProvider && typeof tmpProvider.search === 'function')
				{
					if (tmpDebounceTimer) clearTimeout(tmpDebounceTimer);
					tmpDebounceTimer = setTimeout(() =>
					{
						tmpState.SearchQuery = tmpValue;
						tmpState.SearchResults = tmpValue.trim() ? tmpProvider.search(tmpValue) : [];
						tmpSelf._renderNavigation();

						let tmpNewInput = document.getElementById('InlineDoc-Nav-FilterInput');
						if (tmpNewInput)
						{
							tmpNewInput.focus();
							let tmpLen = tmpNewInput.value.length;
							tmpNewInput.setSelectionRange(tmpLen, tmpLen);
						}
					}, 250);
				}
				else
				{
					// No search index — immediate client-side filter only
					tmpSelf._renderNavigation();

					let tmpNewInput = document.getElementById('InlineDoc-Nav-FilterInput');
					if (tmpNewInput)
					{
						tmpNewInput.focus();
						let tmpLen = tmpNewInput.value.length;
						tmpNewInput.setSelectionRange(tmpLen, tmpLen);
					}
				}
			});
		}

		// Search result clicks
		let tmpSearchResults = pContainer.querySelectorAll('.pict-inline-doc-nav-search-result[data-search-path]');
		for (let i = 0; i < tmpSearchResults.length; i++)
		{
			let tmpResult = tmpSearchResults[i];
			tmpResult.addEventListener('click', (pEvent) =>
			{
				pEvent.preventDefault();
				let tmpPath = tmpResult.getAttribute('data-search-path');
				if (tmpProvider && tmpPath)
				{
					if (tmpState)
					{
						tmpState.SearchQuery = '';
						tmpState.SearchResults = [];
						tmpState.NavFilterText = '';
					}
					tmpProvider.loadDocument(tmpPath);
				}
			});
		}

		// External links — open in new tab
		let tmpExternalLinks = pContainer.querySelectorAll('[data-external-url]');
		for (let i = 0; i < tmpExternalLinks.length; i++)
		{
			let tmpExtLink = tmpExternalLinks[i];
			tmpExtLink.addEventListener('click', (pEvent) =>
			{
				pEvent.preventDefault();
				let tmpURL = tmpExtLink.getAttribute('data-external-url');
				if (tmpURL)
				{
					window.open(tmpURL, '_blank');
				}
			});
		}

		// Document links
		let tmpLinks = pContainer.querySelectorAll('.pict-inline-doc-nav-item[data-doc-path]');
		for (let i = 0; i < tmpLinks.length; i++)
		{
			let tmpLink = tmpLinks[i];
			tmpLink.addEventListener('click', (pEvent) =>
			{
				pEvent.preventDefault();
				let tmpPath = tmpLink.getAttribute('data-doc-path');
				if (tmpProvider && tmpPath)
				{
					// Clear filter when navigating
					if (tmpState)
					{
						tmpState.NavFilterText = '';
					}
					tmpProvider.loadDocument(tmpPath);
				}
			});
		}

		// Heading links
		let tmpHeadingLinks = pContainer.querySelectorAll('.pict-inline-doc-nav-heading[data-heading-slug]');
		for (let i = 0; i < tmpHeadingLinks.length; i++)
		{
			let tmpHeadingLink = tmpHeadingLinks[i];
			tmpHeadingLink.addEventListener('click', (pEvent) =>
			{
				pEvent.preventDefault();
				let tmpSlug = tmpHeadingLink.getAttribute('data-heading-slug');
				if (tmpProvider && tmpSlug)
				{
					tmpProvider._scrollToAnchor(tmpSlug);
				}
			});
		}

		// Group collapse toggle
		let tmpHeaders = pContainer.querySelectorAll('.pict-inline-doc-nav-group-header');
		for (let i = 0; i < tmpHeaders.length; i++)
		{
			let tmpHeader = tmpHeaders[i];
			tmpHeader.addEventListener('click', () =>
			{
				let tmpGroup = tmpHeader.parentElement;
				if (tmpGroup)
				{
					tmpGroup.classList.toggle('collapsed');

					// Persist collapse state
					let tmpGroupKey = tmpGroup.getAttribute('data-group');
					if (tmpState && tmpGroupKey)
					{
						if (!tmpState.CollapsedGroups)
						{
							tmpState.CollapsedGroups = {};
						}
						let tmpToggle = tmpGroup.querySelector('.pict-inline-doc-nav-group-toggle');
						if (tmpGroup.classList.contains('collapsed'))
						{
							tmpState.CollapsedGroups[tmpGroupKey] = true;
							if (tmpToggle)
							{
								tmpToggle.classList.add('collapsed');
							}
						}
						else
						{
							delete tmpState.CollapsedGroups[tmpGroupKey];
							if (tmpToggle)
							{
								tmpToggle.classList.remove('collapsed');
							}
						}
					}
				}
			});
		}

		// Topic clear button
		let tmpClearBtn = pContainer.querySelector('#InlineDoc-Nav-ClearTopic');
		if (tmpClearBtn && tmpProvider)
		{
			tmpClearBtn.addEventListener('click', (pEvent) =>
			{
				pEvent.stopPropagation();
				tmpProvider.clearTopic();
			});
		}

		// Topic manager button
		let tmpManageBtn = pContainer.querySelector('#InlineDoc-Nav-ManageTopics');
		if (tmpManageBtn)
		{
			tmpManageBtn.addEventListener('click', (pEvent) =>
			{
				pEvent.stopPropagation();
				let tmpTopicManagerView = this.pict.views['InlineDoc-TopicManager'];
				if (tmpTopicManagerView)
				{
					tmpTopicManagerView.showTopicManager();
				}
			});
		}

		// Tooltip edit mode toggle
		let tmpTooltipEditBtn = pContainer.querySelector('#InlineDoc-Nav-TooltipEditMode');
		if (tmpTooltipEditBtn)
		{
			tmpTooltipEditBtn.addEventListener('click', (pEvent) =>
			{
				pEvent.stopPropagation();
				let tmpDocProvider = this.pict.providers['Pict-InlineDocumentation'];
				if (tmpDocProvider)
				{
					let tmpCurrentState = this.pict.AppData.InlineDocumentation;
					tmpDocProvider.setTooltipEditMode(!tmpCurrentState.TooltipEditMode);
				}
			});
		}

		// Bind topic to route button
		let tmpBindBtn = pContainer.querySelector('#InlineDoc-Nav-BindTopic');
		if (tmpBindBtn)
		{
			tmpBindBtn.addEventListener('click', (pEvent) =>
			{
				pEvent.stopPropagation();
				let tmpTopicManagerView = this.pict.views['InlineDoc-TopicManager'];
				if (tmpTopicManagerView)
				{
					tmpTopicManagerView.showBindTopicToRoute();
				}
			});
		}
	}

	/**
	 * Escape HTML special characters.
	 *
	 * @param {string} pText - Text to escape
	 * @returns {string} Escaped text
	 */
	_escapeHTML(pText)
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
}

module.exports = InlineDocumentationNavView;

module.exports.default_configuration = _ViewConfiguration;
