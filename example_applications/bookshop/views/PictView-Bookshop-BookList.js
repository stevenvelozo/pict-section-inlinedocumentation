const libPictView = require('pict-view');

const _ViewConfiguration =
{
	ViewIdentifier: "Bookshop-BookList",

	DefaultRenderable: "Bookshop-BookList-Display",
	DefaultDestinationAddress: "#Bookshop-Content-Container",

	AutoRender: false,

	CSS: /*css*/`
		.bookshop-section-header {
			display: flex;
			align-items: center;
			gap: 0.5em;
			margin-bottom: 1em;
		}
		.bookshop-section-title {
			font-size: 1.5em;
			font-weight: 700;
			color: #264653;
			margin: 0;
		}
		.bookshop-help-btn {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			width: 22px;
			height: 22px;
			border-radius: 50%;
			border: 2px solid #D4A373;
			background: transparent;
			color: #D4A373;
			font-size: 0.75em;
			font-weight: 700;
			cursor: pointer;
			line-height: 1;
			padding: 0;
			transition: background 0.15s, color 0.15s;
			flex-shrink: 0;
		}
		.bookshop-help-btn:hover {
			background: #D4A373;
			color: #fff;
		}
		.bookshop-filter-bar {
			margin-bottom: 1.25em;
			display: flex;
			align-items: center;
			gap: 0.75em;
		}
		.bookshop-filter-bar label {
			font-size: 0.85em;
			font-weight: 600;
			color: #5E5549;
		}
		.bookshop-filter-bar select {
			padding: 0.35em 0.7em;
			border: 1px solid #D4A373;
			border-radius: 4px;
			font-size: 0.85em;
			background: #fff;
			color: #264653;
		}
		.bookshop-book-grid {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
			gap: 1.25em;
		}
		.bookshop-book-card {
			display: flex;
			gap: 1em;
			padding: 1em;
			background: #fff;
			border: 1px solid #E5DED4;
			border-radius: 6px;
			cursor: pointer;
			transition: box-shadow 0.15s, border-color 0.15s;
		}
		.bookshop-book-card:hover {
			border-color: #D4A373;
			box-shadow: 0 2px 8px rgba(38,70,83,0.1);
		}
		.bookshop-book-cover {
			width: 80px;
			height: 120px;
			border-radius: 4px;
			object-fit: cover;
			flex-shrink: 0;
			background: #F0ECE4;
		}
		.bookshop-book-info {
			flex: 1;
			min-width: 0;
		}
		.bookshop-book-title {
			font-weight: 600;
			font-size: 1em;
			color: #264653;
			margin: 0 0 0.2em;
		}
		.bookshop-book-author {
			font-size: 0.85em;
			color: #8A7F72;
			margin: 0 0 0.4em;
		}
		.bookshop-book-genre {
			display: inline-block;
			font-size: 0.7em;
			padding: 0.15em 0.5em;
			background: #E8E3D8;
			color: #5E5549;
			border-radius: 3px;
			margin-bottom: 0.4em;
		}
		.bookshop-book-price {
			font-weight: 700;
			color: #2E7D74;
			font-size: 1.05em;
		}
		.bookshop-book-stock {
			font-size: 0.75em;
			margin-left: 0.5em;
		}
		.bookshop-book-stock.in-stock {
			color: #2E7D74;
		}
		.bookshop-book-stock.out-of-stock {
			color: #E76F51;
		}
	`,

	Templates:
	[
		{
			Hash: "Bookshop-BookList-Template",
			Template: /*html*/`<div id="Bookshop-BookList-Body"></div>`
		}
	],

	Renderables:
	[
		{
			RenderableHash: "Bookshop-BookList-Display",
			TemplateHash: "Bookshop-BookList-Template",
			DestinationAddress: "#Bookshop-Content-Container",
			RenderMethod: "replace"
		}
	]
};

class BookshopBookListView extends libPictView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
	}

	onAfterRender()
	{
		this._renderBookList();
		return super.onAfterRender();
	}

	_renderBookList()
	{
		if (typeof document === 'undefined')
		{
			return;
		}

		let tmpContainer = document.getElementById('Bookshop-BookList-Body');
		if (!tmpContainer)
		{
			return;
		}

		let tmpState = this.pict.AppData.Bookshop;
		let tmpBooks = tmpState.Books || [];
		let tmpGenreFilter = tmpState.GenreFilter || '';

		// Collect unique genres
		let tmpGenres = [];
		for (let i = 0; i < tmpBooks.length; i++)
		{
			if (tmpGenres.indexOf(tmpBooks[i].Genre) < 0)
			{
				tmpGenres.push(tmpBooks[i].Genre);
			}
		}
		tmpGenres.sort();

		// Filter books by genre
		let tmpFilteredBooks = tmpBooks;
		if (tmpGenreFilter)
		{
			tmpFilteredBooks = tmpBooks.filter((pBook) => { return pBook.Genre === tmpGenreFilter; });
		}

		let tmpHTML = '';

		// Section header with help button
		tmpHTML += '<div class="bookshop-section-header">';
		tmpHTML += '<h2 class="bookshop-section-title" data-d-tooltip="catalog-title">Book Catalog</h2>';
		tmpHTML += '<span data-d-tooltip="catalog-info" data-d-tooltip-icon></span>';
		tmpHTML += '<button class="bookshop-help-btn" id="Bookshop-Help-BookList" title="Help: Book Catalog">?</button>';
		tmpHTML += '</div>';

		// Filter bar with help button
		tmpHTML += '<div class="bookshop-filter-bar">';
		tmpHTML += '<label data-d-tooltip="genre-filter">Genre:</label>';
		tmpHTML += '<select id="Bookshop-GenreFilter">';
		tmpHTML += '<option value="">All Genres</option>';
		for (let g = 0; g < tmpGenres.length; g++)
		{
			let tmpSelected = (tmpGenreFilter === tmpGenres[g]) ? ' selected' : '';
			tmpHTML += '<option value="' + tmpGenres[g] + '"' + tmpSelected + '>' + tmpGenres[g] + '</option>';
		}
		tmpHTML += '</select>';
		tmpHTML += '<span data-d-tooltip="filter-info" data-d-tooltip-icon></span>';
		tmpHTML += '<button class="bookshop-help-btn" id="Bookshop-Help-Search" title="Help: Search & Filter">?</button>';
		tmpHTML += '</div>';

		// Book grid
		tmpHTML += '<div class="bookshop-book-grid">';
		for (let i = 0; i < tmpFilteredBooks.length; i++)
		{
			let tmpBook = tmpFilteredBooks[i];
			let tmpStockClass = tmpBook.InStock ? 'in-stock' : 'out-of-stock';
			let tmpStockText = tmpBook.InStock ? 'In Stock' : 'Out of Stock';

			tmpHTML += '<div class="bookshop-book-card" data-book-id="' + tmpBook.IDBook + '">';
			tmpHTML += '<img class="bookshop-book-cover" src="' + tmpBook.Cover + '" alt="' + tmpBook.Title + '">';
			tmpHTML += '<div class="bookshop-book-info">';
			tmpHTML += '<p class="bookshop-book-title">' + tmpBook.Title + '</p>';
			tmpHTML += '<p class="bookshop-book-author">' + tmpBook.Author + '</p>';
			tmpHTML += '<span class="bookshop-book-genre" data-d-tooltip="book-genre">' + tmpBook.Genre + '</span>';
			tmpHTML += '<div>';
			tmpHTML += '<span class="bookshop-book-price" data-d-tooltip="book-price">$' + tmpBook.Price.toFixed(2) + '</span>';
			tmpHTML += '<span class="bookshop-book-stock ' + tmpStockClass + '" data-d-tooltip="stock-status">' + tmpStockText + '</span>';
			tmpHTML += '</div>';
			tmpHTML += '</div>';
			tmpHTML += '</div>';
		}
		tmpHTML += '</div>';

		tmpContainer.innerHTML = tmpHTML;

		// Wire click handlers
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

		// Book cards
		let tmpCards = pContainer.querySelectorAll('.bookshop-book-card');
		for (let i = 0; i < tmpCards.length; i++)
		{
			let tmpCard = tmpCards[i];
			tmpCard.addEventListener('click', () =>
			{
				let tmpID = parseInt(tmpCard.getAttribute('data-book-id'));
				if (tmpApp)
				{
					tmpApp.showBook(tmpID);
				}
			});
		}

		// Genre filter
		let tmpSelect = pContainer.querySelector('#Bookshop-GenreFilter');
		if (tmpSelect)
		{
			tmpSelect.addEventListener('change', () =>
			{
				if (tmpApp)
				{
					tmpApp.filterByGenre(tmpSelect.value);
				}
			});
		}

		// Help buttons
		let tmpHelpBookList = pContainer.querySelector('#Bookshop-Help-BookList');
		if (tmpHelpBookList)
		{
			tmpHelpBookList.addEventListener('click', (pEvent) =>
			{
				pEvent.stopPropagation();
				if (tmpApp)
				{
					tmpApp.showHelp('BOOKSHOP-BOOKLIST');
				}
			});
		}

		let tmpHelpSearch = pContainer.querySelector('#Bookshop-Help-Search');
		if (tmpHelpSearch)
		{
			tmpHelpSearch.addEventListener('click', (pEvent) =>
			{
				pEvent.stopPropagation();
				if (tmpApp)
				{
					tmpApp.showHelp('BOOKSHOP-SEARCH');
				}
			});
		}
	}
}

module.exports = BookshopBookListView;

module.exports.default_configuration = _ViewConfiguration;
