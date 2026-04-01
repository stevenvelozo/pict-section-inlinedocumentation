const libPictContentView = require('pict-section-content');

const _ViewConfiguration =
{
	ViewIdentifier: "InlineDoc-Content",

	DefaultRenderable: "InlineDoc-Content-Display",
	DefaultDestinationAddress: "#InlineDoc-Content-Container",

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
		#InlineDoc-Edit-Textarea {
			width: 100%;
			min-height: 300px;
			padding: 1em;
			font-family: 'SFMono-Regular', 'SF Mono', 'Menlo', 'Consolas', monospace;
			font-size: 0.85em;
			line-height: 1.6;
			color: #3D3229;
			background: #FDFCFA;
			border: 1px solid #DDD6CA;
			border-radius: 4px;
			resize: vertical;
			tab-size: 4;
		}
		#InlineDoc-Edit-Textarea:focus {
			outline: none;
			border-color: #2E7D74;
			box-shadow: 0 0 0 2px rgba(46, 125, 116, 0.15);
		}
	`,

	Templates:
	[
		{
			Hash: "InlineDoc-Content-Template",
			Template: /*html*/`
<div class="pict-inline-doc-edit-toolbar" id="InlineDoc-Edit-Toolbar">
	<span class="edit-label" id="InlineDoc-Edit-Label">View mode</span>
	<button class="pict-inline-doc-edit-btn" id="InlineDoc-Edit-Toggle" title="Edit this document"><span class="btn-icon">&#x270E;</span> Edit</button>
	<button class="pict-inline-doc-edit-btn primary" id="InlineDoc-Edit-Save" style="display:none"><span class="btn-icon">&#x2713;</span> Save</button>
	<button class="pict-inline-doc-edit-btn" id="InlineDoc-Edit-Cancel" style="display:none"><span class="btn-icon">&#x2717;</span> Cancel</button>
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
			DestinationAddress: "#InlineDoc-Content-Container",
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
	 * Show a textarea editor with the raw markdown content.
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

		tmpContainer.innerHTML = '<textarea id="InlineDoc-Edit-Textarea">'
			+ (pMarkdown || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
			+ '</textarea>';

		// Focus the textarea
		let tmpTextarea = document.getElementById('InlineDoc-Edit-Textarea');
		if (tmpTextarea)
		{
			tmpTextarea.focus();

			// Support tab key for indentation
			tmpTextarea.addEventListener('keydown', (pEvent) =>
			{
				if (pEvent.key === 'Tab')
				{
					pEvent.preventDefault();
					let tmpStart = tmpTextarea.selectionStart;
					let tmpEnd = tmpTextarea.selectionEnd;
					tmpTextarea.value = tmpTextarea.value.substring(0, tmpStart) + '\t' + tmpTextarea.value.substring(tmpEnd);
					tmpTextarea.selectionStart = tmpTextarea.selectionEnd = tmpStart + 1;
				}
			});
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
