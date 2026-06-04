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
			color: var(--theme-color-text-primary, #423D37);
			background: var(--theme-color-background-panel,    #FDFCFA);
			border: 1px solid var(--theme-color-border-default, #E5DED4);
			border-radius: 6px;
			overflow: hidden;
		}
		.pict-inline-doc-nav-container {
			width: var(--pict-inline-doc-nav-width, 240px);
			min-width: 160px;
			max-width: 640px;
			border-right: 1px solid var(--theme-color-border-default, #E5DED4);
			background: var(--theme-color-background-secondary, #F7F5F0);
			overflow-y: auto;
			flex-shrink: 0;
		}
		.pict-inline-doc-resizer {
			flex: 0 0 6px;
			width: 6px;
			margin: 0 -3px;
			z-index: 2;
			cursor: col-resize;
			background: transparent;
			transition: background 0.12s ease;
		}
		.pict-inline-doc-resizer:hover,
		.pict-inline-doc-resizer.pict-inline-doc-resizing {
			background: var(--theme-color-brand-primary, #2E7D74);
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
			border-bottom: 1px solid var(--theme-color-border-default, #E5DED4);
			overflow-y: visible;
			flex-shrink: 0;
		}
		.pict-inline-doc.pict-inline-doc-compact .pict-inline-doc-resizer {
			display: none;
		}
	`,

	Templates:
	[
		{
			Hash: "InlineDoc-Layout-Template",
			Template: /*html*/`
<div class="pict-inline-doc">
	<div class="pict-inline-doc-nav-container" id="InlineDoc-Nav-Container"></div>
	<div class="pict-inline-doc-resizer" id="InlineDoc-Resizer" title="Drag to resize the navigation"></div>
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

		// Restore any saved nav width, then make the nav/content divider draggable
		this._restoreNavWidth();
		this._wireNavResizer();

		// Watch for size changes and toggle compact mode
		this._setupCompactModeObserver();

		return super.onAfterRender();
	}

	/**
	 * Make the divider between the nav and the content draggable so the reader
	 * can widen or narrow the navigation. The width lives in a CSS custom
	 * property on the layout container and is persisted to localStorage.
	 */
	_wireNavResizer()
	{
		if (typeof document === 'undefined')
		{
			return;
		}

		let tmpResizer = document.getElementById('InlineDoc-Resizer');
		let tmpContainer = document.querySelector('.pict-inline-doc');
		let tmpNav = document.getElementById('InlineDoc-Nav-Container');
		if (!tmpResizer || !tmpContainer || !tmpNav)
		{
			return;
		}

		let tmpMin = 160;
		let tmpMax = 640;
		let tmpSelf = this;

		tmpResizer.addEventListener('mousedown', (pDownEvent) =>
		{
			pDownEvent.preventDefault();
			let tmpStartX = pDownEvent.clientX;
			let tmpStartWidth = tmpNav.offsetWidth;

			tmpResizer.classList.add('pict-inline-doc-resizing');
			document.body.style.userSelect = 'none';
			document.body.style.cursor = 'col-resize';

			// A drag needs document-level move/up tracking; both listeners are
			// removed on release, so nothing leaks across renders.
			let fMove = (pMoveEvent) =>
			{
				let tmpWidth = tmpStartWidth + (pMoveEvent.clientX - tmpStartX);
				tmpWidth = Math.max(tmpMin, Math.min(tmpMax, tmpWidth));
				tmpContainer.style.setProperty('--pict-inline-doc-nav-width', tmpWidth + 'px');
			};
			let fUp = () =>
			{
				document.removeEventListener('mousemove', fMove);
				document.removeEventListener('mouseup', fUp);
				tmpResizer.classList.remove('pict-inline-doc-resizing');
				document.body.style.userSelect = '';
				document.body.style.cursor = '';
				tmpSelf._persistNavWidth(tmpContainer.style.getPropertyValue('--pict-inline-doc-nav-width'));
			};

			document.addEventListener('mousemove', fMove);
			document.addEventListener('mouseup', fUp);
		});
	}

	_persistNavWidth(pWidth)
	{
		try
		{
			if (pWidth && typeof localStorage !== 'undefined')
			{
				localStorage.setItem('pict-inline-doc-nav-width', pWidth);
			}
		}
		catch (pError) { /* storage unavailable — the width just won't persist */ }
	}

	_restoreNavWidth()
	{
		try
		{
			if (typeof localStorage === 'undefined')
			{
				return;
			}
			let tmpSaved = localStorage.getItem('pict-inline-doc-nav-width');
			if (!tmpSaved)
			{
				return;
			}
			let tmpContainer = document.querySelector('.pict-inline-doc');
			if (tmpContainer)
			{
				tmpContainer.style.setProperty('--pict-inline-doc-nav-width', tmpSaved);
			}
		}
		catch (pError) { /* ignore */ }
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
