const libPictContentView = require('pict-section-content');

const _ViewConfiguration =
{
	ViewIdentifier: "InlineDoc-Content",

	DefaultRenderable: "InlineDoc-Content-Display",
	DefaultContentDestinationAddress: "#InlineDoc-Content-Container",

	AutoRender: false,

	CSS: /*css*/`
		.pict-inline-doc-content {
			padding: 1em 1.25em;
			max-width: 100%;
			word-wrap: break-word;
			overflow-wrap: break-word;
		}
		.pict-inline-doc-content-loading {
			display: flex;
			align-items: center;
			justify-content: center;
			min-height: 150px;
			color: #8A7F72;
			font-size: 0.95em;
		}
		.pict-inline-doc-content h1 {
			font-size: 1.75em;
			color: #3D3229;
			border-bottom: 1px solid #DDD6CA;
			padding-bottom: 0.3em;
			margin-top: 0;
		}
		.pict-inline-doc-content h2 {
			font-size: 1.35em;
			color: #3D3229;
			border-bottom: 1px solid #EAE3D8;
			padding-bottom: 0.2em;
			margin-top: 1.25em;
		}
		.pict-inline-doc-content h3 {
			font-size: 1.15em;
			color: #3D3229;
			margin-top: 1em;
		}
		.pict-inline-doc-content h4, .pict-inline-doc-content h5, .pict-inline-doc-content h6 {
			color: #5E5549;
			margin-top: 0.8em;
		}
		.pict-inline-doc-content p {
			line-height: 1.65;
			color: #423D37;
			margin: 0.6em 0;
		}
		.pict-inline-doc-content a {
			color: #2E7D74;
			text-decoration: none;
			cursor: pointer;
		}
		.pict-inline-doc-content a:hover {
			text-decoration: underline;
		}
		.pict-inline-doc-content pre {
			background: #3D3229;
			color: #E8E0D4;
			padding: 1em;
			border-radius: 5px;
			overflow-x: auto;
			line-height: 1.5;
			font-size: 0.85em;
			max-width: 100%;
		}
		.pict-inline-doc-content code {
			background: #F0ECE4;
			padding: 0.15em 0.35em;
			border-radius: 3px;
			font-size: 0.85em;
			color: #9E6B47;
		}
		.pict-inline-doc-content pre code {
			background: none;
			padding: 0;
			color: inherit;
			font-size: inherit;
		}
		.pict-inline-doc-content blockquote {
			border-left: 3px solid #2E7D74;
			margin: 0.8em 0;
			padding: 0.4em 0.8em;
			background: #F7F5F0;
			color: #5E5549;
		}
		.pict-inline-doc-content blockquote p {
			margin: 0.2em 0;
		}
		.pict-inline-doc-content ul, .pict-inline-doc-content ol {
			padding-left: 1.8em;
			line-height: 1.7;
		}
		.pict-inline-doc-content li {
			margin: 0.2em 0;
			color: #423D37;
		}
		.pict-inline-doc-content hr {
			border: none;
			border-top: 1px solid #DDD6CA;
			margin: 1.5em 0;
		}
		.pict-inline-doc-content table {
			width: 100%;
			border-collapse: collapse;
			margin: 0.8em 0;
			display: block;
			overflow-x: auto;
		}
		.pict-inline-doc-content table th {
			background: #F5F0E8;
			border: 1px solid #DDD6CA;
			padding: 0.5em 0.7em;
			text-align: left;
			font-weight: 600;
			color: #3D3229;
		}
		.pict-inline-doc-content table td {
			border: 1px solid #DDD6CA;
			padding: 0.4em 0.7em;
			color: #423D37;
		}
		.pict-inline-doc-content table tr:nth-child(even) {
			background: #F7F5F0;
		}
		.pict-inline-doc-content img {
			max-width: 100%;
			height: auto;
		}
		.pict-inline-doc-not-found {
			text-align: center;
			padding: 2em 1em;
			color: #5E5549;
		}
		.pict-inline-doc-not-found h2 {
			color: #8A7F72;
			font-size: 1.3em;
			border-bottom: none;
		}
		.pict-inline-doc-not-found code {
			background: #F0ECE4;
			padding: 0.15em 0.35em;
			border-radius: 3px;
			font-size: 0.85em;
			color: #9E6B47;
		}
		/* Code block action buttons (copy, fullscreen) from pict-section-content */
		.pict-content-code-actions {
			position: sticky;
			top: 64px;
			align-self: flex-start;
			display: flex;
			flex-direction: column;
			gap: 6px;
			flex: 0 0 auto;
			padding-top: 6px;
			opacity: 0;
			transform: translateX(-4px);
			transition: opacity 0.15s ease, transform 0.15s ease;
			pointer-events: none;
		}
		.pict-content-code-container:hover .pict-content-code-actions,
		.pict-content-code-container:focus-within .pict-content-code-actions {
			opacity: 1;
			transform: translateX(0);
			pointer-events: auto;
		}
		.pict-content-code-action-btn {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			width: 28px;
			height: 28px;
			padding: 0;
			background: #FFFFFF;
			color: #5E5549;
			border: 1px solid #DDD6CA;
			border-radius: 6px;
			cursor: pointer;
			box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
			transition: background-color 0.15s ease, color 0.15s ease;
		}
		.pict-content-code-action-btn svg {
			display: block;
			width: 14px;
			height: 14px;
			stroke: currentColor;
			fill: none;
			stroke-width: 1.6;
			stroke-linecap: round;
			stroke-linejoin: round;
		}
		.pict-content-code-action-btn:hover {
			background: #2E7D74;
			color: #FFFFFF;
			border-color: #2E7D74;
		}
		.pict-content-code-action-btn.is-copied {
			background: #2E7D74;
			color: #FFFFFF;
			border-color: #2E7D74;
		}
		.pict-inline-doc-edit-toolbar {
			display: none;
			align-items: center;
			gap: 0.4em;
			padding: 0.4em 0.6em;
			margin-bottom: 0.5em;
			background: #F5F0E8;
			border: 1px solid #E5DED4;
			border-radius: 4px;
			font-size: 0.8em;
		}
		.pict-inline-doc-edit-toolbar.visible {
			display: flex;
		}
		.pict-inline-doc-edit-toolbar .edit-label {
			color: #8A7F72;
			margin-right: auto;
		}
		.pict-inline-doc-edit-btn {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			padding: 0.25em 0.6em;
			border: 1px solid #D4A373;
			border-radius: 3px;
			background: #fff;
			color: #5E5549;
			font-size: 0.9em;
			cursor: pointer;
			transition: background 0.1s;
		}
		.pict-inline-doc-edit-btn:hover {
			background: #F0ECE4;
		}
		.pict-inline-doc-edit-btn.primary {
			background: #2E7D74;
			color: #fff;
			border-color: #2E7D74;
		}
		.pict-inline-doc-edit-btn.primary:hover {
			background: #266D65;
		}
		.pict-inline-doc-edit-btn .btn-icon {
			margin-right: 0.3em;
		}
		#InlineDoc-Editor-Container {
			min-height: 300px;
		}
		/* Tooltip placeholder: edit mode indicators */
		[data-d-tooltip].pict-inline-doc-tooltip-edit-target {
			outline: 1px dashed #2E7D74;
			outline-offset: 2px;
			cursor: pointer;
			position: relative;
		}
		[data-d-tooltip].pict-inline-doc-tooltip-edit-target:not([data-d-tooltip-icon])::after {
			content: '?';
			position: absolute;
			top: -6px;
			right: -6px;
			width: 14px;
			height: 14px;
			background: #2E7D74;
			color: #fff;
			border-radius: 50%;
			font-size: 9px;
			line-height: 14px;
			text-align: center;
			font-weight: 700;
			pointer-events: none;
		}
		/* Tooltip placeholder: default icon */
		.pict-inline-doc-tooltip-icon {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			width: 16px;
			height: 16px;
			font-size: 12px;
			color: #2E7D74;
			cursor: pointer;
			vertical-align: middle;
		}
		/* Empty icon tooltip in edit mode */
		.pict-inline-doc-tooltip-empty .pict-inline-doc-tooltip-icon {
			opacity: 0.4;
			outline: 1px dashed #8A7F72;
			outline-offset: 1px;
			border-radius: 50%;
		}
		/* Tooltip editor textarea in modal */
		.pict-inline-doc-tooltip-editor-textarea {
			width: 100%;
			min-height: 120px;
			padding: 0.6em;
			font-family: 'SFMono-Regular', 'SF Mono', 'Menlo', 'Consolas', monospace;
			font-size: 0.85em;
			line-height: 1.5;
			color: #3D3229;
			background: #FDFCFA;
			border: 1px solid #DDD6CA;
			border-radius: 4px;
			resize: vertical;
			box-sizing: border-box;
		}
		.pict-inline-doc-tooltip-editor-textarea:focus {
			outline: none;
			border-color: #2E7D74;
			box-shadow: 0 0 0 2px rgba(46, 125, 116, 0.15);
		}
		.pict-inline-doc-tooltip-preview {
			margin-top: 0.5em;
			padding: 0.5em 0.7em;
			background: #F5F0E8;
			border: 1px solid #E5DED4;
			border-radius: 4px;
			font-size: 0.9em;
			min-height: 2em;
			color: #3D3229;
		}
		.pict-inline-doc-tooltip-preview-label {
			font-size: 0.75em;
			color: #8A7F72;
			text-transform: uppercase;
			letter-spacing: 0.03em;
			margin-bottom: 0.3em;
		}
	`,

	Templates:
	[
		{
			Hash: "InlineDoc-Content-Template",
			Template: /*html*/`
<div class="pict-inline-doc-edit-toolbar" id="InlineDoc-Edit-Toolbar">
	<span class="edit-label" id="InlineDoc-Edit-Label">View mode</span>
	<button class="pict-inline-doc-edit-btn" id="InlineDoc-Edit-Toggle" title="Edit this document"><span class="btn-icon"><svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11.5 1.5l3 3L5 14H2v-3z"/><line x1="9" y1="4" x2="12" y2="7"/></svg></span> Edit</button>
	<button class="pict-inline-doc-edit-btn primary" id="InlineDoc-Edit-Save" style="display:none"><span class="btn-icon"><svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3,8 6.5,11.5 13,4.5"/></svg></span> Save</button>
	<button class="pict-inline-doc-edit-btn" id="InlineDoc-Edit-Cancel" style="display:none"><span class="btn-icon"><svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><line x1="4" y1="4" x2="12" y2="12"/><line x1="12" y1="4" x2="4" y2="12"/></svg></span> Cancel</button>
</div>
<div class="pict-inline-doc-content pict-content" id="InlineDoc-Content-Body">
	<div class="pict-inline-doc-content-loading">Loading...</div>
</div>
`
		}
	],

	Renderables:
	[
		{
			RenderableHash: "InlineDoc-Content-Display",
			TemplateHash: "InlineDoc-Content-Template",
			ContentDestinationAddress: "#InlineDoc-Content-Container",
			RenderMethod: "replace"
		}
	]
};

class InlineDocumentationContentView extends libPictContentView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
	}

	onAfterRender()
	{
		this.renderEditToolbar();
		return super.onAfterRender();
	}

	/**
	 * Display parsed HTML content in the content area.
	 *
	 * @param {string} pHTMLContent - The HTML to display
	 */
	displayContent(pHTMLContent)
	{
		super.displayContent(pHTMLContent, 'InlineDoc-Content-Body');

		// Wire up click interception for internal doc links
		this._wireInternalLinks();

		// Update the edit toolbar state
		this.renderEditToolbar();
	}

	/**
	 * Show a loading indicator.
	 */
	showLoading()
	{
		super.showLoading('Loading...', 'InlineDoc-Content-Body');
	}

	/**
	 * Show or hide the edit toolbar based on EditEnabled state.
	 */
	renderEditToolbar()
	{
		if (typeof document === 'undefined')
		{
			return;
		}

		let tmpToolbar = document.getElementById('InlineDoc-Edit-Toolbar');
		if (!tmpToolbar)
		{
			return;
		}

		let tmpState = this.pict.AppData.InlineDocumentation;
		if (!tmpState)
		{
			return;
		}

		if (tmpState.EditEnabled && tmpState.CurrentPath)
		{
			tmpToolbar.classList.add('visible');
		}
		else
		{
			tmpToolbar.classList.remove('visible');
		}

		// Update button visibility based on editing state
		let tmpToggleBtn = document.getElementById('InlineDoc-Edit-Toggle');
		let tmpSaveBtn = document.getElementById('InlineDoc-Edit-Save');
		let tmpCancelBtn = document.getElementById('InlineDoc-Edit-Cancel');
		let tmpLabel = document.getElementById('InlineDoc-Edit-Label');

		if (tmpState.Editing)
		{
			if (tmpToggleBtn) { tmpToggleBtn.style.display = 'none'; }
			if (tmpSaveBtn) { tmpSaveBtn.style.display = ''; }
			if (tmpCancelBtn) { tmpCancelBtn.style.display = ''; }
			if (tmpLabel) { tmpLabel.textContent = 'Editing: ' + (tmpState.EditingPath || ''); }
		}
		else
		{
			if (tmpToggleBtn) { tmpToggleBtn.style.display = ''; }
			if (tmpSaveBtn) { tmpSaveBtn.style.display = 'none'; }
			if (tmpCancelBtn) { tmpCancelBtn.style.display = 'none'; }
			if (tmpLabel) { tmpLabel.textContent = tmpState.CurrentPath || 'View mode'; }
		}

		// Re-wire click handlers (DOM may have been recreated by render)
		this._wireEditToolbar();
	}

	/**
	 * Show the markdown editor with the raw markdown content.
	 *
	 * @param {string} pMarkdown - The raw markdown to edit
	 */
	showEditor(pMarkdown)
	{
		if (typeof document === 'undefined')
		{
			return;
		}

		let tmpContainer = document.getElementById('InlineDoc-Content-Body');
		if (!tmpContainer)
		{
			return;
		}

		// Create a container for the markdown editor view to render into
		tmpContainer.innerHTML = '<div id="InlineDoc-Editor-Container"></div>';

		// Set up the editor segments data for the markdown editor
		if (!this.pict.AppData.InlineDocumentation)
		{
			this.pict.AppData.InlineDocumentation = {};
		}
		this.pict.AppData.InlineDocumentation.EditorSegments = [{ Content: pMarkdown || '' }];

		// Render the markdown editor view into the container
		let tmpEditorView = this.pict.views['InlineDoc-MarkdownEditor'];
		if (tmpEditorView)
		{
			tmpEditorView.render();
		}

		this.renderEditToolbar();
	}

	/**
	 * Hide the textarea editor.
	 */
	hideEditor()
	{
		// The editor will be replaced by displayContent, but update toolbar state
		this.renderEditToolbar();
	}

	/**
	 * Wire click handlers for the edit toolbar buttons.
	 */
	_wireEditToolbar()
	{
		if (typeof document === 'undefined')
		{
			return;
		}

		let tmpProvider = this.pict.providers['Pict-InlineDocumentation'];

		let tmpToggleBtn = document.getElementById('InlineDoc-Edit-Toggle');
		if (tmpToggleBtn)
		{
			tmpToggleBtn.addEventListener('click', () =>
			{
				if (tmpProvider)
				{
					tmpProvider.beginEdit();
				}
			});
		}

		let tmpSaveBtn = document.getElementById('InlineDoc-Edit-Save');
		if (tmpSaveBtn)
		{
			tmpSaveBtn.addEventListener('click', () =>
			{
				if (tmpProvider)
				{
					tmpProvider.saveEdit();
				}
			});
		}

		let tmpCancelBtn = document.getElementById('InlineDoc-Edit-Cancel');
		if (tmpCancelBtn)
		{
			tmpCancelBtn.addEventListener('click', () =>
			{
				if (tmpProvider)
				{
					tmpProvider.cancelEdit();
				}
			});
		}
	}

	/**
	 * Wire click handlers on internal documentation links.
	 *
	 * Links with rel="pict-inline-doc-link:path" are intercepted and
	 * routed through the provider's loadDocument() method.
	 */
	_wireInternalLinks()
	{
		if (typeof document === 'undefined')
		{
			return;
		}

		let tmpContainer = document.getElementById('InlineDoc-Content-Body');
		if (!tmpContainer)
		{
			return;
		}

		let tmpLinks = tmpContainer.querySelectorAll('a[rel^="pict-inline-doc-link:"]');
		let tmpProvider = this.pict.providers['Pict-InlineDocumentation'];

		for (let i = 0; i < tmpLinks.length; i++)
		{
			let tmpLink = tmpLinks[i];
			let tmpRel = tmpLink.getAttribute('rel');
			let tmpPath = tmpRel.replace('pict-inline-doc-link:', '');

			// Check if this is a cross-module link that should open externally
			if (tmpProvider && typeof tmpProvider.isExternalPath === 'function' && tmpProvider.isExternalPath(tmpPath))
			{
				let tmpExternalURL = tmpProvider.resolveExternalURL(tmpPath);
				if (tmpExternalURL)
				{
					tmpLink.setAttribute('href', tmpExternalURL);
					tmpLink.setAttribute('target', '_blank');
					tmpLink.setAttribute('rel', 'noopener');
					continue;
				}
			}

			tmpLink.addEventListener('click', (pEvent) =>
			{
				pEvent.preventDefault();
				if (tmpProvider)
				{
					tmpProvider.loadDocument(tmpPath);
				}
			});
		}
	}
}

module.exports = InlineDocumentationContentView;

module.exports.default_configuration = _ViewConfiguration;
