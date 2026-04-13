const libPictView = require('pict-view');

const _ViewConfiguration =
{
	ViewIdentifier: "InlineDoc-Layout",

	DefaultRenderable: "InlineDoc-Layout-Container",
	DefaultContentDestinationAddress: "#InlineDoc-Container",

	AutoRender: false,

	CSS: /*css*/`
		.pict-inline-doc {
			display: flex;
			flex-direction: row;
			width: 100%;
			height: 100%;
			min-height: 300px;
			font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
			font-size: 15px;
			color: #423D37;
			background: #FDFCFA;
			border: 1px solid #E5DED4;
			border-radius: 6px;
			overflow: hidden;
		}
		.pict-inline-doc-nav-container {
			width: 240px;
			min-width: 200px;
			max-width: 300px;
			border-right: 1px solid #E5DED4;
			background: #F7F5F0;
			overflow-y: auto;
			flex-shrink: 0;
		}
		.pict-inline-doc-content-container {
			flex: 1;
			overflow-y: auto;
			overflow-x: hidden;
			min-width: 0;
		}
		.pict-inline-doc-nav-container.pict-inline-doc-nav-hidden {
			display: none;
		}
		/* Compact mode: nav moves to a horizontal top bar when container is narrow */
		.pict-inline-doc.pict-inline-doc-compact {
			flex-direction: column;
		}
		.pict-inline-doc.pict-inline-doc-compact .pict-inline-doc-nav-container {
			width: 100%;
			min-width: 0;
			max-width: none;
			border-right: none;
			border-bottom: 1px solid #E5DED4;
			overflow-y: visible;
			overflow-x: auto;
			flex-shrink: 0;
			max-height: none;
		}
		/* Compact mode: nav items flow horizontally */
		.pict-inline-doc.pict-inline-doc-compact .pict-inline-doc-nav {
			padding: 0.4em 0.5em;
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			gap: 0.15em 0.3em;
		}
		.pict-inline-doc.pict-inline-doc-compact .pict-inline-doc-nav-group {
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			margin-bottom: 0;
			gap: 0.1em 0.2em;
		}
		.pict-inline-doc.pict-inline-doc-compact .pict-inline-doc-nav-group-header {
			padding: 0.2em 0.5em;
			font-size: 0.75em;
			white-space: nowrap;
		}
		.pict-inline-doc.pict-inline-doc-compact .pict-inline-doc-nav-group-toggle {
			display: none;
		}
		.pict-inline-doc.pict-inline-doc-compact .pict-inline-doc-nav-group-items {
			display: flex !important;
			flex-wrap: wrap;
			gap: 0.1em;
		}
		.pict-inline-doc.pict-inline-doc-compact .pict-inline-doc-nav-item {
			padding: 0.2em 0.5em;
			font-size: 0.8em;
			border-left: none;
			border-radius: 3px;
			white-space: nowrap;
		}
		.pict-inline-doc.pict-inline-doc-compact .pict-inline-doc-nav-item.active {
			border-left: none;
			background: #2E7D74;
			color: #fff;
		}
		.pict-inline-doc.pict-inline-doc-compact .pict-inline-doc-nav-topic-badge {
			margin: 0 0.3em;
			padding: 0.15em 0.5em;
			font-size: 0.75em;
		}
	`,

	Templates:
	[
		{
			Hash: "InlineDoc-Layout-Template",
			Template: /*html*/`
<div class="pict-inline-doc">
	<div class="pict-inline-doc-nav-container" id="InlineDoc-Nav-Container"></div>
	<div class="pict-inline-doc-content-container" id="InlineDoc-Content-Container"></div>
</div>
`
		}
	],

	Renderables:
	[
		{
			RenderableHash: "InlineDoc-Layout-Container",
			TemplateHash: "InlineDoc-Layout-Template",
			ContentDestinationAddress: "#InlineDoc-Container",
			RenderMethod: "replace"
		}
	]
};

class InlineDocumentationLayoutView extends libPictView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
	}

	onAfterRender()
	{
		// Inject all view CSS into the PICT-CSS style element
		this.pict.CSSMap.injectCSS();

		// Watch for size changes and toggle compact mode
		this._setupCompactModeObserver();

		return super.onAfterRender();
	}

	/**
	 * Set up a ResizeObserver to toggle compact mode when the container
	 * is too narrow for a side-by-side nav + content layout.
	 *
	 * Below the threshold, the nav switches to a horizontal top bar.
	 */
	_setupCompactModeObserver()
	{
		if (typeof document === 'undefined' || typeof ResizeObserver === 'undefined')
		{
			return;
		}

		let tmpContainer = document.querySelector('.pict-inline-doc');
		if (!tmpContainer)
		{
			return;
		}

		// Clean up any previous observer
		if (this._resizeObserver)
		{
			this._resizeObserver.disconnect();
		}

		let tmpCompactThreshold = 550;

		this._resizeObserver = new ResizeObserver((pEntries) =>
		{
			for (let i = 0; i < pEntries.length; i++)
			{
				let tmpWidth = pEntries[i].contentRect.width;

				if (tmpWidth < tmpCompactThreshold)
				{
					tmpContainer.classList.add('pict-inline-doc-compact');
				}
				else
				{
					tmpContainer.classList.remove('pict-inline-doc-compact');
				}
			}
		});

		this._resizeObserver.observe(tmpContainer);

		// Also do an immediate check
		let tmpWidth = tmpContainer.offsetWidth;
		if (tmpWidth > 0 && tmpWidth < tmpCompactThreshold)
		{
			tmpContainer.classList.add('pict-inline-doc-compact');
		}
	}
}

module.exports = InlineDocumentationLayoutView;

module.exports.default_configuration = _ViewConfiguration;
