const libPictView = require('pict-view');

const _ViewConfiguration =
{
	ViewIdentifier: "InlineDoc-TopicManager",

	AutoRender: false,

	CSS: /*css*/`
		.pict-inline-doc-tm-topic-list {
			max-height: 400px;
			overflow-y: auto;
			margin: 0 -0.5em;
		}
		.pict-inline-doc-tm-topic-item {
			display: flex;
			align-items: center;
			padding: 0.6em 0.8em;
			border-bottom: 1px solid #EAE3D8;
			cursor: pointer;
			transition: background 0.1s;
		}
		.pict-inline-doc-tm-topic-item:hover {
			background: #F5F0E8;
		}
		.pict-inline-doc-tm-topic-item:last-child {
			border-bottom: none;
		}
		.pict-inline-doc-tm-topic-info {
			flex: 1;
			min-width: 0;
		}
		.pict-inline-doc-tm-topic-title {
			font-weight: 600;
			color: #3D3229;
			font-size: 0.95em;
		}
		.pict-inline-doc-tm-topic-meta {
			font-size: 0.8em;
			color: #8A7F72;
			margin-top: 0.15em;
		}
		.pict-inline-doc-tm-topic-actions {
			display: flex;
			gap: 0.3em;
			flex-shrink: 0;
		}
		.pict-inline-doc-tm-action-btn {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			width: 28px;
			height: 28px;
			border: 1px solid #DDD6CA;
			border-radius: 3px;
			background: #fff;
			color: #5E5549;
			font-size: 0.85em;
			cursor: pointer;
			transition: background 0.1s, border-color 0.1s;
		}
		.pict-inline-doc-tm-action-btn:hover {
			background: #F0ECE4;
			border-color: #C4BDB3;
		}
		.pict-inline-doc-tm-action-btn.danger:hover {
			background: #FDE8E8;
			border-color: #E57373;
			color: #C62828;
		}
		.pict-inline-doc-tm-new-topic {
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 0.7em;
			margin-top: 0.5em;
			border: 1px dashed #DDD6CA;
			border-radius: 4px;
			color: #2E7D74;
			font-size: 0.9em;
			font-weight: 500;
			cursor: pointer;
			transition: background 0.1s, border-color 0.1s;
		}
		.pict-inline-doc-tm-new-topic:hover {
			background: #F0F9F7;
			border-color: #2E7D74;
		}
		.pict-inline-doc-tm-empty {
			text-align: center;
			padding: 2em 1em;
			color: #8A7F72;
			font-size: 0.9em;
		}
		.pict-inline-doc-tm-form-group {
			margin-bottom: 0.8em;
		}
		.pict-inline-doc-tm-form-label {
			display: block;
			font-size: 0.8em;
			font-weight: 600;
			color: #5E5549;
			text-transform: uppercase;
			letter-spacing: 0.03em;
			margin-bottom: 0.3em;
		}
		.pict-inline-doc-tm-form-input {
			width: 100%;
			padding: 0.45em 0.6em;
			font-size: 0.9em;
			color: #3D3229;
			background: #FDFCFA;
			border: 1px solid #DDD6CA;
			border-radius: 4px;
			box-sizing: border-box;
		}
		.pict-inline-doc-tm-form-input:focus {
			outline: none;
			border-color: #2E7D74;
			box-shadow: 0 0 0 2px rgba(46, 125, 116, 0.15);
		}
		.pict-inline-doc-tm-form-input[readonly] {
			background: #F5F0E8;
			color: #8A7F72;
		}
		.pict-inline-doc-tm-form-hint {
			font-size: 0.75em;
			color: #8A7F72;
			margin-top: 0.2em;
		}
		.pict-inline-doc-tm-routes-section {
			margin-top: 0.5em;
		}
		.pict-inline-doc-tm-route-chips {
			display: flex;
			flex-wrap: wrap;
			gap: 0.3em;
			margin-bottom: 0.5em;
		}
		.pict-inline-doc-tm-route-chip {
			display: inline-flex;
			align-items: center;
			padding: 0.2em 0.5em;
			background: #E8E3D8;
			border-radius: 12px;
			font-size: 0.82em;
			color: #3D3229;
			font-family: 'SFMono-Regular', 'SF Mono', 'Menlo', 'Consolas', monospace;
		}
		.pict-inline-doc-tm-route-chip-remove {
			margin-left: 0.4em;
			cursor: pointer;
			color: #8A7F72;
			font-size: 0.9em;
			line-height: 1;
		}
		.pict-inline-doc-tm-route-chip-remove:hover {
			color: #C62828;
		}
		.pict-inline-doc-tm-route-actions {
			display: flex;
			flex-wrap: wrap;
			gap: 0.3em;
		}
		.pict-inline-doc-tm-route-action-btn {
			display: inline-flex;
			align-items: center;
			padding: 0.25em 0.5em;
			border: 1px solid #DDD6CA;
			border-radius: 3px;
			background: #fff;
			color: #5E5549;
			font-size: 0.8em;
			cursor: pointer;
			transition: background 0.1s;
		}
		.pict-inline-doc-tm-route-action-btn:hover {
			background: #F0ECE4;
		}
		.pict-inline-doc-tm-route-action-btn.accent {
			border-color: #2E7D74;
			color: #2E7D74;
		}
		.pict-inline-doc-tm-route-action-btn.accent:hover {
			background: #F0F9F7;
		}
		.pict-inline-doc-tm-route-input-row {
			display: none;
			align-items: center;
			gap: 0.3em;
			margin-top: 0.4em;
		}
		.pict-inline-doc-tm-route-input-row.visible {
			display: flex;
		}
		.pict-inline-doc-tm-route-input {
			flex: 1;
			padding: 0.35em 0.5em;
			font-size: 0.85em;
			font-family: 'SFMono-Regular', 'SF Mono', 'Menlo', 'Consolas', monospace;
			color: #3D3229;
			background: #FDFCFA;
			border: 1px solid #DDD6CA;
			border-radius: 3px;
		}
		.pict-inline-doc-tm-route-input:focus {
			outline: none;
			border-color: #2E7D74;
		}
		.pict-inline-doc-tm-wc-container {
			padding: 0.5em 0;
		}
		.pict-inline-doc-tm-wc-label {
			font-size: 0.85em;
			color: #5E5549;
			margin-bottom: 0.6em;
		}
		.pict-inline-doc-tm-wc-segments {
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			gap: 0.15em;
			margin-bottom: 0.8em;
		}
		.pict-inline-doc-tm-wc-slash {
			color: #8A7F72;
			font-size: 1.1em;
			font-weight: 300;
			font-family: 'SFMono-Regular', 'SF Mono', 'Menlo', 'Consolas', monospace;
		}
		.pict-inline-doc-tm-wc-segment {
			display: inline-flex;
			align-items: center;
			padding: 0.4em 0.7em;
			border: 1px solid #DDD6CA;
			border-radius: 4px;
			background: #fff;
			color: #3D3229;
			font-family: 'SFMono-Regular', 'SF Mono', 'Menlo', 'Consolas', monospace;
			font-size: 0.9em;
			cursor: pointer;
			transition: background 0.15s, border-color 0.15s, opacity 0.15s;
			user-select: none;
		}
		.pict-inline-doc-tm-wc-segment:hover {
			border-color: #2E7D74;
			background: #F0F9F7;
		}
		.pict-inline-doc-tm-wc-segment.selected {
			background: #2E7D74;
			color: #fff;
			border-color: #2E7D74;
		}
		.pict-inline-doc-tm-wc-segment.after-wildcard {
			opacity: 0.35;
			border-style: dashed;
			cursor: default;
		}
		.pict-inline-doc-tm-wc-segment.after-wildcard:hover {
			border-color: #DDD6CA;
			background: #fff;
		}
		.pict-inline-doc-tm-wc-wildcard-star {
			display: inline-flex;
			align-items: center;
			padding: 0.4em 0.6em;
			color: #2E7D74;
			font-family: 'SFMono-Regular', 'SF Mono', 'Menlo', 'Consolas', monospace;
			font-size: 1.1em;
			font-weight: 700;
		}
		.pict-inline-doc-tm-wc-preview {
			padding: 0.5em 0.7em;
			background: #F5F0E8;
			border: 1px solid #E5DED4;
			border-radius: 4px;
			font-family: 'SFMono-Regular', 'SF Mono', 'Menlo', 'Consolas', monospace;
			font-size: 0.9em;
			color: #3D3229;
		}
		.pict-inline-doc-tm-wc-preview-label {
			font-size: 0.75em;
			color: #8A7F72;
			text-transform: uppercase;
			letter-spacing: 0.03em;
			margin-bottom: 0.3em;
		}
		.pict-inline-doc-tm-bind-route-display {
			padding: 0.5em 0.7em;
			background: #F5F0E8;
			border: 1px solid #E5DED4;
			border-radius: 4px;
			font-family: 'SFMono-Regular', 'SF Mono', 'Menlo', 'Consolas', monospace;
			font-size: 0.9em;
			color: #3D3229;
			margin-bottom: 0.8em;
		}
		.pict-inline-doc-tm-bind-topic-list {
			max-height: 250px;
			overflow-y: auto;
			margin-bottom: 0.6em;
		}
		.pict-inline-doc-tm-bind-topic-option {
			display: flex;
			align-items: center;
			padding: 0.5em 0.6em;
			border-bottom: 1px solid #EAE3D8;
			cursor: pointer;
			transition: background 0.1s;
		}
		.pict-inline-doc-tm-bind-topic-option:hover {
			background: #F5F0E8;
		}
		.pict-inline-doc-tm-bind-topic-option.selected {
			background: #F0F9F7;
		}
		.pict-inline-doc-tm-bind-radio {
			width: 16px;
			height: 16px;
			border: 2px solid #DDD6CA;
			border-radius: 50%;
			margin-right: 0.6em;
			flex-shrink: 0;
			position: relative;
		}
		.pict-inline-doc-tm-bind-topic-option.selected .pict-inline-doc-tm-bind-radio {
			border-color: #2E7D74;
		}
		.pict-inline-doc-tm-bind-topic-option.selected .pict-inline-doc-tm-bind-radio::after {
			content: '';
			position: absolute;
			top: 3px;
			left: 3px;
			width: 6px;
			height: 6px;
			background: #2E7D74;
			border-radius: 50%;
		}
		.pict-inline-doc-tm-bind-route-type {
			display: flex;
			gap: 0.5em;
			margin-bottom: 0.5em;
		}
		.pict-inline-doc-tm-bind-route-type-btn {
			flex: 1;
			padding: 0.5em;
			border: 1px solid #DDD6CA;
			border-radius: 4px;
			background: #fff;
			color: #5E5549;
			font-size: 0.85em;
			text-align: center;
			cursor: pointer;
			transition: background 0.1s, border-color 0.1s;
		}
		.pict-inline-doc-tm-bind-route-type-btn:hover {
			background: #F0ECE4;
		}
		.pict-inline-doc-tm-bind-route-type-btn.selected {
			background: #2E7D74;
			color: #fff;
			border-color: #2E7D74;
		}
		.pict-inline-doc-tm-sidebar-list {
			max-height: 300px;
			overflow-y: auto;
		}
		.pict-inline-doc-tm-sidebar-item {
			padding: 0.4em 0.6em;
			cursor: pointer;
			font-size: 0.9em;
			color: #3D3229;
			border-bottom: 1px solid #EAE3D8;
			transition: background 0.1s;
		}
		.pict-inline-doc-tm-sidebar-item:hover {
			background: #F5F0E8;
		}
		.pict-inline-doc-tm-sidebar-item .path {
			font-family: 'SFMono-Regular', 'SF Mono', 'Menlo', 'Consolas', monospace;
			font-size: 0.85em;
			color: #8A7F72;
			margin-left: 0.5em;
		}
		.pict-inline-doc-tm-validation-error {
			color: #C62828;
			font-size: 0.8em;
			margin-top: 0.3em;
		}
	`,

	Templates: [],
	Renderables: []
};

class InlineDocumentationTopicManagerView extends libPictView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
	}

	/**
	 * Get the modal view instance if available.
	 *
	 * @returns {Object|null} The PictSectionModal view, or null
	 */
	_getModal()
	{
		return this.pict.views['PictSectionModal'] || this.pict.views['Pict-Section-Modal'] || null;
	}

	/**
	 * Get the inline documentation provider.
	 *
	 * @returns {Object|null} The provider instance
	 */
	_getProvider()
	{
		return this.pict.providers['Pict-InlineDocumentation'] || null;
	}

	// -- Topic List --

	/**
	 * Show the topic manager modal with the full topic list.
	 */
	showTopicManager()
	{
		let tmpModal = this._getModal();
		let tmpProvider = this._getProvider();

		if (!tmpModal)
		{
			this.log.warn('InlineDocumentation TopicManager: Pict-Section-Modal view is not registered.');
			return;
		}

		if (!tmpProvider)
		{
			return;
		}

		let tmpTopics = tmpProvider.getTopicList();
		let tmpContent = this._buildTopicListHTML(tmpTopics);

		tmpModal.show(
		{
			title: 'Manage Topics',
			content: tmpContent,
			closeable: true,
			width: '520px',
			buttons:
			[
				{ Hash: 'close', Label: 'Close', Style: 'primary' }
			],
			onOpen: (pDialog) =>
			{
				this._wireTopicListHandlers(pDialog);
			}
		});
	}

	/**
	 * Build the HTML for the topic list modal.
	 *
	 * @param {Array} pTopics - Array from getTopicList()
	 * @returns {string} HTML content
	 */
	_buildTopicListHTML(pTopics)
	{
		if (!pTopics || pTopics.length < 1)
		{
			return '<div class="pict-inline-doc-tm-empty">No topics defined yet.</div>'
				+ '<div class="pict-inline-doc-tm-new-topic" data-action="new-topic">+ New Topic</div>';
		}

		let tmpHTML = '<div class="pict-inline-doc-tm-topic-list">';

		for (let i = 0; i < pTopics.length; i++)
		{
			let tmpTopic = pTopics[i];
			tmpHTML += '<div class="pict-inline-doc-tm-topic-item" data-topic-code="' + this._escapeHTML(tmpTopic.TopicCode) + '">';
			tmpHTML += '<div class="pict-inline-doc-tm-topic-info">';
			tmpHTML += '<div class="pict-inline-doc-tm-topic-title">' + this._escapeHTML(tmpTopic.TopicTitle) + '</div>';
			tmpHTML += '<div class="pict-inline-doc-tm-topic-meta">';
			tmpHTML += this._escapeHTML(tmpTopic.TopicCode);
			if (tmpTopic.TopicHelpFilePath)
			{
				tmpHTML += ' &middot; ' + this._escapeHTML(tmpTopic.TopicHelpFilePath);
			}
			tmpHTML += ' &middot; ' + tmpTopic.RouteCount + ' route' + (tmpTopic.RouteCount !== 1 ? 's' : '');
			tmpHTML += '</div>';
			tmpHTML += '</div>';
			tmpHTML += '<div class="pict-inline-doc-tm-topic-actions">';
			tmpHTML += '<button class="pict-inline-doc-tm-action-btn" data-action="edit" data-topic-code="' + this._escapeHTML(tmpTopic.TopicCode) + '" title="Edit">&#x270E;</button>';
			tmpHTML += '<button class="pict-inline-doc-tm-action-btn danger" data-action="delete" data-topic-code="' + this._escapeHTML(tmpTopic.TopicCode) + '" title="Delete">&#x2715;</button>';
			tmpHTML += '</div>';
			tmpHTML += '</div>';
		}

		tmpHTML += '</div>';
		tmpHTML += '<div class="pict-inline-doc-tm-new-topic" data-action="new-topic">+ New Topic</div>';

		return tmpHTML;
	}

	/**
	 * Wire click handlers for the topic list modal.
	 *
	 * @param {HTMLElement} pDialog - The modal dialog element
	 */
	_wireTopicListHandlers(pDialog)
	{
		let tmpSelf = this;
		let tmpModal = this._getModal();
		let tmpProvider = this._getProvider();

		// Edit buttons
		let tmpEditBtns = pDialog.querySelectorAll('[data-action="edit"]');
		for (let i = 0; i < tmpEditBtns.length; i++)
		{
			tmpEditBtns[i].addEventListener('click', (pEvent) =>
			{
				pEvent.stopPropagation();
				let tmpCode = tmpEditBtns[i].getAttribute('data-topic-code');
				// Dismiss the list modal, then open editor
				if (tmpModal && tmpModal.dismissModals)
				{
					tmpModal.dismissModals();
				}
				setTimeout(() => { tmpSelf.showTopicEditor(tmpCode); }, 250);
			});
		}

		// Delete buttons
		let tmpDeleteBtns = pDialog.querySelectorAll('[data-action="delete"]');
		for (let i = 0; i < tmpDeleteBtns.length; i++)
		{
			tmpDeleteBtns[i].addEventListener('click', (pEvent) =>
			{
				pEvent.stopPropagation();
				let tmpCode = tmpDeleteBtns[i].getAttribute('data-topic-code');

				if (tmpModal && tmpModal.confirm)
				{
					tmpModal.confirm(
						'Are you sure you want to delete the topic "' + tmpCode + '"?',
						{ title: 'Delete Topic', dangerous: true }
					).then((pConfirmed) =>
					{
						if (pConfirmed && tmpProvider)
						{
							tmpProvider.removeTopic(tmpCode);
							tmpProvider.saveTopics();

							// Re-render nav
							let tmpNavView = tmpSelf.pict.views['InlineDoc-Nav'];
							if (tmpNavView)
							{
								tmpNavView.render();
							}

							if (tmpModal.toast)
							{
								tmpModal.toast('Topic deleted.', { type: 'success' });
							}

							// Re-open the list
							setTimeout(() => { tmpSelf.showTopicManager(); }, 250);
						}
					});
				}
			});
		}

		// New topic button
		let tmpNewBtn = pDialog.querySelector('[data-action="new-topic"]');
		if (tmpNewBtn)
		{
			tmpNewBtn.addEventListener('click', () =>
			{
				if (tmpModal && tmpModal.dismissModals)
				{
					tmpModal.dismissModals();
				}
				setTimeout(() => { tmpSelf.showTopicEditor(null); }, 250);
			});
		}
	}

	// -- Topic Editor --

	/**
	 * Show the topic editor modal for creating or editing a topic.
	 *
	 * @param {string|null} pTopicCode - Topic code to edit, or null for new
	 */
	showTopicEditor(pTopicCode)
	{
		let tmpModal = this._getModal();
		let tmpProvider = this._getProvider();

		if (!tmpModal || !tmpProvider)
		{
			return;
		}

		let tmpState = this.pict.AppData.InlineDocumentation;
		let tmpIsNew = !pTopicCode;
		let tmpTopic = null;

		if (pTopicCode && tmpState.Topics && tmpState.Topics[pTopicCode])
		{
			// Clone for editing
			tmpTopic = JSON.parse(JSON.stringify(tmpState.Topics[pTopicCode]));
		}
		else
		{
			tmpTopic =
			{
				TopicCode: '',
				TopicTitle: '',
				TopicHelpFilePath: '',
				Routes: []
			};
		}

		let tmpContent = this._buildTopicEditorHTML(tmpTopic, tmpIsNew);

		// Track editor routes state in closure
		let tmpEditorRoutes = tmpTopic.Routes ? tmpTopic.Routes.slice() : [];

		tmpModal.show(
		{
			title: tmpIsNew ? 'New Topic' : 'Edit Topic',
			content: tmpContent,
			closeable: true,
			width: '500px',
			buttons:
			[
				{ Hash: 'cancel', Label: 'Cancel' },
				{ Hash: 'save', Label: 'Save', Style: 'primary' }
			],
			onOpen: (pDialog) =>
			{
				this._wireTopicEditorHandlers(pDialog, tmpTopic, tmpIsNew, tmpEditorRoutes);
			}
		}).then((pResult) =>
		{
			if (pResult === 'save')
			{
				this._handleTopicEditorSave(tmpTopic, tmpIsNew, tmpEditorRoutes);
			}
			else
			{
				// Return to list on cancel
				setTimeout(() => { this.showTopicManager(); }, 250);
			}
		});
	}

	/**
	 * Build the HTML for the topic editor form.
	 *
	 * @param {Object} pTopic - The topic data
	 * @param {boolean} pIsNew - Whether this is a new topic
	 * @returns {string} HTML content
	 */
	_buildTopicEditorHTML(pTopic, pIsNew)
	{
		let tmpHTML = '';

		// Topic Code
		tmpHTML += '<div class="pict-inline-doc-tm-form-group">';
		tmpHTML += '<label class="pict-inline-doc-tm-form-label">Topic Code</label>';
		if (pIsNew)
		{
			tmpHTML += '<input type="text" class="pict-inline-doc-tm-form-input" id="tm-editor-code" value="" placeholder="MY-TOPIC-CODE" />';
			tmpHTML += '<div class="pict-inline-doc-tm-form-hint">Uppercase letters, numbers, and hyphens only.</div>';
		}
		else
		{
			tmpHTML += '<input type="text" class="pict-inline-doc-tm-form-input" id="tm-editor-code" value="' + this._escapeHTML(pTopic.TopicCode) + '" readonly />';
		}
		tmpHTML += '<div class="pict-inline-doc-tm-validation-error" id="tm-editor-code-error"></div>';
		tmpHTML += '</div>';

		// Topic Title
		tmpHTML += '<div class="pict-inline-doc-tm-form-group">';
		tmpHTML += '<label class="pict-inline-doc-tm-form-label">Title</label>';
		tmpHTML += '<input type="text" class="pict-inline-doc-tm-form-input" id="tm-editor-title" value="' + this._escapeHTML(pTopic.TopicTitle || pTopic.Name || '') + '" placeholder="My Topic Title" />';
		tmpHTML += '<div class="pict-inline-doc-tm-validation-error" id="tm-editor-title-error"></div>';
		tmpHTML += '</div>';

		// Help File Path
		tmpHTML += '<div class="pict-inline-doc-tm-form-group">';
		tmpHTML += '<label class="pict-inline-doc-tm-form-label">Help Document</label>';
		tmpHTML += '<div style="display:flex;gap:0.3em;align-items:center;">';
		tmpHTML += '<input type="text" class="pict-inline-doc-tm-form-input" id="tm-editor-helpfile" value="' + this._escapeHTML(pTopic.TopicHelpFilePath || '') + '" placeholder="help-topic.md" style="flex:1;" />';
		tmpHTML += '<button class="pict-inline-doc-tm-route-action-btn" id="tm-editor-browse-sidebar" title="Browse sidebar documents">Browse</button>';
		tmpHTML += '</div>';
		tmpHTML += '</div>';

		// Routes
		tmpHTML += '<div class="pict-inline-doc-tm-form-group">';
		tmpHTML += '<label class="pict-inline-doc-tm-form-label">Routes</label>';
		tmpHTML += '<div class="pict-inline-doc-tm-routes-section">';
		tmpHTML += '<div class="pict-inline-doc-tm-route-chips" id="tm-editor-route-chips">';
		tmpHTML += this._buildRouteChipsHTML(pTopic.Routes || []);
		tmpHTML += '</div>';
		tmpHTML += '<div class="pict-inline-doc-tm-route-actions">';
		tmpHTML += '<button class="pict-inline-doc-tm-route-action-btn" id="tm-editor-add-route">+ Add Route</button>';

		let tmpState = this.pict.AppData.InlineDocumentation;
		if (tmpState && tmpState.CurrentRoute)
		{
			tmpHTML += '<button class="pict-inline-doc-tm-route-action-btn accent" id="tm-editor-add-current-route">+ Current Route</button>';
			tmpHTML += '<button class="pict-inline-doc-tm-route-action-btn accent" id="tm-editor-build-wildcard">Build Wildcard</button>';
		}

		tmpHTML += '</div>';
		tmpHTML += '<div class="pict-inline-doc-tm-route-input-row" id="tm-editor-route-input-row">';
		tmpHTML += '<input type="text" class="pict-inline-doc-tm-route-input" id="tm-editor-route-input" placeholder="/my/route" />';
		tmpHTML += '<button class="pict-inline-doc-tm-route-action-btn accent" id="tm-editor-route-input-add">Add</button>';
		tmpHTML += '</div>';
		tmpHTML += '</div>';
		tmpHTML += '</div>';

		return tmpHTML;
	}

	/**
	 * Build HTML for route chips.
	 *
	 * @param {Array} pRoutes - Array of route pattern strings
	 * @returns {string} HTML for the chips
	 */
	_buildRouteChipsHTML(pRoutes)
	{
		if (!pRoutes || pRoutes.length < 1)
		{
			return '<span style="font-size:0.8em;color:#8A7F72;">No routes bound.</span>';
		}

		let tmpHTML = '';
		for (let i = 0; i < pRoutes.length; i++)
		{
			tmpHTML += '<span class="pict-inline-doc-tm-route-chip">';
			tmpHTML += this._escapeHTML(pRoutes[i]);
			tmpHTML += '<span class="pict-inline-doc-tm-route-chip-remove" data-route="' + this._escapeHTML(pRoutes[i]) + '">&times;</span>';
			tmpHTML += '</span>';
		}
		return tmpHTML;
	}

	/**
	 * Refresh the route chips in an open editor dialog.
	 *
	 * @param {Array} pRoutes - Current routes array
	 */
	_refreshRouteChips(pRoutes)
	{
		if (typeof document === 'undefined')
		{
			return;
		}

		let tmpContainer = document.getElementById('tm-editor-route-chips');
		if (tmpContainer)
		{
			tmpContainer.innerHTML = this._buildRouteChipsHTML(pRoutes);
			this._wireRouteChipRemoveHandlers(pRoutes);
		}
	}

	/**
	 * Wire remove handlers on route chips.
	 *
	 * @param {Array} pRoutes - The mutable routes array
	 */
	_wireRouteChipRemoveHandlers(pRoutes)
	{
		if (typeof document === 'undefined')
		{
			return;
		}

		let tmpSelf = this;
		let tmpRemoveBtns = document.querySelectorAll('.pict-inline-doc-tm-route-chip-remove');
		for (let i = 0; i < tmpRemoveBtns.length; i++)
		{
			tmpRemoveBtns[i].addEventListener('click', (pEvent) =>
			{
				pEvent.stopPropagation();
				let tmpRoute = tmpRemoveBtns[i].getAttribute('data-route');
				let tmpIdx = pRoutes.indexOf(tmpRoute);
				if (tmpIdx >= 0)
				{
					pRoutes.splice(tmpIdx, 1);
				}
				tmpSelf._refreshRouteChips(pRoutes);
			});
		}
	}

	/**
	 * Wire all handlers for the topic editor form.
	 *
	 * @param {HTMLElement} pDialog - The modal dialog element
	 * @param {Object} pTopic - The topic data
	 * @param {boolean} pIsNew - Whether this is a new topic
	 * @param {Array} pEditorRoutes - Mutable routes array for this editor session
	 */
	_wireTopicEditorHandlers(pDialog, pTopic, pIsNew, pEditorRoutes)
	{
		let tmpSelf = this;
		let tmpProvider = this._getProvider();
		let tmpState = this.pict.AppData.InlineDocumentation;

		// Route chip remove handlers
		this._wireRouteChipRemoveHandlers(pEditorRoutes);

		// Add Route button — show input row
		let tmpAddRouteBtn = document.getElementById('tm-editor-add-route');
		if (tmpAddRouteBtn)
		{
			tmpAddRouteBtn.addEventListener('click', () =>
			{
				let tmpRow = document.getElementById('tm-editor-route-input-row');
				if (tmpRow)
				{
					tmpRow.classList.toggle('visible');
					let tmpInput = document.getElementById('tm-editor-route-input');
					if (tmpInput)
					{
						tmpInput.focus();
					}
				}
			});
		}

		// Add route from text input
		let tmpRouteInputAddBtn = document.getElementById('tm-editor-route-input-add');
		if (tmpRouteInputAddBtn)
		{
			tmpRouteInputAddBtn.addEventListener('click', () =>
			{
				let tmpInput = document.getElementById('tm-editor-route-input');
				if (tmpInput && tmpInput.value.trim())
				{
					let tmpRoute = tmpInput.value.trim();
					if (tmpRoute.charAt(0) !== '/')
					{
						tmpRoute = '/' + tmpRoute;
					}
					if (pEditorRoutes.indexOf(tmpRoute) < 0)
					{
						pEditorRoutes.push(tmpRoute);
						tmpSelf._refreshRouteChips(pEditorRoutes);
					}
					tmpInput.value = '';
				}
			});
		}

		// Enter key on route input
		let tmpRouteInput = document.getElementById('tm-editor-route-input');
		if (tmpRouteInput)
		{
			tmpRouteInput.addEventListener('keydown', (pEvent) =>
			{
				if (pEvent.key === 'Enter')
				{
					pEvent.preventDefault();
					if (tmpRouteInputAddBtn)
					{
						tmpRouteInputAddBtn.click();
					}
				}
			});
		}

		// Add Current Route button
		let tmpAddCurrentBtn = document.getElementById('tm-editor-add-current-route');
		if (tmpAddCurrentBtn && tmpState && tmpState.CurrentRoute)
		{
			tmpAddCurrentBtn.addEventListener('click', () =>
			{
				let tmpRoute = tmpState.CurrentRoute;
				if (pEditorRoutes.indexOf(tmpRoute) < 0)
				{
					pEditorRoutes.push(tmpRoute);
					tmpSelf._refreshRouteChips(pEditorRoutes);
				}
			});
		}

		// Build Wildcard button
		let tmpWildcardBtn = document.getElementById('tm-editor-build-wildcard');
		if (tmpWildcardBtn && tmpProvider && tmpState && tmpState.CurrentRoute)
		{
			tmpWildcardBtn.addEventListener('click', () =>
			{
				let tmpModal = tmpSelf._getModal();
				if (tmpModal && tmpModal.dismissModals)
				{
					tmpModal.dismissModals();
				}
				setTimeout(() =>
				{
					tmpSelf.showWildcardBuilder(tmpState.CurrentRoute, (pPattern) =>
					{
						if (pPattern && pEditorRoutes.indexOf(pPattern) < 0)
						{
							pEditorRoutes.push(pPattern);
						}
						// Re-open the editor
						tmpSelf._reopenEditorAfterSubflow(pTopic, pIsNew, pEditorRoutes);
					});
				}, 250);
			});
		}

		// Browse Sidebar button
		let tmpBrowseBtn = document.getElementById('tm-editor-browse-sidebar');
		if (tmpBrowseBtn)
		{
			tmpBrowseBtn.addEventListener('click', () =>
			{
				let tmpModal = tmpSelf._getModal();
				if (tmpModal && tmpModal.dismissModals)
				{
					tmpModal.dismissModals();
				}
				setTimeout(() =>
				{
					tmpSelf._showSidebarPicker((pPath) =>
					{
						if (pPath)
						{
							pTopic.TopicHelpFilePath = pPath;
						}
						tmpSelf._reopenEditorAfterSubflow(pTopic, pIsNew, pEditorRoutes);
					});
				}, 250);
			});
		}
	}

	/**
	 * Re-open the topic editor after returning from a sub-flow (wildcard builder, sidebar picker).
	 *
	 * Captures current form values from the DOM before the modal was dismissed,
	 * then reconstructs the editor with updated state.
	 *
	 * @param {Object} pTopic - The topic data (may have been updated by sub-flow)
	 * @param {boolean} pIsNew - Whether this is a new topic
	 * @param {Array} pEditorRoutes - Current routes for this editor session
	 */
	_reopenEditorAfterSubflow(pTopic, pIsNew, pEditorRoutes)
	{
		let tmpModal = this._getModal();
		let tmpProvider = this._getProvider();

		if (!tmpModal || !tmpProvider)
		{
			return;
		}

		// Rebuild the topic from whatever was captured
		let tmpContent = this._buildTopicEditorHTML(
		{
			TopicCode: pTopic.TopicCode,
			TopicTitle: pTopic.TopicTitle,
			TopicHelpFilePath: pTopic.TopicHelpFilePath,
			Routes: pEditorRoutes
		}, pIsNew);

		tmpModal.show(
		{
			title: pIsNew ? 'New Topic' : 'Edit Topic',
			content: tmpContent,
			closeable: true,
			width: '500px',
			buttons:
			[
				{ Hash: 'cancel', Label: 'Cancel' },
				{ Hash: 'save', Label: 'Save', Style: 'primary' }
			],
			onOpen: (pDialog) =>
			{
				this._wireTopicEditorHandlers(pDialog, pTopic, pIsNew, pEditorRoutes);
			}
		}).then((pResult) =>
		{
			if (pResult === 'save')
			{
				this._handleTopicEditorSave(pTopic, pIsNew, pEditorRoutes);
			}
			else
			{
				setTimeout(() => { this.showTopicManager(); }, 250);
			}
		});
	}

	/**
	 * Handle saving from the topic editor.
	 *
	 * Reads form values, validates, and persists.
	 *
	 * @param {Object} pTopic - The original topic data
	 * @param {boolean} pIsNew - Whether this is a new topic
	 * @param {Array} pEditorRoutes - Current routes from the editor
	 */
	_handleTopicEditorSave(pTopic, pIsNew, pEditorRoutes)
	{
		let tmpProvider = this._getProvider();
		let tmpModal = this._getModal();
		let tmpState = this.pict.AppData.InlineDocumentation;

		if (!tmpProvider)
		{
			return;
		}

		// Read form values from DOM (they're still present briefly during dismiss)
		let tmpCode = '';
		let tmpTitle = '';
		let tmpHelpFile = '';

		if (typeof document !== 'undefined')
		{
			let tmpCodeInput = document.getElementById('tm-editor-code');
			let tmpTitleInput = document.getElementById('tm-editor-title');
			let tmpHelpInput = document.getElementById('tm-editor-helpfile');

			if (tmpCodeInput) { tmpCode = tmpCodeInput.value.trim(); }
			if (tmpTitleInput) { tmpTitle = tmpTitleInput.value.trim(); }
			if (tmpHelpInput) { tmpHelpFile = tmpHelpInput.value.trim(); }
		}

		// Validation
		let tmpErrors = [];

		if (pIsNew)
		{
			if (!tmpCode)
			{
				tmpErrors.push('Topic Code is required.');
			}
			else if (!/^[A-Z0-9][A-Z0-9-]*$/.test(tmpCode))
			{
				tmpErrors.push('Topic Code must use uppercase letters, numbers, and hyphens only.');
			}
			else if (tmpState.Topics && tmpState.Topics[tmpCode])
			{
				tmpErrors.push('A topic with code "' + tmpCode + '" already exists.');
			}
		}
		else
		{
			tmpCode = pTopic.TopicCode;
		}

		if (!tmpTitle)
		{
			tmpErrors.push('Title is required.');
		}

		if (tmpErrors.length > 0)
		{
			if (tmpModal && tmpModal.toast)
			{
				tmpModal.toast(tmpErrors.join(' '), { type: 'error' });
			}
			// Re-open editor with current values
			pTopic.TopicTitle = tmpTitle;
			pTopic.TopicHelpFilePath = tmpHelpFile;
			if (pIsNew)
			{
				pTopic.TopicCode = tmpCode;
			}
			setTimeout(() => { this._reopenEditorAfterSubflow(pTopic, pIsNew, pEditorRoutes); }, 300);
			return;
		}

		// Apply changes
		if (pIsNew)
		{
			tmpProvider.addTopic(tmpCode,
			{
				TopicCode: tmpCode,
				TopicTitle: tmpTitle,
				TopicHelpFilePath: tmpHelpFile,
				Routes: pEditorRoutes
			});
		}
		else
		{
			tmpProvider.updateTopic(tmpCode,
			{
				TopicTitle: tmpTitle,
				TopicHelpFilePath: tmpHelpFile,
				Routes: pEditorRoutes
			});
		}

		tmpProvider.saveTopics();

		// Re-render nav
		let tmpNavView = this.pict.views['InlineDoc-Nav'];
		if (tmpNavView)
		{
			tmpNavView.render();
		}

		if (tmpModal && tmpModal.toast)
		{
			tmpModal.toast('Topic saved.', { type: 'success' });
		}

		// Return to topic list
		setTimeout(() => { this.showTopicManager(); }, 300);
	}

	// -- Wildcard Builder --

	/**
	 * Show the wildcard builder modal.
	 *
	 * Displays route segments as clickable blocks and lets the user
	 * visually choose where the wildcard starts.
	 *
	 * @param {string} pCurrentRoute - The route to build a pattern for
	 * @param {Function} fOnSelect - Callback receiving the selected pattern (or null on cancel)
	 */
	showWildcardBuilder(pCurrentRoute, fOnSelect)
	{
		let tmpModal = this._getModal();
		let tmpProvider = this._getProvider();

		if (!tmpModal || !tmpProvider)
		{
			if (typeof fOnSelect === 'function') { fOnSelect(null); }
			return;
		}

		let tmpSegments = tmpProvider.getRouteSegments(pCurrentRoute);

		if (tmpSegments.length < 1)
		{
			if (tmpModal.toast)
			{
				tmpModal.toast('No route segments to build a wildcard from.', { type: 'error' });
			}
			if (typeof fOnSelect === 'function') { fOnSelect(null); }
			return;
		}

		// Default selection: last segment before end (or first if only one)
		let tmpSelectedIndex = Math.max(0, tmpSegments.length - 2);
		let tmpContent = this._buildWildcardBuilderHTML(tmpSegments, pCurrentRoute, tmpSelectedIndex);

		tmpModal.show(
		{
			title: 'Build Wildcard Pattern',
			content: tmpContent,
			closeable: true,
			width: '520px',
			buttons:
			[
				{ Hash: 'cancel', Label: 'Cancel' },
				{ Hash: 'exact', Label: 'Use Exact Route' },
				{ Hash: 'pattern', Label: 'Use Pattern', Style: 'primary' }
			],
			onOpen: (pDialog) =>
			{
				this._wireWildcardBuilderHandlers(pDialog, tmpSegments, tmpSelectedIndex);
			}
		}).then((pResult) =>
		{
			if (pResult === 'pattern')
			{
				// Get the current selection
				let tmpPreview = (typeof document !== 'undefined') ? document.getElementById('tm-wc-preview-value') : null;
				let tmpPattern = tmpPreview ? tmpPreview.textContent : tmpSegments[tmpSelectedIndex].WildcardPattern;
				if (typeof fOnSelect === 'function') { fOnSelect(tmpPattern); }
			}
			else if (pResult === 'exact')
			{
				if (typeof fOnSelect === 'function') { fOnSelect(pCurrentRoute); }
			}
			else
			{
				if (typeof fOnSelect === 'function') { fOnSelect(null); }
			}
		});
	}

	/**
	 * Build the HTML for the wildcard builder.
	 *
	 * @param {Array} pSegments - Segment objects from getRouteSegments()
	 * @param {string} pCurrentRoute - The original route
	 * @param {number} pSelectedIndex - The initially selected segment index
	 * @returns {string} HTML content
	 */
	_buildWildcardBuilderHTML(pSegments, pCurrentRoute, pSelectedIndex)
	{
		let tmpHTML = '<div class="pict-inline-doc-tm-wc-container">';

		tmpHTML += '<div class="pict-inline-doc-tm-wc-label">Click a segment to set the wildcard boundary. Everything after the selected segment will match any path.</div>';

		tmpHTML += '<div class="pict-inline-doc-tm-wc-segments" id="tm-wc-segments">';

		for (let i = 0; i < pSegments.length; i++)
		{
			let tmpClass = 'pict-inline-doc-tm-wc-segment';
			if (i === pSelectedIndex)
			{
				tmpClass += ' selected';
			}
			else if (i > pSelectedIndex)
			{
				tmpClass += ' after-wildcard';
			}

			tmpHTML += '<span class="pict-inline-doc-tm-wc-slash">/</span>';
			tmpHTML += '<span class="' + tmpClass + '" data-segment-index="' + i + '">';
			tmpHTML += this._escapeHTML(pSegments[i].Segment);
			tmpHTML += '</span>';
		}

		tmpHTML += '<span class="pict-inline-doc-tm-wc-slash">/</span>';
		tmpHTML += '<span class="pict-inline-doc-tm-wc-wildcard-star" id="tm-wc-star">*</span>';

		tmpHTML += '</div>';

		tmpHTML += '<div class="pict-inline-doc-tm-wc-preview-label">Pattern</div>';
		tmpHTML += '<div class="pict-inline-doc-tm-wc-preview" id="tm-wc-preview-value">';
		tmpHTML += this._escapeHTML(pSegments[pSelectedIndex].WildcardPattern);
		tmpHTML += '</div>';

		tmpHTML += '</div>';

		return tmpHTML;
	}

	/**
	 * Wire click handlers for the wildcard builder segments.
	 *
	 * @param {HTMLElement} pDialog - The modal dialog element
	 * @param {Array} pSegments - Segment objects
	 * @param {number} pInitialIndex - Initially selected index
	 */
	_wireWildcardBuilderHandlers(pDialog, pSegments, pInitialIndex)
	{
		let tmpSelectedIndex = pInitialIndex;

		let tmpUpdateSelection = (pNewIndex) =>
		{
			tmpSelectedIndex = pNewIndex;
			let tmpSegmentEls = pDialog.querySelectorAll('.pict-inline-doc-tm-wc-segment');
			for (let i = 0; i < tmpSegmentEls.length; i++)
			{
				let tmpIdx = parseInt(tmpSegmentEls[i].getAttribute('data-segment-index'), 10);
				tmpSegmentEls[i].classList.remove('selected', 'after-wildcard');
				if (tmpIdx === pNewIndex)
				{
					tmpSegmentEls[i].classList.add('selected');
				}
				else if (tmpIdx > pNewIndex)
				{
					tmpSegmentEls[i].classList.add('after-wildcard');
				}
			}

			let tmpPreview = pDialog.querySelector('#tm-wc-preview-value');
			if (tmpPreview)
			{
				tmpPreview.textContent = pSegments[pNewIndex].WildcardPattern;
			}
		};

		let tmpSegmentEls = pDialog.querySelectorAll('.pict-inline-doc-tm-wc-segment');
		for (let i = 0; i < tmpSegmentEls.length; i++)
		{
			tmpSegmentEls[i].addEventListener('click', () =>
			{
				let tmpIdx = parseInt(tmpSegmentEls[i].getAttribute('data-segment-index'), 10);
				tmpUpdateSelection(tmpIdx);
			});
		}
	}

	// -- Bind Topic to Route --

	/**
	 * Show the quick-bind flow for connecting a topic to the current route.
	 */
	showBindTopicToRoute()
	{
		let tmpModal = this._getModal();
		let tmpProvider = this._getProvider();

		if (!tmpModal || !tmpProvider)
		{
			return;
		}

		let tmpState = this.pict.AppData.InlineDocumentation;
		if (!tmpState || !tmpState.CurrentRoute)
		{
			if (tmpModal.toast)
			{
				tmpModal.toast('No current route to bind to.', { type: 'error' });
			}
			return;
		}

		let tmpCurrentRoute = tmpState.CurrentRoute;
		let tmpTopics = tmpProvider.getTopicList();
		let tmpContent = this._buildBindHTML(tmpCurrentRoute, tmpTopics);

		// Track selection state
		let tmpSelectedTopicCode = null;
		let tmpRouteType = 'exact'; // 'exact' or 'wildcard'

		tmpModal.show(
		{
			title: 'Bind Topic to Route',
			content: tmpContent,
			closeable: true,
			width: '480px',
			buttons:
			[
				{ Hash: 'cancel', Label: 'Cancel' },
				{ Hash: 'bind', Label: 'Bind Route', Style: 'primary' }
			],
			onOpen: (pDialog) =>
			{
				this._wireBindHandlers(pDialog, tmpTopics, tmpCurrentRoute,
					(pCode) => { tmpSelectedTopicCode = pCode; },
					(pType) => { tmpRouteType = pType; }
				);
			}
		}).then((pResult) =>
		{
			if (pResult !== 'bind' || !tmpSelectedTopicCode)
			{
				return;
			}

			if (tmpSelectedTopicCode === '__NEW__')
			{
				// Open new topic editor with current route pre-filled
				this.showTopicEditor(null);
				return;
			}

			if (tmpRouteType === 'wildcard')
			{
				// Open wildcard builder, then bind
				this.showWildcardBuilder(tmpCurrentRoute, (pPattern) =>
				{
					if (pPattern)
					{
						tmpProvider.addRouteToTopic(tmpSelectedTopicCode, pPattern);
						tmpProvider.saveTopics();

						let tmpNavView = this.pict.views['InlineDoc-Nav'];
						if (tmpNavView) { tmpNavView.render(); }

						if (tmpModal.toast)
						{
							tmpModal.toast('Route bound to topic.', { type: 'success' });
						}
					}
				});
			}
			else
			{
				// Exact match bind
				tmpProvider.addRouteToTopic(tmpSelectedTopicCode, tmpCurrentRoute);
				tmpProvider.saveTopics();

				let tmpNavView = this.pict.views['InlineDoc-Nav'];
				if (tmpNavView) { tmpNavView.render(); }

				if (tmpModal.toast)
				{
					tmpModal.toast('Route bound to topic.', { type: 'success' });
				}
			}
		});
	}

	/**
	 * Build the HTML for the bind-topic-to-route modal.
	 *
	 * @param {string} pCurrentRoute - The current route
	 * @param {Array} pTopics - Topic list
	 * @returns {string} HTML content
	 */
	_buildBindHTML(pCurrentRoute, pTopics)
	{
		let tmpHTML = '';

		tmpHTML += '<div class="pict-inline-doc-tm-bind-route-display">' + this._escapeHTML(pCurrentRoute) + '</div>';

		// Route type selection
		tmpHTML += '<div class="pict-inline-doc-tm-form-group">';
		tmpHTML += '<label class="pict-inline-doc-tm-form-label">Route Match Type</label>';
		tmpHTML += '<div class="pict-inline-doc-tm-bind-route-type">';
		tmpHTML += '<div class="pict-inline-doc-tm-bind-route-type-btn selected" data-route-type="exact">Exact Match</div>';
		tmpHTML += '<div class="pict-inline-doc-tm-bind-route-type-btn" data-route-type="wildcard">Wildcard Pattern</div>';
		tmpHTML += '</div>';
		tmpHTML += '</div>';

		// Topic selection
		tmpHTML += '<div class="pict-inline-doc-tm-form-group">';
		tmpHTML += '<label class="pict-inline-doc-tm-form-label">Select Topic</label>';
		tmpHTML += '<div class="pict-inline-doc-tm-bind-topic-list">';

		for (let i = 0; i < pTopics.length; i++)
		{
			let tmpTopic = pTopics[i];
			tmpHTML += '<div class="pict-inline-doc-tm-bind-topic-option" data-topic-code="' + this._escapeHTML(tmpTopic.TopicCode) + '">';
			tmpHTML += '<div class="pict-inline-doc-tm-bind-radio"></div>';
			tmpHTML += '<div class="pict-inline-doc-tm-topic-info">';
			tmpHTML += '<div class="pict-inline-doc-tm-topic-title">' + this._escapeHTML(tmpTopic.TopicTitle) + '</div>';
			tmpHTML += '<div class="pict-inline-doc-tm-topic-meta">' + this._escapeHTML(tmpTopic.TopicCode) + '</div>';
			tmpHTML += '</div>';
			tmpHTML += '</div>';
		}

		// Create new option
		tmpHTML += '<div class="pict-inline-doc-tm-bind-topic-option" data-topic-code="__NEW__">';
		tmpHTML += '<div class="pict-inline-doc-tm-bind-radio"></div>';
		tmpHTML += '<div class="pict-inline-doc-tm-topic-info">';
		tmpHTML += '<div class="pict-inline-doc-tm-topic-title" style="color:#2E7D74;">+ Create New Topic</div>';
		tmpHTML += '</div>';
		tmpHTML += '</div>';

		tmpHTML += '</div>';
		tmpHTML += '</div>';

		return tmpHTML;
	}

	/**
	 * Wire handlers for the bind-topic-to-route modal.
	 *
	 * @param {HTMLElement} pDialog - The modal dialog element
	 * @param {Array} pTopics - Topic list
	 * @param {string} pCurrentRoute - The current route
	 * @param {Function} fOnTopicSelect - Called with selected topic code
	 * @param {Function} fOnRouteTypeSelect - Called with 'exact' or 'wildcard'
	 */
	_wireBindHandlers(pDialog, pTopics, pCurrentRoute, fOnTopicSelect, fOnRouteTypeSelect)
	{
		// Topic selection
		let tmpTopicOptions = pDialog.querySelectorAll('.pict-inline-doc-tm-bind-topic-option');
		for (let i = 0; i < tmpTopicOptions.length; i++)
		{
			tmpTopicOptions[i].addEventListener('click', () =>
			{
				// Deselect all
				for (let j = 0; j < tmpTopicOptions.length; j++)
				{
					tmpTopicOptions[j].classList.remove('selected');
				}
				tmpTopicOptions[i].classList.add('selected');
				fOnTopicSelect(tmpTopicOptions[i].getAttribute('data-topic-code'));
			});
		}

		// Route type selection
		let tmpRouteTypeBtns = pDialog.querySelectorAll('.pict-inline-doc-tm-bind-route-type-btn');
		for (let i = 0; i < tmpRouteTypeBtns.length; i++)
		{
			tmpRouteTypeBtns[i].addEventListener('click', () =>
			{
				for (let j = 0; j < tmpRouteTypeBtns.length; j++)
				{
					tmpRouteTypeBtns[j].classList.remove('selected');
				}
				tmpRouteTypeBtns[i].classList.add('selected');
				fOnRouteTypeSelect(tmpRouteTypeBtns[i].getAttribute('data-route-type'));
			});
		}
	}

	// -- Sidebar Picker --

	/**
	 * Show a sidebar document picker modal.
	 *
	 * @param {Function} fOnSelect - Callback receiving the selected path (or null)
	 */
	_showSidebarPicker(fOnSelect)
	{
		let tmpModal = this._getModal();
		let tmpState = this.pict.AppData.InlineDocumentation;

		if (!tmpModal)
		{
			if (typeof fOnSelect === 'function') { fOnSelect(null); }
			return;
		}

		let tmpGroups = (tmpState && tmpState.SidebarGroups) ? tmpState.SidebarGroups : [];
		let tmpContent = this._buildSidebarPickerHTML(tmpGroups);

		tmpModal.show(
		{
			title: 'Select Document',
			content: tmpContent,
			closeable: true,
			width: '400px',
			buttons:
			[
				{ Hash: 'cancel', Label: 'Cancel' }
			],
			onOpen: (pDialog) =>
			{
				let tmpItems = pDialog.querySelectorAll('.pict-inline-doc-tm-sidebar-item');
				for (let i = 0; i < tmpItems.length; i++)
				{
					tmpItems[i].addEventListener('click', () =>
					{
						let tmpPath = tmpItems[i].getAttribute('data-path');
						if (tmpModal.dismissModals)
						{
							tmpModal.dismissModals();
						}
						if (typeof fOnSelect === 'function') { fOnSelect(tmpPath); }
					});
				}
			}
		}).then((pResult) =>
		{
			if (pResult === 'cancel' || pResult === null)
			{
				if (typeof fOnSelect === 'function') { fOnSelect(null); }
			}
		});
	}

	/**
	 * Build the HTML for the sidebar document picker.
	 *
	 * @param {Array} pGroups - SidebarGroups array
	 * @returns {string} HTML content
	 */
	_buildSidebarPickerHTML(pGroups)
	{
		let tmpHTML = '<div class="pict-inline-doc-tm-sidebar-list">';
		let tmpHasItems = false;

		for (let i = 0; i < pGroups.length; i++)
		{
			let tmpGroup = pGroups[i];

			if (tmpGroup.Path)
			{
				tmpHasItems = true;
				tmpHTML += '<div class="pict-inline-doc-tm-sidebar-item" data-path="' + this._escapeHTML(tmpGroup.Path) + '">';
				tmpHTML += this._escapeHTML(tmpGroup.Name);
				tmpHTML += '<span class="path">' + this._escapeHTML(tmpGroup.Path) + '</span>';
				tmpHTML += '</div>';
			}

			let tmpItems = tmpGroup.Items || [];
			for (let j = 0; j < tmpItems.length; j++)
			{
				if (tmpItems[j].Path)
				{
					tmpHasItems = true;
					tmpHTML += '<div class="pict-inline-doc-tm-sidebar-item" data-path="' + this._escapeHTML(tmpItems[j].Path) + '">';
					tmpHTML += this._escapeHTML(tmpItems[j].Name);
					tmpHTML += '<span class="path">' + this._escapeHTML(tmpItems[j].Path) + '</span>';
					tmpHTML += '</div>';
				}
			}
		}

		if (!tmpHasItems)
		{
			tmpHTML += '<div class="pict-inline-doc-tm-empty">No sidebar documents found.</div>';
		}

		tmpHTML += '</div>';
		return tmpHTML;
	}

	// -- Utilities --

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

module.exports = InlineDocumentationTopicManagerView;

module.exports.default_configuration = _ViewConfiguration;
