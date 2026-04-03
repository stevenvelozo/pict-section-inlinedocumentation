const libPictView = require('pict-view');

const _ViewConfiguration =
{
	ViewIdentifier: "InlineDoc-Nav",

	DefaultRenderable: "InlineDoc-Nav-Display",
	DefaultDestinationAddress: "#InlineDoc-Nav-Container",

	AutoRender: false,

	CSS: /*css*/`
		.pict-inline-doc-nav {
			padding: 1em 0;
		}
		.pict-inline-doc-nav-group {
			margin-bottom: 0.5em;
		}
		.pict-inline-doc-nav-group-header {
			display: flex;
			align-items: center;
			padding: 0.4em 1em;
			font-weight: 600;
			font-size: 0.85em;
			color: #5E5549;
			text-transform: uppercase;
			letter-spacing: 0.03em;
			cursor: pointer;
			user-select: none;
		}
		.pict-inline-doc-nav-group-header:hover {
			color: #3D3229;
		}
		.pict-inline-doc-nav-group-toggle {
			margin-right: 0.4em;
			font-size: 0.7em;
			transition: transform 0.15s ease;
		}
		.pict-inline-doc-nav-group.collapsed .pict-inline-doc-nav-group-toggle {
			transform: rotate(-90deg);
		}
		.pict-inline-doc-nav-group.collapsed .pict-inline-doc-nav-group-items {
			display: none;
		}
		.pict-inline-doc-nav-item {
			display: block;
			padding: 0.3em 1em 0.3em 1.8em;
			color: #5E5549;
			text-decoration: none;
			font-size: 0.9em;
			cursor: pointer;
			border-left: 3px solid transparent;
			transition: background 0.1s ease, border-color 0.1s ease;
		}
		.pict-inline-doc-nav-item:hover {
			background: #EDE8DF;
			color: #3D3229;
		}
		.pict-inline-doc-nav-item.active {
			background: #E8E3D8;
			color: #2E7D74;
			border-left-color: #2E7D74;
			font-weight: 500;
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
		/* Compact (horizontal) nav mode */
		.pict-inline-doc-compact .pict-inline-doc-nav {
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			padding: 0.4em 0.5em;
			gap: 0.2em 0;
		}
		.pict-inline-doc-compact .pict-inline-doc-nav-group {
			margin-bottom: 0;
			display: flex;
			align-items: center;
		}
		.pict-inline-doc-compact .pict-inline-doc-nav-group-header {
			padding: 0.25em 0.5em;
			font-size: 0.75em;
		}
		.pict-inline-doc-compact .pict-inline-doc-nav-group-toggle {
			display: none;
		}
		.pict-inline-doc-compact .pict-inline-doc-nav-group-items {
			display: flex !important;
			flex-wrap: wrap;
			gap: 0;
		}
		.pict-inline-doc-compact .pict-inline-doc-nav-item {
			padding: 0.25em 0.6em;
			font-size: 0.8em;
			border-left: none;
			border-bottom: 2px solid transparent;
			white-space: nowrap;
		}
		.pict-inline-doc-compact .pict-inline-doc-nav-item.active {
			border-left: none;
			border-bottom-color: #2E7D74;
		}
		.pict-inline-doc-compact .pict-inline-doc-nav-topic-badge {
			margin: 0 0.5em;
			padding: 0.2em 0.5em;
			font-size: 0.75em;
		}
		.pict-inline-doc-compact .pict-inline-doc-nav-toolbar {
			padding: 0.2em 0.5em;
			border-bottom: none;
			border-right: 1px solid #EAE3D8;
		}
		.pict-inline-doc-compact .pict-inline-doc-nav-toolbar-btn {
			width: 24px;
			height: 24px;
			font-size: 0.8em;
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
			DestinationAddress: "#InlineDoc-Nav-Container",
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

		let tmpHTML = '';
		let tmpCurrentPath = tmpState.CurrentPath || '';
		let tmpActiveTopic = tmpState.Topic;
		let tmpTopicDef = null;
		let tmpTopicDocuments = null;

		// If a topic is active, show a badge and filter documents.
		// Supports both formats:
		//   pict_documentation_topics.json: { TopicCode, TopicTitle, TopicHelpFilePath }
		//   legacy: { Name, Documents: [] }
		if (tmpActiveTopic && tmpState.Topics && tmpState.Topics[tmpActiveTopic])
		{
			tmpTopicDef = tmpState.Topics[tmpActiveTopic];

			// Determine the display name (TopicTitle or Name)
			let tmpTopicName = tmpTopicDef.TopicTitle || tmpTopicDef.Name || tmpActiveTopic;

			// Determine matching documents
			if (tmpTopicDef.TopicHelpFilePath)
			{
				// pict_documentation_topics.json format — single file per topic
				tmpTopicDocuments = [tmpTopicDef.TopicHelpFilePath];
			}
			else if (tmpTopicDef.Documents)
			{
				// Legacy format — array of document paths
				tmpTopicDocuments = tmpTopicDef.Documents;
			}
			else
			{
				tmpTopicDocuments = [];
			}

			tmpHTML += '<div class="pict-inline-doc-nav-topic-badge">'
				+ this._escapeHTML(tmpTopicName)
				+ '<span class="pict-inline-doc-nav-topic-clear" id="InlineDoc-Nav-ClearTopic">&#x2715;</span>'
				+ '</div>';
		}

		// Topic management toolbar
		if (tmpState.TopicManagerEnabled)
		{
			tmpHTML += '<div class="pict-inline-doc-nav-toolbar">';
			tmpHTML += '<button class="pict-inline-doc-nav-toolbar-btn" id="InlineDoc-Nav-ManageTopics" title="Manage Topics">&#x2699;</button>';
			if (tmpState.CurrentRoute)
			{
				tmpHTML += '<button class="pict-inline-doc-nav-toolbar-btn accent" id="InlineDoc-Nav-BindTopic" title="Bind topic to current route">&#x1F517;</button>';
			}
			let tmpTooltipEditActive = tmpState.TooltipEditMode ? ' active' : '';
			tmpHTML += '<button class="pict-inline-doc-nav-toolbar-btn' + tmpTooltipEditActive + '" id="InlineDoc-Nav-TooltipEditMode" title="Toggle tooltip edit mode">&#x1F4AC;</button>';
			tmpHTML += '<span class="pict-inline-doc-nav-toolbar-spacer"></span>';
			tmpHTML += '</div>';
		}

		let tmpGroups = tmpState.SidebarGroups || [];

		for (let i = 0; i < tmpGroups.length; i++)
		{
			let tmpGroup = tmpGroups[i];
			let tmpGroupItems = tmpGroup.Items || [];

			// If topic filter is active, only include items that match
			if (tmpTopicDocuments)
			{
				tmpGroupItems = tmpGroupItems.filter((pItem) =>
				{
					return tmpTopicDocuments.indexOf(pItem.Path) >= 0;
				});

				// Also check if the group-level path matches
				let tmpGroupMatches = tmpTopicDocuments.indexOf(tmpGroup.Path) >= 0;

				if (tmpGroupItems.length < 1 && !tmpGroupMatches)
				{
					continue;
				}
			}

			tmpHTML += '<div class="pict-inline-doc-nav-group" data-group="' + this._escapeHTML(tmpGroup.Key) + '">';
			tmpHTML += '<div class="pict-inline-doc-nav-group-header">';
			tmpHTML += '<span class="pict-inline-doc-nav-group-toggle">&#x25BC;</span>';
			tmpHTML += this._escapeHTML(tmpGroup.Name);
			tmpHTML += '</div>';

			tmpHTML += '<div class="pict-inline-doc-nav-group-items">';

			// If the group itself has a path (it's a link), show it as the first item
			if (tmpGroup.Path)
			{
				let tmpActive = (tmpCurrentPath === tmpGroup.Path) ? ' active' : '';
				tmpHTML += '<a class="pict-inline-doc-nav-item' + tmpActive
					+ '" data-doc-path="' + this._escapeHTML(tmpGroup.Path) + '">'
					+ this._escapeHTML(tmpGroup.Name)
					+ '</a>';
			}

			for (let j = 0; j < tmpGroupItems.length; j++)
			{
				let tmpItem = tmpGroupItems[j];
				if (!tmpItem.Path)
				{
					tmpHTML += '<span class="pict-inline-doc-nav-item">' + this._escapeHTML(tmpItem.Name) + '</span>';
					continue;
				}

				let tmpActive = (tmpCurrentPath === tmpItem.Path) ? ' active' : '';
				tmpHTML += '<a class="pict-inline-doc-nav-item' + tmpActive
					+ '" data-doc-path="' + this._escapeHTML(tmpItem.Path) + '">'
					+ this._escapeHTML(tmpItem.Name)
					+ '</a>';
			}

			tmpHTML += '</div>';
			tmpHTML += '</div>';
		}

		tmpContainer.innerHTML = tmpHTML;

		// Wire up click handlers
		this._wireClickHandlers(tmpContainer);
	}

	/**
	 * Wire click handlers on navigation items and group headers.
	 *
	 * @param {HTMLElement} pContainer - The nav container element
	 */
	_wireClickHandlers(pContainer)
	{
		let tmpProvider = this.pict.providers['Pict-InlineDocumentation'];

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
					tmpProvider.loadDocument(tmpPath);
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
