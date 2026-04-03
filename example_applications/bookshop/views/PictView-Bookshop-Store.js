const libPictView = require('pict-view');

const _ViewConfiguration =
{
	ViewIdentifier: "Bookshop-Store",

	DefaultRenderable: "Bookshop-Store-Display",
	DefaultDestinationAddress: "#Bookshop-Content-Container",

	AutoRender: false,

	CSS: /*css*/`
		.bookshop-store {
			padding: 0;
		}
		.bookshop-store-back {
			display: inline-flex;
			align-items: center;
			gap: 0.3em;
			padding: 0.4em 0.8em;
			border: 1px solid #D4A373;
			border-radius: 4px;
			background: #fff;
			color: #264653;
			cursor: pointer;
			font-size: 0.85em;
			margin-bottom: 1.25em;
			transition: background 0.15s;
		}
		.bookshop-store-back:hover {
			background: #F5F0E8;
		}
		.bookshop-store-detail {
			display: flex;
			gap: 2em;
		}
		.bookshop-store-cover {
			width: 200px;
			height: 300px;
			border-radius: 6px;
			object-fit: cover;
			flex-shrink: 0;
			background: #F0ECE4;
			box-shadow: 0 2px 12px rgba(38,70,83,0.12);
		}
		.bookshop-store-info {
			flex: 1;
			min-width: 0;
		}
		.bookshop-store-title {
			font-size: 1.75em;
			font-weight: 700;
			color: #264653;
			margin: 0 0 0.15em;
		}
		.bookshop-store-author {
			font-size: 1.1em;
			color: #8A7F72;
			margin: 0 0 0.75em;
		}
		.bookshop-store-genre-badge {
			display: inline-block;
			font-size: 0.8em;
			padding: 0.2em 0.6em;
			background: #264653;
			color: #FAEDCD;
			border-radius: 4px;
			margin-bottom: 1em;
		}
		.bookshop-store-description {
			line-height: 1.7;
			color: #423D37;
			margin: 0.75em 0 1.25em;
			font-size: 1em;
		}
		.bookshop-store-price {
			font-size: 2em;
			font-weight: 700;
			color: #2E7D74;
			margin-bottom: 0.3em;
		}
		.bookshop-store-stock {
			font-size: 0.9em;
			font-weight: 600;
			margin-bottom: 1.25em;
		}
		.bookshop-store-stock.in-stock {
			color: #2E7D74;
		}
		.bookshop-store-stock.out-of-stock {
			color: #E76F51;
		}
		.bookshop-store-add-cart {
			display: inline-block;
			padding: 0.6em 1.5em;
			background: #E76F51;
			color: #fff;
			border: none;
			border-radius: 5px;
			font-size: 1em;
			font-weight: 600;
			cursor: pointer;
			transition: background 0.15s;
		}
		.bookshop-store-add-cart:hover {
			background: #D4603F;
		}
		.bookshop-store-add-cart:disabled {
			background: #C4BAA8;
			cursor: not-allowed;
		}
	`,

	Templates:
	[
		{
			Hash: "Bookshop-Store-Template",
			Template: /*html*/`<div class="bookshop-store" id="Bookshop-Store-Body"></div>`
		}
	],

	Renderables:
	[
		{
			RenderableHash: "Bookshop-Store-Display",
			TemplateHash: "Bookshop-Store-Template",
			DestinationAddress: "#Bookshop-Content-Container",
			RenderMethod: "replace"
		}
	]
};

class BookshopStoreView extends libPictView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
	}

	onAfterRender()
	{
		this._renderStore();
		return super.onAfterRender();
	}

	_renderStore()
	{
		if (typeof document === 'undefined')
		{
			return;
		}

		let tmpContainer = document.getElementById('Bookshop-Store-Body');
		if (!tmpContainer)
		{
			return;
		}

		let tmpState = this.pict.AppData.Bookshop;
		let tmpBook = tmpState.CurrentBook;

		if (!tmpBook)
		{
			tmpContainer.innerHTML = '<p>No book selected.</p>';
			return;
		}

		let tmpStockClass = tmpBook.InStock ? 'in-stock' : 'out-of-stock';
		let tmpStockText = tmpBook.InStock ? 'In Stock' : 'Out of Stock';
		let tmpDisabled = tmpBook.InStock ? '' : ' disabled';

		let tmpHTML = '';

		// Back button
		tmpHTML += '<button class="bookshop-store-back" id="Bookshop-Store-Back" data-d-tooltip="back-to-catalog">';
		tmpHTML += '&#x2190; Back to Catalog';
		tmpHTML += '</button>';
		tmpHTML += ' <span data-d-tooltip="navigation-info" data-d-tooltip-icon></span>';

		// Section header with help button
		tmpHTML += '<div class="bookshop-section-header">';
		tmpHTML += '<h2 class="bookshop-section-title">Store</h2>';
		tmpHTML += '<button class="bookshop-help-btn" id="Bookshop-Help-Store" title="Help: Store Page">?</button>';
		tmpHTML += '</div>';

		// Detail layout
		tmpHTML += '<div class="bookshop-store-detail">';

		// Cover
		tmpHTML += '<img class="bookshop-store-cover" src="' + tmpBook.Cover + '" alt="' + tmpBook.Title + '">';

		// Info
		tmpHTML += '<div class="bookshop-store-info">';
		tmpHTML += '<h1 class="bookshop-store-title">' + tmpBook.Title + '</h1>';
		tmpHTML += '<p class="bookshop-store-author" data-d-tooltip="store-author">by ' + tmpBook.Author + '</p>';
		tmpHTML += '<span class="bookshop-store-genre-badge" data-d-tooltip="genre-badge">' + tmpBook.Genre + '</span>';
		tmpHTML += '<p class="bookshop-store-description">' + tmpBook.Description + '</p>';
		tmpHTML += '<div class="bookshop-store-price" data-d-tooltip="store-price">$' + tmpBook.Price.toFixed(2) + '</div>';
		tmpHTML += '<div class="bookshop-store-stock ' + tmpStockClass + '" data-d-tooltip="store-stock">' + tmpStockText + '</div>';
		tmpHTML += '<button class="bookshop-store-add-cart" id="Bookshop-Store-AddCart"' + tmpDisabled + ' data-d-tooltip="add-to-cart">Add to Cart</button>';
		tmpHTML += ' <span data-d-tooltip="cart-info" data-d-tooltip-icon></span>';
		tmpHTML += '</div>';

		tmpHTML += '</div>';

		tmpContainer.innerHTML = tmpHTML;

		// Wire handlers
		this._wireHandlers(tmpContainer);

		// Scan for tooltip placeholders
		let tmpDocProvider = this.pict.providers['Pict-InlineDocumentation'];
		if (tmpDocProvider)
		{
			tmpDocProvider.scanTooltips();
		}
	}

	_wireHandlers(pContainer)
	{
		let tmpApp = this.pict.PictApplication;

		let tmpBackBtn = pContainer.querySelector('#Bookshop-Store-Back');
		if (tmpBackBtn)
		{
			tmpBackBtn.addEventListener('click', () =>
			{
				if (tmpApp)
				{
					tmpApp.showBookList();
				}
			});
		}

		let tmpAddCartBtn = pContainer.querySelector('#Bookshop-Store-AddCart');
		if (tmpAddCartBtn)
		{
			tmpAddCartBtn.addEventListener('click', () =>
			{
				let tmpBook = this.pict.AppData.Bookshop.CurrentBook;
				if (tmpBook && tmpBook.InStock)
				{
					tmpAddCartBtn.textContent = 'Added!';
					tmpAddCartBtn.disabled = true;
					setTimeout(() =>
					{
						tmpAddCartBtn.textContent = 'Add to Cart';
						tmpAddCartBtn.disabled = false;
					}, 1500);
				}
			});
		}

		let tmpHelpStore = pContainer.querySelector('#Bookshop-Help-Store');
		if (tmpHelpStore)
		{
			tmpHelpStore.addEventListener('click', (pEvent) =>
			{
				pEvent.stopPropagation();
				if (tmpApp)
				{
					tmpApp.showHelp('BOOKSHOP-STORE');
				}
			});
		}
	}
}

module.exports = BookshopStoreView;

module.exports.default_configuration = _ViewConfiguration;
