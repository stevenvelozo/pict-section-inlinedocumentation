const libPictApplication = require('pict-application');

const libInlineDocumentation = require('../../source/Pict-Section-InlineDocumentation.js');

const libViewBookList = require('./views/PictView-Bookshop-BookList.js');
const libViewStore = require('./views/PictView-Bookshop-Store.js');
const libViewHelpToggle = require('./views/PictView-Bookshop-HelpToggle.js');

const _BookshopData = require('./data/BookshopData.json');
const _TopicsData = require('./data/pict_documentation_topics.json');

class BookshopApplication extends libPictApplication
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);

		// Add the inline documentation provider
		this.pict.addProvider('Pict-InlineDocumentation', libInlineDocumentation.default_configuration, libInlineDocumentation);

		// Add application views
		this.pict.addView('Bookshop-BookList', libViewBookList.default_configuration, libViewBookList);
		this.pict.addView('Bookshop-Store', libViewStore.default_configuration, libViewStore);
		this.pict.addView('Bookshop-HelpToggle', libViewHelpToggle.default_configuration, libViewHelpToggle);
	}

	onAfterInitializeAsync(fCallback)
	{
		// Initialize application state
		this.pict.AppData.Bookshop =
		{
			Books: _BookshopData.Books,
			CurrentBook: null,
			CurrentView: 'BookList',
			GenreFilter: '',
			HelpVisible: false,
			HelpTopicCode: 'BOOKSHOP-WELCOME'
		};

		// Pre-load topics into the inline documentation state
		if (!this.pict.AppData.InlineDocumentation)
		{
			this.pict.AppData.InlineDocumentation = {};
		}
		this.pict.AppData.InlineDocumentation.Topics = _TopicsData;

		// Initialize inline documentation
		let tmpDocProvider = this.pict.providers['Pict-InlineDocumentation'];
		tmpDocProvider.initializeDocumentation(
			{
				DocsBaseURL: 'docs/',
				onSave: (pSaveData, fSaveCallback) =>
				{
					// Demo save handler — log to console
					this.log.info(`Bookshop: Saving document [${pSaveData.Path}] (${pSaveData.Content.length} chars)`);
					// In a real app, this would PUT to an API
					return fSaveCallback(null);
				},
				onTopicsSave: (pTopics, fSaveCallback) =>
				{
					// Demo topics save handler — log to console
					this.log.info(`Bookshop: Saving topics (${Object.keys(pTopics).length} topics)`);
					// In a real app, this would PUT to an API
					return fSaveCallback(null);
				},
				onImageUpload: (pFile, pDocumentPath, fCallback) =>
				{
					// Demo image upload handler — log to console
					this.log.info(`Bookshop: Image upload [${pFile.name}] (${pFile.size} bytes) for document [${pDocumentPath}]`);
					// In a real app, this would POST the file to a server
					// and return a relative URL for the markdown reference.
					// For the demo, fall back to base64 by returning an error.
					return fCallback('Demo mode: no upload server configured');
				}
			},
			() =>
			{
				// Enable edit mode for demo
				tmpDocProvider.setEditEnabled(true);

				// Render the main book list
				this.pict.views['Bookshop-BookList'].render();

				// Load help for the initial route
				tmpDocProvider.navigateToRoute('/books');

				// Set up F1 keyboard listener
				this._setupKeyboardShortcuts();

				return super.onAfterInitializeAsync(fCallback);
			});
	}

	/**
	 * Set up the F1 keyboard shortcut for toggling help.
	 */
	_setupKeyboardShortcuts()
	{
		if (typeof document === 'undefined')
		{
			return;
		}

		document.addEventListener('keydown', (pEvent) =>
		{
			if (pEvent.key === 'F1')
			{
				pEvent.preventDefault();
				this.toggleHelp();
			}
		});
	}

	/**
	 * Toggle the help panel visibility.
	 */
	toggleHelp()
	{
		let tmpState = this.pict.AppData.Bookshop;
		tmpState.HelpVisible = !tmpState.HelpVisible;

		let tmpHelpPanel = document.getElementById('Bookshop-Help-Panel');
		let tmpContentArea = document.getElementById('Bookshop-Content-Area');

		if (tmpState.HelpVisible)
		{
			if (tmpHelpPanel) { tmpHelpPanel.classList.add('visible'); }
			if (tmpContentArea) { tmpContentArea.classList.add('help-open'); }
		}
		else
		{
			if (tmpHelpPanel) { tmpHelpPanel.classList.remove('visible'); }
			if (tmpContentArea) { tmpContentArea.classList.remove('help-open'); }
		}
	}

	/**
	 * Show contextual help for a specific topic code.
	 *
	 * @param {string} pTopicCode - The TopicCode from pict_documentation_topics.json
	 */
	showHelp(pTopicCode)
	{
		let tmpState = this.pict.AppData.Bookshop;
		let tmpDocProvider = this.pict.providers['Pict-InlineDocumentation'];

		tmpState.HelpTopicCode = pTopicCode;

		// Ensure help panel is visible
		if (!tmpState.HelpVisible)
		{
			tmpState.HelpVisible = true;
			let tmpHelpPanel = document.getElementById('Bookshop-Help-Panel');
			let tmpContentArea = document.getElementById('Bookshop-Content-Area');
			if (tmpHelpPanel) { tmpHelpPanel.classList.add('visible'); }
			if (tmpContentArea) { tmpContentArea.classList.add('help-open'); }
		}

		// Load the topic document
		tmpDocProvider.loadTopicDocument(pTopicCode);
	}

	/**
	 * Navigate to a specific book's store page.
	 *
	 * @param {number} pBookID - The book ID
	 */
	showBook(pBookID)
	{
		let tmpState = this.pict.AppData.Bookshop;
		let tmpDocProvider = this.pict.providers['Pict-InlineDocumentation'];

		for (let i = 0; i < tmpState.Books.length; i++)
		{
			if (tmpState.Books[i].IDBook === pBookID)
			{
				tmpState.CurrentBook = tmpState.Books[i];
				tmpState.CurrentView = 'Store';
				this.pict.views['Bookshop-Store'].render();

				// Update help for the store route
				tmpDocProvider.navigateToRoute('/books/store/' + pBookID);
				return;
			}
		}
	}

	/**
	 * Navigate back to the book list.
	 */
	showBookList()
	{
		let tmpState = this.pict.AppData.Bookshop;
		let tmpDocProvider = this.pict.providers['Pict-InlineDocumentation'];

		tmpState.CurrentBook = null;
		tmpState.CurrentView = 'BookList';
		this.pict.views['Bookshop-BookList'].render();

		// Update help for the book list route
		tmpDocProvider.navigateToRoute('/books');
	}

	/**
	 * Filter books by genre.
	 *
	 * @param {string} pGenre - The genre to filter by (empty for all)
	 */
	filterByGenre(pGenre)
	{
		this.pict.AppData.Bookshop.GenreFilter = pGenre || '';
		this.pict.views['Bookshop-BookList'].render();
	}
}

module.exports = BookshopApplication;

module.exports.default_configuration = require('./Pict-Application-Bookshop-Configuration.json');
