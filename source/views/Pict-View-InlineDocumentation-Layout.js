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
		/* Compact mode: stack nav above content when container is narrow */
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
			flex-shrink: 0;
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
