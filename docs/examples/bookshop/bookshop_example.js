"use strict";function _defineProperty(e,r,t){return(r=_toPropertyKey(r))in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e;}function _toPropertyKey(t){var i=_toPrimitive(t,"string");return"symbol"==typeof i?i:i+"";}function _toPrimitive(t,r){if("object"!=typeof t||!t)return t;var e=t[Symbol.toPrimitive];if(void 0!==e){var i=e.call(t,r||"default");if("object"!=typeof i)return i;throw new TypeError("@@toPrimitive must return a primitive value.");}return("string"===r?String:Number)(t);}(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f();}else if(typeof define==="function"&&define.amd){define([],f);}else{var g;if(typeof window!=="undefined"){g=window;}else if(typeof global!=="undefined"){g=global;}else if(typeof self!=="undefined"){g=self;}else{g=this;}g.BookshopExample=f();}})(function(){var define,module,exports;return function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a;}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r);},p,p.exports,r,e,n,t);}return n[i].exports;}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o;}return r;}()({1:[function(require,module,exports){module.exports={"Name":"Bookshop","Hash":"Bookshop","MainViewportViewIdentifier":"Bookshop-BookList","AutoSolveAfterInitialize":true,"AutoRenderMainViewportViewAfterInitialize":false,"AutoRenderViewsAfterInitialize":false,"pict_configuration":{"Product":"Bookshop-Pict-Application"}};},{}],2:[function(require,module,exports){const libPictApplication=require('pict-application');const libInlineDocumentation=require('../../source/Pict-Section-InlineDocumentation.js');const libViewBookList=require('./views/PictView-Bookshop-BookList.js');const libViewStore=require('./views/PictView-Bookshop-Store.js');const libViewHelpToggle=require('./views/PictView-Bookshop-HelpToggle.js');const _BookshopData=require('./data/BookshopData.json');const _TopicsData=require('./data/pict_documentation_topics.json');class BookshopApplication extends libPictApplication{constructor(pFable,pOptions,pServiceHash){super(pFable,pOptions,pServiceHash);// Add the inline documentation provider
this.pict.addProvider('Pict-InlineDocumentation',libInlineDocumentation.default_configuration,libInlineDocumentation);// Add application views
this.pict.addView('Bookshop-BookList',libViewBookList.default_configuration,libViewBookList);this.pict.addView('Bookshop-Store',libViewStore.default_configuration,libViewStore);this.pict.addView('Bookshop-HelpToggle',libViewHelpToggle.default_configuration,libViewHelpToggle);}onAfterInitializeAsync(fCallback){// Initialize application state
this.pict.AppData.Bookshop={Books:_BookshopData.Books,CurrentBook:null,CurrentView:'BookList',GenreFilter:'',HelpVisible:false,HelpTopicCode:'BOOKSHOP-WELCOME'};// Pre-load topics into the inline documentation state
if(!this.pict.AppData.InlineDocumentation){this.pict.AppData.InlineDocumentation={};}this.pict.AppData.InlineDocumentation.Topics=_TopicsData;// Initialize inline documentation
let tmpDocProvider=this.pict.providers['Pict-InlineDocumentation'];tmpDocProvider.initializeDocumentation({DocsBaseURL:'docs/',onSave:(pSaveData,fSaveCallback)=>{// Demo save handler — log to console
this.log.info("Bookshop: Saving document [".concat(pSaveData.Path,"] (").concat(pSaveData.Content.length," chars)"));// In a real app, this would PUT to an API
return fSaveCallback(null);},onTopicsSave:(pTopics,fSaveCallback)=>{// Demo topics save handler — log to console
this.log.info("Bookshop: Saving topics (".concat(Object.keys(pTopics).length," topics)"));// In a real app, this would PUT to an API
return fSaveCallback(null);},onImageUpload:(pFile,pDocumentPath,fCallback)=>{// Demo image upload handler — log to console
this.log.info("Bookshop: Image upload [".concat(pFile.name,"] (").concat(pFile.size," bytes) for document [").concat(pDocumentPath,"]"));// In a real app, this would POST the file to a server
// and return a relative URL for the markdown reference.
// For the demo, fall back to base64 by returning an error.
return fCallback('Demo mode: no upload server configured');}},()=>{// Enable edit mode for demo
tmpDocProvider.setEditEnabled(true);// Render the main book list
this.pict.views['Bookshop-BookList'].render();// Load help for the initial route
tmpDocProvider.navigateToRoute('/books');// Set up F1 keyboard listener
this._setupKeyboardShortcuts();return super.onAfterInitializeAsync(fCallback);});}/**
	 * Set up the F1 keyboard shortcut for toggling help.
	 */_setupKeyboardShortcuts(){if(typeof document==='undefined'){return;}document.addEventListener('keydown',pEvent=>{if(pEvent.key==='F1'){pEvent.preventDefault();this.toggleHelp();}});}/**
	 * Toggle the help panel visibility.
	 */toggleHelp(){let tmpState=this.pict.AppData.Bookshop;tmpState.HelpVisible=!tmpState.HelpVisible;let tmpHelpPanel=document.getElementById('Bookshop-Help-Panel');let tmpContentArea=document.getElementById('Bookshop-Content-Area');if(tmpState.HelpVisible){if(tmpHelpPanel){tmpHelpPanel.classList.add('visible');}if(tmpContentArea){tmpContentArea.classList.add('help-open');}}else{if(tmpHelpPanel){tmpHelpPanel.classList.remove('visible');}if(tmpContentArea){tmpContentArea.classList.remove('help-open');}}}/**
	 * Show contextual help for a specific topic code.
	 *
	 * @param {string} pTopicCode - The TopicCode from pict_documentation_topics.json
	 */showHelp(pTopicCode){let tmpState=this.pict.AppData.Bookshop;let tmpDocProvider=this.pict.providers['Pict-InlineDocumentation'];tmpState.HelpTopicCode=pTopicCode;// Ensure help panel is visible
if(!tmpState.HelpVisible){tmpState.HelpVisible=true;let tmpHelpPanel=document.getElementById('Bookshop-Help-Panel');let tmpContentArea=document.getElementById('Bookshop-Content-Area');if(tmpHelpPanel){tmpHelpPanel.classList.add('visible');}if(tmpContentArea){tmpContentArea.classList.add('help-open');}}// Load the topic document
tmpDocProvider.loadTopicDocument(pTopicCode);}/**
	 * Navigate to a specific book's store page.
	 *
	 * @param {number} pBookID - The book ID
	 */showBook(pBookID){let tmpState=this.pict.AppData.Bookshop;let tmpDocProvider=this.pict.providers['Pict-InlineDocumentation'];for(let i=0;i<tmpState.Books.length;i++){if(tmpState.Books[i].IDBook===pBookID){tmpState.CurrentBook=tmpState.Books[i];tmpState.CurrentView='Store';this.pict.views['Bookshop-Store'].render();// Update help for the store route
tmpDocProvider.navigateToRoute('/books/store/'+pBookID);return;}}}/**
	 * Navigate back to the book list.
	 */showBookList(){let tmpState=this.pict.AppData.Bookshop;let tmpDocProvider=this.pict.providers['Pict-InlineDocumentation'];tmpState.CurrentBook=null;tmpState.CurrentView='BookList';this.pict.views['Bookshop-BookList'].render();// Update help for the book list route
tmpDocProvider.navigateToRoute('/books');}/**
	 * Filter books by genre.
	 *
	 * @param {string} pGenre - The genre to filter by (empty for all)
	 */filterByGenre(pGenre){this.pict.AppData.Bookshop.GenreFilter=pGenre||'';this.pict.views['Bookshop-BookList'].render();}}module.exports=BookshopApplication;module.exports.default_configuration=require('./Pict-Application-Bookshop-Configuration.json');},{"../../source/Pict-Section-InlineDocumentation.js":24,"./Pict-Application-Bookshop-Configuration.json":1,"./data/BookshopData.json":3,"./data/pict_documentation_topics.json":4,"./views/PictView-Bookshop-BookList.js":5,"./views/PictView-Bookshop-HelpToggle.js":6,"./views/PictView-Bookshop-Store.js":7,"pict-application":12}],3:[function(require,module,exports){module.exports={"Books":[{"IDBook":1,"Title":"The Pragmatic Programmer","Author":"David Thomas & Andrew Hunt","Price":49.99,"Genre":"Software Engineering","Cover":"https://picsum.photos/seed/pragprog/120/180","Description":"A classic guide to software craftsmanship covering topics from personal responsibility to architectural techniques.","InStock":true},{"IDBook":2,"Title":"Designing Data-Intensive Applications","Author":"Martin Kleppmann","Price":44.99,"Genre":"Distributed Systems","Cover":"https://picsum.photos/seed/dataintensive/120/180","Description":"The big ideas behind reliable, scalable, and maintainable systems, with detailed analysis of the algorithms and protocols.","InStock":true},{"IDBook":3,"Title":"Structure and Interpretation of Computer Programs","Author":"Harold Abelson & Gerald Jay Sussman","Price":39.99,"Genre":"Computer Science","Cover":"https://picsum.photos/seed/sicp/120/180","Description":"The legendary MIT textbook introducing core concepts of computation through Scheme.","InStock":false},{"IDBook":4,"Title":"Clean Code","Author":"Robert C. Martin","Price":37.99,"Genre":"Software Engineering","Cover":"https://picsum.photos/seed/cleancode/120/180","Description":"A handbook of agile software craftsmanship with practical advice for writing better code.","InStock":true},{"IDBook":5,"Title":"The Art of Computer Programming","Author":"Donald E. Knuth","Price":79.99,"Genre":"Computer Science","Cover":"https://picsum.photos/seed/taocp/120/180","Description":"Knuth's monumental multi-volume work covering fundamental algorithms and data structures.","InStock":true},{"IDBook":6,"Title":"Refactoring","Author":"Martin Fowler","Price":42.99,"Genre":"Software Engineering","Cover":"https://picsum.photos/seed/refactoring/120/180","Description":"Improving the design of existing code through systematic transformations with catalog of refactoring patterns.","InStock":true}]};},{}],4:[function(require,module,exports){module.exports={"BOOKSHOP-WELCOME":{"TopicCode":"BOOKSHOP-WELCOME","TopicHelpFilePath":"welcome.md","TopicTitle":"Welcome to the Bookshop","Routes":["/"]},"BOOKSHOP-BOOKLIST":{"TopicCode":"BOOKSHOP-BOOKLIST","TopicHelpFilePath":"book-list.md","TopicTitle":"Browsing the Book Catalog","Routes":["/books","/books/catalog"],"Tooltips":{"catalog-title":{"Content":"Browse our full collection of books. Click any book to view details and purchase.\n\nSee [Book Catalog Help](help:book-list.md) for the full guide."},"catalog-info":{"Content":"**Tip:** Use the genre filter to narrow results, or click a book card to visit its store page.\n\nLearn more: [Searching & Filtering](help:search-filter.md)"},"genre-filter":{"Content":"Filter the catalog by literary genre. Select **All Genres** to see everything.\n\nFor advanced filtering tips, see [Search & Filter Guide](help:search-filter.md)."},"book-price":{"Content":"All prices are in **USD** and include tax.\n\nSee [Store Page Help → Pricing](help:store.md#pricing) for details."},"stock-status":{"Content":"**In Stock** means the book is available for immediate purchase. **Out of Stock** items cannot be added to cart.\n\nMore info: [Store Help → Availability](help:store.md#availability)"}}},"BOOKSHOP-BOOKDETAIL":{"TopicCode":"BOOKSHOP-BOOKDETAIL","TopicHelpFilePath":"book-detail.md","TopicTitle":"Book Details & Purchasing","Routes":["/books/detail/*"]},"BOOKSHOP-STORE":{"TopicCode":"BOOKSHOP-STORE","TopicHelpFilePath":"store.md","TopicTitle":"The Store Page","Routes":["/books/store/*"],"Tooltips":{"genre-badge":{"Content":"Books are categorized by genre to help you find similar titles.\n\nSee the [full catalog](help:book-list.md) to browse by genre."},"store-price":{"Content":"The listed price is the final price in **USD**, tax included.\n\n[Pricing details](help:store.md#pricing)"},"store-stock":{"Content":"Real-time availability. Out of stock items may be restocked — check back later.\n\n[Availability info](help:store.md#availability)"},"add-to-cart":{"Content":"Adds this book to your shopping cart. You can review your cart before checkout.\n\nSee [Store Help](help:store.md) for the full purchasing guide."},"cart-info":{"Content":"**Shopping Cart:** Items stay in your cart until you complete checkout or remove them.\n\nFor help: [Store Guide](help:store.md) | [Book Details](help:book-detail.md)"}}},"BOOKSHOP-SEARCH":{"TopicCode":"BOOKSHOP-SEARCH","TopicHelpFilePath":"search-filter.md","TopicTitle":"Searching & Filtering","Routes":["/books/search","/books/filter"]}};},{}],5:[function(require,module,exports){const libPictView=require('pict-view');const _ViewConfiguration={ViewIdentifier:"Bookshop-BookList",DefaultRenderable:"Bookshop-BookList-Display",DefaultDestinationAddress:"#Bookshop-Content-Container",AutoRender:false,CSS:/*css*/"\n\t\t.bookshop-section-header {\n\t\t\tdisplay: flex;\n\t\t\talign-items: center;\n\t\t\tgap: 0.5em;\n\t\t\tmargin-bottom: 1em;\n\t\t}\n\t\t.bookshop-section-title {\n\t\t\tfont-size: 1.5em;\n\t\t\tfont-weight: 700;\n\t\t\tcolor: #264653;\n\t\t\tmargin: 0;\n\t\t}\n\t\t.bookshop-help-btn {\n\t\t\tdisplay: inline-flex;\n\t\t\talign-items: center;\n\t\t\tjustify-content: center;\n\t\t\twidth: 22px;\n\t\t\theight: 22px;\n\t\t\tborder-radius: 50%;\n\t\t\tborder: 2px solid #D4A373;\n\t\t\tbackground: transparent;\n\t\t\tcolor: #D4A373;\n\t\t\tfont-size: 0.75em;\n\t\t\tfont-weight: 700;\n\t\t\tcursor: pointer;\n\t\t\tline-height: 1;\n\t\t\tpadding: 0;\n\t\t\ttransition: background 0.15s, color 0.15s;\n\t\t\tflex-shrink: 0;\n\t\t}\n\t\t.bookshop-help-btn:hover {\n\t\t\tbackground: #D4A373;\n\t\t\tcolor: var(--theme-color-background-panel, #fff);\n\t\t}\n\t\t.bookshop-filter-bar {\n\t\t\tmargin-bottom: 1.25em;\n\t\t\tdisplay: flex;\n\t\t\talign-items: center;\n\t\t\tgap: 0.75em;\n\t\t}\n\t\t.bookshop-filter-bar label {\n\t\t\tfont-size: 0.85em;\n\t\t\tfont-weight: 600;\n\t\t\tcolor: var(--theme-color-text-secondary, #5E5549);\n\t\t}\n\t\t.bookshop-filter-bar select {\n\t\t\tpadding: 0.35em 0.7em;\n\t\t\tborder: 1px solid #D4A373;\n\t\t\tborder-radius: 4px;\n\t\t\tfont-size: 0.85em;\n\t\t\tbackground: var(--theme-color-background-panel, #fff);\n\t\t\tcolor: #264653;\n\t\t}\n\t\t.bookshop-book-grid {\n\t\t\tdisplay: grid;\n\t\t\tgrid-template-columns: repeat(auto-fill, minmax(280px, 1fr));\n\t\t\tgap: 1.25em;\n\t\t}\n\t\t.bookshop-book-card {\n\t\t\tdisplay: flex;\n\t\t\tgap: 1em;\n\t\t\tpadding: 1em;\n\t\t\tbackground: var(--theme-color-background-panel, #fff);\n\t\t\tborder: 1px solid #E5DED4;\n\t\t\tborder-radius: 6px;\n\t\t\tcursor: pointer;\n\t\t\ttransition: box-shadow 0.15s, border-color 0.15s;\n\t\t}\n\t\t.bookshop-book-card:hover {\n\t\t\tborder-color: #D4A373;\n\t\t\tbox-shadow: 0 2px 8px rgba(38,70,83,0.1);\n\t\t}\n\t\t.bookshop-book-cover {\n\t\t\twidth: 80px;\n\t\t\theight: 120px;\n\t\t\tborder-radius: 4px;\n\t\t\tobject-fit: cover;\n\t\t\tflex-shrink: 0;\n\t\t\tbackground: var(--theme-color-background-secondary, #F0ECE4);\n\t\t}\n\t\t.bookshop-book-info {\n\t\t\tflex: 1;\n\t\t\tmin-width: 0;\n\t\t}\n\t\t.bookshop-book-title {\n\t\t\tfont-weight: 600;\n\t\t\tfont-size: 1em;\n\t\t\tcolor: #264653;\n\t\t\tmargin: 0 0 0.2em;\n\t\t}\n\t\t.bookshop-book-author {\n\t\t\tfont-size: 0.85em;\n\t\t\tcolor: #8A7F72;\n\t\t\tmargin: 0 0 0.4em;\n\t\t}\n\t\t.bookshop-book-genre {\n\t\t\tdisplay: inline-block;\n\t\t\tfont-size: 0.7em;\n\t\t\tpadding: 0.15em 0.5em;\n\t\t\tbackground: #E8E3D8;\n\t\t\tcolor: var(--theme-color-text-secondary, #5E5549);\n\t\t\tborder-radius: 3px;\n\t\t\tmargin-bottom: 0.4em;\n\t\t}\n\t\t.bookshop-book-price {\n\t\t\tfont-weight: 700;\n\t\t\tcolor: #2E7D74;\n\t\t\tfont-size: 1.05em;\n\t\t}\n\t\t.bookshop-book-stock {\n\t\t\tfont-size: 0.75em;\n\t\t\tmargin-left: 0.5em;\n\t\t}\n\t\t.bookshop-book-stock.in-stock {\n\t\t\tcolor: #2E7D74;\n\t\t}\n\t\t.bookshop-book-stock.out-of-stock {\n\t\t\tcolor: #E76F51;\n\t\t}\n\t",Templates:[{Hash:"Bookshop-BookList-Template",Template:/*html*/"<div id=\"Bookshop-BookList-Body\"></div>"}],Renderables:[{RenderableHash:"Bookshop-BookList-Display",TemplateHash:"Bookshop-BookList-Template",DestinationAddress:"#Bookshop-Content-Container",RenderMethod:"replace"}]};class BookshopBookListView extends libPictView{constructor(pFable,pOptions,pServiceHash){super(pFable,pOptions,pServiceHash);}onAfterRender(){this._renderBookList();return super.onAfterRender();}_renderBookList(){if(typeof document==='undefined'){return;}let tmpContainer=document.getElementById('Bookshop-BookList-Body');if(!tmpContainer){return;}let tmpState=this.pict.AppData.Bookshop;let tmpBooks=tmpState.Books||[];let tmpGenreFilter=tmpState.GenreFilter||'';// Collect unique genres
let tmpGenres=[];for(let i=0;i<tmpBooks.length;i++){if(tmpGenres.indexOf(tmpBooks[i].Genre)<0){tmpGenres.push(tmpBooks[i].Genre);}}tmpGenres.sort();// Filter books by genre
let tmpFilteredBooks=tmpBooks;if(tmpGenreFilter){tmpFilteredBooks=tmpBooks.filter(pBook=>{return pBook.Genre===tmpGenreFilter;});}let tmpHTML='';// Section header with help button
tmpHTML+='<div class="bookshop-section-header">';tmpHTML+='<h2 class="bookshop-section-title" data-d-tooltip="catalog-title">Book Catalog</h2>';tmpHTML+='<span data-d-tooltip="catalog-info" data-d-tooltip-icon></span>';tmpHTML+='<button class="bookshop-help-btn" id="Bookshop-Help-BookList" title="Help: Book Catalog">?</button>';tmpHTML+='</div>';// Filter bar with help button
tmpHTML+='<div class="bookshop-filter-bar">';tmpHTML+='<label data-d-tooltip="genre-filter">Genre:</label>';tmpHTML+='<select id="Bookshop-GenreFilter">';tmpHTML+='<option value="">All Genres</option>';for(let g=0;g<tmpGenres.length;g++){let tmpSelected=tmpGenreFilter===tmpGenres[g]?' selected':'';tmpHTML+='<option value="'+tmpGenres[g]+'"'+tmpSelected+'>'+tmpGenres[g]+'</option>';}tmpHTML+='</select>';tmpHTML+='<span data-d-tooltip="filter-info" data-d-tooltip-icon></span>';tmpHTML+='<button class="bookshop-help-btn" id="Bookshop-Help-Search" title="Help: Search & Filter">?</button>';tmpHTML+='</div>';// Book grid
tmpHTML+='<div class="bookshop-book-grid">';for(let i=0;i<tmpFilteredBooks.length;i++){let tmpBook=tmpFilteredBooks[i];let tmpStockClass=tmpBook.InStock?'in-stock':'out-of-stock';let tmpStockText=tmpBook.InStock?'In Stock':'Out of Stock';tmpHTML+='<div class="bookshop-book-card" data-book-id="'+tmpBook.IDBook+'">';tmpHTML+='<img class="bookshop-book-cover" src="'+tmpBook.Cover+'" alt="'+tmpBook.Title+'">';tmpHTML+='<div class="bookshop-book-info">';tmpHTML+='<p class="bookshop-book-title">'+tmpBook.Title+'</p>';tmpHTML+='<p class="bookshop-book-author">'+tmpBook.Author+'</p>';tmpHTML+='<span class="bookshop-book-genre" data-d-tooltip="book-genre">'+tmpBook.Genre+'</span>';tmpHTML+='<div>';tmpHTML+='<span class="bookshop-book-price" data-d-tooltip="book-price">$'+tmpBook.Price.toFixed(2)+'</span>';tmpHTML+='<span class="bookshop-book-stock '+tmpStockClass+'" data-d-tooltip="stock-status">'+tmpStockText+'</span>';tmpHTML+='</div>';tmpHTML+='</div>';tmpHTML+='</div>';}tmpHTML+='</div>';tmpContainer.innerHTML=tmpHTML;// Wire click handlers
this._wireHandlers(tmpContainer);// Scan for tooltip placeholders
let tmpDocProvider=this.pict.providers['Pict-InlineDocumentation'];if(tmpDocProvider){tmpDocProvider.scanTooltips();}}_wireHandlers(pContainer){let tmpApp=this.pict.PictApplication;// Book cards
let tmpCards=pContainer.querySelectorAll('.bookshop-book-card');for(let i=0;i<tmpCards.length;i++){let tmpCard=tmpCards[i];tmpCard.addEventListener('click',()=>{let tmpID=parseInt(tmpCard.getAttribute('data-book-id'));if(tmpApp){tmpApp.showBook(tmpID);}});}// Genre filter
let tmpSelect=pContainer.querySelector('#Bookshop-GenreFilter');if(tmpSelect){tmpSelect.addEventListener('change',()=>{if(tmpApp){tmpApp.filterByGenre(tmpSelect.value);}});}// Help buttons
let tmpHelpBookList=pContainer.querySelector('#Bookshop-Help-BookList');if(tmpHelpBookList){tmpHelpBookList.addEventListener('click',pEvent=>{pEvent.stopPropagation();if(tmpApp){tmpApp.showHelp('BOOKSHOP-BOOKLIST');}});}let tmpHelpSearch=pContainer.querySelector('#Bookshop-Help-Search');if(tmpHelpSearch){tmpHelpSearch.addEventListener('click',pEvent=>{pEvent.stopPropagation();if(tmpApp){tmpApp.showHelp('BOOKSHOP-SEARCH');}});}}}module.exports=BookshopBookListView;module.exports.default_configuration=_ViewConfiguration;},{"pict-view":23}],6:[function(require,module,exports){const libPictView=require('pict-view');const _ViewConfiguration={ViewIdentifier:"Bookshop-HelpToggle",DefaultRenderable:"Bookshop-HelpToggle-Display",DefaultDestinationAddress:"#Bookshop-Help-Toggle-Container",AutoRender:false,CSS:/*css*/"\n\t",Templates:[{Hash:"Bookshop-HelpToggle-Template",Template:/*html*/"<span></span>"}],Renderables:[{RenderableHash:"Bookshop-HelpToggle-Display",TemplateHash:"Bookshop-HelpToggle-Template",DestinationAddress:"#Bookshop-Help-Toggle-Container",RenderMethod:"replace"}]};class BookshopHelpToggleView extends libPictView{constructor(pFable,pOptions,pServiceHash){super(pFable,pOptions,pServiceHash);}}module.exports=BookshopHelpToggleView;module.exports.default_configuration=_ViewConfiguration;},{"pict-view":23}],7:[function(require,module,exports){const libPictView=require('pict-view');const _ViewConfiguration={ViewIdentifier:"Bookshop-Store",DefaultRenderable:"Bookshop-Store-Display",DefaultDestinationAddress:"#Bookshop-Content-Container",AutoRender:false,CSS:/*css*/"\n\t\t.bookshop-store {\n\t\t\tpadding: 0;\n\t\t}\n\t\t.bookshop-store-back {\n\t\t\tdisplay: inline-flex;\n\t\t\talign-items: center;\n\t\t\tgap: 0.3em;\n\t\t\tpadding: 0.4em 0.8em;\n\t\t\tborder: 1px solid #D4A373;\n\t\t\tborder-radius: 4px;\n\t\t\tbackground: var(--theme-color-background-panel, #fff);\n\t\t\tcolor: #264653;\n\t\t\tcursor: pointer;\n\t\t\tfont-size: 0.85em;\n\t\t\tmargin-bottom: 1.25em;\n\t\t\ttransition: background 0.15s;\n\t\t}\n\t\t.bookshop-store-back:hover {\n\t\t\tbackground: #F5F0E8;\n\t\t}\n\t\t.bookshop-store-detail {\n\t\t\tdisplay: flex;\n\t\t\tgap: 2em;\n\t\t}\n\t\t.bookshop-store-cover {\n\t\t\twidth: 200px;\n\t\t\theight: 300px;\n\t\t\tborder-radius: 6px;\n\t\t\tobject-fit: cover;\n\t\t\tflex-shrink: 0;\n\t\t\tbackground: var(--theme-color-background-secondary, #F0ECE4);\n\t\t\tbox-shadow: 0 2px 12px rgba(38,70,83,0.12);\n\t\t}\n\t\t.bookshop-store-info {\n\t\t\tflex: 1;\n\t\t\tmin-width: 0;\n\t\t}\n\t\t.bookshop-store-title {\n\t\t\tfont-size: 1.75em;\n\t\t\tfont-weight: 700;\n\t\t\tcolor: #264653;\n\t\t\tmargin: 0 0 0.15em;\n\t\t}\n\t\t.bookshop-store-author {\n\t\t\tfont-size: 1.1em;\n\t\t\tcolor: #8A7F72;\n\t\t\tmargin: 0 0 0.75em;\n\t\t}\n\t\t.bookshop-store-genre-badge {\n\t\t\tdisplay: inline-block;\n\t\t\tfont-size: 0.8em;\n\t\t\tpadding: 0.2em 0.6em;\n\t\t\tbackground: #264653;\n\t\t\tcolor: #FAEDCD;\n\t\t\tborder-radius: 4px;\n\t\t\tmargin-bottom: 1em;\n\t\t}\n\t\t.bookshop-store-description {\n\t\t\tline-height: 1.7;\n\t\t\tcolor: #423D37;\n\t\t\tmargin: 0.75em 0 1.25em;\n\t\t\tfont-size: 1em;\n\t\t}\n\t\t.bookshop-store-price {\n\t\t\tfont-size: 2em;\n\t\t\tfont-weight: 700;\n\t\t\tcolor: #2E7D74;\n\t\t\tmargin-bottom: 0.3em;\n\t\t}\n\t\t.bookshop-store-stock {\n\t\t\tfont-size: 0.9em;\n\t\t\tfont-weight: 600;\n\t\t\tmargin-bottom: 1.25em;\n\t\t}\n\t\t.bookshop-store-stock.in-stock {\n\t\t\tcolor: #2E7D74;\n\t\t}\n\t\t.bookshop-store-stock.out-of-stock {\n\t\t\tcolor: #E76F51;\n\t\t}\n\t\t.bookshop-store-add-cart {\n\t\t\tdisplay: inline-block;\n\t\t\tpadding: 0.6em 1.5em;\n\t\t\tbackground: #E76F51;\n\t\t\tcolor: var(--theme-color-background-panel, #fff);\n\t\t\tborder: none;\n\t\t\tborder-radius: 5px;\n\t\t\tfont-size: 1em;\n\t\t\tfont-weight: 600;\n\t\t\tcursor: pointer;\n\t\t\ttransition: background 0.15s;\n\t\t}\n\t\t.bookshop-store-add-cart:hover {\n\t\t\tbackground: #D4603F;\n\t\t}\n\t\t.bookshop-store-add-cart:disabled {\n\t\t\tbackground: #C4BAA8;\n\t\t\tcursor: not-allowed;\n\t\t}\n\t",Templates:[{Hash:"Bookshop-Store-Template",Template:/*html*/"<div class=\"bookshop-store\" id=\"Bookshop-Store-Body\"></div>"}],Renderables:[{RenderableHash:"Bookshop-Store-Display",TemplateHash:"Bookshop-Store-Template",DestinationAddress:"#Bookshop-Content-Container",RenderMethod:"replace"}]};class BookshopStoreView extends libPictView{constructor(pFable,pOptions,pServiceHash){super(pFable,pOptions,pServiceHash);}onAfterRender(){this._renderStore();return super.onAfterRender();}_renderStore(){if(typeof document==='undefined'){return;}let tmpContainer=document.getElementById('Bookshop-Store-Body');if(!tmpContainer){return;}let tmpState=this.pict.AppData.Bookshop;let tmpBook=tmpState.CurrentBook;if(!tmpBook){tmpContainer.innerHTML='<p>No book selected.</p>';return;}let tmpStockClass=tmpBook.InStock?'in-stock':'out-of-stock';let tmpStockText=tmpBook.InStock?'In Stock':'Out of Stock';let tmpDisabled=tmpBook.InStock?'':' disabled';let tmpHTML='';// Back button
tmpHTML+='<button class="bookshop-store-back" id="Bookshop-Store-Back" data-d-tooltip="back-to-catalog">';tmpHTML+='&#x2190; Back to Catalog';tmpHTML+='</button>';tmpHTML+=' <span data-d-tooltip="navigation-info" data-d-tooltip-icon></span>';// Section header with help button
tmpHTML+='<div class="bookshop-section-header">';tmpHTML+='<h2 class="bookshop-section-title">Store</h2>';tmpHTML+='<button class="bookshop-help-btn" id="Bookshop-Help-Store" title="Help: Store Page">?</button>';tmpHTML+='</div>';// Detail layout
tmpHTML+='<div class="bookshop-store-detail">';// Cover
tmpHTML+='<img class="bookshop-store-cover" src="'+tmpBook.Cover+'" alt="'+tmpBook.Title+'">';// Info
tmpHTML+='<div class="bookshop-store-info">';tmpHTML+='<h1 class="bookshop-store-title">'+tmpBook.Title+'</h1>';tmpHTML+='<p class="bookshop-store-author" data-d-tooltip="store-author">by '+tmpBook.Author+'</p>';tmpHTML+='<span class="bookshop-store-genre-badge" data-d-tooltip="genre-badge">'+tmpBook.Genre+'</span>';tmpHTML+='<p class="bookshop-store-description">'+tmpBook.Description+'</p>';tmpHTML+='<div class="bookshop-store-price" data-d-tooltip="store-price">$'+tmpBook.Price.toFixed(2)+'</div>';tmpHTML+='<div class="bookshop-store-stock '+tmpStockClass+'" data-d-tooltip="store-stock">'+tmpStockText+'</div>';tmpHTML+='<button class="bookshop-store-add-cart" id="Bookshop-Store-AddCart"'+tmpDisabled+' data-d-tooltip="add-to-cart">Add to Cart</button>';tmpHTML+=' <span data-d-tooltip="cart-info" data-d-tooltip-icon></span>';tmpHTML+='</div>';tmpHTML+='</div>';tmpContainer.innerHTML=tmpHTML;// Wire handlers
this._wireHandlers(tmpContainer);// Scan for tooltip placeholders
let tmpDocProvider=this.pict.providers['Pict-InlineDocumentation'];if(tmpDocProvider){tmpDocProvider.scanTooltips();}}_wireHandlers(pContainer){let tmpApp=this.pict.PictApplication;let tmpBackBtn=pContainer.querySelector('#Bookshop-Store-Back');if(tmpBackBtn){tmpBackBtn.addEventListener('click',()=>{if(tmpApp){tmpApp.showBookList();}});}let tmpAddCartBtn=pContainer.querySelector('#Bookshop-Store-AddCart');if(tmpAddCartBtn){tmpAddCartBtn.addEventListener('click',()=>{let tmpBook=this.pict.AppData.Bookshop.CurrentBook;if(tmpBook&&tmpBook.InStock){tmpAddCartBtn.textContent='Added!';tmpAddCartBtn.disabled=true;setTimeout(()=>{tmpAddCartBtn.textContent='Add to Cart';tmpAddCartBtn.disabled=false;},1500);}});}let tmpHelpStore=pContainer.querySelector('#Bookshop-Help-Store');if(tmpHelpStore){tmpHelpStore.addEventListener('click',pEvent=>{pEvent.stopPropagation();if(tmpApp){tmpApp.showHelp('BOOKSHOP-STORE');}});}}}module.exports=BookshopStoreView;module.exports.default_configuration=_ViewConfiguration;},{"pict-view":23}],8:[function(require,module,exports){module.exports={"name":"fable-serviceproviderbase","version":"3.0.19","description":"Simple base classes for fable services.","main":"source/Fable-ServiceProviderBase.js","scripts":{"start":"node source/Fable-ServiceProviderBase.js","test":"npx quack test","tests":"npx quack test -g","coverage":"npx quack coverage","build":"npx quack build","types":"tsc -p ./tsconfig.build.json","check":"tsc -p . --noEmit"},"types":"types/source/Fable-ServiceProviderBase.d.ts","mocha":{"diff":true,"extension":["js"],"package":"./package.json","reporter":"spec","slow":"75","timeout":"5000","ui":"tdd","watch-files":["source/**/*.js","test/**/*.js"],"watch-ignore":["lib/vendor"]},"repository":{"type":"git","url":"https://github.com/fable-retold/fable-serviceproviderbase.git"},"keywords":["entity","behavior"],"author":"Steven Velozo <steven@velozo.com> (http://velozo.com/)","license":"MIT","bugs":{"url":"https://github.com/fable-retold/fable-serviceproviderbase/issues"},"homepage":"https://github.com/fable-retold/fable-serviceproviderbase","devDependencies":{"@types/mocha":"^10.0.10","fable":"^3.1.62","quackage":"^1.0.58","typescript":"^5.9.3"}};},{}],9:[function(require,module,exports){/**
* Fable Service Base
* @author <steven@velozo.com>
*/const libPackage=require('../package.json');class FableServiceProviderBase{/**
	 * The constructor can be used in two ways:
	 * 1) With a fable, options object and service hash (the options object and service hash are optional)a
	 * 2) With an object or nothing as the first parameter, where it will be treated as the options object
	 *
	 * @param {import('fable')|Record<string, any>} [pFable] - (optional) The fable instance, or the options object if there is no fable
	 * @param {Record<string, any>|string} [pOptions] - (optional) The options object, or the service hash if there is no fable
	 * @param {string} [pServiceHash] - (optional) The service hash to identify this service instance
	 */constructor(pFable,pOptions,pServiceHash){/** @type {import('fable')} */this.fable;/** @type {string} */this.UUID;/** @type {Record<string, any>} */this.options;/** @type {Record<string, any>} */this.services;/** @type {Record<string, any>} */this.servicesMap;// Check if a fable was passed in; connect it if so
if(typeof pFable==='object'&&pFable.isFable){this.connectFable(pFable);}else{this.fable=false;}// Initialize the services map if it wasn't passed in
/** @type {Record<string, any>} */this._PackageFableServiceProvider=libPackage;// initialize options and UUID based on whether the fable was passed in or not.
if(this.fable){this.UUID=pFable.getUUID();this.options=typeof pOptions==='object'?pOptions:{};}else{// With no fable, check to see if there was an object passed into either of the first two
// Parameters, and if so, treat it as the options object
this.options=typeof pFable==='object'&&!pFable.isFable?pFable:typeof pOptions==='object'?pOptions:{};this.UUID="CORE-SVC-".concat(Math.floor(Math.random()*(99999-10000)+10000));}// It's expected that the deriving class will set this
this.serviceType="Unknown-".concat(this.UUID);// The service hash is used to identify the specific instantiation of the service in the services map
this.Hash=typeof pServiceHash==='string'?pServiceHash:!this.fable&&typeof pOptions==='string'?pOptions:"".concat(this.UUID);}/**
	 * @param {import('fable')} pFable
	 */connectFable(pFable){if(typeof pFable!=='object'||!pFable.isFable){let tmpErrorMessage="Fable Service Provider Base: Cannot connect to Fable, invalid Fable object passed in.  The pFable parameter was a [".concat(typeof pFable,"].}");console.log(tmpErrorMessage);return new Error(tmpErrorMessage);}if(!this.fable){this.fable=pFable;}if(!this.log){this.log=this.fable.Logging;}if(!this.services){this.services=this.fable.services;}if(!this.servicesMap){this.servicesMap=this.fable.servicesMap;}return true;}}_defineProperty(FableServiceProviderBase,"isFableService",true);module.exports=FableServiceProviderBase;// This is left here in case we want to go back to having different code/base class for "core" services
module.exports.CoreServiceProviderBase=FableServiceProviderBase;},{"../package.json":8}],10:[function(require,module,exports){/**
 * lunr - http://lunrjs.com - A bit like Solr, but much smaller and not as bright - 2.3.9
 * Copyright (C) 2020 Oliver Nightingale
 * @license MIT
 */;(function(){/**
 * A convenience function for configuring and constructing
 * a new lunr Index.
 *
 * A lunr.Builder instance is created and the pipeline setup
 * with a trimmer, stop word filter and stemmer.
 *
 * This builder object is yielded to the configuration function
 * that is passed as a parameter, allowing the list of fields
 * and other builder parameters to be customised.
 *
 * All documents _must_ be added within the passed config function.
 *
 * @example
 * var idx = lunr(function () {
 *   this.field('title')
 *   this.field('body')
 *   this.ref('id')
 *
 *   documents.forEach(function (doc) {
 *     this.add(doc)
 *   }, this)
 * })
 *
 * @see {@link lunr.Builder}
 * @see {@link lunr.Pipeline}
 * @see {@link lunr.trimmer}
 * @see {@link lunr.stopWordFilter}
 * @see {@link lunr.stemmer}
 * @namespace {function} lunr
 */var _lunr=function lunr(config){var builder=new _lunr.Builder();builder.pipeline.add(_lunr.trimmer,_lunr.stopWordFilter,_lunr.stemmer);builder.searchPipeline.add(_lunr.stemmer);config.call(builder,builder);return builder.build();};_lunr.version="2.3.9";/*!
 * lunr.utils
 * Copyright (C) 2020 Oliver Nightingale
 *//**
 * A namespace containing utils for the rest of the lunr library
 * @namespace lunr.utils
 */_lunr.utils={};/**
 * Print a warning message to the console.
 *
 * @param {String} message The message to be printed.
 * @memberOf lunr.utils
 * @function
 */_lunr.utils.warn=function(global){/* eslint-disable no-console */return function(message){if(global.console&&console.warn){console.warn(message);}};/* eslint-enable no-console */}(this);/**
 * Convert an object to a string.
 *
 * In the case of `null` and `undefined` the function returns
 * the empty string, in all other cases the result of calling
 * `toString` on the passed object is returned.
 *
 * @param {Any} obj The object to convert to a string.
 * @return {String} string representation of the passed object.
 * @memberOf lunr.utils
 */_lunr.utils.asString=function(obj){if(obj===void 0||obj===null){return"";}else{return obj.toString();}};/**
 * Clones an object.
 *
 * Will create a copy of an existing object such that any mutations
 * on the copy cannot affect the original.
 *
 * Only shallow objects are supported, passing a nested object to this
 * function will cause a TypeError.
 *
 * Objects with primitives, and arrays of primitives are supported.
 *
 * @param {Object} obj The object to clone.
 * @return {Object} a clone of the passed object.
 * @throws {TypeError} when a nested object is passed.
 * @memberOf Utils
 */_lunr.utils.clone=function(obj){if(obj===null||obj===undefined){return obj;}var clone=Object.create(null),keys=Object.keys(obj);for(var i=0;i<keys.length;i++){var key=keys[i],val=obj[key];if(Array.isArray(val)){clone[key]=val.slice();continue;}if(typeof val==='string'||typeof val==='number'||typeof val==='boolean'){clone[key]=val;continue;}throw new TypeError("clone is not deep and does not support nested objects");}return clone;};_lunr.FieldRef=function(docRef,fieldName,stringValue){this.docRef=docRef;this.fieldName=fieldName;this._stringValue=stringValue;};_lunr.FieldRef.joiner="/";_lunr.FieldRef.fromString=function(s){var n=s.indexOf(_lunr.FieldRef.joiner);if(n===-1){throw"malformed field ref string";}var fieldRef=s.slice(0,n),docRef=s.slice(n+1);return new _lunr.FieldRef(docRef,fieldRef,s);};_lunr.FieldRef.prototype.toString=function(){if(this._stringValue==undefined){this._stringValue=this.fieldName+_lunr.FieldRef.joiner+this.docRef;}return this._stringValue;};/*!
 * lunr.Set
 * Copyright (C) 2020 Oliver Nightingale
 *//**
 * A lunr set.
 *
 * @constructor
 */_lunr.Set=function(elements){this.elements=Object.create(null);if(elements){this.length=elements.length;for(var i=0;i<this.length;i++){this.elements[elements[i]]=true;}}else{this.length=0;}};/**
 * A complete set that contains all elements.
 *
 * @static
 * @readonly
 * @type {lunr.Set}
 */_lunr.Set.complete={intersect:function intersect(other){return other;},union:function union(){return this;},contains:function contains(){return true;}};/**
 * An empty set that contains no elements.
 *
 * @static
 * @readonly
 * @type {lunr.Set}
 */_lunr.Set.empty={intersect:function intersect(){return this;},union:function union(other){return other;},contains:function contains(){return false;}};/**
 * Returns true if this set contains the specified object.
 *
 * @param {object} object - Object whose presence in this set is to be tested.
 * @returns {boolean} - True if this set contains the specified object.
 */_lunr.Set.prototype.contains=function(object){return!!this.elements[object];};/**
 * Returns a new set containing only the elements that are present in both
 * this set and the specified set.
 *
 * @param {lunr.Set} other - set to intersect with this set.
 * @returns {lunr.Set} a new set that is the intersection of this and the specified set.
 */_lunr.Set.prototype.intersect=function(other){var a,b,elements,intersection=[];if(other===_lunr.Set.complete){return this;}if(other===_lunr.Set.empty){return other;}if(this.length<other.length){a=this;b=other;}else{a=other;b=this;}elements=Object.keys(a.elements);for(var i=0;i<elements.length;i++){var element=elements[i];if(element in b.elements){intersection.push(element);}}return new _lunr.Set(intersection);};/**
 * Returns a new set combining the elements of this and the specified set.
 *
 * @param {lunr.Set} other - set to union with this set.
 * @return {lunr.Set} a new set that is the union of this and the specified set.
 */_lunr.Set.prototype.union=function(other){if(other===_lunr.Set.complete){return _lunr.Set.complete;}if(other===_lunr.Set.empty){return this;}return new _lunr.Set(Object.keys(this.elements).concat(Object.keys(other.elements)));};/**
 * A function to calculate the inverse document frequency for
 * a posting. This is shared between the builder and the index
 *
 * @private
 * @param {object} posting - The posting for a given term
 * @param {number} documentCount - The total number of documents.
 */_lunr.idf=function(posting,documentCount){var documentsWithTerm=0;for(var fieldName in posting){if(fieldName=='_index')continue;// Ignore the term index, its not a field
documentsWithTerm+=Object.keys(posting[fieldName]).length;}var x=(documentCount-documentsWithTerm+0.5)/(documentsWithTerm+0.5);return Math.log(1+Math.abs(x));};/**
 * A token wraps a string representation of a token
 * as it is passed through the text processing pipeline.
 *
 * @constructor
 * @param {string} [str=''] - The string token being wrapped.
 * @param {object} [metadata={}] - Metadata associated with this token.
 */_lunr.Token=function(str,metadata){this.str=str||"";this.metadata=metadata||{};};/**
 * Returns the token string that is being wrapped by this object.
 *
 * @returns {string}
 */_lunr.Token.prototype.toString=function(){return this.str;};/**
 * A token update function is used when updating or optionally
 * when cloning a token.
 *
 * @callback lunr.Token~updateFunction
 * @param {string} str - The string representation of the token.
 * @param {Object} metadata - All metadata associated with this token.
 *//**
 * Applies the given function to the wrapped string token.
 *
 * @example
 * token.update(function (str, metadata) {
 *   return str.toUpperCase()
 * })
 *
 * @param {lunr.Token~updateFunction} fn - A function to apply to the token string.
 * @returns {lunr.Token}
 */_lunr.Token.prototype.update=function(fn){this.str=fn(this.str,this.metadata);return this;};/**
 * Creates a clone of this token. Optionally a function can be
 * applied to the cloned token.
 *
 * @param {lunr.Token~updateFunction} [fn] - An optional function to apply to the cloned token.
 * @returns {lunr.Token}
 */_lunr.Token.prototype.clone=function(fn){fn=fn||function(s){return s;};return new _lunr.Token(fn(this.str,this.metadata),this.metadata);};/*!
 * lunr.tokenizer
 * Copyright (C) 2020 Oliver Nightingale
 *//**
 * A function for splitting a string into tokens ready to be inserted into
 * the search index. Uses `lunr.tokenizer.separator` to split strings, change
 * the value of this property to change how strings are split into tokens.
 *
 * This tokenizer will convert its parameter to a string by calling `toString` and
 * then will split this string on the character in `lunr.tokenizer.separator`.
 * Arrays will have their elements converted to strings and wrapped in a lunr.Token.
 *
 * Optional metadata can be passed to the tokenizer, this metadata will be cloned and
 * added as metadata to every token that is created from the object to be tokenized.
 *
 * @static
 * @param {?(string|object|object[])} obj - The object to convert into tokens
 * @param {?object} metadata - Optional metadata to associate with every token
 * @returns {lunr.Token[]}
 * @see {@link lunr.Pipeline}
 */_lunr.tokenizer=function(obj,metadata){if(obj==null||obj==undefined){return[];}if(Array.isArray(obj)){return obj.map(function(t){return new _lunr.Token(_lunr.utils.asString(t).toLowerCase(),_lunr.utils.clone(metadata));});}var str=obj.toString().toLowerCase(),len=str.length,tokens=[];for(var sliceEnd=0,sliceStart=0;sliceEnd<=len;sliceEnd++){var char=str.charAt(sliceEnd),sliceLength=sliceEnd-sliceStart;if(char.match(_lunr.tokenizer.separator)||sliceEnd==len){if(sliceLength>0){var tokenMetadata=_lunr.utils.clone(metadata)||{};tokenMetadata["position"]=[sliceStart,sliceLength];tokenMetadata["index"]=tokens.length;tokens.push(new _lunr.Token(str.slice(sliceStart,sliceEnd),tokenMetadata));}sliceStart=sliceEnd+1;}}return tokens;};/**
 * The separator used to split a string into tokens. Override this property to change the behaviour of
 * `lunr.tokenizer` behaviour when tokenizing strings. By default this splits on whitespace and hyphens.
 *
 * @static
 * @see lunr.tokenizer
 */_lunr.tokenizer.separator=/[\s\-]+/;/*!
 * lunr.Pipeline
 * Copyright (C) 2020 Oliver Nightingale
 *//**
 * lunr.Pipelines maintain an ordered list of functions to be applied to all
 * tokens in documents entering the search index and queries being ran against
 * the index.
 *
 * An instance of lunr.Index created with the lunr shortcut will contain a
 * pipeline with a stop word filter and an English language stemmer. Extra
 * functions can be added before or after either of these functions or these
 * default functions can be removed.
 *
 * When run the pipeline will call each function in turn, passing a token, the
 * index of that token in the original list of all tokens and finally a list of
 * all the original tokens.
 *
 * The output of functions in the pipeline will be passed to the next function
 * in the pipeline. To exclude a token from entering the index the function
 * should return undefined, the rest of the pipeline will not be called with
 * this token.
 *
 * For serialisation of pipelines to work, all functions used in an instance of
 * a pipeline should be registered with lunr.Pipeline. Registered functions can
 * then be loaded. If trying to load a serialised pipeline that uses functions
 * that are not registered an error will be thrown.
 *
 * If not planning on serialising the pipeline then registering pipeline functions
 * is not necessary.
 *
 * @constructor
 */_lunr.Pipeline=function(){this._stack=[];};_lunr.Pipeline.registeredFunctions=Object.create(null);/**
 * A pipeline function maps lunr.Token to lunr.Token. A lunr.Token contains the token
 * string as well as all known metadata. A pipeline function can mutate the token string
 * or mutate (or add) metadata for a given token.
 *
 * A pipeline function can indicate that the passed token should be discarded by returning
 * null, undefined or an empty string. This token will not be passed to any downstream pipeline
 * functions and will not be added to the index.
 *
 * Multiple tokens can be returned by returning an array of tokens. Each token will be passed
 * to any downstream pipeline functions and all will returned tokens will be added to the index.
 *
 * Any number of pipeline functions may be chained together using a lunr.Pipeline.
 *
 * @interface lunr.PipelineFunction
 * @param {lunr.Token} token - A token from the document being processed.
 * @param {number} i - The index of this token in the complete list of tokens for this document/field.
 * @param {lunr.Token[]} tokens - All tokens for this document/field.
 * @returns {(?lunr.Token|lunr.Token[])}
 *//**
 * Register a function with the pipeline.
 *
 * Functions that are used in the pipeline should be registered if the pipeline
 * needs to be serialised, or a serialised pipeline needs to be loaded.
 *
 * Registering a function does not add it to a pipeline, functions must still be
 * added to instances of the pipeline for them to be used when running a pipeline.
 *
 * @param {lunr.PipelineFunction} fn - The function to check for.
 * @param {String} label - The label to register this function with
 */_lunr.Pipeline.registerFunction=function(fn,label){if(label in this.registeredFunctions){_lunr.utils.warn('Overwriting existing registered function: '+label);}fn.label=label;_lunr.Pipeline.registeredFunctions[fn.label]=fn;};/**
 * Warns if the function is not registered as a Pipeline function.
 *
 * @param {lunr.PipelineFunction} fn - The function to check for.
 * @private
 */_lunr.Pipeline.warnIfFunctionNotRegistered=function(fn){var isRegistered=fn.label&&fn.label in this.registeredFunctions;if(!isRegistered){_lunr.utils.warn('Function is not registered with pipeline. This may cause problems when serialising the index.\n',fn);}};/**
 * Loads a previously serialised pipeline.
 *
 * All functions to be loaded must already be registered with lunr.Pipeline.
 * If any function from the serialised data has not been registered then an
 * error will be thrown.
 *
 * @param {Object} serialised - The serialised pipeline to load.
 * @returns {lunr.Pipeline}
 */_lunr.Pipeline.load=function(serialised){var pipeline=new _lunr.Pipeline();serialised.forEach(function(fnName){var fn=_lunr.Pipeline.registeredFunctions[fnName];if(fn){pipeline.add(fn);}else{throw new Error('Cannot load unregistered function: '+fnName);}});return pipeline;};/**
 * Adds new functions to the end of the pipeline.
 *
 * Logs a warning if the function has not been registered.
 *
 * @param {lunr.PipelineFunction[]} functions - Any number of functions to add to the pipeline.
 */_lunr.Pipeline.prototype.add=function(){var fns=Array.prototype.slice.call(arguments);fns.forEach(function(fn){_lunr.Pipeline.warnIfFunctionNotRegistered(fn);this._stack.push(fn);},this);};/**
 * Adds a single function after a function that already exists in the
 * pipeline.
 *
 * Logs a warning if the function has not been registered.
 *
 * @param {lunr.PipelineFunction} existingFn - A function that already exists in the pipeline.
 * @param {lunr.PipelineFunction} newFn - The new function to add to the pipeline.
 */_lunr.Pipeline.prototype.after=function(existingFn,newFn){_lunr.Pipeline.warnIfFunctionNotRegistered(newFn);var pos=this._stack.indexOf(existingFn);if(pos==-1){throw new Error('Cannot find existingFn');}pos=pos+1;this._stack.splice(pos,0,newFn);};/**
 * Adds a single function before a function that already exists in the
 * pipeline.
 *
 * Logs a warning if the function has not been registered.
 *
 * @param {lunr.PipelineFunction} existingFn - A function that already exists in the pipeline.
 * @param {lunr.PipelineFunction} newFn - The new function to add to the pipeline.
 */_lunr.Pipeline.prototype.before=function(existingFn,newFn){_lunr.Pipeline.warnIfFunctionNotRegistered(newFn);var pos=this._stack.indexOf(existingFn);if(pos==-1){throw new Error('Cannot find existingFn');}this._stack.splice(pos,0,newFn);};/**
 * Removes a function from the pipeline.
 *
 * @param {lunr.PipelineFunction} fn The function to remove from the pipeline.
 */_lunr.Pipeline.prototype.remove=function(fn){var pos=this._stack.indexOf(fn);if(pos==-1){return;}this._stack.splice(pos,1);};/**
 * Runs the current list of functions that make up the pipeline against the
 * passed tokens.
 *
 * @param {Array} tokens The tokens to run through the pipeline.
 * @returns {Array}
 */_lunr.Pipeline.prototype.run=function(tokens){var stackLength=this._stack.length;for(var i=0;i<stackLength;i++){var fn=this._stack[i];var memo=[];for(var j=0;j<tokens.length;j++){var result=fn(tokens[j],j,tokens);if(result===null||result===void 0||result==='')continue;if(Array.isArray(result)){for(var k=0;k<result.length;k++){memo.push(result[k]);}}else{memo.push(result);}}tokens=memo;}return tokens;};/**
 * Convenience method for passing a string through a pipeline and getting
 * strings out. This method takes care of wrapping the passed string in a
 * token and mapping the resulting tokens back to strings.
 *
 * @param {string} str - The string to pass through the pipeline.
 * @param {?object} metadata - Optional metadata to associate with the token
 * passed to the pipeline.
 * @returns {string[]}
 */_lunr.Pipeline.prototype.runString=function(str,metadata){var token=new _lunr.Token(str,metadata);return this.run([token]).map(function(t){return t.toString();});};/**
 * Resets the pipeline by removing any existing processors.
 *
 */_lunr.Pipeline.prototype.reset=function(){this._stack=[];};/**
 * Returns a representation of the pipeline ready for serialisation.
 *
 * Logs a warning if the function has not been registered.
 *
 * @returns {Array}
 */_lunr.Pipeline.prototype.toJSON=function(){return this._stack.map(function(fn){_lunr.Pipeline.warnIfFunctionNotRegistered(fn);return fn.label;});};/*!
 * lunr.Vector
 * Copyright (C) 2020 Oliver Nightingale
 *//**
 * A vector is used to construct the vector space of documents and queries. These
 * vectors support operations to determine the similarity between two documents or
 * a document and a query.
 *
 * Normally no parameters are required for initializing a vector, but in the case of
 * loading a previously dumped vector the raw elements can be provided to the constructor.
 *
 * For performance reasons vectors are implemented with a flat array, where an elements
 * index is immediately followed by its value. E.g. [index, value, index, value]. This
 * allows the underlying array to be as sparse as possible and still offer decent
 * performance when being used for vector calculations.
 *
 * @constructor
 * @param {Number[]} [elements] - The flat list of element index and element value pairs.
 */_lunr.Vector=function(elements){this._magnitude=0;this.elements=elements||[];};/**
 * Calculates the position within the vector to insert a given index.
 *
 * This is used internally by insert and upsert. If there are duplicate indexes then
 * the position is returned as if the value for that index were to be updated, but it
 * is the callers responsibility to check whether there is a duplicate at that index
 *
 * @param {Number} insertIdx - The index at which the element should be inserted.
 * @returns {Number}
 */_lunr.Vector.prototype.positionForIndex=function(index){// For an empty vector the tuple can be inserted at the beginning
if(this.elements.length==0){return 0;}var start=0,end=this.elements.length/2,sliceLength=end-start,pivotPoint=Math.floor(sliceLength/2),pivotIndex=this.elements[pivotPoint*2];while(sliceLength>1){if(pivotIndex<index){start=pivotPoint;}if(pivotIndex>index){end=pivotPoint;}if(pivotIndex==index){break;}sliceLength=end-start;pivotPoint=start+Math.floor(sliceLength/2);pivotIndex=this.elements[pivotPoint*2];}if(pivotIndex==index){return pivotPoint*2;}if(pivotIndex>index){return pivotPoint*2;}if(pivotIndex<index){return(pivotPoint+1)*2;}};/**
 * Inserts an element at an index within the vector.
 *
 * Does not allow duplicates, will throw an error if there is already an entry
 * for this index.
 *
 * @param {Number} insertIdx - The index at which the element should be inserted.
 * @param {Number} val - The value to be inserted into the vector.
 */_lunr.Vector.prototype.insert=function(insertIdx,val){this.upsert(insertIdx,val,function(){throw"duplicate index";});};/**
 * Inserts or updates an existing index within the vector.
 *
 * @param {Number} insertIdx - The index at which the element should be inserted.
 * @param {Number} val - The value to be inserted into the vector.
 * @param {function} fn - A function that is called for updates, the existing value and the
 * requested value are passed as arguments
 */_lunr.Vector.prototype.upsert=function(insertIdx,val,fn){this._magnitude=0;var position=this.positionForIndex(insertIdx);if(this.elements[position]==insertIdx){this.elements[position+1]=fn(this.elements[position+1],val);}else{this.elements.splice(position,0,insertIdx,val);}};/**
 * Calculates the magnitude of this vector.
 *
 * @returns {Number}
 */_lunr.Vector.prototype.magnitude=function(){if(this._magnitude)return this._magnitude;var sumOfSquares=0,elementsLength=this.elements.length;for(var i=1;i<elementsLength;i+=2){var val=this.elements[i];sumOfSquares+=val*val;}return this._magnitude=Math.sqrt(sumOfSquares);};/**
 * Calculates the dot product of this vector and another vector.
 *
 * @param {lunr.Vector} otherVector - The vector to compute the dot product with.
 * @returns {Number}
 */_lunr.Vector.prototype.dot=function(otherVector){var dotProduct=0,a=this.elements,b=otherVector.elements,aLen=a.length,bLen=b.length,aVal=0,bVal=0,i=0,j=0;while(i<aLen&&j<bLen){aVal=a[i],bVal=b[j];if(aVal<bVal){i+=2;}else if(aVal>bVal){j+=2;}else if(aVal==bVal){dotProduct+=a[i+1]*b[j+1];i+=2;j+=2;}}return dotProduct;};/**
 * Calculates the similarity between this vector and another vector.
 *
 * @param {lunr.Vector} otherVector - The other vector to calculate the
 * similarity with.
 * @returns {Number}
 */_lunr.Vector.prototype.similarity=function(otherVector){return this.dot(otherVector)/this.magnitude()||0;};/**
 * Converts the vector to an array of the elements within the vector.
 *
 * @returns {Number[]}
 */_lunr.Vector.prototype.toArray=function(){var output=new Array(this.elements.length/2);for(var i=1,j=0;i<this.elements.length;i+=2,j++){output[j]=this.elements[i];}return output;};/**
 * A JSON serializable representation of the vector.
 *
 * @returns {Number[]}
 */_lunr.Vector.prototype.toJSON=function(){return this.elements;};/* eslint-disable *//*!
 * lunr.stemmer
 * Copyright (C) 2020 Oliver Nightingale
 * Includes code from - http://tartarus.org/~martin/PorterStemmer/js.txt
 *//**
 * lunr.stemmer is an english language stemmer, this is a JavaScript
 * implementation of the PorterStemmer taken from http://tartarus.org/~martin
 *
 * @static
 * @implements {lunr.PipelineFunction}
 * @param {lunr.Token} token - The string to stem
 * @returns {lunr.Token}
 * @see {@link lunr.Pipeline}
 * @function
 */_lunr.stemmer=function(){var step2list={"ational":"ate","tional":"tion","enci":"ence","anci":"ance","izer":"ize","bli":"ble","alli":"al","entli":"ent","eli":"e","ousli":"ous","ization":"ize","ation":"ate","ator":"ate","alism":"al","iveness":"ive","fulness":"ful","ousness":"ous","aliti":"al","iviti":"ive","biliti":"ble","logi":"log"},step3list={"icate":"ic","ative":"","alize":"al","iciti":"ic","ical":"ic","ful":"","ness":""},c="[^aeiou]",// consonant
v="[aeiouy]",// vowel
C=c+"[^aeiouy]*",// consonant sequence
V=v+"[aeiou]*",// vowel sequence
mgr0="^("+C+")?"+V+C,// [C]VC... is m>0
meq1="^("+C+")?"+V+C+"("+V+")?$",// [C]VC[V] is m=1
mgr1="^("+C+")?"+V+C+V+C,// [C]VCVC... is m>1
s_v="^("+C+")?"+v;// vowel in stem
var re_mgr0=new RegExp(mgr0);var re_mgr1=new RegExp(mgr1);var re_meq1=new RegExp(meq1);var re_s_v=new RegExp(s_v);var re_1a=/^(.+?)(ss|i)es$/;var re2_1a=/^(.+?)([^s])s$/;var re_1b=/^(.+?)eed$/;var re2_1b=/^(.+?)(ed|ing)$/;var re_1b_2=/.$/;var re2_1b_2=/(at|bl|iz)$/;var re3_1b_2=new RegExp("([^aeiouylsz])\\1$");var re4_1b_2=new RegExp("^"+C+v+"[^aeiouwxy]$");var re_1c=/^(.+?[^aeiou])y$/;var re_2=/^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/;var re_3=/^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/;var re_4=/^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/;var re2_4=/^(.+?)(s|t)(ion)$/;var re_5=/^(.+?)e$/;var re_5_1=/ll$/;var re3_5=new RegExp("^"+C+v+"[^aeiouwxy]$");var porterStemmer=function porterStemmer(w){var stem,suffix,firstch,re,re2,re3,re4;if(w.length<3){return w;}firstch=w.substr(0,1);if(firstch=="y"){w=firstch.toUpperCase()+w.substr(1);}// Step 1a
re=re_1a;re2=re2_1a;if(re.test(w)){w=w.replace(re,"$1$2");}else if(re2.test(w)){w=w.replace(re2,"$1$2");}// Step 1b
re=re_1b;re2=re2_1b;if(re.test(w)){var fp=re.exec(w);re=re_mgr0;if(re.test(fp[1])){re=re_1b_2;w=w.replace(re,"");}}else if(re2.test(w)){var fp=re2.exec(w);stem=fp[1];re2=re_s_v;if(re2.test(stem)){w=stem;re2=re2_1b_2;re3=re3_1b_2;re4=re4_1b_2;if(re2.test(w)){w=w+"e";}else if(re3.test(w)){re=re_1b_2;w=w.replace(re,"");}else if(re4.test(w)){w=w+"e";}}}// Step 1c - replace suffix y or Y by i if preceded by a non-vowel which is not the first letter of the word (so cry -> cri, by -> by, say -> say)
re=re_1c;if(re.test(w)){var fp=re.exec(w);stem=fp[1];w=stem+"i";}// Step 2
re=re_2;if(re.test(w)){var fp=re.exec(w);stem=fp[1];suffix=fp[2];re=re_mgr0;if(re.test(stem)){w=stem+step2list[suffix];}}// Step 3
re=re_3;if(re.test(w)){var fp=re.exec(w);stem=fp[1];suffix=fp[2];re=re_mgr0;if(re.test(stem)){w=stem+step3list[suffix];}}// Step 4
re=re_4;re2=re2_4;if(re.test(w)){var fp=re.exec(w);stem=fp[1];re=re_mgr1;if(re.test(stem)){w=stem;}}else if(re2.test(w)){var fp=re2.exec(w);stem=fp[1]+fp[2];re2=re_mgr1;if(re2.test(stem)){w=stem;}}// Step 5
re=re_5;if(re.test(w)){var fp=re.exec(w);stem=fp[1];re=re_mgr1;re2=re_meq1;re3=re3_5;if(re.test(stem)||re2.test(stem)&&!re3.test(stem)){w=stem;}}re=re_5_1;re2=re_mgr1;if(re.test(w)&&re2.test(w)){re=re_1b_2;w=w.replace(re,"");}// and turn initial Y back to y
if(firstch=="y"){w=firstch.toLowerCase()+w.substr(1);}return w;};return function(token){return token.update(porterStemmer);};}();_lunr.Pipeline.registerFunction(_lunr.stemmer,'stemmer');/*!
 * lunr.stopWordFilter
 * Copyright (C) 2020 Oliver Nightingale
 *//**
 * lunr.generateStopWordFilter builds a stopWordFilter function from the provided
 * list of stop words.
 *
 * The built in lunr.stopWordFilter is built using this generator and can be used
 * to generate custom stopWordFilters for applications or non English languages.
 *
 * @function
 * @param {Array} token The token to pass through the filter
 * @returns {lunr.PipelineFunction}
 * @see lunr.Pipeline
 * @see lunr.stopWordFilter
 */_lunr.generateStopWordFilter=function(stopWords){var words=stopWords.reduce(function(memo,stopWord){memo[stopWord]=stopWord;return memo;},{});return function(token){if(token&&words[token.toString()]!==token.toString())return token;};};/**
 * lunr.stopWordFilter is an English language stop word list filter, any words
 * contained in the list will not be passed through the filter.
 *
 * This is intended to be used in the Pipeline. If the token does not pass the
 * filter then undefined will be returned.
 *
 * @function
 * @implements {lunr.PipelineFunction}
 * @params {lunr.Token} token - A token to check for being a stop word.
 * @returns {lunr.Token}
 * @see {@link lunr.Pipeline}
 */_lunr.stopWordFilter=_lunr.generateStopWordFilter(['a','able','about','across','after','all','almost','also','am','among','an','and','any','are','as','at','be','because','been','but','by','can','cannot','could','dear','did','do','does','either','else','ever','every','for','from','get','got','had','has','have','he','her','hers','him','his','how','however','i','if','in','into','is','it','its','just','least','let','like','likely','may','me','might','most','must','my','neither','no','nor','not','of','off','often','on','only','or','other','our','own','rather','said','say','says','she','should','since','so','some','than','that','the','their','them','then','there','these','they','this','tis','to','too','twas','us','wants','was','we','were','what','when','where','which','while','who','whom','why','will','with','would','yet','you','your']);_lunr.Pipeline.registerFunction(_lunr.stopWordFilter,'stopWordFilter');/*!
 * lunr.trimmer
 * Copyright (C) 2020 Oliver Nightingale
 *//**
 * lunr.trimmer is a pipeline function for trimming non word
 * characters from the beginning and end of tokens before they
 * enter the index.
 *
 * This implementation may not work correctly for non latin
 * characters and should either be removed or adapted for use
 * with languages with non-latin characters.
 *
 * @static
 * @implements {lunr.PipelineFunction}
 * @param {lunr.Token} token The token to pass through the filter
 * @returns {lunr.Token}
 * @see lunr.Pipeline
 */_lunr.trimmer=function(token){return token.update(function(s){return s.replace(/^\W+/,'').replace(/\W+$/,'');});};_lunr.Pipeline.registerFunction(_lunr.trimmer,'trimmer');/*!
 * lunr.TokenSet
 * Copyright (C) 2020 Oliver Nightingale
 *//**
 * A token set is used to store the unique list of all tokens
 * within an index. Token sets are also used to represent an
 * incoming query to the index, this query token set and index
 * token set are then intersected to find which tokens to look
 * up in the inverted index.
 *
 * A token set can hold multiple tokens, as in the case of the
 * index token set, or it can hold a single token as in the
 * case of a simple query token set.
 *
 * Additionally token sets are used to perform wildcard matching.
 * Leading, contained and trailing wildcards are supported, and
 * from this edit distance matching can also be provided.
 *
 * Token sets are implemented as a minimal finite state automata,
 * where both common prefixes and suffixes are shared between tokens.
 * This helps to reduce the space used for storing the token set.
 *
 * @constructor
 */_lunr.TokenSet=function(){this.final=false;this.edges={};this.id=_lunr.TokenSet._nextId;_lunr.TokenSet._nextId+=1;};/**
 * Keeps track of the next, auto increment, identifier to assign
 * to a new tokenSet.
 *
 * TokenSets require a unique identifier to be correctly minimised.
 *
 * @private
 */_lunr.TokenSet._nextId=1;/**
 * Creates a TokenSet instance from the given sorted array of words.
 *
 * @param {String[]} arr - A sorted array of strings to create the set from.
 * @returns {lunr.TokenSet}
 * @throws Will throw an error if the input array is not sorted.
 */_lunr.TokenSet.fromArray=function(arr){var builder=new _lunr.TokenSet.Builder();for(var i=0,len=arr.length;i<len;i++){builder.insert(arr[i]);}builder.finish();return builder.root;};/**
 * Creates a token set from a query clause.
 *
 * @private
 * @param {Object} clause - A single clause from lunr.Query.
 * @param {string} clause.term - The query clause term.
 * @param {number} [clause.editDistance] - The optional edit distance for the term.
 * @returns {lunr.TokenSet}
 */_lunr.TokenSet.fromClause=function(clause){if('editDistance'in clause){return _lunr.TokenSet.fromFuzzyString(clause.term,clause.editDistance);}else{return _lunr.TokenSet.fromString(clause.term);}};/**
 * Creates a token set representing a single string with a specified
 * edit distance.
 *
 * Insertions, deletions, substitutions and transpositions are each
 * treated as an edit distance of 1.
 *
 * Increasing the allowed edit distance will have a dramatic impact
 * on the performance of both creating and intersecting these TokenSets.
 * It is advised to keep the edit distance less than 3.
 *
 * @param {string} str - The string to create the token set from.
 * @param {number} editDistance - The allowed edit distance to match.
 * @returns {lunr.Vector}
 */_lunr.TokenSet.fromFuzzyString=function(str,editDistance){var root=new _lunr.TokenSet();var stack=[{node:root,editsRemaining:editDistance,str:str}];while(stack.length){var frame=stack.pop();// no edit
if(frame.str.length>0){var char=frame.str.charAt(0),noEditNode;if(char in frame.node.edges){noEditNode=frame.node.edges[char];}else{noEditNode=new _lunr.TokenSet();frame.node.edges[char]=noEditNode;}if(frame.str.length==1){noEditNode.final=true;}stack.push({node:noEditNode,editsRemaining:frame.editsRemaining,str:frame.str.slice(1)});}if(frame.editsRemaining==0){continue;}// insertion
if("*"in frame.node.edges){var insertionNode=frame.node.edges["*"];}else{var insertionNode=new _lunr.TokenSet();frame.node.edges["*"]=insertionNode;}if(frame.str.length==0){insertionNode.final=true;}stack.push({node:insertionNode,editsRemaining:frame.editsRemaining-1,str:frame.str});// deletion
// can only do a deletion if we have enough edits remaining
// and if there are characters left to delete in the string
if(frame.str.length>1){stack.push({node:frame.node,editsRemaining:frame.editsRemaining-1,str:frame.str.slice(1)});}// deletion
// just removing the last character from the str
if(frame.str.length==1){frame.node.final=true;}// substitution
// can only do a substitution if we have enough edits remaining
// and if there are characters left to substitute
if(frame.str.length>=1){if("*"in frame.node.edges){var substitutionNode=frame.node.edges["*"];}else{var substitutionNode=new _lunr.TokenSet();frame.node.edges["*"]=substitutionNode;}if(frame.str.length==1){substitutionNode.final=true;}stack.push({node:substitutionNode,editsRemaining:frame.editsRemaining-1,str:frame.str.slice(1)});}// transposition
// can only do a transposition if there are edits remaining
// and there are enough characters to transpose
if(frame.str.length>1){var charA=frame.str.charAt(0),charB=frame.str.charAt(1),transposeNode;if(charB in frame.node.edges){transposeNode=frame.node.edges[charB];}else{transposeNode=new _lunr.TokenSet();frame.node.edges[charB]=transposeNode;}if(frame.str.length==1){transposeNode.final=true;}stack.push({node:transposeNode,editsRemaining:frame.editsRemaining-1,str:charA+frame.str.slice(2)});}}return root;};/**
 * Creates a TokenSet from a string.
 *
 * The string may contain one or more wildcard characters (*)
 * that will allow wildcard matching when intersecting with
 * another TokenSet.
 *
 * @param {string} str - The string to create a TokenSet from.
 * @returns {lunr.TokenSet}
 */_lunr.TokenSet.fromString=function(str){var node=new _lunr.TokenSet(),root=node;/*
   * Iterates through all characters within the passed string
   * appending a node for each character.
   *
   * When a wildcard character is found then a self
   * referencing edge is introduced to continually match
   * any number of any characters.
   */for(var i=0,len=str.length;i<len;i++){var char=str[i],final=i==len-1;if(char=="*"){node.edges[char]=node;node.final=final;}else{var next=new _lunr.TokenSet();next.final=final;node.edges[char]=next;node=next;}}return root;};/**
 * Converts this TokenSet into an array of strings
 * contained within the TokenSet.
 *
 * This is not intended to be used on a TokenSet that
 * contains wildcards, in these cases the results are
 * undefined and are likely to cause an infinite loop.
 *
 * @returns {string[]}
 */_lunr.TokenSet.prototype.toArray=function(){var words=[];var stack=[{prefix:"",node:this}];while(stack.length){var frame=stack.pop(),edges=Object.keys(frame.node.edges),len=edges.length;if(frame.node.final){/* In Safari, at this point the prefix is sometimes corrupted, see:
       * https://github.com/olivernn/lunr.js/issues/279 Calling any
       * String.prototype method forces Safari to "cast" this string to what
       * it's supposed to be, fixing the bug. */frame.prefix.charAt(0);words.push(frame.prefix);}for(var i=0;i<len;i++){var edge=edges[i];stack.push({prefix:frame.prefix.concat(edge),node:frame.node.edges[edge]});}}return words;};/**
 * Generates a string representation of a TokenSet.
 *
 * This is intended to allow TokenSets to be used as keys
 * in objects, largely to aid the construction and minimisation
 * of a TokenSet. As such it is not designed to be a human
 * friendly representation of the TokenSet.
 *
 * @returns {string}
 */_lunr.TokenSet.prototype.toString=function(){// NOTE: Using Object.keys here as this.edges is very likely
// to enter 'hash-mode' with many keys being added
//
// avoiding a for-in loop here as it leads to the function
// being de-optimised (at least in V8). From some simple
// benchmarks the performance is comparable, but allowing
// V8 to optimize may mean easy performance wins in the future.
if(this._str){return this._str;}var str=this.final?'1':'0',labels=Object.keys(this.edges).sort(),len=labels.length;for(var i=0;i<len;i++){var label=labels[i],node=this.edges[label];str=str+label+node.id;}return str;};/**
 * Returns a new TokenSet that is the intersection of
 * this TokenSet and the passed TokenSet.
 *
 * This intersection will take into account any wildcards
 * contained within the TokenSet.
 *
 * @param {lunr.TokenSet} b - An other TokenSet to intersect with.
 * @returns {lunr.TokenSet}
 */_lunr.TokenSet.prototype.intersect=function(b){var output=new _lunr.TokenSet(),frame=undefined;var stack=[{qNode:b,output:output,node:this}];while(stack.length){frame=stack.pop();// NOTE: As with the #toString method, we are using
// Object.keys and a for loop instead of a for-in loop
// as both of these objects enter 'hash' mode, causing
// the function to be de-optimised in V8
var qEdges=Object.keys(frame.qNode.edges),qLen=qEdges.length,nEdges=Object.keys(frame.node.edges),nLen=nEdges.length;for(var q=0;q<qLen;q++){var qEdge=qEdges[q];for(var n=0;n<nLen;n++){var nEdge=nEdges[n];if(nEdge==qEdge||qEdge=='*'){var node=frame.node.edges[nEdge],qNode=frame.qNode.edges[qEdge],final=node.final&&qNode.final,next=undefined;if(nEdge in frame.output.edges){// an edge already exists for this character
// no need to create a new node, just set the finality
// bit unless this node is already final
next=frame.output.edges[nEdge];next.final=next.final||final;}else{// no edge exists yet, must create one
// set the finality bit and insert it
// into the output
next=new _lunr.TokenSet();next.final=final;frame.output.edges[nEdge]=next;}stack.push({qNode:qNode,output:next,node:node});}}}}return output;};_lunr.TokenSet.Builder=function(){this.previousWord="";this.root=new _lunr.TokenSet();this.uncheckedNodes=[];this.minimizedNodes={};};_lunr.TokenSet.Builder.prototype.insert=function(word){var node,commonPrefix=0;if(word<this.previousWord){throw new Error("Out of order word insertion");}for(var i=0;i<word.length&&i<this.previousWord.length;i++){if(word[i]!=this.previousWord[i])break;commonPrefix++;}this.minimize(commonPrefix);if(this.uncheckedNodes.length==0){node=this.root;}else{node=this.uncheckedNodes[this.uncheckedNodes.length-1].child;}for(var i=commonPrefix;i<word.length;i++){var nextNode=new _lunr.TokenSet(),char=word[i];node.edges[char]=nextNode;this.uncheckedNodes.push({parent:node,char:char,child:nextNode});node=nextNode;}node.final=true;this.previousWord=word;};_lunr.TokenSet.Builder.prototype.finish=function(){this.minimize(0);};_lunr.TokenSet.Builder.prototype.minimize=function(downTo){for(var i=this.uncheckedNodes.length-1;i>=downTo;i--){var node=this.uncheckedNodes[i],childKey=node.child.toString();if(childKey in this.minimizedNodes){node.parent.edges[node.char]=this.minimizedNodes[childKey];}else{// Cache the key for this node since
// we know it can't change anymore
node.child._str=childKey;this.minimizedNodes[childKey]=node.child;}this.uncheckedNodes.pop();}};/*!
 * lunr.Index
 * Copyright (C) 2020 Oliver Nightingale
 *//**
 * An index contains the built index of all documents and provides a query interface
 * to the index.
 *
 * Usually instances of lunr.Index will not be created using this constructor, instead
 * lunr.Builder should be used to construct new indexes, or lunr.Index.load should be
 * used to load previously built and serialized indexes.
 *
 * @constructor
 * @param {Object} attrs - The attributes of the built search index.
 * @param {Object} attrs.invertedIndex - An index of term/field to document reference.
 * @param {Object<string, lunr.Vector>} attrs.fieldVectors - Field vectors
 * @param {lunr.TokenSet} attrs.tokenSet - An set of all corpus tokens.
 * @param {string[]} attrs.fields - The names of indexed document fields.
 * @param {lunr.Pipeline} attrs.pipeline - The pipeline to use for search terms.
 */_lunr.Index=function(attrs){this.invertedIndex=attrs.invertedIndex;this.fieldVectors=attrs.fieldVectors;this.tokenSet=attrs.tokenSet;this.fields=attrs.fields;this.pipeline=attrs.pipeline;};/**
 * A result contains details of a document matching a search query.
 * @typedef {Object} lunr.Index~Result
 * @property {string} ref - The reference of the document this result represents.
 * @property {number} score - A number between 0 and 1 representing how similar this document is to the query.
 * @property {lunr.MatchData} matchData - Contains metadata about this match including which term(s) caused the match.
 *//**
 * Although lunr provides the ability to create queries using lunr.Query, it also provides a simple
 * query language which itself is parsed into an instance of lunr.Query.
 *
 * For programmatically building queries it is advised to directly use lunr.Query, the query language
 * is best used for human entered text rather than program generated text.
 *
 * At its simplest queries can just be a single term, e.g. `hello`, multiple terms are also supported
 * and will be combined with OR, e.g `hello world` will match documents that contain either 'hello'
 * or 'world', though those that contain both will rank higher in the results.
 *
 * Wildcards can be included in terms to match one or more unspecified characters, these wildcards can
 * be inserted anywhere within the term, and more than one wildcard can exist in a single term. Adding
 * wildcards will increase the number of documents that will be found but can also have a negative
 * impact on query performance, especially with wildcards at the beginning of a term.
 *
 * Terms can be restricted to specific fields, e.g. `title:hello`, only documents with the term
 * hello in the title field will match this query. Using a field not present in the index will lead
 * to an error being thrown.
 *
 * Modifiers can also be added to terms, lunr supports edit distance and boost modifiers on terms. A term
 * boost will make documents matching that term score higher, e.g. `foo^5`. Edit distance is also supported
 * to provide fuzzy matching, e.g. 'hello~2' will match documents with hello with an edit distance of 2.
 * Avoid large values for edit distance to improve query performance.
 *
 * Each term also supports a presence modifier. By default a term's presence in document is optional, however
 * this can be changed to either required or prohibited. For a term's presence to be required in a document the
 * term should be prefixed with a '+', e.g. `+foo bar` is a search for documents that must contain 'foo' and
 * optionally contain 'bar'. Conversely a leading '-' sets the terms presence to prohibited, i.e. it must not
 * appear in a document, e.g. `-foo bar` is a search for documents that do not contain 'foo' but may contain 'bar'.
 *
 * To escape special characters the backslash character '\' can be used, this allows searches to include
 * characters that would normally be considered modifiers, e.g. `foo\~2` will search for a term "foo~2" instead
 * of attempting to apply a boost of 2 to the search term "foo".
 *
 * @typedef {string} lunr.Index~QueryString
 * @example <caption>Simple single term query</caption>
 * hello
 * @example <caption>Multiple term query</caption>
 * hello world
 * @example <caption>term scoped to a field</caption>
 * title:hello
 * @example <caption>term with a boost of 10</caption>
 * hello^10
 * @example <caption>term with an edit distance of 2</caption>
 * hello~2
 * @example <caption>terms with presence modifiers</caption>
 * -foo +bar baz
 *//**
 * Performs a search against the index using lunr query syntax.
 *
 * Results will be returned sorted by their score, the most relevant results
 * will be returned first.  For details on how the score is calculated, please see
 * the {@link https://lunrjs.com/guides/searching.html#scoring|guide}.
 *
 * For more programmatic querying use lunr.Index#query.
 *
 * @param {lunr.Index~QueryString} queryString - A string containing a lunr query.
 * @throws {lunr.QueryParseError} If the passed query string cannot be parsed.
 * @returns {lunr.Index~Result[]}
 */_lunr.Index.prototype.search=function(queryString){return this.query(function(query){var parser=new _lunr.QueryParser(queryString,query);parser.parse();});};/**
 * A query builder callback provides a query object to be used to express
 * the query to perform on the index.
 *
 * @callback lunr.Index~queryBuilder
 * @param {lunr.Query} query - The query object to build up.
 * @this lunr.Query
 *//**
 * Performs a query against the index using the yielded lunr.Query object.
 *
 * If performing programmatic queries against the index, this method is preferred
 * over lunr.Index#search so as to avoid the additional query parsing overhead.
 *
 * A query object is yielded to the supplied function which should be used to
 * express the query to be run against the index.
 *
 * Note that although this function takes a callback parameter it is _not_ an
 * asynchronous operation, the callback is just yielded a query object to be
 * customized.
 *
 * @param {lunr.Index~queryBuilder} fn - A function that is used to build the query.
 * @returns {lunr.Index~Result[]}
 */_lunr.Index.prototype.query=function(fn){// for each query clause
// * process terms
// * expand terms from token set
// * find matching documents and metadata
// * get document vectors
// * score documents
var query=new _lunr.Query(this.fields),matchingFields=Object.create(null),queryVectors=Object.create(null),termFieldCache=Object.create(null),requiredMatches=Object.create(null),prohibitedMatches=Object.create(null);/*
   * To support field level boosts a query vector is created per
   * field. An empty vector is eagerly created to support negated
   * queries.
   */for(var i=0;i<this.fields.length;i++){queryVectors[this.fields[i]]=new _lunr.Vector();}fn.call(query,query);for(var i=0;i<query.clauses.length;i++){/*
     * Unless the pipeline has been disabled for this term, which is
     * the case for terms with wildcards, we need to pass the clause
     * term through the search pipeline. A pipeline returns an array
     * of processed terms. Pipeline functions may expand the passed
     * term, which means we may end up performing multiple index lookups
     * for a single query term.
     */var clause=query.clauses[i],terms=null,clauseMatches=_lunr.Set.empty;if(clause.usePipeline){terms=this.pipeline.runString(clause.term,{fields:clause.fields});}else{terms=[clause.term];}for(var m=0;m<terms.length;m++){var term=terms[m];/*
       * Each term returned from the pipeline needs to use the same query
       * clause object, e.g. the same boost and or edit distance. The
       * simplest way to do this is to re-use the clause object but mutate
       * its term property.
       */clause.term=term;/*
       * From the term in the clause we create a token set which will then
       * be used to intersect the indexes token set to get a list of terms
       * to lookup in the inverted index
       */var termTokenSet=_lunr.TokenSet.fromClause(clause),expandedTerms=this.tokenSet.intersect(termTokenSet).toArray();/*
       * If a term marked as required does not exist in the tokenSet it is
       * impossible for the search to return any matches. We set all the field
       * scoped required matches set to empty and stop examining any further
       * clauses.
       */if(expandedTerms.length===0&&clause.presence===_lunr.Query.presence.REQUIRED){for(var k=0;k<clause.fields.length;k++){var field=clause.fields[k];requiredMatches[field]=_lunr.Set.empty;}break;}for(var j=0;j<expandedTerms.length;j++){/*
         * For each term get the posting and termIndex, this is required for
         * building the query vector.
         */var expandedTerm=expandedTerms[j],posting=this.invertedIndex[expandedTerm],termIndex=posting._index;for(var k=0;k<clause.fields.length;k++){/*
           * For each field that this query term is scoped by (by default
           * all fields are in scope) we need to get all the document refs
           * that have this term in that field.
           *
           * The posting is the entry in the invertedIndex for the matching
           * term from above.
           */var field=clause.fields[k],fieldPosting=posting[field],matchingDocumentRefs=Object.keys(fieldPosting),termField=expandedTerm+"/"+field,matchingDocumentsSet=new _lunr.Set(matchingDocumentRefs);/*
           * if the presence of this term is required ensure that the matching
           * documents are added to the set of required matches for this clause.
           *
           */if(clause.presence==_lunr.Query.presence.REQUIRED){clauseMatches=clauseMatches.union(matchingDocumentsSet);if(requiredMatches[field]===undefined){requiredMatches[field]=_lunr.Set.complete;}}/*
           * if the presence of this term is prohibited ensure that the matching
           * documents are added to the set of prohibited matches for this field,
           * creating that set if it does not yet exist.
           */if(clause.presence==_lunr.Query.presence.PROHIBITED){if(prohibitedMatches[field]===undefined){prohibitedMatches[field]=_lunr.Set.empty;}prohibitedMatches[field]=prohibitedMatches[field].union(matchingDocumentsSet);/*
             * Prohibited matches should not be part of the query vector used for
             * similarity scoring and no metadata should be extracted so we continue
             * to the next field
             */continue;}/*
           * The query field vector is populated using the termIndex found for
           * the term and a unit value with the appropriate boost applied.
           * Using upsert because there could already be an entry in the vector
           * for the term we are working with. In that case we just add the scores
           * together.
           */queryVectors[field].upsert(termIndex,clause.boost,function(a,b){return a+b;});/**
           * If we've already seen this term, field combo then we've already collected
           * the matching documents and metadata, no need to go through all that again
           */if(termFieldCache[termField]){continue;}for(var l=0;l<matchingDocumentRefs.length;l++){/*
             * All metadata for this term/field/document triple
             * are then extracted and collected into an instance
             * of lunr.MatchData ready to be returned in the query
             * results
             */var matchingDocumentRef=matchingDocumentRefs[l],matchingFieldRef=new _lunr.FieldRef(matchingDocumentRef,field),metadata=fieldPosting[matchingDocumentRef],fieldMatch;if((fieldMatch=matchingFields[matchingFieldRef])===undefined){matchingFields[matchingFieldRef]=new _lunr.MatchData(expandedTerm,field,metadata);}else{fieldMatch.add(expandedTerm,field,metadata);}}termFieldCache[termField]=true;}}}/**
     * If the presence was required we need to update the requiredMatches field sets.
     * We do this after all fields for the term have collected their matches because
     * the clause terms presence is required in _any_ of the fields not _all_ of the
     * fields.
     */if(clause.presence===_lunr.Query.presence.REQUIRED){for(var k=0;k<clause.fields.length;k++){var field=clause.fields[k];requiredMatches[field]=requiredMatches[field].intersect(clauseMatches);}}}/**
   * Need to combine the field scoped required and prohibited
   * matching documents into a global set of required and prohibited
   * matches
   */var allRequiredMatches=_lunr.Set.complete,allProhibitedMatches=_lunr.Set.empty;for(var i=0;i<this.fields.length;i++){var field=this.fields[i];if(requiredMatches[field]){allRequiredMatches=allRequiredMatches.intersect(requiredMatches[field]);}if(prohibitedMatches[field]){allProhibitedMatches=allProhibitedMatches.union(prohibitedMatches[field]);}}var matchingFieldRefs=Object.keys(matchingFields),results=[],matches=Object.create(null);/*
   * If the query is negated (contains only prohibited terms)
   * we need to get _all_ fieldRefs currently existing in the
   * index. This is only done when we know that the query is
   * entirely prohibited terms to avoid any cost of getting all
   * fieldRefs unnecessarily.
   *
   * Additionally, blank MatchData must be created to correctly
   * populate the results.
   */if(query.isNegated()){matchingFieldRefs=Object.keys(this.fieldVectors);for(var i=0;i<matchingFieldRefs.length;i++){var matchingFieldRef=matchingFieldRefs[i];var fieldRef=_lunr.FieldRef.fromString(matchingFieldRef);matchingFields[matchingFieldRef]=new _lunr.MatchData();}}for(var i=0;i<matchingFieldRefs.length;i++){/*
     * Currently we have document fields that match the query, but we
     * need to return documents. The matchData and scores are combined
     * from multiple fields belonging to the same document.
     *
     * Scores are calculated by field, using the query vectors created
     * above, and combined into a final document score using addition.
     */var fieldRef=_lunr.FieldRef.fromString(matchingFieldRefs[i]),docRef=fieldRef.docRef;if(!allRequiredMatches.contains(docRef)){continue;}if(allProhibitedMatches.contains(docRef)){continue;}var fieldVector=this.fieldVectors[fieldRef],score=queryVectors[fieldRef.fieldName].similarity(fieldVector),docMatch;if((docMatch=matches[docRef])!==undefined){docMatch.score+=score;docMatch.matchData.combine(matchingFields[fieldRef]);}else{var match={ref:docRef,score:score,matchData:matchingFields[fieldRef]};matches[docRef]=match;results.push(match);}}/*
   * Sort the results objects by score, highest first.
   */return results.sort(function(a,b){return b.score-a.score;});};/**
 * Prepares the index for JSON serialization.
 *
 * The schema for this JSON blob will be described in a
 * separate JSON schema file.
 *
 * @returns {Object}
 */_lunr.Index.prototype.toJSON=function(){var invertedIndex=Object.keys(this.invertedIndex).sort().map(function(term){return[term,this.invertedIndex[term]];},this);var fieldVectors=Object.keys(this.fieldVectors).map(function(ref){return[ref,this.fieldVectors[ref].toJSON()];},this);return{version:_lunr.version,fields:this.fields,fieldVectors:fieldVectors,invertedIndex:invertedIndex,pipeline:this.pipeline.toJSON()};};/**
 * Loads a previously serialized lunr.Index
 *
 * @param {Object} serializedIndex - A previously serialized lunr.Index
 * @returns {lunr.Index}
 */_lunr.Index.load=function(serializedIndex){var attrs={},fieldVectors={},serializedVectors=serializedIndex.fieldVectors,invertedIndex=Object.create(null),serializedInvertedIndex=serializedIndex.invertedIndex,tokenSetBuilder=new _lunr.TokenSet.Builder(),pipeline=_lunr.Pipeline.load(serializedIndex.pipeline);if(serializedIndex.version!=_lunr.version){_lunr.utils.warn("Version mismatch when loading serialised index. Current version of lunr '"+_lunr.version+"' does not match serialized index '"+serializedIndex.version+"'");}for(var i=0;i<serializedVectors.length;i++){var tuple=serializedVectors[i],ref=tuple[0],elements=tuple[1];fieldVectors[ref]=new _lunr.Vector(elements);}for(var i=0;i<serializedInvertedIndex.length;i++){var tuple=serializedInvertedIndex[i],term=tuple[0],posting=tuple[1];tokenSetBuilder.insert(term);invertedIndex[term]=posting;}tokenSetBuilder.finish();attrs.fields=serializedIndex.fields;attrs.fieldVectors=fieldVectors;attrs.invertedIndex=invertedIndex;attrs.tokenSet=tokenSetBuilder.root;attrs.pipeline=pipeline;return new _lunr.Index(attrs);};/*!
 * lunr.Builder
 * Copyright (C) 2020 Oliver Nightingale
 *//**
 * lunr.Builder performs indexing on a set of documents and
 * returns instances of lunr.Index ready for querying.
 *
 * All configuration of the index is done via the builder, the
 * fields to index, the document reference, the text processing
 * pipeline and document scoring parameters are all set on the
 * builder before indexing.
 *
 * @constructor
 * @property {string} _ref - Internal reference to the document reference field.
 * @property {string[]} _fields - Internal reference to the document fields to index.
 * @property {object} invertedIndex - The inverted index maps terms to document fields.
 * @property {object} documentTermFrequencies - Keeps track of document term frequencies.
 * @property {object} documentLengths - Keeps track of the length of documents added to the index.
 * @property {lunr.tokenizer} tokenizer - Function for splitting strings into tokens for indexing.
 * @property {lunr.Pipeline} pipeline - The pipeline performs text processing on tokens before indexing.
 * @property {lunr.Pipeline} searchPipeline - A pipeline for processing search terms before querying the index.
 * @property {number} documentCount - Keeps track of the total number of documents indexed.
 * @property {number} _b - A parameter to control field length normalization, setting this to 0 disabled normalization, 1 fully normalizes field lengths, the default value is 0.75.
 * @property {number} _k1 - A parameter to control how quickly an increase in term frequency results in term frequency saturation, the default value is 1.2.
 * @property {number} termIndex - A counter incremented for each unique term, used to identify a terms position in the vector space.
 * @property {array} metadataWhitelist - A list of metadata keys that have been whitelisted for entry in the index.
 */_lunr.Builder=function(){this._ref="id";this._fields=Object.create(null);this._documents=Object.create(null);this.invertedIndex=Object.create(null);this.fieldTermFrequencies={};this.fieldLengths={};this.tokenizer=_lunr.tokenizer;this.pipeline=new _lunr.Pipeline();this.searchPipeline=new _lunr.Pipeline();this.documentCount=0;this._b=0.75;this._k1=1.2;this.termIndex=0;this.metadataWhitelist=[];};/**
 * Sets the document field used as the document reference. Every document must have this field.
 * The type of this field in the document should be a string, if it is not a string it will be
 * coerced into a string by calling toString.
 *
 * The default ref is 'id'.
 *
 * The ref should _not_ be changed during indexing, it should be set before any documents are
 * added to the index. Changing it during indexing can lead to inconsistent results.
 *
 * @param {string} ref - The name of the reference field in the document.
 */_lunr.Builder.prototype.ref=function(ref){this._ref=ref;};/**
 * A function that is used to extract a field from a document.
 *
 * Lunr expects a field to be at the top level of a document, if however the field
 * is deeply nested within a document an extractor function can be used to extract
 * the right field for indexing.
 *
 * @callback fieldExtractor
 * @param {object} doc - The document being added to the index.
 * @returns {?(string|object|object[])} obj - The object that will be indexed for this field.
 * @example <caption>Extracting a nested field</caption>
 * function (doc) { return doc.nested.field }
 *//**
 * Adds a field to the list of document fields that will be indexed. Every document being
 * indexed should have this field. Null values for this field in indexed documents will
 * not cause errors but will limit the chance of that document being retrieved by searches.
 *
 * All fields should be added before adding documents to the index. Adding fields after
 * a document has been indexed will have no effect on already indexed documents.
 *
 * Fields can be boosted at build time. This allows terms within that field to have more
 * importance when ranking search results. Use a field boost to specify that matches within
 * one field are more important than other fields.
 *
 * @param {string} fieldName - The name of a field to index in all documents.
 * @param {object} attributes - Optional attributes associated with this field.
 * @param {number} [attributes.boost=1] - Boost applied to all terms within this field.
 * @param {fieldExtractor} [attributes.extractor] - Function to extract a field from a document.
 * @throws {RangeError} fieldName cannot contain unsupported characters '/'
 */_lunr.Builder.prototype.field=function(fieldName,attributes){if(/\//.test(fieldName)){throw new RangeError("Field '"+fieldName+"' contains illegal character '/'");}this._fields[fieldName]=attributes||{};};/**
 * A parameter to tune the amount of field length normalisation that is applied when
 * calculating relevance scores. A value of 0 will completely disable any normalisation
 * and a value of 1 will fully normalise field lengths. The default is 0.75. Values of b
 * will be clamped to the range 0 - 1.
 *
 * @param {number} number - The value to set for this tuning parameter.
 */_lunr.Builder.prototype.b=function(number){if(number<0){this._b=0;}else if(number>1){this._b=1;}else{this._b=number;}};/**
 * A parameter that controls the speed at which a rise in term frequency results in term
 * frequency saturation. The default value is 1.2. Setting this to a higher value will give
 * slower saturation levels, a lower value will result in quicker saturation.
 *
 * @param {number} number - The value to set for this tuning parameter.
 */_lunr.Builder.prototype.k1=function(number){this._k1=number;};/**
 * Adds a document to the index.
 *
 * Before adding fields to the index the index should have been fully setup, with the document
 * ref and all fields to index already having been specified.
 *
 * The document must have a field name as specified by the ref (by default this is 'id') and
 * it should have all fields defined for indexing, though null or undefined values will not
 * cause errors.
 *
 * Entire documents can be boosted at build time. Applying a boost to a document indicates that
 * this document should rank higher in search results than other documents.
 *
 * @param {object} doc - The document to add to the index.
 * @param {object} attributes - Optional attributes associated with this document.
 * @param {number} [attributes.boost=1] - Boost applied to all terms within this document.
 */_lunr.Builder.prototype.add=function(doc,attributes){var docRef=doc[this._ref],fields=Object.keys(this._fields);this._documents[docRef]=attributes||{};this.documentCount+=1;for(var i=0;i<fields.length;i++){var fieldName=fields[i],extractor=this._fields[fieldName].extractor,field=extractor?extractor(doc):doc[fieldName],tokens=this.tokenizer(field,{fields:[fieldName]}),terms=this.pipeline.run(tokens),fieldRef=new _lunr.FieldRef(docRef,fieldName),fieldTerms=Object.create(null);this.fieldTermFrequencies[fieldRef]=fieldTerms;this.fieldLengths[fieldRef]=0;// store the length of this field for this document
this.fieldLengths[fieldRef]+=terms.length;// calculate term frequencies for this field
for(var j=0;j<terms.length;j++){var term=terms[j];if(fieldTerms[term]==undefined){fieldTerms[term]=0;}fieldTerms[term]+=1;// add to inverted index
// create an initial posting if one doesn't exist
if(this.invertedIndex[term]==undefined){var posting=Object.create(null);posting["_index"]=this.termIndex;this.termIndex+=1;for(var k=0;k<fields.length;k++){posting[fields[k]]=Object.create(null);}this.invertedIndex[term]=posting;}// add an entry for this term/fieldName/docRef to the invertedIndex
if(this.invertedIndex[term][fieldName][docRef]==undefined){this.invertedIndex[term][fieldName][docRef]=Object.create(null);}// store all whitelisted metadata about this token in the
// inverted index
for(var l=0;l<this.metadataWhitelist.length;l++){var metadataKey=this.metadataWhitelist[l],metadata=term.metadata[metadataKey];if(this.invertedIndex[term][fieldName][docRef][metadataKey]==undefined){this.invertedIndex[term][fieldName][docRef][metadataKey]=[];}this.invertedIndex[term][fieldName][docRef][metadataKey].push(metadata);}}}};/**
 * Calculates the average document length for this index
 *
 * @private
 */_lunr.Builder.prototype.calculateAverageFieldLengths=function(){var fieldRefs=Object.keys(this.fieldLengths),numberOfFields=fieldRefs.length,accumulator={},documentsWithField={};for(var i=0;i<numberOfFields;i++){var fieldRef=_lunr.FieldRef.fromString(fieldRefs[i]),field=fieldRef.fieldName;documentsWithField[field]||(documentsWithField[field]=0);documentsWithField[field]+=1;accumulator[field]||(accumulator[field]=0);accumulator[field]+=this.fieldLengths[fieldRef];}var fields=Object.keys(this._fields);for(var i=0;i<fields.length;i++){var fieldName=fields[i];accumulator[fieldName]=accumulator[fieldName]/documentsWithField[fieldName];}this.averageFieldLength=accumulator;};/**
 * Builds a vector space model of every document using lunr.Vector
 *
 * @private
 */_lunr.Builder.prototype.createFieldVectors=function(){var fieldVectors={},fieldRefs=Object.keys(this.fieldTermFrequencies),fieldRefsLength=fieldRefs.length,termIdfCache=Object.create(null);for(var i=0;i<fieldRefsLength;i++){var fieldRef=_lunr.FieldRef.fromString(fieldRefs[i]),fieldName=fieldRef.fieldName,fieldLength=this.fieldLengths[fieldRef],fieldVector=new _lunr.Vector(),termFrequencies=this.fieldTermFrequencies[fieldRef],terms=Object.keys(termFrequencies),termsLength=terms.length;var fieldBoost=this._fields[fieldName].boost||1,docBoost=this._documents[fieldRef.docRef].boost||1;for(var j=0;j<termsLength;j++){var term=terms[j],tf=termFrequencies[term],termIndex=this.invertedIndex[term]._index,idf,score,scoreWithPrecision;if(termIdfCache[term]===undefined){idf=_lunr.idf(this.invertedIndex[term],this.documentCount);termIdfCache[term]=idf;}else{idf=termIdfCache[term];}score=idf*((this._k1+1)*tf)/(this._k1*(1-this._b+this._b*(fieldLength/this.averageFieldLength[fieldName]))+tf);score*=fieldBoost;score*=docBoost;scoreWithPrecision=Math.round(score*1000)/1000;// Converts 1.23456789 to 1.234.
// Reducing the precision so that the vectors take up less
// space when serialised. Doing it now so that they behave
// the same before and after serialisation. Also, this is
// the fastest approach to reducing a number's precision in
// JavaScript.
fieldVector.insert(termIndex,scoreWithPrecision);}fieldVectors[fieldRef]=fieldVector;}this.fieldVectors=fieldVectors;};/**
 * Creates a token set of all tokens in the index using lunr.TokenSet
 *
 * @private
 */_lunr.Builder.prototype.createTokenSet=function(){this.tokenSet=_lunr.TokenSet.fromArray(Object.keys(this.invertedIndex).sort());};/**
 * Builds the index, creating an instance of lunr.Index.
 *
 * This completes the indexing process and should only be called
 * once all documents have been added to the index.
 *
 * @returns {lunr.Index}
 */_lunr.Builder.prototype.build=function(){this.calculateAverageFieldLengths();this.createFieldVectors();this.createTokenSet();return new _lunr.Index({invertedIndex:this.invertedIndex,fieldVectors:this.fieldVectors,tokenSet:this.tokenSet,fields:Object.keys(this._fields),pipeline:this.searchPipeline});};/**
 * Applies a plugin to the index builder.
 *
 * A plugin is a function that is called with the index builder as its context.
 * Plugins can be used to customise or extend the behaviour of the index
 * in some way. A plugin is just a function, that encapsulated the custom
 * behaviour that should be applied when building the index.
 *
 * The plugin function will be called with the index builder as its argument, additional
 * arguments can also be passed when calling use. The function will be called
 * with the index builder as its context.
 *
 * @param {Function} plugin The plugin to apply.
 */_lunr.Builder.prototype.use=function(fn){var args=Array.prototype.slice.call(arguments,1);args.unshift(this);fn.apply(this,args);};/**
 * Contains and collects metadata about a matching document.
 * A single instance of lunr.MatchData is returned as part of every
 * lunr.Index~Result.
 *
 * @constructor
 * @param {string} term - The term this match data is associated with
 * @param {string} field - The field in which the term was found
 * @param {object} metadata - The metadata recorded about this term in this field
 * @property {object} metadata - A cloned collection of metadata associated with this document.
 * @see {@link lunr.Index~Result}
 */_lunr.MatchData=function(term,field,metadata){var clonedMetadata=Object.create(null),metadataKeys=Object.keys(metadata||{});// Cloning the metadata to prevent the original
// being mutated during match data combination.
// Metadata is kept in an array within the inverted
// index so cloning the data can be done with
// Array#slice
for(var i=0;i<metadataKeys.length;i++){var key=metadataKeys[i];clonedMetadata[key]=metadata[key].slice();}this.metadata=Object.create(null);if(term!==undefined){this.metadata[term]=Object.create(null);this.metadata[term][field]=clonedMetadata;}};/**
 * An instance of lunr.MatchData will be created for every term that matches a
 * document. However only one instance is required in a lunr.Index~Result. This
 * method combines metadata from another instance of lunr.MatchData with this
 * objects metadata.
 *
 * @param {lunr.MatchData} otherMatchData - Another instance of match data to merge with this one.
 * @see {@link lunr.Index~Result}
 */_lunr.MatchData.prototype.combine=function(otherMatchData){var terms=Object.keys(otherMatchData.metadata);for(var i=0;i<terms.length;i++){var term=terms[i],fields=Object.keys(otherMatchData.metadata[term]);if(this.metadata[term]==undefined){this.metadata[term]=Object.create(null);}for(var j=0;j<fields.length;j++){var field=fields[j],keys=Object.keys(otherMatchData.metadata[term][field]);if(this.metadata[term][field]==undefined){this.metadata[term][field]=Object.create(null);}for(var k=0;k<keys.length;k++){var key=keys[k];if(this.metadata[term][field][key]==undefined){this.metadata[term][field][key]=otherMatchData.metadata[term][field][key];}else{this.metadata[term][field][key]=this.metadata[term][field][key].concat(otherMatchData.metadata[term][field][key]);}}}}};/**
 * Add metadata for a term/field pair to this instance of match data.
 *
 * @param {string} term - The term this match data is associated with
 * @param {string} field - The field in which the term was found
 * @param {object} metadata - The metadata recorded about this term in this field
 */_lunr.MatchData.prototype.add=function(term,field,metadata){if(!(term in this.metadata)){this.metadata[term]=Object.create(null);this.metadata[term][field]=metadata;return;}if(!(field in this.metadata[term])){this.metadata[term][field]=metadata;return;}var metadataKeys=Object.keys(metadata);for(var i=0;i<metadataKeys.length;i++){var key=metadataKeys[i];if(key in this.metadata[term][field]){this.metadata[term][field][key]=this.metadata[term][field][key].concat(metadata[key]);}else{this.metadata[term][field][key]=metadata[key];}}};/**
 * A lunr.Query provides a programmatic way of defining queries to be performed
 * against a {@link lunr.Index}.
 *
 * Prefer constructing a lunr.Query using the {@link lunr.Index#query} method
 * so the query object is pre-initialized with the right index fields.
 *
 * @constructor
 * @property {lunr.Query~Clause[]} clauses - An array of query clauses.
 * @property {string[]} allFields - An array of all available fields in a lunr.Index.
 */_lunr.Query=function(allFields){this.clauses=[];this.allFields=allFields;};/**
 * Constants for indicating what kind of automatic wildcard insertion will be used when constructing a query clause.
 *
 * This allows wildcards to be added to the beginning and end of a term without having to manually do any string
 * concatenation.
 *
 * The wildcard constants can be bitwise combined to select both leading and trailing wildcards.
 *
 * @constant
 * @default
 * @property {number} wildcard.NONE - The term will have no wildcards inserted, this is the default behaviour
 * @property {number} wildcard.LEADING - Prepend the term with a wildcard, unless a leading wildcard already exists
 * @property {number} wildcard.TRAILING - Append a wildcard to the term, unless a trailing wildcard already exists
 * @see lunr.Query~Clause
 * @see lunr.Query#clause
 * @see lunr.Query#term
 * @example <caption>query term with trailing wildcard</caption>
 * query.term('foo', { wildcard: lunr.Query.wildcard.TRAILING })
 * @example <caption>query term with leading and trailing wildcard</caption>
 * query.term('foo', {
 *   wildcard: lunr.Query.wildcard.LEADING | lunr.Query.wildcard.TRAILING
 * })
 */_lunr.Query.wildcard=new String("*");_lunr.Query.wildcard.NONE=0;_lunr.Query.wildcard.LEADING=1;_lunr.Query.wildcard.TRAILING=2;/**
 * Constants for indicating what kind of presence a term must have in matching documents.
 *
 * @constant
 * @enum {number}
 * @see lunr.Query~Clause
 * @see lunr.Query#clause
 * @see lunr.Query#term
 * @example <caption>query term with required presence</caption>
 * query.term('foo', { presence: lunr.Query.presence.REQUIRED })
 */_lunr.Query.presence={/**
   * Term's presence in a document is optional, this is the default value.
   */OPTIONAL:1,/**
   * Term's presence in a document is required, documents that do not contain
   * this term will not be returned.
   */REQUIRED:2,/**
   * Term's presence in a document is prohibited, documents that do contain
   * this term will not be returned.
   */PROHIBITED:3};/**
 * A single clause in a {@link lunr.Query} contains a term and details on how to
 * match that term against a {@link lunr.Index}.
 *
 * @typedef {Object} lunr.Query~Clause
 * @property {string[]} fields - The fields in an index this clause should be matched against.
 * @property {number} [boost=1] - Any boost that should be applied when matching this clause.
 * @property {number} [editDistance] - Whether the term should have fuzzy matching applied, and how fuzzy the match should be.
 * @property {boolean} [usePipeline] - Whether the term should be passed through the search pipeline.
 * @property {number} [wildcard=lunr.Query.wildcard.NONE] - Whether the term should have wildcards appended or prepended.
 * @property {number} [presence=lunr.Query.presence.OPTIONAL] - The terms presence in any matching documents.
 *//**
 * Adds a {@link lunr.Query~Clause} to this query.
 *
 * Unless the clause contains the fields to be matched all fields will be matched. In addition
 * a default boost of 1 is applied to the clause.
 *
 * @param {lunr.Query~Clause} clause - The clause to add to this query.
 * @see lunr.Query~Clause
 * @returns {lunr.Query}
 */_lunr.Query.prototype.clause=function(clause){if(!('fields'in clause)){clause.fields=this.allFields;}if(!('boost'in clause)){clause.boost=1;}if(!('usePipeline'in clause)){clause.usePipeline=true;}if(!('wildcard'in clause)){clause.wildcard=_lunr.Query.wildcard.NONE;}if(clause.wildcard&_lunr.Query.wildcard.LEADING&&clause.term.charAt(0)!=_lunr.Query.wildcard){clause.term="*"+clause.term;}if(clause.wildcard&_lunr.Query.wildcard.TRAILING&&clause.term.slice(-1)!=_lunr.Query.wildcard){clause.term=""+clause.term+"*";}if(!('presence'in clause)){clause.presence=_lunr.Query.presence.OPTIONAL;}this.clauses.push(clause);return this;};/**
 * A negated query is one in which every clause has a presence of
 * prohibited. These queries require some special processing to return
 * the expected results.
 *
 * @returns boolean
 */_lunr.Query.prototype.isNegated=function(){for(var i=0;i<this.clauses.length;i++){if(this.clauses[i].presence!=_lunr.Query.presence.PROHIBITED){return false;}}return true;};/**
 * Adds a term to the current query, under the covers this will create a {@link lunr.Query~Clause}
 * to the list of clauses that make up this query.
 *
 * The term is used as is, i.e. no tokenization will be performed by this method. Instead conversion
 * to a token or token-like string should be done before calling this method.
 *
 * The term will be converted to a string by calling `toString`. Multiple terms can be passed as an
 * array, each term in the array will share the same options.
 *
 * @param {object|object[]} term - The term(s) to add to the query.
 * @param {object} [options] - Any additional properties to add to the query clause.
 * @returns {lunr.Query}
 * @see lunr.Query#clause
 * @see lunr.Query~Clause
 * @example <caption>adding a single term to a query</caption>
 * query.term("foo")
 * @example <caption>adding a single term to a query and specifying search fields, term boost and automatic trailing wildcard</caption>
 * query.term("foo", {
 *   fields: ["title"],
 *   boost: 10,
 *   wildcard: lunr.Query.wildcard.TRAILING
 * })
 * @example <caption>using lunr.tokenizer to convert a string to tokens before using them as terms</caption>
 * query.term(lunr.tokenizer("foo bar"))
 */_lunr.Query.prototype.term=function(term,options){if(Array.isArray(term)){term.forEach(function(t){this.term(t,_lunr.utils.clone(options));},this);return this;}var clause=options||{};clause.term=term.toString();this.clause(clause);return this;};_lunr.QueryParseError=function(message,start,end){this.name="QueryParseError";this.message=message;this.start=start;this.end=end;};_lunr.QueryParseError.prototype=new Error();_lunr.QueryLexer=function(str){this.lexemes=[];this.str=str;this.length=str.length;this.pos=0;this.start=0;this.escapeCharPositions=[];};_lunr.QueryLexer.prototype.run=function(){var state=_lunr.QueryLexer.lexText;while(state){state=state(this);}};_lunr.QueryLexer.prototype.sliceString=function(){var subSlices=[],sliceStart=this.start,sliceEnd=this.pos;for(var i=0;i<this.escapeCharPositions.length;i++){sliceEnd=this.escapeCharPositions[i];subSlices.push(this.str.slice(sliceStart,sliceEnd));sliceStart=sliceEnd+1;}subSlices.push(this.str.slice(sliceStart,this.pos));this.escapeCharPositions.length=0;return subSlices.join('');};_lunr.QueryLexer.prototype.emit=function(type){this.lexemes.push({type:type,str:this.sliceString(),start:this.start,end:this.pos});this.start=this.pos;};_lunr.QueryLexer.prototype.escapeCharacter=function(){this.escapeCharPositions.push(this.pos-1);this.pos+=1;};_lunr.QueryLexer.prototype.next=function(){if(this.pos>=this.length){return _lunr.QueryLexer.EOS;}var char=this.str.charAt(this.pos);this.pos+=1;return char;};_lunr.QueryLexer.prototype.width=function(){return this.pos-this.start;};_lunr.QueryLexer.prototype.ignore=function(){if(this.start==this.pos){this.pos+=1;}this.start=this.pos;};_lunr.QueryLexer.prototype.backup=function(){this.pos-=1;};_lunr.QueryLexer.prototype.acceptDigitRun=function(){var char,charCode;do{char=this.next();charCode=char.charCodeAt(0);}while(charCode>47&&charCode<58);if(char!=_lunr.QueryLexer.EOS){this.backup();}};_lunr.QueryLexer.prototype.more=function(){return this.pos<this.length;};_lunr.QueryLexer.EOS='EOS';_lunr.QueryLexer.FIELD='FIELD';_lunr.QueryLexer.TERM='TERM';_lunr.QueryLexer.EDIT_DISTANCE='EDIT_DISTANCE';_lunr.QueryLexer.BOOST='BOOST';_lunr.QueryLexer.PRESENCE='PRESENCE';_lunr.QueryLexer.lexField=function(lexer){lexer.backup();lexer.emit(_lunr.QueryLexer.FIELD);lexer.ignore();return _lunr.QueryLexer.lexText;};_lunr.QueryLexer.lexTerm=function(lexer){if(lexer.width()>1){lexer.backup();lexer.emit(_lunr.QueryLexer.TERM);}lexer.ignore();if(lexer.more()){return _lunr.QueryLexer.lexText;}};_lunr.QueryLexer.lexEditDistance=function(lexer){lexer.ignore();lexer.acceptDigitRun();lexer.emit(_lunr.QueryLexer.EDIT_DISTANCE);return _lunr.QueryLexer.lexText;};_lunr.QueryLexer.lexBoost=function(lexer){lexer.ignore();lexer.acceptDigitRun();lexer.emit(_lunr.QueryLexer.BOOST);return _lunr.QueryLexer.lexText;};_lunr.QueryLexer.lexEOS=function(lexer){if(lexer.width()>0){lexer.emit(_lunr.QueryLexer.TERM);}};// This matches the separator used when tokenising fields
// within a document. These should match otherwise it is
// not possible to search for some tokens within a document.
//
// It is possible for the user to change the separator on the
// tokenizer so it _might_ clash with any other of the special
// characters already used within the search string, e.g. :.
//
// This means that it is possible to change the separator in
// such a way that makes some words unsearchable using a search
// string.
_lunr.QueryLexer.termSeparator=_lunr.tokenizer.separator;_lunr.QueryLexer.lexText=function(lexer){while(true){var char=lexer.next();if(char==_lunr.QueryLexer.EOS){return _lunr.QueryLexer.lexEOS;}// Escape character is '\'
if(char.charCodeAt(0)==92){lexer.escapeCharacter();continue;}if(char==":"){return _lunr.QueryLexer.lexField;}if(char=="~"){lexer.backup();if(lexer.width()>0){lexer.emit(_lunr.QueryLexer.TERM);}return _lunr.QueryLexer.lexEditDistance;}if(char=="^"){lexer.backup();if(lexer.width()>0){lexer.emit(_lunr.QueryLexer.TERM);}return _lunr.QueryLexer.lexBoost;}// "+" indicates term presence is required
// checking for length to ensure that only
// leading "+" are considered
if(char=="+"&&lexer.width()===1){lexer.emit(_lunr.QueryLexer.PRESENCE);return _lunr.QueryLexer.lexText;}// "-" indicates term presence is prohibited
// checking for length to ensure that only
// leading "-" are considered
if(char=="-"&&lexer.width()===1){lexer.emit(_lunr.QueryLexer.PRESENCE);return _lunr.QueryLexer.lexText;}if(char.match(_lunr.QueryLexer.termSeparator)){return _lunr.QueryLexer.lexTerm;}}};_lunr.QueryParser=function(str,query){this.lexer=new _lunr.QueryLexer(str);this.query=query;this.currentClause={};this.lexemeIdx=0;};_lunr.QueryParser.prototype.parse=function(){this.lexer.run();this.lexemes=this.lexer.lexemes;var state=_lunr.QueryParser.parseClause;while(state){state=state(this);}return this.query;};_lunr.QueryParser.prototype.peekLexeme=function(){return this.lexemes[this.lexemeIdx];};_lunr.QueryParser.prototype.consumeLexeme=function(){var lexeme=this.peekLexeme();this.lexemeIdx+=1;return lexeme;};_lunr.QueryParser.prototype.nextClause=function(){var completedClause=this.currentClause;this.query.clause(completedClause);this.currentClause={};};_lunr.QueryParser.parseClause=function(parser){var lexeme=parser.peekLexeme();if(lexeme==undefined){return;}switch(lexeme.type){case _lunr.QueryLexer.PRESENCE:return _lunr.QueryParser.parsePresence;case _lunr.QueryLexer.FIELD:return _lunr.QueryParser.parseField;case _lunr.QueryLexer.TERM:return _lunr.QueryParser.parseTerm;default:var errorMessage="expected either a field or a term, found "+lexeme.type;if(lexeme.str.length>=1){errorMessage+=" with value '"+lexeme.str+"'";}throw new _lunr.QueryParseError(errorMessage,lexeme.start,lexeme.end);}};_lunr.QueryParser.parsePresence=function(parser){var lexeme=parser.consumeLexeme();if(lexeme==undefined){return;}switch(lexeme.str){case"-":parser.currentClause.presence=_lunr.Query.presence.PROHIBITED;break;case"+":parser.currentClause.presence=_lunr.Query.presence.REQUIRED;break;default:var errorMessage="unrecognised presence operator'"+lexeme.str+"'";throw new _lunr.QueryParseError(errorMessage,lexeme.start,lexeme.end);}var nextLexeme=parser.peekLexeme();if(nextLexeme==undefined){var errorMessage="expecting term or field, found nothing";throw new _lunr.QueryParseError(errorMessage,lexeme.start,lexeme.end);}switch(nextLexeme.type){case _lunr.QueryLexer.FIELD:return _lunr.QueryParser.parseField;case _lunr.QueryLexer.TERM:return _lunr.QueryParser.parseTerm;default:var errorMessage="expecting term or field, found '"+nextLexeme.type+"'";throw new _lunr.QueryParseError(errorMessage,nextLexeme.start,nextLexeme.end);}};_lunr.QueryParser.parseField=function(parser){var lexeme=parser.consumeLexeme();if(lexeme==undefined){return;}if(parser.query.allFields.indexOf(lexeme.str)==-1){var possibleFields=parser.query.allFields.map(function(f){return"'"+f+"'";}).join(', '),errorMessage="unrecognised field '"+lexeme.str+"', possible fields: "+possibleFields;throw new _lunr.QueryParseError(errorMessage,lexeme.start,lexeme.end);}parser.currentClause.fields=[lexeme.str];var nextLexeme=parser.peekLexeme();if(nextLexeme==undefined){var errorMessage="expecting term, found nothing";throw new _lunr.QueryParseError(errorMessage,lexeme.start,lexeme.end);}switch(nextLexeme.type){case _lunr.QueryLexer.TERM:return _lunr.QueryParser.parseTerm;default:var errorMessage="expecting term, found '"+nextLexeme.type+"'";throw new _lunr.QueryParseError(errorMessage,nextLexeme.start,nextLexeme.end);}};_lunr.QueryParser.parseTerm=function(parser){var lexeme=parser.consumeLexeme();if(lexeme==undefined){return;}parser.currentClause.term=lexeme.str.toLowerCase();if(lexeme.str.indexOf("*")!=-1){parser.currentClause.usePipeline=false;}var nextLexeme=parser.peekLexeme();if(nextLexeme==undefined){parser.nextClause();return;}switch(nextLexeme.type){case _lunr.QueryLexer.TERM:parser.nextClause();return _lunr.QueryParser.parseTerm;case _lunr.QueryLexer.FIELD:parser.nextClause();return _lunr.QueryParser.parseField;case _lunr.QueryLexer.EDIT_DISTANCE:return _lunr.QueryParser.parseEditDistance;case _lunr.QueryLexer.BOOST:return _lunr.QueryParser.parseBoost;case _lunr.QueryLexer.PRESENCE:parser.nextClause();return _lunr.QueryParser.parsePresence;default:var errorMessage="Unexpected lexeme type '"+nextLexeme.type+"'";throw new _lunr.QueryParseError(errorMessage,nextLexeme.start,nextLexeme.end);}};_lunr.QueryParser.parseEditDistance=function(parser){var lexeme=parser.consumeLexeme();if(lexeme==undefined){return;}var editDistance=parseInt(lexeme.str,10);if(isNaN(editDistance)){var errorMessage="edit distance must be numeric";throw new _lunr.QueryParseError(errorMessage,lexeme.start,lexeme.end);}parser.currentClause.editDistance=editDistance;var nextLexeme=parser.peekLexeme();if(nextLexeme==undefined){parser.nextClause();return;}switch(nextLexeme.type){case _lunr.QueryLexer.TERM:parser.nextClause();return _lunr.QueryParser.parseTerm;case _lunr.QueryLexer.FIELD:parser.nextClause();return _lunr.QueryParser.parseField;case _lunr.QueryLexer.EDIT_DISTANCE:return _lunr.QueryParser.parseEditDistance;case _lunr.QueryLexer.BOOST:return _lunr.QueryParser.parseBoost;case _lunr.QueryLexer.PRESENCE:parser.nextClause();return _lunr.QueryParser.parsePresence;default:var errorMessage="Unexpected lexeme type '"+nextLexeme.type+"'";throw new _lunr.QueryParseError(errorMessage,nextLexeme.start,nextLexeme.end);}};_lunr.QueryParser.parseBoost=function(parser){var lexeme=parser.consumeLexeme();if(lexeme==undefined){return;}var boost=parseInt(lexeme.str,10);if(isNaN(boost)){var errorMessage="boost must be numeric";throw new _lunr.QueryParseError(errorMessage,lexeme.start,lexeme.end);}parser.currentClause.boost=boost;var nextLexeme=parser.peekLexeme();if(nextLexeme==undefined){parser.nextClause();return;}switch(nextLexeme.type){case _lunr.QueryLexer.TERM:parser.nextClause();return _lunr.QueryParser.parseTerm;case _lunr.QueryLexer.FIELD:parser.nextClause();return _lunr.QueryParser.parseField;case _lunr.QueryLexer.EDIT_DISTANCE:return _lunr.QueryParser.parseEditDistance;case _lunr.QueryLexer.BOOST:return _lunr.QueryParser.parseBoost;case _lunr.QueryLexer.PRESENCE:parser.nextClause();return _lunr.QueryParser.parsePresence;default:var errorMessage="Unexpected lexeme type '"+nextLexeme.type+"'";throw new _lunr.QueryParseError(errorMessage,nextLexeme.start,nextLexeme.end);}}/**
   * export the module via AMD, CommonJS or as a browser global
   * Export code from https://github.com/umdjs/umd/blob/master/returnExports.js
   */;(function(root,factory){if(typeof define==='function'&&define.amd){// AMD. Register as an anonymous module.
define(factory);}else if(typeof exports==='object'){/**
       * Node. Does not work with strict CommonJS, but
       * only CommonJS-like enviroments that support module.exports,
       * like Node.
       */module.exports=factory();}else{// Browser globals (root is window)
root.lunr=factory();}})(this,function(){/**
     * Just return a value to define the module export.
     * This example returns an object, but the module
     * can return a function as the exported value.
     */return _lunr;});})();},{}],11:[function(require,module,exports){module.exports={"name":"pict-application","version":"1.0.34","description":"Application base class for a pict view-based application","main":"source/Pict-Application.js","scripts":{"test":"npx quack test","start":"node source/Pict-Application.js","coverage":"npx quack coverage","build":"npx quack build","docker-dev-build":"docker build ./ -f Dockerfile_LUXURYCode -t pict-application-image:local","docker-dev-run":"docker run -it -d --name pict-application-dev -p 30001:8080 -p 38086:8086 -v \"$PWD/.config:/home/coder/.config\"  -v \"$PWD:/home/coder/pict-application\" -u \"$(id -u):$(id -g)\" -e \"DOCKER_USER=$USER\" pict-application-image:local","docker-dev-shell":"docker exec -it pict-application-dev /bin/bash","tests":"npx quack test -g","lint":"eslint source/**","types":"tsc -p ."},"types":"types/source/Pict-Application.d.ts","repository":{"type":"git","url":"git+https://github.com/fable-retold/pict-application.git"},"author":"steven velozo <steven@velozo.com>","license":"MIT","bugs":{"url":"https://github.com/fable-retold/pict-application/issues"},"homepage":"https://github.com/fable-retold/pict-application#readme","devDependencies":{"@eslint/js":"^9.28.0","browser-env":"^3.3.0","eslint":"^9.28.0","pict":"^1.0.348","pict-docuserve":"^0.1.5","pict-provider":"^1.0.10","pict-view":"^1.0.66","quackage":"^1.1.0","typescript":"^5.9.3"},"mocha":{"diff":true,"extension":["js"],"package":"./package.json","reporter":"spec","slow":"75","timeout":"5000","ui":"tdd","watch-files":["source/**/*.js","test/**/*.js"],"watch-ignore":["lib/vendor"]},"dependencies":{"fable-serviceproviderbase":"^3.0.19"}};},{}],12:[function(require,module,exports){const libFableServiceBase=require('fable-serviceproviderbase');const libPackage=require('../package.json');const defaultPictSettings={Name:'DefaultPictApplication',// The main "viewport" is the view that is used to host our application
MainViewportViewIdentifier:'Default-View',MainViewportRenderableHash:false,MainViewportDestinationAddress:false,MainViewportDefaultDataAddress:false,// Whether or not we should automatically render the main viewport and other autorender views after we initialize the pict application
AutoSolveAfterInitialize:true,AutoRenderMainViewportViewAfterInitialize:true,AutoRenderViewsAfterInitialize:false,AutoLoginAfterInitialize:false,AutoLoadDataAfterLogin:false,ConfigurationOnlyViews:[],Manifests:{},// The prefix to prepend on all template destination hashes
IdentifierAddressPrefix:'PICT-'};/**
 * Base class for pict applications.
 */class PictApplication extends libFableServiceBase{/**
	 * @param {import('fable')} pFable
	 * @param {Record<string, any>} [pOptions]
	 * @param {string} [pServiceHash]
	 */constructor(pFable,pOptions,pServiceHash){let tmpCarryOverConfiguration=typeof pFable.settings.PictApplicationConfiguration==='object'?pFable.settings.PictApplicationConfiguration:{};let tmpOptions=Object.assign({},JSON.parse(JSON.stringify(defaultPictSettings)),tmpCarryOverConfiguration,pOptions);super(pFable,tmpOptions,pServiceHash);/** @type {any} */this.options;/** @type {any} */this.log;/** @type {import('pict') & import('fable')} */this.fable;/** @type {string} */this.UUID;/** @type {string} */this.Hash;/**
		 * @type {{ [key: string]: any }}
		 */this.servicesMap;this.serviceType='PictApplication';/** @type {Record<string, any>} */this._Package=libPackage;// Convenience and consistency naming
this.pict=this.fable;// Wire in the essential Pict state
/** @type {Record<string, any>} */this.AppData=this.fable.AppData;/** @type {Record<string, any>} */this.Bundle=this.fable.Bundle;/** @type {number} */this.initializeTimestamp;/** @type {number} */this.lastSolvedTimestamp;/** @type {number} */this.lastLoginTimestamp;/** @type {number} */this.lastMarshalFromViewsTimestamp;/** @type {number} */this.lastMarshalToViewsTimestamp;/** @type {number} */this.lastAutoRenderTimestamp;/** @type {number} */this.lastLoadDataTimestamp;// Load all the manifests for the application
let tmpManifestKeys=Object.keys(this.options.Manifests);if(tmpManifestKeys.length>0){for(let i=0;i<tmpManifestKeys.length;i++){// Load each manifest
let tmpManifestKey=tmpManifestKeys[i];this.fable.instantiateServiceProvider('Manifest',this.options.Manifests[tmpManifestKey],tmpManifestKey);}}}/* -------------------------------------------------------------------------- *//*                     Code Section: Solve All Views                          *//* -------------------------------------------------------------------------- *//**
	 * @return {boolean}
	 */onPreSolve(){if(this.pict.LogNoisiness>3){this.log.trace("PictApp [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," onPreSolve:"));}return true;}/**
	 * @param {(error?: Error) => void} fCallback
	 */onPreSolveAsync(fCallback){this.onPreSolve();return fCallback();}/**
	 * @return {boolean}
	 */onBeforeSolve(){if(this.pict.LogNoisiness>3){this.log.trace("PictApp [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," onBeforeSolve:"));}return true;}/**
	 * @param {(error?: Error) => void} fCallback
	 */onBeforeSolveAsync(fCallback){this.onBeforeSolve();return fCallback();}/**
	 * @return {boolean}
	 */onSolve(){if(this.pict.LogNoisiness>3){this.log.trace("PictApp [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," onSolve:"));}return true;}/**
	 * @param {(error?: Error) => void} fCallback
	 */onSolveAsync(fCallback){this.onSolve();return fCallback();}/**
	 * @return {boolean}
	 */solve(){if(this.pict.LogNoisiness>2){this.log.trace("PictApp [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," executing solve() function..."));}// Walk through any loaded providers and solve them as well.
let tmpLoadedProviders=Object.keys(this.pict.providers);let tmpProvidersToSolve=[];for(let i=0;i<tmpLoadedProviders.length;i++){let tmpProvider=this.pict.providers[tmpLoadedProviders[i]];if(tmpProvider.options.AutoSolveWithApp){tmpProvidersToSolve.push(tmpProvider);}}// Sort the providers by their priority (if they are all priority 0, it will end up being add order due to JSON Object Property Key order stuff)
tmpProvidersToSolve.sort((a,b)=>{return a.options.AutoSolveOrdinal-b.options.AutoSolveOrdinal;});for(let i=0;i<tmpProvidersToSolve.length;i++){tmpProvidersToSolve[i].solve(tmpProvidersToSolve[i]);}this.onBeforeSolve();// Now walk through any loaded views and initialize them as well.
let tmpLoadedViews=Object.keys(this.pict.views);let tmpViewsToSolve=[];for(let i=0;i<tmpLoadedViews.length;i++){let tmpView=this.pict.views[tmpLoadedViews[i]];if(tmpView.options.AutoInitialize){tmpViewsToSolve.push(tmpView);}}// Sort the views by their priority (if they are all priority 0, it will end up being add order due to JSON Object Property Key order stuff)
tmpViewsToSolve.sort((a,b)=>{return a.options.AutoInitializeOrdinal-b.options.AutoInitializeOrdinal;});for(let i=0;i<tmpViewsToSolve.length;i++){tmpViewsToSolve[i].solve();}this.onSolve();this.onAfterSolve();this.lastSolvedTimestamp=this.fable.log.getTimeStamp();return true;}/**
	 * @param {(error?: Error) => void} fCallback
	 */solveAsync(fCallback){let tmpAnticipate=this.fable.instantiateServiceProviderWithoutRegistration('Anticipate');tmpAnticipate.anticipate(this.onBeforeSolveAsync.bind(this));// Allow the callback to be passed in as the last parameter no matter what
let tmpCallback=typeof fCallback==='function'?fCallback:false;if(!tmpCallback){this.log.warn("PictApp [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," solveAsync was called without a valid callback.  A callback will be generated but this could lead to race conditions."));tmpCallback=pError=>{if(pError){this.log.error("PictApp [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," solveAsync Auto Callback Error: ").concat(pError),pError);}};}// Walk through any loaded providers and solve them as well.
let tmpLoadedProviders=Object.keys(this.pict.providers);let tmpProvidersToSolve=[];for(let i=0;i<tmpLoadedProviders.length;i++){let tmpProvider=this.pict.providers[tmpLoadedProviders[i]];if(tmpProvider.options.AutoSolveWithApp){tmpProvidersToSolve.push(tmpProvider);}}// Sort the providers by their priority (if they are all priority 0, it will end up being add order due to JSON Object Property Key order stuff)
tmpProvidersToSolve.sort((a,b)=>{return a.options.AutoSolveOrdinal-b.options.AutoSolveOrdinal;});for(let i=0;i<tmpProvidersToSolve.length;i++){tmpAnticipate.anticipate(tmpProvidersToSolve[i].solveAsync.bind(tmpProvidersToSolve[i]));}// Walk through any loaded views and solve them as well.
let tmpLoadedViews=Object.keys(this.pict.views);let tmpViewsToSolve=[];for(let i=0;i<tmpLoadedViews.length;i++){let tmpView=this.pict.views[tmpLoadedViews[i]];if(tmpView.options.AutoSolveWithApp){tmpViewsToSolve.push(tmpView);}}// Sort the views by their priority (if they are all priority 0, it will end up being add order due to JSON Object Property Key order stuff)
tmpViewsToSolve.sort((a,b)=>{return a.options.AutoSolveOrdinal-b.options.AutoSolveOrdinal;});for(let i=0;i<tmpViewsToSolve.length;i++){tmpAnticipate.anticipate(tmpViewsToSolve[i].solveAsync.bind(tmpViewsToSolve[i]));}tmpAnticipate.anticipate(this.onSolveAsync.bind(this));tmpAnticipate.anticipate(this.onAfterSolveAsync.bind(this));tmpAnticipate.wait(pError=>{if(this.pict.LogNoisiness>2){this.log.trace("PictApp [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," solveAsync() complete."));}this.lastSolvedTimestamp=this.fable.log.getTimeStamp();return tmpCallback(pError);});}/**
	 * @return {boolean}
	 */onAfterSolve(){if(this.pict.LogNoisiness>3){this.log.trace("PictApp [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," onAfterSolve:"));}return true;}/**
	 * @param {(error?: Error) => void} fCallback
	 */onAfterSolveAsync(fCallback){this.onAfterSolve();return fCallback();}/* -------------------------------------------------------------------------- *//*                     Code Section: Application Login                        *//* -------------------------------------------------------------------------- *//**
	 * @param {(error?: Error) => void} fCallback
	 */onBeforeLoginAsync(fCallback){if(this.pict.LogNoisiness>3){this.log.trace("PictApp [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," onBeforeLoginAsync:"));}return fCallback();}/**
	 * @param {(error?: Error) => void} fCallback
	 */onLoginAsync(fCallback){if(this.pict.LogNoisiness>3){this.log.trace("PictApp [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," onLoginAsync:"));}return fCallback();}/**
	 * @param {(error?: Error) => void} fCallback
	 */loginAsync(fCallback){const tmpAnticipate=this.fable.instantiateServiceProviderWithoutRegistration('Anticipate');let tmpCallback=fCallback;if(typeof tmpCallback!=='function'){this.log.warn("PictApp [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," loginAsync was called without a valid callback.  A callback will be generated but this could lead to race conditions."));tmpCallback=pError=>{if(pError){this.log.error("PictApp [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," loginAsync Auto Callback Error: ").concat(pError),pError);}};}tmpAnticipate.anticipate(this.onBeforeLoginAsync.bind(this));tmpAnticipate.anticipate(this.onLoginAsync.bind(this));tmpAnticipate.anticipate(this.onAfterLoginAsync.bind(this));// check and see if we should automatically trigger a data load
if(this.options.AutoLoadDataAfterLogin){tmpAnticipate.anticipate(fNext=>{if(!this.isLoggedIn()){return fNext();}if(this.pict.LogNoisiness>1){this.log.trace("PictApp [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," auto loading data after login..."));}//TODO: should data load errors funnel here? this creates a weird coupling between login and data load callbacks
this.loadDataAsync(pError=>{fNext(pError);});});}tmpAnticipate.wait(pError=>{if(this.pict.LogNoisiness>2){this.log.trace("PictApp [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," loginAsync() complete."));}this.lastLoginTimestamp=this.fable.log.getTimeStamp();return tmpCallback(pError);});}/**
	 * Check if the application state is logged in. Defaults to true. Override this method in your application based on login requirements.
	 *
	 * @return {boolean}
	 */isLoggedIn(){return true;}/**
	 * @param {(error?: Error) => void} fCallback
	 */onAfterLoginAsync(fCallback){if(this.pict.LogNoisiness>3){this.log.trace("PictApp [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," onAfterLoginAsync:"));}return fCallback();}/* -------------------------------------------------------------------------- *//*                     Code Section: Application LoadData                     *//* -------------------------------------------------------------------------- *//**
	 * @param {(error?: Error) => void} fCallback
	 */onBeforeLoadDataAsync(fCallback){if(this.pict.LogNoisiness>3){this.log.trace("PictApp [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," onBeforeLoadDataAsync:"));}return fCallback();}/**
	 * @param {(error?: Error) => void} fCallback
	 */onLoadDataAsync(fCallback){if(this.pict.LogNoisiness>3){this.log.trace("PictApp [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," onLoadDataAsync:"));}return fCallback();}/**
	 * @param {(error?: Error) => void} fCallback
	 */loadDataAsync(fCallback){const tmpAnticipate=this.fable.instantiateServiceProviderWithoutRegistration('Anticipate');let tmpCallback=fCallback;if(typeof tmpCallback!=='function'){this.log.warn("PictApp [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," loadDataAsync was called without a valid callback.  A callback will be generated but this could lead to race conditions."));tmpCallback=pError=>{if(pError){this.log.error("PictApp [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," loadDataAsync Auto Callback Error: ").concat(pError),pError);}};}tmpAnticipate.anticipate(this.onBeforeLoadDataAsync.bind(this));// Walk through any loaded providers and load their data as well.
let tmpLoadedProviders=Object.keys(this.pict.providers);let tmpProvidersToLoadData=[];for(let i=0;i<tmpLoadedProviders.length;i++){let tmpProvider=this.pict.providers[tmpLoadedProviders[i]];if(tmpProvider.options.AutoLoadDataWithApp){tmpProvidersToLoadData.push(tmpProvider);}}// Sort the providers by their priority (if they are all priority 0, it will end up being add order due to JSON Object Property Key order stuff)
tmpProvidersToLoadData.sort((a,b)=>{return a.options.AutoLoadDataOrdinal-b.options.AutoLoadDataOrdinal;});for(const tmpProvider of tmpProvidersToLoadData){tmpAnticipate.anticipate(tmpProvider.onBeforeLoadDataAsync.bind(tmpProvider));}tmpAnticipate.anticipate(this.onLoadDataAsync.bind(this));//TODO: think about ways to parallelize these
for(const tmpProvider of tmpProvidersToLoadData){tmpAnticipate.anticipate(tmpProvider.onLoadDataAsync.bind(tmpProvider));}tmpAnticipate.anticipate(this.onAfterLoadDataAsync.bind(this));for(const tmpProvider of tmpProvidersToLoadData){tmpAnticipate.anticipate(tmpProvider.onAfterLoadDataAsync.bind(tmpProvider));}tmpAnticipate.wait(/** @param {Error} [pError] */pError=>{if(this.pict.LogNoisiness>2){this.log.trace("PictApp [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," loadDataAsync() complete."));}this.lastLoadDataTimestamp=this.fable.log.getTimeStamp();return tmpCallback(pError);});}/**
	 * @param {(error?: Error) => void} fCallback
	 */onAfterLoadDataAsync(fCallback){if(this.pict.LogNoisiness>3){this.log.trace("PictApp [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," onAfterLoadDataAsync:"));}return fCallback();}/* -------------------------------------------------------------------------- *//*                     Code Section: Application SaveData                     *//* -------------------------------------------------------------------------- *//**
	 * @param {(error?: Error) => void} fCallback
	 */onBeforeSaveDataAsync(fCallback){if(this.pict.LogNoisiness>3){this.log.trace("PictApp [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," onBeforeSaveDataAsync:"));}return fCallback();}/**
	 * @param {(error?: Error) => void} fCallback
	 */onSaveDataAsync(fCallback){if(this.pict.LogNoisiness>3){this.log.trace("PictApp [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," onSaveDataAsync:"));}return fCallback();}/**
	 * @param {(error?: Error) => void} fCallback
	 */saveDataAsync(fCallback){const tmpAnticipate=this.fable.instantiateServiceProviderWithoutRegistration('Anticipate');let tmpCallback=fCallback;if(typeof tmpCallback!=='function'){this.log.warn("PictApp [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," saveDataAsync was called without a valid callback.  A callback will be generated but this could lead to race conditions."));tmpCallback=pError=>{if(pError){this.log.error("PictApp [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," saveDataAsync Auto Callback Error: ").concat(pError),pError);}};}tmpAnticipate.anticipate(this.onBeforeSaveDataAsync.bind(this));// Walk through any loaded providers and load their data as well.
let tmpLoadedProviders=Object.keys(this.pict.providers);let tmpProvidersToSaveData=[];for(let i=0;i<tmpLoadedProviders.length;i++){let tmpProvider=this.pict.providers[tmpLoadedProviders[i]];if(tmpProvider.options.AutoSaveDataWithApp){tmpProvidersToSaveData.push(tmpProvider);}}// Sort the providers by their priority (if they are all priority 0, it will end up being add order due to JSON Object Property Key order stuff)
tmpProvidersToSaveData.sort((a,b)=>{return a.options.AutoSaveDataOrdinal-b.options.AutoSaveDataOrdinal;});for(const tmpProvider of tmpProvidersToSaveData){tmpAnticipate.anticipate(tmpProvider.onBeforeSaveDataAsync.bind(tmpProvider));}tmpAnticipate.anticipate(this.onSaveDataAsync.bind(this));//TODO: think about ways to parallelize these
for(const tmpProvider of tmpProvidersToSaveData){tmpAnticipate.anticipate(tmpProvider.onSaveDataAsync.bind(tmpProvider));}tmpAnticipate.anticipate(this.onAfterSaveDataAsync.bind(this));for(const tmpProvider of tmpProvidersToSaveData){tmpAnticipate.anticipate(tmpProvider.onAfterSaveDataAsync.bind(tmpProvider));}tmpAnticipate.wait(/** @param {Error} [pError] */pError=>{if(this.pict.LogNoisiness>2){this.log.trace("PictApp [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," saveDataAsync() complete."));}this.lastSaveDataTimestamp=this.fable.log.getTimeStamp();return tmpCallback(pError);});}/**
	 * @param {(error?: Error) => void} fCallback
	 */onAfterSaveDataAsync(fCallback){if(this.pict.LogNoisiness>3){this.log.trace("PictApp [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," onAfterSaveDataAsync:"));}return fCallback();}/* -------------------------------------------------------------------------- *//*                     Code Section: Initialize Application                   *//* -------------------------------------------------------------------------- *//**
	 * @return {boolean}
	 */onBeforeInitialize(){if(this.pict.LogNoisiness>3){this.log.trace("PictApp [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," onBeforeInitialize:"));}return true;}/**
	 * @param {(error?: Error) => void} fCallback
	 */onBeforeInitializeAsync(fCallback){this.onBeforeInitialize();return fCallback();}/**
	 * @return {boolean}
	 */onInitialize(){if(this.pict.LogNoisiness>3){this.log.trace("PictApp [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," onInitialize:"));}return true;}/**
	 * @param {(error?: Error) => void} fCallback
	 */onInitializeAsync(fCallback){this.onInitialize();return fCallback();}/**
	 * @return {boolean}
	 */initialize(){if(this.pict.LogControlFlow){this.log.trace("PICT-ControlFlow APPLICATION [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," initialize:"));}if(!this.initializeTimestamp){this.onBeforeInitialize();if('ConfigurationOnlyViews'in this.options){// Load all the configuration only views
for(let i=0;i<this.options.ConfigurationOnlyViews.length;i++){let tmpViewIdentifier=typeof this.options.ConfigurationOnlyViews[i].ViewIdentifier==='undefined'?"AutoView-".concat(this.fable.getUUID()):this.options.ConfigurationOnlyViews[i].ViewIdentifier;this.log.info("PictApp [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," adding configuration only view: ").concat(tmpViewIdentifier));this.pict.addView(tmpViewIdentifier,this.options.ConfigurationOnlyViews[i]);}}this.onInitialize();// Walk through any loaded providers and initialize them as well.
let tmpLoadedProviders=Object.keys(this.pict.providers);let tmpProvidersToInitialize=[];for(let i=0;i<tmpLoadedProviders.length;i++){let tmpProvider=this.pict.providers[tmpLoadedProviders[i]];if(tmpProvider.options.AutoInitialize){tmpProvidersToInitialize.push(tmpProvider);}}// Sort the providers by their priority (if they are all priority 0, it will end up being add order due to JSON Object Property Key order stuff)
tmpProvidersToInitialize.sort((a,b)=>{return a.options.AutoInitializeOrdinal-b.options.AutoInitializeOrdinal;});for(let i=0;i<tmpProvidersToInitialize.length;i++){tmpProvidersToInitialize[i].initialize();}// Now walk through any loaded views and initialize them as well.
let tmpLoadedViews=Object.keys(this.pict.views);let tmpViewsToInitialize=[];for(let i=0;i<tmpLoadedViews.length;i++){let tmpView=this.pict.views[tmpLoadedViews[i]];if(tmpView.options.AutoInitialize){tmpViewsToInitialize.push(tmpView);}}// Sort the views by their priority (if they are all priority 0, it will end up being add order due to JSON Object Property Key order stuff)
tmpViewsToInitialize.sort((a,b)=>{return a.options.AutoInitializeOrdinal-b.options.AutoInitializeOrdinal;});for(let i=0;i<tmpViewsToInitialize.length;i++){tmpViewsToInitialize[i].initialize();}this.onAfterInitialize();if(this.options.AutoSolveAfterInitialize){if(this.pict.LogNoisiness>1){this.log.trace("PictApp [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," auto solving after initialization..."));}// Solve the template synchronously
this.solve();}// Now check and see if we should automatically render as well
if(this.options.AutoRenderMainViewportViewAfterInitialize){if(this.pict.LogNoisiness>1){this.log.trace("PictApp [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," auto rendering after initialization..."));}// Render the template synchronously
this.render();}this.initializeTimestamp=this.fable.log.getTimeStamp();this.onCompletionOfInitialize();return true;}else{this.log.warn("PictApp [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," initialize called but initialization is already completed.  Aborting."));return false;}}/**
	 * @param {(error?: Error) => void} fCallback
	 */initializeAsync(fCallback){if(this.pict.LogControlFlow){this.log.trace("PICT-ControlFlow APPLICATION [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," initializeAsync:"));}// Allow the callback to be passed in as the last parameter no matter what
let tmpCallback=typeof fCallback==='function'?fCallback:false;if(!tmpCallback){this.log.warn("PictApp [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," initializeAsync was called without a valid callback.  A callback will be generated but this could lead to race conditions."));tmpCallback=pError=>{if(pError){this.log.error("PictApp [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," initializeAsync Auto Callback Error: ").concat(pError),pError);}};}if(!this.initializeTimestamp){let tmpAnticipate=this.fable.instantiateServiceProviderWithoutRegistration('Anticipate');if(this.pict.LogNoisiness>3){this.log.trace("PictApp [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," beginning initialization..."));}if('ConfigurationOnlyViews'in this.options){// Load all the configuration only views
for(let i=0;i<this.options.ConfigurationOnlyViews.length;i++){let tmpViewIdentifier=typeof this.options.ConfigurationOnlyViews[i].ViewIdentifier==='undefined'?"AutoView-".concat(this.fable.getUUID()):this.options.ConfigurationOnlyViews[i].ViewIdentifier;this.log.info("PictApp [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," adding configuration only view: ").concat(tmpViewIdentifier));this.pict.addView(tmpViewIdentifier,this.options.ConfigurationOnlyViews[i]);}}tmpAnticipate.anticipate(this.onBeforeInitializeAsync.bind(this));tmpAnticipate.anticipate(this.onInitializeAsync.bind(this));// Walk through any loaded providers and solve them as well.
let tmpLoadedProviders=Object.keys(this.pict.providers);let tmpProvidersToInitialize=[];for(let i=0;i<tmpLoadedProviders.length;i++){let tmpProvider=this.pict.providers[tmpLoadedProviders[i]];if(tmpProvider.options.AutoInitialize){tmpProvidersToInitialize.push(tmpProvider);}}// Sort the providers by their priority (if they are all priority 0, it will end up being add order due to JSON Object Property Key order stuff)
tmpProvidersToInitialize.sort((a,b)=>{return a.options.AutoInitializeOrdinal-b.options.AutoInitializeOrdinal;});for(let i=0;i<tmpProvidersToInitialize.length;i++){tmpAnticipate.anticipate(tmpProvidersToInitialize[i].initializeAsync.bind(tmpProvidersToInitialize[i]));}// Now walk through any loaded views and initialize them as well.
// TODO: Some optimization cleverness could be gained by grouping them into a parallelized async operation, by ordinal.
let tmpLoadedViews=Object.keys(this.pict.views);let tmpViewsToInitialize=[];for(let i=0;i<tmpLoadedViews.length;i++){let tmpView=this.pict.views[tmpLoadedViews[i]];if(tmpView.options.AutoInitialize){tmpViewsToInitialize.push(tmpView);}}// Sort the views by their priority
// If they are all the default priority 0, it will end up being add order due to JSON Object Property Key order stuff
tmpViewsToInitialize.sort((a,b)=>{return a.options.AutoInitializeOrdinal-b.options.AutoInitializeOrdinal;});for(let i=0;i<tmpViewsToInitialize.length;i++){let tmpView=tmpViewsToInitialize[i];tmpAnticipate.anticipate(tmpView.initializeAsync.bind(tmpView));}tmpAnticipate.anticipate(this.onAfterInitializeAsync.bind(this));if(this.options.AutoLoginAfterInitialize){if(this.pict.LogNoisiness>1){this.log.trace("PictApp [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," auto login (asynchronously) after initialization..."));}tmpAnticipate.anticipate(this.loginAsync.bind(this));}if(this.options.AutoSolveAfterInitialize){if(this.pict.LogNoisiness>1){this.log.trace("PictApp [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," auto solving (asynchronously) after initialization..."));}tmpAnticipate.anticipate(this.solveAsync.bind(this));}if(this.options.AutoRenderMainViewportViewAfterInitialize){if(this.pict.LogNoisiness>1){this.log.trace("PictApp [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," auto rendering (asynchronously) after initialization..."));}tmpAnticipate.anticipate(this.renderMainViewportAsync.bind(this));}tmpAnticipate.wait(pError=>{if(pError){this.log.error("PictApp [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," initializeAsync Error: ").concat(pError.message||pError),{stack:pError.stack});}this.initializeTimestamp=this.fable.log.getTimeStamp();if(this.pict.LogNoisiness>2){this.log.trace("PictApp [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," initialization complete."));}return tmpCallback();});}else{this.log.warn("PictApp [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," async initialize called but initialization is already completed.  Aborting."));// TODO: Should this be an error?
return this.onCompletionOfInitializeAsync(tmpCallback);}}/**
	 * @return {boolean}
	 */onAfterInitialize(){if(this.pict.LogNoisiness>3){this.log.trace("PictApp [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," onAfterInitialize:"));}return true;}/**
	 * @param {(error?: Error) => void} fCallback
	 */onAfterInitializeAsync(fCallback){this.onAfterInitialize();return fCallback();}/**
	 * @return {boolean}
	 */onCompletionOfInitialize(){if(this.pict.LogNoisiness>3){this.log.trace("PictApp [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," onCompletionOfInitialize:"));}return true;}/**
	 * @param {(error?: Error) => void} fCallback
	 */onCompletionOfInitializeAsync(fCallback){this.onCompletionOfInitialize();return fCallback();}/* -------------------------------------------------------------------------- *//*                     Code Section: Marshal Data From All Views              *//* -------------------------------------------------------------------------- *//**
	 * @return {boolean}
	 */onBeforeMarshalFromViews(){if(this.pict.LogNoisiness>3){this.log.trace("PictApp [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," onBeforeMarshalFromViews:"));}return true;}/**
	 * @param {(error?: Error) => void} fCallback
	 */onBeforeMarshalFromViewsAsync(fCallback){this.onBeforeMarshalFromViews();return fCallback();}/**
	 * @return {boolean}
	 */onMarshalFromViews(){if(this.pict.LogNoisiness>3){this.log.trace("PictApp [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," onMarshalFromViews:"));}return true;}/**
	 * @param {(error?: Error) => void} fCallback
	 */onMarshalFromViewsAsync(fCallback){this.onMarshalFromViews();return fCallback();}/**
	 * @return {boolean}
	 */marshalFromViews(){if(this.pict.LogNoisiness>2){this.log.trace("PictApp [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," executing marshalFromViews() function..."));}this.onBeforeMarshalFromViews();// Now walk through any loaded views and initialize them as well.
let tmpLoadedViews=Object.keys(this.pict.views);let tmpViewsToMarshalFromViews=[];for(let i=0;i<tmpLoadedViews.length;i++){let tmpView=this.pict.views[tmpLoadedViews[i]];tmpViewsToMarshalFromViews.push(tmpView);}for(let i=0;i<tmpViewsToMarshalFromViews.length;i++){tmpViewsToMarshalFromViews[i].marshalFromView();}this.onMarshalFromViews();this.onAfterMarshalFromViews();this.lastMarshalFromViewsTimestamp=this.fable.log.getTimeStamp();return true;}/**
	 * @param {(error?: Error) => void} fCallback
	 */marshalFromViewsAsync(fCallback){let tmpAnticipate=this.fable.instantiateServiceProviderWithoutRegistration('Anticipate');// Allow the callback to be passed in as the last parameter no matter what
let tmpCallback=typeof fCallback==='function'?fCallback:false;if(!tmpCallback){this.log.warn("PictApp [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," marshalFromViewsAsync was called without a valid callback.  A callback will be generated but this could lead to race conditions."));tmpCallback=pError=>{if(pError){this.log.error("PictApp [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," marshalFromViewsAsync Auto Callback Error: ").concat(pError),pError);}};}tmpAnticipate.anticipate(this.onBeforeMarshalFromViewsAsync.bind(this));// Walk through any loaded views and marshalFromViews them as well.
let tmpLoadedViews=Object.keys(this.pict.views);let tmpViewsToMarshalFromViews=[];for(let i=0;i<tmpLoadedViews.length;i++){let tmpView=this.pict.views[tmpLoadedViews[i]];tmpViewsToMarshalFromViews.push(tmpView);}for(let i=0;i<tmpViewsToMarshalFromViews.length;i++){tmpAnticipate.anticipate(tmpViewsToMarshalFromViews[i].marshalFromViewAsync.bind(tmpViewsToMarshalFromViews[i]));}tmpAnticipate.anticipate(this.onMarshalFromViewsAsync.bind(this));tmpAnticipate.anticipate(this.onAfterMarshalFromViewsAsync.bind(this));tmpAnticipate.wait(pError=>{if(this.pict.LogNoisiness>2){this.log.trace("PictApp [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," marshalFromViewsAsync() complete."));}this.lastMarshalFromViewsTimestamp=this.fable.log.getTimeStamp();return tmpCallback(pError);});}/**
	 * @return {boolean}
	 */onAfterMarshalFromViews(){if(this.pict.LogNoisiness>3){this.log.trace("PictApp [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," onAfterMarshalFromViews:"));}return true;}/**
	 * @param {(error?: Error) => void} fCallback
	 */onAfterMarshalFromViewsAsync(fCallback){this.onAfterMarshalFromViews();return fCallback();}/* -------------------------------------------------------------------------- *//*                     Code Section: Marshal Data To All Views                *//* -------------------------------------------------------------------------- *//**
	 * @return {boolean}
	 */onBeforeMarshalToViews(){if(this.pict.LogNoisiness>3){this.log.trace("PictApp [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," onBeforeMarshalToViews:"));}return true;}/**
	 * @param {(error?: Error) => void} fCallback
	 */onBeforeMarshalToViewsAsync(fCallback){this.onBeforeMarshalToViews();return fCallback();}/**
	 * @return {boolean}
	 */onMarshalToViews(){if(this.pict.LogNoisiness>3){this.log.trace("PictApp [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," onMarshalToViews:"));}return true;}/**
	 * @param {(error?: Error) => void} fCallback
	 */onMarshalToViewsAsync(fCallback){this.onMarshalToViews();return fCallback();}/**
	 * @return {boolean}
	 */marshalToViews(){if(this.pict.LogNoisiness>2){this.log.trace("PictApp [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," executing marshalToViews() function..."));}this.onBeforeMarshalToViews();// Now walk through any loaded views and initialize them as well.
let tmpLoadedViews=Object.keys(this.pict.views);let tmpViewsToMarshalToViews=[];for(let i=0;i<tmpLoadedViews.length;i++){let tmpView=this.pict.views[tmpLoadedViews[i]];tmpViewsToMarshalToViews.push(tmpView);}for(let i=0;i<tmpViewsToMarshalToViews.length;i++){tmpViewsToMarshalToViews[i].marshalToView();}this.onMarshalToViews();this.onAfterMarshalToViews();this.lastMarshalToViewsTimestamp=this.fable.log.getTimeStamp();return true;}/**
	 * @param {(error?: Error) => void} fCallback
	 */marshalToViewsAsync(fCallback){let tmpAnticipate=this.fable.instantiateServiceProviderWithoutRegistration('Anticipate');// Allow the callback to be passed in as the last parameter no matter what
let tmpCallback=typeof fCallback==='function'?fCallback:false;if(!tmpCallback){this.log.warn("PictApp [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," marshalToViewsAsync was called without a valid callback.  A callback will be generated but this could lead to race conditions."));tmpCallback=pError=>{if(pError){this.log.error("PictApp [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," marshalToViewsAsync Auto Callback Error: ").concat(pError),pError);}};}tmpAnticipate.anticipate(this.onBeforeMarshalToViewsAsync.bind(this));// Walk through any loaded views and marshalToViews them as well.
let tmpLoadedViews=Object.keys(this.pict.views);let tmpViewsToMarshalToViews=[];for(let i=0;i<tmpLoadedViews.length;i++){let tmpView=this.pict.views[tmpLoadedViews[i]];tmpViewsToMarshalToViews.push(tmpView);}for(let i=0;i<tmpViewsToMarshalToViews.length;i++){tmpAnticipate.anticipate(tmpViewsToMarshalToViews[i].marshalToViewAsync.bind(tmpViewsToMarshalToViews[i]));}tmpAnticipate.anticipate(this.onMarshalToViewsAsync.bind(this));tmpAnticipate.anticipate(this.onAfterMarshalToViewsAsync.bind(this));tmpAnticipate.wait(pError=>{if(this.pict.LogNoisiness>2){this.log.trace("PictApp [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," marshalToViewsAsync() complete."));}this.lastMarshalToViewsTimestamp=this.fable.log.getTimeStamp();return tmpCallback(pError);});}/**
	 * @return {boolean}
	 */onAfterMarshalToViews(){if(this.pict.LogNoisiness>3){this.log.trace("PictApp [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," onAfterMarshalToViews:"));}return true;}/**
	 * @param {(error?: Error) => void} fCallback
	 */onAfterMarshalToViewsAsync(fCallback){this.onAfterMarshalToViews();return fCallback();}/* -------------------------------------------------------------------------- *//*                     Code Section: Render View                              *//* -------------------------------------------------------------------------- *//**
	 * @return {boolean}
	 */onBeforeRender(){if(this.pict.LogNoisiness>3){this.log.trace("PictApp [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," onBeforeRender:"));}return true;}/**
	 * @param {(error?: Error) => void} fCallback
	 */onBeforeRenderAsync(fCallback){this.onBeforeRender();return fCallback();}/**
	 * @param {string} [pViewIdentifier] - The hash of the view to render. By default, the main viewport view is rendered.
	 * @param {string} [pRenderableHash] - The hash of the renderable to render.
	 * @param {string} [pRenderDestinationAddress] - The address where the renderable will be rendered.
	 * @param {string} [pTemplateDataAddress] - The address where the data for the template is stored.
	 *
	 * TODO: Should we support objects for pTemplateDataAddress for parity with pict-view?
	 */render(pViewIdentifier,pRenderableHash,pRenderDestinationAddress,pTemplateDataAddress){let tmpViewIdentifier=typeof pViewIdentifier!=='string'?this.options.MainViewportViewIdentifier:pViewIdentifier;let tmpRenderableHash=typeof pRenderableHash!=='string'?this.options.MainViewportRenderableHash:pRenderableHash;let tmpRenderDestinationAddress=typeof pRenderDestinationAddress!=='string'?this.options.MainViewportDestinationAddress:pRenderDestinationAddress;let tmpTemplateDataAddress=typeof pTemplateDataAddress!=='string'?this.options.MainViewportDefaultDataAddress:pTemplateDataAddress;if(this.pict.LogControlFlow){this.log.trace("PICT-ControlFlow APPLICATION [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," VIEW Renderable[").concat(tmpRenderableHash,"] Destination[").concat(tmpRenderDestinationAddress,"] TemplateDataAddress[").concat(tmpTemplateDataAddress,"] render:"));}this.onBeforeRender();// Now get the view (by hash) from the loaded views
let tmpView=typeof tmpViewIdentifier==='string'?this.servicesMap.PictView[tmpViewIdentifier]:false;if(!tmpView){this.log.error("PictApp [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," could not render from View ").concat(tmpViewIdentifier," because it is not a valid view."));return false;}this.onRender();tmpView.render(tmpRenderableHash,tmpRenderDestinationAddress,tmpTemplateDataAddress);this.onAfterRender();return true;}/**
	 * @return {boolean}
	 */onRender(){if(this.pict.LogNoisiness>3){this.log.trace("PictApp [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," onRender:"));}return true;}/**
	 * @param {(error?: Error) => void} fCallback
	 */onRenderAsync(fCallback){this.onRender();return fCallback();}/**
	 * @param {string|((error?: Error) => void)} pViewIdentifier - The hash of the view to render. By default, the main viewport view is rendered. (or the callback)
	 * @param {string|((error?: Error) => void)} [pRenderableHash] - The hash of the renderable to render. (or the callback)
	 * @param {string|((error?: Error) => void)} [pRenderDestinationAddress] - The address where the renderable will be rendered. (or the callback)
	 * @param {string|((error?: Error) => void)} [pTemplateDataAddress] - The address where the data for the template is stored. (or the callback)
	 * @param {(error?: Error) => void} [fCallback] - The callback, if all other parameters are provided.
	 *
	 * TODO: Should we support objects for pTemplateDataAddress for parity with pict-view?
	 */renderAsync(pViewIdentifier,pRenderableHash,pRenderDestinationAddress,pTemplateDataAddress,fCallback){let tmpViewIdentifier=typeof pViewIdentifier!=='string'?this.options.MainViewportViewIdentifier:pViewIdentifier;let tmpRenderableHash=typeof pRenderableHash!=='string'?this.options.MainViewportRenderableHash:pRenderableHash;let tmpRenderDestinationAddress=typeof pRenderDestinationAddress!=='string'?this.options.MainViewportDestinationAddress:pRenderDestinationAddress;let tmpTemplateDataAddress=typeof pTemplateDataAddress!=='string'?this.options.MainViewportDefaultDataAddress:pTemplateDataAddress;// Allow the callback to be passed in as the last parameter no matter what
let tmpCallback=typeof fCallback==='function'?fCallback:typeof pTemplateDataAddress==='function'?pTemplateDataAddress:typeof pRenderDestinationAddress==='function'?pRenderDestinationAddress:typeof pRenderableHash==='function'?pRenderableHash:typeof pViewIdentifier==='function'?pViewIdentifier:false;if(!tmpCallback){this.log.warn("PictApp [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," renderAsync was called without a valid callback.  A callback will be generated but this could lead to race conditions."));tmpCallback=pError=>{if(pError){this.log.error("PictApp [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," renderAsync Auto Callback Error: ").concat(pError),pError);}};}if(this.pict.LogControlFlow){this.log.trace("PICT-ControlFlow APPLICATION [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," VIEW Renderable[").concat(tmpRenderableHash,"] Destination[").concat(tmpRenderDestinationAddress,"] TemplateDataAddress[").concat(tmpTemplateDataAddress,"] renderAsync:"));}let tmpRenderAnticipate=this.fable.newAnticipate();tmpRenderAnticipate.anticipate(this.onBeforeRenderAsync.bind(this));let tmpView=typeof tmpViewIdentifier==='string'?this.servicesMap.PictView[tmpViewIdentifier]:false;if(!tmpView){let tmpErrorMessage="PictApp [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," could not asynchronously render from View ").concat(tmpViewIdentifier," because it is not a valid view.");if(this.pict.LogNoisiness>3){this.log.error(tmpErrorMessage);}return tmpCallback(new Error(tmpErrorMessage));}tmpRenderAnticipate.anticipate(this.onRenderAsync.bind(this));tmpRenderAnticipate.anticipate(fNext=>{tmpView.renderAsync.call(tmpView,tmpRenderableHash,tmpRenderDestinationAddress,tmpTemplateDataAddress,fNext);});tmpRenderAnticipate.anticipate(this.onAfterRenderAsync.bind(this));return tmpRenderAnticipate.wait(tmpCallback);}/**
	 * @return {boolean}
	 */onAfterRender(){if(this.pict.LogNoisiness>3){this.log.trace("PictApp [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," onAfterRender:"));}return true;}/**
	 * @param {(error?: Error) => void} fCallback
	 */onAfterRenderAsync(fCallback){this.onAfterRender();return fCallback();}/**
	 * @return {boolean}
	 */renderMainViewport(){if(this.pict.LogControlFlow){this.log.trace("PICT-ControlFlow APPLICATION [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," renderMainViewport:"));}return this.render();}/**
	 * @param {(error?: Error) => void} fCallback
	 */renderMainViewportAsync(fCallback){if(this.pict.LogControlFlow){this.log.trace("PICT-ControlFlow APPLICATION [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," renderMainViewportAsync:"));}return this.renderAsync(fCallback);}/**
	 * @return {void}
	 */renderAutoViews(){if(this.pict.LogNoisiness>0){this.log.trace("PictApp [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," beginning renderAutoViews..."));}// Now walk through any loaded views and sort them by the AutoRender ordinal
let tmpLoadedViews=Object.keys(this.pict.views);// Sort the views by their priority
// If they are all the default priority 0, it will end up being add order due to JSON Object Property Key order stuff
tmpLoadedViews.sort((a,b)=>{return this.pict.views[a].options.AutoRenderOrdinal-this.pict.views[b].options.AutoRenderOrdinal;});for(let i=0;i<tmpLoadedViews.length;i++){let tmpView=this.pict.views[tmpLoadedViews[i]];if(tmpView.options.AutoRender){tmpView.render();}}if(this.pict.LogNoisiness>0){this.log.trace("PictApp [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," renderAutoViewsAsync complete."));}}/**
	 * @param {(error?: Error) => void} fCallback
	 */renderAutoViewsAsync(fCallback){let tmpAnticipate=this.fable.instantiateServiceProviderWithoutRegistration('Anticipate');// Allow the callback to be passed in as the last parameter no matter what
let tmpCallback=typeof fCallback==='function'?fCallback:false;if(!tmpCallback){this.log.warn("PictApp [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," renderAutoViewsAsync was called without a valid callback.  A callback will be generated but this could lead to race conditions."));tmpCallback=pError=>{if(pError){this.log.error("PictApp [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," renderAutoViewsAsync Auto Callback Error: ").concat(pError),pError);}};}if(this.pict.LogNoisiness>0){this.log.trace("PictApp [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," beginning renderAutoViewsAsync..."));}// Now walk through any loaded views and sort them by the AutoRender ordinal
// TODO: Some optimization cleverness could be gained by grouping them into a parallelized async operation, by ordinal.
let tmpLoadedViews=Object.keys(this.pict.views);// Sort the views by their priority
// If they are all the default priority 0, it will end up being add order due to JSON Object Property Key order stuff
tmpLoadedViews.sort((a,b)=>{return this.pict.views[a].options.AutoRenderOrdinal-this.pict.views[b].options.AutoRenderOrdinal;});for(let i=0;i<tmpLoadedViews.length;i++){let tmpView=this.pict.views[tmpLoadedViews[i]];if(tmpView.options.AutoRender){tmpAnticipate.anticipate(tmpView.renderAsync.bind(tmpView));}}tmpAnticipate.wait(pError=>{this.lastAutoRenderTimestamp=this.fable.log.getTimeStamp();if(this.pict.LogNoisiness>0){this.log.trace("PictApp [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," renderAutoViewsAsync complete."));}return tmpCallback(pError);});}/**
	 * @return {boolean}
	 */get isPictApplication(){return true;}}module.exports=PictApplication;},{"../package.json":11,"fable-serviceproviderbase":9}],13:[function(require,module,exports){module.exports={"name":"pict-provider","version":"1.0.13","description":"Pict Provider Base Class","main":"source/Pict-Provider.js","scripts":{"start":"node source/Pict-Provider.js","test":"npx quack test","tests":"npx quack test -g","coverage":"npx quack coverage","build":"npx quack build","docker-dev-build":"docker build ./ -f Dockerfile_LUXURYCode -t pict-provider-image:local","docker-dev-run":"docker run -it -d --name pict-provider-dev -p 24125:8080 -p 30027:8086 -v \"$PWD/.config:/home/coder/.config\"  -v \"$PWD:/home/coder/pict-provider\" -u \"$(id -u):$(id -g)\" -e \"DOCKER_USER=$USER\" pict-provider-image:local","docker-dev-shell":"docker exec -it pict-provider-dev /bin/bash","lint":"eslint source/**","types":"tsc -p ."},"types":"types/source/Pict-Provider.d.ts","repository":{"type":"git","url":"git+https://github.com/fable-retold/pict-provider.git"},"author":"steven velozo <steven@velozo.com>","license":"MIT","bugs":{"url":"https://github.com/fable-retold/pict-provider/issues"},"homepage":"https://github.com/fable-retold/pict-provider#readme","devDependencies":{"@eslint/js":"^9.39.1","eslint":"^9.39.1","pict":"^1.0.351","pict-docuserve":"^0.1.5","quackage":"^1.1.0","typescript":"^5.9.3"},"dependencies":{"fable-serviceproviderbase":"^3.0.19"},"mocha":{"diff":true,"extension":["js"],"package":"./package.json","reporter":"spec","slow":"75","timeout":"5000","ui":"tdd","watch-files":["source/**/*.js","test/**/*.js"],"watch-ignore":["lib/vendor"]}};},{}],14:[function(require,module,exports){const libFableServiceBase=require('fable-serviceproviderbase');const libPackage=require('../package.json');const defaultPictProviderSettings={ProviderIdentifier:false,// If this is set to true, when the App initializes this will.
// After the App initializes, initialize will be called as soon as it's added.
AutoInitialize:true,AutoInitializeOrdinal:0,AutoLoadDataWithApp:true,AutoLoadDataOrdinal:0,AutoSolveWithApp:true,AutoSolveOrdinal:0,Manifests:{},Templates:[]};class PictProvider extends libFableServiceBase{/**
	 * @param {import('fable')} pFable - The Fable instance.
	 * @param {Record<string, any>} [pOptions] - The options for the provider.
	 * @param {string} [pServiceHash] - The service hash for the provider.
	 */constructor(pFable,pOptions,pServiceHash){// Intersect default options, parent constructor, service information
let tmpOptions=Object.assign({},JSON.parse(JSON.stringify(defaultPictProviderSettings)),pOptions);super(pFable,tmpOptions,pServiceHash);/** @type {import('fable') & import('pict') & { instantiateServiceProviderWithoutRegistration(pServiceType: string, pOptions?: Record<string, any>, pCustomServiceHash?: string): any }} */this.fable;/** @type {import('fable') & import('pict') & { instantiateServiceProviderWithoutRegistration(pServiceType: string, pOptions?: Record<string, any>, pCustomServiceHash?: string): any }} */this.pict;/** @type {any} */this.log;/** @type {Record<string, any>} */this.options;/** @type {string} */this.UUID;/** @type {string} */this.Hash;if(!this.options.ProviderIdentifier){this.options.ProviderIdentifier="AutoProviderID-".concat(this.fable.getUUID());}this.serviceType='PictProvider';/** @type {Record<string, any>} */this._Package=libPackage;// Convenience and consistency naming
this.pict=this.fable;// Wire in the essential Pict application state
/** @type {Record<string, any>} */this.AppData=this.pict.AppData;/** @type {Record<string, any>} */this.Bundle=this.pict.Bundle;this.initializeTimestamp=false;this.lastSolvedTimestamp=false;for(let i=0;i<this.options.Templates.length;i++){let tmpDefaultTemplate=this.options.Templates[i];if(!tmpDefaultTemplate.hasOwnProperty('Postfix')||!tmpDefaultTemplate.hasOwnProperty('Template')){this.log.error("PictProvider [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.ProviderIdentifier," could not load Default Template ").concat(i," in the options array."),tmpDefaultTemplate);}else{if(!tmpDefaultTemplate.Source){tmpDefaultTemplate.Source="PictProvider [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.ProviderIdentifier," options object.");}this.pict.TemplateProvider.addDefaultTemplate(tmpDefaultTemplate.Prefix,tmpDefaultTemplate.Postfix,tmpDefaultTemplate.Template,tmpDefaultTemplate.Source);}}}/* -------------------------------------------------------------------------- *//*                        Code Section: Initialization                        *//* -------------------------------------------------------------------------- */onBeforeInitialize(){if(this.pict.LogNoisiness>3){this.log.trace("PictProvider [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.ProviderIdentifier," onBeforeInitialize:"));}return true;}/**
	 * @param {(pError?: Error) => void} fCallback - The callback to call after pre-pinitialization.
	 *
	 * @return {void}
	 */onBeforeInitializeAsync(fCallback){this.onBeforeInitialize();return fCallback();}onInitialize(){if(this.pict.LogNoisiness>3){this.log.trace("PictProvider [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.ProviderIdentifier," onInitialize:"));}return true;}/**
	 * @param {(pError?: Error) => void} fCallback - The callback to call after initialization.
	 *
	 * @return {void}
	 */onInitializeAsync(fCallback){this.onInitialize();return fCallback();}initialize(){if(this.pict.LogControlFlow){this.log.trace("PICT-ControlFlow PROVIDER [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.ProviderIdentifier," initialize:"));}if(!this.initializeTimestamp){this.onBeforeInitialize();this.onInitialize();this.onAfterInitialize();this.initializeTimestamp=this.pict.log.getTimeStamp();return true;}else{this.log.warn("PictProvider [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.ProviderIdentifier," initialize called but initialization is already completed.  Aborting."));return false;}}/**
	 * @param {(pError?: Error) => void} fCallback - The callback to call after initialization.
	 *
	 * @return {void}
	 */initializeAsync(fCallback){if(this.pict.LogControlFlow){this.log.trace("PICT-ControlFlow PROVIDER [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.ProviderIdentifier," initializeAsync:"));}if(!this.initializeTimestamp){let tmpAnticipate=this.pict.instantiateServiceProviderWithoutRegistration('Anticipate');if(this.pict.LogNoisiness>0){this.log.info("PictProvider [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.ProviderIdentifier," beginning initialization..."));}tmpAnticipate.anticipate(this.onBeforeInitializeAsync.bind(this));tmpAnticipate.anticipate(this.onInitializeAsync.bind(this));tmpAnticipate.anticipate(this.onAfterInitializeAsync.bind(this));tmpAnticipate.wait(pError=>{this.initializeTimestamp=this.pict.log.getTimeStamp();if(pError){this.log.error("PictProvider [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.ProviderIdentifier," initialization failed: ").concat(pError.message||pError),{Stack:pError.stack});}else if(this.pict.LogNoisiness>0){this.log.info("PictProvider [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.ProviderIdentifier," initialization complete."));}return fCallback();});}else{this.log.warn("PictProvider [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.ProviderIdentifier," async initialize called but initialization is already completed.  Aborting."));// TODO: Should this be an error?
return fCallback();}}onAfterInitialize(){if(this.pict.LogNoisiness>3){this.log.trace("PictProvider [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.ProviderIdentifier," onAfterInitialize:"));}return true;}/**
	 * @param {(pError?: Error) => void} fCallback - The callback to call after initialization.
	 *
	 * @return {void}
	 */onAfterInitializeAsync(fCallback){this.onAfterInitialize();return fCallback();}onPreRender(){if(this.pict.LogNoisiness>3){this.log.trace("PictProvider [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.ProviderIdentifier," onPreRender:"));}return true;}/**
	 * @param {(pError?: Error) => void} fCallback - The callback to call after pre-render.
	 *
	 * @return {void}
	 */onPreRenderAsync(fCallback){this.onPreRender();return fCallback();}render(){return this.onPreRender();}/**
	 * @param {(pError?: Error) => void} fCallback - The callback to call after render.
	 *
	 * @return {void}
	 */renderAsync(fCallback){this.onPreRender();return fCallback();}onPreSolve(){if(this.pict.LogNoisiness>3){this.log.trace("PictProvider [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.ProviderIdentifier," onPreSolve:"));}return true;}/**
	 * @param {(pError?: Error) => void} fCallback - The callback to call after pre-solve.
	 *
	 * @return {void}
	 */onPreSolveAsync(fCallback){this.onPreSolve();return fCallback();}solve(){return this.onPreSolve();}/**
	 * @param {(pError?: Error) => void} fCallback - The callback to call after solve.
	 *
	 * @return {void}
	 */solveAsync(fCallback){this.onPreSolve();return fCallback();}/**
	 * @param {(pError?: Error) => void} fCallback - The callback to call after the data pre-load.
	 */onBeforeLoadDataAsync(fCallback){return fCallback();}/**
	 * Hook to allow the provider to load data during application data load.
	 *
	 * @param {(pError?: Error) => void} fCallback - The callback to call after the data load.
	 */onLoadDataAsync(fCallback){if(this.pict.LogNoisiness>3){this.log.trace("PictProvider [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.ProviderIdentifier," onLoadDataAsync:"));}return fCallback();}/**
	 * @param {(pError?: Error) => void} fCallback - The callback to call after the data post-load.
	 */onAfterLoadDataAsync(fCallback){return fCallback();}/**
	 * @param {(pError?: Error) => void} fCallback - The callback to call after the data pre-load.
	 *
	 * @return {void}
	 */onBeforeSaveDataAsync(fCallback){return fCallback();}/**
	 * Hook to allow the provider to load data during application data load.
	 *
	 * @param {(pError?: Error) => void} fCallback - The callback to call after the data load.
	 *
	 * @return {void}
	 */onSaveDataAsync(fCallback){if(this.pict.LogNoisiness>3){this.log.trace("PictProvider [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.ProviderIdentifier," onSaveDataAsync:"));}return fCallback();}/**
	 * @param {(pError?: Error) => void} fCallback - The callback to call after the data post-load.
	 *
	 * @return {void}
	 */onAfterSaveDataAsync(fCallback){return fCallback();}}module.exports=PictProvider;},{"../package.json":13,"fable-serviceproviderbase":9}],15:[function(require,module,exports){/**
 * Simple syntax highlighter for use with CodeJar.
 *
 * Provides basic keyword/string/number/comment highlighting for common languages.
 * Can be replaced with Prism.js or highlight.js for more sophisticated highlighting
 * by passing a custom highlight function to the view options.
 *
 * @module Pict-Code-Highlighter
 */// Language definition map
const _LanguageDefinitions={'javascript':{// Combined regex to tokenize: comments, strings, template literals, regex, then everything else
tokenizer:/(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|(["'])(?:(?!\2|\\).|\\.)*?\2|(`(?:[^`\\]|\\.)*?`)|(\/(?![/*])(?:\\.|\[(?:\\.|[^\]])*\]|[^/\\\n])+\/[gimsuvy]*)/g,keywords:/\b(async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|export|extends|finally|for|from|function|get|if|import|in|instanceof|let|new|of|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)\b/g,builtins:/\b(true|false|null|undefined|NaN|Infinity|console|window|document|Math|JSON|Array|Object|String|Number|Boolean|Date|RegExp|Map|Set|Promise|Error|Symbol|parseInt|parseFloat|require|module|exports)\b/g,numbers:/\b(\d+\.?\d*(?:e[+-]?\d+)?|0x[0-9a-fA-F]+|0b[01]+|0o[0-7]+)\b/g},'json':{tokenizer:/(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:[^"\\]|\\.)*")/g,keywords:/\b(true|false|null)\b/g,numbers:/-?\b\d+\.?\d*(?:e[+-]?\d+)?\b/g},'html':{// Tokenizer captures: (1) comments, (2) strings, (3) tags with attributes
tokenizer:/(<!--[\s\S]*?-->)|(["'])(?:(?!\2|\\).|\\.)*?\2|(<\/?[a-zA-Z][a-zA-Z0-9-]*(?:\s+[a-zA-Z-]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*))?)*\s*\/?>)/g,// tagToken group index for identifying tag matches
tagGroupIndex:3},'css':{tokenizer:/(\/\*[\s\S]*?\*\/)|(["'])(?:(?!\2|\\).|\\.)*?\2/g,selectors:/([.#]?[a-zA-Z_][\w-]*(?:\s*[>+~]\s*[.#]?[a-zA-Z_][\w-]*)*)\s*\{/g,properties:/\b([a-zA-Z-]+)\s*:/g,numbers:/\b(\d+\.?\d*)(px|em|rem|%|vh|vw|s|ms|deg|fr)?\b/g,keywords:/\b(important|inherit|initial|unset|none|auto|block|inline|flex|grid)\b/g},'sql':{tokenizer:/(--[^\n]*|\/\*[\s\S]*?\*\/)|(["'])(?:(?!\2|\\).|\\.)*?\2/g,keywords:/\b(SELECT|FROM|WHERE|AND|OR|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|DROP|ALTER|ADD|COLUMN|INDEX|JOIN|LEFT|RIGHT|INNER|OUTER|ON|AS|ORDER|BY|GROUP|HAVING|LIMIT|OFFSET|UNION|ALL|DISTINCT|COUNT|SUM|AVG|MIN|MAX|NOT|NULL|IS|IN|BETWEEN|LIKE|EXISTS|CASE|WHEN|THEN|ELSE|END|PRIMARY|KEY|FOREIGN|REFERENCES|CONSTRAINT|DEFAULT|CHECK|UNIQUE|CASCADE|GRANT|REVOKE|COMMIT|ROLLBACK|BEGIN|TRANSACTION|INT|VARCHAR|DATETIME|AUTO_INCREMENT|CURRENT_TIMESTAMP)\b/gi,numbers:/\b\d+\.?\d*\b/g}};// Alias some common language names
_LanguageDefinitions['js']=_LanguageDefinitions['javascript'];_LanguageDefinitions['htm']=_LanguageDefinitions['html'];/**
 * Escape HTML special characters to prevent XSS when inserting into innerHTML.
 *
 * @param {string} pString - The string to escape
 * @returns {string} The escaped string
 */function escapeHTML(pString){return pString.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}/**
 * Highlight a segment of code that is NOT inside a string or comment.
 * This applies keyword, number, and structural highlighting.
 *
 * @param {string} pCode - The code segment to highlight (already HTML-escaped)
 * @param {object} pLanguageDef - The language definition
 * @returns {string} The highlighted HTML
 */function highlightCodeSegment(pCode,pLanguageDef){let tmpResult=pCode;// CSS selectors
if(pLanguageDef.selectors){pLanguageDef.selectors.lastIndex=0;tmpResult=tmpResult.replace(pLanguageDef.selectors,'<span class="function-name">$1</span>{');}// CSS properties
if(pLanguageDef.properties){pLanguageDef.properties.lastIndex=0;tmpResult=tmpResult.replace(pLanguageDef.properties,'<span class="property">$1</span>:');}// Keywords
if(pLanguageDef.keywords){pLanguageDef.keywords.lastIndex=0;tmpResult=tmpResult.replace(pLanguageDef.keywords,'<span class="keyword">$1</span>');}// Builtins
if(pLanguageDef.builtins){pLanguageDef.builtins.lastIndex=0;tmpResult=tmpResult.replace(pLanguageDef.builtins,'<span class="keyword">$1</span>');}// Numbers (CSS numbers may have units as a capture group, others do not)
if(pLanguageDef.numbers){pLanguageDef.numbers.lastIndex=0;tmpResult=tmpResult.replace(pLanguageDef.numbers,pMatch=>{return"<span class=\"number\">".concat(pMatch,"</span>");});}return tmpResult;}/**
 * Highlight an HTML tag token, applying tag name, attribute name, and attribute value colors.
 *
 * The approach: parse the raw tag into structured pieces first, then build the
 * highlighted output from those pieces. This avoids mixing raw text with HTML span
 * tags, which would cause regex replacements to match span attributes on subsequent passes.
 *
 * @param {string} pTag - The raw (unescaped) tag string
 * @returns {string} The highlighted HTML
 */function highlightHTMLTag(pTag){let tmpResult='';let tmpRest=pTag;// 1. Extract the opening bracket and tag name: < or </  followed by tagname
let tmpTagNameMatch=tmpRest.match(/^(<\/?)([a-zA-Z][a-zA-Z0-9-]*)/);if(!tmpTagNameMatch){// Not a recognizable tag, just escape the whole thing
return escapeHTML(pTag);}tmpResult+=escapeHTML(tmpTagNameMatch[1]);tmpResult+='<span class="tag">'+escapeHTML(tmpTagNameMatch[2])+'</span>';tmpRest=tmpRest.substring(tmpTagNameMatch[0].length);// 2. Parse attributes from the remaining text (before the closing > or />)
// Repeatedly match: whitespace + attr-name + optional =value
let tmpAttrRegex=/^(\s+)([a-zA-Z-]+)(?:(\s*=\s*)(["'])([^"']*?)\4)?/;let tmpAttrMatch;while((tmpAttrMatch=tmpRest.match(tmpAttrRegex))!==null){// Whitespace before the attribute
tmpResult+=tmpAttrMatch[1];// Attribute name
tmpResult+='<span class="attr-name">'+escapeHTML(tmpAttrMatch[2])+'</span>';// If there's an = value part
if(tmpAttrMatch[3]){tmpResult+=escapeHTML(tmpAttrMatch[3]);tmpResult+='<span class="attr-value">'+escapeHTML(tmpAttrMatch[4])+escapeHTML(tmpAttrMatch[5])+escapeHTML(tmpAttrMatch[4])+'</span>';}tmpRest=tmpRest.substring(tmpAttrMatch[0].length);}// 3. Whatever remains (whitespace, />, >) — escape it all
tmpResult+=escapeHTML(tmpRest);return tmpResult;}/**
 * Create a highlight function for a given language.
 *
 * The approach: use a single tokenizer regex to split the code into protected tokens
 * (comments, strings) and code segments. Process each segment independently.
 * This avoids placeholder/sentinel issues entirely.
 *
 * @param {string} pLanguage - The language identifier (e.g. "javascript", "json", "html")
 * @returns {function} A function that takes an element and highlights its textContent
 */function createHighlighter(pLanguage){return function highlightElement(pElement){let tmpCode=pElement.textContent;let tmpLanguageName=typeof pLanguage==='string'?pLanguage.toLowerCase():'javascript';let tmpLanguageDef=_LanguageDefinitions[tmpLanguageName];if(!tmpLanguageDef){// No highlighting rules for this language; just escape and return
pElement.innerHTML=escapeHTML(tmpCode);return;}if(!tmpLanguageDef.tokenizer){// No tokenizer; just escape and apply keyword highlighting
pElement.innerHTML=highlightCodeSegment(escapeHTML(tmpCode),tmpLanguageDef);return;}// Split the code into tokens using the tokenizer regex.
// The tokenizer captures comments and strings as groups.
// We process everything between matches as code.
let tmpResult='';let tmpLastIndex=0;let tmpTagGroupIndex=tmpLanguageDef.tagGroupIndex||0;tmpLanguageDef.tokenizer.lastIndex=0;let tmpMatch;while((tmpMatch=tmpLanguageDef.tokenizer.exec(tmpCode))!==null){// Add the code segment before this match
if(tmpMatch.index>tmpLastIndex){let tmpSegment=tmpCode.substring(tmpLastIndex,tmpMatch.index);tmpResult+=highlightCodeSegment(escapeHTML(tmpSegment),tmpLanguageDef);}let tmpFullMatch=tmpMatch[0];// Determine token type from capture groups
// Group 1 is always comments, Group 2+ are strings/template literals/regex
if(tmpMatch[1]){// Comment
tmpResult+="<span class=\"comment\">".concat(escapeHTML(tmpFullMatch),"</span>");}else if(tmpTagGroupIndex>0&&tmpMatch[tmpTagGroupIndex]){// HTML tag — highlight tag name, attributes, and values
tmpResult+=highlightHTMLTag(tmpFullMatch);}else{// String, template literal, or regex
tmpResult+="<span class=\"string\">".concat(escapeHTML(tmpFullMatch),"</span>");}tmpLastIndex=tmpLanguageDef.tokenizer.lastIndex;}// Add any remaining code after the last match
if(tmpLastIndex<tmpCode.length){let tmpSegment=tmpCode.substring(tmpLastIndex);tmpResult+=highlightCodeSegment(escapeHTML(tmpSegment),tmpLanguageDef);}pElement.innerHTML=tmpResult;};}module.exports=createHighlighter;module.exports.LanguageDefinitions=_LanguageDefinitions;},{}],16:[function(require,module,exports){module.exports={"RenderOnLoad":true,"DefaultRenderable":"CodeEditor-Wrap","DefaultDestinationAddress":"#CodeEditor-Container-Div","Templates":[{"Hash":"CodeEditor-Container","Template":"<!-- CodeEditor-Container Rendering Soon -->"}],"Renderables":[{"RenderableHash":"CodeEditor-Wrap","TemplateHash":"CodeEditor-Container","DestinationAddress":"#CodeEditor-Container-Div"}],"TargetElementAddress":"#CodeEditor-Container-Div",// Address in AppData or other Pict address space to read/write code content
"CodeDataAddress":false,// The language for syntax highlighting (e.g. "javascript", "html", "css", "json")
"Language":"javascript",// Whether the editor is read-only
"ReadOnly":false,// Tab character: use tab or spaces
"Tab":"\t",// Whether to indent with the same whitespace as the previous line
"IndentOn":/[({[]$/,// Whether to add a closing bracket/paren/brace
"MoveToNewLine":/^[)}\]]/,// Whether to handle the closing character
"AddClosing":true,// Whether to preserve indentation on new lines
"CatchTab":true,// Whether to show line numbers
"LineNumbers":true,// Default code content if no address is provided
"DefaultCode":"// Enter your code here\n",// CSS for the code editor.
//
// Every color/font is wired through pict-provider-theme tokens so apps
// using pict-provider-theme get themed code editor automatically.  Each
// var() carries its original ATOM-One-Light hex as the fallback so apps
// without pict-provider-theme installed look exactly as before.
"CSS":".pict-code-editor-wrap\n{\n\tdisplay: flex;\n\tfont-family: var(--theme-typography-family-mono, 'SFMono-Regular', 'SF Mono', 'Menlo', 'Consolas', 'Liberation Mono', 'Courier New', monospace);\n\tfont-size: 14px;\n\tline-height: 1.5;\n\tborder: 1px solid var(--theme-color-border-default, #D0D0D0);\n\tborder-radius: 4px;\n\toverflow: hidden;\n}\n.pict-code-editor-wrap .pict-code-line-numbers\n{\n\twidth: 40px;\n\tmin-width: 40px;\n\t/* padding-top/bottom are stamped at runtime from the editor's\n\t   computed padding so row 1 of the gutter aligns with row 1 of\n\t   the code; only horizontal padding is stylesheet-owned. */\n\tpadding: 0;\n\ttext-align: right;\n\tbackground: var(--theme-color-editor-linenumber-background, var(--theme-color-background-secondary, #F5F5F5));\n\tborder-right: 1px solid var(--theme-color-editor-gutter-border, var(--theme-color-border-default, #D0D0D0));\n\tcolor: var(--theme-color-editor-linenumber-text, var(--theme-color-text-muted, #999));\n\tfont-size: 13px;\n\t/* line-height, padding-top, padding-bottom, and font-family are\n\t   intentionally NOT declared here.  PictSectionCode._syncGutterMetrics()\n\t   copies them from the editor's computed styles at init and on every\n\t   editor resize, so the gutter is guaranteed to track the editor.\n\t   Declaring them in CSS would either be redundant (when matching) or\n\t   actively wrong (when the editor's metrics diverge \u2014 e.g. theme scale\n\t   changes the editor's font-size).  See codejar-linenumbers for the\n\t   canonical version of this pattern. */\n\tuser-select: none;\n\tpointer-events: none;\n\tbox-sizing: border-box;\n}\n.pict-code-editor-wrap .pict-code-line-numbers span\n{\n\tdisplay: block;\n\tpadding: 0 8px 0 0;\n}\n.pict-code-editor-wrap .pict-code-editor\n{\n\tmargin: 0;\n\tpadding: 10px 10px 10px 8px;\n\tmin-height: 100px;\n\tflex: 1;\n\tmin-width: 0;\n\toutline: none;\n\ttab-size: 4;\n\twhite-space: pre;\n\toverflow-wrap: normal;\n\tcolor: var(--theme-color-text-primary, #383A42);\n\tbackground: var(--theme-color-background-panel, #FAFAFA);\n\tcaret-color: var(--theme-color-brand-primary, #526FFF);\n\tborder-radius: 0 4px 4px 0;\n}\n.pict-code-editor-wrap .pict-code-editor.pict-code-no-line-numbers\n{\n\tpadding-left: 10px;\n\tborder-radius: 4px;\n}\n.pict-code-editor-wrap .pict-code-editor::selection,\n.pict-code-editor-wrap .pict-code-editor *::selection\n{\n\tbackground: var(--theme-color-editor-selection-background, var(--theme-color-selection-background, #B3D4FC));\n}\n/* Syntax token colors \u2014 each class binds to a Color.Syntax.* token from\n   pict-provider-theme. Fallback hexes match the One Light palette so apps\n   that don't install the theme provider look the same as before. */\n.pict-code-editor-wrap .pict-code-editor .keyword       { color: var(--theme-color-syntax-keyword,     #A626A4); }\n.pict-code-editor-wrap .pict-code-editor .string        { color: var(--theme-color-syntax-string,      #50A14F); }\n.pict-code-editor-wrap .pict-code-editor .number        { color: var(--theme-color-syntax-number,      #986801); }\n.pict-code-editor-wrap .pict-code-editor .comment       { color: var(--theme-color-syntax-comment,     #A0A1A7); font-style: italic; }\n.pict-code-editor-wrap .pict-code-editor .operator      { color: var(--theme-color-syntax-operator,    #0184BC); }\n.pict-code-editor-wrap .pict-code-editor .punctuation   { color: var(--theme-color-syntax-punctuation, #383A42); }\n.pict-code-editor-wrap .pict-code-editor .function-name { color: var(--theme-color-syntax-function,    #4078F2); }\n.pict-code-editor-wrap .pict-code-editor .property      { color: var(--theme-color-syntax-property,    #E45649); }\n.pict-code-editor-wrap .pict-code-editor .tag           { color: var(--theme-color-syntax-tag,         #E45649); }\n.pict-code-editor-wrap .pict-code-editor .attr-name     { color: var(--theme-color-syntax-attrname,    #986801); }\n.pict-code-editor-wrap .pict-code-editor .attr-value    { color: var(--theme-color-syntax-attrvalue,   #50A14F); }\n.pict-code-editor-wrap .pict-code-editor .builtin       { color: var(--theme-color-syntax-builtin,     #986801); }\n.pict-code-editor-wrap .pict-code-editor .type          { color: var(--theme-color-syntax-type,        #C18401); }\n.pict-code-editor-wrap .pict-code-editor .variable      { color: var(--theme-color-syntax-variable,    #383A42); }\n\n/* highlight.js class aliases \u2014 when host apps render code blocks with\n   highlight.js (e.g. markdown previews via CodeJar's hljs integration),\n   the output uses .hljs / .hljs-* classes rather than the bare token\n   classes pict-section-code emits. Mapping them here lets one stylesheet\n   theme both editor surfaces (bare classes) and hljs-rendered surfaces\n   without the host needing a separate per-app github.css. Rules are\n   intentionally unscoped (no .pict-code-editor-wrap parent) so they\n   apply globally wherever hljs paints. */\n.hljs                  { color: var(--theme-color-text-primary,         #383A42); background: transparent; }\n.hljs-keyword,\n.hljs-keyword.hljs-typeof,\n.hljs-selector-tag,\n.hljs-literal          { color: var(--theme-color-syntax-keyword,       #A626A4); }\n.hljs-string,\n.hljs-regexp,\n.hljs-template-tag,\n.hljs-template-variable { color: var(--theme-color-syntax-string,       #50A14F); }\n.hljs-number,\n.hljs-meta             { color: var(--theme-color-syntax-number,        #986801); }\n.hljs-comment,\n.hljs-quote            { color: var(--theme-color-syntax-comment,       #A0A1A7); font-style: italic; }\n.hljs-operator,\n.hljs-link             { color: var(--theme-color-syntax-operator,      #0184BC); }\n.hljs-punctuation      { color: var(--theme-color-syntax-punctuation,   #383A42); }\n.hljs-function .hljs-title,\n.hljs-title.function_,\n.hljs-title.class_     { color: var(--theme-color-syntax-function,      #4078F2); }\n.hljs-variable,\n.hljs-variable.language_,\n.hljs-params           { color: var(--theme-color-syntax-variable,      #383A42); }\n.hljs-type,\n.hljs-class .hljs-title { color: var(--theme-color-syntax-type,         #C18401); }\n.hljs-built_in,\n.hljs-builtin-name     { color: var(--theme-color-syntax-builtin,       #986801); }\n.hljs-attr,\n.hljs-property         { color: var(--theme-color-syntax-property,      #E45649); }\n.hljs-tag,\n.hljs-name             { color: var(--theme-color-syntax-tag,           #E45649); }\n.hljs-attribute        { color: var(--theme-color-syntax-attrname,      #986801); }\n.hljs-symbol           { color: var(--theme-color-syntax-attrvalue,     #50A14F); }\n.hljs-emphasis         { font-style: italic; }\n.hljs-strong           { font-weight: bold; }\n.hljs-deletion         { color: var(--theme-color-status-error,         #B62828); background: rgba(220, 50, 47, 0.08); }\n.hljs-addition         { color: var(--theme-color-status-success,       #2E7A3A); background: rgba(80, 161, 79, 0.10); }\n"};},{}],17:[function(require,module,exports){const libPictViewClass=require('pict-view');const libCreateHighlighter=require('./Pict-Code-Highlighter.js');const _DefaultConfiguration=require('./Pict-Section-Code-DefaultConfiguration.js');class PictSectionCode extends libPictViewClass{constructor(pFable,pOptions,pServiceHash){let tmpOptions=Object.assign({},_DefaultConfiguration,pOptions);super(pFable,tmpOptions,pServiceHash);this.initialRenderComplete=false;// The CodeJar instance
this.codeJar=null;// The highlight function (can be overridden)
this._highlightFunction=null;// The current language
this._language=this.options.Language||'javascript';}onBeforeInitialize(){super.onBeforeInitialize();this._codeJarPrototype=null;this.targetElement=false;// Build the default highlight function for the configured language
this._highlightFunction=libCreateHighlighter(this._language);return super.onBeforeInitialize();}/**
	 * Connect the CodeJar prototype.  If not passed explicitly, try to find it
	 * as a global (window.CodeJar) or require it from the npm package.
	 *
	 * @param {function} [pCodeJarPrototype] - The CodeJar constructor function
	 * @returns {boolean|void}
	 */connectCodeJarPrototype(pCodeJarPrototype){if(typeof pCodeJarPrototype==='function'){this._codeJarPrototype=pCodeJarPrototype;return;}// Try to find CodeJar in global scope
if(typeof window!=='undefined'){if(typeof window.CodeJar==='function'){this.log.trace("PICT-Code Found CodeJar in window.CodeJar.");this._codeJarPrototype=window.CodeJar;return;}}this.log.error("PICT-Code No CodeJar prototype found. Include codejar via script tag or call connectCodeJarPrototype(CodeJar) explicitly.");return false;}onAfterRender(pRenderable){// Ensure the CSS from all registered views is injected into the DOM
this.pict.CSSMap.injectCSS();if(!this.initialRenderComplete){this.onAfterInitialRender();this.initialRenderComplete=true;}return super.onAfterRender(pRenderable);}onAfterInitialRender(){// Resolve the CodeJar prototype if not already set
if(!this._codeJarPrototype){this.connectCodeJarPrototype();}if(!this._codeJarPrototype){this.log.error("PICT-Code Cannot initialize editor; no CodeJar prototype available.");return false;}if(this.codeJar){this.log.error("PICT-Code editor is already initialized!");return false;}// Find the target element
let tmpTargetElementSet=this.services.ContentAssignment.getElement(this.options.TargetElementAddress);if(!tmpTargetElementSet||tmpTargetElementSet.length<1){this.log.error("PICT-Code Could not find target element [".concat(this.options.TargetElementAddress,"]!"));this.targetElement=false;return false;}this.targetElement=tmpTargetElementSet[0];// Build the editor DOM structure
this._buildEditorDOM();// Get initial code content
let tmpCode=this._resolveCodeContent();// Create the CodeJar options
let tmpCodeJarOptions={};if(this.options.Tab){tmpCodeJarOptions.tab=this.options.Tab;}if(this.options.IndentOn){tmpCodeJarOptions.indentOn=this.options.IndentOn;}if(this.options.MoveToNewLine){tmpCodeJarOptions.moveToNewLine=this.options.MoveToNewLine;}if(typeof this.options.AddClosing!=='undefined'){tmpCodeJarOptions.addClosing=this.options.AddClosing;}if(typeof this.options.CatchTab!=='undefined'){tmpCodeJarOptions.catchTab=this.options.CatchTab;}this.customConfigureEditorOptions(tmpCodeJarOptions);// Instantiate CodeJar on the editor element
let tmpEditorElement=this._editorElement;this.codeJar=this._codeJarPrototype(tmpEditorElement,this._highlightFunction,tmpCodeJarOptions);// CodeJar forces white-space:pre-wrap and overflow-wrap:break-word
// via inline styles, which causes line wrapping that breaks the
// line-number alignment.  Override back to non-wrapping so the
// wrap container scrolls horizontally instead.
this._resetEditorWrapStyles();// Set the initial code
if(tmpCode){this.codeJar.updateCode(tmpCode);}// Wire up the change handler
this.codeJar.onUpdate(pCode=>{this._updateLineNumbers();this.onCodeChange(pCode);});// Initial line number render
this._updateLineNumbers();// Sync line-numbers vertical position with the editor's scroll.
//
// The editor element scrolls internally (CodeJar uses
// contenteditable + overflow:auto for long content), but the
// line-numbers div is a sibling with overflow:visible — without
// this sync the line-numbers content stays glued at the top of
// the wrap while the editor scrolls underneath it, so "line 1"
// appears next to whatever line is actually showing.
//
// Using `transform: translateY(...)` instead of scrollTop keeps
// the sync compositor-only (no reflow per scroll event) and
// avoids needing to change the line-numbers element's overflow
// from visible.  Passive listener so we don't block scrolling.
if(this._lineNumbersElement){let tmpLineNumbersEl=this._lineNumbersElement;tmpEditorElement.addEventListener('scroll',function(){tmpLineNumbersEl.style.transform='translateY(-'+tmpEditorElement.scrollTop+'px)';},{passive:true});}// Sync gutter typographic metrics from the editor.  The gutter
// must use the editor's exact line-height (and matching padding)
// or rows drift apart cumulatively.  See _syncGutterMetrics().
this._syncGutterMetrics();// Watch the editor for size changes (window resize affecting
// flex layout, container resize) and re-sync the gutter so it
// continues to track the editor.  ResizeObserver fires once per
// frame at most, so the cost is negligible.
if(this._lineNumbersElement&&typeof ResizeObserver==='function'){let tmpSelf=this;this._editorResizeObserver=new ResizeObserver(function(){tmpSelf._syncGutterMetrics();});this._editorResizeObserver.observe(tmpEditorElement);}// Watch for direct style/class mutations on the editor.  Theme
// providers that toggle scale by swapping a class on the editor,
// or host code that adjusts editor typography via inline styles,
// don't necessarily change the editor's box size — so the
// ResizeObserver above wouldn't see them.  MutationObserver on
// the attributes catches these cases.
if(this._lineNumbersElement&&typeof MutationObserver==='function'){let tmpSelf=this;this._editorStyleObserver=new MutationObserver(function(){tmpSelf._syncGutterMetrics();});this._editorStyleObserver.observe(tmpEditorElement,{attributes:true,attributeFilter:['style','class']});}// Handle read-only
if(this.options.ReadOnly){tmpEditorElement.setAttribute('contenteditable','false');}}/**
	 * Build the editor DOM elements inside the target container.
	 */_buildEditorDOM(){// Clear the target
this.targetElement.innerHTML='';// Create wrapper
let tmpWrap=document.createElement('div');tmpWrap.className='pict-code-editor-wrap';// Create line numbers container
if(this.options.LineNumbers){let tmpLineNumbers=document.createElement('div');tmpLineNumbers.className='pict-code-line-numbers';tmpWrap.appendChild(tmpLineNumbers);this._lineNumbersElement=tmpLineNumbers;}// Create the editor element (CodeJar needs a pre or div)
let tmpEditor=document.createElement('div');tmpEditor.className='pict-code-editor language-'+this._language;if(!this.options.LineNumbers){tmpEditor.className+=' pict-code-no-line-numbers';}tmpWrap.appendChild(tmpEditor);this.targetElement.appendChild(tmpWrap);this._editorElement=tmpEditor;this._wrapElement=tmpWrap;}/**
	 * Update the line numbers display based on current code content.
	 */_updateLineNumbers(){if(!this.options.LineNumbers||!this._lineNumbersElement||!this._editorElement){return;}let tmpCode=this._editorElement.textContent||'';let tmpLineCount=tmpCode.split('\n').length;let tmpHTML='';for(let i=1;i<=tmpLineCount;i++){tmpHTML+="<span>".concat(i,"</span>");}this._lineNumbersElement.innerHTML=tmpHTML;// Defense-in-depth: every line-count rebuild is also a natural
// re-sync point.  Cheap (one getComputedStyle + a handful of
// style writes) and guarantees newly-added spans use the same
// metrics as the editor at the moment of the rebuild.
this._syncGutterMetrics();}/**
	 * Copy typographic metrics from the editor element to the line-numbers
	 * gutter so every gutter row lines up with its corresponding code row.
	 *
	 * The gutter is a sibling element with its own font/line-height
	 * declarations — if any one diverges from the editor (unitless
	 * line-height resolving against a different font-size, host CSS
	 * overriding font-family, theme scale changing the editor's metrics),
	 * the two desync and the drift accumulates with every line.
	 *
	 * The pattern is borrowed from the canonical `codejar-linenumbers`
	 * library (julianpoemp/codejar-linenumbers), which solves the same
	 * class of bug by reading the editor's computed styles at init and
	 * stamping them onto the gutter.  We extend that here by also
	 * re-stamping whenever the editor resizes (see the ResizeObserver in
	 * onAfterInitialRender), so theme scale changes self-heal too.
	 *
	 * Public callers can invoke {@link syncMetrics} to force a re-sync
	 * after any external change that affects editor typography.
	 */_syncGutterMetrics(){if(!this._lineNumbersElement||!this._editorElement){return;}if(typeof window==='undefined'||typeof window.getComputedStyle!=='function'){return;}let tmpEditorStyle=window.getComputedStyle(this._editorElement);let tmpLineHeight=tmpEditorStyle.lineHeight;// `normal` is the spec default — leave the gutter untouched so the
// stylesheet's declaration wins (we have no number to copy).
if(tmpLineHeight&&tmpLineHeight!=='normal'){this._lineNumbersElement.style.lineHeight=tmpLineHeight;}// Match the editor's vertical padding so row 1 of the gutter sits
// at the same y-offset as row 1 of the code.
if(tmpEditorStyle.paddingTop){this._lineNumbersElement.style.paddingTop=tmpEditorStyle.paddingTop;}if(tmpEditorStyle.paddingBottom){this._lineNumbersElement.style.paddingBottom=tmpEditorStyle.paddingBottom;}// Font-family must match so the visual baseline of the digits
// aligns with the code (different monospace fonts can have
// different x-heights even at identical line-heights).
if(tmpEditorStyle.fontFamily){this._lineNumbersElement.style.fontFamily=tmpEditorStyle.fontFamily;}// Dev-time sanity check.  If the gutter's resolved row height
// disagrees with the editor's, alignment will drift cumulatively.
// Warn loudly so the regression is caught at the next reload
// instead of silently accumulating pixels per line.
if(typeof console!=='undefined'&&console.warn){let tmpFirstSpan=this._lineNumbersElement.querySelector('span');if(tmpFirstSpan){let tmpGutterRow=tmpFirstSpan.getBoundingClientRect().height;let tmpEditorRow=parseFloat(tmpLineHeight);if(tmpGutterRow&&tmpEditorRow&&Math.abs(tmpGutterRow-tmpEditorRow)>0.5){console.warn('[pict-section-code] gutter/editor row-height mismatch: '+'gutter '+tmpGutterRow+'px vs editor '+tmpEditorRow+'px — '+'line numbers will drift. Check for CSS overriding '+'.pict-code-line-numbers line-height.');}}}}/**
	 * Public hook for hosts to force a gutter metrics re-sync after
	 * external typography changes (theme scale, font-size swap, etc.).
	 * The ResizeObserver attached at init handles most cases, but call
	 * this from an app's post-theme-change hook for belt-and-suspenders
	 * coverage.
	 */syncMetrics(){this._syncGutterMetrics();}/**
	 * Reset inline styles that CodeJar sets on the editor element.
	 *
	 * CodeJar forces white-space:pre-wrap and overflow-wrap:break-word so
	 * long lines wrap visually.  That breaks line-number alignment because
	 * each wrapped visual row is not a logical line.  Resetting to pre /
	 * normal makes the outer .pict-code-editor-wrap scroll horizontally.
	 */_resetEditorWrapStyles(){if(!this._editorElement){return;}this._editorElement.style.whiteSpace='pre';this._editorElement.style.overflowWrap='normal';}/**
	 * Resolve the initial code content from address or default.
	 *
	 * @returns {string} The code content
	 */_resolveCodeContent(){if(this.options.CodeDataAddress){const tmpAddressSpace={Fable:this.fable,Pict:this.fable,AppData:this.AppData,Bundle:this.Bundle,Options:this.options};let tmpAddressedData=this.fable.manifest.getValueByHash(tmpAddressSpace,this.options.CodeDataAddress);if(typeof tmpAddressedData==='string'){return tmpAddressedData;}else{this.log.warn("PICT-Code Address [".concat(this.options.CodeDataAddress,"] did not return a string; it was ").concat(typeof tmpAddressedData,"."));}}return this.options.DefaultCode||'';}/**
	 * Hook for subclasses to customize CodeJar options before instantiation.
	 *
	 * @param {object} pOptions - The CodeJar options object to modify
	 */customConfigureEditorOptions(pOptions){// Override in subclass to tweak options
}/**
	 * Called when the code content changes.  Override in subclasses to handle changes.
	 *
	 * @param {string} pCode - The new code content
	 */onCodeChange(pCode){// Write back to data address if configured
if(this.options.CodeDataAddress){const tmpAddressSpace={Fable:this.fable,Pict:this.fable,AppData:this.AppData,Bundle:this.Bundle,Options:this.options};this.fable.manifest.setValueByHash(tmpAddressSpace,this.options.CodeDataAddress,pCode);}}// -- Public API Methods --
/**
	 * Get the current code content.
	 *
	 * @returns {string} The current code
	 */getCode(){if(!this.codeJar){this.log.warn('PICT-Code getCode called before editor initialized.');return'';}return this.codeJar.toString();}/**
	 * Set the code content.
	 *
	 * @param {string} pCode - The code to set
	 */setCode(pCode){if(!this.codeJar){this.log.warn('PICT-Code setCode called before editor initialized.');return;}this.codeJar.updateCode(pCode);this._updateLineNumbers();}/**
	 * Change the editor language and re-highlight.
	 *
	 * @param {string} pLanguage - The language identifier
	 */setLanguage(pLanguage){this._language=pLanguage;this._highlightFunction=libCreateHighlighter(pLanguage);if(this._editorElement){// Update the class
this._editorElement.className='pict-code-editor language-'+pLanguage;if(!this.options.LineNumbers){this._editorElement.className+=' pict-code-no-line-numbers';}}if(this.codeJar){// Re-create the editor with the new highlight function
let tmpCode=this.codeJar.toString();this.codeJar.destroy();this.codeJar=this._codeJarPrototype(this._editorElement,this._highlightFunction,{tab:this.options.Tab,catchTab:this.options.CatchTab,addClosing:this.options.AddClosing});this._resetEditorWrapStyles();this.codeJar.updateCode(tmpCode);this.codeJar.onUpdate(pCode=>{this._updateLineNumbers();this.onCodeChange(pCode);});}}/**
	 * Set a custom highlight function to replace the built-in highlighter.
	 * Useful for integrating Prism.js, highlight.js, or any other library.
	 *
	 * @param {function} pHighlightFunction - A function that takes a DOM element and highlights its textContent
	 */setHighlightFunction(pHighlightFunction){if(typeof pHighlightFunction!=='function'){this.log.error('PICT-Code setHighlightFunction requires a function.');return;}this._highlightFunction=pHighlightFunction;if(this.codeJar){let tmpCode=this.codeJar.toString();this.codeJar.destroy();this.codeJar=this._codeJarPrototype(this._editorElement,this._highlightFunction,{tab:this.options.Tab,catchTab:this.options.CatchTab,addClosing:this.options.AddClosing});this._resetEditorWrapStyles();this.codeJar.updateCode(tmpCode);this.codeJar.onUpdate(pCode=>{this._updateLineNumbers();this.onCodeChange(pCode);});}}/**
	 * Set the read-only state of the editor.
	 *
	 * @param {boolean} pReadOnly - Whether the editor should be read-only
	 */setReadOnly(pReadOnly){this.options.ReadOnly=pReadOnly;if(this._editorElement){this._editorElement.setAttribute('contenteditable',pReadOnly?'false':'true');}}/**
	 * Destroy the editor and clean up.
	 */destroy(){if(this._editorResizeObserver){this._editorResizeObserver.disconnect();this._editorResizeObserver=null;}if(this._editorStyleObserver){this._editorStyleObserver.disconnect();this._editorStyleObserver=null;}if(this.codeJar){this.codeJar.destroy();this.codeJar=null;}}/**
	 * Marshal code content from the data address into the view.
	 */marshalToView(){super.marshalToView();if(this.codeJar&&this.options.CodeDataAddress){let tmpCode=this._resolveCodeContent();if(typeof tmpCode==='string'){this.codeJar.updateCode(tmpCode);this._updateLineNumbers();}}}/**
	 * Marshal the current code content back to the data address.
	 */marshalFromView(){super.marshalFromView();if(this.codeJar&&this.options.CodeDataAddress){this.onCodeChange(this.codeJar.toString());}}}module.exports=PictSectionCode;module.exports.default_configuration=_DefaultConfiguration;module.exports.createHighlighter=libCreateHighlighter;// Demo bundle for pict-docuserve.  Host apps that embed docuserve and
// want pict-section-code's demos visible in their docs site call
// `require('pict-section-code').registerWithDocuserve(pict)` once at
// app boot.  Silent no-op when Docuserve-Demos isn't installed.
//
// The require here is intentionally eager: browserify needs a static
// `require()` at module-toplevel to trace and bundle the demos source.
// The apparent circular dep (demos/index.js requires THIS module to
// reach the PictSectionCode class) is benign — by the time demos/
// index.js runs, `module.exports = PictSectionCode` has already
// executed, so it sees a usable class.  The `.demos` and
// `.registerWithDocuserve` attachments below run after the require
// returns, so demos/index.js never observes them being undefined.
const libCodeDemos=require('./demos');module.exports.demos=libCodeDemos.demos;module.exports.registerWithDocuserve=libCodeDemos.registerWithDocuserve;},{"./Pict-Code-Highlighter.js":15,"./Pict-Section-Code-DefaultConfiguration.js":16,"./demos":18,"pict-view":23}],18:[function(require,module,exports){/**
 * pict-section-code demos
 *
 * Each entry is consumed by pict-docuserve's `Docuserve-Demos` provider.
 * Hosts that want these demos to appear in their docs site call
 * `require('pict-section-code/source/demos').registerWithDocuserve(pict)`
 * once at app boot (typically inside their DocuserveApplication subclass
 * after `super(...)`).
 *
 * Each demo's Mount(pict, container, spec) signature creates a fresh
 * pict-section-code view instance inside the supplied container.  Spec
 * fields are passed through to the view config so a single demo template
 * can express "JavaScript with line numbers", "JSON read-only no
 * gutter", etc. without duplicating the wiring.
 */const libPictSectionCode=require('../Pict-Section-Code.js');/**
 * Internal helper: mount a pict-section-code instance into a host
 * container according to the demo spec.  Each call registers a uniquely
 * identified view so multiple demos on the same page coexist cleanly.
 */function mountCodeEditor(pPict,pContainer,pSpec){// Tag this mount with an id we can target as the destination.
let tmpDestId='demo-code-'+(pSpec.Hash||'unnamed')+'-'+Date.now();pContainer.innerHTML='<div id="'+tmpDestId+'"></div>';let tmpConfig={ViewIdentifier:'Demo-Code-'+tmpDestId,DefaultDestinationAddress:'#'+tmpDestId,Templates:[{Hash:'CodeEditor-Container',Template:'<!-- demo code editor renders here -->'}],Renderables:[{RenderableHash:'CodeEditor-Wrap',TemplateHash:'CodeEditor-Container',DestinationAddress:'#'+tmpDestId}],TargetElementAddress:'#'+tmpDestId,Language:pSpec.Language||'javascript',ReadOnly:!!pSpec.ReadOnly,LineNumbers:pSpec.LineNumbers!==false,Tab:pSpec.Tab||'\t',AddClosing:pSpec.AddClosing!==false,CatchTab:pSpec.CatchTab!==false,DefaultCode:pSpec.Code||'// example code\n',// AutoRender is intentionally OFF so we can pre-wire CodeJar
// before the first render fires.  pict-section-code looks for
// window.CodeJar by default; most hosts bundle CodeJar under
// window.CodeJarModules.CodeJar (e.g. retold-content-system's
// codejar-bundle.js), so we wire it explicitly here.
AutoRender:false,RenderOnLoad:false};let tmpView=pPict.addView(tmpConfig.ViewIdentifier,tmpConfig,libPictSectionCode);if(!tmpView){return null;}// Connect the CodeJar prototype + highlight function from the
// CodeJarModules global if it's loaded.  Falls back to bare CodeJar
// if the host published the prototype directly.
if(typeof window!=='undefined'){if(window.CodeJarModules&&typeof window.CodeJarModules.CodeJar==='function'){tmpView.connectCodeJarPrototype(window.CodeJarModules.CodeJar);}else if(typeof window.CodeJar==='function'){tmpView.connectCodeJarPrototype(window.CodeJar);}// Wire highlight.js highlighting if the bundle exposes it.
if(window.CodeJarModules&&window.CodeJarModules.hljs){let tmpHljs=window.CodeJarModules.hljs;let tmpLanguage=tmpConfig.Language;tmpView._highlightFunction=function(pElement){pElement.removeAttribute('data-highlighted');delete pElement.dataset.highlighted;pElement.className=pElement.className.replace(/\bhljs\b/g,'').replace(/\blanguage-\S+/g,'').trim();pElement.classList.add('language-'+tmpLanguage);try{tmpHljs.highlightElement(pElement);}catch(pErr){/* swallow — highlighting is best-effort */}};}}try{tmpView.render();}catch(pError){/* pict-section-code logs its own errors */}return tmpView;}const _Demos=[{DemoSchemaVersion:1,Hash:'javascript-editor',Group:'pict',Module:'pict-section-code',Name:'JavaScript editor',Description:'Default pict-section-code configuration — line numbers on, highlight.js for JavaScript, two-space tab.',Spec:{Hash:'javascript-editor',Language:'javascript',LineNumbers:true,Tab:'  ',Code:'// A small example — try editing me.\n'+'function fibonacci(n) {\n'+'  if (n <= 1) return n;\n'+'  return fibonacci(n - 1) + fibonacci(n - 2);\n'+'}\n'+'\n'+'for (let i = 0; i < 10; i++) {\n'+'  console.log(`fib(${i}) =`, fibonacci(i));\n'+'}\n'},Mount:mountCodeEditor,Sources:[{Name:'spec.json',Language:'json',Content:'{\n'+'  "Language": "javascript",\n'+'  "LineNumbers": true,\n'+'  "Tab": "  ",\n'+'  "Code": "function fibonacci(n) { … }"\n'+'}'}]},{DemoSchemaVersion:1,Hash:'json-readonly',Group:'pict',Module:'pict-section-code',Name:'JSON viewer (read-only)',Description:'Read-only mode with line numbers off — useful for embedded "show me the payload" surfaces in dashboards.',Spec:{Hash:'json-readonly',Language:'json',ReadOnly:true,LineNumbers:false,Code:'{\n'+'  "version": "1.0.7",\n'+'  "syntax": {\n'+'    "keyword":  "#A626A4",\n'+'    "string":   "#50A14F",\n'+'    "number":   "#986801",\n'+'    "function": "#4078F2"\n'+'  },\n'+'  "features": ["highlighting", "line-numbers", "readonly", "themed"]\n'+'}\n'},Mount:mountCodeEditor,Sources:[{Name:'spec.json',Language:'json',Content:'{\n'+'  "Language": "json",\n'+'  "ReadOnly": true,\n'+'  "LineNumbers": false\n'+'}'}]},{DemoSchemaVersion:1,Hash:'css-editor',Group:'pict',Module:'pict-section-code',Name:'CSS editor (4-space tab)',Description:'CSS-flavoured highlighting with a 4-space tab and bracket auto-close turned off — leaner editing for stylesheet snippets.',Spec:{Hash:'css-editor',Language:'css',LineNumbers:true,Tab:'    ',AddClosing:false,Code:'/* Theme-aware token usage */\n'+'.docuserve-demo-title {\n'+'    color: var(--theme-color-text-primary, #3D3229);\n'+'    font-size: 1.5em;\n'+'    font-weight: 600;\n'+'}\n'+'\n'+'.docuserve-demo-description {\n'+'    color: var(--theme-color-text-secondary, #5E5549);\n'+'    line-height: 1.55;\n'+'}\n'},Mount:mountCodeEditor,Sources:[{Name:'spec.json',Language:'json',Content:'{\n'+'  "Language": "css",\n'+'  "LineNumbers": true,\n'+'  "Tab": "    ",\n'+'  "AddClosing": false\n'+'}'}]}];/**
 * Register every pict-section-code demo with the host docuserve app.
 *
 * @param {object} pPict - The Pict instance (typically `this.pict` inside
 *                        a DocuserveApplication subclass).
 * @returns {number} count of demos registered (0 if Docuserve-Demos
 *                   provider isn't present — silent no-op).
 */function registerWithDocuserve(pPict){if(!pPict||!pPict.providers||!pPict.providers['Docuserve-Demos']){return 0;}return pPict.providers['Docuserve-Demos'].registerAll(_Demos);}module.exports=_Demos;module.exports.demos=_Demos;module.exports.registerWithDocuserve=registerWithDocuserve;},{"../Pict-Section-Code.js":17}],19:[function(require,module,exports){// The container for all the Pict-Section-Content related code.
// The main content view class
module.exports=require('./views/Pict-View-Content.js');// The content provider (markdown parsing, HTML escaping)
module.exports.PictContentProvider=require('./providers/Pict-Provider-Content.js');},{"./providers/Pict-Provider-Content.js":20,"./views/Pict-View-Content.js":21}],20:[function(require,module,exports){const libPictProvider=require('pict-provider');const libCreateHighlighter=require('pict-section-code').createHighlighter;/**
 * Content Provider for Pict Section Content
 *
 * A general-purpose markdown-to-HTML parser with support for:
 * - Headings, paragraphs, lists, blockquotes, horizontal rules
 * - Fenced code blocks with language tags (nested fence support)
 * - Syntax highlighting and line numbers for code blocks (via pict-section-code)
 * - Tables (GFM pipe syntax)
 * - Mermaid diagram blocks
 * - KaTeX math (inline and display)
 * - Bold, italic, inline code, links, images
 *
 * Link resolution is customizable via an optional callback.
 */class PictContentProvider extends libPictProvider{constructor(pFable,pOptions,pServiceHash){super(pFable,pOptions,pServiceHash);}/**
	 * Highlight a code string using pict-section-code's syntax highlighter.
	 * Uses a mock element to interface with the highlighter's DOM-based API.
	 *
	 * @param {string} pCode - The raw code string
	 * @param {string} pLanguage - The language identifier (e.g. "javascript", "html")
	 * @returns {string} The syntax-highlighted HTML
	 */highlightCode(pCode,pLanguage){if(!pCode){return'';}let tmpHighlighter=libCreateHighlighter(pLanguage);// Create a mock element to interface with the highlighter
let tmpMockElement={textContent:pCode,innerHTML:''};tmpHighlighter(tmpMockElement);return tmpMockElement.innerHTML;}/**
	 * Generate line number HTML for a code block.
	 *
	 * @param {string} pCode - The raw code string
	 * @returns {string} HTML string with line number spans
	 */generateLineNumbers(pCode){if(!pCode){return'<span>1</span>';}let tmpLineCount=pCode.split('\n').length;let tmpHTML='';for(let i=1;i<=tmpLineCount;i++){tmpHTML+='<span>'+i+'</span>';}return tmpHTML;}/**
	 * Parse a markdown string into HTML.
	 *
	 * @param {string} pMarkdown - The raw markdown text
	 * @param {Function} [pLinkResolver] - Optional callback for link resolution: (pHref, pLinkText) => { href, target, rel } or null
	 * @param {Function} [pImageResolver] - Optional callback for image URL resolution: (pSrc, pAlt) => resolvedSrc or null
	 * @param {Function} [pVocabularyResolver] - Optional callback: (pWord) => { slug, title, short } or null. Passed through to parseInline() for vocabulary term auto-linking.
	 * @returns {string} The parsed HTML
	 */parseMarkdown(pMarkdown,pLinkResolver,pImageResolver,pVocabularyResolver){if(!pMarkdown){return'';}let tmpLines=pMarkdown.split('\n');let tmpHTML=[];let tmpInCodeBlock=false;let tmpCodeFenceLength=0;let tmpCodeLang='';let tmpCodeLines=[];let tmpInList=false;let tmpListType='';let tmpInBlockquote=false;let tmpBlockquoteLines=[];let tmpInMathBlock=false;let tmpMathLines=[];let tmpParagraphLines=[];// Helper to flush accumulated paragraph lines into a single <p> tag
let fFlushParagraph=()=>{if(tmpParagraphLines.length>0){tmpHTML.push('<p>'+tmpParagraphLines.map(pLine=>{return this.parseInline(pLine,pLinkResolver,pImageResolver,pVocabularyResolver);}).join(' ')+'</p>');tmpParagraphLines=[];}};for(let i=0;i<tmpLines.length;i++){let tmpLine=tmpLines[i];// Display math blocks ($$...$$) — skip if inside a code block
if(!tmpInCodeBlock&&tmpLine.trim().match(/^\$\$/)){if(tmpInMathBlock){// End math block
tmpHTML.push('<div class="pict-content-katex-display">'+tmpMathLines.join('\n')+'</div>');tmpInMathBlock=false;tmpMathLines=[];}else{// Flush any pending paragraph
fFlushParagraph();// Close any open list or blockquote
if(tmpInList){tmpHTML.push(tmpListType==='ul'?'</ul>':'</ol>');tmpInList=false;}if(tmpInBlockquote){tmpHTML.push('<blockquote>'+this.parseMarkdown(tmpBlockquoteLines.join('\n'),pLinkResolver,pImageResolver,pVocabularyResolver)+'</blockquote>');tmpInBlockquote=false;tmpBlockquoteLines=[];}tmpInMathBlock=true;}continue;}if(tmpInMathBlock){tmpMathLines.push(tmpLine);continue;}// Code blocks (fenced) — track fence length so ````x```` nests around ```y```
let tmpFenceMatch=tmpLine.match(/^(`{3,})/);if(tmpFenceMatch){let tmpFenceLen=tmpFenceMatch[1].length;if(tmpInCodeBlock){// Only close if the closing fence is at least as long as the opening
if(tmpFenceLen>=tmpCodeFenceLength&&tmpLine.trim()===tmpFenceMatch[1]){// End code block
if(tmpCodeLang==='mermaid'){// Mermaid diagrams: output raw content for client-side rendering
tmpHTML.push('<pre class="mermaid">'+tmpCodeLines.join('\n')+'</pre>');}else{let tmpCodeText=tmpCodeLines.join('\n');let tmpHighlightedCode=this.highlightCode(tmpCodeText,tmpCodeLang);let tmpLineNumbersHTML=this.generateLineNumbers(tmpCodeText);tmpHTML.push('<div class="pict-content-code-wrap"><div class="pict-content-code-line-numbers">'+tmpLineNumbersHTML+'</div><pre><code class="language-'+this.escapeHTML(tmpCodeLang)+'">'+tmpHighlightedCode+'</code></pre></div>');}tmpInCodeBlock=false;tmpCodeFenceLength=0;tmpCodeLang='';tmpCodeLines=[];continue;}else{// Inner fence with fewer backticks — treat as content
tmpCodeLines.push(tmpLine);continue;}}else{// Flush any pending paragraph
fFlushParagraph();// Close any open list or blockquote
if(tmpInList){tmpHTML.push(tmpListType==='ul'?'</ul>':'</ol>');tmpInList=false;}if(tmpInBlockquote){tmpHTML.push('<blockquote>'+this.parseMarkdown(tmpBlockquoteLines.join('\n'),pLinkResolver,pImageResolver,pVocabularyResolver)+'</blockquote>');tmpInBlockquote=false;tmpBlockquoteLines=[];}// Start code block — record fence length
tmpCodeFenceLength=tmpFenceLen;tmpCodeLang=tmpLine.replace(/^`{3,}/,'').trim();tmpInCodeBlock=true;continue;}}if(tmpInCodeBlock){tmpCodeLines.push(tmpLine);continue;}// Blockquotes
if(tmpLine.match(/^>\s?/)){if(!tmpInBlockquote){// Flush any pending paragraph
fFlushParagraph();// Close any open list
if(tmpInList){tmpHTML.push(tmpListType==='ul'?'</ul>':'</ol>');tmpInList=false;}tmpInBlockquote=true;tmpBlockquoteLines=[];}tmpBlockquoteLines.push(tmpLine.replace(/^>\s?/,''));continue;}else if(tmpInBlockquote){tmpHTML.push('<blockquote>'+this.parseMarkdown(tmpBlockquoteLines.join('\n'),pLinkResolver,pImageResolver,pVocabularyResolver)+'</blockquote>');tmpInBlockquote=false;tmpBlockquoteLines=[];}// Horizontal rule
if(tmpLine.match(/^(-{3,}|\*{3,}|_{3,})\s*$/)){fFlushParagraph();if(tmpInList){tmpHTML.push(tmpListType==='ul'?'</ul>':'</ol>');tmpInList=false;}tmpHTML.push('<hr>');continue;}// Headings
let tmpHeadingMatch=tmpLine.match(/^(#{1,6})\s+(.+)/);if(tmpHeadingMatch){fFlushParagraph();if(tmpInList){tmpHTML.push(tmpListType==='ul'?'</ul>':'</ol>');tmpInList=false;}let tmpLevel=tmpHeadingMatch[1].length;let tmpText=this.parseInline(tmpHeadingMatch[2],pLinkResolver,pImageResolver,pVocabularyResolver);let tmpID=tmpHeadingMatch[2].toLowerCase().replace(/[^\w\s-]/g,'').replace(/\s+/g,'-');tmpHTML.push('<h'+tmpLevel+' id="'+tmpID+'">'+tmpText+'</h'+tmpLevel+'>');continue;}// Unordered list items
let tmpULMatch=tmpLine.match(/^(\s*)[-*+]\s+(.*)/);if(tmpULMatch){fFlushParagraph();if(!tmpInList||tmpListType!=='ul'){if(tmpInList){tmpHTML.push(tmpListType==='ul'?'</ul>':'</ol>');}tmpHTML.push('<ul>');tmpInList=true;tmpListType='ul';}tmpHTML.push('<li>'+this.parseInline(tmpULMatch[2],pLinkResolver,pImageResolver,pVocabularyResolver)+'</li>');continue;}// Ordered list items
let tmpOLMatch=tmpLine.match(/^(\s*)\d+\.\s+(.*)/);if(tmpOLMatch){fFlushParagraph();if(!tmpInList||tmpListType!=='ol'){if(tmpInList){tmpHTML.push(tmpListType==='ul'?'</ul>':'</ol>');}tmpHTML.push('<ol>');tmpInList=true;tmpListType='ol';}tmpHTML.push('<li>'+this.parseInline(tmpOLMatch[2],pLinkResolver,pImageResolver,pVocabularyResolver)+'</li>');continue;}// Close list if we've left list items
if(tmpInList&&tmpLine.trim()!==''){tmpHTML.push(tmpListType==='ul'?'</ul>':'</ol>');tmpInList=false;}// Empty line — flush any accumulated paragraph
if(tmpLine.trim()===''){fFlushParagraph();continue;}// Table detection
if(tmpLine.match(/^\|/)&&i+1<tmpLines.length&&tmpLines[i+1].match(/^\|[\s-:|]+\|/)){fFlushParagraph();// Close any open list
if(tmpInList){tmpHTML.push(tmpListType==='ul'?'</ul>':'</ol>');tmpInList=false;}let tmpTableHTML='<table>';// Header row
let tmpHeaders=tmpLine.split('|').filter(pCell=>{return pCell.trim()!=='';});tmpTableHTML+='<thead><tr>';for(let h=0;h<tmpHeaders.length;h++){tmpTableHTML+='<th>'+this.parseInline(tmpHeaders[h].trim(),pLinkResolver,pImageResolver,pVocabularyResolver)+'</th>';}tmpTableHTML+='</tr></thead>';// Skip separator row
i++;// Body rows
tmpTableHTML+='<tbody>';while(i+1<tmpLines.length&&tmpLines[i+1].match(/^\|/)){i++;let tmpCells=tmpLines[i].split('|').filter(pCell=>{return pCell.trim()!=='';});tmpTableHTML+='<tr>';for(let c=0;c<tmpCells.length;c++){tmpTableHTML+='<td>'+this.parseInline(tmpCells[c].trim(),pLinkResolver,pImageResolver,pVocabularyResolver)+'</td>';}tmpTableHTML+='</tr>';}tmpTableHTML+='</tbody></table>';tmpHTML.push(tmpTableHTML);continue;}// Accumulate paragraph lines — consecutive non-blank text lines
// will be joined into a single <p> tag when flushed
tmpParagraphLines.push(tmpLine);}// Flush any remaining accumulated paragraph
fFlushParagraph();// Close any trailing open elements
if(tmpInList){tmpHTML.push(tmpListType==='ul'?'</ul>':'</ol>');}if(tmpInBlockquote){tmpHTML.push('<blockquote>'+this.parseMarkdown(tmpBlockquoteLines.join('\n'),pLinkResolver,pImageResolver,pVocabularyResolver)+'</blockquote>');}if(tmpInCodeBlock){let tmpCodeText=tmpCodeLines.join('\n');let tmpHighlightedCode=this.highlightCode(tmpCodeText,tmpCodeLang);let tmpLineNumbersHTML=this.generateLineNumbers(tmpCodeText);tmpHTML.push('<div class="pict-content-code-wrap"><div class="pict-content-code-line-numbers">'+tmpLineNumbersHTML+'</div><pre><code>'+tmpHighlightedCode+'</code></pre></div>');}return tmpHTML.join('\n');}/**
	 * Parse inline markdown elements (bold, italic, code, links, images, KaTeX).
	 *
	 * @param {string} pText - The text to parse
	 * @param {Function} [pLinkResolver] - Optional callback: (pHref, pLinkText) => { href, target, rel } or null
	 * @param {Function} [pImageResolver] - Optional callback: (pSrc, pAlt) => resolvedSrc or null
	 * @param {Function} [pVocabularyResolver] - Optional callback: (pWord) => { slug, title, short } or null. When provided, known vocabulary terms in the rendered text are wrapped in <span class="pict-vocab-term"> with data attributes carrying the popover content.
	 * @returns {string} HTML with inline elements
	 */parseInline(pText,pLinkResolver,pImageResolver,pVocabularyResolver){if(!pText){return'';}let tmpResult=pText;// Extract inline code spans into placeholders so bold/italic regexes don't mangle their contents
let tmpCodeSpans=[];tmpResult=tmpResult.replace(/`([^`]+)`/g,(pMatch,pCode)=>{let tmpIndex=tmpCodeSpans.length;tmpCodeSpans.push('<code>'+pCode+'</code>');return'\x00CODEINLINE'+tmpIndex+'\x00';});// Inline LaTeX equations ($...$) — must be processed before other inline patterns
// Match single $ delimiters that aren't adjacent to spaces (to avoid false positives with currency)
tmpResult=tmpResult.replace(/\$([^\$\s][^\$]*?[^\$\s])\$/g,'<span class="pict-content-katex-inline">$1</span>');// Also match single-character inline math like $x$
tmpResult=tmpResult.replace(/\$([^\$\s])\$/g,'<span class="pict-content-katex-inline">$1</span>');// Images
tmpResult=tmpResult.replace(/!\[([^\]]*)\]\(([^)]+)\)/g,(pMatch,pAlt,pSrc)=>{let tmpSrc=pSrc;if(typeof pImageResolver==='function'){let tmpResolved=pImageResolver(pSrc,pAlt);if(tmpResolved){tmpSrc=tmpResolved;}}return'<img src="'+tmpSrc+'" alt="'+pAlt+'">';});// Links
tmpResult=tmpResult.replace(/\[([^\]]+)\]\(([^)]+)\)/g,(pMatch,pLinkText,pHref)=>{if(typeof pLinkResolver==='function'){let tmpResolved=pLinkResolver(pHref,pLinkText);if(tmpResolved){let tmpTarget=tmpResolved.target?' target="'+tmpResolved.target+'"':'';let tmpRel=tmpResolved.rel?' rel="'+tmpResolved.rel+'"':'';return'<a href="'+tmpResolved.href+'"'+tmpTarget+tmpRel+'>'+pLinkText+'</a>';}}// Default behavior: external links open in new tab
if(pHref.match(/^https?:\/\//)){return'<a href="'+pHref+'" target="_blank" rel="noopener">'+pLinkText+'</a>';}return'<a href="'+pHref+'">'+pLinkText+'</a>';});// Bold
tmpResult=tmpResult.replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');tmpResult=tmpResult.replace(/__([^_]+)__/g,'<strong>$1</strong>');// Italic
tmpResult=tmpResult.replace(/\*([^*]+)\*/g,'<em>$1</em>');tmpResult=tmpResult.replace(/_([^_]+)_/g,'<em>$1</em>');// Restore inline code spans from placeholders
tmpResult=tmpResult.replace(/\x00CODEINLINE(\d+)\x00/g,(pMatch,pIndex)=>{return tmpCodeSpans[parseInt(pIndex)];});// Vocabulary term auto-linking: scan the rendered text for
// known vocabulary terms and wrap each first occurrence in a
// span with data attributes for the popover system. Skips
// content inside <code>, <a>, <pre>, and <strong> tags to
// avoid mangling links, code, or already-emphasized text.
if(typeof pVocabularyResolver==='function'){tmpResult=this._applyVocabularyLinks(tmpResult,pVocabularyResolver);}return tmpResult;}/**
	 * Scan HTML for vocabulary terms and wrap the first occurrence
	 * of each in a <span class="pict-vocab-term"> element. The
	 * resolver callback is called for each candidate word/phrase
	 * and returns { slug, title, short } if it's a known term.
	 *
	 * Skips content inside HTML tags to avoid breaking links,
	 * code spans, and other markup.
	 *
	 * @param {string} pHTML
	 * @param {Function} pResolver - (word) => {slug, title, short} | null
	 * @returns {string}
	 */_applyVocabularyLinks(pHTML,pResolver){if(!pHTML||typeof pResolver!=='function'){return pHTML;}// Track which terms we've already linked to avoid duplicate
// links for the same term appearing multiple times.
let tmpLinked={};// Split the HTML into segments: tags vs text nodes. We only
// scan text nodes for vocabulary terms; tags pass through.
// This regex captures HTML tags as separators.
let tmpParts=pHTML.split(/(<[^>]+>)/g);// Track whether we're inside a tag that should be skipped
let tmpSkipDepth=0;let tmpSkipTags=['code','a','pre','span'];for(let i=0;i<tmpParts.length;i++){let tmpPart=tmpParts[i];// Check if this is an HTML tag
if(tmpPart.charAt(0)==='<'){// Opening tag?
let tmpOpenMatch=tmpPart.match(/^<(\w+)/);if(tmpOpenMatch&&tmpSkipTags.indexOf(tmpOpenMatch[1].toLowerCase())!==-1){tmpSkipDepth++;}// Closing tag?
let tmpCloseMatch=tmpPart.match(/^<\/(\w+)/);if(tmpCloseMatch&&tmpSkipTags.indexOf(tmpCloseMatch[1].toLowerCase())!==-1){tmpSkipDepth=Math.max(0,tmpSkipDepth-1);}continue;// Don't modify tags
}// Skip text inside protected elements
if(tmpSkipDepth>0)continue;// Scan this text node for vocabulary terms. Use word
// boundary regex to match whole words only.
tmpParts[i]=tmpPart.replace(/\b([A-Za-z][A-Za-z0-9_-]{1,30})\b/g,(pMatch,pWord)=>{// Skip very short words and common English words
if(pWord.length<3)return pMatch;let tmpLower=pWord.toLowerCase();if(tmpLinked[tmpLower])return pMatch;// already linked
let tmpResult=pResolver(tmpLower);if(!tmpResult)return pMatch;tmpLinked[tmpLower]=true;let tmpShortEsc=(tmpResult.short||'').replace(/"/g,'&quot;');return'<span class="pict-vocab-term" data-vocab-slug="'+tmpResult.slug+'" data-vocab-title="'+(tmpResult.title||'').replace(/"/g,'&quot;')+'" data-vocab-short="'+tmpShortEsc+'">'+pMatch+'</span>';});}return tmpParts.join('');}/**
	 * Escape HTML special characters.
	 *
	 * @param {string} pText - The text to escape
	 * @returns {string} The escaped text
	 */escapeHTML(pText){if(!pText){return'';}return pText.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}}module.exports=PictContentProvider;module.exports.default_configuration={ProviderIdentifier:"Pict-Content",AutoInitialize:true,AutoInitializeOrdinal:0};},{"pict-provider":14,"pict-section-code":17}],21:[function(require,module,exports){const libPictView=require('pict-view');const _ViewConfiguration={ViewIdentifier:"Pict-Content",DefaultRenderable:"Pict-Content-Display",DefaultDestinationAddress:"#Pict-Content-Container",AutoRender:false,CSS:/*css*/"\n\t\t.pict-content {\n\t\t\tpadding: 2em 3em;\n\t\t\tmax-width: 900px;\n\t\t\tmargin: 0 auto;\n\t\t}\n\t\t.pict-content-loading {\n\t\t\tdisplay: flex;\n\t\t\talign-items: center;\n\t\t\tjustify-content: center;\n\t\t\tmin-height: 200px;\n\t\t\tcolor: var(--theme-color-text-muted, #8A7F72);\n\t\t\tfont-size: 1em;\n\t\t}\n\t\t.pict-content h1 {\n\t\t\tfont-size: 2em;\n\t\t\tcolor: var(--theme-color-text-primary, #3D3229);\n\t\t\tborder-bottom: 1px solid var(--theme-color-border-default, #DDD6CA);\n\t\t\tpadding-bottom: 0.3em;\n\t\t\tmargin-top: 0;\n\t\t}\n\t\t.pict-content h2 {\n\t\t\tfont-size: 1.5em;\n\t\t\tcolor: var(--theme-color-text-primary, #3D3229);\n\t\t\tborder-bottom: 1px solid var(--theme-color-border-light, #EAE3D8);\n\t\t\tpadding-bottom: 0.25em;\n\t\t\tmargin-top: 1.5em;\n\t\t}\n\t\t.pict-content h3 {\n\t\t\tfont-size: 1.25em;\n\t\t\tcolor: var(--theme-color-text-primary, #3D3229);\n\t\t\tmargin-top: 1.25em;\n\t\t}\n\t\t.pict-content h4, .pict-content h5, .pict-content h6 {\n\t\t\tcolor: var(--theme-color-text-secondary, #5E5549);\n\t\t\tmargin-top: 1em;\n\t\t}\n\t\t.pict-content p {\n\t\t\tline-height: 1.7;\n\t\t\tcolor: var(--theme-color-text-primary, #423D37);\n\t\t\tmargin: 0.75em 0;\n\t\t}\n\t\t.pict-content a {\n\t\t\tcolor: var(--theme-color-brand-primary, #2E7D74);\n\t\t\ttext-decoration: none;\n\t\t}\n\t\t.pict-content a:hover {\n\t\t\ttext-decoration: underline;\n\t\t}\n\t\t/* \u2500\u2500\u2500 Code blocks \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\t\t   Background, text color, line-number gutter, and every\n\t\t   syntax token route through pict-provider-theme tokens \u2014\n\t\t   the same set pict-section-code (the live editor) uses.\n\t\t   This way the rendered-preview code blocks look identical\n\t\t   to the live editor and re-skin together when the theme\n\t\t   switches.  Previous version used the text-primary token\n\t\t   as the code background (a TEXT token used as BACKGROUND),\n\t\t   which broke in dark mode and any palette where text and\n\t\t   background-tertiary diverge.\n\t\t*/\n\t\t.pict-content pre {\n\t\t\tbackground:    var(--theme-color-background-tertiary, #F0ECE4);\n\t\t\tcolor:         var(--theme-color-text-primary,        #3D3229);\n\t\t\tborder:        1px solid var(--theme-color-border-default, #DDD6CA);\n\t\t\tpadding: 1.25em;\n\t\t\tborder-radius: 6px;\n\t\t\toverflow-x: auto;\n\t\t\tline-height: 1.5;\n\t\t\tfont-size: 0.9em;\n\t\t\tfont-family: var(--theme-typography-family-mono, 'SFMono-Regular', 'SF Mono', 'Menlo', 'Consolas', 'Liberation Mono', 'Courier New', monospace);\n\t\t}\n\t\t/* Inline code (single backtick) \u2014 slightly differentiated\n\t\t   from block code so it doesn't disappear into prose. */\n\t\t.pict-content code {\n\t\t\tbackground:    var(--theme-color-background-secondary, #FAF8F4);\n\t\t\tcolor:         var(--theme-color-text-primary,         #3D3229);\n\t\t\tpadding: 0.15em 0.4em;\n\t\t\tborder-radius: 3px;\n\t\t\tfont-size: 0.9em;\n\t\t\tfont-family: var(--theme-typography-family-mono, 'SFMono-Regular', 'SF Mono', 'Menlo', monospace);\n\t\t}\n\t\t.pict-content-code-wrap {\n\t\t\tdisplay: flex;\n\t\t\tflex-direction: row;\n\t\t\tfont-family: var(--theme-typography-family-mono, 'SFMono-Regular', 'SF Mono', 'Menlo', 'Consolas', 'Liberation Mono', 'Courier New', monospace);\n\t\t\tfont-size: 14px;\n\t\t\tline-height: 1.5;\n\t\t\tborder: 1px solid var(--theme-color-border-default, #DDD6CA);\n\t\t\tborder-radius: 6px;\n\t\t\toverflow: hidden;\n\t\t\tmargin: 1em 0;\n\t\t\tbackground: var(--theme-color-background-tertiary, #F0ECE4);\n\t\t}\n\t\t.pict-content-code-wrap .pict-content-code-line-numbers {\n\t\t\twidth: 40px;\n\t\t\tmin-width: 40px;\n\t\t\tpadding: 1.25em 0;\n\t\t\ttext-align: right;\n\t\t\tbackground:    var(--theme-color-background-secondary, #FAF8F4);\n\t\t\tborder-right:  1px solid var(--theme-color-border-default, #DDD6CA);\n\t\t\tcolor:         var(--theme-color-text-muted,           #8A7F72);\n\t\t\tfont-family: inherit;\n\t\t\tfont-size: inherit;\n\t\t\tline-height: inherit;\n\t\t\tuser-select: none;\n\t\t\tpointer-events: none;\n\t\t\tbox-sizing: border-box;\n\t\t}\n\t\t.pict-content-code-wrap .pict-content-code-line-numbers span {\n\t\t\tdisplay: block;\n\t\t\tpadding: 0 8px 0 0;\n\t\t}\n\t\t.pict-content-code-wrap pre {\n\t\t\tmargin: 0;\n\t\t\tbackground: var(--theme-color-background-tertiary, #F0ECE4);\n\t\t\tcolor:      var(--theme-color-text-primary,        #3D3229);\n\t\t\tborder: none;\n\t\t\tpadding: 1.25em 1.25em 1.25em 8px;\n\t\t\tborder-radius: 0 6px 6px 0;\n\t\t\toverflow-x: auto;\n\t\t\tline-height: 1.5;\n\t\t\tfont-size: inherit;\n\t\t\tflex: 1;\n\t\t\tmin-width: 0;\n\t\t}\n\t\t.pict-content-code-wrap pre code {\n\t\t\tbackground: none;\n\t\t\tpadding: 0;\n\t\t\tcolor: inherit;\n\t\t\tfont-size: inherit;\n\t\t\tfont-family: inherit;\n\t\t}\n\t\t/* Syntax token colors \u2014 every class binds to a --theme-color-syntax-*\n\t\t   variable, the same tokens pict-section-code (the live editor) uses.\n\t\t   Each var() carries an Atom One Light hex as fallback for hosts\n\t\t   without a theme provider; themes that DO ship syntax tokens\n\t\t   (pict-default, retold-content-system, etc.) drive everything\n\t\t   coherently. */\n\t\t.pict-content-code-wrap .keyword       { color: var(--theme-color-syntax-keyword,     #A626A4); }\n\t\t.pict-content-code-wrap .string        { color: var(--theme-color-syntax-string,      #50A14F); }\n\t\t.pict-content-code-wrap .number        { color: var(--theme-color-syntax-number,      #986801); }\n\t\t.pict-content-code-wrap .comment       { color: var(--theme-color-syntax-comment,     #A0A1A7); font-style: italic; }\n\t\t.pict-content-code-wrap .operator      { color: var(--theme-color-syntax-operator,    #0184BC); }\n\t\t.pict-content-code-wrap .punctuation   { color: var(--theme-color-syntax-punctuation, #383A42); }\n\t\t.pict-content-code-wrap .function-name { color: var(--theme-color-syntax-function,    #4078F2); }\n\t\t.pict-content-code-wrap .property      { color: var(--theme-color-syntax-property,    #E45649); }\n\t\t.pict-content-code-wrap .tag           { color: var(--theme-color-syntax-tag,         #E45649); }\n\t\t.pict-content-code-wrap .attr-name     { color: var(--theme-color-syntax-attrname,    #986801); }\n\t\t.pict-content-code-wrap .attr-value    { color: var(--theme-color-syntax-attrvalue,   #50A14F); }\n\t\t.pict-content-code-wrap .builtin       { color: var(--theme-color-syntax-builtin,     #986801); }\n\t\t.pict-content-code-wrap .type          { color: var(--theme-color-syntax-type,        #C18401); }\n\t\t.pict-content-code-wrap .variable      { color: var(--theme-color-syntax-variable,    #383A42); }\n\t\t.pict-content pre code {\n\t\t\tbackground: none;\n\t\t\tpadding: 0;\n\t\t\tcolor: inherit;\n\t\t\tfont-size: inherit;\n\t\t}\n\t\t.pict-content blockquote {\n\t\t\tborder-left: 4px solid var(--theme-color-brand-primary, #2E7D74);\n\t\t\tmargin: 1em 0;\n\t\t\tpadding: 0.5em 1em;\n\t\t\tbackground: var(--theme-color-background-secondary, #F7F5F0);\n\t\t\tcolor: var(--theme-color-text-secondary, #5E5549);\n\t\t}\n\t\t.pict-content blockquote p {\n\t\t\tmargin: 0.25em 0;\n\t\t}\n\t\t.pict-content ul, .pict-content ol {\n\t\t\tpadding-left: 2em;\n\t\t\tline-height: 1.8;\n\t\t}\n\t\t.pict-content li {\n\t\t\tmargin: 0.25em 0;\n\t\t\tcolor: var(--theme-color-text-primary, #423D37);\n\t\t}\n\t\t.pict-content hr {\n\t\t\tborder: none;\n\t\t\tborder-top: 1px solid var(--theme-color-border-default, #DDD6CA);\n\t\t\tmargin: 2em 0;\n\t\t}\n\t\t.pict-content table {\n\t\t\twidth: 100%;\n\t\t\tborder-collapse: collapse;\n\t\t\tmargin: 1em 0;\n\t\t}\n\t\t.pict-content table th {\n\t\t\tbackground: var(--theme-color-background-secondary, #F5F0E8);\n\t\t\tborder: 1px solid var(--theme-color-border-default, #DDD6CA);\n\t\t\tpadding: 0.6em 0.8em;\n\t\t\ttext-align: left;\n\t\t\tfont-weight: 600;\n\t\t\tcolor: var(--theme-color-text-primary, #3D3229);\n\t\t}\n\t\t.pict-content table td {\n\t\t\tborder: 1px solid var(--theme-color-border-default, #DDD6CA);\n\t\t\tpadding: 0.5em 0.8em;\n\t\t\tcolor: var(--theme-color-text-primary, #423D37);\n\t\t}\n\t\t.pict-content table tr:nth-child(even) {\n\t\t\tbackground: var(--theme-color-background-secondary, #F7F5F0);\n\t\t}\n\t\t.pict-content img {\n\t\t\tmax-width: 100%;\n\t\t\theight: auto;\n\t\t}\n\t\t.pict-content pre.mermaid {\n\t\t\tbackground: var(--theme-color-background-panel, #fff);\n\t\t\tcolor: var(--theme-color-text-primary, #2A241E);\n\t\t\ttext-align: center;\n\t\t\tpadding: 1em;\n\t\t}\n\t\t.pict-content pre.mermaid text,\n\t\t.pict-content pre.mermaid .nodeLabel,\n\t\t.pict-content pre.mermaid .edgeLabel,\n\t\t.pict-content pre.mermaid .label,\n\t\t.pict-content pre.mermaid .cluster-label,\n\t\t.pict-content pre.mermaid span,\n\t\t.pict-content pre.mermaid foreignObject p,\n\t\t.pict-content pre.mermaid foreignObject div,\n\t\t.pict-content pre.mermaid foreignObject span {\n\t\t\tcolor: var(--theme-color-text-primary, #2A241E) !important;\n\t\t\tfill: var(--theme-color-text-primary, #2A241E) !important;\n\t\t}\n\t\t.pict-content pre.mermaid .edgePath .path {\n\t\t\tstroke: var(--theme-color-text-secondary, #5E5549) !important;\n\t\t}\n\t\t.pict-content pre.mermaid .arrowheadPath {\n\t\t\tfill: var(--theme-color-text-secondary, #5E5549) !important;\n\t\t}\n\t\t.pict-content .pict-content-katex-display {\n\t\t\ttext-align: center;\n\t\t\tmargin: 1em 0;\n\t\t\tpadding: 0.5em;\n\t\t\toverflow-x: auto;\n\t\t}\n\t\t.pict-content .pict-content-katex-inline {\n\t\t\tdisplay: inline;\n\t\t}\n\n\t\t/* Fullscreen viewer for images and mermaid diagrams (click-to-zoom) */\n\t\t.pict-content [data-fullscreen-source] {\n\t\t\tcursor: zoom-in;\n\t\t\toutline: 1px solid transparent;\n\t\t\toutline-offset: 3px;\n\t\t\tborder-radius: 4px;\n\t\t\ttransition: outline-color 0.15s ease;\n\t\t}\n\t\t.pict-content [data-fullscreen-source]:hover {\n\t\t\toutline-color: var(--theme-color-brand-primary, #2E7D74);\n\t\t}\n\t\t/* Code block container with hover-revealed action buttons */\n\t\t.pict-content-code-container {\n\t\t\tposition: relative;\n\t\t\tdisplay: flex;\n\t\t\talign-items: flex-start;\n\t\t\tgap: 8px;\n\t\t\tmargin: 1em 0;\n\t\t}\n\t\t.pict-content-code-container > .pict-content-code-wrap {\n\t\t\tmargin: 0;\n\t\t\tflex: 1 1 auto;\n\t\t\tmin-width: 0;\n\t\t}\n\t\t.pict-content-code-actions {\n\t\t\tposition: sticky;\n\t\t\ttop: 64px;\n\t\t\talign-self: flex-start;\n\t\t\tdisplay: flex;\n\t\t\tflex-direction: column;\n\t\t\tgap: 6px;\n\t\t\tflex: 0 0 auto;\n\t\t\tpadding-top: 6px;\n\t\t\topacity: 0;\n\t\t\ttransform: translateX(-4px);\n\t\t\ttransition: opacity 0.15s ease, transform 0.15s ease;\n\t\t\tpointer-events: none;\n\t\t}\n\t\t.pict-content-code-container:hover .pict-content-code-actions,\n\t\t.pict-content-code-container:focus-within .pict-content-code-actions {\n\t\t\topacity: 1;\n\t\t\ttransform: translateX(0);\n\t\t\tpointer-events: auto;\n\t\t}\n\t\t.pict-content-code-action-btn {\n\t\t\tdisplay: inline-flex;\n\t\t\talign-items: center;\n\t\t\tjustify-content: center;\n\t\t\twidth: 28px;\n\t\t\theight: 28px;\n\t\t\tpadding: 0;\n\t\t\tbackground: var(--theme-color-background-panel, #FFFFFF);\n\t\t\tcolor: var(--theme-color-text-muted, #5E5549);\n\t\t\tborder: 1px solid var(--theme-color-border-default, #DDD6CA);\n\t\t\tborder-radius: 6px;\n\t\t\tcursor: pointer;\n\t\t\tbox-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);\n\t\t\ttransition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;\n\t\t}\n\t\t.pict-content-code-action-btn svg {\n\t\t\tdisplay: block;\n\t\t\twidth: 14px;\n\t\t\theight: 14px;\n\t\t\tstroke: currentColor;\n\t\t\tfill: none;\n\t\t\tstroke-width: 1.6;\n\t\t\tstroke-linecap: round;\n\t\t\tstroke-linejoin: round;\n\t\t}\n\t\t.pict-content-code-action-btn:hover {\n\t\t\tbackground: var(--theme-color-brand-primary, #2E7D74);\n\t\t\tcolor: var(--theme-color-text-on-brand, #FFFFFF);\n\t\t\tborder-color: var(--theme-color-brand-primary, #2E7D74);\n\t\t\tbox-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);\n\t\t}\n\t\t.pict-content-code-action-btn:focus-visible {\n\t\t\toutline: 2px solid var(--theme-color-brand-primary, #2E7D74);\n\t\t\toutline-offset: 2px;\n\t\t}\n\t\t.pict-content-code-action-btn.is-copied {\n\t\t\tbackground: var(--theme-color-brand-primary, #2E7D74);\n\t\t\tcolor: var(--theme-color-text-on-brand, #FFFFFF);\n\t\t\tborder-color: var(--theme-color-brand-primary, #2E7D74);\n\t\t}\n\t\t.pict-content-code-action-btn.is-copy-failed {\n\t\t\tbackground: var(--theme-color-status-error, #B23A3A);\n\t\t\tcolor: var(--theme-color-text-on-brand, #FFFFFF);\n\t\t\tborder-color: var(--theme-color-status-error, #B23A3A);\n\t\t}\n\t\t.pict-fullscreen-overlay {\n\t\t\tposition: fixed;\n\t\t\tinset: 0;\n\t\t\tz-index: 9999;\n\t\t\tdisplay: flex;\n\t\t\tflex-direction: column;\n\t\t\tbackground: rgba(0, 0, 0, 0.62);\n\t\t\tbackdrop-filter: blur(6px);\n\t\t\t-webkit-backdrop-filter: blur(6px);\n\t\t\tcolor: var(--theme-color-text-primary, #2A241E);\n\t\t}\n\t\t.pict-fullscreen-overlay[hidden] {\n\t\t\tdisplay: none;\n\t\t}\n\t\t.pict-fullscreen-titlebar {\n\t\t\tdisplay: flex;\n\t\t\talign-items: center;\n\t\t\tjustify-content: space-between;\n\t\t\tgap: 1em;\n\t\t\theight: 48px;\n\t\t\tpadding: 0 1em;\n\t\t\tbackground: var(--theme-color-background-panel, #FFFFFF);\n\t\t\tcolor: var(--theme-color-text-primary, #1A1612);\n\t\t\tborder-bottom: 1px solid var(--theme-color-border-default, #DDD6CA);\n\t\t\tbox-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);\n\t\t\tflex: 0 0 auto;\n\t\t}\n\t\t.pict-fullscreen-title {\n\t\t\tfont-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif;\n\t\t\tfont-size: 0.95em;\n\t\t\tfont-weight: 600;\n\t\t\tletter-spacing: 0.01em;\n\t\t\twhite-space: nowrap;\n\t\t\toverflow: hidden;\n\t\t\ttext-overflow: ellipsis;\n\t\t\tcolor: var(--theme-color-text-primary, #1A1612);\n\t\t}\n\t\t.pict-fullscreen-controls {\n\t\t\tdisplay: inline-flex;\n\t\t\talign-items: center;\n\t\t\tgap: 4px;\n\t\t}\n\t\t.pict-fullscreen-btn {\n\t\t\tdisplay: inline-flex;\n\t\t\talign-items: center;\n\t\t\tjustify-content: center;\n\t\t\twidth: 32px;\n\t\t\theight: 32px;\n\t\t\tpadding: 0;\n\t\t\tbackground: transparent;\n\t\t\tborder: 1px solid transparent;\n\t\t\tborder-radius: 6px;\n\t\t\tcolor: var(--theme-color-text-muted, #5E5549);\n\t\t\tcursor: pointer;\n\t\t\ttransition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease;\n\t\t}\n\t\t.pict-fullscreen-btn svg {\n\t\t\tdisplay: block;\n\t\t\twidth: 16px;\n\t\t\theight: 16px;\n\t\t\tstroke: currentColor;\n\t\t\tfill: none;\n\t\t\tstroke-width: 1.75;\n\t\t\tstroke-linecap: round;\n\t\t\tstroke-linejoin: round;\n\t\t}\n\t\t.pict-fullscreen-btn:hover {\n\t\t\tbackground: var(--theme-color-border-light, #EAE3D8);\n\t\t\tcolor: var(--theme-color-text-primary, #1A1612);\n\t\t}\n\t\t.pict-fullscreen-btn:focus-visible {\n\t\t\toutline: 2px solid var(--theme-color-brand-primary, #2E7D74);\n\t\t\toutline-offset: 2px;\n\t\t}\n\t\t.pict-fullscreen-close:hover {\n\t\t\tbackground: var(--theme-color-brand-primary, #2E7D74);\n\t\t\tcolor: var(--theme-color-text-on-brand, #FFFFFF);\n\t\t}\n\t\t.pict-fullscreen-stage {\n\t\t\tflex: 1 1 auto;\n\t\t\tdisplay: flex;\n\t\t\talign-items: center;\n\t\t\tjustify-content: center;\n\t\t\toverflow: hidden;\n\t\t\tpadding: 1.5em;\n\t\t\tcursor: zoom-in;\n\t\t\ttouch-action: none;\n\t\t}\n\t\t.pict-fullscreen-stage.is-zoomed {\n\t\t\tcursor: grab;\n\t\t}\n\t\t.pict-fullscreen-stage.is-panning {\n\t\t\tcursor: grabbing;\n\t\t}\n\t\t.pict-fullscreen-content {\n\t\t\tdisplay: flex;\n\t\t\talign-items: center;\n\t\t\tjustify-content: center;\n\t\t\tmax-width: 100%;\n\t\t\tmax-height: 100%;\n\t\t\ttransform-origin: center center;\n\t\t\ttransition: transform 0.05s linear;\n\t\t\twill-change: transform;\n\t\t}\n\t\t.pict-fullscreen-content > * {\n\t\t\tbox-shadow: 0 12px 48px rgba(0, 0, 0, 0.45);\n\t\t}\n\t\t.pict-fullscreen-content .pict-fullscreen-img {\n\t\t\tmax-width: 90vw;\n\t\t\tmax-height: calc(100vh - 96px);\n\t\t\twidth: auto;\n\t\t\theight: auto;\n\t\t\tobject-fit: contain;\n\t\t\tbackground: var(--theme-color-background-panel, #FFFFFF);\n\t\t\tpadding: 12px;\n\t\t\tborder-radius: 6px;\n\t\t}\n\t\t.pict-fullscreen-content .pict-fullscreen-mermaid-svg {\n\t\t\twidth: min(90vw, 1400px);\n\t\t\theight: auto;\n\t\t\tmax-height: calc(100vh - 96px);\n\t\t\tbackground: var(--theme-color-background-panel, #FFFFFF);\n\t\t\tpadding: 16px;\n\t\t\tborder-radius: 6px;\n\t\t}\n\t\t.pict-fullscreen-content .pict-fullscreen-codewrap {\n\t\t\tmax-width: 90vw;\n\t\t\tmax-height: calc(100vh - 96px);\n\t\t\tmargin: 0;\n\t\t\toverflow: auto;\n\t\t\tbox-shadow: 0 12px 48px rgba(0, 0, 0, 0.45);\n\t\t}\n\t",Templates:[{Hash:"Pict-Content-Template",Template:/*html*/"\n<div class=\"pict-content\" id=\"Pict-Content-Body\">\n\t<div class=\"pict-content-loading\">Loading content...</div>\n</div>\n"}],Renderables:[{RenderableHash:"Pict-Content-Display",TemplateHash:"Pict-Content-Template",DestinationAddress:"#Pict-Content-Container",RenderMethod:"replace"}]};class PictContentView extends libPictView{constructor(pFable,pOptions,pServiceHash){super(pFable,pOptions,pServiceHash);}/**
	 * Display parsed HTML content in the content area.
	 *
	 * @param {string} pHTMLContent - The HTML to display
	 * @param {string} [pContainerID] - The container element ID (defaults to 'Pict-Content-Body')
	 */displayContent(pHTMLContent,pContainerID){let tmpContainerID=pContainerID||'Pict-Content-Body';this.pict.ContentAssignment.assignContent('#'+tmpContainerID,pHTMLContent);// Scroll to top of content area
let tmpContentContainer=document.getElementById(tmpContainerID);if(tmpContentContainer&&tmpContentContainer.parentElement){tmpContentContainer.parentElement.scrollTop=0;}// Ensure the container carries the `.pict-content` class so the
// 30+ theme-scoped CSS rules below (`.pict-content a`, `.pict-content
// h1`, `.pict-content pre`, ...) actually match when a host passes
// a custom container ID.  Idempotent — re-adding the class is a
// no-op if it's already there from the host's markup.
if(tmpContentContainer&&!tmpContentContainer.classList.contains('pict-content')){tmpContentContainer.classList.add('pict-content');}// Tag images and code blocks immediately so they're clickable.
// Mermaid blocks are tagged after mermaid.run() resolves (see below).
this.enableFullscreenViewers(tmpContainerID,{skipMermaid:true});// Post-render: initialize Mermaid diagrams if mermaid is available.
// Once mermaid finishes, retag so the rendered SVGs are also clickable.
this.renderMermaidDiagrams(tmpContainerID);// Post-render: render KaTeX equations if katex is available
this.renderKaTeXEquations(tmpContainerID);}/**
	 * Initialize Mermaid with theme variables read from the active
	 * pict-provider-theme palette. Mermaid's `base` theme honors
	 * `themeVariables`, so the diagram colors (node fills, cluster
	 * backgrounds, edges, labels) follow whatever theme is applied.
	 *
	 * Idempotent and cheap. Called lazily before the first
	 * `mermaid.run()` and again from the onApply subscription when
	 * the user switches themes.
	 */_initializeMermaidTheme(){if(typeof mermaid==='undefined'||typeof window==='undefined'){return;}let tmpCs=getComputedStyle(document.documentElement);let tmpVar=(pName,pFallback)=>{let tmpVal=(tmpCs.getPropertyValue(pName)||'').trim();return tmpVal||pFallback;};// Read every token Mermaid 'base' actually consumes. Falling
// back to the retold-content-system warm-beige hexes keeps the
// diagram readable even if the theme provider isn't installed.
try{mermaid.initialize({startOnLoad:false,theme:'base',securityLevel:'loose',themeVariables:{// Primary surfaces (node fills + cluster background)
primaryColor:tmpVar('--theme-color-background-panel','#FAF8F4'),primaryTextColor:tmpVar('--theme-color-text-primary','#3D3229'),primaryBorderColor:tmpVar('--theme-color-brand-primary','#2E7D74'),// Secondary (alt rows, alternate nodes, sequence actor bg)
secondaryColor:tmpVar('--theme-color-background-secondary','#F0EDE8'),secondaryTextColor:tmpVar('--theme-color-text-secondary','#5E5549'),secondaryBorderColor:tmpVar('--theme-color-border-default','#DDD6CA'),// Tertiary (clusters, accent groups)
tertiaryColor:tmpVar('--theme-color-background-tertiary','#EDE9E3'),tertiaryTextColor:tmpVar('--theme-color-text-secondary','#5E5549'),tertiaryBorderColor:tmpVar('--theme-color-border-light','#E8E2D7'),// Page-level + line + note
background:tmpVar('--theme-color-background-panel','#FAF8F4'),mainBkg:tmpVar('--theme-color-background-panel','#FAF8F4'),secondBkg:tmpVar('--theme-color-background-secondary','#F0EDE8'),lineColor:tmpVar('--theme-color-text-secondary','#5E5549'),textColor:tmpVar('--theme-color-text-primary','#3D3229'),noteBkgColor:tmpVar('--theme-color-background-tertiary','#EDE9E3'),noteTextColor:tmpVar('--theme-color-text-primary','#3D3229'),noteBorderColor:tmpVar('--theme-color-border-default','#DDD6CA'),// Status (Mermaid uses these for error/warning highlights)
errorBkgColor:tmpVar('--theme-color-status-error','#D9534F'),errorTextColor:tmpVar('--theme-color-text-on-brand','#FFFFFF'),// Typography
fontFamily:tmpVar('--theme-typography-family-sans','inherit')}});}catch(pError){if(this.log&&this.log.warn){this.log.warn('Mermaid theme init failed: '+pError.message);}}}/**
	 * Subscribe to pict-provider-theme apply events so Mermaid diagrams
	 * re-render with the new palette on theme change. Idempotent — safe
	 * to call multiple times. Falls through silently when the provider
	 * isn't installed (apps using pict-section-content without
	 * pict-provider-theme still get the static base theme).
	 */_subscribeToThemeChanges(){if(this._mermaidThemeSubscribed){return;}let tmpProvider=this.pict&&this.pict.providers&&this.pict.providers.Theme;if(!tmpProvider||typeof tmpProvider.onApply!=='function'){return;}let tmpSelf=this;tmpProvider.onApply(function(){tmpSelf._initializeMermaidTheme();tmpSelf._refreshMermaidDiagrams();});this._mermaidThemeSubscribed=true;}/**
	 * Re-render every Mermaid diagram on the page using its cached
	 * source. Called after a theme change so the new themeVariables
	 * take effect on already-displayed diagrams.
	 *
	 * Mermaid replaces `pre.mermaid`'s textContent with the rendered
	 * SVG during `mermaid.run()`. To re-render we need the original
	 * source, which `renderMermaidDiagrams` stashes on each element
	 * as `data-mermaid-source` BEFORE running. This method restores
	 * that source, drops the `data-processed` flag, and re-runs.
	 */_refreshMermaidDiagrams(){if(typeof mermaid==='undefined'||typeof document==='undefined'){return;}let tmpRendered=document.querySelectorAll('pre.mermaid[data-mermaid-source]');if(tmpRendered.length<1){return;}for(let i=0;i<tmpRendered.length;i++){let tmpEl=tmpRendered[i];tmpEl.textContent=tmpEl.getAttribute('data-mermaid-source');tmpEl.removeAttribute('data-processed');tmpEl.classList.remove('mermaid-rendered');}try{let tmpResult=mermaid.run({nodes:tmpRendered});if(tmpResult&&typeof tmpResult.catch==='function'){tmpResult.catch(pError=>{if(this.log&&this.log.warn){this.log.warn('Mermaid re-render failed: '+(pError&&pError.message?pError.message:pError));}});}}catch(pError){if(this.log&&this.log.warn){this.log.warn('Mermaid re-render failed: '+pError.message);}}}/**
	 * Render any Mermaid diagram blocks in the content area.
	 * Mermaid blocks are `<pre class="mermaid">` elements produced by parseMarkdown.
	 *
	 * @param {string} [pContainerID] - The container element ID (defaults to 'Pict-Content-Body')
	 */renderMermaidDiagrams(pContainerID){if(typeof mermaid==='undefined'){return;}let tmpContainerID=pContainerID||'Pict-Content-Body';let tmpContentBody=document.getElementById(tmpContainerID);if(!tmpContentBody){return;}let tmpMermaidElements=tmpContentBody.querySelectorAll('pre.mermaid');if(tmpMermaidElements.length<1){return;}// First-time setup: apply theme variables and subscribe to
// theme apply events so diagrams re-render on theme change.
this._initializeMermaidTheme();this._subscribeToThemeChanges();// Cache each diagram's source on the element so theme-change
// re-renders can restore it. Mermaid replaces textContent with
// the rendered SVG during run(), so we lose the source unless
// we stash it here first.
for(let i=0;i<tmpMermaidElements.length;i++){let tmpEl=tmpMermaidElements[i];if(!tmpEl.hasAttribute('data-mermaid-source')){tmpEl.setAttribute('data-mermaid-source',tmpEl.textContent);}}// mermaid.run() will process all pre.mermaid elements in the container.
// It returns a promise; once it resolves the inner SVG exists and we
// can tag the diagrams as fullscreen-clickable.
try{let tmpResult=mermaid.run({nodes:tmpMermaidElements});if(tmpResult&&typeof tmpResult.then==='function'){tmpResult.then(()=>{this.enableFullscreenViewers(tmpContainerID,{onlyMermaid:true});}).catch(pError=>{this.log.error('Mermaid rendering error: '+(pError&&pError.message?pError.message:pError));});}else{// Synchronous fallback (older mermaid)
this.enableFullscreenViewers(tmpContainerID,{onlyMermaid:true});}}catch(pError){this.log.error('Mermaid rendering error: '+pError.message);}}/**
	 * Render KaTeX inline and display math elements in the content area.
	 * Inline: `<span class="pict-content-katex-inline">`
	 * Display: `<div class="pict-content-katex-display">`
	 *
	 * @param {string} [pContainerID] - The container element ID (defaults to 'Pict-Content-Body')
	 */renderKaTeXEquations(pContainerID){if(typeof katex==='undefined'){return;}let tmpContainerID=pContainerID||'Pict-Content-Body';let tmpContentBody=document.getElementById(tmpContainerID);if(!tmpContentBody){return;}// Render inline math
let tmpInlineElements=tmpContentBody.querySelectorAll('.pict-content-katex-inline');for(let i=0;i<tmpInlineElements.length;i++){try{katex.render(tmpInlineElements[i].textContent,tmpInlineElements[i],{throwOnError:false,displayMode:false});}catch(pError){this.log.warn('KaTeX inline error: '+pError.message);}}// Render display math
let tmpDisplayElements=tmpContentBody.querySelectorAll('.pict-content-katex-display');for(let i=0;i<tmpDisplayElements.length;i++){try{katex.render(tmpDisplayElements[i].textContent,tmpDisplayElements[i],{throwOnError:false,displayMode:true});}catch(pError){this.log.warn('KaTeX display error: '+pError.message);}}}/**
	 * Walk the freshly-rendered content and tag images, mermaid diagrams,
	 * and fenced code blocks so they're click-to-fullscreen.  Also installs
	 * a single delegated click listener on the container the first time it
	 * is called for that container.
	 *
	 * @param {string} [pContainerID] - The container element ID (defaults to 'Pict-Content-Body')
	 * @param {Object} [pOptions] - { skipMermaid: bool, onlyMermaid: bool }
	 */enableFullscreenViewers(pContainerID,pOptions){let tmpContainerID=pContainerID||'Pict-Content-Body';let tmpContentBody=document.getElementById(tmpContainerID);if(!tmpContentBody){return;}let tmpOptions=pOptions||{};if(!tmpOptions.onlyMermaid){// Images
let tmpImages=tmpContentBody.querySelectorAll('img:not([data-fullscreen-source])');for(let i=0;i<tmpImages.length;i++){let tmpImg=tmpImages[i];tmpImg.setAttribute('data-fullscreen-source','image');let tmpAlt=tmpImg.getAttribute('alt');if(!tmpAlt){let tmpSrc=tmpImg.getAttribute('src')||'';tmpAlt=tmpSrc.split('/').pop().split('?')[0]||'Image';}tmpImg.setAttribute('data-fullscreen-title',tmpAlt);}// Code wraps (fenced blocks): do NOT tag for click-to-fullscreen —
// that would conflict with text selection for copy/paste.
// Instead wrap each in a container with hover-revealed action
// buttons (fullscreen + copy) floating to the right.
let tmpCodeWraps=tmpContentBody.querySelectorAll('.pict-content-code-wrap:not([data-code-actions-wired])');for(let i=0;i<tmpCodeWraps.length;i++){this._wireCodeActions(tmpCodeWraps[i]);}}if(!tmpOptions.skipMermaid){// Mermaid diagrams (after mermaid.run() has replaced the inner pre)
let tmpMermaid=tmpContentBody.querySelectorAll('pre.mermaid:not([data-fullscreen-source])');for(let i=0;i<tmpMermaid.length;i++){let tmpPre=tmpMermaid[i];// Only tag once mermaid has actually rendered an svg into it
if(tmpPre.querySelector('svg')){tmpPre.setAttribute('data-fullscreen-source','mermaid');tmpPre.setAttribute('data-fullscreen-title','Mermaid Diagram');}}}// Install delegated click listener once per container.
if(!tmpContentBody.__pictFullscreenWired){tmpContentBody.__pictFullscreenWired=true;tmpContentBody.addEventListener('click',pEvent=>{let tmpTarget=pEvent.target;while(tmpTarget&&tmpTarget!==tmpContentBody&&!tmpTarget.hasAttribute('data-fullscreen-source')){tmpTarget=tmpTarget.parentElement;}if(tmpTarget&&tmpTarget!==tmpContentBody&&tmpTarget.hasAttribute('data-fullscreen-source')){pEvent.preventDefault();this._openFullscreen(tmpTarget);}});}}/**
	 * Wrap a fenced code block in a container that holds the existing
	 * .pict-content-code-wrap plus a hover-revealed action column with
	 * fullscreen + copy buttons.  The action column is sticky-positioned
	 * so it follows the page scroll while the user is alongside a long
	 * code block.
	 *
	 * @param {HTMLElement} pCodeWrap - The .pict-content-code-wrap element
	 */_wireCodeActions(pCodeWrap){if(!pCodeWrap||pCodeWrap.hasAttribute('data-code-actions-wired')){return;}pCodeWrap.setAttribute('data-code-actions-wired','true');// Determine the fullscreen title from the language tag, if any.
let tmpCodeEl=pCodeWrap.querySelector('code[class*="language-"]');let tmpLang='Code';if(tmpCodeEl){let tmpMatch=(tmpCodeEl.getAttribute('class')||'').match(/language-(\S+)/);if(tmpMatch){tmpLang=tmpMatch[1]+' code';}}pCodeWrap.setAttribute('data-code-language',tmpLang);// Build the wrapping container.
let tmpContainer=document.createElement('div');tmpContainer.className='pict-content-code-container';let tmpActions=document.createElement('div');tmpActions.className='pict-content-code-actions';tmpActions.setAttribute('aria-hidden','false');let tmpFullscreenBtn=document.createElement('button');tmpFullscreenBtn.type='button';tmpFullscreenBtn.className='pict-content-code-action-btn';tmpFullscreenBtn.setAttribute('aria-label','Open code in fullscreen');tmpFullscreenBtn.setAttribute('title','Open in fullscreen');tmpFullscreenBtn.innerHTML='<svg viewBox="0 0 16 16" aria-hidden="true"><polyline points="3 6 3 3 6 3"></polyline><polyline points="13 6 13 3 10 3"></polyline><polyline points="3 10 3 13 6 13"></polyline><polyline points="13 10 13 13 10 13"></polyline></svg>';let tmpCopyBtn=document.createElement('button');tmpCopyBtn.type='button';tmpCopyBtn.className='pict-content-code-action-btn';tmpCopyBtn.setAttribute('aria-label','Copy code to clipboard');tmpCopyBtn.setAttribute('title','Copy code');tmpCopyBtn.innerHTML='<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="5" y="5" width="9" height="9" rx="1.25"></rect><path d="M11 5V3.25A1.25 1.25 0 0 0 9.75 2H3.25A1.25 1.25 0 0 0 2 3.25v6.5A1.25 1.25 0 0 0 3.25 11H5"></path></svg>';tmpActions.appendChild(tmpFullscreenBtn);tmpActions.appendChild(tmpCopyBtn);// Insert the container in the place of the code wrap, then move the
// code wrap inside it followed by the actions column.
let tmpParent=pCodeWrap.parentNode;tmpParent.insertBefore(tmpContainer,pCodeWrap);tmpContainer.appendChild(pCodeWrap);tmpContainer.appendChild(tmpActions);// Click handlers
tmpFullscreenBtn.addEventListener('click',pEvent=>{pEvent.preventDefault();pEvent.stopPropagation();this._openCodeFullscreen(pCodeWrap);});tmpCopyBtn.addEventListener('click',pEvent=>{pEvent.preventDefault();pEvent.stopPropagation();this._copyCodeToClipboard(pCodeWrap,tmpCopyBtn);});}/**
	 * Open the fullscreen overlay for a fenced code block.  Reuses the
	 * same overlay singleton as image / mermaid.
	 */_openCodeFullscreen(pCodeWrap){let tmpOverlay=this._buildFullscreenOverlay();// Stamp the source attributes the overlay's open() expects.
pCodeWrap.setAttribute('data-fullscreen-source','code');pCodeWrap.setAttribute('data-fullscreen-title',pCodeWrap.getAttribute('data-code-language')||'Code');tmpOverlay.open(pCodeWrap);}/**
	 * Copy the raw text of a code block to the clipboard and briefly flash
	 * a "Copied!" state on the trigger button.
	 */_copyCodeToClipboard(pCodeWrap,pButton){let tmpCodeEl=pCodeWrap.querySelector('code');let tmpText=tmpCodeEl?tmpCodeEl.textContent:pCodeWrap.textContent;let fFlashOk=()=>{pButton.classList.add('is-copied');pButton.setAttribute('title','Copied!');setTimeout(()=>{pButton.classList.remove('is-copied');pButton.setAttribute('title','Copy code');},1400);};let fFlashFail=()=>{pButton.classList.add('is-copy-failed');pButton.setAttribute('title','Copy failed');setTimeout(()=>{pButton.classList.remove('is-copy-failed');pButton.setAttribute('title','Copy code');},1400);};try{if(navigator&&navigator.clipboard&&typeof navigator.clipboard.writeText==='function'){navigator.clipboard.writeText(tmpText).then(fFlashOk).catch(fFlashFail);return;}}catch(e){// fall through to legacy fallback
}// Legacy fallback for non-secure contexts.
try{let tmpTextarea=document.createElement('textarea');tmpTextarea.value=tmpText;tmpTextarea.style.position='fixed';tmpTextarea.style.opacity='0';document.body.appendChild(tmpTextarea);tmpTextarea.select();let tmpOk=document.execCommand('copy');document.body.removeChild(tmpTextarea);if(tmpOk){fFlashOk();}else{fFlashFail();}}catch(e){fFlashFail();}}/**
	 * Lazily build the singleton fullscreen overlay element and attach it
	 * to <body>.  Returns the existing instance if already built.
	 */_buildFullscreenOverlay(){if(PictContentView._FullscreenOverlay){return PictContentView._FullscreenOverlay;}let tmpOverlay=document.createElement('div');tmpOverlay.className='pict-fullscreen-overlay';tmpOverlay.setAttribute('role','dialog');tmpOverlay.setAttribute('aria-modal','true');tmpOverlay.setAttribute('aria-labelledby','pict-fullscreen-title');tmpOverlay.setAttribute('hidden','');tmpOverlay.innerHTML=''+'<div class="pict-fullscreen-titlebar">'+'<span class="pict-fullscreen-title" id="pict-fullscreen-title"></span>'+'<div class="pict-fullscreen-controls">'+'<button type="button" class="pict-fullscreen-btn" data-action="zoom-out" aria-label="Zoom out" title="Zoom out"><svg viewBox="0 0 16 16" aria-hidden="true"><line x1="3" y1="8" x2="13" y2="8"></line></svg></button>'+'<button type="button" class="pict-fullscreen-btn" data-action="zoom-reset" aria-label="Reset zoom" title="Reset zoom"><svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="5"></circle><line x1="8" y1="5" x2="8" y2="11"></line><line x1="5" y1="8" x2="11" y2="8"></line></svg></button>'+'<button type="button" class="pict-fullscreen-btn" data-action="zoom-in" aria-label="Zoom in" title="Zoom in"><svg viewBox="0 0 16 16" aria-hidden="true"><line x1="3" y1="8" x2="13" y2="8"></line><line x1="8" y1="3" x2="8" y2="13"></line></svg></button>'+'<button type="button" class="pict-fullscreen-btn pict-fullscreen-close" data-action="close" aria-label="Close" title="Close (Esc)"><svg viewBox="0 0 16 16" aria-hidden="true"><line x1="4" y1="4" x2="12" y2="12"></line><line x1="12" y1="4" x2="4" y2="12"></line></svg></button>'+'</div>'+'</div>'+'<div class="pict-fullscreen-stage">'+'<div class="pict-fullscreen-content"></div>'+'</div>';document.body.appendChild(tmpOverlay);let tmpState={scale:1,translateX:0,translateY:0,isPanning:false,didPan:false,currentKind:'',panStartX:0,panStartY:0,panOrigX:0,panOrigY:0,pinchInitialDistance:0,pinchInitialScale:1};let tmpStage=tmpOverlay.querySelector('.pict-fullscreen-stage');let tmpContent=tmpOverlay.querySelector('.pict-fullscreen-content');let tmpTitleEl=tmpOverlay.querySelector('.pict-fullscreen-title');let fApplyTransform=()=>{tmpContent.style.transform='translate('+tmpState.translateX+'px, '+tmpState.translateY+'px) scale('+tmpState.scale+')';tmpStage.classList.toggle('is-zoomed',tmpState.scale>1.001);};let fClampScale=pValue=>{if(pValue<0.5)return 0.5;if(pValue>8)return 8;return pValue;};let fZoomAt=(pNewScale,pAnchorClientX,pAnchorClientY)=>{let tmpClamped=fClampScale(pNewScale);let tmpStageRect=tmpStage.getBoundingClientRect();let tmpAnchorX=pAnchorClientX!==undefined?pAnchorClientX:tmpStageRect.left+tmpStageRect.width/2;let tmpAnchorY=pAnchorClientY!==undefined?pAnchorClientY:tmpStageRect.top+tmpStageRect.height/2;// Convert anchor into the local coordinate of the content (which is centered)
let tmpCenterX=tmpStageRect.left+tmpStageRect.width/2;let tmpCenterY=tmpStageRect.top+tmpStageRect.height/2;let tmpDX=tmpAnchorX-tmpCenterX;let tmpDY=tmpAnchorY-tmpCenterY;let tmpRatio=tmpClamped/tmpState.scale;tmpState.translateX=tmpDX-tmpRatio*(tmpDX-tmpState.translateX);tmpState.translateY=tmpDY-tmpRatio*(tmpDY-tmpState.translateY);tmpState.scale=tmpClamped;fApplyTransform();};let fResetTransform=()=>{tmpState.scale=1;tmpState.translateX=0;tmpState.translateY=0;fApplyTransform();};let fClose=()=>{tmpOverlay.setAttribute('hidden','');tmpContent.innerHTML='';fResetTransform();document.documentElement.style.removeProperty('overflow');document.removeEventListener('keydown',fKeydown);};let fKeydown=pEvent=>{if(pEvent.key==='Escape'){pEvent.preventDefault();fClose();}else if(pEvent.key==='+'||pEvent.key==='='){pEvent.preventDefault();fZoomAt(tmpState.scale+0.25);}else if(pEvent.key==='-'||pEvent.key==='_'){pEvent.preventDefault();fZoomAt(tmpState.scale-0.25);}else if(pEvent.key==='0'){pEvent.preventDefault();fResetTransform();}};// Backdrop click closes (only when clicking the backdrop itself or
// the stage area, not the inner content).  Suppress if a
// drag-to-pan just finished — the pointerup that ended the pan
// also fires a click event which we must ignore.
tmpOverlay.addEventListener('click',pEvent=>{if(tmpState.didPan){tmpState.didPan=false;return;}if(pEvent.target===tmpOverlay||pEvent.target===tmpStage){fClose();}});// Toolbar buttons
tmpOverlay.querySelectorAll('[data-action]').forEach(pBtn=>{pBtn.addEventListener('click',pEvent=>{pEvent.stopPropagation();let tmpAction=pBtn.getAttribute('data-action');if(tmpAction==='close'){fClose();}else if(tmpAction==='zoom-in'){fZoomAt(tmpState.scale+0.25);}else if(tmpAction==='zoom-out'){fZoomAt(tmpState.scale-0.25);}else if(tmpAction==='zoom-reset'){fResetTransform();}});});// Wheel zoom — for images and mermaid diagrams.
// For code blocks, let the browser handle native scrolling
// so the user can scroll through long code.
tmpStage.addEventListener('wheel',pEvent=>{if(tmpState.currentKind==='code'){return;}pEvent.preventDefault();let tmpDelta=-pEvent.deltaY;let tmpStep=(tmpDelta>0?1:-1)*0.15;fZoomAt(tmpState.scale+tmpStep,pEvent.clientX,pEvent.clientY);},{passive:false});// Drag-to-pan when zoomed (not for code blocks — they scroll natively)
tmpStage.addEventListener('pointerdown',pEvent=>{if(tmpState.currentKind==='code'){return;}if(tmpState.scale<=1.001){return;}if(pEvent.target.closest('.pict-fullscreen-controls')){return;}tmpState.isPanning=true;tmpState.panStartX=pEvent.clientX;tmpState.panStartY=pEvent.clientY;tmpState.panOrigX=tmpState.translateX;tmpState.panOrigY=tmpState.translateY;tmpStage.setPointerCapture(pEvent.pointerId);tmpStage.classList.add('is-panning');});tmpStage.addEventListener('pointermove',pEvent=>{if(!tmpState.isPanning){return;}tmpState.translateX=tmpState.panOrigX+(pEvent.clientX-tmpState.panStartX);tmpState.translateY=tmpState.panOrigY+(pEvent.clientY-tmpState.panStartY);fApplyTransform();});let fEndPan=pEvent=>{if(!tmpState.isPanning){return;}tmpState.isPanning=false;// Flag that a pan just ended so the subsequent click event
// (which the browser fires after pointerup) does not close
// the overlay via the backdrop-close handler.
tmpState.didPan=true;tmpStage.classList.remove('is-panning');try{tmpStage.releasePointerCapture(pEvent.pointerId);}catch(e){}};tmpStage.addEventListener('pointerup',fEndPan);tmpStage.addEventListener('pointercancel',fEndPan);// Touch pinch zoom
let tmpActiveTouches={};tmpStage.addEventListener('touchstart',pEvent=>{for(let i=0;i<pEvent.touches.length;i++){let tmpT=pEvent.touches[i];tmpActiveTouches[tmpT.identifier]={x:tmpT.clientX,y:tmpT.clientY};}if(pEvent.touches.length===2){let tmpA=pEvent.touches[0];let tmpB=pEvent.touches[1];let tmpDX=tmpB.clientX-tmpA.clientX;let tmpDY=tmpB.clientY-tmpA.clientY;tmpState.pinchInitialDistance=Math.sqrt(tmpDX*tmpDX+tmpDY*tmpDY);tmpState.pinchInitialScale=tmpState.scale;}},{passive:true});tmpStage.addEventListener('touchmove',pEvent=>{if(pEvent.touches.length===2&&tmpState.pinchInitialDistance>0){pEvent.preventDefault();let tmpA=pEvent.touches[0];let tmpB=pEvent.touches[1];let tmpDX=tmpB.clientX-tmpA.clientX;let tmpDY=tmpB.clientY-tmpA.clientY;let tmpDist=Math.sqrt(tmpDX*tmpDX+tmpDY*tmpDY);let tmpRatio=tmpDist/tmpState.pinchInitialDistance;let tmpMidX=(tmpA.clientX+tmpB.clientX)/2;let tmpMidY=(tmpA.clientY+tmpB.clientY)/2;fZoomAt(tmpState.pinchInitialScale*tmpRatio,tmpMidX,tmpMidY);}},{passive:false});tmpStage.addEventListener('touchend',()=>{tmpActiveTouches={};tmpState.pinchInitialDistance=0;});PictContentView._FullscreenOverlay={element:tmpOverlay,content:tmpContent,titleEl:tmpTitleEl,state:tmpState,open:pSourceEl=>{let tmpTitle=pSourceEl.getAttribute('data-fullscreen-title')||'';tmpTitleEl.textContent=tmpTitle;tmpContent.innerHTML='';let tmpKind=pSourceEl.getAttribute('data-fullscreen-source');tmpState.currentKind=tmpKind||'';let tmpClone;if(tmpKind==='mermaid'){let tmpSvg=pSourceEl.querySelector('svg');if(tmpSvg){tmpClone=tmpSvg.cloneNode(true);tmpClone.classList.add('pict-fullscreen-mermaid-svg');// Drop mermaid's inline max-width / width / height style so the
// fullscreen CSS rule actually controls the size.
tmpClone.removeAttribute('style');tmpClone.removeAttribute('width');tmpClone.removeAttribute('height');}else{tmpClone=pSourceEl.cloneNode(true);}}else if(tmpKind==='image'){tmpClone=pSourceEl.cloneNode(true);tmpClone.classList.add('pict-fullscreen-img');}else{tmpClone=pSourceEl.cloneNode(true);tmpClone.classList.add('pict-fullscreen-codewrap');}tmpContent.appendChild(tmpClone);// Hide zoom controls for code blocks (they scroll natively)
let tmpZoomBtns=tmpOverlay.querySelectorAll('[data-action="zoom-in"], [data-action="zoom-out"], [data-action="zoom-reset"]');for(let i=0;i<tmpZoomBtns.length;i++){tmpZoomBtns[i].style.display=tmpKind==='code'?'none':'';}fResetTransform();tmpOverlay.removeAttribute('hidden');document.documentElement.style.overflow='hidden';document.addEventListener('keydown',fKeydown);},close:fClose};return PictContentView._FullscreenOverlay;}/**
	 * Open the fullscreen overlay for a tagged source element.
	 */_openFullscreen(pSourceEl){let tmpOverlay=this._buildFullscreenOverlay();tmpOverlay.open(pSourceEl);}/**
	 * Show a loading indicator.
	 *
	 * @param {string} [pMessage] - Loading message (defaults to 'Loading content...')
	 * @param {string} [pContainerID] - The container element ID (defaults to 'Pict-Content-Body')
	 */showLoading(pMessage,pContainerID){let tmpContainerID=pContainerID||'Pict-Content-Body';let tmpMessage=pMessage||'Loading content...';this.pict.ContentAssignment.assignContent('#'+tmpContainerID,'<div class="pict-content-loading">'+tmpMessage+'</div>');}}module.exports=PictContentView;module.exports.default_configuration=_ViewConfiguration;},{"pict-view":23}],22:[function(require,module,exports){module.exports={"name":"pict-view","version":"1.0.68","description":"Pict View Base Class","main":"source/Pict-View.js","scripts":{"test":"npx quack test","tests":"npx quack test -g","start":"node source/Pict-View.js","coverage":"npx quack coverage","build":"npx quack build","docker-dev-build":"docker build ./ -f Dockerfile_LUXURYCode -t pict-view-image:local","docker-dev-run":"docker run -it -d --name pict-view-dev -p 30001:8080 -p 38086:8086 -v \"$PWD/.config:/home/coder/.config\"  -v \"$PWD:/home/coder/pict-view\" -u \"$(id -u):$(id -g)\" -e \"DOCKER_USER=$USER\" pict-view-image:local","docker-dev-shell":"docker exec -it pict-view-dev /bin/bash","types":"tsc -p .","lint":"eslint source/**"},"types":"types/source/Pict-View.d.ts","repository":{"type":"git","url":"git+https://github.com/fable-retold/pict-view.git"},"author":"steven velozo <steven@velozo.com>","license":"MIT","bugs":{"url":"https://github.com/fable-retold/pict-view/issues"},"homepage":"https://github.com/fable-retold/pict-view#readme","devDependencies":{"@eslint/js":"^9.39.1","browser-env":"^3.3.0","eslint":"^9.39.1","pict":"^1.0.363","quackage":"^1.0.65","typescript":"^5.9.3"},"mocha":{"diff":true,"extension":["js"],"package":"./package.json","reporter":"spec","slow":"75","timeout":"5000","ui":"tdd","watch-files":["source/**/*.js","test/**/*.js"],"watch-ignore":["lib/vendor"]},"dependencies":{"fable":"^3.1.67","fable-serviceproviderbase":"^3.0.19"}};},{}],23:[function(require,module,exports){const libFableServiceBase=require('fable-serviceproviderbase');const libPackage=require('../package.json');const defaultPictViewSettings={DefaultRenderable:false,DefaultDestinationAddress:false,DefaultTemplateRecordAddress:false,ViewIdentifier:false,// If this is set to true, when the App initializes this will.
// After the App initializes, initialize will be called as soon as it's added.
AutoInitialize:true,AutoInitializeOrdinal:0,// If this is set to true, when the App autorenders (on load) this will.
// After the App initializes, render will be called as soon as it's added.
AutoRender:true,AutoRenderOrdinal:0,AutoSolveWithApp:true,AutoSolveOrdinal:0,CSSHash:false,CSS:false,CSSProvider:false,CSSPriority:500,Templates:[],DefaultTemplates:[],Renderables:[],Manifests:{}};/** @typedef {(error?: Error) => void} ErrorCallback *//** @typedef {number | boolean} PictTimestamp *//**
 * @typedef {'replace' | 'append' | 'prepend' | 'append_once' | 'virtual-assignment'} RenderMethod
 *//**
 * @typedef {Object} Renderable
 *
 * @property {string} RenderableHash - A unique hash for the renderable.
 * @property {string} TemplateHash - The hash of the template to use for rendering this renderable.
 * @property {string} [DefaultTemplateRecordAddress] - The default address for resolving the data record for this renderable.
 * @property {string} [ContentDestinationAddress] - The default address (DOM CSS selector) for rendering the content of this renderable.
 * @property {RenderMethod} [RenderMethod=replace] - The method to use when projecting the renderable to the DOM ('replace', 'append', 'prepend', 'append_once', 'virtual-assignment').
 * @property {string} [TestAddress] - The address to use for testing the renderable.
 * @property {string} [TransactionHash] - The transaction hash for the root renderable.
 * @property {string} [RootRenderableViewHash] - The hash of the root renderable.
 * @property {string} [Content] - The rendered content for this renderable, if applicable.
 *//**
 * Represents a view in the Pict ecosystem.
 */class PictView extends libFableServiceBase{/**
	 * @param {any} pFable - The Fable object that this service is attached to.
	 * @param {any} [pOptions] - (optional) The options for this service.
	 * @param {string} [pServiceHash] - (optional) The hash of the service.
	 */constructor(pFable,pOptions,pServiceHash){// Intersect default options, parent constructor, service information
let tmpOptions=Object.assign({},JSON.parse(JSON.stringify(defaultPictViewSettings)),pOptions);super(pFable,tmpOptions,pServiceHash);//FIXME: add types to fable and ancillaries
/** @type {any} */this.fable;/** @type {any} */this.options;/** @type {String} */this.UUID;/** @type {String} */this.Hash;/** @type {any} */this.log;const tmpHashIsUUID=this.Hash===this.UUID;//NOTE: since many places are using the view UUID as the HTML element ID, we prefix it to avoid starting with a number
this.UUID="V-".concat(this.UUID);if(tmpHashIsUUID){this.Hash=this.UUID;}if(!this.options.ViewIdentifier){this.options.ViewIdentifier="AutoViewID-".concat(this.fable.getUUID());}this.serviceType='PictView';/** @type {Record<string, any>} */this._Package=libPackage;// Convenience and consistency naming
/** @type {import('pict') & { log: any, instantiateServiceProviderWithoutRegistration: (hash: String) => any, instantiateServiceProviderIfNotExists: (hash: string) => any, TransactionTracking: import('pict/types/source/services/Fable-Service-TransactionTracking') }} */this.pict=this.fable;// Wire in the essential Pict application state
this.AppData=this.pict.AppData;this.Bundle=this.pict.Bundle;/** @type {PictTimestamp} */this.initializeTimestamp=false;/** @type {PictTimestamp} */this.lastSolvedTimestamp=false;/** @type {PictTimestamp} */this.lastRenderedTimestamp=false;/** @type {PictTimestamp} */this.lastMarshalFromViewTimestamp=false;/** @type {PictTimestamp} */this.lastMarshalToViewTimestamp=false;this.pict.instantiateServiceProviderIfNotExists('TransactionTracking');// Load all templates from the array in the options
// Templates are in the form of {Hash:'Some-Template-Hash',Template:'Template content',Source:'TemplateSource'}
for(let i=0;i<this.options.Templates.length;i++){let tmpTemplate=this.options.Templates[i];if(!('Hash'in tmpTemplate)||!('Template'in tmpTemplate)){this.log.error("PictView [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.ViewIdentifier," could not load Template ").concat(i," in the options array."),tmpTemplate);}else{if(!tmpTemplate.Source){tmpTemplate.Source="PictView [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.ViewIdentifier," options object.");}this.pict.TemplateProvider.addTemplate(tmpTemplate.Hash,tmpTemplate.Template,tmpTemplate.Source);}}// Load all default templates from the array in the options
// Templates are in the form of {Prefix:'',Postfix:'-List-Row',Template:'Template content',Source:'TemplateSourceString'}
for(let i=0;i<this.options.DefaultTemplates.length;i++){let tmpDefaultTemplate=this.options.DefaultTemplates[i];if(!('Postfix'in tmpDefaultTemplate)||!('Template'in tmpDefaultTemplate)){this.log.error("PictView [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.ViewIdentifier," could not load Default Template ").concat(i," in the options array."),tmpDefaultTemplate);}else{if(!tmpDefaultTemplate.Source){tmpDefaultTemplate.Source="PictView [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.ViewIdentifier," options object.");}this.pict.TemplateProvider.addDefaultTemplate(tmpDefaultTemplate.Prefix,tmpDefaultTemplate.Postfix,tmpDefaultTemplate.Template,tmpDefaultTemplate.Source);}}// Load the CSS if it's available
if(this.options.CSS){let tmpCSSHash=this.options.CSSHash?this.options.CSSHash:"View-".concat(this.options.ViewIdentifier);let tmpCSSProvider=this.options.CSSProvider?this.options.CSSProvider:tmpCSSHash;this.pict.CSSMap.addCSS(tmpCSSHash,this.options.CSS,tmpCSSProvider,this.options.CSSPriority);}// Load all renderables
// Renderables are launchable renderable instructions with templates
// They look as such: {Identifier:'ContentEntry', TemplateHash:'Content-Entry-Section-Main', ContentDestinationAddress:'#ContentSection', RecordAddress:'AppData.Content.DefaultText', ManifestTransformation:'ManyfestHash', ManifestDestinationAddress:'AppData.Content.DataToTransformContent'}
// The only parts that are necessary are Identifier and Template
// A developer can then do render('ContentEntry') and it just kinda works.  Or they can override the ContentDestinationAddress
/** @type {Record<String, Renderable>} */this.renderables={};for(let i=0;i<this.options.Renderables.length;i++){/** @type {Renderable} */let tmpRenderable=this.options.Renderables[i];this.addRenderable(tmpRenderable);}}/**
	 * Adds a renderable to the view.
	 *
	 * @param {string | Renderable} pRenderableHash - The hash of the renderable, or a renderable object.
	 * @param {string} [pTemplateHash] - (optional) The hash of the template for the renderable.
	 * @param {string} [pDefaultTemplateRecordAddress] - (optional) The default data address for the template.
	 * @param {string} [pDefaultDestinationAddress] - (optional) The default destination address for the renderable.
	 * @param {RenderMethod} [pRenderMethod=replace] - (optional) The method to use when rendering the renderable (ex. 'replace').
	 */addRenderable(pRenderableHash,pTemplateHash,pDefaultTemplateRecordAddress,pDefaultDestinationAddress,pRenderMethod){/** @type {Renderable} */let tmpRenderable;if(typeof pRenderableHash=='object'){// The developer passed in the renderable as an object.
// Use theirs instead!
tmpRenderable=pRenderableHash;}else{/** @type {RenderMethod} */let tmpRenderMethod=typeof pRenderMethod!=='string'?pRenderMethod:'replace';tmpRenderable={RenderableHash:pRenderableHash,TemplateHash:pTemplateHash,DefaultTemplateRecordAddress:pDefaultTemplateRecordAddress,ContentDestinationAddress:pDefaultDestinationAddress,RenderMethod:tmpRenderMethod};}if(typeof tmpRenderable.RenderableHash!='string'||typeof tmpRenderable.TemplateHash!='string'){this.log.error("PictView [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.ViewIdentifier," could not load Renderable; RenderableHash or TemplateHash are invalid."),tmpRenderable);}else{if(this.pict.LogNoisiness>0){this.log.trace("PictView [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.ViewIdentifier," adding renderable [").concat(tmpRenderable.RenderableHash,"] pointed to template ").concat(tmpRenderable.TemplateHash,"."));}this.renderables[tmpRenderable.RenderableHash]=tmpRenderable;}}/* -------------------------------------------------------------------------- *//*                        Code Section: Initialization                        *//* -------------------------------------------------------------------------- *//**
	 * Lifecycle hook that triggers before the view is initialized.
	 */onBeforeInitialize(){if(this.pict.LogNoisiness>3){this.log.trace("PictView [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.ViewIdentifier," onBeforeInitialize:"));}return true;}/**
	 * Lifecycle hook that triggers before the view is initialized (async flow).
	 *
	 * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
	 */onBeforeInitializeAsync(fCallback){this.onBeforeInitialize();return fCallback();}/**
	 * Lifecycle hook that triggers when the view is initialized.
	 */onInitialize(){if(this.pict.LogNoisiness>3){this.log.trace("PictView [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.ViewIdentifier," onInitialize:"));}return true;}/**
	 * Lifecycle hook that triggers when the view is initialized (async flow).
	 *
	 * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
	 */onInitializeAsync(fCallback){this.onInitialize();return fCallback();}/**
	 * Performs view initialization.
	 */initialize(){if(this.pict.LogControlFlow){this.log.trace("PICT-ControlFlow VIEW [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.ViewIdentifier," initialize:"));}if(!this.initializeTimestamp){this.onBeforeInitialize();this.onInitialize();this.onAfterInitialize();this.initializeTimestamp=this.pict.log.getTimeStamp();return true;}else{this.log.warn("PictView [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.ViewIdentifier," initialize called but initialization is already completed.  Aborting."));return false;}}/**
	 * Performs view initialization (async flow).
	 *
	 * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
	 */initializeAsync(fCallback){if(this.pict.LogControlFlow){this.log.trace("PICT-ControlFlow VIEW [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.ViewIdentifier," initializeAsync:"));}if(!this.initializeTimestamp){let tmpAnticipate=this.pict.instantiateServiceProviderWithoutRegistration('Anticipate');if(this.pict.LogNoisiness>0){this.log.info("PictView [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.ViewIdentifier," beginning initialization..."));}tmpAnticipate.anticipate(this.onBeforeInitializeAsync.bind(this));tmpAnticipate.anticipate(this.onInitializeAsync.bind(this));tmpAnticipate.anticipate(this.onAfterInitializeAsync.bind(this));tmpAnticipate.wait(/** @param {Error} pError */pError=>{if(pError){this.log.error("PictView [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.ViewIdentifier," initialization failed: ").concat(pError.message||pError),{stack:pError.stack});}this.initializeTimestamp=this.pict.log.getTimeStamp();if(this.pict.LogNoisiness>0){this.log.info("PictView [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.ViewIdentifier," initialization complete."));}return fCallback();});}else{this.log.warn("PictView [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.ViewIdentifier," async initialize called but initialization is already completed.  Aborting."));// TODO: Should this be an error?
return fCallback();}}onAfterInitialize(){if(this.pict.LogNoisiness>3){this.log.trace("PictView [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.ViewIdentifier," onAfterInitialize:"));}return true;}/**
	 * Lifecycle hook that triggers after the view is initialized (async flow).
	 *
	 * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
	 */onAfterInitializeAsync(fCallback){this.onAfterInitialize();return fCallback();}/* -------------------------------------------------------------------------- *//*                            Code Section: Render                            *//* -------------------------------------------------------------------------- *//**
	 * Lifecycle hook that triggers before the view is rendered.
	 *
	 * @param {Renderable} pRenderable - The renderable that will be rendered.
	 */onBeforeRender(pRenderable){// Overload this to mess with stuff before the content gets generated from the template
if(this.pict.LogNoisiness>3){this.log.trace("PictView [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.ViewIdentifier," onBeforeRender:"));}return true;}/**
	 * Lifecycle hook that triggers before the view is rendered (async flow).
	 *
	 * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
	 * @param {Renderable} pRenderable - The renderable that will be rendered.
	 */onBeforeRenderAsync(fCallback,pRenderable){this.onBeforeRender(pRenderable);return fCallback();}/**
	 * Lifecycle hook that triggers before the view is projected into the DOM.
	 *
	 * @param {Renderable} pRenderable - The renderable that will be projected.
	 */onBeforeProject(pRenderable){// Overload this to mess with stuff before the content gets generated from the template
if(this.pict.LogNoisiness>3){this.log.trace("PictView [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.ViewIdentifier," onBeforeProject:"));}return true;}/**
	 * Lifecycle hook that triggers before the view is projected into the DOM (async flow).
	 *
	 * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
	 * @param {Renderable} pRenderable - The renderable that will be projected.
	 */onBeforeProjectAsync(fCallback,pRenderable){this.onBeforeProject(pRenderable);return fCallback();}/**
	 * Builds the render options for a renderable.
	 *
	 * For DRY purposes on the three flavors of render.
	 *
	 * @param {string|ErrorCallback} [pRenderableHash] - The hash of the renderable to render.
	 * @param {string|ErrorCallback} [pRenderDestinationAddress] - The address where the renderable will be rendered.
	 * @param {string|object|ErrorCallback} [pTemplateRecordAddress] - The address of (or actual obejct) where the data for the template is stored.
	 */buildRenderOptions(pRenderableHash,pRenderDestinationAddress,pTemplateRecordAddress){let tmpRenderOptions={Valid:true};tmpRenderOptions.RenderableHash=typeof pRenderableHash==='string'?pRenderableHash:typeof this.options.DefaultRenderable=='string'?this.options.DefaultRenderable:false;if(!tmpRenderOptions.RenderableHash){this.log.error("PictView [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.ViewIdentifier," could not find a suitable RenderableHash ").concat(tmpRenderOptions.RenderableHash," (param ").concat(pRenderableHash,"because it is not a valid renderable."));tmpRenderOptions.Valid=false;}tmpRenderOptions.Renderable=this.renderables[tmpRenderOptions.RenderableHash];if(!tmpRenderOptions.Renderable){this.log.error("PictView [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.ViewIdentifier," could not render ").concat(tmpRenderOptions.RenderableHash," (param ").concat(pRenderableHash,") because it does not exist."));tmpRenderOptions.Valid=false;}tmpRenderOptions.DestinationAddress=typeof pRenderDestinationAddress==='string'?pRenderDestinationAddress:typeof tmpRenderOptions.Renderable.ContentDestinationAddress==='string'?tmpRenderOptions.Renderable.ContentDestinationAddress:typeof this.options.DefaultDestinationAddress==='string'?this.options.DefaultDestinationAddress:false;if(!tmpRenderOptions.DestinationAddress){this.log.error("PictView [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.ViewIdentifier," could not render ").concat(tmpRenderOptions.RenderableHash," (param ").concat(pRenderableHash,") because it does not have a valid destination address (param ").concat(pRenderDestinationAddress,")."));tmpRenderOptions.Valid=false;}if(typeof pTemplateRecordAddress==='object'){tmpRenderOptions.RecordAddress='Passed in as object';tmpRenderOptions.Record=pTemplateRecordAddress;}else{tmpRenderOptions.RecordAddress=typeof pTemplateRecordAddress==='string'?pTemplateRecordAddress:typeof tmpRenderOptions.Renderable.DefaultTemplateRecordAddress==='string'?tmpRenderOptions.Renderable.DefaultTemplateRecordAddress:typeof this.options.DefaultTemplateRecordAddress==='string'?this.options.DefaultTemplateRecordAddress:false;tmpRenderOptions.Record=typeof tmpRenderOptions.RecordAddress==='string'?this.pict.DataProvider.getDataByAddress(tmpRenderOptions.RecordAddress):undefined;}return tmpRenderOptions;}/**
	 * Assigns the content to the destination address.
	 *
	 * For DRY purposes on the three flavors of render.
	 *
	 * @param {Renderable} pRenderable - The renderable to render.
	 * @param {string} pRenderDestinationAddress - The address where the renderable will be rendered.
	 * @param {string} pContent - The content to render.
	 * @returns {boolean} - Returns true if the content was assigned successfully.
	 * @memberof PictView
	 */assignRenderContent(pRenderable,pRenderDestinationAddress,pContent){return this.pict.ContentAssignment.projectContent(pRenderable.RenderMethod,pRenderDestinationAddress,pContent,pRenderable.TestAddress);}/**
	 * Render a renderable from this view.
	 *
	 * @param {string} [pRenderableHash] - The hash of the renderable to render.
	 * @param {string} [pRenderDestinationAddress] - The address where the renderable will be rendered.
	 * @param {string|object} [pTemplateRecordAddress] - The address where the data for the template is stored.
	 * @param {Renderable} [pRootRenderable] - The root renderable for the render operation, if applicable.
	 * @return {boolean}
	 */render(pRenderableHash,pRenderDestinationAddress,pTemplateRecordAddress,pRootRenderable){return this.renderWithScope(this,pRenderableHash,pRenderDestinationAddress,pTemplateRecordAddress,pRootRenderable);}/**
	 * Render a renderable from this view, providing a specifici scope for the template.
	 *
	 * @param {any} pScope - The scope to use for the template rendering.
	 * @param {string} [pRenderableHash] - The hash of the renderable to render.
	 * @param {string} [pRenderDestinationAddress] - The address where the renderable will be rendered.
	 * @param {string|object} [pTemplateRecordAddress] - The address where the data for the template is stored.
	 * @param {Renderable} [pRootRenderable] - The root renderable for the render operation, if applicable.
	 * @return {boolean}
	 */renderWithScope(pScope,pRenderableHash,pRenderDestinationAddress,pTemplateRecordAddress,pRootRenderable){let tmpRenderableHash=typeof pRenderableHash==='string'?pRenderableHash:typeof this.options.DefaultRenderable=='string'?this.options.DefaultRenderable:false;if(!tmpRenderableHash){this.log.error("PictView [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.ViewIdentifier," could not render ").concat(tmpRenderableHash," (param ").concat(pRenderableHash,") because it is not a valid renderable."));return false;}/** @type {Renderable} */let tmpRenderable;if(tmpRenderableHash=='__Virtual'){tmpRenderable={RenderableHash:'__Virtual',TemplateHash:this.renderables[this.options.DefaultRenderable].TemplateHash,ContentDestinationAddress:typeof pRenderDestinationAddress==='string'?pRenderDestinationAddress:typeof tmpRenderable.ContentDestinationAddress==='string'?tmpRenderable.ContentDestinationAddress:typeof this.options.DefaultDestinationAddress==='string'?this.options.DefaultDestinationAddress:null,RenderMethod:'virtual-assignment',TransactionHash:pRootRenderable&&pRootRenderable.TransactionHash,RootRenderableViewHash:pRootRenderable&&pRootRenderable.RootRenderableViewHash};}else{tmpRenderable=Object.assign({},this.renderables[tmpRenderableHash]);tmpRenderable.ContentDestinationAddress=typeof pRenderDestinationAddress==='string'?pRenderDestinationAddress:typeof tmpRenderable.ContentDestinationAddress==='string'?tmpRenderable.ContentDestinationAddress:typeof this.options.DefaultDestinationAddress==='string'?this.options.DefaultDestinationAddress:null;}if(!tmpRenderable.TransactionHash){tmpRenderable.TransactionHash="ViewRender-V-".concat(this.options.ViewIdentifier,"-R-").concat(tmpRenderableHash,"-U-").concat(this.pict.getUUID());tmpRenderable.RootRenderableViewHash=this.Hash;this.pict.TransactionTracking.registerTransaction(tmpRenderable.TransactionHash);}if(!tmpRenderable){this.log.error("PictView [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.ViewIdentifier," could not render ").concat(tmpRenderableHash," (param ").concat(pRenderableHash,") because it does not exist."));return false;}if(!tmpRenderable.ContentDestinationAddress){this.log.error("PictView [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.ViewIdentifier," could not render ").concat(tmpRenderableHash," (param ").concat(pRenderableHash,") because it does not have a valid destination address."));return false;}let tmpRecordAddress;let tmpRecord;if(typeof pTemplateRecordAddress==='object'){tmpRecord=pTemplateRecordAddress;tmpRecordAddress='Passed in as object';}else{tmpRecordAddress=typeof pTemplateRecordAddress==='string'?pTemplateRecordAddress:typeof tmpRenderable.DefaultTemplateRecordAddress==='string'?tmpRenderable.DefaultTemplateRecordAddress:typeof this.options.DefaultTemplateRecordAddress==='string'?this.options.DefaultTemplateRecordAddress:false;tmpRecord=typeof tmpRecordAddress==='string'?this.pict.DataProvider.getDataByAddress(tmpRecordAddress):undefined;}// Execute the developer-overridable pre-render behavior
this.onBeforeRender(tmpRenderable);if(this.pict.LogControlFlow){this.log.trace("PICT-ControlFlow VIEW [".concat(this.UUID,"]::[").concat(this.Hash,"] Renderable[").concat(tmpRenderableHash,"] Destination[").concat(tmpRenderable.ContentDestinationAddress,"] TemplateRecordAddress[").concat(tmpRecordAddress,"] render:"));}if(this.pict.LogNoisiness>0){this.log.trace("PictView [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.ViewIdentifier," Beginning Render of Renderable[").concat(tmpRenderableHash,"] to Destination [").concat(tmpRenderable.ContentDestinationAddress,"]..."));}// Generate the content output from the template and data
tmpRenderable.Content=this.pict.parseTemplateByHash(tmpRenderable.TemplateHash,tmpRecord,null,[this],pScope,{RootRenderable:typeof pRootRenderable==='object'?pRootRenderable:tmpRenderable});if(this.pict.LogNoisiness>0){this.log.trace("PictView [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.ViewIdentifier," Assigning Renderable[").concat(tmpRenderableHash,"] content length ").concat(tmpRenderable.Content.length," to Destination [").concat(tmpRenderable.ContentDestinationAddress,"] using render method [").concat(tmpRenderable.RenderMethod,"]."));}this.onBeforeProject(tmpRenderable);this.onProject(tmpRenderable);if(tmpRenderable.RenderMethod!=='virtual-assignment'){this.onAfterProject(tmpRenderable);// Execute the developer-overridable post-render behavior
this.onAfterRender(tmpRenderable);}return true;}/**
	 * Render a renderable from this view.
	 *
	 * @param {string|ErrorCallback} [pRenderableHash] - The hash of the renderable to render.
	 * @param {string|ErrorCallback} [pRenderDestinationAddress] - The address where the renderable will be rendered.
	 * @param {string|object|ErrorCallback} [pTemplateRecordAddress] - The address where the data for the template is stored.
	 * @param {Renderable|ErrorCallback} [pRootRenderable] - The root renderable for the render operation, if applicable.
	 * @param {ErrorCallback} [fCallback] - The callback to call when the async operation is complete.
	 *
	 * @return {void}
	 */renderAsync(pRenderableHash,pRenderDestinationAddress,pTemplateRecordAddress,pRootRenderable,fCallback){return this.renderWithScopeAsync(this,pRenderableHash,pRenderDestinationAddress,pTemplateRecordAddress,pRootRenderable,fCallback);}/**
	 * Render a renderable from this view.
	 *
	 * @param {any} pScope - The scope to use for the template rendering.
	 * @param {string|ErrorCallback} [pRenderableHash] - The hash of the renderable to render.
	 * @param {string|ErrorCallback} [pRenderDestinationAddress] - The address where the renderable will be rendered.
	 * @param {string|object|ErrorCallback} [pTemplateRecordAddress] - The address where the data for the template is stored.
	 * @param {Renderable|ErrorCallback} [pRootRenderable] - The root renderable for the render operation, if applicable.
	 * @param {ErrorCallback} [fCallback] - The callback to call when the async operation is complete.
	 *
	 * @return {void}
	 */renderWithScopeAsync(pScope,pRenderableHash,pRenderDestinationAddress,pTemplateRecordAddress,pRootRenderable,fCallback){let tmpRenderableHash=typeof pRenderableHash==='string'?pRenderableHash:typeof this.options.DefaultRenderable=='string'?this.options.DefaultRenderable:false;// Allow the callback to be passed in as the last parameter no matter what
/** @type {ErrorCallback} */let tmpCallback=typeof fCallback==='function'?fCallback:typeof pTemplateRecordAddress==='function'?pTemplateRecordAddress:typeof pRenderDestinationAddress==='function'?pRenderDestinationAddress:typeof pRenderableHash==='function'?pRenderableHash:typeof pRootRenderable==='function'?pRootRenderable:null;if(!tmpCallback){this.log.warn("PictView [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," renderAsync was called without a valid callback.  A callback will be generated but this could lead to race conditions."));tmpCallback=pError=>{if(pError){this.log.error("PictView [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," renderAsync Auto Callback Error: ").concat(pError),pError);}};}if(!tmpRenderableHash){this.log.error("PictView [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.ViewIdentifier," could not asynchronously render ").concat(tmpRenderableHash," (param ").concat(pRenderableHash,"because it is not a valid renderable."));return tmpCallback(new Error("PictView [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.ViewIdentifier," could not asynchronously render ").concat(tmpRenderableHash," (param ").concat(pRenderableHash,"because it is not a valid renderable.")));}/** @type {Renderable} */let tmpRenderable;if(tmpRenderableHash=='__Virtual'){tmpRenderable={RenderableHash:'__Virtual',TemplateHash:this.renderables[this.options.DefaultRenderable].TemplateHash,ContentDestinationAddress:typeof pRenderDestinationAddress==='string'?pRenderDestinationAddress:typeof this.options.DefaultDestinationAddress==='string'?this.options.DefaultDestinationAddress:null,RenderMethod:'virtual-assignment',TransactionHash:pRootRenderable&&typeof pRootRenderable!=='function'&&pRootRenderable.TransactionHash,RootRenderableViewHash:pRootRenderable&&typeof pRootRenderable!=='function'&&pRootRenderable.RootRenderableViewHash};}else{tmpRenderable=Object.assign({},this.renderables[tmpRenderableHash]);tmpRenderable.ContentDestinationAddress=typeof pRenderDestinationAddress==='string'?pRenderDestinationAddress:typeof tmpRenderable.ContentDestinationAddress==='string'?tmpRenderable.ContentDestinationAddress:typeof this.options.DefaultDestinationAddress==='string'?this.options.DefaultDestinationAddress:null;}if(!tmpRenderable.TransactionHash){tmpRenderable.TransactionHash="ViewRender-V-".concat(this.options.ViewIdentifier,"-R-").concat(tmpRenderableHash,"-U-").concat(this.pict.getUUID());tmpRenderable.RootRenderableViewHash=this.Hash;this.pict.TransactionTracking.registerTransaction(tmpRenderable.TransactionHash);}if(!tmpRenderable){this.log.error("PictView [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.ViewIdentifier," could not render ").concat(tmpRenderableHash," (param ").concat(pRenderableHash,") because it does not exist."));return tmpCallback(new Error("PictView [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.ViewIdentifier," could not render ").concat(tmpRenderableHash," (param ").concat(pRenderableHash,") because it does not exist.")));}if(!tmpRenderable.ContentDestinationAddress){this.log.error("PictView [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.ViewIdentifier," could not render ").concat(tmpRenderableHash," (param ").concat(pRenderableHash,") because it does not have a valid destination address."));return tmpCallback(new Error("Could not render ".concat(tmpRenderableHash)));}let tmpRecordAddress;let tmpRecord;if(typeof pTemplateRecordAddress==='object'){tmpRecord=pTemplateRecordAddress;tmpRecordAddress='Passed in as object';}else{tmpRecordAddress=typeof pTemplateRecordAddress==='string'?pTemplateRecordAddress:typeof tmpRenderable.DefaultTemplateRecordAddress==='string'?tmpRenderable.DefaultTemplateRecordAddress:typeof this.options.DefaultTemplateRecordAddress==='string'?this.options.DefaultTemplateRecordAddress:false;tmpRecord=typeof tmpRecordAddress==='string'?this.pict.DataProvider.getDataByAddress(tmpRecordAddress):undefined;}if(this.pict.LogControlFlow){this.log.trace("PICT-ControlFlow VIEW [".concat(this.UUID,"]::[").concat(this.Hash,"] Renderable[").concat(tmpRenderableHash,"] Destination[").concat(tmpRenderable.ContentDestinationAddress,"] TemplateRecordAddress[").concat(tmpRecordAddress,"] renderAsync:"));}if(this.pict.LogNoisiness>2){this.log.trace("PictView [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.ViewIdentifier," Beginning Asynchronous Render (callback-style)..."));}let tmpAnticipate=this.fable.newAnticipate();tmpAnticipate.anticipate(fOnBeforeRenderCallback=>{this.onBeforeRenderAsync(fOnBeforeRenderCallback,tmpRenderable);});tmpAnticipate.anticipate(fAsyncTemplateCallback=>{// Render the template (asynchronously)
this.pict.parseTemplateByHash(tmpRenderable.TemplateHash,tmpRecord,(pError,pContent)=>{if(pError){this.log.error("PictView [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.ViewIdentifier," could not render (asynchronously) ").concat(tmpRenderableHash," (param ").concat(pRenderableHash,") because it did not parse the template."),pError);return fAsyncTemplateCallback(pError);}tmpRenderable.Content=pContent;return fAsyncTemplateCallback();},[this],pScope,{RootRenderable:typeof pRootRenderable==='object'?pRootRenderable:tmpRenderable});});tmpAnticipate.anticipate(fNext=>{this.onBeforeProjectAsync(fNext,tmpRenderable);});tmpAnticipate.anticipate(fNext=>{this.onProjectAsync(fNext,tmpRenderable);});if(tmpRenderable.RenderMethod!=='virtual-assignment'){tmpAnticipate.anticipate(fNext=>{this.onAfterProjectAsync(fNext,tmpRenderable);});// Execute the developer-overridable post-render behavior
tmpAnticipate.anticipate(fNext=>{this.onAfterRenderAsync(fNext,tmpRenderable);});}tmpAnticipate.wait(tmpCallback);}/**
	 * Renders the default renderable.
	 *
	 * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
	 */renderDefaultAsync(fCallback){// Render the default renderable
this.renderAsync(fCallback);}/**
	 * @param {string} [pRenderableHash] - The hash of the renderable to render.
	 * @param {string} [pRenderDestinationAddress] - The address where the renderable will be rendered.
	 * @param {string|object} [pTemplateRecordAddress] - The address of (or actual obejct) where the data for the template is stored.
	 */basicRender(pRenderableHash,pRenderDestinationAddress,pTemplateRecordAddress){return this.basicRenderWithScope(this,pRenderableHash,pRenderDestinationAddress,pTemplateRecordAddress);}/**
	 * @param {any} pScope - The scope to use for the template rendering.
	 * @param {string} [pRenderableHash] - The hash of the renderable to render.
	 * @param {string} [pRenderDestinationAddress] - The address where the renderable will be rendered.
	 * @param {string|object} [pTemplateRecordAddress] - The address of (or actual obejct) where the data for the template is stored.
	 */basicRenderWithScope(pScope,pRenderableHash,pRenderDestinationAddress,pTemplateRecordAddress){let tmpRenderOptions=this.buildRenderOptions(pRenderableHash,pRenderDestinationAddress,pTemplateRecordAddress);if(tmpRenderOptions.Valid){this.assignRenderContent(tmpRenderOptions.Renderable,tmpRenderOptions.DestinationAddress,this.pict.parseTemplateByHash(tmpRenderOptions.Renderable.TemplateHash,tmpRenderOptions.Record,null,[this],pScope,{RootRenderable:tmpRenderOptions.Renderable}));return true;}else{this.log.error("PictView [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.ViewIdentifier," could not perform a basic render of ").concat(tmpRenderOptions.RenderableHash," because it is not valid."));return false;}}/**
	 * @param {string|ErrorCallback} [pRenderableHash] - The hash of the renderable to render.
	 * @param {string|ErrorCallback} [pRenderDestinationAddress] - The address where the renderable will be rendered.
	 * @param {string|Object|ErrorCallback} [pTemplateRecordAddress] - The address of (or actual obejct) where the data for the template is stored.
	 * @param {ErrorCallback} [fCallback] - The callback to call when the async operation is complete.
	 */basicRenderAsync(pRenderableHash,pRenderDestinationAddress,pTemplateRecordAddress,fCallback){return this.basicRenderWithScopeAsync(this,pRenderableHash,pRenderDestinationAddress,pTemplateRecordAddress,fCallback);}/**
	 * @param {any} pScope - The scope to use for the template rendering.
	 * @param {string|ErrorCallback} [pRenderableHash] - The hash of the renderable to render.
	 * @param {string|ErrorCallback} [pRenderDestinationAddress] - The address where the renderable will be rendered.
	 * @param {string|Object|ErrorCallback} [pTemplateRecordAddress] - The address of (or actual obejct) where the data for the template is stored.
	 * @param {ErrorCallback} [fCallback] - The callback to call when the async operation is complete.
	 */basicRenderWithScopeAsync(pScope,pRenderableHash,pRenderDestinationAddress,pTemplateRecordAddress,fCallback){// Allow the callback to be passed in as the last parameter no matter what
/** @type {ErrorCallback} */let tmpCallback=typeof fCallback==='function'?fCallback:typeof pTemplateRecordAddress==='function'?pTemplateRecordAddress:typeof pRenderDestinationAddress==='function'?pRenderDestinationAddress:typeof pRenderableHash==='function'?pRenderableHash:null;if(!tmpCallback){this.log.warn("PictView [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," basicRenderAsync was called without a valid callback.  A callback will be generated but this could lead to race conditions."));tmpCallback=pError=>{if(pError){this.log.error("PictView [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," basicRenderAsync Auto Callback Error: ").concat(pError),pError);}};}const tmpRenderOptions=this.buildRenderOptions(pRenderableHash,pRenderDestinationAddress,pTemplateRecordAddress);if(tmpRenderOptions.Valid){this.pict.parseTemplateByHash(tmpRenderOptions.Renderable.TemplateHash,tmpRenderOptions.Record,/**
				 * @param {Error} [pError] - The error that occurred during template parsing.
				 * @param {string} [pContent] - The content that was rendered from the template.
				 */(pError,pContent)=>{if(pError){this.log.error("PictView [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.ViewIdentifier," could not render (asynchronously) ").concat(tmpRenderOptions.RenderableHash," because it did not parse the template."),pError);return tmpCallback(pError);}this.assignRenderContent(tmpRenderOptions.Renderable,tmpRenderOptions.DestinationAddress,pContent);return tmpCallback();},[this],pScope,{RootRenderable:tmpRenderOptions.Renderable});}else{let tmpErrorMessage="PictView [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.ViewIdentifier," could not perform a basic render of ").concat(tmpRenderOptions.RenderableHash," because it is not valid.");this.log.error(tmpErrorMessage);return tmpCallback(new Error(tmpErrorMessage));}}/**
	 * @param {Renderable} pRenderable - The renderable that was rendered.
	 */onProject(pRenderable){if(this.pict.LogNoisiness>3){this.log.trace("PictView [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.ViewIdentifier," onProject:"));}if(pRenderable.RenderMethod==='virtual-assignment'){this.pict.TransactionTracking.pushToTransactionQueue(pRenderable.TransactionHash,{ViewHash:this.Hash,Renderable:pRenderable},'Deferred-Post-Content-Assignment');}if(this.pict.LogNoisiness>0){this.log.trace("PictView [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.ViewIdentifier," Assigning Renderable[").concat(pRenderable.RenderableHash,"] content length ").concat(pRenderable.Content.length," to Destination [").concat(pRenderable.ContentDestinationAddress,"] using Async render method ").concat(pRenderable.RenderMethod,"."));}// Assign the content to the destination address
this.pict.ContentAssignment.projectContent(pRenderable.RenderMethod,pRenderable.ContentDestinationAddress,pRenderable.Content,pRenderable.TestAddress);this.lastRenderedTimestamp=this.pict.log.getTimeStamp();}/**
	 * Lifecycle hook that triggers after the view is projected into the DOM (async flow).
	 *
	 * @param {(error?: Error, content?: string) => void} fCallback - The callback to call when the async operation is complete.
	 * @param {Renderable} pRenderable - The renderable that is being projected.
	 */onProjectAsync(fCallback,pRenderable){this.onProject(pRenderable);return fCallback();}/**
	 * Lifecycle hook that triggers after the view is rendered.
	 *
	 * @param {Renderable} pRenderable - The renderable that was rendered.
	 */onAfterRender(pRenderable){if(this.pict.LogNoisiness>3){this.log.trace("PictView [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.ViewIdentifier," onAfterRender:"));}if(pRenderable&&pRenderable.RootRenderableViewHash===this.Hash){const tmpTransactionQueue=this.pict.TransactionTracking.clearTransactionQueue(pRenderable.TransactionHash)||[];for(const tmpEvent of tmpTransactionQueue){const tmpView=this.pict.views[tmpEvent.Data.ViewHash];if(!tmpView){this.log.error("PictView [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.ViewIdentifier," onAfterRender: Could not find view for transaction hash ").concat(pRenderable.TransactionHash," and ViewHash ").concat(tmpEvent.Data.ViewHash,"."));continue;}tmpView.onAfterProject();// Execute the developer-overridable post-render behavior
tmpView.onAfterRender(tmpEvent.Data.Renderable);}// Queue is drained and nested child renders have each cleaned up
// their own transactions; remove this root render's entry from
// the tracking map so it does not leak.
this.pict.TransactionTracking.unregisterTransaction(pRenderable.TransactionHash);}return true;}/**
	 * Lifecycle hook that triggers after the view is rendered (async flow).
	 *
	 * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
	 * @param {Renderable} pRenderable - The renderable that was rendered.
	 */onAfterRenderAsync(fCallback,pRenderable){// NOTE: this.onAfterRender(pRenderable) will itself clear the
// transaction queue and unregister the transaction if this view is
// the root renderable - see onAfterRender above. So by the time the
// loop below runs, the queue is already empty and there is nothing
// to drain. Keeping the async queue walk here defensively in case
// future subclasses override onAfterRender in ways that skip the
// drain, but the common path is now "sync drain, async no-op".
this.onAfterRender(pRenderable);const tmpAnticipate=this.fable.newAnticipate();const tmpIsRootRenderable=pRenderable&&pRenderable.RootRenderableViewHash===this.Hash;if(tmpIsRootRenderable){const queue=this.pict.TransactionTracking.clearTransactionQueue(pRenderable.TransactionHash)||[];for(const event of queue){/** @type {PictView} */const tmpView=this.pict.views[event.Data.ViewHash];if(!tmpView){this.log.error("PictView [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.ViewIdentifier," onAfterRenderAsync: Could not find view for transaction hash ").concat(pRenderable.TransactionHash," and ViewHash ").concat(event.Data.ViewHash,"."));continue;}tmpAnticipate.anticipate(tmpView.onAfterProjectAsync.bind(tmpView));tmpAnticipate.anticipate(fNext=>{tmpView.onAfterRenderAsync(fNext,event.Data.Renderable);});// Execute the developer-overridable post-render behavior
}}return tmpAnticipate.wait(pError=>{// Nested virtual-assignment children have now settled their own
// onAfterRenderAsync chains (and unregistered their own
// transactions along the way). Ensure this root render's entry
// is also gone - unregisterTransaction is a no-op if the sync
// onAfterRender above already removed it, so this is safe to
// call unconditionally on the root path.
if(tmpIsRootRenderable&&pRenderable&&pRenderable.TransactionHash){this.pict.TransactionTracking.unregisterTransaction(pRenderable.TransactionHash);}return fCallback(pError);});}/**
	 * Lifecycle hook that triggers after the view is projected into the DOM.
	 *
	 * @param {Renderable} pRenderable - The renderable that was projected.
	 */onAfterProject(pRenderable){if(this.pict.LogNoisiness>3){this.log.trace("PictView [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.ViewIdentifier," onAfterProject:"));}return true;}/**
	 * Lifecycle hook that triggers after the view is projected into the DOM (async flow).
	 *
	 * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
	 * @param {Renderable} pRenderable - The renderable that was projected.
	 */onAfterProjectAsync(fCallback,pRenderable){return fCallback();}/* -------------------------------------------------------------------------- *//*                            Code Section: Solver                            *//* -------------------------------------------------------------------------- *//**
	 * Lifecycle hook that triggers before the view is solved.
	 */onBeforeSolve(){if(this.pict.LogNoisiness>3){this.log.trace("PictView [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.ViewIdentifier," onBeforeSolve:"));}return true;}/**
	 * Lifecycle hook that triggers before the view is solved (async flow).
	 *
	 * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
	 */onBeforeSolveAsync(fCallback){this.onBeforeSolve();return fCallback();}/**
	 * Lifecycle hook that triggers when the view is solved.
	 */onSolve(){if(this.pict.LogNoisiness>3){this.log.trace("PictView [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.ViewIdentifier," onSolve:"));}return true;}/**
	 * Lifecycle hook that triggers when the view is solved (async flow).
	 *
	 * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
	 */onSolveAsync(fCallback){this.onSolve();return fCallback();}/**
	 * Performs view solving and triggers lifecycle hooks.
	 *
	 * @return {boolean} - True if the view was solved successfully, false otherwise.
	 */solve(){if(this.pict.LogNoisiness>2){this.log.trace("PictView [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.ViewIdentifier," executing solve() function..."));}this.onBeforeSolve();this.onSolve();this.onAfterSolve();this.lastSolvedTimestamp=this.pict.log.getTimeStamp();return true;}/**
	 * Performs view solving and triggers lifecycle hooks (async flow).
	 *
	 * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
	 */solveAsync(fCallback){let tmpAnticipate=this.pict.instantiateServiceProviderWithoutRegistration('Anticipate');/** @type {ErrorCallback} */let tmpCallback=typeof fCallback==='function'?fCallback:null;if(!tmpCallback){this.log.warn("PictView [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," solveAsync was called without a valid callback.  A callback will be generated but this could lead to race conditions."));tmpCallback=pError=>{if(pError){this.log.error("PictView [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," solveAsync Auto Callback Error: ").concat(pError),pError);}};}tmpAnticipate.anticipate(this.onBeforeSolveAsync.bind(this));tmpAnticipate.anticipate(this.onSolveAsync.bind(this));tmpAnticipate.anticipate(this.onAfterSolveAsync.bind(this));tmpAnticipate.wait(pError=>{if(this.pict.LogNoisiness>2){this.log.trace("PictView [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.ViewIdentifier," solveAsync() complete."));}this.lastSolvedTimestamp=this.pict.log.getTimeStamp();return tmpCallback(pError);});}/**
	 * Lifecycle hook that triggers after the view is solved.
	 */onAfterSolve(){if(this.pict.LogNoisiness>3){this.log.trace("PictView [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.ViewIdentifier," onAfterSolve:"));}return true;}/**
	 * Lifecycle hook that triggers after the view is solved (async flow).
	 *
	 * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
	 */onAfterSolveAsync(fCallback){this.onAfterSolve();return fCallback();}/* -------------------------------------------------------------------------- *//*                     Code Section: Marshal From View                        *//* -------------------------------------------------------------------------- *//**
	 * Lifecycle hook that triggers before data is marshaled from the view.
	 *
	 * @return {boolean} - True if the operation was successful, false otherwise.
	 */onBeforeMarshalFromView(){if(this.pict.LogNoisiness>3){this.log.trace("PictView [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.ViewIdentifier," onBeforeMarshalFromView:"));}return true;}/**
	 * Lifecycle hook that triggers before data is marshaled from the view (async flow).
	 *
	 * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
	 */onBeforeMarshalFromViewAsync(fCallback){this.onBeforeMarshalFromView();return fCallback();}/**
	 * Lifecycle hook that triggers when data is marshaled from the view.
	 */onMarshalFromView(){if(this.pict.LogNoisiness>3){this.log.trace("PictView [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.ViewIdentifier," onMarshalFromView:"));}return true;}/**
	 * Lifecycle hook that triggers when data is marshaled from the view (async flow).
	 *
	 * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
	 */onMarshalFromViewAsync(fCallback){this.onMarshalFromView();return fCallback();}/**
	 * Marshals data from the view.
	 *
	 * @return {boolean} - True if the operation was successful, false otherwise.
	 */marshalFromView(){if(this.pict.LogNoisiness>2){this.log.trace("PictView [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.ViewIdentifier," executing solve() function..."));}this.onBeforeMarshalFromView();this.onMarshalFromView();this.onAfterMarshalFromView();this.lastMarshalFromViewTimestamp=this.pict.log.getTimeStamp();return true;}/**
	 * Marshals data from the view (async flow).
	 *
	 * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
	 */marshalFromViewAsync(fCallback){let tmpAnticipate=this.pict.instantiateServiceProviderWithoutRegistration('Anticipate');/** @type {ErrorCallback} */let tmpCallback=typeof fCallback==='function'?fCallback:null;if(!tmpCallback){this.log.warn("PictView [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," marshalFromViewAsync was called without a valid callback.  A callback will be generated but this could lead to race conditions."));tmpCallback=pError=>{if(pError){this.log.error("PictView [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," marshalFromViewAsync Auto Callback Error: ").concat(pError),pError);}};}tmpAnticipate.anticipate(this.onBeforeMarshalFromViewAsync.bind(this));tmpAnticipate.anticipate(this.onMarshalFromViewAsync.bind(this));tmpAnticipate.anticipate(this.onAfterMarshalFromViewAsync.bind(this));tmpAnticipate.wait(pError=>{if(this.pict.LogNoisiness>2){this.log.trace("PictView [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.ViewIdentifier," marshalFromViewAsync() complete."));}this.lastMarshalFromViewTimestamp=this.pict.log.getTimeStamp();return tmpCallback(pError);});}/**
	 * Lifecycle hook that triggers after data is marshaled from the view.
	 */onAfterMarshalFromView(){if(this.pict.LogNoisiness>3){this.log.trace("PictView [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.ViewIdentifier," onAfterMarshalFromView:"));}return true;}/**
	 * Lifecycle hook that triggers after data is marshaled from the view (async flow).
	 *
	 * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
	 */onAfterMarshalFromViewAsync(fCallback){this.onAfterMarshalFromView();return fCallback();}/* -------------------------------------------------------------------------- *//*                     Code Section: Marshal To View                          *//* -------------------------------------------------------------------------- *//**
	 * Lifecycle hook that triggers before data is marshaled into the view.
	 */onBeforeMarshalToView(){if(this.pict.LogNoisiness>3){this.log.trace("PictView [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.ViewIdentifier," onBeforeMarshalToView:"));}return true;}/**
	 * Lifecycle hook that triggers before data is marshaled into the view (async flow).
	 *
	 * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
	 */onBeforeMarshalToViewAsync(fCallback){this.onBeforeMarshalToView();return fCallback();}/**
	 * Lifecycle hook that triggers when data is marshaled into the view.
	 */onMarshalToView(){if(this.pict.LogNoisiness>3){this.log.trace("PictView [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.ViewIdentifier," onMarshalToView:"));}return true;}/**
	 * Lifecycle hook that triggers when data is marshaled into the view (async flow).
	 *
	 * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
	 */onMarshalToViewAsync(fCallback){this.onMarshalToView();return fCallback();}/**
	 * Marshals data into the view.
	 *
	 * @return {boolean} - True if the operation was successful, false otherwise.
	 */marshalToView(){if(this.pict.LogNoisiness>2){this.log.trace("PictView [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.ViewIdentifier," executing solve() function..."));}this.onBeforeMarshalToView();this.onMarshalToView();this.onAfterMarshalToView();this.lastMarshalToViewTimestamp=this.pict.log.getTimeStamp();return true;}/**
	 * Marshals data into the view (async flow).
	 *
	 * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
	 */marshalToViewAsync(fCallback){let tmpAnticipate=this.pict.instantiateServiceProviderWithoutRegistration('Anticipate');/** @type {ErrorCallback} */let tmpCallback=typeof fCallback==='function'?fCallback:null;if(!tmpCallback){this.log.warn("PictView [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," marshalToViewAsync was called without a valid callback.  A callback will be generated but this could lead to race conditions."));tmpCallback=pError=>{if(pError){this.log.error("PictView [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.Name," marshalToViewAsync Auto Callback Error: ").concat(pError),pError);}};}tmpAnticipate.anticipate(this.onBeforeMarshalToViewAsync.bind(this));tmpAnticipate.anticipate(this.onMarshalToViewAsync.bind(this));tmpAnticipate.anticipate(this.onAfterMarshalToViewAsync.bind(this));tmpAnticipate.wait(pError=>{if(this.pict.LogNoisiness>2){this.log.trace("PictView [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.ViewIdentifier," marshalToViewAsync() complete."));}this.lastMarshalToViewTimestamp=this.pict.log.getTimeStamp();return tmpCallback(pError);});}/**
	 * Lifecycle hook that triggers after data is marshaled into the view.
	 */onAfterMarshalToView(){if(this.pict.LogNoisiness>3){this.log.trace("PictView [".concat(this.UUID,"]::[").concat(this.Hash,"] ").concat(this.options.ViewIdentifier," onAfterMarshalToView:"));}return true;}/**
	 * Lifecycle hook that triggers after data is marshaled into the view (async flow).
	 *
	 * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
	 */onAfterMarshalToViewAsync(fCallback){this.onAfterMarshalToView();return fCallback();}/** @return {boolean} - True if the object is a PictView. */get isPictView(){return true;}}module.exports=PictView;},{"../package.json":22,"fable-serviceproviderbase":9}],24:[function(require,module,exports){// The container for all the Pict-Section-InlineDocumentation related code.
// The main inline documentation provider (primary API surface)
module.exports=require('./providers/Pict-Provider-InlineDocumentation.js');// Exported views for advanced usage
module.exports.InlineDocumentationLayoutView=require('./views/Pict-View-InlineDocumentation-Layout.js');module.exports.InlineDocumentationContentView=require('./views/Pict-View-InlineDocumentation-Content.js');module.exports.InlineDocumentationNavView=require('./views/Pict-View-InlineDocumentation-Nav.js');module.exports.InlineDocumentationTopicManagerView=require('./views/Pict-View-InlineDocumentation-TopicManager.js');},{"./providers/Pict-Provider-InlineDocumentation.js":25,"./views/Pict-View-InlineDocumentation-Content.js":26,"./views/Pict-View-InlineDocumentation-Layout.js":27,"./views/Pict-View-InlineDocumentation-Nav.js":28,"./views/Pict-View-InlineDocumentation-TopicManager.js":29}],25:[function(require,module,exports){const libPictProvider=require('pict-provider');const libPictSectionContent=require('pict-section-content');const libPictContentProvider=libPictSectionContent.PictContentProvider;const libPictSectionModal=require('pict-section-modal');const libPictSectionMarkdownEditor=require('pict-section-markdowneditor');const libLunr=require('lunr');const libViewLayout=require('../views/Pict-View-InlineDocumentation-Layout.js');const libViewContent=require('../views/Pict-View-InlineDocumentation-Content.js');const libViewNav=require('../views/Pict-View-InlineDocumentation-Nav.js');const libViewTopicManager=require('../views/Pict-View-InlineDocumentation-TopicManager.js');/**
 * Inline Documentation Provider
 *
 * The primary API for embedding a documentation browser in a Pict application.
 * Instantiates all necessary views and sub-providers, manages documentation
 * state, and exposes methods for loading documents and navigating topics.
 */class InlineDocumentationProvider extends libPictProvider{constructor(pFable,pOptions,pServiceHash){let tmpOptions=Object.assign({},JSON.parse(JSON.stringify(_DefaultConfiguration)),pOptions);super(pFable,tmpOptions,pServiceHash);this._ContentCache={};this._ActiveTooltipBindings=[];this._tooltipHelpLinkHandler=null;// Instantiate the content provider for markdown parsing
this._ContentProvider=this.pict.addProviderSingleton('Pict-Content',libPictContentProvider.default_configuration,libPictContentProvider);// Register views
this.pict.addViewSingleton('InlineDoc-Layout',libViewLayout.default_configuration,libViewLayout);this.pict.addViewSingleton('InlineDoc-Content',libViewContent.default_configuration,libViewContent);this.pict.addViewSingleton('InlineDoc-Nav',libViewNav.default_configuration,libViewNav);this.pict.addViewSingleton('InlineDoc-TopicManager',libViewTopicManager.default_configuration,libViewTopicManager);// Register pict-section-modal if not already present (needed by topic manager)
if(!this.pict.views['Pict-Section-Modal']){this.pict.addViewSingleton('Pict-Section-Modal',libPictSectionModal.default_configuration,libPictSectionModal);}// Register the markdown editor for edit mode
let tmpEditorConfig=JSON.parse(JSON.stringify(libPictSectionMarkdownEditor.default_configuration));tmpEditorConfig.DefaultDestinationAddress='#InlineDoc-Editor-Container';tmpEditorConfig.TargetElementAddress='#InlineDoc-Editor-Container';tmpEditorConfig.ContentDataAddress='AppData.InlineDocumentation.EditorSegments';tmpEditorConfig.DefaultPreviewMode='off';tmpEditorConfig.Renderables=[{RenderableHash:'MarkdownEditor-Wrap',TemplateHash:'MarkdownEditor-Container',ContentDestinationAddress:'#InlineDoc-Editor-Container'}];this.pict.addViewSingleton('InlineDoc-MarkdownEditor',tmpEditorConfig,libPictSectionMarkdownEditor);}/**
	 * Initialize the inline documentation system.
	 *
	 * Sets up application state, loads sidebar navigation and optionally
	 * topic definitions, then renders the layout.
	 *
	 * @param {Object} [pOptions] - Options: { DocsBaseURL, TopicsURL, ContainerAddress }
	 * @param {Function} [fCallback] - Callback when initialization is complete
	 */initializeDocumentation(pOptions,fCallback){let tmpCallback=typeof fCallback==='function'?fCallback:()=>{};let tmpOptions=pOptions||{};// Initialize application state
if(!this.pict.AppData.InlineDocumentation){this.pict.AppData.InlineDocumentation={};}let tmpState=this.pict.AppData.InlineDocumentation;tmpState.DocsBaseURL=tmpOptions.DocsBaseURL||tmpState.DocsBaseURL||'';tmpState.CurrentPath='';tmpState.CurrentRoute='';tmpState.SidebarGroups=tmpState.SidebarGroups||[];tmpState.Topic=null;tmpState.Topics=tmpState.Topics||{};tmpState.NavigationHistory=[];// Navigation outline state
tmpState.NavCollapsed=true;tmpState.CollapsedGroups={};tmpState.ActiveDocumentHeadings=[];tmpState.NavFilterText='';// Full-text search state
tmpState.SearchIndexLoaded=false;tmpState.SearchQuery='';tmpState.SearchResults=[];// External link resolution — paths starting with / in the
// sidebar are cross-module references. ExternalDocBaseURL
// is prepended to make them full URLs opened in a new tab.
tmpState.ExternalDocBaseURL=tmpOptions.ExternalDocBaseURL||'';// Edit mode state — read from pOptions if provided
if(tmpOptions.EditEnabled!==undefined){tmpState.EditEnabled=!!tmpOptions.EditEnabled;}else{tmpState.EditEnabled=tmpState.EditEnabled||false;}tmpState.Editing=false;tmpState.EditingPath='';tmpState.EditingContent='';tmpState.TooltipEditMode=false;// Store the onSave callback if provided
if(typeof tmpOptions.onSave==='function'){this._onSave=tmpOptions.onSave;}// Store the onTopicsSave callback if provided
if(typeof tmpOptions.onTopicsSave==='function'){this._onTopicsSave=tmpOptions.onTopicsSave;}// Store the onImageUpload callback if provided
if(typeof tmpOptions.onImageUpload==='function'){this._onImageUpload=tmpOptions.onImageUpload;this._wireEditorImageUpload();}// Topic manager enabled state
// If explicitly set, use that; otherwise track EditEnabled
if(tmpOptions.TopicManagerEnabled!==undefined){tmpState.TopicManagerEnabled=!!tmpOptions.TopicManagerEnabled;this._topicManagerExplicitlySet=true;}else{tmpState.TopicManagerEnabled=tmpState.EditEnabled||false;this._topicManagerExplicitlySet=false;}// Optionally override the layout container address
if(tmpOptions.ContainerAddress){let tmpLayoutView=this.pict.views['InlineDoc-Layout'];if(tmpLayoutView&&tmpLayoutView.options&&tmpLayoutView.options.Renderables){for(let i=0;i<tmpLayoutView.options.Renderables.length;i++){tmpLayoutView.options.Renderables[i].ContentDestinationAddress=tmpOptions.ContainerAddress;}}}// Load sidebar, topics, and search index in parallel
let tmpPending=2;if(tmpOptions.SearchIndexURL)tmpPending++;let tmpSelf=this;let tmpFinish=()=>{tmpPending--;if(tmpPending<=0){// Mark sidebar items as external based on ExternalDocBaseURL
tmpSelf._markExternalSidebarItems();// Render the layout (which contains nav and content containers)
tmpSelf.pict.views['InlineDoc-Layout'].render();// Render the navigation
tmpSelf.pict.views['InlineDoc-Nav'].render();return tmpCallback();}};this._loadSidebar(tmpFinish);this._loadTopics(tmpOptions.TopicsURL,tmpFinish);if(tmpOptions.SearchIndexURL){this._loadSearchIndex(tmpOptions.SearchIndexURL,tmpFinish);}}/**
	 * Load and display a markdown document.
	 *
	 * Fetches the document relative to DocsBaseURL, parses it to HTML via
	 * pict-section-content, and displays it in the content view.
	 *
	 * @param {string} pPath - Relative document path (e.g. 'getting-started.md')
	 * @param {Function} [fCallback] - Callback receiving (error, htmlContent)
	 */loadDocument(pPath,fCallback){let tmpCallback=typeof fCallback==='function'?fCallback:()=>{};if(!pPath){return tmpCallback('No document path provided');}let tmpState=this.pict.AppData.InlineDocumentation;let tmpContentView=this.pict.views['InlineDoc-Content'];// Parse anchor from path (e.g. 'page.md#section-heading')
let tmpAnchor='';let tmpPath=pPath;let tmpHashIndex=tmpPath.indexOf('#');if(tmpHashIndex>=0){tmpAnchor=tmpPath.substring(tmpHashIndex+1);tmpPath=tmpPath.substring(0,tmpHashIndex);}// Ensure .md extension
if(!tmpPath.match(/\.md$/)){tmpPath=tmpPath+'.md';}// Update state
tmpState.CurrentPath=tmpPath;tmpState.NavigationHistory.push(tmpPath);// Render the content view template (creates the container element)
tmpContentView.render();// Show loading indicator
tmpContentView.showLoading();// Fetch the document
let tmpURL=(tmpState.DocsBaseURL||'')+tmpPath;this._fetchDocument(tmpURL,(pError,pHTML)=>{if(pError){tmpContentView.displayContent(this._getErrorPageHTML(tmpPath));return tmpCallback(pError);}tmpContentView.displayContent(pHTML);// Scroll to anchor if specified
if(tmpAnchor){this._scrollToAnchor(tmpAnchor);}// Collapse the nav outline and clear search/filter
tmpState.NavCollapsed=true;tmpState.NavFilterText='';tmpState.SearchQuery='';tmpState.SearchResults=[];this.pict.views['InlineDoc-Nav'].render();return tmpCallback(null,pHTML);});}/**
	 * Set the active topic, filtering navigation to that topic's documents.
	 *
	 * @param {string} pTopicKey - The topic key (TopicCode from pict_documentation_topics.json)
	 */setTopic(pTopicKey){let tmpState=this.pict.AppData.InlineDocumentation;if(!pTopicKey||!tmpState.Topics||!tmpState.Topics[pTopicKey]){this.log.warn("InlineDocumentation: Topic [".concat(pTopicKey,"] not found."));return;}tmpState.Topic=pTopicKey;// Re-render navigation with topic filter
this.pict.views['InlineDoc-Nav'].render();}/**
	 * Load and display a topic's help document by TopicCode.
	 *
	 * Looks up the topic in the pict_documentation_topics.json format,
	 * sets it as active, and loads its TopicHelpFilePath.
	 *
	 * @param {string} pTopicCode - The TopicCode (e.g. 'BOOKSHOP-BOOKLIST')
	 * @param {Function} [fCallback] - Callback receiving (error, htmlContent)
	 */loadTopicDocument(pTopicCode,fCallback){let tmpState=this.pict.AppData.InlineDocumentation;if(!pTopicCode||!tmpState.Topics||!tmpState.Topics[pTopicCode]){this.log.warn("InlineDocumentation: Topic [".concat(pTopicCode,"] not found."));if(typeof fCallback==='function'){return fCallback('Topic not found');}return;}let tmpTopic=tmpState.Topics[pTopicCode];tmpState.Topic=pTopicCode;// Re-render navigation
this.pict.views['InlineDoc-Nav'].render();// Load the topic's help file
let tmpPath=tmpTopic.TopicHelpFilePath||'';if(tmpPath){this.loadDocument(tmpPath,fCallback);}}/**
	 * Clear the active topic, showing full navigation.
	 */clearTopic(){let tmpState=this.pict.AppData.InlineDocumentation;tmpState.Topic=null;// Re-render navigation without filter
this.pict.views['InlineDoc-Nav'].render();}/**
	 * Add a new topic definition at runtime.
	 *
	 * @param {string} pTopicCode - Unique topic code
	 * @param {Object} pTopicDefinition - Topic object: { TopicCode, TopicHelpFilePath, TopicTitle, Routes }
	 */addTopic(pTopicCode,pTopicDefinition){let tmpState=this.pict.AppData.InlineDocumentation;if(!pTopicCode){this.log.warn('InlineDocumentation: addTopic requires a TopicCode.');return;}if(!tmpState.Topics){tmpState.Topics={};}let tmpDefinition=Object.assign({TopicCode:pTopicCode},pTopicDefinition||{});tmpState.Topics[pTopicCode]=tmpDefinition;}/**
	 * Add a route pattern to an existing topic.
	 *
	 * @param {string} pTopicCode - The topic to add the route to
	 * @param {string} pRoutePattern - Route pattern (e.g. '/settings', '/admin/*')
	 */addRouteToTopic(pTopicCode,pRoutePattern){let tmpState=this.pict.AppData.InlineDocumentation;if(!pTopicCode||!tmpState.Topics||!tmpState.Topics[pTopicCode]){this.log.warn("InlineDocumentation: Topic [".concat(pTopicCode,"] not found for addRouteToTopic."));return;}let tmpTopic=tmpState.Topics[pTopicCode];if(!tmpTopic.Routes){tmpTopic.Routes=[];}if(tmpTopic.Routes.indexOf(pRoutePattern)<0){tmpTopic.Routes.push(pRoutePattern);}}/**
	 * Get a list of all topics in a UI-friendly array format.
	 *
	 * @returns {Array} Array of { TopicCode, TopicTitle, TopicHelpFilePath, RouteCount }
	 */getTopicList(){let tmpState=this.pict.AppData.InlineDocumentation;let tmpResult=[];if(!tmpState||!tmpState.Topics){return tmpResult;}let tmpTopicCodes=Object.keys(tmpState.Topics);for(let i=0;i<tmpTopicCodes.length;i++){let tmpTopic=tmpState.Topics[tmpTopicCodes[i]];tmpResult.push({TopicCode:tmpTopicCodes[i],TopicTitle:tmpTopic.TopicTitle||tmpTopic.Name||tmpTopicCodes[i],TopicHelpFilePath:tmpTopic.TopicHelpFilePath||'',RouteCount:tmpTopic.Routes&&Array.isArray(tmpTopic.Routes)?tmpTopic.Routes.length:0});}return tmpResult;}/**
	 * Update an existing topic definition.
	 *
	 * Merges only the properties present in pUpdates into the topic.
	 *
	 * @param {string} pTopicCode - The topic to update
	 * @param {Object} pUpdates - Properties to merge: { TopicTitle, TopicHelpFilePath, Routes }
	 * @returns {boolean} True if updated, false if topic not found
	 */updateTopic(pTopicCode,pUpdates){let tmpState=this.pict.AppData.InlineDocumentation;if(!pTopicCode||!tmpState.Topics||!tmpState.Topics[pTopicCode]){return false;}let tmpTopic=tmpState.Topics[pTopicCode];let tmpUpdates=pUpdates||{};if(tmpUpdates.hasOwnProperty('TopicTitle')){tmpTopic.TopicTitle=tmpUpdates.TopicTitle;}if(tmpUpdates.hasOwnProperty('TopicHelpFilePath')){tmpTopic.TopicHelpFilePath=tmpUpdates.TopicHelpFilePath;}if(tmpUpdates.hasOwnProperty('Routes')){tmpTopic.Routes=tmpUpdates.Routes;}return true;}/**
	 * Remove a topic definition.
	 *
	 * If the removed topic is the currently active topic, clears it.
	 *
	 * @param {string} pTopicCode - The topic to remove
	 * @returns {boolean} True if removed, false if topic not found
	 */removeTopic(pTopicCode){let tmpState=this.pict.AppData.InlineDocumentation;if(!pTopicCode||!tmpState.Topics||!tmpState.Topics[pTopicCode]){return false;}delete tmpState.Topics[pTopicCode];// Clear active topic if it was the one removed
if(tmpState.Topic===pTopicCode){tmpState.Topic=null;}return true;}/**
	 * Remove a specific route pattern from a topic.
	 *
	 * @param {string} pTopicCode - The topic to modify
	 * @param {string} pRoutePattern - The route pattern to remove
	 * @returns {boolean} True if removed, false if not found
	 */removeRouteFromTopic(pTopicCode,pRoutePattern){let tmpState=this.pict.AppData.InlineDocumentation;if(!pTopicCode||!tmpState.Topics||!tmpState.Topics[pTopicCode]){return false;}let tmpTopic=tmpState.Topics[pTopicCode];if(!tmpTopic.Routes||!Array.isArray(tmpTopic.Routes)){return false;}let tmpIndex=tmpTopic.Routes.indexOf(pRoutePattern);if(tmpIndex<0){return false;}tmpTopic.Routes.splice(tmpIndex,1);return true;}/**
	 * Persist the current topics via the onTopicsSave callback.
	 *
	 * If no onTopicsSave handler was provided, succeeds locally.
	 *
	 * @param {Function} [fCallback] - Callback receiving (error)
	 */saveTopics(fCallback){let tmpCallback=typeof fCallback==='function'?fCallback:()=>{};let tmpState=this.pict.AppData.InlineDocumentation;if(typeof this._onTopicsSave==='function'){this._onTopicsSave(tmpState.Topics,pError=>{if(pError){this.log.warn("InlineDocumentation: Topics save failed: ".concat(pError));return tmpCallback(pError);}return tmpCallback(null);});}else{// No save handler — succeed locally
return tmpCallback(null);}}/**
	 * Enable or disable the topic manager UI.
	 *
	 * When enabled, management buttons appear in the navigation toolbar.
	 *
	 * @param {boolean} pEnabled - Whether topic management is available
	 */setTopicManagerEnabled(pEnabled){let tmpState=this.pict.AppData.InlineDocumentation;tmpState.TopicManagerEnabled=!!pEnabled;// Re-render navigation to show/hide management buttons
let tmpNavView=this.pict.views['InlineDoc-Nav'];if(tmpNavView){tmpNavView.render();}}// -- Wildcard builder helpers --
/**
	 * Split a route into segments with wildcard pattern options.
	 *
	 * For a route like '/books/detail/5', returns:
	 * [
	 *   { Segment: 'books',  Path: '/books',         WildcardPattern: '/books/*',         Index: 0 },
	 *   { Segment: 'detail', Path: '/books/detail',   WildcardPattern: '/books/detail/*',   Index: 1 },
	 *   { Segment: '5',      Path: '/books/detail/5', WildcardPattern: '/books/detail/5/*', Index: 2 }
	 * ]
	 *
	 * @param {string} pRoute - The route to split
	 * @returns {Array} Array of segment objects
	 */getRouteSegments(pRoute){if(!pRoute||typeof pRoute!=='string'){return[];}// Strip leading slash and split
let tmpClean=pRoute.replace(/^\//,'');if(!tmpClean){return[];}let tmpParts=tmpClean.split('/');let tmpSegments=[];for(let i=0;i<tmpParts.length;i++){let tmpPath='/'+tmpParts.slice(0,i+1).join('/');tmpSegments.push({Segment:tmpParts[i],Path:tmpPath,WildcardPattern:tmpPath+'/*',Index:i});}return tmpSegments;}/**
	 * Build a wildcard pattern from a route at a given segment index.
	 *
	 * The wildcard replaces everything after the segment at pSegmentIndex.
	 * For '/books/detail/5' with index 1, returns '/books/detail/*'.
	 *
	 * @param {string} pRoute - The route
	 * @param {number} pSegmentIndex - The segment index (0-based) where the wildcard starts after
	 * @returns {string} The wildcard pattern, or empty string if invalid
	 */buildWildcardPattern(pRoute,pSegmentIndex){let tmpSegments=this.getRouteSegments(pRoute);if(tmpSegments.length<1||pSegmentIndex<0||pSegmentIndex>=tmpSegments.length){return'';}return tmpSegments[pSegmentIndex].WildcardPattern;}/**
	 * Get all topics whose Routes match a given route.
	 *
	 * Unlike resolveHelpForRoute (which returns only the best match),
	 * this returns all matching topic codes — useful when multiple
	 * documents are relevant to the same route.
	 *
	 * @param {string} pRoute - The application route
	 * @returns {Array} Array of { TopicCode, Pattern, MatchLength } objects, sorted by match length descending
	 */getTopicsForRoute(pRoute){let tmpState=this.pict.AppData.InlineDocumentation;let tmpMatches=[];if(!pRoute||!tmpState.Topics){return tmpMatches;}let tmpTopicCodes=Object.keys(tmpState.Topics);for(let i=0;i<tmpTopicCodes.length;i++){let tmpTopic=tmpState.Topics[tmpTopicCodes[i]];if(!tmpTopic.Routes||!Array.isArray(tmpTopic.Routes)){continue;}for(let j=0;j<tmpTopic.Routes.length;j++){let tmpPattern=tmpTopic.Routes[j];if(!tmpPattern){continue;}let tmpMatchLength=0;let tmpIsMatch=false;if(tmpPattern.endsWith('/*')){let tmpPrefix=tmpPattern.slice(0,-2);if(pRoute===tmpPrefix||pRoute.indexOf(tmpPrefix+'/')===0){tmpIsMatch=true;tmpMatchLength=tmpPrefix.length;}}else{if(pRoute===tmpPattern){tmpIsMatch=true;tmpMatchLength=tmpPattern.length;}}if(tmpIsMatch){tmpMatches.push({TopicCode:tmpTopicCodes[i],Pattern:tmpPattern,MatchLength:tmpMatchLength});}}}// Sort by match length descending (best match first)
tmpMatches.sort((a,b)=>b.MatchLength-a.MatchLength);return tmpMatches;}/**
	 * Change the documentation base URL.
	 *
	 * @param {string} pURL - The new base URL
	 */setDocsBaseURL(pURL){if(!this.pict.AppData.InlineDocumentation){this.pict.AppData.InlineDocumentation={};}this.pict.AppData.InlineDocumentation.DocsBaseURL=pURL||'';// Clear cache when base URL changes
this._ContentCache={};}/**
	 * Get the navigation history.
	 *
	 * @returns {Array} Array of visited document paths
	 */getNavigationHistory(){let tmpState=this.pict.AppData.InlineDocumentation;return tmpState&&tmpState.NavigationHistory?tmpState.NavigationHistory:[];}/**
	 * Navigate back to the previous document.
	 *
	 * @param {Function} [fCallback] - Callback when navigation is complete
	 */navigateBack(fCallback){let tmpHistory=this.getNavigationHistory();if(tmpHistory.length<2){return;}// Remove current page
tmpHistory.pop();// Get previous page
let tmpPreviousPath=tmpHistory.pop();this.loadDocument(tmpPreviousPath,fCallback);}// -- Edit mode --
/**
	 * Enable or disable edit permissions.
	 *
	 * When enabled, a pencil icon appears in the content area allowing
	 * the user to toggle into edit mode.
	 *
	 * @param {boolean} pEnabled - Whether edit mode is available
	 */setEditEnabled(pEnabled){let tmpState=this.pict.AppData.InlineDocumentation;tmpState.EditEnabled=!!pEnabled;// If TopicManagerEnabled was not explicitly configured, mirror EditEnabled
if(!this._topicManagerExplicitlySet){tmpState.TopicManagerEnabled=!!pEnabled;// Re-render navigation to show/hide management buttons
let tmpNavView=this.pict.views['InlineDoc-Nav'];if(tmpNavView){tmpNavView.render();}}// Re-render content view to show/hide edit toolbar
let tmpContentView=this.pict.views['InlineDoc-Content'];if(tmpContentView){tmpContentView.renderEditToolbar();}}/**
	 * Toggle between view and edit mode.
	 */toggleEdit(){let tmpState=this.pict.AppData.InlineDocumentation;if(tmpState.Editing){this.cancelEdit();}else{this.beginEdit();}}/**
	 * Enter edit mode for the current document.
	 *
	 * Retrieves the raw markdown from cache and displays it in the markdown editor.
	 */beginEdit(){let tmpState=this.pict.AppData.InlineDocumentation;if(!tmpState.EditEnabled||!tmpState.CurrentPath){return;}// Get the raw markdown from cache
let tmpURL=(tmpState.DocsBaseURL||'')+tmpState.CurrentPath;let tmpCacheEntry=this._ContentCache[tmpURL];let tmpMarkdown=tmpCacheEntry&&tmpCacheEntry.markdown?tmpCacheEntry.markdown:'';tmpState.Editing=true;tmpState.EditingPath=tmpState.CurrentPath;tmpState.EditingContent=tmpMarkdown;// Show the editor
let tmpContentView=this.pict.views['InlineDoc-Content'];if(tmpContentView){tmpContentView.showEditor(tmpMarkdown);}}/**
	 * Cancel editing and restore the rendered view.
	 */cancelEdit(){let tmpState=this.pict.AppData.InlineDocumentation;tmpState.Editing=false;tmpState.EditingPath='';tmpState.EditingContent='';tmpState.EditorSegments=[];// Restore the rendered content
let tmpContentView=this.pict.views['InlineDoc-Content'];if(tmpContentView){tmpContentView.hideEditor();// Re-display the cached HTML
let tmpURL=(tmpState.DocsBaseURL||'')+tmpState.CurrentPath;let tmpCacheEntry=this._ContentCache[tmpURL];if(tmpCacheEntry&&tmpCacheEntry.html){tmpContentView.displayContent(tmpCacheEntry.html);}}}/**
	 * Save the current edits.
	 *
	 * Reads the markdown editor content, calls the onSave callback provided by the
	 * host app, re-parses the markdown, and returns to view mode.
	 *
	 * @param {Function} [fCallback] - Callback receiving (error)
	 */saveEdit(fCallback){let tmpCallback=typeof fCallback==='function'?fCallback:()=>{};let tmpState=this.pict.AppData.InlineDocumentation;let tmpContentView=this.pict.views['InlineDoc-Content'];if(!tmpState.Editing){return tmpCallback('Not in edit mode');}// Read content from the markdown editor
// First marshal editor state to data, then read from the data address
let tmpMarkdown='';let tmpEditorView=this.pict.views['InlineDoc-MarkdownEditor'];if(tmpEditorView&&typeof tmpEditorView.marshalFromView==='function'){tmpEditorView.marshalFromView();}if(tmpState.EditorSegments&&tmpState.EditorSegments.length>0){tmpMarkdown=tmpState.EditorSegments[0].Content||'';}let tmpPath=tmpState.EditingPath;let tmpURL=(tmpState.DocsBaseURL||'')+tmpPath;let tmpSaveData={Path:tmpPath,Content:tmpMarkdown};let tmpFinishSave=()=>{// Re-parse the markdown and update cache
let tmpHTML=this._ContentProvider.parseMarkdown(tmpMarkdown,this._createLinkResolver(),this._createImageResolver(tmpURL));this._ContentCache[tmpURL]={html:tmpHTML,markdown:tmpMarkdown};// Exit edit mode
tmpState.Editing=false;tmpState.EditingPath='';tmpState.EditingContent='';tmpState.EditorSegments=[];// Display the updated content
if(tmpContentView){tmpContentView.hideEditor();tmpContentView.displayContent(tmpHTML);}return tmpCallback(null);};// Call the onSave callback if provided
if(typeof this._onSave==='function'){this._onSave(tmpSaveData,pError=>{if(pError){this.log.warn("InlineDocumentation: Save failed: ".concat(pError));return tmpCallback(pError);}tmpFinishSave();});}else{// No save handler — just update locally
tmpFinishSave();}}// -- Route-based help --
/**
	 * Find the best-matching topic for a given route.
	 *
	 * Iterates all topics looking for ones with a Routes array. Supports
	 * exact match and wildcard suffix (e.g. "/books/store/*" matches
	 * "/books/store/123"). Returns the TopicCode with the longest matching
	 * route pattern, or null if no match.
	 *
	 * @param {string} pRoute - The application route (e.g. '/books/store/5')
	 * @returns {string|null} The TopicCode of the best match, or null
	 */resolveHelpForRoute(pRoute){let tmpState=this.pict.AppData.InlineDocumentation;if(!pRoute||!tmpState.Topics){return null;}let tmpBestMatch=null;let tmpBestLength=-1;let tmpTopicCodes=Object.keys(tmpState.Topics);for(let i=0;i<tmpTopicCodes.length;i++){let tmpTopic=tmpState.Topics[tmpTopicCodes[i]];if(!tmpTopic.Routes||!Array.isArray(tmpTopic.Routes)){continue;}for(let j=0;j<tmpTopic.Routes.length;j++){let tmpPattern=tmpTopic.Routes[j];if(!tmpPattern){continue;}let tmpMatches=false;let tmpMatchLength=0;if(tmpPattern.endsWith('/*')){// Wildcard suffix — match if route starts with prefix
let tmpPrefix=tmpPattern.slice(0,-2);if(pRoute===tmpPrefix||pRoute.indexOf(tmpPrefix+'/')===0){tmpMatches=true;tmpMatchLength=tmpPrefix.length;}}else{// Exact match
if(pRoute===tmpPattern){tmpMatches=true;tmpMatchLength=tmpPattern.length;}}if(tmpMatches&&tmpMatchLength>tmpBestLength){tmpBestMatch=tmpTopicCodes[i];tmpBestLength=tmpMatchLength;}}}return tmpBestMatch;}/**
	 * Navigate help to the topic matching a given route.
	 *
	 * Convenience method: resolves the route to a topic, then loads it.
	 * If no topic matches, does nothing.
	 *
	 * @param {string} pRoute - The application route
	 * @param {Function} [fCallback] - Callback receiving (error, htmlContent)
	 * @returns {boolean} True if a matching topic was found
	 */navigateToRoute(pRoute,fCallback){let tmpState=this.pict.AppData.InlineDocumentation;tmpState.CurrentRoute=pRoute||'';let tmpTopicCode=this.resolveHelpForRoute(pRoute);if(tmpTopicCode){this.loadTopicDocument(tmpTopicCode,fCallback);return true;}return false;}// -- Tooltip placeholders --
/**
	 * Enable or disable tooltip edit mode.
	 *
	 * When enabled, all tooltip placeholders are visible and clickable
	 * for content editors to author tooltip content. When disabled,
	 * only placeholders with content show tooltips on hover.
	 *
	 * Automatically re-scans tooltips after toggling.
	 *
	 * @param {boolean} pEnabled - Whether tooltip edit mode is active
	 */setTooltipEditMode(pEnabled){let tmpState=this.pict.AppData.InlineDocumentation;if(!tmpState){return;}tmpState.TooltipEditMode=!!pEnabled;this.scanTooltips();}/**
	 * Get the tooltip content for a key from the active topic.
	 *
	 * Looks up the currently active topic's Tooltips hash for the
	 * given key and returns the Content string, or null if not found.
	 *
	 * @param {string} pTooltipKey - The tooltip key (from data-d-tooltip attribute)
	 * @returns {string|null} The tooltip content, or null
	 */getTooltipContent(pTooltipKey){let tmpState=this.pict.AppData.InlineDocumentation;if(!pTooltipKey||!tmpState||!tmpState.Topic||!tmpState.Topics){return null;}let tmpTopic=tmpState.Topics[tmpState.Topic];if(!tmpTopic||!tmpTopic.Tooltips||!tmpTopic.Tooltips[pTooltipKey]){return null;}return tmpTopic.Tooltips[pTooltipKey].Content||null;}/**
	 * Set tooltip content for a key on the active topic.
	 *
	 * Lazily creates the Tooltips hash on the topic if needed.
	 * Passing null or empty string removes the tooltip entry.
	 *
	 * @param {string} pTooltipKey - The tooltip key
	 * @param {string|null} pContent - The markdown content, or null to remove
	 * @returns {boolean} True if set, false if no active topic
	 */setTooltipContent(pTooltipKey,pContent){let tmpState=this.pict.AppData.InlineDocumentation;if(!pTooltipKey||!tmpState||!tmpState.Topic||!tmpState.Topics){return false;}let tmpTopic=tmpState.Topics[tmpState.Topic];if(!tmpTopic){return false;}if(!pContent){// Remove the entry
if(tmpTopic.Tooltips&&tmpTopic.Tooltips[pTooltipKey]){delete tmpTopic.Tooltips[pTooltipKey];}return true;}// Lazily create Tooltips hash
if(!tmpTopic.Tooltips){tmpTopic.Tooltips={};}tmpTopic.Tooltips[pTooltipKey]={Content:pContent};return true;}/**
	 * Remove all active tooltip bindings from the DOM.
	 *
	 * Destroys tooltip handles, removes click listeners, removes
	 * injected icons, and restores original element state.
	 */clearTooltipBindings(){for(let i=0;i<this._ActiveTooltipBindings.length;i++){let tmpBinding=this._ActiveTooltipBindings[i];// Destroy the modal tooltip handle
if(tmpBinding.TooltipHandle&&typeof tmpBinding.TooltipHandle.destroy==='function'){tmpBinding.TooltipHandle.destroy();}// Remove click handler
if(tmpBinding.ClickHandler&&tmpBinding.Element){tmpBinding.Element.removeEventListener('click',tmpBinding.ClickHandler);}// Remove injected icon
if(tmpBinding.InjectedIcon&&tmpBinding.InjectedIcon.parentNode){tmpBinding.InjectedIcon.parentNode.removeChild(tmpBinding.InjectedIcon);}// Remove edit-mode CSS classes
if(tmpBinding.Element){tmpBinding.Element.classList.remove('pict-inline-doc-tooltip-edit-target','pict-inline-doc-tooltip-empty');}// Restore original display for hidden icon spans
if(tmpBinding.OriginalDisplay!==undefined&&tmpBinding.Element){tmpBinding.Element.style.display=tmpBinding.OriginalDisplay;}}this._ActiveTooltipBindings=[];// Remove document-level help link handler
if(this._tooltipHelpLinkHandler&&typeof document!=='undefined'){document.removeEventListener('click',this._tooltipHelpLinkHandler);this._tooltipHelpLinkHandler=null;}}/**
	 * Scan the document for tooltip placeholder elements and wire them up.
	 *
	 * Finds all elements with data-d-tooltip attributes and:
	 * - In normal mode: attaches hover tooltips for those with content
	 * - In edit mode: adds visual indicators and click-to-edit handlers
	 *
	 * Call this after your application views render.
	 */scanTooltips(){this.clearTooltipBindings();if(typeof document==='undefined'){return;}let tmpState=this.pict.AppData.InlineDocumentation;if(!tmpState){return;}let tmpModal=this.pict.views['Pict-Section-Modal'];let tmpElements=document.querySelectorAll('[data-d-tooltip]');let tmpEditMode=tmpState.TooltipEditMode||false;for(let i=0;i<tmpElements.length;i++){let tmpElement=tmpElements[i];let tmpKey=tmpElement.getAttribute('data-d-tooltip');if(!tmpKey){continue;}let tmpContent=this.getTooltipContent(tmpKey);let tmpIsIcon=tmpElement.hasAttribute('data-d-tooltip-icon');let tmpBinding={Element:tmpElement,Key:tmpKey,Type:tmpIsIcon?'icon':'attribute',TooltipHandle:null,ClickHandler:null,InjectedIcon:null,OriginalDisplay:undefined};if(tmpEditMode){this._wireTooltipEditMode(tmpElement,tmpKey,tmpContent,tmpIsIcon,tmpBinding,tmpModal);}else{this._wireTooltipNormalMode(tmpElement,tmpKey,tmpContent,tmpIsIcon,tmpBinding,tmpModal);}this._ActiveTooltipBindings.push(tmpBinding);}// Install document-level click delegation for help: links in tooltips
this._installTooltipHelpLinkHandler();}/**
	 * Install a document-level click handler for help links inside tooltips.
	 *
	 * Tooltip elements are created/destroyed dynamically by the modal system,
	 * so we use event delegation on the document to catch clicks on
	 * [rel^="pict-inline-doc-help:"] links wherever they appear.
	 */_installTooltipHelpLinkHandler(){if(typeof document==='undefined'){return;}// Remove existing handler if any
if(this._tooltipHelpLinkHandler){document.removeEventListener('click',this._tooltipHelpLinkHandler);}let tmpSelf=this;this._tooltipHelpLinkHandler=pEvent=>{let tmpTarget=pEvent.target;// Walk up to find the link element
while(tmpTarget&&tmpTarget!==document){if(tmpTarget.tagName==='A'&&tmpTarget.getAttribute('rel')&&tmpTarget.getAttribute('rel').indexOf('pict-inline-doc-help:')===0){pEvent.preventDefault();pEvent.stopPropagation();let tmpPath=tmpTarget.getAttribute('rel').replace('pict-inline-doc-help:','');tmpSelf.loadDocument(tmpPath);return;}tmpTarget=tmpTarget.parentNode;}};document.addEventListener('click',this._tooltipHelpLinkHandler);}/**
	 * Wire a tooltip element for normal (non-edit) mode.
	 *
	 * @param {HTMLElement} pElement - The placeholder element
	 * @param {string} pKey - The tooltip key
	 * @param {string|null} pContent - The tooltip content (or null)
	 * @param {boolean} pIsIcon - Whether this is an icon-type placeholder
	 * @param {Object} pBinding - The binding tracking object
	 * @param {Object} pModal - The modal view instance
	 */_wireTooltipNormalMode(pElement,pKey,pContent,pIsIcon,pBinding,pModal){if(pIsIcon){if(pContent){// Inject an icon and attach tooltip
let tmpIcon=this._createTooltipIcon(pElement);pBinding.InjectedIcon=tmpIcon;if(pModal&&pModal.richTooltip){let tmpHTML=this._ContentProvider.parseMarkdown(pContent,this._createTooltipLinkResolver());pBinding.TooltipHandle=pModal.richTooltip(pElement,tmpHTML,{interactive:true,maxWidth:'350px'});}}else{// No content — hide the span
pBinding.OriginalDisplay=pElement.style.display;pElement.style.display='none';}}else{// Attribute tooltip
if(pContent&&pModal&&pModal.richTooltip){let tmpHTML=this._ContentProvider.parseMarkdown(pContent,this._createTooltipLinkResolver());pBinding.TooltipHandle=pModal.richTooltip(pElement,tmpHTML,{interactive:true,maxWidth:'350px'});}// No content = do nothing, element stays as-is
}}/**
	 * Wire a tooltip element for edit mode.
	 *
	 * @param {HTMLElement} pElement - The placeholder element
	 * @param {string} pKey - The tooltip key
	 * @param {string|null} pContent - The tooltip content (or null)
	 * @param {boolean} pIsIcon - Whether this is an icon-type placeholder
	 * @param {Object} pBinding - The binding tracking object
	 * @param {Object} pModal - The modal view instance
	 */_wireTooltipEditMode(pElement,pKey,pContent,pIsIcon,pBinding,pModal){// Add edit-mode indicator class
pElement.classList.add('pict-inline-doc-tooltip-edit-target');if(pIsIcon){// Always show icon in edit mode
let tmpIcon=this._createTooltipIcon(pElement);pBinding.InjectedIcon=tmpIcon;if(!pContent){pElement.classList.add('pict-inline-doc-tooltip-empty');}}// Click handler to open editor
let tmpSelf=this;let tmpClickHandler=pEvent=>{pEvent.preventDefault();pEvent.stopPropagation();tmpSelf._showTooltipEditor(pKey);};pElement.addEventListener('click',tmpClickHandler);pBinding.ClickHandler=tmpClickHandler;}/**
	 * Create and inject a tooltip icon element into a span.
	 *
	 * @param {HTMLElement} pElement - The span element to inject into
	 * @returns {HTMLElement} The created icon element
	 */_createTooltipIcon(pElement){let tmpIcon=document.createElement('span');tmpIcon.className='pict-inline-doc-tooltip-icon';// Check for custom icon class
let tmpCustomClass=pElement.getAttribute('data-d-tooltip-icon');if(tmpCustomClass&&tmpCustomClass!==''){tmpIcon.className+=' '+tmpCustomClass;}else{tmpIcon.innerHTML='&#x2753;';}pElement.appendChild(tmpIcon);return tmpIcon;}/**
	 * Show the tooltip content editor modal.
	 *
	 * @param {string} pTooltipKey - The tooltip key to edit
	 */_showTooltipEditor(pTooltipKey){let tmpModal=this.pict.views['Pict-Section-Modal'];if(!tmpModal){return;}let tmpCurrentContent=this.getTooltipContent(pTooltipKey)||'';let tmpSelf=this;let tmpEditorHTML='<div class="pict-inline-doc-tm-form-group">';tmpEditorHTML+='<label class="pict-inline-doc-tm-form-label">Tooltip Key</label>';tmpEditorHTML+='<div style="font-family:monospace;font-size:0.85em;color:var(--theme-color-text-muted, #8A7F72);padding:0.3em 0;">'+this._escapeTooltipHTML(pTooltipKey)+'</div>';tmpEditorHTML+='</div>';tmpEditorHTML+='<div class="pict-inline-doc-tm-form-group">';tmpEditorHTML+='<label class="pict-inline-doc-tm-form-label">Content (Markdown)</label>';tmpEditorHTML+='<textarea class="pict-inline-doc-tooltip-editor-textarea" id="InlineDoc-Tooltip-Editor-Textarea">'+this._escapeTooltipHTML(tmpCurrentContent)+'</textarea>';tmpEditorHTML+='</div>';tmpEditorHTML+='<div class="pict-inline-doc-tooltip-preview-label">Preview</div>';tmpEditorHTML+='<div class="pict-inline-doc-tooltip-preview" id="InlineDoc-Tooltip-Editor-Preview"></div>';tmpModal.show({title:'Edit Tooltip',content:tmpEditorHTML,closeable:true,width:'480px',buttons:[{Hash:'cancel',Label:'Cancel'},{Hash:'save',Label:'Save',Style:'primary'}],onOpen:pDialog=>{let tmpTextarea=document.getElementById('InlineDoc-Tooltip-Editor-Textarea');let tmpPreview=document.getElementById('InlineDoc-Tooltip-Editor-Preview');if(tmpTextarea&&tmpPreview){// Initial preview
let tmpLinkResolver=tmpSelf._createTooltipLinkResolver();let tmpInitialHTML=tmpCurrentContent?tmpSelf._ContentProvider.parseMarkdown(tmpCurrentContent,tmpLinkResolver):'<span style="color:var(--theme-color-text-muted, #8A7F72);">No content yet.</span>';tmpPreview.innerHTML=tmpInitialHTML;// Live preview on input
tmpTextarea.addEventListener('input',()=>{let tmpValue=tmpTextarea.value.trim();if(tmpValue){tmpPreview.innerHTML=tmpSelf._ContentProvider.parseMarkdown(tmpValue,tmpLinkResolver);}else{tmpPreview.innerHTML='<span style="color:var(--theme-color-text-muted, #8A7F72);">No content yet.</span>';}});tmpTextarea.focus();}}}).then(pResult=>{if(pResult==='save'){let tmpTextarea=document.getElementById('InlineDoc-Tooltip-Editor-Textarea');let tmpNewContent=tmpTextarea?tmpTextarea.value.trim():'';tmpSelf.setTooltipContent(pTooltipKey,tmpNewContent||null);tmpSelf.saveTopics();tmpSelf.scanTooltips();if(tmpModal.toast){tmpModal.toast('Tooltip saved.',{type:'success'});}}});}/**
	 * Escape HTML for safe insertion into tooltip editor.
	 *
	 * @param {string} pText - Text to escape
	 * @returns {string} Escaped text
	 */_escapeTooltipHTML(pText){if(!pText){return'';}return pText.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}// -- Image upload --
/**
	 * Wire the onImageUpload handler onto the markdown editor view.
	 *
	 * Overrides the editor's onImageUpload method so that when a user
	 * drops or pastes an image, it is routed through the host app's
	 * onImageUpload callback with the current document path for context.
	 *
	 * The host callback signature is:
	 *   onImageUpload(pFile, pDocumentPath, fCallback)
	 * where fCallback is fCallback(pError, pRelativeURL).
	 */_wireEditorImageUpload(){let tmpSelf=this;let tmpEditorView=this.pict.views['InlineDoc-MarkdownEditor'];if(!tmpEditorView){return;}tmpEditorView.onImageUpload=(pFile,pSegmentIndex,fCallback)=>{if(typeof tmpSelf._onImageUpload!=='function'){return false;}let tmpState=tmpSelf.pict.AppData.InlineDocumentation;let tmpDocumentPath=tmpState&&tmpState.EditingPath?tmpState.EditingPath:'';tmpSelf._onImageUpload(pFile,tmpDocumentPath,(pError,pURL)=>{if(pError){tmpSelf.log.warn("InlineDocumentation: Image upload failed: ".concat(pError));}fCallback(pError,pURL);});return true;};}/**
	 * Scroll the content area to a heading that matches an anchor string.
	 *
	 * Looks for headings (h1-h6) in the content body whose text, when
	 * slugified, matches the anchor. Uses the standard GitHub-style
	 * slugification: lowercase, spaces to hyphens, strip non-alphanumeric.
	 *
	 * @param {string} pAnchor - The anchor string (without #)
	 */_scrollToAnchor(pAnchor){if(typeof document==='undefined'||!pAnchor){return;}// Delay slightly to ensure content is rendered
setTimeout(()=>{let tmpContentBody=document.getElementById('InlineDoc-Content-Body');if(!tmpContentBody){return;}let tmpSlug=pAnchor.toLowerCase().replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-');// Check for an element with a matching id first
let tmpTarget=tmpContentBody.querySelector('#'+CSS.escape(tmpSlug));// If no id match, search heading text
if(!tmpTarget){let tmpHeadings=tmpContentBody.querySelectorAll('h1, h2, h3, h4, h5, h6');for(let i=0;i<tmpHeadings.length;i++){let tmpHeadingText=tmpHeadings[i].textContent||'';let tmpHeadingSlug=tmpHeadingText.toLowerCase().replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-');if(tmpHeadingSlug===tmpSlug){tmpTarget=tmpHeadings[i];break;}}}if(tmpTarget){tmpTarget.scrollIntoView({behavior:'smooth',block:'start'});}},50);}// ================================================================
// Full-text search
// ================================================================
/**
	 * Load a lunr.js keyword index from a URL.
	 *
	 * The index file is the same format generated by Indoctrinate's
	 * generate_keyword_index command: { LunrIndex, Documents, DocumentCount }.
	 *
	 * @param {string} pURL - URL to the retold-keyword-index.json file
	 * @param {Function} [fCallback] - Callback when done
	 */_loadSearchIndex(pURL,fCallback){let tmpCallback=typeof fCallback==='function'?fCallback:()=>{};let tmpSelf=this;if(typeof fetch==='undefined'){return tmpCallback();}fetch(pURL).then(pResponse=>{if(!pResponse.ok){return null;}return pResponse.json();}).then(pIndexData=>{if(!pIndexData||!pIndexData.LunrIndex||!pIndexData.Documents){if(tmpSelf.log)tmpSelf.log.info('InlineDocumentation: No keyword index found; search unavailable.');return tmpCallback();}try{tmpSelf._LunrIndex=libLunr.Index.load(pIndexData.LunrIndex);tmpSelf._SearchDocuments=pIndexData.Documents;let tmpState=tmpSelf.pict.AppData.InlineDocumentation;if(tmpState){tmpState.SearchIndexLoaded=true;}if(tmpSelf.log)tmpSelf.log.info('InlineDocumentation: Search index loaded ('+(pIndexData.DocumentCount||0)+' documents).');}catch(pError){if(tmpSelf.log)tmpSelf.log.warn('InlineDocumentation: Error hydrating lunr index: '+pError);}return tmpCallback();}).catch(pError=>{if(tmpSelf.log)tmpSelf.log.warn('InlineDocumentation: Error loading search index: '+pError);return tmpCallback();});}/**
	 * Search the loaded lunr index.
	 *
	 * @param {string} pQuery - The search query
	 * @returns {Array} Array of { Key, Title, Group, DocPath, Score }
	 */search(pQuery){if(!this._LunrIndex||!this._SearchDocuments||!pQuery||!pQuery.trim()){return[];}let tmpResults=[];try{let tmpLunrResults=this._LunrIndex.search(pQuery);for(let i=0;i<tmpLunrResults.length;i++){let tmpRef=tmpLunrResults[i].ref;let tmpScore=tmpLunrResults[i].score;let tmpDoc=this._SearchDocuments[tmpRef];if(!tmpDoc){continue;}tmpResults.push({Key:tmpRef,Title:tmpDoc.Title||tmpRef,Group:tmpDoc.Group||'',Module:tmpDoc.Module||'',DocPath:tmpDoc.DocPath||tmpRef,Score:tmpScore});}}catch(pError){if(this.log)this.log.warn('InlineDocumentation: Search error: '+pError);}return tmpResults;}// ================================================================
// External link resolution (catalog-based)
// ================================================================
/**
	 * Check if a path is an external reference.
	 *
	 * Paths that started with / in the sidebar are cross-module
	 * references. They get normalized during parsing (leading /
	 * stripped), but they contain 2+ path segments (group/module/).
	 * Simple filenames like README.md are local.
	 *
	 * An ExternalDocBaseURL must be configured for this to return true.
	 *
	 * @param {string} pPath - The normalized document path
	 * @returns {boolean}
	 */isExternalPath(pPath){if(!pPath)return false;let tmpState=this.pict.AppData.InlineDocumentation;if(!tmpState||!tmpState.ExternalDocBaseURL)return false;// Paths with 2+ segments (e.g., pict/pict/, fable/fable/)
// are cross-module references. Simple filenames are local.
let tmpPath=pPath.replace(/^\.\//,'').replace(/^\//,'');let tmpParts=tmpPath.split('/').filter(p=>p.length>0);return tmpParts.length>=2;}/**
	 * Resolve an external path to a full URL.
	 *
	 * @param {string} pPath - The document path
	 * @returns {string|null} The external URL, or null if not external
	 */resolveExternalURL(pPath){if(!this.isExternalPath(pPath))return null;let tmpState=this.pict.AppData.InlineDocumentation;let tmpBaseURL=tmpState&&tmpState.ExternalDocBaseURL||'';if(!tmpBaseURL)return null;let tmpPath=pPath.replace(/^\.\//,'').replace(/^\//,'');return tmpBaseURL+tmpPath;}/**
	 * After sidebar is loaded, mark items that are external
	 * references with External: true and ExternalURL.
	 */_markExternalSidebarItems(){let tmpState=this.pict.AppData.InlineDocumentation;if(!tmpState||!tmpState.ExternalDocBaseURL)return;let tmpGroups=tmpState.SidebarGroups||[];for(let i=0;i<tmpGroups.length;i++){let tmpItems=tmpGroups[i].Items||[];for(let j=0;j<tmpItems.length;j++){let tmpItem=tmpItems[j];if(this.isExternalPath(tmpItem.Path)){tmpItem.External=true;tmpItem.ExternalURL=this.resolveExternalURL(tmpItem.Path);}}}}/**
	 * Extract h2 and h3 headings from the rendered content body.
	 *
	 * Queries #InlineDoc-Content-Body for heading elements, extracts
	 * their text, generates slugified IDs for anchor scrolling, and
	 * stores the results in AppData for the nav outline.
	 *
	 * @returns {Array} Array of { Text, Slug, Level }
	 */_extractHeadings(){let tmpHeadings=[];if(typeof document==='undefined'){return tmpHeadings;}let tmpContentBody=document.getElementById('InlineDoc-Content-Body');if(!tmpContentBody){return tmpHeadings;}let tmpElements=tmpContentBody.querySelectorAll('h2, h3');for(let i=0;i<tmpElements.length;i++){let tmpElement=tmpElements[i];let tmpText=(tmpElement.textContent||'').trim();let tmpLevel=parseInt(tmpElement.tagName.substring(1),10);let tmpSlug=tmpText.toLowerCase().replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-');// Assign the ID to the heading element if not already set
// so scrollIntoView can find it
if(!tmpElement.id){tmpElement.id=tmpSlug;}tmpHeadings.push({Text:tmpText,Slug:tmpSlug,Level:tmpLevel});}let tmpState=this.pict.AppData.InlineDocumentation;if(tmpState){tmpState.ActiveDocumentHeadings=tmpHeadings;}return tmpHeadings;}// -- Internal methods --
/**
	 * Fetch a markdown document and convert it to HTML.
	 *
	 * @param {string} pURL - The URL to fetch
	 * @param {Function} fCallback - Callback receiving (error, htmlContent)
	 */_fetchDocument(pURL,fCallback){let tmpCallback=typeof fCallback==='function'?fCallback:()=>{};if(!pURL){return tmpCallback('No URL provided','');}// Check cache
if(this._ContentCache[pURL]){return tmpCallback(null,this._ContentCache[pURL].html);}fetch(pURL).then(pResponse=>{if(!pResponse.ok){return null;}return pResponse.text();}).then(pMarkdown=>{if(!pMarkdown){return tmpCallback('Document not found','');}let tmpHTML=this._ContentProvider.parseMarkdown(pMarkdown,this._createLinkResolver(),this._createImageResolver(pURL));this._ContentCache[pURL]={html:tmpHTML,markdown:pMarkdown};return tmpCallback(null,tmpHTML);}).catch(pError=>{this.log.warn("InlineDocumentation: Error fetching [".concat(pURL,"]: ").concat(pError));return tmpCallback(pError,'');});}/**
	 * Create a link resolver that converts internal doc links to provider API calls.
	 *
	 * Internal links (relative .md paths) get converted to javascript:void(0) with
	 * a data attribute so the content view's click handler can intercept them and
	 * call loadDocument().
	 *
	 * @returns {Function} A link resolver callback
	 */_createLinkResolver(){return(pHref,pLinkText)=>{// Only intercept internal markdown links
if(pHref.match(/^https?:\/\//)){// External link — open in new tab
return{href:pHref,target:'_blank',rel:'noopener'};}// help: prefix — internal documentation link (e.g. help:book-list.md#section)
if(pHref.match(/^help:/)){let tmpHelpPath=pHref.replace(/^help:/,'');return{href:'javascript:void(0)',target:'',rel:'pict-inline-doc-link:'+tmpHelpPath};}// Internal doc link — mark for interception
let tmpPath=pHref.replace(/^\.\//,'').replace(/^\//,'');return{href:'javascript:void(0)',// Use a data attribute for the click handler
// The content view will wire up click interception
target:'',rel:'pict-inline-doc-link:'+tmpPath};};}/**
	 * Create a link resolver for tooltip content.
	 *
	 * Handles help:path.md#anchor links that open documents in the help
	 * panel. These links get a special rel attribute so click handlers
	 * can intercept them.
	 *
	 * External links open in a new tab. All other links are treated as
	 * help: links within the tooltip context.
	 *
	 * @returns {Function} A link resolver callback
	 */_createTooltipLinkResolver(){return(pHref,pLinkText)=>{// External links — open in new tab
if(pHref.match(/^https?:\/\//)){return{href:pHref,target:'_blank',rel:'noopener'};}// Strip help: prefix if present
let tmpPath=pHref.replace(/^help:/,'');// Clean relative prefixes
tmpPath=tmpPath.replace(/^\.\//,'').replace(/^\//,'');return{href:'javascript:void(0)',target:'',rel:'pict-inline-doc-help:'+tmpPath};};}/**
	 * Create an image resolver closure.
	 *
	 * @param {string} pDocURL - The URL the document was fetched from
	 * @returns {Function} An image resolver callback
	 */_createImageResolver(pDocURL){let tmpBaseDir='';if(pDocURL){let tmpLastSlash=pDocURL.lastIndexOf('/');if(tmpLastSlash>=0){tmpBaseDir=pDocURL.substring(0,tmpLastSlash+1);}}return(pSrc,pAlt)=>{if(pSrc.match(/^https?:\/\//)||pSrc.match(/^data:/)||pSrc.match(/^\//)){return pSrc;}return tmpBaseDir+pSrc;};}/**
	 * Load and parse _sidebar.md from the docs base URL.
	 *
	 * @param {Function} fCallback - Callback when done
	 */_loadSidebar(fCallback){let tmpCallback=typeof fCallback==='function'?fCallback:()=>{};let tmpState=this.pict.AppData.InlineDocumentation;let tmpDocsBase=tmpState.DocsBaseURL||'';fetch(tmpDocsBase+'_sidebar.md').then(pResponse=>{if(!pResponse.ok){return null;}return pResponse.text();}).then(pMarkdown=>{if(!pMarkdown){this.log.info('InlineDocumentation: No _sidebar.md found.');return tmpCallback();}tmpState.SidebarGroups=this._parseSidebarMarkdown(pMarkdown);return tmpCallback();}).catch(pError=>{this.log.warn("InlineDocumentation: Error loading _sidebar.md: ".concat(pError));return tmpCallback();});}/**
	 * Load topic definitions from a JSON file.
	 *
	 * Expected format:
	 *   {
	 *     "getting-started": {
	 *       "Name": "Getting Started",
	 *       "Documents": ["README.md", "getting-started.md"]
	 *     }
	 *   }
	 *
	 * @param {string} [pTopicsURL] - URL to fetch topics from (defaults to DocsBaseURL + '_topics.json')
	 * @param {Function} fCallback - Callback when done
	 */_loadTopics(pTopicsURL,fCallback){let tmpCallback=typeof fCallback==='function'?fCallback:()=>{};let tmpState=this.pict.AppData.InlineDocumentation;let tmpDocsBase=tmpState.DocsBaseURL||'';let tmpURL=pTopicsURL||tmpDocsBase+'_topics.json';fetch(tmpURL).then(pResponse=>{if(!pResponse.ok){return null;}return pResponse.json();}).then(pTopics=>{if(pTopics){tmpState.Topics=pTopics;this.log.info("InlineDocumentation: Topics loaded (".concat(Object.keys(pTopics).length," topics)."));}else{this.log.info('InlineDocumentation: No _topics.json found.');}return tmpCallback();}).catch(pError=>{this.log.info("InlineDocumentation: No topics loaded (".concat(pError,")."));return tmpCallback();});}/**
	 * Parse _sidebar.md into a navigation structure.
	 *
	 * Returns an array of group objects:
	 *   [{ Name, Key, Path, Items: [{ Name, Path }] }]
	 *
	 * @param {string} pMarkdown - Raw _sidebar.md content
	 * @returns {Array} Parsed sidebar groups
	 */_parseSidebarMarkdown(pMarkdown){let tmpGroups=[];let tmpCurrentGroup=null;let tmpLines=pMarkdown.split('\n');for(let i=0;i<tmpLines.length;i++){let tmpLine=tmpLines[i];if(!tmpLine.trim()){continue;}let tmpIndentMatch=tmpLine.match(/^(\s*)/);let tmpIndent=tmpIndentMatch?tmpIndentMatch[1].length:0;let tmpContent=tmpLine.trim();let tmpListMatch=tmpContent.match(/^[-*+]\s+(.*)/);if(!tmpListMatch){continue;}let tmpItemContent=tmpListMatch[1].trim();let tmpLinkMatch=tmpItemContent.match(/^\[([^\]]+)\]\(([^)]+)\)/);if(tmpIndent<2){// Top-level item — group header
if(tmpLinkMatch){let tmpName=tmpLinkMatch[1].trim();let tmpPath=tmpLinkMatch[2].trim();tmpCurrentGroup={Name:tmpName,Key:tmpName.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,''),Path:this._normalizePath(tmpPath),Items:[]};tmpGroups.push(tmpCurrentGroup);}else{tmpCurrentGroup={Name:tmpItemContent,Key:tmpItemContent.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,''),Path:'',Items:[]};tmpGroups.push(tmpCurrentGroup);}}else if(tmpCurrentGroup){// Indented item — document within the current group
if(tmpLinkMatch){tmpCurrentGroup.Items.push({Name:tmpLinkMatch[1].trim(),Path:this._normalizePath(tmpLinkMatch[2].trim())});}else{tmpCurrentGroup.Items.push({Name:tmpItemContent,Path:''});}}}return tmpGroups;}/**
	 * Normalize a document path from sidebar links.
	 * Strips leading slashes and ./ prefixes.
	 *
	 * @param {string} pPath - The raw path
	 * @returns {string} The normalized path
	 */_normalizePath(pPath){if(!pPath){return'';}return pPath.replace(/^\.\//,'').replace(/^\//,'');}/**
	 * Get an error page HTML block for a missing document.
	 *
	 * @param {string} pPath - The path that was not found
	 * @returns {string} HTML to display
	 */_getErrorPageHTML(pPath){let tmpPath=this._ContentProvider.escapeHTML(pPath||'unknown');return'<div class="pict-inline-doc-not-found">'+'<h2>Page Not Found</h2>'+'<p>The document <code>'+tmpPath+'</code> could not be loaded.</p>'+'</div>';}}const _DefaultConfiguration={ProviderIdentifier:"Pict-InlineDocumentation",AutoInitialize:true,AutoInitializeOrdinal:0};module.exports=InlineDocumentationProvider;module.exports.default_configuration=_DefaultConfiguration;},{"../views/Pict-View-InlineDocumentation-Content.js":26,"../views/Pict-View-InlineDocumentation-Layout.js":27,"../views/Pict-View-InlineDocumentation-Nav.js":28,"../views/Pict-View-InlineDocumentation-TopicManager.js":29,"lunr":10,"pict-provider":14,"pict-section-content":19,"pict-section-markdowneditor":49,"pict-section-modal":63}],26:[function(require,module,exports){const libPictContentView=require('pict-section-content');const _ViewConfiguration={ViewIdentifier:"InlineDoc-Content",DefaultRenderable:"InlineDoc-Content-Display",DefaultContentDestinationAddress:"#InlineDoc-Content-Container",AutoRender:false,CSS:/*css*/"\n\t\t.pict-inline-doc-content {\n\t\t\tpadding: 1em 1.25em;\n\t\t\tmax-width: 100%;\n\t\t\tword-wrap: break-word;\n\t\t\toverflow-wrap: break-word;\n\t\t}\n\t\t.pict-inline-doc-content-loading {\n\t\t\tdisplay: flex;\n\t\t\talign-items: center;\n\t\t\tjustify-content: center;\n\t\t\tmin-height: 150px;\n\t\t\tcolor: var(--theme-color-text-muted, #8A7F72);\n\t\t\tfont-size: 0.95em;\n\t\t}\n\t\t.pict-inline-doc-content h1 {\n\t\t\tfont-size: 1.75em;\n\t\t\tcolor: var(--theme-color-text-primary, #3D3229);\n\t\t\tborder-bottom: 1px solid var(--theme-color-border-default, #DDD6CA);\n\t\t\tpadding-bottom: 0.3em;\n\t\t\tmargin-top: 0;\n\t\t}\n\t\t.pict-inline-doc-content h2 {\n\t\t\tfont-size: 1.35em;\n\t\t\tcolor: var(--theme-color-text-primary, #3D3229);\n\t\t\tborder-bottom: 1px solid var(--theme-color-border-light, #EAE3D8);\n\t\t\tpadding-bottom: 0.2em;\n\t\t\tmargin-top: 1.25em;\n\t\t}\n\t\t.pict-inline-doc-content h3 {\n\t\t\tfont-size: 1.15em;\n\t\t\tcolor: var(--theme-color-text-primary, #3D3229);\n\t\t\tmargin-top: 1em;\n\t\t}\n\t\t.pict-inline-doc-content h4, .pict-inline-doc-content h5, .pict-inline-doc-content h6 {\n\t\t\tcolor: var(--theme-color-text-secondary, #5E5549);\n\t\t\tmargin-top: 0.8em;\n\t\t}\n\t\t.pict-inline-doc-content p {\n\t\t\tline-height: 1.65;\n\t\t\tcolor: var(--theme-color-text-primary, #423D37);\n\t\t\tmargin: 0.6em 0;\n\t\t}\n\t\t.pict-inline-doc-content a {\n\t\t\tcolor: var(--theme-color-brand-primary, #2E7D74);\n\t\t\ttext-decoration: none;\n\t\t\tcursor: pointer;\n\t\t}\n\t\t.pict-inline-doc-content a:hover {\n\t\t\ttext-decoration: underline;\n\t\t}\n\t\t/* Code blocks: bg + text both flow from background/text tokens\n\t\t   so they re-skin coherently across themes. (Previous version\n\t\t   paired background-tertiary with text-on-brand \u2014 both light\n\t\t   in most palettes, producing invisible text.) */\n\t\t.pict-inline-doc-content pre {\n\t\t\tbackground: var(--theme-color-background-tertiary, #F0ECE4);\n\t\t\tcolor:      var(--theme-color-text-primary,        #3D3229);\n\t\t\tpadding: 1em;\n\t\t\tborder-radius: 5px;\n\t\t\toverflow-x: auto;\n\t\t\tline-height: 1.5;\n\t\t\tfont-size: 0.85em;\n\t\t\tmax-width: 100%;\n\t\t}\n\t\t.pict-inline-doc-content code {\n\t\t\tbackground: var(--theme-color-background-tertiary, #F0ECE4);\n\t\t\tpadding: 0.15em 0.35em;\n\t\t\tborder-radius: 3px;\n\t\t\tfont-size: 0.85em;\n\t\t\tcolor: var(--theme-color-brand-accent, #9E6B47);\n\t\t}\n\t\t.pict-inline-doc-content pre code {\n\t\t\tbackground: none;\n\t\t\tpadding: 0;\n\t\t\tcolor: inherit;\n\t\t\tfont-size: inherit;\n\t\t}\n\t\t.pict-inline-doc-content blockquote {\n\t\t\tborder-left: 3px solid var(--theme-color-brand-primary, #2E7D74);\n\t\t\tmargin: 0.8em 0;\n\t\t\tpadding: 0.4em 0.8em;\n\t\t\tbackground: var(--theme-color-background-secondary, #F7F5F0);\n\t\t\tcolor: var(--theme-color-text-secondary, #5E5549);\n\t\t}\n\t\t.pict-inline-doc-content blockquote p {\n\t\t\tmargin: 0.2em 0;\n\t\t}\n\t\t.pict-inline-doc-content ul, .pict-inline-doc-content ol {\n\t\t\tpadding-left: 1.8em;\n\t\t\tline-height: 1.7;\n\t\t}\n\t\t.pict-inline-doc-content li {\n\t\t\tmargin: 0.2em 0;\n\t\t\tcolor: var(--theme-color-text-primary, #423D37);\n\t\t}\n\t\t.pict-inline-doc-content hr {\n\t\t\tborder: none;\n\t\t\tborder-top: 1px solid var(--theme-color-border-default, #DDD6CA);\n\t\t\tmargin: 1.5em 0;\n\t\t}\n\t\t.pict-inline-doc-content table {\n\t\t\twidth: 100%;\n\t\t\tborder-collapse: collapse;\n\t\t\tmargin: 0.8em 0;\n\t\t\tdisplay: block;\n\t\t\toverflow-x: auto;\n\t\t}\n\t\t.pict-inline-doc-content table th {\n\t\t\tbackground: var(--theme-color-background-secondary, #F5F0E8);\n\t\t\tborder: 1px solid var(--theme-color-border-default, #DDD6CA);\n\t\t\tpadding: 0.5em 0.7em;\n\t\t\ttext-align: left;\n\t\t\tfont-weight: 600;\n\t\t\tcolor: var(--theme-color-text-primary, #3D3229);\n\t\t}\n\t\t.pict-inline-doc-content table td {\n\t\t\tborder: 1px solid var(--theme-color-border-default, #DDD6CA);\n\t\t\tpadding: 0.4em 0.7em;\n\t\t\tcolor: var(--theme-color-text-primary, #423D37);\n\t\t}\n\t\t.pict-inline-doc-content table tr:nth-child(even) {\n\t\t\tbackground: var(--theme-color-background-secondary, #F7F5F0);\n\t\t}\n\t\t.pict-inline-doc-content img {\n\t\t\tmax-width: 100%;\n\t\t\theight: auto;\n\t\t}\n\t\t.pict-inline-doc-not-found {\n\t\t\ttext-align: center;\n\t\t\tpadding: 2em 1em;\n\t\t\tcolor: var(--theme-color-text-secondary, #5E5549);\n\t\t}\n\t\t.pict-inline-doc-not-found h2 {\n\t\t\tcolor: var(--theme-color-text-muted, #8A7F72);\n\t\t\tfont-size: 1.3em;\n\t\t\tborder-bottom: none;\n\t\t}\n\t\t.pict-inline-doc-not-found code {\n\t\t\tbackground: var(--theme-color-background-tertiary, #F0ECE4);\n\t\t\tpadding: 0.15em 0.35em;\n\t\t\tborder-radius: 3px;\n\t\t\tfont-size: 0.85em;\n\t\t\tcolor: var(--theme-color-brand-accent, #9E6B47);\n\t\t}\n\t\t/* Code block action buttons (copy, fullscreen) from pict-section-content */\n\t\t.pict-content-code-actions {\n\t\t\tposition: sticky;\n\t\t\ttop: 64px;\n\t\t\talign-self: flex-start;\n\t\t\tdisplay: flex;\n\t\t\tflex-direction: column;\n\t\t\tgap: 6px;\n\t\t\tflex: 0 0 auto;\n\t\t\tpadding-top: 6px;\n\t\t\topacity: 0;\n\t\t\ttransform: translateX(-4px);\n\t\t\ttransition: opacity 0.15s ease, transform 0.15s ease;\n\t\t\tpointer-events: none;\n\t\t}\n\t\t.pict-content-code-container:hover .pict-content-code-actions,\n\t\t.pict-content-code-container:focus-within .pict-content-code-actions {\n\t\t\topacity: 1;\n\t\t\ttransform: translateX(0);\n\t\t\tpointer-events: auto;\n\t\t}\n\t\t.pict-content-code-action-btn {\n\t\t\tdisplay: inline-flex;\n\t\t\talign-items: center;\n\t\t\tjustify-content: center;\n\t\t\twidth: 28px;\n\t\t\theight: 28px;\n\t\t\tpadding: 0;\n\t\t\tbackground: var(--theme-color-background-panel, #FFFFFF);\n\t\t\tcolor: var(--theme-color-text-secondary, #5E5549);\n\t\t\tborder: 1px solid var(--theme-color-border-default, #DDD6CA);\n\t\t\tborder-radius: 6px;\n\t\t\tcursor: pointer;\n\t\t\tbox-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);\n\t\t\ttransition: background-color 0.15s ease, color 0.15s ease;\n\t\t}\n\t\t.pict-content-code-action-btn svg {\n\t\t\tdisplay: block;\n\t\t\twidth: 14px;\n\t\t\theight: 14px;\n\t\t\tstroke: currentColor;\n\t\t\tfill: none;\n\t\t\tstroke-width: 1.6;\n\t\t\tstroke-linecap: round;\n\t\t\tstroke-linejoin: round;\n\t\t}\n\t\t.pict-content-code-action-btn:hover {\n\t\t\tbackground: var(--theme-color-brand-primary, #2E7D74);\n\t\t\tcolor: var(--theme-color-text-on-brand, #FFFFFF);\n\t\t\tborder-color: var(--theme-color-brand-primary, #2E7D74);\n\t\t}\n\t\t.pict-content-code-action-btn.is-copied {\n\t\t\tbackground: var(--theme-color-brand-primary, #2E7D74);\n\t\t\tcolor: var(--theme-color-text-on-brand, #FFFFFF);\n\t\t\tborder-color: var(--theme-color-brand-primary, #2E7D74);\n\t\t}\n\t\t.pict-inline-doc-edit-toolbar {\n\t\t\tdisplay: none;\n\t\t\talign-items: center;\n\t\t\tgap: 0.4em;\n\t\t\tpadding: 0.4em 0.6em;\n\t\t\tmargin-bottom: 0.5em;\n\t\t\tbackground: var(--theme-color-background-secondary, #F5F0E8);\n\t\t\tborder: 1px solid var(--theme-color-border-default, #E5DED4);\n\t\t\tborder-radius: 4px;\n\t\t\tfont-size: 0.8em;\n\t\t}\n\t\t.pict-inline-doc-edit-toolbar.visible {\n\t\t\tdisplay: flex;\n\t\t}\n\t\t.pict-inline-doc-edit-toolbar .edit-label {\n\t\t\tcolor: var(--theme-color-text-muted, #8A7F72);\n\t\t\tmargin-right: auto;\n\t\t}\n\t\t.pict-inline-doc-edit-btn {\n\t\t\tdisplay: inline-flex;\n\t\t\talign-items: center;\n\t\t\tjustify-content: center;\n\t\t\tpadding: 0.25em 0.6em;\n\t\t\tborder: 1px solid var(--theme-color-border-default, #D4A373);\n\t\t\tborder-radius: 3px;\n\t\t\tbackground: var(--theme-color-background-panel,    #fff);\n\t\t\tcolor: var(--theme-color-text-secondary, #5E5549);\n\t\t\tfont-size: 0.9em;\n\t\t\tcursor: pointer;\n\t\t\ttransition: background 0.1s;\n\t\t}\n\t\t.pict-inline-doc-edit-btn:hover {\n\t\t\tbackground: var(--theme-color-background-tertiary, #F0ECE4);\n\t\t}\n\t\t.pict-inline-doc-edit-btn.primary {\n\t\t\tbackground: var(--theme-color-brand-primary, #2E7D74);\n\t\t\tcolor: var(--theme-color-text-on-brand, #fff);\n\t\t\tborder-color: var(--theme-color-brand-primary, #2E7D74);\n\t\t}\n\t\t.pict-inline-doc-edit-btn.primary:hover {\n\t\t\tbackground: var(--theme-color-brand-primary-hover, #266D65);\n\t\t}\n\t\t.pict-inline-doc-edit-btn .btn-icon {\n\t\t\tmargin-right: 0.3em;\n\t\t}\n\t\t#InlineDoc-Editor-Container {\n\t\t\tmin-height: 300px;\n\t\t}\n\t\t/* Tooltip placeholder: edit mode indicators */\n\t\t[data-d-tooltip].pict-inline-doc-tooltip-edit-target {\n\t\t\toutline: 1px dashed var(--theme-color-brand-primary, #2E7D74);\n\t\t\toutline-offset: 2px;\n\t\t\tcursor: pointer;\n\t\t\tposition: relative;\n\t\t}\n\t\t[data-d-tooltip].pict-inline-doc-tooltip-edit-target:not([data-d-tooltip-icon])::after {\n\t\t\tcontent: '?';\n\t\t\tposition: absolute;\n\t\t\ttop: -6px;\n\t\t\tright: -6px;\n\t\t\twidth: 14px;\n\t\t\theight: 14px;\n\t\t\tbackground: var(--theme-color-brand-primary, #2E7D74);\n\t\t\tcolor: var(--theme-color-text-on-brand, #fff);\n\t\t\tborder-radius: 50%;\n\t\t\tfont-size: 9px;\n\t\t\tline-height: 14px;\n\t\t\ttext-align: center;\n\t\t\tfont-weight: 700;\n\t\t\tpointer-events: none;\n\t\t}\n\t\t/* Tooltip placeholder: default icon */\n\t\t.pict-inline-doc-tooltip-icon {\n\t\t\tdisplay: inline-flex;\n\t\t\talign-items: center;\n\t\t\tjustify-content: center;\n\t\t\twidth: 16px;\n\t\t\theight: 16px;\n\t\t\tfont-size: 12px;\n\t\t\tcolor: var(--theme-color-brand-primary, #2E7D74);\n\t\t\tcursor: pointer;\n\t\t\tvertical-align: middle;\n\t\t}\n\t\t/* Empty icon tooltip in edit mode */\n\t\t.pict-inline-doc-tooltip-empty .pict-inline-doc-tooltip-icon {\n\t\t\topacity: 0.4;\n\t\t\toutline: 1px dashed var(--theme-color-text-muted, #8A7F72);\n\t\t\toutline-offset: 1px;\n\t\t\tborder-radius: 50%;\n\t\t}\n\t\t/* Tooltip editor textarea in modal */\n\t\t.pict-inline-doc-tooltip-editor-textarea {\n\t\t\twidth: 100%;\n\t\t\tmin-height: 120px;\n\t\t\tpadding: 0.6em;\n\t\t\tfont-family: 'SFMono-Regular', 'SF Mono', 'Menlo', 'Consolas', monospace;\n\t\t\tfont-size: 0.85em;\n\t\t\tline-height: 1.5;\n\t\t\tcolor: var(--theme-color-text-primary, #3D3229);\n\t\t\tbackground: var(--theme-color-background-panel,    #FDFCFA);\n\t\t\tborder: 1px solid var(--theme-color-border-default, #DDD6CA);\n\t\t\tborder-radius: 4px;\n\t\t\tresize: vertical;\n\t\t\tbox-sizing: border-box;\n\t\t}\n\t\t.pict-inline-doc-tooltip-editor-textarea:focus {\n\t\t\toutline: none;\n\t\t\tborder-color: var(--theme-color-brand-primary, #2E7D74);\n\t\t\tbox-shadow: 0 0 0 2px rgba(46, 125, 116, 0.15);\n\t\t}\n\t\t.pict-inline-doc-tooltip-preview {\n\t\t\tmargin-top: 0.5em;\n\t\t\tpadding: 0.5em 0.7em;\n\t\t\tbackground: var(--theme-color-background-secondary, #F5F0E8);\n\t\t\tborder: 1px solid var(--theme-color-border-default, #E5DED4);\n\t\t\tborder-radius: 4px;\n\t\t\tfont-size: 0.9em;\n\t\t\tmin-height: 2em;\n\t\t\tcolor: var(--theme-color-text-primary, #3D3229);\n\t\t}\n\t\t.pict-inline-doc-tooltip-preview-label {\n\t\t\tfont-size: 0.75em;\n\t\t\tcolor: var(--theme-color-text-muted, #8A7F72);\n\t\t\ttext-transform: uppercase;\n\t\t\tletter-spacing: 0.03em;\n\t\t\tmargin-bottom: 0.3em;\n\t\t}\n\t",Templates:[{Hash:"InlineDoc-Content-Template",Template:/*html*/"\n<div class=\"pict-inline-doc-edit-toolbar\" id=\"InlineDoc-Edit-Toolbar\">\n\t<span class=\"edit-label\" id=\"InlineDoc-Edit-Label\">View mode</span>\n\t<button class=\"pict-inline-doc-edit-btn\" id=\"InlineDoc-Edit-Toggle\" title=\"Edit this document\"><span class=\"btn-icon\"><svg width=\"1em\" height=\"1em\" viewBox=\"0 0 16 16\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M11.5 1.5l3 3L5 14H2v-3z\"/><line x1=\"9\" y1=\"4\" x2=\"12\" y2=\"7\"/></svg></span> Edit</button>\n\t<button class=\"pict-inline-doc-edit-btn primary\" id=\"InlineDoc-Edit-Save\" style=\"display:none\"><span class=\"btn-icon\"><svg width=\"1em\" height=\"1em\" viewBox=\"0 0 16 16\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"3,8 6.5,11.5 13,4.5\"/></svg></span> Save</button>\n\t<button class=\"pict-inline-doc-edit-btn\" id=\"InlineDoc-Edit-Cancel\" style=\"display:none\"><span class=\"btn-icon\"><svg width=\"1em\" height=\"1em\" viewBox=\"0 0 16 16\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\"><line x1=\"4\" y1=\"4\" x2=\"12\" y2=\"12\"/><line x1=\"12\" y1=\"4\" x2=\"4\" y2=\"12\"/></svg></span> Cancel</button>\n</div>\n<div class=\"pict-inline-doc-content pict-content\" id=\"InlineDoc-Content-Body\">\n\t<div class=\"pict-inline-doc-content-loading\">Loading...</div>\n</div>\n"}],Renderables:[{RenderableHash:"InlineDoc-Content-Display",TemplateHash:"InlineDoc-Content-Template",ContentDestinationAddress:"#InlineDoc-Content-Container",RenderMethod:"replace"}]};class InlineDocumentationContentView extends libPictContentView{constructor(pFable,pOptions,pServiceHash){super(pFable,pOptions,pServiceHash);}onAfterRender(){this.renderEditToolbar();return super.onAfterRender();}/**
	 * Display parsed HTML content in the content area.
	 *
	 * @param {string} pHTMLContent - The HTML to display
	 */displayContent(pHTMLContent){super.displayContent(pHTMLContent,'InlineDoc-Content-Body');// Wire up click interception for internal doc links
this._wireInternalLinks();// Update the edit toolbar state
this.renderEditToolbar();}/**
	 * Show a loading indicator.
	 */showLoading(){super.showLoading('Loading...','InlineDoc-Content-Body');}/**
	 * Show or hide the edit toolbar based on EditEnabled state.
	 */renderEditToolbar(){if(typeof document==='undefined'){return;}let tmpToolbar=document.getElementById('InlineDoc-Edit-Toolbar');if(!tmpToolbar){return;}let tmpState=this.pict.AppData.InlineDocumentation;if(!tmpState){return;}if(tmpState.EditEnabled&&tmpState.CurrentPath){tmpToolbar.classList.add('visible');}else{tmpToolbar.classList.remove('visible');}// Update button visibility based on editing state
let tmpToggleBtn=document.getElementById('InlineDoc-Edit-Toggle');let tmpSaveBtn=document.getElementById('InlineDoc-Edit-Save');let tmpCancelBtn=document.getElementById('InlineDoc-Edit-Cancel');let tmpLabel=document.getElementById('InlineDoc-Edit-Label');if(tmpState.Editing){if(tmpToggleBtn){tmpToggleBtn.style.display='none';}if(tmpSaveBtn){tmpSaveBtn.style.display='';}if(tmpCancelBtn){tmpCancelBtn.style.display='';}if(tmpLabel){tmpLabel.textContent='Editing: '+(tmpState.EditingPath||'');}}else{if(tmpToggleBtn){tmpToggleBtn.style.display='';}if(tmpSaveBtn){tmpSaveBtn.style.display='none';}if(tmpCancelBtn){tmpCancelBtn.style.display='none';}if(tmpLabel){tmpLabel.textContent=tmpState.CurrentPath||'View mode';}}// Re-wire click handlers (DOM may have been recreated by render)
this._wireEditToolbar();}/**
	 * Show the markdown editor with the raw markdown content.
	 *
	 * @param {string} pMarkdown - The raw markdown to edit
	 */showEditor(pMarkdown){if(typeof document==='undefined'){return;}let tmpContainer=document.getElementById('InlineDoc-Content-Body');if(!tmpContainer){return;}// Create a container for the markdown editor view to render into
tmpContainer.innerHTML='<div id="InlineDoc-Editor-Container"></div>';// Set up the editor segments data for the markdown editor
if(!this.pict.AppData.InlineDocumentation){this.pict.AppData.InlineDocumentation={};}this.pict.AppData.InlineDocumentation.EditorSegments=[{Content:pMarkdown||''}];// Render the markdown editor view into the container
let tmpEditorView=this.pict.views['InlineDoc-MarkdownEditor'];if(tmpEditorView){tmpEditorView.render();}this.renderEditToolbar();}/**
	 * Hide the textarea editor.
	 */hideEditor(){// The editor will be replaced by displayContent, but update toolbar state
this.renderEditToolbar();}/**
	 * Wire click handlers for the edit toolbar buttons.
	 */_wireEditToolbar(){if(typeof document==='undefined'){return;}let tmpProvider=this.pict.providers['Pict-InlineDocumentation'];let tmpToggleBtn=document.getElementById('InlineDoc-Edit-Toggle');if(tmpToggleBtn){tmpToggleBtn.addEventListener('click',()=>{if(tmpProvider){tmpProvider.beginEdit();}});}let tmpSaveBtn=document.getElementById('InlineDoc-Edit-Save');if(tmpSaveBtn){tmpSaveBtn.addEventListener('click',()=>{if(tmpProvider){tmpProvider.saveEdit();}});}let tmpCancelBtn=document.getElementById('InlineDoc-Edit-Cancel');if(tmpCancelBtn){tmpCancelBtn.addEventListener('click',()=>{if(tmpProvider){tmpProvider.cancelEdit();}});}}/**
	 * Wire click handlers on internal documentation links.
	 *
	 * Links with rel="pict-inline-doc-link:path" are intercepted and
	 * routed through the provider's loadDocument() method.
	 */_wireInternalLinks(){if(typeof document==='undefined'){return;}let tmpContainer=document.getElementById('InlineDoc-Content-Body');if(!tmpContainer){return;}let tmpLinks=tmpContainer.querySelectorAll('a[rel^="pict-inline-doc-link:"]');let tmpProvider=this.pict.providers['Pict-InlineDocumentation'];for(let i=0;i<tmpLinks.length;i++){let tmpLink=tmpLinks[i];let tmpRel=tmpLink.getAttribute('rel');let tmpPath=tmpRel.replace('pict-inline-doc-link:','');// Check if this is a cross-module link that should open externally
if(tmpProvider&&typeof tmpProvider.isExternalPath==='function'&&tmpProvider.isExternalPath(tmpPath)){let tmpExternalURL=tmpProvider.resolveExternalURL(tmpPath);if(tmpExternalURL){tmpLink.setAttribute('href',tmpExternalURL);tmpLink.setAttribute('target','_blank');tmpLink.setAttribute('rel','noopener');continue;}}tmpLink.addEventListener('click',pEvent=>{pEvent.preventDefault();if(tmpProvider){tmpProvider.loadDocument(tmpPath);}});}}}module.exports=InlineDocumentationContentView;module.exports.default_configuration=_ViewConfiguration;},{"pict-section-content":19}],27:[function(require,module,exports){const libPictView=require('pict-view');const _ViewConfiguration={ViewIdentifier:"InlineDoc-Layout",DefaultRenderable:"InlineDoc-Layout-Container",DefaultContentDestinationAddress:"#InlineDoc-Container",AutoRender:false,CSS:/*css*/"\n\t\t.pict-inline-doc {\n\t\t\tdisplay: flex;\n\t\t\tflex-direction: row;\n\t\t\twidth: 100%;\n\t\t\theight: 100%;\n\t\t\tmin-height: 300px;\n\t\t\tfont-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;\n\t\t\tfont-size: 15px;\n\t\t\tcolor: var(--theme-color-text-primary, #423D37);\n\t\t\tbackground: var(--theme-color-background-panel,    #FDFCFA);\n\t\t\tborder: 1px solid var(--theme-color-border-default, #E5DED4);\n\t\t\tborder-radius: 6px;\n\t\t\toverflow: hidden;\n\t\t}\n\t\t.pict-inline-doc-nav-container {\n\t\t\twidth: 240px;\n\t\t\tmin-width: 200px;\n\t\t\tmax-width: 300px;\n\t\t\tborder-right: 1px solid var(--theme-color-border-default, #E5DED4);\n\t\t\tbackground: var(--theme-color-background-secondary, #F7F5F0);\n\t\t\toverflow-y: auto;\n\t\t\tflex-shrink: 0;\n\t\t}\n\t\t.pict-inline-doc-content-container {\n\t\t\tflex: 1;\n\t\t\toverflow-y: auto;\n\t\t\toverflow-x: hidden;\n\t\t\tmin-width: 0;\n\t\t}\n\t\t.pict-inline-doc-nav-container.pict-inline-doc-nav-hidden {\n\t\t\tdisplay: none;\n\t\t}\n\t\t/* Compact mode: stack nav above content when container is narrow */\n\t\t.pict-inline-doc.pict-inline-doc-compact {\n\t\t\tflex-direction: column;\n\t\t}\n\t\t.pict-inline-doc.pict-inline-doc-compact .pict-inline-doc-nav-container {\n\t\t\twidth: 100%;\n\t\t\tmin-width: 0;\n\t\t\tmax-width: none;\n\t\t\tborder-right: none;\n\t\t\tborder-bottom: 1px solid var(--theme-color-border-default, #E5DED4);\n\t\t\toverflow-y: visible;\n\t\t\tflex-shrink: 0;\n\t\t}\n\t",Templates:[{Hash:"InlineDoc-Layout-Template",Template:/*html*/"\n<div class=\"pict-inline-doc\">\n\t<div class=\"pict-inline-doc-nav-container\" id=\"InlineDoc-Nav-Container\"></div>\n\t<div class=\"pict-inline-doc-content-container\" id=\"InlineDoc-Content-Container\"></div>\n</div>\n"}],Renderables:[{RenderableHash:"InlineDoc-Layout-Container",TemplateHash:"InlineDoc-Layout-Template",ContentDestinationAddress:"#InlineDoc-Container",RenderMethod:"replace"}]};class InlineDocumentationLayoutView extends libPictView{constructor(pFable,pOptions,pServiceHash){super(pFable,pOptions,pServiceHash);}onAfterRender(){// Inject all view CSS into the PICT-CSS style element
this.pict.CSSMap.injectCSS();// Watch for size changes and toggle compact mode
this._setupCompactModeObserver();return super.onAfterRender();}/**
	 * Set up a ResizeObserver to toggle compact mode when the container
	 * is too narrow for a side-by-side nav + content layout.
	 *
	 * Below the threshold, the nav switches to a horizontal top bar.
	 */_setupCompactModeObserver(){if(typeof document==='undefined'||typeof ResizeObserver==='undefined'){return;}let tmpContainer=document.querySelector('.pict-inline-doc');if(!tmpContainer){return;}// Clean up any previous observer
if(this._resizeObserver){this._resizeObserver.disconnect();}let tmpCompactThreshold=550;this._resizeObserver=new ResizeObserver(pEntries=>{for(let i=0;i<pEntries.length;i++){let tmpWidth=pEntries[i].contentRect.width;if(tmpWidth<tmpCompactThreshold){tmpContainer.classList.add('pict-inline-doc-compact');}else{tmpContainer.classList.remove('pict-inline-doc-compact');}}});this._resizeObserver.observe(tmpContainer);// Also do an immediate check
let tmpWidth=tmpContainer.offsetWidth;if(tmpWidth>0&&tmpWidth<tmpCompactThreshold){tmpContainer.classList.add('pict-inline-doc-compact');}}}module.exports=InlineDocumentationLayoutView;module.exports.default_configuration=_ViewConfiguration;},{"pict-view":23}],28:[function(require,module,exports){const libPictView=require('pict-view');const _ViewConfiguration={ViewIdentifier:"InlineDoc-Nav",DefaultRenderable:"InlineDoc-Nav-Display",DefaultContentDestinationAddress:"#InlineDoc-Nav-Container",AutoRender:false,CSS:/*css*/"\n\t\t.pict-inline-doc-nav {\n\t\t\tdisplay: flex;\n\t\t\tflex-direction: column;\n\t\t\theight: 100%;\n\t\t}\n\t\t.pict-inline-doc-nav-collapsed-header {\n\t\t\tdisplay: flex;\n\t\t\talign-items: center;\n\t\t\tpadding: 0.5em 0.8em;\n\t\t\tcursor: pointer;\n\t\t\tborder-bottom: 1px solid var(--theme-color-border-light, #EAE3D8);\n\t\t\tbackground: var(--theme-color-background-secondary, #F7F5F0);\n\t\t\tuser-select: none;\n\t\t}\n\t\t.pict-inline-doc-nav-collapsed-header:hover {\n\t\t\tbackground: var(--theme-color-background-tertiary, #EDE8DF);\n\t\t}\n\t\t.pict-inline-doc-nav-chevron {\n\t\t\tfont-size: 0.6em;\n\t\t\ttransition: transform 0.2s ease;\n\t\t\tcolor: var(--theme-color-text-muted, #8A7F72);\n\t\t\tdisplay: inline-flex;\n\t\t\talign-items: center;\n\t\t\tmargin-right: 0.5em;\n\t\t}\n\t\t.pict-inline-doc-nav-chevron.expanded {\n\t\t\ttransform: rotate(90deg);\n\t\t}\n\t\t.pict-inline-doc-nav-current-title {\n\t\t\tfont-size: 0.9em;\n\t\t\tfont-weight: 500;\n\t\t\tcolor: var(--theme-color-text-primary, #3D3229);\n\t\t\toverflow: hidden;\n\t\t\ttext-overflow: ellipsis;\n\t\t\twhite-space: nowrap;\n\t\t\tflex: 1;\n\t\t}\n\t\t.pict-inline-doc-nav-outline {\n\t\t\tdisplay: none;\n\t\t\toverflow-y: auto;\n\t\t}\n\t\t.pict-inline-doc-nav-outline.expanded {\n\t\t\tdisplay: block;\n\t\t}\n\t\t.pict-inline-doc-nav-filter {\n\t\t\tpadding: 0.3em 0.6em;\n\t\t\tborder-bottom: 1px solid var(--theme-color-border-light, #EAE3D8);\n\t\t}\n\t\t.pict-inline-doc-nav-filter input {\n\t\t\twidth: 100%;\n\t\t\tbox-sizing: border-box;\n\t\t\tpadding: 0.3em 0.5em;\n\t\t\tborder: 1px solid var(--theme-color-border-default, #DDD6CA);\n\t\t\tborder-radius: 3px;\n\t\t\tfont-size: 0.85em;\n\t\t\toutline: none;\n\t\t}\n\t\t.pict-inline-doc-nav-filter input:focus {\n\t\t\tborder-color: var(--theme-color-brand-primary, #2E7D74);\n\t\t}\n\t\t.pict-inline-doc-nav-group {\n\t\t\tmargin-bottom: 0;\n\t\t}\n\t\t.pict-inline-doc-nav-group-header {\n\t\t\tdisplay: flex;\n\t\t\talign-items: center;\n\t\t\tpadding: 0.4em 0.8em;\n\t\t\tfont-weight: 600;\n\t\t\tfont-size: 0.7em;\n\t\t\tcolor: var(--theme-color-text-secondary, #5E5549);\n\t\t\ttext-transform: uppercase;\n\t\t\tletter-spacing: 0.03em;\n\t\t\tcursor: pointer;\n\t\t\tuser-select: none;\n\t\t}\n\t\t.pict-inline-doc-nav-group-header:hover {\n\t\t\tcolor: var(--theme-color-text-primary, #3D3229);\n\t\t\tbackground: var(--theme-color-background-tertiary, #F0ECE4);\n\t\t}\n\t\t.pict-inline-doc-nav-group-toggle {\n\t\t\tmargin-right: 0.35em;\n\t\t\tdisplay: inline-flex;\n\t\t\talign-items: center;\n\t\t\tjustify-content: center;\n\t\t\twidth: 0.85em;\n\t\t\theight: 0.85em;\n\t\t\tcolor: currentColor;\n\t\t\ttransition: transform 0.15s ease;\n\t\t}\n\t\t.pict-inline-doc-nav-group-toggle svg {\n\t\t\twidth: 100%;\n\t\t\theight: 100%;\n\t\t\tdisplay: block;\n\t\t}\n\t\t.pict-inline-doc-nav-group-toggle.collapsed {\n\t\t\ttransform: rotate(-90deg);\n\t\t}\n\t\t.pict-inline-doc-nav-group.collapsed .pict-inline-doc-nav-group-items {\n\t\t\tdisplay: none;\n\t\t}\n\t\t.pict-inline-doc-nav-item {\n\t\t\tdisplay: block;\n\t\t\tpadding: 0.25em 0.8em 0.25em 1.6em;\n\t\t\tcolor: var(--theme-color-text-secondary, #5E5549);\n\t\t\ttext-decoration: none;\n\t\t\tfont-size: 0.85em;\n\t\t\tcursor: pointer;\n\t\t\tborder-left: 3px solid transparent;\n\t\t\ttransition: background 0.1s ease, border-color 0.1s ease;\n\t\t}\n\t\t.pict-inline-doc-nav-item:hover {\n\t\t\tbackground: var(--theme-color-background-tertiary, #EDE8DF);\n\t\t}\n\t\t.pict-inline-doc-nav-item.active {\n\t\t\tbackground: var(--theme-color-background-hover, #E8E3D8);\n\t\t\tcolor: var(--theme-color-brand-primary, #2E7D74);\n\t\t\tborder-left-color: var(--theme-color-brand-primary, #2E7D74);\n\t\t\tfont-weight: 500;\n\t\t}\n\t\t.pict-inline-doc-nav-heading {\n\t\t\tdisplay: block;\n\t\t\tpadding: 0.15em 0.8em 0.15em 2.4em;\n\t\t\tcolor: var(--theme-color-text-muted, #8A7F72);\n\t\t\tfont-size: 0.78em;\n\t\t\tcursor: pointer;\n\t\t\tborder-left: 3px solid transparent;\n\t\t\ttransition: background 0.1s ease, color 0.1s ease;\n\t\t}\n\t\t.pict-inline-doc-nav-heading:hover {\n\t\t\tbackground: var(--theme-color-background-tertiary, #EDE8DF);\n\t\t\tcolor: var(--theme-color-text-secondary, #5E5549);\n\t\t}\n\t\t.pict-inline-doc-nav-heading.h3 {\n\t\t\tpadding-left: 3.2em;\n\t\t\tfont-size: 0.72em;\n\t\t}\n\t\t/* Search icon in collapsed header */\n\t\t.pict-inline-doc-nav-search-icon {\n\t\t\tdisplay: inline-flex;\n\t\t\talign-items: center;\n\t\t\tcolor: var(--theme-color-text-muted, #8A7F72);\n\t\t\topacity: 0.5;\n\t\t\ttransition: opacity 0.2s;\n\t\t\tflex-shrink: 0;\n\t\t\tmargin-left: 0.3em;\n\t\t}\n\t\t.pict-inline-doc-nav-search-icon:hover {\n\t\t\topacity: 1;\n\t\t\tcolor: var(--theme-color-brand-primary, #2E7D74);\n\t\t}\n\t\t/* Search results section */\n\t\t.pict-inline-doc-nav-search-results {\n\t\t\tborder-bottom: 1px solid var(--theme-color-border-light, #EAE3D8);\n\t\t\tpadding: 0.3em 0;\n\t\t}\n\t\t.pict-inline-doc-nav-search-status {\n\t\t\tpadding: 0.2em 0.8em;\n\t\t\tfont-size: 0.7em;\n\t\t\tcolor: var(--theme-color-text-muted, #8A7F72);\n\t\t\ttext-transform: uppercase;\n\t\t\tletter-spacing: 0.03em;\n\t\t}\n\t\t.pict-inline-doc-nav-search-result {\n\t\t\tdisplay: flex;\n\t\t\talign-items: baseline;\n\t\t\tpadding: 0.25em 0.8em 0.25em 1.2em;\n\t\t\tcursor: pointer;\n\t\t\tfont-size: 0.82em;\n\t\t\tcolor: var(--theme-color-text-primary, #3D3229);\n\t\t\ttext-decoration: none;\n\t\t\ttransition: background 0.1s ease;\n\t\t\tgap: 0.5em;\n\t\t}\n\t\t.pict-inline-doc-nav-search-result:hover {\n\t\t\tbackground: var(--theme-color-background-tertiary, #EDE8DF);\n\t\t}\n\t\t.pict-inline-doc-nav-search-result-title {\n\t\t\tflex: 1;\n\t\t\toverflow: hidden;\n\t\t\ttext-overflow: ellipsis;\n\t\t\twhite-space: nowrap;\n\t\t}\n\t\t.pict-inline-doc-nav-search-result-group {\n\t\t\tfont-size: 0.75em;\n\t\t\tcolor: var(--theme-color-text-muted, #8A7F72);\n\t\t\twhite-space: nowrap;\n\t\t}\n\t\t/* External link indicator */\n\t\t.pict-inline-doc-nav-item-external {\n\t\t\tcolor: var(--theme-color-text-muted, #8A7F72);\n\t\t}\n\t\t.pict-inline-doc-nav-item-external:hover {\n\t\t\tcolor: var(--theme-color-brand-primary, #2E7D74);\n\t\t}\n\t\t.pict-inline-doc-nav-external-icon {\n\t\t\tdisplay: inline;\n\t\t\tmargin-left: 0.3em;\n\t\t\topacity: 0.5;\n\t\t\tvertical-align: -0.05em;\n\t\t}\n\t\t.pict-inline-doc-nav-topic-badge {\n\t\t\tdisplay: inline-block;\n\t\t\tmargin: 0.5em 1em;\n\t\t\tpadding: 0.3em 0.7em;\n\t\t\tbackground: var(--theme-color-brand-primary, #2E7D74);\n\t\t\tcolor: var(--theme-color-text-on-brand, #fff);\n\t\t\tborder-radius: 4px;\n\t\t\tfont-size: 0.8em;\n\t\t\tfont-weight: 500;\n\t\t}\n\t\t.pict-inline-doc-nav-topic-clear {\n\t\t\tmargin-left: 0.5em;\n\t\t\tcursor: pointer;\n\t\t\topacity: 0.8;\n\t\t}\n\t\t.pict-inline-doc-nav-topic-clear:hover {\n\t\t\topacity: 1;\n\t\t}\n\t\t.pict-inline-doc-nav-toolbar {\n\t\t\tdisplay: flex;\n\t\t\talign-items: center;\n\t\t\tgap: 0.3em;\n\t\t\tpadding: 0.3em 1em;\n\t\t\tborder-bottom: 1px solid var(--theme-color-border-light, #EAE3D8);\n\t\t}\n\t\t.pict-inline-doc-nav-toolbar-btn {\n\t\t\tdisplay: inline-flex;\n\t\t\talign-items: center;\n\t\t\tjustify-content: center;\n\t\t\twidth: 28px;\n\t\t\theight: 28px;\n\t\t\tborder: 1px solid var(--theme-color-border-default, #DDD6CA);\n\t\t\tborder-radius: 3px;\n\t\t\tbackground: var(--theme-color-background-panel,    #fff);\n\t\t\tcolor: var(--theme-color-text-secondary, #5E5549);\n\t\t\tfont-size: 0.9em;\n\t\t\tcursor: pointer;\n\t\t\ttransition: background 0.1s, border-color 0.1s;\n\t\t}\n\t\t.pict-inline-doc-nav-toolbar-btn:hover {\n\t\t\tbackground: var(--theme-color-background-tertiary, #F0ECE4);\n\t\t\tborder-color: var(--theme-color-border-default, #C4BDB3);\n\t\t}\n\t\t.pict-inline-doc-nav-toolbar-btn.accent {\n\t\t\tborder-color: var(--theme-color-brand-primary, #2E7D74);\n\t\t\tcolor: var(--theme-color-brand-primary, #2E7D74);\n\t\t}\n\t\t.pict-inline-doc-nav-toolbar-btn.accent:hover {\n\t\t\tbackground: var(--theme-color-background-hover, #F0F9F7);\n\t\t}\n\t\t.pict-inline-doc-nav-toolbar-btn.active {\n\t\t\tbackground: var(--theme-color-brand-primary, #2E7D74);\n\t\t\tcolor: var(--theme-color-text-on-brand, #fff);\n\t\t\tborder-color: var(--theme-color-brand-primary, #2E7D74);\n\t\t}\n\t\t.pict-inline-doc-nav-toolbar-btn.active:hover {\n\t\t\tbackground: var(--theme-color-brand-primary-hover, #266D65);\n\t\t}\n\t\t.pict-inline-doc-nav-toolbar-spacer {\n\t\t\tflex: 1;\n\t\t}\n\t",Templates:[{Hash:"InlineDoc-Nav-Template",Template:/*html*/"<div class=\"pict-inline-doc-nav\" id=\"InlineDoc-Nav-Body\"></div>"}],Renderables:[{RenderableHash:"InlineDoc-Nav-Display",TemplateHash:"InlineDoc-Nav-Template",ContentDestinationAddress:"#InlineDoc-Nav-Container",RenderMethod:"replace"}]};class InlineDocumentationNavView extends libPictView{constructor(pFable,pOptions,pServiceHash){super(pFable,pOptions,pServiceHash);}onAfterRender(){this._renderNavigation();return super.onAfterRender();}/**
	 * Build and inject the navigation HTML into the nav body.
	 */_renderNavigation(){if(typeof document==='undefined'){return;}let tmpContainer=document.getElementById('InlineDoc-Nav-Body');if(!tmpContainer){return;}let tmpState=this.pict.AppData.InlineDocumentation;if(!tmpState){return;}let tmpProvider=this.pict.providers['Pict-InlineDocumentation'];let tmpHeadings=[];if(tmpProvider&&typeof tmpProvider._extractHeadings==='function'){tmpHeadings=tmpProvider._extractHeadings();}let tmpCurrentPath=tmpState.CurrentPath||'';let tmpIsCollapsed=tmpState.NavCollapsed!==false;let tmpFilterText=tmpState.NavFilterText||'';let tmpCurrentDocName=this._resolveCurrentDocName(tmpState,tmpCurrentPath);let tmpHTML='';let tmpSearchQuery=tmpState.SearchQuery||'';let tmpSearchResults=tmpState.SearchResults||[];// 1. Collapsed header with search icon
let tmpChevronClass='pict-inline-doc-nav-chevron'+(tmpIsCollapsed?'':' expanded');tmpHTML+='<div class="pict-inline-doc-nav-collapsed-header">';tmpHTML+='<span class="'+tmpChevronClass+'" id="InlineDoc-Nav-CollapseToggle">';tmpHTML+='<svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6,3 11,8 6,13"/></svg>';tmpHTML+='</span>';tmpHTML+='<span class="pict-inline-doc-nav-current-title" id="InlineDoc-Nav-TitleToggle">'+this._escapeHTML(tmpCurrentDocName)+'</span>';tmpHTML+='<span class="pict-inline-doc-nav-search-icon" id="InlineDoc-Nav-SearchBtn" title="Search documentation">';tmpHTML+='<svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="7" cy="7" r="4.5"/><line x1="10.5" y1="10.5" x2="14" y2="14"/></svg>';tmpHTML+='</span>';tmpHTML+='</div>';// 2. Outline body
let tmpOutlineClass='pict-inline-doc-nav-outline'+(tmpIsCollapsed?'':' expanded');tmpHTML+='<div class="'+tmpOutlineClass+'" id="InlineDoc-Nav-Outline">';// Search / filter input
let tmpPlaceholder=tmpState.SearchIndexLoaded?'Search documentation...':'Filter...';tmpHTML+='<div class="pict-inline-doc-nav-filter">';tmpHTML+='<input type="text" id="InlineDoc-Nav-FilterInput" placeholder="'+tmpPlaceholder+'" value="'+this._escapeHTML(tmpSearchQuery||tmpFilterText)+'" />';tmpHTML+='</div>';// Search results (when full-text search is active)
if(tmpSearchResults.length>0&&tmpSearchQuery){tmpHTML+='<div class="pict-inline-doc-nav-search-results">';tmpHTML+='<div class="pict-inline-doc-nav-search-status">'+tmpSearchResults.length+' result'+(tmpSearchResults.length!==1?'s':'')+'</div>';for(let i=0;i<tmpSearchResults.length&&i<15;i++){let tmpResult=tmpSearchResults[i];tmpHTML+='<a class="pict-inline-doc-nav-search-result" data-search-path="'+this._escapeHTML(tmpResult.DocPath)+'">';tmpHTML+='<span class="pict-inline-doc-nav-search-result-title">'+this._escapeHTML(tmpResult.Title)+'</span>';if(tmpResult.Group){tmpHTML+='<span class="pict-inline-doc-nav-search-result-group">'+this._escapeHTML(tmpResult.Group)+'</span>';}tmpHTML+='</a>';}tmpHTML+='</div>';}// Topic badge
tmpHTML+=this._renderTopicBadge(tmpState);// Toolbar
tmpHTML+=this._renderToolbar(tmpState);// Group tree
tmpHTML+=this._renderGroupTree(tmpState,tmpCurrentPath,tmpHeadings,tmpFilterText);tmpHTML+='</div>';tmpContainer.innerHTML=tmpHTML;// Wire up click handlers
this._wireClickHandlers(tmpContainer);}/**
	 * Resolve the display name for the currently loaded document.
	 *
	 * Searches SidebarGroups for a matching item name; falls back to the path.
	 *
	 * @param {object} pState - The InlineDocumentation state
	 * @param {string} pCurrentPath - The current document path
	 * @returns {string} The resolved document name
	 */_resolveCurrentDocName(pState,pCurrentPath){if(!pCurrentPath){return'Documentation';}let tmpGroups=pState.SidebarGroups||[];for(let i=0;i<tmpGroups.length;i++){let tmpGroup=tmpGroups[i];// Check if the group itself matches
if(tmpGroup.Path&&tmpGroup.Path===pCurrentPath){return tmpGroup.Name||pCurrentPath;}let tmpItems=tmpGroup.Items||[];for(let j=0;j<tmpItems.length;j++){if(tmpItems[j].Path===pCurrentPath){return tmpItems[j].Name||pCurrentPath;}}}return pCurrentPath;}/**
	 * Render the topic badge HTML if a topic is active.
	 *
	 * @param {object} pState - The InlineDocumentation state
	 * @returns {string} HTML string for the topic badge, or empty string
	 */_renderTopicBadge(pState){let tmpActiveTopic=pState.Topic;if(!tmpActiveTopic||!pState.Topics||!pState.Topics[tmpActiveTopic]){return'';}let tmpTopicDef=pState.Topics[tmpActiveTopic];let tmpTopicName=tmpTopicDef.TopicTitle||tmpTopicDef.Name||tmpActiveTopic;let tmpHTML='<div class="pict-inline-doc-nav-topic-badge">'+this._escapeHTML(tmpTopicName)+'<span class="pict-inline-doc-nav-topic-clear" id="InlineDoc-Nav-ClearTopic">'+'<svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">'+'<line x1="4" y1="4" x2="12" y2="12"/><line x1="12" y1="4" x2="4" y2="12"/>'+'</svg></span>'+'</div>';return tmpHTML;}/**
	 * Render the topic management toolbar HTML.
	 *
	 * @param {object} pState - The InlineDocumentation state
	 * @returns {string} HTML string for the toolbar, or empty string
	 */_renderToolbar(pState){if(!pState.TopicManagerEnabled){return'';}let tmpHTML='<div class="pict-inline-doc-nav-toolbar">';tmpHTML+='<button class="pict-inline-doc-nav-toolbar-btn" id="InlineDoc-Nav-ManageTopics" title="Manage Topics">'+'<svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">'+'<circle cx="8" cy="8" r="2.5"/>'+'<path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41"/>'+'</svg></button>';if(pState.CurrentRoute){tmpHTML+='<button class="pict-inline-doc-nav-toolbar-btn accent" id="InlineDoc-Nav-BindTopic" title="Bind topic to current route">'+'<svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">'+'<path d="M6.5 9.5a3.5 3.5 0 005 0l2-2a3.5 3.5 0 00-5-5l-1 1"/>'+'<path d="M9.5 6.5a3.5 3.5 0 00-5 0l-2 2a3.5 3.5 0 005 5l1-1"/>'+'</svg></button>';}let tmpTooltipEditActive=pState.TooltipEditMode?' active':'';tmpHTML+='<button class="pict-inline-doc-nav-toolbar-btn'+tmpTooltipEditActive+'" id="InlineDoc-Nav-TooltipEditMode" title="Toggle tooltip edit mode">'+'<svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">'+'<path d="M14 10a1.5 1.5 0 01-1.5 1.5H4l-3 3V3A1.5 1.5 0 012.5 1.5h10A1.5 1.5 0 0114 3z"/>'+'</svg></button>';tmpHTML+='<span class="pict-inline-doc-nav-toolbar-spacer"></span>';tmpHTML+='</div>';return tmpHTML;}/**
	 * Build the group/item/heading tree HTML.
	 *
	 * @param {object} pState - The InlineDocumentation state
	 * @param {string} pCurrentPath - The current document path
	 * @param {Array} pHeadings - Array of { Text, Slug, Level } from _extractHeadings
	 * @param {string} pFilterText - The current filter text
	 * @returns {string} HTML string for the group tree
	 */_renderGroupTree(pState,pCurrentPath,pHeadings,pFilterText){let tmpHTML='';let tmpGroups=pState.SidebarGroups||[];let tmpActiveTopic=pState.Topic;let tmpTopicDocuments=null;let tmpFilterLower=(pFilterText||'').toLowerCase();// Resolve topic document filter
if(tmpActiveTopic&&pState.Topics&&pState.Topics[tmpActiveTopic]){let tmpTopicDef=pState.Topics[tmpActiveTopic];if(tmpTopicDef.TopicHelpFilePath){tmpTopicDocuments=[tmpTopicDef.TopicHelpFilePath];}else if(tmpTopicDef.Documents){tmpTopicDocuments=tmpTopicDef.Documents;}else{tmpTopicDocuments=[];}}for(let i=0;i<tmpGroups.length;i++){let tmpGroup=tmpGroups[i];let tmpGroupItems=tmpGroup.Items||[];// Apply topic filter
if(tmpTopicDocuments){tmpGroupItems=tmpGroupItems.filter(pItem=>{return tmpTopicDocuments.indexOf(pItem.Path)>=0;});let tmpGroupMatches=tmpTopicDocuments.indexOf(tmpGroup.Path)>=0;if(tmpGroupItems.length<1&&!tmpGroupMatches){continue;}}// Apply text filter — match item names AND headings of the active document
if(tmpFilterLower){tmpGroupItems=tmpGroupItems.filter(pItem=>{if((pItem.Name||'').toLowerCase().indexOf(tmpFilterLower)>=0){return true;}// For the active document, also check heading text
if(pItem.Path===pCurrentPath&&pHeadings.length>0){for(let h=0;h<pHeadings.length;h++){if((pHeadings[h].Text||'').toLowerCase().indexOf(tmpFilterLower)>=0){return true;}}}return false;});let tmpGroupNameMatches=(tmpGroup.Name||'').toLowerCase().indexOf(tmpFilterLower)>=0;if(tmpGroupItems.length<1&&!tmpGroupNameMatches){continue;}}let tmpGroupKey=tmpGroup.Key||tmpGroup.Name||'group-'+i;let tmpIsGroupCollapsed=pState.CollapsedGroups&&pState.CollapsedGroups[tmpGroupKey];let tmpGroupClass='pict-inline-doc-nav-group'+(tmpIsGroupCollapsed?' collapsed':'');let tmpToggleClass='pict-inline-doc-nav-group-toggle'+(tmpIsGroupCollapsed?' collapsed':'');tmpHTML+='<div class="'+tmpGroupClass+'" data-group="'+this._escapeHTML(tmpGroupKey)+'">';tmpHTML+='<div class="pict-inline-doc-nav-group-header">';tmpHTML+='<span class="'+tmpToggleClass+'" aria-hidden="true">'+'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" '+'stroke-linecap="round" stroke-linejoin="round">'+'<polyline points="3 6 8 11 13 6"/>'+'</svg></span>';tmpHTML+=this._escapeHTML(tmpGroup.Name);tmpHTML+='</div>';tmpHTML+='<div class="pict-inline-doc-nav-group-items">';// If the group itself has a path, show it as the first item
if(tmpGroup.Path){let tmpActive=pCurrentPath===tmpGroup.Path?' active':'';tmpHTML+='<a class="pict-inline-doc-nav-item'+tmpActive+'" data-doc-path="'+this._escapeHTML(tmpGroup.Path)+'">'+this._escapeHTML(tmpGroup.Name)+'</a>';// If this is the active item, render heading sub-items
if(pCurrentPath===tmpGroup.Path){tmpHTML+=this._renderHeadingSubItems(pHeadings,tmpFilterLower);}}for(let j=0;j<tmpGroupItems.length;j++){let tmpItem=tmpGroupItems[j];if(!tmpItem.Path){tmpHTML+='<span class="pict-inline-doc-nav-item">'+this._escapeHTML(tmpItem.Name)+'</span>';continue;}if(tmpItem.External&&tmpItem.ExternalURL){// External link — opens in a new tab
tmpHTML+='<a class="pict-inline-doc-nav-item pict-inline-doc-nav-item-external'+'" data-external-url="'+this._escapeHTML(tmpItem.ExternalURL)+'">'+this._escapeHTML(tmpItem.Name)+'<svg class="pict-inline-doc-nav-external-icon" width="0.75em" height="0.75em" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1h4"/><polyline points="8,2 14,2 14,8"/><line x1="14" y1="2" x2="7" y2="9"/></svg>'+'</a>';}else{let tmpActive=pCurrentPath===tmpItem.Path?' active':'';tmpHTML+='<a class="pict-inline-doc-nav-item'+tmpActive+'" data-doc-path="'+this._escapeHTML(tmpItem.Path)+'">'+this._escapeHTML(tmpItem.Name)+'</a>';// If this is the active item, render heading sub-items
if(pCurrentPath===tmpItem.Path){tmpHTML+=this._renderHeadingSubItems(pHeadings,tmpFilterLower);}}}tmpHTML+='</div>';tmpHTML+='</div>';}return tmpHTML;}/**
	 * Render heading sub-items (h2 and h3) beneath the active nav item.
	 *
	 * @param {Array} pHeadings - Array of { Text, Slug, Level }
	 * @param {string} pFilterText - Lowercase filter text
	 * @returns {string} HTML string for heading sub-items
	 */_renderHeadingSubItems(pHeadings,pFilterText){if(!pHeadings||pHeadings.length<1){return'';}let tmpHTML='';for(let i=0;i<pHeadings.length;i++){let tmpHeading=pHeadings[i];let tmpText=tmpHeading.Text||'';// Apply filter
if(pFilterText&&tmpText.toLowerCase().indexOf(pFilterText)<0){continue;}let tmpLevelClass=tmpHeading.Level===3?' h3':'';tmpHTML+='<a class="pict-inline-doc-nav-heading'+tmpLevelClass+'" data-heading-slug="'+this._escapeHTML(tmpHeading.Slug)+'">'+this._escapeHTML(tmpText)+'</a>';}return tmpHTML;}/**
	 * Wire click handlers on navigation items, group headers, and controls.
	 *
	 * @param {HTMLElement} pContainer - The nav container element
	 */_wireClickHandlers(pContainer){let tmpProvider=this.pict.providers['Pict-InlineDocumentation'];let tmpState=this.pict.AppData.InlineDocumentation;let tmpSelf=this;// Collapse toggle (chevron)
let tmpCollapseToggle=pContainer.querySelector('#InlineDoc-Nav-CollapseToggle');if(tmpCollapseToggle){tmpCollapseToggle.addEventListener('click',()=>{if(tmpState){tmpState.NavCollapsed=!tmpState.NavCollapsed;}tmpSelf._renderNavigation();});}// Title click also toggles
let tmpTitleToggle=pContainer.querySelector('#InlineDoc-Nav-TitleToggle');if(tmpTitleToggle){tmpTitleToggle.addEventListener('click',()=>{if(tmpState){tmpState.NavCollapsed=!tmpState.NavCollapsed;}tmpSelf._renderNavigation();});}// Search icon — expands outline and focuses search input
let tmpSearchBtn=pContainer.querySelector('#InlineDoc-Nav-SearchBtn');if(tmpSearchBtn){tmpSearchBtn.addEventListener('click',pEvent=>{pEvent.stopPropagation();if(tmpState){tmpState.NavCollapsed=false;}tmpSelf._renderNavigation();let tmpInput=document.getElementById('InlineDoc-Nav-FilterInput');if(tmpInput){tmpInput.focus();}});}// Search / filter input
let tmpFilterInput=pContainer.querySelector('#InlineDoc-Nav-FilterInput');if(tmpFilterInput){let tmpDebounceTimer=null;tmpFilterInput.addEventListener('input',pEvent=>{let tmpValue=pEvent.target.value||'';if(tmpState){tmpState.NavFilterText=tmpValue;}// If search index is loaded, debounce full-text search
if(tmpState&&tmpState.SearchIndexLoaded&&tmpProvider&&typeof tmpProvider.search==='function'){if(tmpDebounceTimer)clearTimeout(tmpDebounceTimer);tmpDebounceTimer=setTimeout(()=>{tmpState.SearchQuery=tmpValue;tmpState.SearchResults=tmpValue.trim()?tmpProvider.search(tmpValue):[];tmpSelf._renderNavigation();let tmpNewInput=document.getElementById('InlineDoc-Nav-FilterInput');if(tmpNewInput){tmpNewInput.focus();let tmpLen=tmpNewInput.value.length;tmpNewInput.setSelectionRange(tmpLen,tmpLen);}},250);}else{// No search index — immediate client-side filter only
tmpSelf._renderNavigation();let tmpNewInput=document.getElementById('InlineDoc-Nav-FilterInput');if(tmpNewInput){tmpNewInput.focus();let tmpLen=tmpNewInput.value.length;tmpNewInput.setSelectionRange(tmpLen,tmpLen);}}});}// Search result clicks
let tmpSearchResults=pContainer.querySelectorAll('.pict-inline-doc-nav-search-result[data-search-path]');for(let i=0;i<tmpSearchResults.length;i++){let tmpResult=tmpSearchResults[i];tmpResult.addEventListener('click',pEvent=>{pEvent.preventDefault();let tmpPath=tmpResult.getAttribute('data-search-path');if(tmpProvider&&tmpPath){if(tmpState){tmpState.SearchQuery='';tmpState.SearchResults=[];tmpState.NavFilterText='';}tmpProvider.loadDocument(tmpPath);}});}// External links — open in new tab
let tmpExternalLinks=pContainer.querySelectorAll('[data-external-url]');for(let i=0;i<tmpExternalLinks.length;i++){let tmpExtLink=tmpExternalLinks[i];tmpExtLink.addEventListener('click',pEvent=>{pEvent.preventDefault();let tmpURL=tmpExtLink.getAttribute('data-external-url');if(tmpURL){window.open(tmpURL,'_blank');}});}// Document links
let tmpLinks=pContainer.querySelectorAll('.pict-inline-doc-nav-item[data-doc-path]');for(let i=0;i<tmpLinks.length;i++){let tmpLink=tmpLinks[i];tmpLink.addEventListener('click',pEvent=>{pEvent.preventDefault();let tmpPath=tmpLink.getAttribute('data-doc-path');if(tmpProvider&&tmpPath){// Clear filter when navigating
if(tmpState){tmpState.NavFilterText='';}tmpProvider.loadDocument(tmpPath);}});}// Heading links
let tmpHeadingLinks=pContainer.querySelectorAll('.pict-inline-doc-nav-heading[data-heading-slug]');for(let i=0;i<tmpHeadingLinks.length;i++){let tmpHeadingLink=tmpHeadingLinks[i];tmpHeadingLink.addEventListener('click',pEvent=>{pEvent.preventDefault();let tmpSlug=tmpHeadingLink.getAttribute('data-heading-slug');if(tmpProvider&&tmpSlug){tmpProvider._scrollToAnchor(tmpSlug);}});}// Group collapse toggle
let tmpHeaders=pContainer.querySelectorAll('.pict-inline-doc-nav-group-header');for(let i=0;i<tmpHeaders.length;i++){let tmpHeader=tmpHeaders[i];tmpHeader.addEventListener('click',()=>{let tmpGroup=tmpHeader.parentElement;if(tmpGroup){tmpGroup.classList.toggle('collapsed');// Persist collapse state
let tmpGroupKey=tmpGroup.getAttribute('data-group');if(tmpState&&tmpGroupKey){if(!tmpState.CollapsedGroups){tmpState.CollapsedGroups={};}let tmpToggle=tmpGroup.querySelector('.pict-inline-doc-nav-group-toggle');if(tmpGroup.classList.contains('collapsed')){tmpState.CollapsedGroups[tmpGroupKey]=true;if(tmpToggle){tmpToggle.classList.add('collapsed');}}else{delete tmpState.CollapsedGroups[tmpGroupKey];if(tmpToggle){tmpToggle.classList.remove('collapsed');}}}}});}// Topic clear button
let tmpClearBtn=pContainer.querySelector('#InlineDoc-Nav-ClearTopic');if(tmpClearBtn&&tmpProvider){tmpClearBtn.addEventListener('click',pEvent=>{pEvent.stopPropagation();tmpProvider.clearTopic();});}// Topic manager button
let tmpManageBtn=pContainer.querySelector('#InlineDoc-Nav-ManageTopics');if(tmpManageBtn){tmpManageBtn.addEventListener('click',pEvent=>{pEvent.stopPropagation();let tmpTopicManagerView=this.pict.views['InlineDoc-TopicManager'];if(tmpTopicManagerView){tmpTopicManagerView.showTopicManager();}});}// Tooltip edit mode toggle
let tmpTooltipEditBtn=pContainer.querySelector('#InlineDoc-Nav-TooltipEditMode');if(tmpTooltipEditBtn){tmpTooltipEditBtn.addEventListener('click',pEvent=>{pEvent.stopPropagation();let tmpDocProvider=this.pict.providers['Pict-InlineDocumentation'];if(tmpDocProvider){let tmpCurrentState=this.pict.AppData.InlineDocumentation;tmpDocProvider.setTooltipEditMode(!tmpCurrentState.TooltipEditMode);}});}// Bind topic to route button
let tmpBindBtn=pContainer.querySelector('#InlineDoc-Nav-BindTopic');if(tmpBindBtn){tmpBindBtn.addEventListener('click',pEvent=>{pEvent.stopPropagation();let tmpTopicManagerView=this.pict.views['InlineDoc-TopicManager'];if(tmpTopicManagerView){tmpTopicManagerView.showBindTopicToRoute();}});}}/**
	 * Escape HTML special characters.
	 *
	 * @param {string} pText - Text to escape
	 * @returns {string} Escaped text
	 */_escapeHTML(pText){if(!pText){return'';}return pText.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}}module.exports=InlineDocumentationNavView;module.exports.default_configuration=_ViewConfiguration;},{"pict-view":23}],29:[function(require,module,exports){const libPictView=require('pict-view');const _ViewConfiguration={ViewIdentifier:"InlineDoc-TopicManager",AutoRender:false,CSS:/*css*/"\n\t\t.pict-inline-doc-tm-topic-list {\n\t\t\tmax-height: 400px;\n\t\t\toverflow-y: auto;\n\t\t\tmargin: 0 -0.5em;\n\t\t}\n\t\t.pict-inline-doc-tm-topic-item {\n\t\t\tdisplay: flex;\n\t\t\talign-items: center;\n\t\t\tpadding: 0.6em 0.8em;\n\t\t\tborder-bottom: 1px solid var(--theme-color-border-light, #EAE3D8);\n\t\t\tcursor: pointer;\n\t\t\ttransition: background 0.1s;\n\t\t}\n\t\t.pict-inline-doc-tm-topic-item:hover {\n\t\t\tbackground: var(--theme-color-background-secondary, #F5F0E8);\n\t\t}\n\t\t.pict-inline-doc-tm-topic-item:last-child {\n\t\t\tborder-bottom: none;\n\t\t}\n\t\t.pict-inline-doc-tm-topic-info {\n\t\t\tflex: 1;\n\t\t\tmin-width: 0;\n\t\t}\n\t\t.pict-inline-doc-tm-topic-title {\n\t\t\tfont-weight: 600;\n\t\t\tcolor: var(--theme-color-text-primary, #3D3229);\n\t\t\tfont-size: 0.95em;\n\t\t}\n\t\t.pict-inline-doc-tm-topic-meta {\n\t\t\tfont-size: 0.8em;\n\t\t\tcolor: var(--theme-color-text-muted, #8A7F72);\n\t\t\tmargin-top: 0.15em;\n\t\t}\n\t\t.pict-inline-doc-tm-topic-actions {\n\t\t\tdisplay: flex;\n\t\t\tgap: 0.3em;\n\t\t\tflex-shrink: 0;\n\t\t}\n\t\t.pict-inline-doc-tm-action-btn {\n\t\t\tdisplay: inline-flex;\n\t\t\talign-items: center;\n\t\t\tjustify-content: center;\n\t\t\twidth: 28px;\n\t\t\theight: 28px;\n\t\t\tborder: 1px solid var(--theme-color-border-default, #DDD6CA);\n\t\t\tborder-radius: 3px;\n\t\t\tbackground: var(--theme-color-background-panel,    #fff);\n\t\t\tcolor: var(--theme-color-text-secondary, #5E5549);\n\t\t\tfont-size: 0.85em;\n\t\t\tcursor: pointer;\n\t\t\ttransition: background 0.1s, border-color 0.1s;\n\t\t}\n\t\t.pict-inline-doc-tm-action-btn:hover {\n\t\t\tbackground: var(--theme-color-background-tertiary, #F0ECE4);\n\t\t\tborder-color: var(--theme-color-border-default, #C4BDB3);\n\t\t}\n\t\t.pict-inline-doc-tm-action-btn.danger:hover {\n\t\t\tbackground: var(--theme-color-background-tertiary, #FDE8E8);\n\t\t\tborder-color: var(--theme-color-status-error, #E57373);\n\t\t\tcolor: var(--theme-color-status-error, #C62828);\n\t\t}\n\t\t.pict-inline-doc-tm-new-topic {\n\t\t\tdisplay: flex;\n\t\t\talign-items: center;\n\t\t\tjustify-content: center;\n\t\t\tpadding: 0.7em;\n\t\t\tmargin-top: 0.5em;\n\t\t\tborder: 1px dashed var(--theme-color-border-default, #DDD6CA);\n\t\t\tborder-radius: 4px;\n\t\t\tcolor: var(--theme-color-brand-primary, #2E7D74);\n\t\t\tfont-size: 0.9em;\n\t\t\tfont-weight: 500;\n\t\t\tcursor: pointer;\n\t\t\ttransition: background 0.1s, border-color 0.1s;\n\t\t}\n\t\t.pict-inline-doc-tm-new-topic:hover {\n\t\t\tbackground: var(--theme-color-background-hover, #F0F9F7);\n\t\t\tborder-color: var(--theme-color-brand-primary, #2E7D74);\n\t\t}\n\t\t.pict-inline-doc-tm-empty {\n\t\t\ttext-align: center;\n\t\t\tpadding: 2em 1em;\n\t\t\tcolor: var(--theme-color-text-muted, #8A7F72);\n\t\t\tfont-size: 0.9em;\n\t\t}\n\t\t.pict-inline-doc-tm-form-group {\n\t\t\tmargin-bottom: 0.8em;\n\t\t}\n\t\t.pict-inline-doc-tm-form-label {\n\t\t\tdisplay: block;\n\t\t\tfont-size: 0.8em;\n\t\t\tfont-weight: 600;\n\t\t\tcolor: var(--theme-color-text-secondary, #5E5549);\n\t\t\ttext-transform: uppercase;\n\t\t\tletter-spacing: 0.03em;\n\t\t\tmargin-bottom: 0.3em;\n\t\t}\n\t\t.pict-inline-doc-tm-form-input {\n\t\t\twidth: 100%;\n\t\t\tpadding: 0.45em 0.6em;\n\t\t\tfont-size: 0.9em;\n\t\t\tcolor: var(--theme-color-text-primary, #3D3229);\n\t\t\tbackground: var(--theme-color-background-panel,    #FDFCFA);\n\t\t\tborder: 1px solid var(--theme-color-border-default, #DDD6CA);\n\t\t\tborder-radius: 4px;\n\t\t\tbox-sizing: border-box;\n\t\t}\n\t\t.pict-inline-doc-tm-form-input:focus {\n\t\t\toutline: none;\n\t\t\tborder-color: var(--theme-color-brand-primary, #2E7D74);\n\t\t\tbox-shadow: 0 0 0 2px rgba(46, 125, 116, 0.15);\n\t\t}\n\t\t.pict-inline-doc-tm-form-input[readonly] {\n\t\t\tbackground: var(--theme-color-background-secondary, #F5F0E8);\n\t\t\tcolor: var(--theme-color-text-muted, #8A7F72);\n\t\t}\n\t\t.pict-inline-doc-tm-form-hint {\n\t\t\tfont-size: 0.75em;\n\t\t\tcolor: var(--theme-color-text-muted, #8A7F72);\n\t\t\tmargin-top: 0.2em;\n\t\t}\n\t\t.pict-inline-doc-tm-routes-section {\n\t\t\tmargin-top: 0.5em;\n\t\t}\n\t\t.pict-inline-doc-tm-route-chips {\n\t\t\tdisplay: flex;\n\t\t\tflex-wrap: wrap;\n\t\t\tgap: 0.3em;\n\t\t\tmargin-bottom: 0.5em;\n\t\t}\n\t\t.pict-inline-doc-tm-route-chip {\n\t\t\tdisplay: inline-flex;\n\t\t\talign-items: center;\n\t\t\tpadding: 0.2em 0.5em;\n\t\t\tbackground: var(--theme-color-background-hover, #E8E3D8);\n\t\t\tborder-radius: 12px;\n\t\t\tfont-size: 0.82em;\n\t\t\tcolor: var(--theme-color-text-primary, #3D3229);\n\t\t\tfont-family: 'SFMono-Regular', 'SF Mono', 'Menlo', 'Consolas', monospace;\n\t\t}\n\t\t.pict-inline-doc-tm-route-chip-remove {\n\t\t\tmargin-left: 0.4em;\n\t\t\tcursor: pointer;\n\t\t\tcolor: var(--theme-color-text-muted, #8A7F72);\n\t\t\tfont-size: 0.9em;\n\t\t\tline-height: 1;\n\t\t}\n\t\t.pict-inline-doc-tm-route-chip-remove:hover {\n\t\t\tcolor: var(--theme-color-status-error, #C62828);\n\t\t}\n\t\t.pict-inline-doc-tm-route-actions {\n\t\t\tdisplay: flex;\n\t\t\tflex-wrap: wrap;\n\t\t\tgap: 0.3em;\n\t\t}\n\t\t.pict-inline-doc-tm-route-action-btn {\n\t\t\tdisplay: inline-flex;\n\t\t\talign-items: center;\n\t\t\tpadding: 0.25em 0.5em;\n\t\t\tborder: 1px solid var(--theme-color-border-default, #DDD6CA);\n\t\t\tborder-radius: 3px;\n\t\t\tbackground: var(--theme-color-background-panel,    #fff);\n\t\t\tcolor: var(--theme-color-text-secondary, #5E5549);\n\t\t\tfont-size: 0.8em;\n\t\t\tcursor: pointer;\n\t\t\ttransition: background 0.1s;\n\t\t}\n\t\t.pict-inline-doc-tm-route-action-btn:hover {\n\t\t\tbackground: var(--theme-color-background-tertiary, #F0ECE4);\n\t\t}\n\t\t.pict-inline-doc-tm-route-action-btn.accent {\n\t\t\tborder-color: var(--theme-color-brand-primary, #2E7D74);\n\t\t\tcolor: var(--theme-color-brand-primary, #2E7D74);\n\t\t}\n\t\t.pict-inline-doc-tm-route-action-btn.accent:hover {\n\t\t\tbackground: var(--theme-color-background-hover, #F0F9F7);\n\t\t}\n\t\t.pict-inline-doc-tm-route-input-row {\n\t\t\tdisplay: none;\n\t\t\talign-items: center;\n\t\t\tgap: 0.3em;\n\t\t\tmargin-top: 0.4em;\n\t\t}\n\t\t.pict-inline-doc-tm-route-input-row.visible {\n\t\t\tdisplay: flex;\n\t\t}\n\t\t.pict-inline-doc-tm-route-input {\n\t\t\tflex: 1;\n\t\t\tpadding: 0.35em 0.5em;\n\t\t\tfont-size: 0.85em;\n\t\t\tfont-family: 'SFMono-Regular', 'SF Mono', 'Menlo', 'Consolas', monospace;\n\t\t\tcolor: var(--theme-color-text-primary, #3D3229);\n\t\t\tbackground: var(--theme-color-background-panel,    #FDFCFA);\n\t\t\tborder: 1px solid var(--theme-color-border-default, #DDD6CA);\n\t\t\tborder-radius: 3px;\n\t\t}\n\t\t.pict-inline-doc-tm-route-input:focus {\n\t\t\toutline: none;\n\t\t\tborder-color: var(--theme-color-brand-primary, #2E7D74);\n\t\t}\n\t\t.pict-inline-doc-tm-wc-container {\n\t\t\tpadding: 0.5em 0;\n\t\t}\n\t\t.pict-inline-doc-tm-wc-label {\n\t\t\tfont-size: 0.85em;\n\t\t\tcolor: var(--theme-color-text-secondary, #5E5549);\n\t\t\tmargin-bottom: 0.6em;\n\t\t}\n\t\t.pict-inline-doc-tm-wc-segments {\n\t\t\tdisplay: flex;\n\t\t\tflex-wrap: wrap;\n\t\t\talign-items: center;\n\t\t\tgap: 0.15em;\n\t\t\tmargin-bottom: 0.8em;\n\t\t}\n\t\t.pict-inline-doc-tm-wc-slash {\n\t\t\tcolor: var(--theme-color-text-muted, #8A7F72);\n\t\t\tfont-size: 1.1em;\n\t\t\tfont-weight: 300;\n\t\t\tfont-family: 'SFMono-Regular', 'SF Mono', 'Menlo', 'Consolas', monospace;\n\t\t}\n\t\t.pict-inline-doc-tm-wc-segment {\n\t\t\tdisplay: inline-flex;\n\t\t\talign-items: center;\n\t\t\tpadding: 0.4em 0.7em;\n\t\t\tborder: 1px solid var(--theme-color-border-default, #DDD6CA);\n\t\t\tborder-radius: 4px;\n\t\t\tbackground: var(--theme-color-background-panel,    #fff);\n\t\t\tcolor: var(--theme-color-text-primary, #3D3229);\n\t\t\tfont-family: 'SFMono-Regular', 'SF Mono', 'Menlo', 'Consolas', monospace;\n\t\t\tfont-size: 0.9em;\n\t\t\tcursor: pointer;\n\t\t\ttransition: background 0.15s, border-color 0.15s, opacity 0.15s;\n\t\t\tuser-select: none;\n\t\t}\n\t\t.pict-inline-doc-tm-wc-segment:hover {\n\t\t\tborder-color: var(--theme-color-brand-primary, #2E7D74);\n\t\t\tbackground: var(--theme-color-background-hover, #F0F9F7);\n\t\t}\n\t\t.pict-inline-doc-tm-wc-segment.selected {\n\t\t\tbackground: var(--theme-color-brand-primary, #2E7D74);\n\t\t\tcolor: var(--theme-color-text-on-brand, #fff);\n\t\t\tborder-color: var(--theme-color-brand-primary, #2E7D74);\n\t\t}\n\t\t.pict-inline-doc-tm-wc-segment.after-wildcard {\n\t\t\topacity: 0.35;\n\t\t\tborder-style: dashed;\n\t\t\tcursor: default;\n\t\t}\n\t\t.pict-inline-doc-tm-wc-segment.after-wildcard:hover {\n\t\t\tborder-color: var(--theme-color-border-default, #DDD6CA);\n\t\t\tbackground: var(--theme-color-background-panel,    #fff);\n\t\t}\n\t\t.pict-inline-doc-tm-wc-wildcard-star {\n\t\t\tdisplay: inline-flex;\n\t\t\talign-items: center;\n\t\t\tpadding: 0.4em 0.6em;\n\t\t\tcolor: var(--theme-color-brand-primary, #2E7D74);\n\t\t\tfont-family: 'SFMono-Regular', 'SF Mono', 'Menlo', 'Consolas', monospace;\n\t\t\tfont-size: 1.1em;\n\t\t\tfont-weight: 700;\n\t\t}\n\t\t.pict-inline-doc-tm-wc-preview {\n\t\t\tpadding: 0.5em 0.7em;\n\t\t\tbackground: var(--theme-color-background-secondary, #F5F0E8);\n\t\t\tborder: 1px solid var(--theme-color-border-default, #E5DED4);\n\t\t\tborder-radius: 4px;\n\t\t\tfont-family: 'SFMono-Regular', 'SF Mono', 'Menlo', 'Consolas', monospace;\n\t\t\tfont-size: 0.9em;\n\t\t\tcolor: var(--theme-color-text-primary, #3D3229);\n\t\t}\n\t\t.pict-inline-doc-tm-wc-preview-label {\n\t\t\tfont-size: 0.75em;\n\t\t\tcolor: var(--theme-color-text-muted, #8A7F72);\n\t\t\ttext-transform: uppercase;\n\t\t\tletter-spacing: 0.03em;\n\t\t\tmargin-bottom: 0.3em;\n\t\t}\n\t\t.pict-inline-doc-tm-bind-route-display {\n\t\t\tpadding: 0.5em 0.7em;\n\t\t\tbackground: var(--theme-color-background-secondary, #F5F0E8);\n\t\t\tborder: 1px solid var(--theme-color-border-default, #E5DED4);\n\t\t\tborder-radius: 4px;\n\t\t\tfont-family: 'SFMono-Regular', 'SF Mono', 'Menlo', 'Consolas', monospace;\n\t\t\tfont-size: 0.9em;\n\t\t\tcolor: var(--theme-color-text-primary, #3D3229);\n\t\t\tmargin-bottom: 0.8em;\n\t\t}\n\t\t.pict-inline-doc-tm-bind-topic-list {\n\t\t\tmax-height: 250px;\n\t\t\toverflow-y: auto;\n\t\t\tmargin-bottom: 0.6em;\n\t\t}\n\t\t.pict-inline-doc-tm-bind-topic-option {\n\t\t\tdisplay: flex;\n\t\t\talign-items: center;\n\t\t\tpadding: 0.5em 0.6em;\n\t\t\tborder-bottom: 1px solid var(--theme-color-border-light, #EAE3D8);\n\t\t\tcursor: pointer;\n\t\t\ttransition: background 0.1s;\n\t\t}\n\t\t.pict-inline-doc-tm-bind-topic-option:hover {\n\t\t\tbackground: var(--theme-color-background-secondary, #F5F0E8);\n\t\t}\n\t\t.pict-inline-doc-tm-bind-topic-option.selected {\n\t\t\tbackground: var(--theme-color-background-hover, #F0F9F7);\n\t\t}\n\t\t.pict-inline-doc-tm-bind-radio {\n\t\t\twidth: 16px;\n\t\t\theight: 16px;\n\t\t\tborder: 2px solid var(--theme-color-border-default, #DDD6CA);\n\t\t\tborder-radius: 50%;\n\t\t\tmargin-right: 0.6em;\n\t\t\tflex-shrink: 0;\n\t\t\tposition: relative;\n\t\t}\n\t\t.pict-inline-doc-tm-bind-topic-option.selected .pict-inline-doc-tm-bind-radio {\n\t\t\tborder-color: var(--theme-color-brand-primary, #2E7D74);\n\t\t}\n\t\t.pict-inline-doc-tm-bind-topic-option.selected .pict-inline-doc-tm-bind-radio::after {\n\t\t\tcontent: '';\n\t\t\tposition: absolute;\n\t\t\ttop: 3px;\n\t\t\tleft: 3px;\n\t\t\twidth: 6px;\n\t\t\theight: 6px;\n\t\t\tbackground: var(--theme-color-brand-primary, #2E7D74);\n\t\t\tborder-radius: 50%;\n\t\t}\n\t\t.pict-inline-doc-tm-bind-route-type {\n\t\t\tdisplay: flex;\n\t\t\tgap: 0.5em;\n\t\t\tmargin-bottom: 0.5em;\n\t\t}\n\t\t.pict-inline-doc-tm-bind-route-type-btn {\n\t\t\tflex: 1;\n\t\t\tpadding: 0.5em;\n\t\t\tborder: 1px solid var(--theme-color-border-default, #DDD6CA);\n\t\t\tborder-radius: 4px;\n\t\t\tbackground: var(--theme-color-background-panel,    #fff);\n\t\t\tcolor: var(--theme-color-text-secondary, #5E5549);\n\t\t\tfont-size: 0.85em;\n\t\t\ttext-align: center;\n\t\t\tcursor: pointer;\n\t\t\ttransition: background 0.1s, border-color 0.1s;\n\t\t}\n\t\t.pict-inline-doc-tm-bind-route-type-btn:hover {\n\t\t\tbackground: var(--theme-color-background-tertiary, #F0ECE4);\n\t\t}\n\t\t.pict-inline-doc-tm-bind-route-type-btn.selected {\n\t\t\tbackground: var(--theme-color-brand-primary, #2E7D74);\n\t\t\tcolor: var(--theme-color-text-on-brand, #fff);\n\t\t\tborder-color: var(--theme-color-brand-primary, #2E7D74);\n\t\t}\n\t\t.pict-inline-doc-tm-sidebar-list {\n\t\t\tmax-height: 300px;\n\t\t\toverflow-y: auto;\n\t\t}\n\t\t.pict-inline-doc-tm-sidebar-item {\n\t\t\tpadding: 0.4em 0.6em;\n\t\t\tcursor: pointer;\n\t\t\tfont-size: 0.9em;\n\t\t\tcolor: var(--theme-color-text-primary, #3D3229);\n\t\t\tborder-bottom: 1px solid var(--theme-color-border-light, #EAE3D8);\n\t\t\ttransition: background 0.1s;\n\t\t}\n\t\t.pict-inline-doc-tm-sidebar-item:hover {\n\t\t\tbackground: var(--theme-color-background-secondary, #F5F0E8);\n\t\t}\n\t\t.pict-inline-doc-tm-sidebar-item .path {\n\t\t\tfont-family: 'SFMono-Regular', 'SF Mono', 'Menlo', 'Consolas', monospace;\n\t\t\tfont-size: 0.85em;\n\t\t\tcolor: var(--theme-color-text-muted, #8A7F72);\n\t\t\tmargin-left: 0.5em;\n\t\t}\n\t\t.pict-inline-doc-tm-validation-error {\n\t\t\tcolor: var(--theme-color-status-error, #C62828);\n\t\t\tfont-size: 0.8em;\n\t\t\tmargin-top: 0.3em;\n\t\t}\n\t",Templates:[],Renderables:[]};class InlineDocumentationTopicManagerView extends libPictView{constructor(pFable,pOptions,pServiceHash){super(pFable,pOptions,pServiceHash);}/**
	 * Get the modal view instance if available.
	 *
	 * @returns {Object|null} The PictSectionModal view, or null
	 */_getModal(){return this.pict.views['PictSectionModal']||this.pict.views['Pict-Section-Modal']||null;}/**
	 * Get the inline documentation provider.
	 *
	 * @returns {Object|null} The provider instance
	 */_getProvider(){return this.pict.providers['Pict-InlineDocumentation']||null;}// -- Topic List --
/**
	 * Show the topic manager modal with the full topic list.
	 */showTopicManager(){let tmpModal=this._getModal();let tmpProvider=this._getProvider();if(!tmpModal){this.log.warn('InlineDocumentation TopicManager: Pict-Section-Modal view is not registered.');return;}if(!tmpProvider){return;}let tmpTopics=tmpProvider.getTopicList();let tmpContent=this._buildTopicListHTML(tmpTopics);tmpModal.show({title:'Manage Topics',content:tmpContent,closeable:true,width:'520px',buttons:[{Hash:'close',Label:'Close',Style:'primary'}],onOpen:pDialog=>{this._wireTopicListHandlers(pDialog);}});}/**
	 * Build the HTML for the topic list modal.
	 *
	 * @param {Array} pTopics - Array from getTopicList()
	 * @returns {string} HTML content
	 */_buildTopicListHTML(pTopics){if(!pTopics||pTopics.length<1){return'<div class="pict-inline-doc-tm-empty">No topics defined yet.</div>'+'<div class="pict-inline-doc-tm-new-topic" data-action="new-topic">+ New Topic</div>';}let tmpHTML='<div class="pict-inline-doc-tm-topic-list">';for(let i=0;i<pTopics.length;i++){let tmpTopic=pTopics[i];tmpHTML+='<div class="pict-inline-doc-tm-topic-item" data-topic-code="'+this._escapeHTML(tmpTopic.TopicCode)+'">';tmpHTML+='<div class="pict-inline-doc-tm-topic-info">';tmpHTML+='<div class="pict-inline-doc-tm-topic-title">'+this._escapeHTML(tmpTopic.TopicTitle)+'</div>';tmpHTML+='<div class="pict-inline-doc-tm-topic-meta">';tmpHTML+=this._escapeHTML(tmpTopic.TopicCode);if(tmpTopic.TopicHelpFilePath){tmpHTML+=' &middot; '+this._escapeHTML(tmpTopic.TopicHelpFilePath);}tmpHTML+=' &middot; '+tmpTopic.RouteCount+' route'+(tmpTopic.RouteCount!==1?'s':'');tmpHTML+='</div>';tmpHTML+='</div>';tmpHTML+='<div class="pict-inline-doc-tm-topic-actions">';tmpHTML+='<button class="pict-inline-doc-tm-action-btn" data-action="edit" data-topic-code="'+this._escapeHTML(tmpTopic.TopicCode)+'" title="Edit"><svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11.5 1.5l3 3L5 14H2v-3z"/><line x1="9" y1="4" x2="12" y2="7"/></svg></button>';tmpHTML+='<button class="pict-inline-doc-tm-action-btn danger" data-action="delete" data-topic-code="'+this._escapeHTML(tmpTopic.TopicCode)+'" title="Delete"><svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><line x1="4" y1="4" x2="12" y2="12"/><line x1="12" y1="4" x2="4" y2="12"/></svg></button>';tmpHTML+='</div>';tmpHTML+='</div>';}tmpHTML+='</div>';tmpHTML+='<div class="pict-inline-doc-tm-new-topic" data-action="new-topic">+ New Topic</div>';return tmpHTML;}/**
	 * Wire click handlers for the topic list modal.
	 *
	 * @param {HTMLElement} pDialog - The modal dialog element
	 */_wireTopicListHandlers(pDialog){let tmpSelf=this;let tmpModal=this._getModal();let tmpProvider=this._getProvider();// Edit buttons
let tmpEditBtns=pDialog.querySelectorAll('[data-action="edit"]');for(let i=0;i<tmpEditBtns.length;i++){tmpEditBtns[i].addEventListener('click',pEvent=>{pEvent.stopPropagation();let tmpCode=tmpEditBtns[i].getAttribute('data-topic-code');// Dismiss the list modal, then open editor
if(tmpModal&&tmpModal.dismissModals){tmpModal.dismissModals();}setTimeout(()=>{tmpSelf.showTopicEditor(tmpCode);},250);});}// Delete buttons
let tmpDeleteBtns=pDialog.querySelectorAll('[data-action="delete"]');for(let i=0;i<tmpDeleteBtns.length;i++){tmpDeleteBtns[i].addEventListener('click',pEvent=>{pEvent.stopPropagation();let tmpCode=tmpDeleteBtns[i].getAttribute('data-topic-code');if(tmpModal&&tmpModal.confirm){tmpModal.confirm('Are you sure you want to delete the topic "'+tmpCode+'"?',{title:'Delete Topic',dangerous:true}).then(pConfirmed=>{if(pConfirmed&&tmpProvider){tmpProvider.removeTopic(tmpCode);tmpProvider.saveTopics();// Re-render nav
let tmpNavView=tmpSelf.pict.views['InlineDoc-Nav'];if(tmpNavView){tmpNavView.render();}if(tmpModal.toast){tmpModal.toast('Topic deleted.',{type:'success'});}// Re-open the list
setTimeout(()=>{tmpSelf.showTopicManager();},250);}});}});}// New topic button
let tmpNewBtn=pDialog.querySelector('[data-action="new-topic"]');if(tmpNewBtn){tmpNewBtn.addEventListener('click',()=>{if(tmpModal&&tmpModal.dismissModals){tmpModal.dismissModals();}setTimeout(()=>{tmpSelf.showTopicEditor(null);},250);});}}// -- Topic Editor --
/**
	 * Show the topic editor modal for creating or editing a topic.
	 *
	 * @param {string|null} pTopicCode - Topic code to edit, or null for new
	 */showTopicEditor(pTopicCode){let tmpModal=this._getModal();let tmpProvider=this._getProvider();if(!tmpModal||!tmpProvider){return;}let tmpState=this.pict.AppData.InlineDocumentation;let tmpIsNew=!pTopicCode;let tmpTopic=null;if(pTopicCode&&tmpState.Topics&&tmpState.Topics[pTopicCode]){// Clone for editing
tmpTopic=JSON.parse(JSON.stringify(tmpState.Topics[pTopicCode]));}else{tmpTopic={TopicCode:'',TopicTitle:'',TopicHelpFilePath:'',Routes:[]};}let tmpContent=this._buildTopicEditorHTML(tmpTopic,tmpIsNew);// Track editor routes state in closure
let tmpEditorRoutes=tmpTopic.Routes?tmpTopic.Routes.slice():[];tmpModal.show({title:tmpIsNew?'New Topic':'Edit Topic',content:tmpContent,closeable:true,width:'500px',buttons:[{Hash:'cancel',Label:'Cancel'},{Hash:'save',Label:'Save',Style:'primary'}],onOpen:pDialog=>{this._wireTopicEditorHandlers(pDialog,tmpTopic,tmpIsNew,tmpEditorRoutes);}}).then(pResult=>{if(pResult==='save'){this._handleTopicEditorSave(tmpTopic,tmpIsNew,tmpEditorRoutes);}else{// Return to list on cancel
setTimeout(()=>{this.showTopicManager();},250);}});}/**
	 * Build the HTML for the topic editor form.
	 *
	 * @param {Object} pTopic - The topic data
	 * @param {boolean} pIsNew - Whether this is a new topic
	 * @returns {string} HTML content
	 */_buildTopicEditorHTML(pTopic,pIsNew){let tmpHTML='';// Topic Code
tmpHTML+='<div class="pict-inline-doc-tm-form-group">';tmpHTML+='<label class="pict-inline-doc-tm-form-label">Topic Code</label>';if(pIsNew){tmpHTML+='<input type="text" class="pict-inline-doc-tm-form-input" id="tm-editor-code" value="" placeholder="MY-TOPIC-CODE" />';tmpHTML+='<div class="pict-inline-doc-tm-form-hint">Uppercase letters, numbers, and hyphens only.</div>';}else{tmpHTML+='<input type="text" class="pict-inline-doc-tm-form-input" id="tm-editor-code" value="'+this._escapeHTML(pTopic.TopicCode)+'" readonly />';}tmpHTML+='<div class="pict-inline-doc-tm-validation-error" id="tm-editor-code-error"></div>';tmpHTML+='</div>';// Topic Title
tmpHTML+='<div class="pict-inline-doc-tm-form-group">';tmpHTML+='<label class="pict-inline-doc-tm-form-label">Title</label>';tmpHTML+='<input type="text" class="pict-inline-doc-tm-form-input" id="tm-editor-title" value="'+this._escapeHTML(pTopic.TopicTitle||pTopic.Name||'')+'" placeholder="My Topic Title" />';tmpHTML+='<div class="pict-inline-doc-tm-validation-error" id="tm-editor-title-error"></div>';tmpHTML+='</div>';// Help File Path
tmpHTML+='<div class="pict-inline-doc-tm-form-group">';tmpHTML+='<label class="pict-inline-doc-tm-form-label">Help Document</label>';tmpHTML+='<div style="display:flex;gap:0.3em;align-items:center;">';tmpHTML+='<input type="text" class="pict-inline-doc-tm-form-input" id="tm-editor-helpfile" value="'+this._escapeHTML(pTopic.TopicHelpFilePath||'')+'" placeholder="help-topic.md" style="flex:1;" />';tmpHTML+='<button class="pict-inline-doc-tm-route-action-btn" id="tm-editor-browse-sidebar" title="Browse sidebar documents">Browse</button>';tmpHTML+='</div>';tmpHTML+='</div>';// Routes
tmpHTML+='<div class="pict-inline-doc-tm-form-group">';tmpHTML+='<label class="pict-inline-doc-tm-form-label">Routes</label>';tmpHTML+='<div class="pict-inline-doc-tm-routes-section">';tmpHTML+='<div class="pict-inline-doc-tm-route-chips" id="tm-editor-route-chips">';tmpHTML+=this._buildRouteChipsHTML(pTopic.Routes||[]);tmpHTML+='</div>';tmpHTML+='<div class="pict-inline-doc-tm-route-actions">';tmpHTML+='<button class="pict-inline-doc-tm-route-action-btn" id="tm-editor-add-route">+ Add Route</button>';let tmpState=this.pict.AppData.InlineDocumentation;if(tmpState&&tmpState.CurrentRoute){tmpHTML+='<button class="pict-inline-doc-tm-route-action-btn accent" id="tm-editor-add-current-route">+ Current Route</button>';tmpHTML+='<button class="pict-inline-doc-tm-route-action-btn accent" id="tm-editor-build-wildcard">Build Wildcard</button>';}tmpHTML+='</div>';tmpHTML+='<div class="pict-inline-doc-tm-route-input-row" id="tm-editor-route-input-row">';tmpHTML+='<input type="text" class="pict-inline-doc-tm-route-input" id="tm-editor-route-input" placeholder="/my/route" />';tmpHTML+='<button class="pict-inline-doc-tm-route-action-btn accent" id="tm-editor-route-input-add">Add</button>';tmpHTML+='</div>';tmpHTML+='</div>';tmpHTML+='</div>';return tmpHTML;}/**
	 * Build HTML for route chips.
	 *
	 * @param {Array} pRoutes - Array of route pattern strings
	 * @returns {string} HTML for the chips
	 */_buildRouteChipsHTML(pRoutes){if(!pRoutes||pRoutes.length<1){return'<span style="font-size:0.8em;color:var(--theme-color-text-muted, #8A7F72);">No routes bound.</span>';}let tmpHTML='';for(let i=0;i<pRoutes.length;i++){tmpHTML+='<span class="pict-inline-doc-tm-route-chip">';tmpHTML+=this._escapeHTML(pRoutes[i]);tmpHTML+='<span class="pict-inline-doc-tm-route-chip-remove" data-route="'+this._escapeHTML(pRoutes[i])+'">&times;</span>';tmpHTML+='</span>';}return tmpHTML;}/**
	 * Refresh the route chips in an open editor dialog.
	 *
	 * @param {Array} pRoutes - Current routes array
	 */_refreshRouteChips(pRoutes){if(typeof document==='undefined'){return;}let tmpContainer=document.getElementById('tm-editor-route-chips');if(tmpContainer){tmpContainer.innerHTML=this._buildRouteChipsHTML(pRoutes);this._wireRouteChipRemoveHandlers(pRoutes);}}/**
	 * Wire remove handlers on route chips.
	 *
	 * @param {Array} pRoutes - The mutable routes array
	 */_wireRouteChipRemoveHandlers(pRoutes){if(typeof document==='undefined'){return;}let tmpSelf=this;let tmpRemoveBtns=document.querySelectorAll('.pict-inline-doc-tm-route-chip-remove');for(let i=0;i<tmpRemoveBtns.length;i++){tmpRemoveBtns[i].addEventListener('click',pEvent=>{pEvent.stopPropagation();let tmpRoute=tmpRemoveBtns[i].getAttribute('data-route');let tmpIdx=pRoutes.indexOf(tmpRoute);if(tmpIdx>=0){pRoutes.splice(tmpIdx,1);}tmpSelf._refreshRouteChips(pRoutes);});}}/**
	 * Wire all handlers for the topic editor form.
	 *
	 * @param {HTMLElement} pDialog - The modal dialog element
	 * @param {Object} pTopic - The topic data
	 * @param {boolean} pIsNew - Whether this is a new topic
	 * @param {Array} pEditorRoutes - Mutable routes array for this editor session
	 */_wireTopicEditorHandlers(pDialog,pTopic,pIsNew,pEditorRoutes){let tmpSelf=this;let tmpProvider=this._getProvider();let tmpState=this.pict.AppData.InlineDocumentation;// Route chip remove handlers
this._wireRouteChipRemoveHandlers(pEditorRoutes);// Add Route button — show input row
let tmpAddRouteBtn=document.getElementById('tm-editor-add-route');if(tmpAddRouteBtn){tmpAddRouteBtn.addEventListener('click',()=>{let tmpRow=document.getElementById('tm-editor-route-input-row');if(tmpRow){tmpRow.classList.toggle('visible');let tmpInput=document.getElementById('tm-editor-route-input');if(tmpInput){tmpInput.focus();}}});}// Add route from text input
let tmpRouteInputAddBtn=document.getElementById('tm-editor-route-input-add');if(tmpRouteInputAddBtn){tmpRouteInputAddBtn.addEventListener('click',()=>{let tmpInput=document.getElementById('tm-editor-route-input');if(tmpInput&&tmpInput.value.trim()){let tmpRoute=tmpInput.value.trim();if(tmpRoute.charAt(0)!=='/'){tmpRoute='/'+tmpRoute;}if(pEditorRoutes.indexOf(tmpRoute)<0){pEditorRoutes.push(tmpRoute);tmpSelf._refreshRouteChips(pEditorRoutes);}tmpInput.value='';}});}// Enter key on route input
let tmpRouteInput=document.getElementById('tm-editor-route-input');if(tmpRouteInput){tmpRouteInput.addEventListener('keydown',pEvent=>{if(pEvent.key==='Enter'){pEvent.preventDefault();if(tmpRouteInputAddBtn){tmpRouteInputAddBtn.click();}}});}// Add Current Route button
let tmpAddCurrentBtn=document.getElementById('tm-editor-add-current-route');if(tmpAddCurrentBtn&&tmpState&&tmpState.CurrentRoute){tmpAddCurrentBtn.addEventListener('click',()=>{let tmpRoute=tmpState.CurrentRoute;if(pEditorRoutes.indexOf(tmpRoute)<0){pEditorRoutes.push(tmpRoute);tmpSelf._refreshRouteChips(pEditorRoutes);}});}// Build Wildcard button
let tmpWildcardBtn=document.getElementById('tm-editor-build-wildcard');if(tmpWildcardBtn&&tmpProvider&&tmpState&&tmpState.CurrentRoute){tmpWildcardBtn.addEventListener('click',()=>{let tmpModal=tmpSelf._getModal();if(tmpModal&&tmpModal.dismissModals){tmpModal.dismissModals();}setTimeout(()=>{tmpSelf.showWildcardBuilder(tmpState.CurrentRoute,pPattern=>{if(pPattern&&pEditorRoutes.indexOf(pPattern)<0){pEditorRoutes.push(pPattern);}// Re-open the editor
tmpSelf._reopenEditorAfterSubflow(pTopic,pIsNew,pEditorRoutes);});},250);});}// Browse Sidebar button
let tmpBrowseBtn=document.getElementById('tm-editor-browse-sidebar');if(tmpBrowseBtn){tmpBrowseBtn.addEventListener('click',()=>{let tmpModal=tmpSelf._getModal();if(tmpModal&&tmpModal.dismissModals){tmpModal.dismissModals();}setTimeout(()=>{tmpSelf._showSidebarPicker(pPath=>{if(pPath){pTopic.TopicHelpFilePath=pPath;}tmpSelf._reopenEditorAfterSubflow(pTopic,pIsNew,pEditorRoutes);});},250);});}}/**
	 * Re-open the topic editor after returning from a sub-flow (wildcard builder, sidebar picker).
	 *
	 * Captures current form values from the DOM before the modal was dismissed,
	 * then reconstructs the editor with updated state.
	 *
	 * @param {Object} pTopic - The topic data (may have been updated by sub-flow)
	 * @param {boolean} pIsNew - Whether this is a new topic
	 * @param {Array} pEditorRoutes - Current routes for this editor session
	 */_reopenEditorAfterSubflow(pTopic,pIsNew,pEditorRoutes){let tmpModal=this._getModal();let tmpProvider=this._getProvider();if(!tmpModal||!tmpProvider){return;}// Rebuild the topic from whatever was captured
let tmpContent=this._buildTopicEditorHTML({TopicCode:pTopic.TopicCode,TopicTitle:pTopic.TopicTitle,TopicHelpFilePath:pTopic.TopicHelpFilePath,Routes:pEditorRoutes},pIsNew);tmpModal.show({title:pIsNew?'New Topic':'Edit Topic',content:tmpContent,closeable:true,width:'500px',buttons:[{Hash:'cancel',Label:'Cancel'},{Hash:'save',Label:'Save',Style:'primary'}],onOpen:pDialog=>{this._wireTopicEditorHandlers(pDialog,pTopic,pIsNew,pEditorRoutes);}}).then(pResult=>{if(pResult==='save'){this._handleTopicEditorSave(pTopic,pIsNew,pEditorRoutes);}else{setTimeout(()=>{this.showTopicManager();},250);}});}/**
	 * Handle saving from the topic editor.
	 *
	 * Reads form values, validates, and persists.
	 *
	 * @param {Object} pTopic - The original topic data
	 * @param {boolean} pIsNew - Whether this is a new topic
	 * @param {Array} pEditorRoutes - Current routes from the editor
	 */_handleTopicEditorSave(pTopic,pIsNew,pEditorRoutes){let tmpProvider=this._getProvider();let tmpModal=this._getModal();let tmpState=this.pict.AppData.InlineDocumentation;if(!tmpProvider){return;}// Read form values from DOM (they're still present briefly during dismiss)
let tmpCode='';let tmpTitle='';let tmpHelpFile='';if(typeof document!=='undefined'){let tmpCodeInput=document.getElementById('tm-editor-code');let tmpTitleInput=document.getElementById('tm-editor-title');let tmpHelpInput=document.getElementById('tm-editor-helpfile');if(tmpCodeInput){tmpCode=tmpCodeInput.value.trim();}if(tmpTitleInput){tmpTitle=tmpTitleInput.value.trim();}if(tmpHelpInput){tmpHelpFile=tmpHelpInput.value.trim();}}// Validation
let tmpErrors=[];if(pIsNew){if(!tmpCode){tmpErrors.push('Topic Code is required.');}else if(!/^[A-Z0-9][A-Z0-9-]*$/.test(tmpCode)){tmpErrors.push('Topic Code must use uppercase letters, numbers, and hyphens only.');}else if(tmpState.Topics&&tmpState.Topics[tmpCode]){tmpErrors.push('A topic with code "'+tmpCode+'" already exists.');}}else{tmpCode=pTopic.TopicCode;}if(!tmpTitle){tmpErrors.push('Title is required.');}if(tmpErrors.length>0){if(tmpModal&&tmpModal.toast){tmpModal.toast(tmpErrors.join(' '),{type:'error'});}// Re-open editor with current values
pTopic.TopicTitle=tmpTitle;pTopic.TopicHelpFilePath=tmpHelpFile;if(pIsNew){pTopic.TopicCode=tmpCode;}setTimeout(()=>{this._reopenEditorAfterSubflow(pTopic,pIsNew,pEditorRoutes);},300);return;}// Apply changes
if(pIsNew){tmpProvider.addTopic(tmpCode,{TopicCode:tmpCode,TopicTitle:tmpTitle,TopicHelpFilePath:tmpHelpFile,Routes:pEditorRoutes});}else{tmpProvider.updateTopic(tmpCode,{TopicTitle:tmpTitle,TopicHelpFilePath:tmpHelpFile,Routes:pEditorRoutes});}tmpProvider.saveTopics();// Re-render nav
let tmpNavView=this.pict.views['InlineDoc-Nav'];if(tmpNavView){tmpNavView.render();}if(tmpModal&&tmpModal.toast){tmpModal.toast('Topic saved.',{type:'success'});}// Return to topic list
setTimeout(()=>{this.showTopicManager();},300);}// -- Wildcard Builder --
/**
	 * Show the wildcard builder modal.
	 *
	 * Displays route segments as clickable blocks and lets the user
	 * visually choose where the wildcard starts.
	 *
	 * @param {string} pCurrentRoute - The route to build a pattern for
	 * @param {Function} fOnSelect - Callback receiving the selected pattern (or null on cancel)
	 */showWildcardBuilder(pCurrentRoute,fOnSelect){let tmpModal=this._getModal();let tmpProvider=this._getProvider();if(!tmpModal||!tmpProvider){if(typeof fOnSelect==='function'){fOnSelect(null);}return;}let tmpSegments=tmpProvider.getRouteSegments(pCurrentRoute);if(tmpSegments.length<1){if(tmpModal.toast){tmpModal.toast('No route segments to build a wildcard from.',{type:'error'});}if(typeof fOnSelect==='function'){fOnSelect(null);}return;}// Default selection: last segment before end (or first if only one)
let tmpSelectedIndex=Math.max(0,tmpSegments.length-2);let tmpContent=this._buildWildcardBuilderHTML(tmpSegments,pCurrentRoute,tmpSelectedIndex);tmpModal.show({title:'Build Wildcard Pattern',content:tmpContent,closeable:true,width:'520px',buttons:[{Hash:'cancel',Label:'Cancel'},{Hash:'exact',Label:'Use Exact Route'},{Hash:'pattern',Label:'Use Pattern',Style:'primary'}],onOpen:pDialog=>{this._wireWildcardBuilderHandlers(pDialog,tmpSegments,tmpSelectedIndex);}}).then(pResult=>{if(pResult==='pattern'){// Get the current selection
let tmpPreview=typeof document!=='undefined'?document.getElementById('tm-wc-preview-value'):null;let tmpPattern=tmpPreview?tmpPreview.textContent:tmpSegments[tmpSelectedIndex].WildcardPattern;if(typeof fOnSelect==='function'){fOnSelect(tmpPattern);}}else if(pResult==='exact'){if(typeof fOnSelect==='function'){fOnSelect(pCurrentRoute);}}else{if(typeof fOnSelect==='function'){fOnSelect(null);}}});}/**
	 * Build the HTML for the wildcard builder.
	 *
	 * @param {Array} pSegments - Segment objects from getRouteSegments()
	 * @param {string} pCurrentRoute - The original route
	 * @param {number} pSelectedIndex - The initially selected segment index
	 * @returns {string} HTML content
	 */_buildWildcardBuilderHTML(pSegments,pCurrentRoute,pSelectedIndex){let tmpHTML='<div class="pict-inline-doc-tm-wc-container">';tmpHTML+='<div class="pict-inline-doc-tm-wc-label">Click a segment to set the wildcard boundary. Everything after the selected segment will match any path.</div>';tmpHTML+='<div class="pict-inline-doc-tm-wc-segments" id="tm-wc-segments">';for(let i=0;i<pSegments.length;i++){let tmpClass='pict-inline-doc-tm-wc-segment';if(i===pSelectedIndex){tmpClass+=' selected';}else if(i>pSelectedIndex){tmpClass+=' after-wildcard';}tmpHTML+='<span class="pict-inline-doc-tm-wc-slash">/</span>';tmpHTML+='<span class="'+tmpClass+'" data-segment-index="'+i+'">';tmpHTML+=this._escapeHTML(pSegments[i].Segment);tmpHTML+='</span>';}tmpHTML+='<span class="pict-inline-doc-tm-wc-slash">/</span>';tmpHTML+='<span class="pict-inline-doc-tm-wc-wildcard-star" id="tm-wc-star">*</span>';tmpHTML+='</div>';tmpHTML+='<div class="pict-inline-doc-tm-wc-preview-label">Pattern</div>';tmpHTML+='<div class="pict-inline-doc-tm-wc-preview" id="tm-wc-preview-value">';tmpHTML+=this._escapeHTML(pSegments[pSelectedIndex].WildcardPattern);tmpHTML+='</div>';tmpHTML+='</div>';return tmpHTML;}/**
	 * Wire click handlers for the wildcard builder segments.
	 *
	 * @param {HTMLElement} pDialog - The modal dialog element
	 * @param {Array} pSegments - Segment objects
	 * @param {number} pInitialIndex - Initially selected index
	 */_wireWildcardBuilderHandlers(pDialog,pSegments,pInitialIndex){let tmpSelectedIndex=pInitialIndex;let tmpUpdateSelection=pNewIndex=>{tmpSelectedIndex=pNewIndex;let tmpSegmentEls=pDialog.querySelectorAll('.pict-inline-doc-tm-wc-segment');for(let i=0;i<tmpSegmentEls.length;i++){let tmpIdx=parseInt(tmpSegmentEls[i].getAttribute('data-segment-index'),10);tmpSegmentEls[i].classList.remove('selected','after-wildcard');if(tmpIdx===pNewIndex){tmpSegmentEls[i].classList.add('selected');}else if(tmpIdx>pNewIndex){tmpSegmentEls[i].classList.add('after-wildcard');}}let tmpPreview=pDialog.querySelector('#tm-wc-preview-value');if(tmpPreview){tmpPreview.textContent=pSegments[pNewIndex].WildcardPattern;}};let tmpSegmentEls=pDialog.querySelectorAll('.pict-inline-doc-tm-wc-segment');for(let i=0;i<tmpSegmentEls.length;i++){tmpSegmentEls[i].addEventListener('click',()=>{let tmpIdx=parseInt(tmpSegmentEls[i].getAttribute('data-segment-index'),10);tmpUpdateSelection(tmpIdx);});}}// -- Bind Topic to Route --
/**
	 * Show the quick-bind flow for connecting a topic to the current route.
	 */showBindTopicToRoute(){let tmpModal=this._getModal();let tmpProvider=this._getProvider();if(!tmpModal||!tmpProvider){return;}let tmpState=this.pict.AppData.InlineDocumentation;if(!tmpState||!tmpState.CurrentRoute){if(tmpModal.toast){tmpModal.toast('No current route to bind to.',{type:'error'});}return;}let tmpCurrentRoute=tmpState.CurrentRoute;let tmpTopics=tmpProvider.getTopicList();let tmpContent=this._buildBindHTML(tmpCurrentRoute,tmpTopics);// Track selection state
let tmpSelectedTopicCode=null;let tmpRouteType='exact';// 'exact' or 'wildcard'
tmpModal.show({title:'Bind Topic to Route',content:tmpContent,closeable:true,width:'480px',buttons:[{Hash:'cancel',Label:'Cancel'},{Hash:'bind',Label:'Bind Route',Style:'primary'}],onOpen:pDialog=>{this._wireBindHandlers(pDialog,tmpTopics,tmpCurrentRoute,pCode=>{tmpSelectedTopicCode=pCode;},pType=>{tmpRouteType=pType;});}}).then(pResult=>{if(pResult!=='bind'||!tmpSelectedTopicCode){return;}if(tmpSelectedTopicCode==='__NEW__'){// Open new topic editor with current route pre-filled
this.showTopicEditor(null);return;}if(tmpRouteType==='wildcard'){// Open wildcard builder, then bind
this.showWildcardBuilder(tmpCurrentRoute,pPattern=>{if(pPattern){tmpProvider.addRouteToTopic(tmpSelectedTopicCode,pPattern);tmpProvider.saveTopics();let tmpNavView=this.pict.views['InlineDoc-Nav'];if(tmpNavView){tmpNavView.render();}if(tmpModal.toast){tmpModal.toast('Route bound to topic.',{type:'success'});}}});}else{// Exact match bind
tmpProvider.addRouteToTopic(tmpSelectedTopicCode,tmpCurrentRoute);tmpProvider.saveTopics();let tmpNavView=this.pict.views['InlineDoc-Nav'];if(tmpNavView){tmpNavView.render();}if(tmpModal.toast){tmpModal.toast('Route bound to topic.',{type:'success'});}}});}/**
	 * Build the HTML for the bind-topic-to-route modal.
	 *
	 * @param {string} pCurrentRoute - The current route
	 * @param {Array} pTopics - Topic list
	 * @returns {string} HTML content
	 */_buildBindHTML(pCurrentRoute,pTopics){let tmpHTML='';tmpHTML+='<div class="pict-inline-doc-tm-bind-route-display">'+this._escapeHTML(pCurrentRoute)+'</div>';// Route type selection
tmpHTML+='<div class="pict-inline-doc-tm-form-group">';tmpHTML+='<label class="pict-inline-doc-tm-form-label">Route Match Type</label>';tmpHTML+='<div class="pict-inline-doc-tm-bind-route-type">';tmpHTML+='<div class="pict-inline-doc-tm-bind-route-type-btn selected" data-route-type="exact">Exact Match</div>';tmpHTML+='<div class="pict-inline-doc-tm-bind-route-type-btn" data-route-type="wildcard">Wildcard Pattern</div>';tmpHTML+='</div>';tmpHTML+='</div>';// Topic selection
tmpHTML+='<div class="pict-inline-doc-tm-form-group">';tmpHTML+='<label class="pict-inline-doc-tm-form-label">Select Topic</label>';tmpHTML+='<div class="pict-inline-doc-tm-bind-topic-list">';for(let i=0;i<pTopics.length;i++){let tmpTopic=pTopics[i];tmpHTML+='<div class="pict-inline-doc-tm-bind-topic-option" data-topic-code="'+this._escapeHTML(tmpTopic.TopicCode)+'">';tmpHTML+='<div class="pict-inline-doc-tm-bind-radio"></div>';tmpHTML+='<div class="pict-inline-doc-tm-topic-info">';tmpHTML+='<div class="pict-inline-doc-tm-topic-title">'+this._escapeHTML(tmpTopic.TopicTitle)+'</div>';tmpHTML+='<div class="pict-inline-doc-tm-topic-meta">'+this._escapeHTML(tmpTopic.TopicCode)+'</div>';tmpHTML+='</div>';tmpHTML+='</div>';}// Create new option
tmpHTML+='<div class="pict-inline-doc-tm-bind-topic-option" data-topic-code="__NEW__">';tmpHTML+='<div class="pict-inline-doc-tm-bind-radio"></div>';tmpHTML+='<div class="pict-inline-doc-tm-topic-info">';tmpHTML+='<div class="pict-inline-doc-tm-topic-title" style="color:var(--theme-color-brand-primary, #2E7D74);">+ Create New Topic</div>';tmpHTML+='</div>';tmpHTML+='</div>';tmpHTML+='</div>';tmpHTML+='</div>';return tmpHTML;}/**
	 * Wire handlers for the bind-topic-to-route modal.
	 *
	 * @param {HTMLElement} pDialog - The modal dialog element
	 * @param {Array} pTopics - Topic list
	 * @param {string} pCurrentRoute - The current route
	 * @param {Function} fOnTopicSelect - Called with selected topic code
	 * @param {Function} fOnRouteTypeSelect - Called with 'exact' or 'wildcard'
	 */_wireBindHandlers(pDialog,pTopics,pCurrentRoute,fOnTopicSelect,fOnRouteTypeSelect){// Topic selection
let tmpTopicOptions=pDialog.querySelectorAll('.pict-inline-doc-tm-bind-topic-option');for(let i=0;i<tmpTopicOptions.length;i++){tmpTopicOptions[i].addEventListener('click',()=>{// Deselect all
for(let j=0;j<tmpTopicOptions.length;j++){tmpTopicOptions[j].classList.remove('selected');}tmpTopicOptions[i].classList.add('selected');fOnTopicSelect(tmpTopicOptions[i].getAttribute('data-topic-code'));});}// Route type selection
let tmpRouteTypeBtns=pDialog.querySelectorAll('.pict-inline-doc-tm-bind-route-type-btn');for(let i=0;i<tmpRouteTypeBtns.length;i++){tmpRouteTypeBtns[i].addEventListener('click',()=>{for(let j=0;j<tmpRouteTypeBtns.length;j++){tmpRouteTypeBtns[j].classList.remove('selected');}tmpRouteTypeBtns[i].classList.add('selected');fOnRouteTypeSelect(tmpRouteTypeBtns[i].getAttribute('data-route-type'));});}}// -- Sidebar Picker --
/**
	 * Show a sidebar document picker modal.
	 *
	 * @param {Function} fOnSelect - Callback receiving the selected path (or null)
	 */_showSidebarPicker(fOnSelect){let tmpModal=this._getModal();let tmpState=this.pict.AppData.InlineDocumentation;if(!tmpModal){if(typeof fOnSelect==='function'){fOnSelect(null);}return;}let tmpGroups=tmpState&&tmpState.SidebarGroups?tmpState.SidebarGroups:[];let tmpContent=this._buildSidebarPickerHTML(tmpGroups);tmpModal.show({title:'Select Document',content:tmpContent,closeable:true,width:'400px',buttons:[{Hash:'cancel',Label:'Cancel'}],onOpen:pDialog=>{let tmpItems=pDialog.querySelectorAll('.pict-inline-doc-tm-sidebar-item');for(let i=0;i<tmpItems.length;i++){tmpItems[i].addEventListener('click',()=>{let tmpPath=tmpItems[i].getAttribute('data-path');if(tmpModal.dismissModals){tmpModal.dismissModals();}if(typeof fOnSelect==='function'){fOnSelect(tmpPath);}});}}}).then(pResult=>{if(pResult==='cancel'||pResult===null){if(typeof fOnSelect==='function'){fOnSelect(null);}}});}/**
	 * Build the HTML for the sidebar document picker.
	 *
	 * @param {Array} pGroups - SidebarGroups array
	 * @returns {string} HTML content
	 */_buildSidebarPickerHTML(pGroups){let tmpHTML='<div class="pict-inline-doc-tm-sidebar-list">';let tmpHasItems=false;for(let i=0;i<pGroups.length;i++){let tmpGroup=pGroups[i];if(tmpGroup.Path){tmpHasItems=true;tmpHTML+='<div class="pict-inline-doc-tm-sidebar-item" data-path="'+this._escapeHTML(tmpGroup.Path)+'">';tmpHTML+=this._escapeHTML(tmpGroup.Name);tmpHTML+='<span class="path">'+this._escapeHTML(tmpGroup.Path)+'</span>';tmpHTML+='</div>';}let tmpItems=tmpGroup.Items||[];for(let j=0;j<tmpItems.length;j++){if(tmpItems[j].Path){tmpHasItems=true;tmpHTML+='<div class="pict-inline-doc-tm-sidebar-item" data-path="'+this._escapeHTML(tmpItems[j].Path)+'">';tmpHTML+=this._escapeHTML(tmpItems[j].Name);tmpHTML+='<span class="path">'+this._escapeHTML(tmpItems[j].Path)+'</span>';tmpHTML+='</div>';}}}if(!tmpHasItems){tmpHTML+='<div class="pict-inline-doc-tm-empty">No sidebar documents found.</div>';}tmpHTML+='</div>';return tmpHTML;}// -- Utilities --
/**
	 * Escape HTML special characters.
	 *
	 * @param {string} pText - Text to escape
	 * @returns {string} Escaped text
	 */_escapeHTML(pText){if(!pText){return'';}return pText.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}}module.exports=InlineDocumentationTopicManagerView;module.exports.default_configuration=_ViewConfiguration;},{"pict-view":23}],30:[function(require,module,exports){arguments[4][8][0].apply(exports,arguments);},{"dup":8}],31:[function(require,module,exports){arguments[4][9][0].apply(exports,arguments);},{"../package.json":30,"dup":9}],32:[function(require,module,exports){arguments[4][13][0].apply(exports,arguments);},{"dup":13}],33:[function(require,module,exports){arguments[4][14][0].apply(exports,arguments);},{"../package.json":32,"dup":14,"fable-serviceproviderbase":31}],34:[function(require,module,exports){arguments[4][15][0].apply(exports,arguments);},{"dup":15}],35:[function(require,module,exports){arguments[4][16][0].apply(exports,arguments);},{"dup":16}],36:[function(require,module,exports){arguments[4][17][0].apply(exports,arguments);},{"./Pict-Code-Highlighter.js":34,"./Pict-Section-Code-DefaultConfiguration.js":35,"./demos":37,"dup":17,"pict-view":42}],37:[function(require,module,exports){arguments[4][18][0].apply(exports,arguments);},{"../Pict-Section-Code.js":36,"dup":18}],38:[function(require,module,exports){arguments[4][19][0].apply(exports,arguments);},{"./providers/Pict-Provider-Content.js":39,"./views/Pict-View-Content.js":40,"dup":19}],39:[function(require,module,exports){arguments[4][20][0].apply(exports,arguments);},{"dup":20,"pict-provider":33,"pict-section-code":36}],40:[function(require,module,exports){arguments[4][21][0].apply(exports,arguments);},{"dup":21,"pict-view":42}],41:[function(require,module,exports){arguments[4][22][0].apply(exports,arguments);},{"dup":22}],42:[function(require,module,exports){arguments[4][23][0].apply(exports,arguments);},{"../package.json":41,"dup":23,"fable-serviceproviderbase":31}],43:[function(require,module,exports){/**
 * Pict-MDE-CodeMirror: Helper module for PictSectionMarkdownEditor
 *
 * Handles CodeMirror editor instance creation, extension configuration,
 * keyboard shortcuts, paste handling, and the data URI collapse extension.
 *//**
 * Attach CodeMirror editor creation methods to the view instance.
 *
 * @param {object} pView - The PictSectionMarkdownEditor instance
 */module.exports.attach=function attach(pView){/**
	 * Create a CodeMirror editor instance inside a container element.
	 *
	 * @param {HTMLElement} pContainer - The DOM element to mount the editor in
	 * @param {number} pSegmentIndex - The segment index
	 * @param {string} pContent - The initial content
	 */pView._createEditorInContainer=function _createEditorInContainer(pContainer,pSegmentIndex,pContent){let tmpCM=pView._codeMirrorModules;// Build the extensions array
let tmpExtensions=[];// Keyboard shortcuts for formatting, inter-segment navigation, and image paste handling
// IMPORTANT: Must be added BEFORE consumer extensions (e.g. basicSetup) so that
// our domEventHandlers fire before CM6's internal keymap handlers.
tmpExtensions.push(tmpCM.EditorView.domEventHandlers({keydown:(pEvent,pEditorView)=>{// Ctrl/Cmd + B = bold
if((pEvent.ctrlKey||pEvent.metaKey)&&pEvent.key==='b'){pEvent.preventDefault();pView.applyFormatting(pSegmentIndex,'bold');return true;}// Ctrl/Cmd + I = italic
if((pEvent.ctrlKey||pEvent.metaKey)&&pEvent.key==='i'){pEvent.preventDefault();pView.applyFormatting(pSegmentIndex,'italic');return true;}// Ctrl/Cmd + E = inline code
if((pEvent.ctrlKey||pEvent.metaKey)&&pEvent.key==='e'){pEvent.preventDefault();pView.applyFormatting(pSegmentIndex,'code');return true;}},paste:(pEvent,pEditorView)=>{// Check clipboard for image data
let tmpItems=pEvent.clipboardData&&pEvent.clipboardData.items;if(!tmpItems){return false;}for(let i=0;i<tmpItems.length;i++){if(tmpItems[i].type.startsWith('image/')){pEvent.preventDefault();let tmpFile=tmpItems[i].getAsFile();if(tmpFile){pView._processImageFile(tmpFile,pSegmentIndex);}return true;}}return false;},drop:(pEvent,pEditorView)=>{// Intercept image file drops at the CodeMirror level to prevent
// the browser from inserting the image as a raw DOM element.
// Without this, both CodeMirror's default drop behavior AND the
// container-level handler fire, causing rendering artifacts.
if(pView._dragSourceIndex>=0){return false;// segment-reorder drag, not a file drop
}if(!pEvent.dataTransfer||!pEvent.dataTransfer.files||pEvent.dataTransfer.files.length<1){return false;}let tmpFile=pEvent.dataTransfer.files[0];if(tmpFile.type&&tmpFile.type.startsWith('image/')){pEvent.preventDefault();pEvent.stopPropagation();pView._processImageFile(tmpFile,pSegmentIndex);// Clean up the dragover visual indicator on the container
let tmpContainer=pEditorView.dom.closest('.pict-mde-segment-editor');if(tmpContainer){tmpContainer.classList.remove('pict-mde-image-dragover');}return true;}return false;}}));// Add consumer-provided extensions (e.g. basicSetup, markdown())
if(tmpCM.extensions&&Array.isArray(tmpCM.extensions)){tmpExtensions=tmpExtensions.concat(tmpCM.extensions);}// Update listener for content changes, focus, and cursor tracking
tmpExtensions.push(tmpCM.EditorView.updateListener.of(pUpdate=>{if(pUpdate.docChanged){pView._onSegmentContentChange(pSegmentIndex,pUpdate.state.doc.toString());}// Track focus changes to toggle the active class
if(pUpdate.focusChanged){if(pUpdate.view.hasFocus){pView._setActiveSegment(pSegmentIndex);// Position sidebar at cursor on focus
pView._updateSidebarPosition(pSegmentIndex);}else{// Small delay so clicking a sidebar button doesn't immediately deactivate
setTimeout(()=>{if(pView._activeSegmentIndex===pSegmentIndex){// Check if focus moved to another segment or truly left
let tmpSegEl=document.getElementById("PictMDE-Segment-".concat(pSegmentIndex));if(tmpSegEl&&!tmpSegEl.contains(document.activeElement)){pView._clearActiveSegment(pSegmentIndex);pView._resetSidebarPosition(pSegmentIndex);}}},100);}}// Track cursor/selection changes to move the sidebar
if(pUpdate.selectionSet&&pUpdate.view.hasFocus){pView._updateSidebarPosition(pSegmentIndex);}}));// Collapse long data URIs in image markdown so the editor is readable
let tmpCollapseExtension=pView._buildDataURICollapseExtension();if(tmpCollapseExtension){tmpExtensions.push(tmpCollapseExtension);}// Make read-only if configured
if(pView.options.ReadOnly){tmpExtensions.push(tmpCM.EditorState.readOnly.of(true));tmpExtensions.push(tmpCM.EditorView.editable.of(false));}// Allow consumer to customize extensions
tmpExtensions=pView.customConfigureExtensions(tmpExtensions,pSegmentIndex);let tmpState=tmpCM.EditorState.create({doc:pContent||'',extensions:tmpExtensions});let tmpEditorView=new tmpCM.EditorView({state:tmpState,parent:pContainer});pView._segmentEditors[pSegmentIndex]=tmpEditorView;// -- Inter-segment arrow-key navigation --
// Use a capture-phase DOM listener so we intercept ArrowDown/ArrowUp
// BEFORE CodeMirror's internal keymap handlers process them.
tmpEditorView.contentDOM.addEventListener('keydown',function(pEvent){if(pEvent.key!=='ArrowDown'&&pEvent.key!=='ArrowUp'){return;}// Don't interfere if a modifier key is held (selection, etc.)
if(pEvent.shiftKey||pEvent.ctrlKey||pEvent.metaKey||pEvent.altKey){return;}let tmpState=tmpEditorView.state;let tmpCursorPos=tmpState.selection.main.head;let tmpLine=tmpState.doc.lineAt(tmpCursorPos);let tmpColumnOffset=tmpCursorPos-tmpLine.from;if(pEvent.key==='ArrowDown'){// Only navigate when cursor is on the very last line
if(tmpLine.to<tmpState.doc.length){return;// not on last line — let CM handle it
}// Find next segment
let tmpOrderedIndices=pView._getOrderedSegmentIndices();let tmpLogicalIndex=pView._getLogicalIndex(pSegmentIndex);if(tmpLogicalIndex<0||tmpLogicalIndex>=tmpOrderedIndices.length-1){return;// last segment — nowhere to go
}let tmpNextInternalIndex=tmpOrderedIndices[tmpLogicalIndex+1];let tmpNextEditor=pView._segmentEditors[tmpNextInternalIndex];if(!tmpNextEditor){return;}pEvent.preventDefault();pEvent.stopPropagation();// Focus the next editor and place cursor on the first line
let tmpFirstLine=tmpNextEditor.state.doc.line(1);let tmpTargetCol=Math.min(tmpColumnOffset,tmpFirstLine.to-tmpFirstLine.from);tmpNextEditor.focus();tmpNextEditor.dispatch({selection:{anchor:tmpFirstLine.from+tmpTargetCol}});pView._setActiveSegment(tmpNextInternalIndex);}else if(pEvent.key==='ArrowUp'){// Only navigate when cursor is on the very first line
if(tmpLine.number>1){return;// not on first line — let CM handle it
}// Find previous segment
let tmpOrderedIndices=pView._getOrderedSegmentIndices();let tmpLogicalIndex=pView._getLogicalIndex(pSegmentIndex);if(tmpLogicalIndex<=0){return;// first segment — nowhere to go
}let tmpPrevInternalIndex=tmpOrderedIndices[tmpLogicalIndex-1];let tmpPrevEditor=pView._segmentEditors[tmpPrevInternalIndex];if(!tmpPrevEditor){return;}pEvent.preventDefault();pEvent.stopPropagation();// Focus the previous editor and place cursor on the last line
let tmpLastLine=tmpPrevEditor.state.doc.line(tmpPrevEditor.state.doc.lines);let tmpTargetCol=Math.min(tmpColumnOffset,tmpLastLine.to-tmpLastLine.from);tmpPrevEditor.focus();tmpPrevEditor.dispatch({selection:{anchor:tmpLastLine.from+tmpTargetCol}});pView._setActiveSegment(tmpPrevInternalIndex);}},true);// <-- capture phase
// -- Capture-phase drop listener for image files --
// Safari processes native contenteditable drops before CodeMirror's
// bubble-phase domEventHandlers fire, which can insert a raw <img>
// element into the editor DOM.  A capture-phase listener fires first
// and lets us preventDefault() before the browser acts.
tmpEditorView.contentDOM.addEventListener('drop',function(pEvent){if(pView._dragSourceIndex>=0){return;// segment-reorder drag
}if(!pEvent.dataTransfer||!pEvent.dataTransfer.files||pEvent.dataTransfer.files.length<1){return;}let tmpFile=pEvent.dataTransfer.files[0];if(tmpFile.type&&tmpFile.type.startsWith('image/')){pEvent.preventDefault();pEvent.stopPropagation();pView._processImageFile(tmpFile,pSegmentIndex);// Clean up the dragover visual indicator
let tmpEditorEl=document.getElementById("PictMDE-SegmentEditor-".concat(pSegmentIndex));if(tmpEditorEl){tmpEditorEl.classList.remove('pict-mde-image-dragover');}}},true);// <-- capture phase
};/**
	 * Build a CodeMirror extension that visually collapses long data URIs
	 * inside markdown image syntax.
	 *
	 * The extension uses Decoration.replace() to hide the long base64 portion
	 * and show a compact widget instead, e.g. "data:image/jpeg;base64...28KB".
	 * The actual document content is unchanged -- only the visual display
	 * is affected.
	 *
	 * Returns null if the required CodeMirror modules (Decoration, ViewPlugin,
	 * WidgetType) are not available.
	 *
	 * @returns {object|null} A CodeMirror ViewPlugin extension, or null
	 */pView._buildDataURICollapseExtension=function _buildDataURICollapseExtension(){let tmpCM=pView._codeMirrorModules;// All three classes are required -- degrade gracefully if not available
if(!tmpCM||!tmpCM.Decoration||!tmpCM.ViewPlugin||!tmpCM.WidgetType){return null;}let tmpDecoration=tmpCM.Decoration;let tmpViewPlugin=tmpCM.ViewPlugin;let tmpWidgetType=tmpCM.WidgetType;// Minimum data URI length before collapsing (short URIs are left alone)
let tmpMinLength=200;// Widget class: renders the collapsed placeholder inline
class DataURIWidget extends tmpWidgetType{constructor(pLabel){super();this.label=pLabel;}toDOM(){let tmpSpan=document.createElement('span');tmpSpan.className='pict-mde-data-uri-collapsed';tmpSpan.textContent=this.label;tmpSpan.title='Data URI (click to expand in image preview below)';return tmpSpan;}eq(pOther){return this.label===pOther.label;}}/**
		 * Scan the visible ranges of the document for data URIs inside image
		 * markdown and build a DecorationSet that replaces the long portion.
		 *
		 * Pattern:  ![alt](data:image/TYPE;base64,LONGSTRING)
		 *
		 * We keep "![alt](data:image/TYPE;base64," visible and replace only the
		 * long base64 payload plus the closing ")" with a compact widget.
		 */function buildDecorations(pEditorView){let tmpDecorations=[];let tmpDoc=pEditorView.state.doc;for(let tmpVisRange of pEditorView.visibleRanges){let tmpFrom=tmpVisRange.from;let tmpTo=tmpVisRange.to;let tmpText=tmpDoc.sliceString(tmpFrom,tmpTo);// Match: ![...](data:image/...;base64,...) -- we need positions of the base64 payload
let tmpRegex=/!\[[^\]]*\]\(data:([^;]+);base64,/g;let tmpMatch;while((tmpMatch=tmpRegex.exec(tmpText))!==null){// tmpMatch[0] is "![alt](data:image/png;base64,"
// tmpMatch[1] is the MIME subtype, e.g. "image/png"
let tmpPayloadStart=tmpFrom+tmpMatch.index+tmpMatch[0].length;// Find the closing parenthesis -- scan forward from payloadStart
let tmpPayloadEnd=-1;let tmpSearchFrom=tmpPayloadStart;let tmpDocLength=tmpDoc.length;// Scan character by character in the document for the closing ')'
// We need to handle this carefully since the payload could be huge
// and span beyond the visible range.
// Search up to 5MB worth of characters (way more than any realistic image).
let tmpMaxScan=Math.min(tmpDocLength,tmpSearchFrom+5*1024*1024);let tmpChunkSize=4096;for(let tmpPos=tmpSearchFrom;tmpPos<tmpMaxScan;tmpPos+=tmpChunkSize){let tmpEnd=Math.min(tmpPos+tmpChunkSize,tmpMaxScan);let tmpChunk=tmpDoc.sliceString(tmpPos,tmpEnd);let tmpParenIdx=tmpChunk.indexOf(')');if(tmpParenIdx>=0){tmpPayloadEnd=tmpPos+tmpParenIdx;break;}}if(tmpPayloadEnd<0){// No closing paren found -- skip this match
continue;}// Calculate the payload length (base64 data between comma and closing paren)
let tmpPayloadLength=tmpPayloadEnd-tmpPayloadStart;if(tmpPayloadLength<tmpMinLength){// Too short to bother collapsing
continue;}// Build a human-readable size label
let tmpSizeBytes=Math.round(tmpPayloadLength*0.75);// base64 to bytes approx
let tmpSizeLabel;if(tmpSizeBytes>=1024*1024){tmpSizeLabel=(tmpSizeBytes/(1024*1024)).toFixed(1)+'MB';}else if(tmpSizeBytes>=1024){tmpSizeLabel=Math.round(tmpSizeBytes/1024)+'KB';}else{tmpSizeLabel=tmpSizeBytes+'B';}let tmpMimeType=tmpMatch[1]||'image';let tmpWidgetLabel="\u2026".concat(tmpSizeLabel,")");// Replace from the start of the base64 payload to after the closing paren
let tmpWidget=tmpDecoration.replace({widget:new DataURIWidget(tmpWidgetLabel)});tmpDecorations.push(tmpWidget.range(tmpPayloadStart,tmpPayloadEnd+1));}}return tmpDecoration.set(tmpDecorations,true);}// Create the ViewPlugin
let tmpPlugin=tmpViewPlugin.fromClass(class{constructor(pEditorView){this.decorations=buildDecorations(pEditorView);}update(pUpdate){if(pUpdate.docChanged||pUpdate.viewportChanged){this.decorations=buildDecorations(pUpdate.view);}}},{decorations:pPlugin=>pPlugin.decorations});return tmpPlugin;};};},{}],44:[function(require,module,exports){/**
 * Pict-MDE-DragAndReorder: Helper module for PictSectionMarkdownEditor
 *
 * Handles segment drag-and-drop reordering, active segment management,
 * sidebar cursor-tracking positioning, and hidden-preview state maintenance
 * across reorder operations.
 *//**
 * Attach drag/reorder and active-segment methods to the view instance.
 *
 * @param {object} pView - The PictSectionMarkdownEditor instance
 */module.exports.attach=function attach(pView){/**
	 * Wire drag-and-drop events on a segment element for reorder via the drag handle.
	 *
	 * @param {HTMLElement} pSegmentElement - The .pict-mde-segment element
	 * @param {number} pSegmentIndex - The internal segment index
	 */pView._wireSegmentDragEvents=function _wireSegmentDragEvents(pSegmentElement,pSegmentIndex){let tmpHandle=pSegmentElement.querySelector('.pict-mde-drag-handle');if(!tmpHandle){return;}// The drag handle is the draggable element
tmpHandle.addEventListener('dragstart',pEvent=>{pView._dragSourceIndex=pSegmentIndex;pEvent.dataTransfer.effectAllowed='move';pEvent.dataTransfer.setData('text/plain',String(pSegmentIndex));// Add a dragging class to the container so CSS can disable pointer-events
// on CodeMirror editors (preventing them from intercepting the drop event)
let tmpContainerEl=pView._getContainerElement();if(tmpContainerEl){tmpContainerEl.classList.add('pict-mde-dragging');}setTimeout(()=>{pSegmentElement.style.opacity='0.4';},0);});tmpHandle.addEventListener('dragend',()=>{pSegmentElement.style.opacity='';pView._dragSourceIndex=-1;pView._clearAllDropIndicators();// Remove the dragging class from the container
let tmpContainerEl=pView._getContainerElement();if(tmpContainerEl){tmpContainerEl.classList.remove('pict-mde-dragging');}});// Drop target: the whole segment row. We determine above/below from mouse Y.
pSegmentElement.addEventListener('dragover',pEvent=>{pEvent.preventDefault();pEvent.dataTransfer.dropEffect='move';// Clear all indicators first, then set the correct one
pView._clearAllDropIndicators();// Determine if cursor is in the top or bottom half of this segment
let tmpRect=pSegmentElement.getBoundingClientRect();let tmpMidY=tmpRect.top+tmpRect.height/2;if(pEvent.clientY<tmpMidY){pSegmentElement.classList.add('pict-mde-drag-over-top');}else{pSegmentElement.classList.add('pict-mde-drag-over-bottom');}});pSegmentElement.addEventListener('dragleave',pEvent=>{// Only clear if we're actually leaving the element (not entering a child)
if(!pSegmentElement.contains(pEvent.relatedTarget)){pSegmentElement.classList.remove('pict-mde-drag-over-top');pSegmentElement.classList.remove('pict-mde-drag-over-bottom');}});pSegmentElement.addEventListener('drop',pEvent=>{pEvent.preventDefault();let tmpDropBelow=pSegmentElement.classList.contains('pict-mde-drag-over-bottom');pView._clearAllDropIndicators();let tmpSourceIndex=pView._dragSourceIndex;if(tmpSourceIndex<0||tmpSourceIndex===pSegmentIndex){return;}pView._reorderSegment(tmpSourceIndex,pSegmentIndex,tmpDropBelow);});};/**
	 * Clear all drop indicator classes from all segments.
	 */pView._clearAllDropIndicators=function _clearAllDropIndicators(){let tmpContainer=pView._getContainerElement();if(!tmpContainer){return;}let tmpAllSegments=tmpContainer.querySelectorAll('.pict-mde-segment');for(let i=0;i<tmpAllSegments.length;i++){tmpAllSegments[i].classList.remove('pict-mde-drag-over-top');tmpAllSegments[i].classList.remove('pict-mde-drag-over-bottom');}};/**
	 * Reorder a segment from one position to another via drag.
	 *
	 * @param {number} pFromInternalIndex - The internal index of the dragged segment
	 * @param {number} pToInternalIndex - The internal index of the drop target
	 * @param {boolean} pDropBelow - Whether the drop was on the bottom half of the target
	 */pView._reorderSegment=function _reorderSegment(pFromInternalIndex,pToInternalIndex,pDropBelow){let tmpFromLogical=pView._getLogicalIndex(pFromInternalIndex);let tmpToLogical=pView._getLogicalIndex(pToInternalIndex);if(tmpFromLogical<0||tmpToLogical<0){pView.log.warn("PICT-MarkdownEditor _reorderSegment: could not resolve logical indices (from=".concat(tmpFromLogical,", to=").concat(tmpToLogical,")."));return;}if(tmpFromLogical===tmpToLogical){return;}// Marshal all editor content back to data before manipulating the array
pView._marshalAllEditorsToData();let tmpSegments=pView._getSegmentsFromData();if(!tmpSegments||tmpSegments.length<2){return;}// Calculate the target insertion index
let tmpInsertAt=pDropBelow?tmpToLogical+1:tmpToLogical;// Adjust for the removal shifting indices down
if(tmpFromLogical<tmpInsertAt){tmpInsertAt--;}// If the insert position equals the source, no move needed
if(tmpInsertAt===tmpFromLogical){return;}// Perform the reorder: remove from old position, insert at new
let tmpMoved=tmpSegments.splice(tmpFromLogical,1)[0];tmpSegments.splice(tmpInsertAt,0,tmpMoved);// Explicitly write the reordered array back to the data address
pView._setSegmentsToData(tmpSegments);// Reorder per-segment hidden preview state to follow the moved segment
pView._reorderHiddenPreviewState(tmpFromLogical,tmpInsertAt);// Reorder per-segment tab states to follow the moved segment
pView._reorderSegmentTabStates(tmpFromLogical,tmpInsertAt);pView._buildEditorUI();};/**
	 * Reorder the hidden preview state after a splice-based move
	 * (remove from pFrom, insert at pTo).
	 *
	 * @param {number} pFrom - The logical index the segment was removed from
	 * @param {number} pTo - The logical index the segment was inserted at
	 */pView._reorderHiddenPreviewState=function _reorderHiddenPreviewState(pFrom,pTo){if(pFrom===pTo){return;}// Build an ordered array of hidden-state booleans
let tmpKeys=Object.keys(pView._hiddenPreviewSegments).map(k=>parseInt(k,10));if(tmpKeys.length===0){return;}let tmpMaxIndex=Math.max(...tmpKeys,pFrom,pTo);let tmpStates=[];for(let i=0;i<=tmpMaxIndex;i++){tmpStates.push(!!pView._hiddenPreviewSegments[i]);}// Perform the same splice on the states array
let tmpMovedState=tmpStates.splice(pFrom,1)[0];tmpStates.splice(pTo,0,tmpMovedState);// Rebuild the hidden map
pView._hiddenPreviewSegments={};for(let i=0;i<tmpStates.length;i++){if(tmpStates[i]){pView._hiddenPreviewSegments[i]=true;}}};/**
	 * Swap the hidden preview state of two logical indices.
	 * Used when moveSegmentUp/Down swaps adjacent segments.
	 *
	 * @param {number} pIndexA - First logical index
	 * @param {number} pIndexB - Second logical index
	 */pView._swapHiddenPreviewState=function _swapHiddenPreviewState(pIndexA,pIndexB){let tmpAHidden=!!pView._hiddenPreviewSegments[pIndexA];let tmpBHidden=!!pView._hiddenPreviewSegments[pIndexB];if(tmpBHidden){pView._hiddenPreviewSegments[pIndexA]=true;}else{delete pView._hiddenPreviewSegments[pIndexA];}if(tmpAHidden){pView._hiddenPreviewSegments[pIndexB]=true;}else{delete pView._hiddenPreviewSegments[pIndexB];}};/**
	 * Reorder the segment tab states after a splice-based move
	 * (remove from pFrom, insert at pTo).
	 *
	 * @param {number} pFrom - The logical index the segment was removed from
	 * @param {number} pTo - The logical index the segment was inserted at
	 */pView._reorderSegmentTabStates=function _reorderSegmentTabStates(pFrom,pTo){if(pFrom===pTo){return;}let tmpKeys=Object.keys(pView._segmentTabStates).map(k=>parseInt(k,10));if(tmpKeys.length===0){return;}let tmpMaxIndex=Math.max(...tmpKeys,pFrom,pTo);let tmpStates=[];for(let i=0;i<=tmpMaxIndex;i++){tmpStates.push(pView._segmentTabStates[i]||'editor');}let tmpMovedState=tmpStates.splice(pFrom,1)[0];tmpStates.splice(pTo,0,tmpMovedState);pView._segmentTabStates={};for(let i=0;i<tmpStates.length;i++){if(tmpStates[i]!=='editor'){pView._segmentTabStates[i]=tmpStates[i];}}};/**
	 * Swap the segment tab states of two logical indices.
	 * Used when moveSegmentUp/Down swaps adjacent segments.
	 *
	 * @param {number} pIndexA - First logical index
	 * @param {number} pIndexB - Second logical index
	 */pView._swapSegmentTabStates=function _swapSegmentTabStates(pIndexA,pIndexB){let tmpA=pView._segmentTabStates[pIndexA]||'editor';let tmpB=pView._segmentTabStates[pIndexB]||'editor';if(tmpB!=='editor'){pView._segmentTabStates[pIndexA]=tmpB;}else{delete pView._segmentTabStates[pIndexA];}if(tmpA!=='editor'){pView._segmentTabStates[pIndexB]=tmpA;}else{delete pView._segmentTabStates[pIndexB];}};// -- Active Segment Management --
/**
	 * Set a segment as the active (focused) segment.
	 *
	 * @param {number} pSegmentIndex - The internal segment index
	 */pView._setActiveSegment=function _setActiveSegment(pSegmentIndex){// Clear previous active
if(pView._activeSegmentIndex>=0&&pView._activeSegmentIndex!==pSegmentIndex){let tmpPrevEl=document.getElementById("PictMDE-Segment-".concat(pView._activeSegmentIndex));if(tmpPrevEl){tmpPrevEl.classList.remove('pict-mde-active');}}pView._activeSegmentIndex=pSegmentIndex;let tmpSegEl=document.getElementById("PictMDE-Segment-".concat(pSegmentIndex));if(tmpSegEl){tmpSegEl.classList.add('pict-mde-active');}};/**
	 * Clear the active state from a segment (on blur).
	 *
	 * @param {number} pSegmentIndex - The internal segment index
	 */pView._clearActiveSegment=function _clearActiveSegment(pSegmentIndex){if(pView._activeSegmentIndex===pSegmentIndex){pView._activeSegmentIndex=-1;}let tmpSegEl=document.getElementById("PictMDE-Segment-".concat(pSegmentIndex));if(tmpSegEl){tmpSegEl.classList.remove('pict-mde-active');}// Reset sidebar back to sticky when segment is no longer active
pView._resetSidebarPosition(pSegmentIndex);};// -- Sidebar Cursor Tracking --
/**
	 * Update the sidebar formatting-buttons position so they float next to the
	 * cursor / selection in the active segment.
	 *
	 * When a segment is active and has a cursor, we switch the sidebar-actions
	 * from sticky positioning to absolute, offset to align with the cursor line.
	 *
	 * @param {number} pSegmentIndex - The internal segment index
	 */pView._updateSidebarPosition=function _updateSidebarPosition(pSegmentIndex){let tmpSegmentEl=document.getElementById("PictMDE-Segment-".concat(pSegmentIndex));if(!tmpSegmentEl){return;}let tmpQuadrantTR=tmpSegmentEl.querySelector('.pict-mde-quadrant-tr');if(!tmpQuadrantTR){return;}let tmpEditor=pView._segmentEditors[pSegmentIndex];if(!tmpEditor){return;}// Get the cursor position in the editor
let tmpCursorPos=tmpEditor.state.selection.main.head;let tmpCursorCoords=tmpEditor.coordsAtPos(tmpCursorPos);if(!tmpCursorCoords){// If we can't get coords, revert to sticky
pView._resetSidebarPosition(pSegmentIndex);return;}// Calculate the offset relative to the segment element
let tmpSegmentRect=tmpSegmentEl.getBoundingClientRect();let tmpOffsetTop=tmpCursorCoords.top-tmpSegmentRect.top;// Clamp so the sidebar buttons don't go above the segment or below it
let tmpSidebarHeight=tmpQuadrantTR.offsetHeight||0;let tmpSegmentHeight=tmpSegmentEl.offsetHeight||0;let tmpMaxOffset=Math.max(0,tmpSegmentHeight-tmpSidebarHeight);tmpOffsetTop=Math.max(0,Math.min(tmpOffsetTop,tmpMaxOffset));// Apply the cursor-relative positioning
tmpQuadrantTR.classList.add('pict-mde-sidebar-at-cursor');tmpQuadrantTR.style.setProperty('--pict-mde-sidebar-top',"".concat(tmpOffsetTop,"px"));};/**
	 * Reset the sidebar back to default sticky positioning (no cursor tracking).
	 *
	 * @param {number} pSegmentIndex - The internal segment index
	 */pView._resetSidebarPosition=function _resetSidebarPosition(pSegmentIndex){let tmpSegmentEl=document.getElementById("PictMDE-Segment-".concat(pSegmentIndex));if(!tmpSegmentEl){return;}let tmpQuadrantTR=tmpSegmentEl.querySelector('.pict-mde-quadrant-tr');if(!tmpQuadrantTR){return;}tmpQuadrantTR.classList.remove('pict-mde-sidebar-at-cursor');tmpQuadrantTR.style.removeProperty('--pict-mde-sidebar-top');};};},{}],45:[function(require,module,exports){/**
 * Pict-MDE-Formatting: Helper module for PictSectionMarkdownEditor
 *
 * Handles markdown formatting operations (bold, italic, code, heading, link)
 * applied to selections or at the cursor position in CodeMirror editors.
 */// Markdown formatting definitions: wrapper characters for toggle-style formatting
const _FormattingMap={bold:{wrap:'**'},italic:{wrap:'*'},code:{wrap:'`'},heading:{prefix:'# '},link:{before:'[',after:'](url)'}};/**
 * Attach formatting methods to the view instance.
 *
 * @param {object} pView - The PictSectionMarkdownEditor instance
 */module.exports.attach=function attach(pView){/**
	 * Apply markdown formatting to the selection (or insert formatting at cursor)
	 * in a specific segment.
	 *
	 * If text is selected, wraps it.  If no selection, inserts the formatting
	 * markers and places the cursor between them.
	 *
	 * @param {number} pSegmentIndex - The internal segment index
	 * @param {string} pFormatType - One of: 'bold', 'italic', 'code', 'heading', 'link'
	 */pView.applyFormatting=function applyFormatting(pSegmentIndex,pFormatType){let tmpEditor=pView._segmentEditors[pSegmentIndex];if(!tmpEditor){pView.log.warn("PICT-MarkdownEditor applyFormatting: no editor for segment ".concat(pSegmentIndex,"."));return;}let tmpFormat=_FormattingMap[pFormatType];if(!tmpFormat){pView.log.warn("PICT-MarkdownEditor applyFormatting: unknown format type \"".concat(pFormatType,"\"."));return;}let tmpState=tmpEditor.state;let tmpSelection=tmpState.selection.main;let tmpFrom=tmpSelection.from;let tmpTo=tmpSelection.to;let tmpHasSelection=tmpFrom!==tmpTo;let tmpSelectedText=tmpHasSelection?tmpState.sliceDoc(tmpFrom,tmpTo):'';let tmpChanges;let tmpCursorPos;if(tmpFormat.wrap){// Toggle-style: wrap selection or insert empty wrapper
let tmpWrap=tmpFormat.wrap;if(tmpHasSelection){// Check if already wrapped — if so, unwrap
let tmpBefore=tmpState.sliceDoc(Math.max(0,tmpFrom-tmpWrap.length),tmpFrom);let tmpAfter=tmpState.sliceDoc(tmpTo,Math.min(tmpState.doc.length,tmpTo+tmpWrap.length));if(tmpBefore===tmpWrap&&tmpAfter===tmpWrap){// Unwrap
tmpChanges=[{from:tmpFrom-tmpWrap.length,to:tmpFrom,insert:''},{from:tmpTo,to:tmpTo+tmpWrap.length,insert:''}];tmpCursorPos=tmpFrom-tmpWrap.length;tmpEditor.dispatch({changes:tmpChanges,selection:{anchor:tmpCursorPos,head:tmpCursorPos+tmpSelectedText.length}});return;}// Wrap the selection
let tmpInsert=tmpWrap+tmpSelectedText+tmpWrap;tmpChanges={from:tmpFrom,to:tmpTo,insert:tmpInsert};tmpCursorPos=tmpFrom+tmpWrap.length;tmpEditor.dispatch({changes:tmpChanges,selection:{anchor:tmpCursorPos,head:tmpCursorPos+tmpSelectedText.length}});}else{// No selection: insert empty wrapper and place cursor inside
let tmpInsert=tmpWrap+tmpWrap;tmpChanges={from:tmpFrom,insert:tmpInsert};tmpCursorPos=tmpFrom+tmpWrap.length;tmpEditor.dispatch({changes:tmpChanges,selection:{anchor:tmpCursorPos}});}}else if(tmpFormat.prefix){// Line-prefix style (headings)
let tmpLine=tmpState.doc.lineAt(tmpFrom);let tmpLineText=tmpLine.text;// Toggle: if line already starts with the prefix, remove it; otherwise add
if(tmpLineText.startsWith(tmpFormat.prefix)){tmpChanges={from:tmpLine.from,to:tmpLine.from+tmpFormat.prefix.length,insert:''};}else{tmpChanges={from:tmpLine.from,insert:tmpFormat.prefix};}tmpEditor.dispatch({changes:tmpChanges});}else if(tmpFormat.before&&tmpFormat.after){// Surround style (links)
if(tmpHasSelection){let tmpInsert=tmpFormat.before+tmpSelectedText+tmpFormat.after;tmpChanges={from:tmpFrom,to:tmpTo,insert:tmpInsert};// Place cursor on the "url" part
tmpCursorPos=tmpFrom+tmpFormat.before.length+tmpSelectedText.length+2;tmpEditor.dispatch({changes:tmpChanges,selection:{anchor:tmpCursorPos,head:tmpCursorPos+3}});}else{let tmpInsert=tmpFormat.before+tmpFormat.after;tmpChanges={from:tmpFrom,insert:tmpInsert};tmpCursorPos=tmpFrom+tmpFormat.before.length;tmpEditor.dispatch({changes:tmpChanges,selection:{anchor:tmpCursorPos}});}}// Re-focus the editor after clicking a sidebar button
tmpEditor.focus();};};},{}],46:[function(require,module,exports){/**
 * Pict-MDE-ImageHandling: Helper module for PictSectionMarkdownEditor
 *
 * Handles image operations: file picker, file processing (hook or base64
 * fallback), markdown insertion, preview thumbnail rendering, and
 * drag-and-drop for image files onto the editor.
 *//**
 * Attach image handling methods to the view instance.
 *
 * @param {object} pView - The PictSectionMarkdownEditor instance
 */module.exports.attach=function attach(pView){/**
	 * Open a file picker to select an image for insertion into a segment.
	 * Called by the sidebar image button onclick handler.
	 *
	 * @param {number} pSegmentIndex - The internal segment index
	 */pView.openImagePicker=function openImagePicker(pSegmentIndex){let tmpFileInput=document.getElementById("PictMDE-ImageInput-".concat(pSegmentIndex));if(!tmpFileInput){pView.log.warn("PICT-MarkdownEditor openImagePicker: file input not found for segment ".concat(pSegmentIndex,"."));return;}// Wire the change handler fresh each time (in case it was already used)
tmpFileInput.onchange=()=>{if(tmpFileInput.files&&tmpFileInput.files.length>0){pView._processImageFile(tmpFileInput.files[0],pSegmentIndex);}// Reset the input so the same file can be re-selected
tmpFileInput.value='';};tmpFileInput.click();};/**
	 * Process an image File object from any input method (picker, drag, paste).
	 *
	 * If the consumer has overridden onImageUpload and it returns true, the
	 * consumer handles the upload and calls the callback with a URL.
	 * Otherwise, the image is converted to a base64 data URI inline.
	 *
	 * @param {File} pFile - The image File object
	 * @param {number} pSegmentIndex - The internal segment index
	 */pView._processImageFile=function _processImageFile(pFile,pSegmentIndex){if(!pFile||!pFile.type||!pFile.type.startsWith('image/')){pView.log.warn("PICT-MarkdownEditor _processImageFile: not an image file (type: ".concat(pFile?pFile.type:'null',")."));return;}let tmpAltText=pFile.name?pFile.name.replace(/\.[^.]+$/,''):'image';// Check if the consumer wants to handle the upload
let tmpCallback=(pError,pURL)=>{if(pError){pView.log.error("PICT-MarkdownEditor image upload error: ".concat(pError));return;}if(pURL){pView._insertImageMarkdown(pSegmentIndex,pURL,tmpAltText);}};let tmpHandled=pView.onImageUpload(pFile,pSegmentIndex,tmpCallback);if(tmpHandled){// Consumer is handling the upload asynchronously
return;}// Default: convert to base64 data URI
if(typeof FileReader==='undefined'){pView.log.error("PICT-MarkdownEditor _processImageFile: FileReader not available in this environment.");return;}let tmpReader=new FileReader();tmpReader.onload=()=>{pView._insertImageMarkdown(pSegmentIndex,tmpReader.result,tmpAltText);};tmpReader.onerror=()=>{pView.log.error("PICT-MarkdownEditor _processImageFile: FileReader error.");};tmpReader.readAsDataURL(pFile);};/**
	 * Insert markdown image syntax at the cursor position in a segment editor.
	 *
	 * @param {number} pSegmentIndex - The internal segment index
	 * @param {string} pURL - The image URL (data URI or remote URL)
	 * @param {string} [pAltText] - The alt text (default: 'image')
	 */pView._insertImageMarkdown=function _insertImageMarkdown(pSegmentIndex,pURL,pAltText){let tmpEditor=pView._segmentEditors[pSegmentIndex];if(!tmpEditor){pView.log.warn("PICT-MarkdownEditor _insertImageMarkdown: no editor for segment ".concat(pSegmentIndex,"."));return;}let tmpAlt=pAltText||'image';let tmpInsert="![".concat(tmpAlt,"](").concat(pURL,")");let tmpState=tmpEditor.state;let tmpCursorPos=tmpState.selection.main.head;tmpEditor.dispatch({changes:{from:tmpCursorPos,insert:tmpInsert},selection:{anchor:tmpCursorPos+tmpInsert.length}});tmpEditor.focus();// Update the image preview area for this segment
pView._updateImagePreviews(pSegmentIndex);};/**
	 * Scan the content of a segment for markdown image references and render
	 * preview thumbnails in the preview area below the editor.
	 *
	 * Matches the pattern ![alt](url) and creates <img> elements for each.
	 * The preview area is hidden when there are no images.
	 *
	 * @param {number} pSegmentIndex - The internal segment index
	 */pView._updateImagePreviews=function _updateImagePreviews(pSegmentIndex){let tmpPreviewEl=document.getElementById("PictMDE-ImagePreview-".concat(pSegmentIndex));if(!tmpPreviewEl){return;}let tmpEditor=pView._segmentEditors[pSegmentIndex];if(!tmpEditor){tmpPreviewEl.innerHTML='';tmpPreviewEl.classList.remove('pict-mde-has-images');return;}let tmpContent=tmpEditor.state.doc.toString();// Match markdown image syntax: ![alt text](url)
let tmpImageRegex=/!\[([^\]]*)\]\(([^)]+)\)/g;let tmpMatches=[];let tmpMatch;while((tmpMatch=tmpImageRegex.exec(tmpContent))!==null){tmpMatches.push({alt:tmpMatch[1]||'image',url:tmpMatch[2]});}if(tmpMatches.length===0){tmpPreviewEl.innerHTML='';tmpPreviewEl.classList.remove('pict-mde-has-images');return;}// Build preview HTML
let tmpHTML='';for(let i=0;i<tmpMatches.length;i++){let tmpAlt=tmpMatches[i].alt.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');let tmpResolvedURL=pView._resolveImageURL(tmpMatches[i].url);let tmpURL=tmpResolvedURL.replace(/&/g,'&amp;').replace(/"/g,'&quot;');tmpHTML+="<div class=\"pict-mde-image-preview-item\"><img src=\"".concat(tmpURL,"\" alt=\"").concat(tmpAlt,"\" /><span class=\"pict-mde-image-preview-label\">").concat(tmpAlt,"</span></div>");}tmpPreviewEl.innerHTML=tmpHTML;tmpPreviewEl.classList.add('pict-mde-has-images');};/**
	 * Wire drag-and-drop events for image files on a segment editor container.
	 *
	 * These events are separate from the segment-reorder drag events.
	 * File drags are distinguished from segment reorder drags by checking
	 * dataTransfer.types for 'Files' and ensuring _dragSourceIndex is -1.
	 *
	 * @param {HTMLElement} pEditorContainer - The .pict-mde-segment-editor element
	 * @param {number} pSegmentIndex - The internal segment index
	 */pView._wireImageDragEvents=function _wireImageDragEvents(pEditorContainer,pSegmentIndex){pEditorContainer.addEventListener('dragover',pEvent=>{// Only handle file drags, not segment-reorder drags
if(pView._dragSourceIndex>=0){return;}if(!pEvent.dataTransfer||!pEvent.dataTransfer.types||pEvent.dataTransfer.types.indexOf('Files')<0){return;}pEvent.preventDefault();pEvent.dataTransfer.dropEffect='copy';pEditorContainer.classList.add('pict-mde-image-dragover');});pEditorContainer.addEventListener('dragleave',pEvent=>{// Only clear if actually leaving the element
if(!pEditorContainer.contains(pEvent.relatedTarget)){pEditorContainer.classList.remove('pict-mde-image-dragover');}});pEditorContainer.addEventListener('drop',pEvent=>{pEditorContainer.classList.remove('pict-mde-image-dragover');// Only handle file drops, not segment-reorder drops
if(pView._dragSourceIndex>=0){return;}if(!pEvent.dataTransfer||!pEvent.dataTransfer.files||pEvent.dataTransfer.files.length<1){return;}let tmpFile=pEvent.dataTransfer.files[0];if(tmpFile.type&&tmpFile.type.startsWith('image/')){pEvent.preventDefault();pEvent.stopPropagation();pView._processImageFile(tmpFile,pSegmentIndex);}});};};},{}],47:[function(require,module,exports){/**
 * Pict-MDE-RichPreview: Helper module for PictSectionMarkdownEditor
 *
 * Handles rich content preview rendering via pict-section-content:
 * markdown-to-HTML parsing, mermaid diagram rendering, KaTeX math
 * rendering, and the full rendered-view toggle.
 */const libPictSectionContent=require('pict-section-content');const libPictContentProvider=libPictSectionContent.PictContentProvider;/**
 * Attach rich preview methods to the view instance.
 *
 * @param {object} pView - The PictSectionMarkdownEditor instance
 */module.exports.attach=function attach(pView){/**
	 * Get the pict-section-content provider instance for markdown parsing.
	 * Lazily instantiated on first use.
	 *
	 * @returns {object} The PictContentProvider instance
	 */pView._getContentProvider=function _getContentProvider(){if(!pView._contentProvider){pView._contentProvider=new libPictContentProvider(pView.fable,{},'Pict-Content-Provider-MDE');}return pView._contentProvider;};/**
	 * Render the raw markdown content of a segment into the rich preview area
	 * using pict-section-content's parseMarkdown() provider method.
	 *
	 * The rendered HTML includes syntax-highlighted code blocks, mermaid diagram
	 * placeholders, KaTeX math placeholders, headings, lists, tables, etc.
	 *
	 * After setting innerHTML, post-render hooks call mermaid.run() and
	 * katex.render() to activate diagrams and equations (if those libraries
	 * are available on window -- loaded by the consumer via CDN).
	 *
	 * @param {number} pSegmentIndex - The internal segment index
	 */pView._updateRichPreviews=function _updateRichPreviews(pSegmentIndex){if(!pView.options.EnableRichPreview){return;}let tmpPreviewEl=document.getElementById("PictMDE-RichPreview-".concat(pSegmentIndex));if(!tmpPreviewEl){return;}let tmpEditor=pView._segmentEditors[pSegmentIndex];if(!tmpEditor){tmpPreviewEl.innerHTML='';tmpPreviewEl.classList.remove('pict-mde-has-rich-preview');return;}let tmpContent=tmpEditor.state.doc.toString();if(!tmpContent||tmpContent.trim().length===0){tmpPreviewEl.innerHTML='';tmpPreviewEl.classList.remove('pict-mde-has-rich-preview');return;}// Use pict-section-content's provider to parse the raw markdown into HTML.
// If a Vocabulary provider is registered on the pict instance,
// pass its resolver so vocabulary terms auto-link in the preview.
let tmpProvider=pView._getContentProvider();let tmpVocabResolver=null;if(pView.pict&&pView.pict.providers&&pView.pict.providers.Vocabulary&&typeof pView.pict.providers.Vocabulary.getResolver==='function'){tmpVocabResolver=pView.pict.providers.Vocabulary.getResolver();}let tmpRenderedHTML=tmpProvider.parseMarkdown(tmpContent,null,null,tmpVocabResolver);if(!tmpRenderedHTML||tmpRenderedHTML.trim().length===0){tmpPreviewEl.innerHTML='';tmpPreviewEl.classList.remove('pict-mde-has-rich-preview');return;}// Wrap the rendered HTML in a pict-content container so that
// pict-section-content's CSS classes take effect
let tmpPreviewID="PictMDE-RichPreviewBody-".concat(pSegmentIndex);tmpPreviewEl.innerHTML="<div class=\"pict-content\" id=\"".concat(tmpPreviewID,"\">").concat(tmpRenderedHTML,"</div>");tmpPreviewEl.classList.add('pict-mde-has-rich-preview');// Wire vocabulary popover hover handlers if the provider is available
if(pView.pict&&pView.pict.providers&&pView.pict.providers.Vocabulary&&typeof pView.pict.providers.Vocabulary.wirePopovers==='function'){pView.pict.providers.Vocabulary.wirePopovers('#'+tmpPreviewID);}// Resolve relative image URLs in the rendered HTML using ImageBaseURL
if(pView.options.ImageBaseURL){let tmpImages=tmpPreviewEl.querySelectorAll('img');for(let i=0;i<tmpImages.length;i++){let tmpSrc=tmpImages[i].getAttribute('src');if(tmpSrc){let tmpResolved=pView._resolveImageURL(tmpSrc);if(tmpResolved!==tmpSrc){tmpImages[i].setAttribute('src',tmpResolved);}}}}// Bump generation counter for stale-render protection (mermaid is async)
let tmpGeneration=(pView._richPreviewGenerations[pSegmentIndex]||0)+1;pView._richPreviewGenerations[pSegmentIndex]=tmpGeneration;// Post-render: call mermaid.run() for mermaid diagram elements
pView._postRenderMermaid(tmpPreviewID,pSegmentIndex,tmpGeneration);// Post-render: call katex.render() for KaTeX math elements
pView._postRenderKaTeX(tmpPreviewID);};/**
	 * Initialize Mermaid with theme variables read from the active
	 * pict-provider-theme palette. Idempotent; safe to call on every
	 * render. Called from _postRenderMermaid before mermaid.run().
	 */pView._initializeMermaidTheme=function _initializeMermaidTheme(){if(typeof mermaid==='undefined'||typeof window==='undefined'){return;}let tmpCs=getComputedStyle(document.documentElement);let tmpVar=(pName,pFallback)=>{let tmpVal=(tmpCs.getPropertyValue(pName)||'').trim();return tmpVal||pFallback;};try{mermaid.initialize({startOnLoad:false,theme:'base',securityLevel:'loose',themeVariables:{primaryColor:tmpVar('--theme-color-background-panel','#FAF8F4'),primaryTextColor:tmpVar('--theme-color-text-primary','#3D3229'),primaryBorderColor:tmpVar('--theme-color-brand-primary','#2E7D74'),secondaryColor:tmpVar('--theme-color-background-secondary','#F0EDE8'),secondaryTextColor:tmpVar('--theme-color-text-secondary','#5E5549'),secondaryBorderColor:tmpVar('--theme-color-border-default','#DDD6CA'),tertiaryColor:tmpVar('--theme-color-background-tertiary','#EDE9E3'),tertiaryTextColor:tmpVar('--theme-color-text-secondary','#5E5549'),tertiaryBorderColor:tmpVar('--theme-color-border-light','#E8E2D7'),background:tmpVar('--theme-color-background-panel','#FAF8F4'),mainBkg:tmpVar('--theme-color-background-panel','#FAF8F4'),secondBkg:tmpVar('--theme-color-background-secondary','#F0EDE8'),lineColor:tmpVar('--theme-color-text-secondary','#5E5549'),textColor:tmpVar('--theme-color-text-primary','#3D3229'),noteBkgColor:tmpVar('--theme-color-background-tertiary','#EDE9E3'),noteTextColor:tmpVar('--theme-color-text-primary','#3D3229'),noteBorderColor:tmpVar('--theme-color-border-default','#DDD6CA'),errorBkgColor:tmpVar('--theme-color-status-error','#D9534F'),errorTextColor:tmpVar('--theme-color-text-on-brand','#FFFFFF'),fontFamily:tmpVar('--theme-typography-family-sans','inherit')}});}catch(pError){pView.log.warn("PICT-MarkdownEditor mermaid theme init failed: ".concat(pError.message||pError));}};/**
	 * Subscribe to pict-provider-theme apply events so diagrams in the
	 * rich preview re-render with the new palette on theme change.
	 * Idempotent. Falls through silently when the theme provider isn't
	 * installed (the static base theme still applies).
	 */pView._subscribeMermaidToThemeChanges=function _subscribeMermaidToThemeChanges(){if(pView._mermaidThemeSubscribed){return;}let tmpProvider=pView.pict&&pView.pict.providers&&pView.pict.providers.Theme;if(!tmpProvider||typeof tmpProvider.onApply!=='function'){return;}tmpProvider.onApply(function(){pView._initializeMermaidTheme();pView._refreshMermaidDiagrams();});pView._mermaidThemeSubscribed=true;};/**
	 * Re-render every rendered Mermaid diagram in the document using its
	 * cached source (stashed as `data-mermaid-source` by _postRenderMermaid
	 * before the first run). Called from the onApply handler after the
	 * theme variables have been re-applied.
	 */pView._refreshMermaidDiagrams=function _refreshMermaidDiagrams(){if(typeof mermaid==='undefined'||typeof document==='undefined'){return;}let tmpRendered=document.querySelectorAll('pre.mermaid[data-mermaid-source]');if(tmpRendered.length<1){return;}for(let i=0;i<tmpRendered.length;i++){let tmpEl=tmpRendered[i];tmpEl.textContent=tmpEl.getAttribute('data-mermaid-source');tmpEl.removeAttribute('data-processed');}try{let tmpResult=mermaid.run({nodes:tmpRendered});if(tmpResult&&typeof tmpResult.catch==='function'){tmpResult.catch(pError=>{pView.log.warn("PICT-MarkdownEditor mermaid re-render failed: ".concat(pError.message||pError));});}}catch(pError){pView.log.warn("PICT-MarkdownEditor mermaid re-render failed: ".concat(pError.message||pError));}};/**
	 * Post-render hook: render Mermaid diagrams in the preview container.
	 * Uses the same approach as pict-section-content's renderMermaidDiagrams().
	 *
	 * @param {string} pContainerID - The container element ID
	 * @param {number} pSegmentIndex - The segment index (for stale-render protection)
	 * @param {number} pGeneration - The generation counter value
	 */pView._postRenderMermaid=function _postRenderMermaid(pContainerID,pSegmentIndex,pGeneration){if(typeof mermaid==='undefined'){return;}let tmpContainer=document.getElementById(pContainerID);if(!tmpContainer){return;}let tmpMermaidElements=tmpContainer.querySelectorAll('pre.mermaid');if(tmpMermaidElements.length<1){return;}// First-time setup: apply theme variables + subscribe to theme
// apply events so diagrams re-render on theme change.
pView._initializeMermaidTheme();pView._subscribeMermaidToThemeChanges();// Cache each diagram's source on the element. mermaid.run()
// replaces textContent with the rendered SVG; the cache lets
// us re-run on theme change without re-parsing markdown.
for(let i=0;i<tmpMermaidElements.length;i++){let tmpEl=tmpMermaidElements[i];if(!tmpEl.hasAttribute('data-mermaid-source')){tmpEl.setAttribute('data-mermaid-source',tmpEl.textContent);}}try{let tmpPromise=mermaid.run({nodes:tmpMermaidElements});if(tmpPromise&&typeof tmpPromise.catch==='function'){tmpPromise.catch(pError=>{// Check stale-render: rendered view uses _renderedViewGeneration,
// per-segment previews use _richPreviewGenerations
let tmpCurrentGen=pSegmentIndex===-1?pView._renderedViewGeneration:pView._richPreviewGenerations[pSegmentIndex];if(tmpCurrentGen!==pGeneration){return;// stale render -- a newer update has replaced us
}pView.log.warn("PICT-MarkdownEditor mermaid render error: ".concat(pError.message||pError));});}}catch(pError){pView.log.warn("PICT-MarkdownEditor mermaid render error: ".concat(pError.message||pError));}};/**
	 * Post-render hook: render KaTeX inline and display math in the preview container.
	 * Uses the same approach as pict-section-content's renderKaTeXEquations().
	 *
	 * @param {string} pContainerID - The container element ID
	 */pView._postRenderKaTeX=function _postRenderKaTeX(pContainerID){if(typeof katex==='undefined'){return;}let tmpContainer=document.getElementById(pContainerID);if(!tmpContainer){return;}// Render inline math: <span class="pict-content-katex-inline">
let tmpInlineElements=tmpContainer.querySelectorAll('.pict-content-katex-inline');for(let i=0;i<tmpInlineElements.length;i++){try{katex.render(tmpInlineElements[i].textContent,tmpInlineElements[i],{throwOnError:false,displayMode:false});}catch(pError){pView.log.warn("PICT-MarkdownEditor KaTeX inline error: ".concat(pError.message||pError));}}// Render display math: <div class="pict-content-katex-display">
let tmpDisplayElements=tmpContainer.querySelectorAll('.pict-content-katex-display');for(let i=0;i<tmpDisplayElements.length;i++){try{katex.render(tmpDisplayElements[i].textContent,tmpDisplayElements[i],{throwOnError:false,displayMode:true});}catch(pError){pView.log.warn("PICT-MarkdownEditor KaTeX display error: ".concat(pError.message||pError));}}};/**
	 * Simple HTML escape for error messages in the rich preview.
	 *
	 * @param {string} pText - The text to escape
	 * @returns {string}
	 */pView._escapeHTMLForPreview=function _escapeHTMLForPreview(pText){return pText.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');};// -- Rendered View (full document preview) --
/**
	 * Toggle between the editing view (CodeMirror segments) and a fully rendered
	 * view of the combined markdown output using pict-section-content.
	 *
	 * @param {boolean} [pRendered] - If provided, set to this value; otherwise toggle
	 */pView.toggleRenderedView=function toggleRenderedView(pRendered){if(typeof pRendered==='boolean'){pView._renderedViewActive=pRendered;}else{pView._renderedViewActive=!pView._renderedViewActive;}if(pView._renderedViewActive){pView._renderRenderedView();}else{pView._restoreEditingView();}};/**
	 * Switch to the rendered view: marshal all editors, combine all segment
	 * content, render to HTML via pict-section-content, and replace the
	 * container contents with the rendered output.
	 */pView._renderRenderedView=function _renderRenderedView(){let tmpContainer=pView._getContainerElement();if(!tmpContainer){return;}// Marshal current editor content back to data before switching
pView._marshalAllEditorsToData();// Combine all segments into a single markdown document
let tmpSegments=pView._getSegmentsFromData();let tmpCombinedContent='';if(tmpSegments&&tmpSegments.length>0){let tmpParts=[];for(let i=0;i<tmpSegments.length;i++){tmpParts.push(tmpSegments[i].Content||'');}tmpCombinedContent=tmpParts.join('\n\n');}// Destroy existing CodeMirror editors
for(let tmpIdx in pView._segmentEditors){if(pView._segmentEditors[tmpIdx]){pView._segmentEditors[tmpIdx].destroy();}}pView._segmentEditors={};// Render the combined markdown via pict-section-content
let tmpProvider=pView._getContentProvider();let tmpRenderedHTML=tmpProvider.parseMarkdown(tmpCombinedContent);// Build the rendered view container
let tmpRenderedViewID='PictMDE-RenderedView';tmpContainer.innerHTML="<div class=\"pict-mde-rendered-view\" id=\"".concat(tmpRenderedViewID,"\"><div class=\"pict-content\">").concat(tmpRenderedHTML||'',"</div></div>");tmpContainer.classList.add('pict-mde-rendered-mode');// Resolve relative image URLs in the rendered HTML using ImageBaseURL
if(pView.options.ImageBaseURL){let tmpImages=tmpContainer.querySelectorAll('.pict-mde-rendered-view img');for(let i=0;i<tmpImages.length;i++){let tmpSrc=tmpImages[i].getAttribute('src');if(tmpSrc){let tmpResolved=pView._resolveImageURL(tmpSrc);if(tmpResolved!==tmpSrc){tmpImages[i].setAttribute('src',tmpResolved);}}}}// Bump generation for stale-render protection
pView._renderedViewGeneration++;let tmpGeneration=pView._renderedViewGeneration;// Post-render hooks for mermaid diagrams and KaTeX equations
let tmpContentContainer=tmpContainer.querySelector("#".concat(tmpRenderedViewID," .pict-content"));if(tmpContentContainer){let tmpContentID='PictMDE-RenderedViewContent';tmpContentContainer.id=tmpContentID;pView._postRenderMermaid(tmpContentID,-1,tmpGeneration);pView._postRenderKaTeX(tmpContentID);}};/**
	 * Switch back from rendered view to the editing view: rebuild the
	 * full editor UI from the data.
	 */pView._restoreEditingView=function _restoreEditingView(){let tmpContainer=pView._getContainerElement();if(!tmpContainer){return;}tmpContainer.classList.remove('pict-mde-rendered-mode');pView._buildEditorUI();};};},{"pict-section-content":38}],48:[function(require,module,exports){module.exports={"DefaultRenderable":"MarkdownEditor-Wrap","DefaultDestinationAddress":"#MarkdownEditor-Container-Div","Templates":[{"Hash":"MarkdownEditor-Container","Template":/*html*/"<div class=\"pict-mde\" id=\"PictMDE-Container\"></div>"},{"Hash":"MarkdownEditor-Segment","Template":/*html*/"<div class=\"pict-mde-segment\" id=\"PictMDE-Segment-{~D:Record.SegmentIndex~}\" data-segment-index=\"{~D:Record.SegmentIndex~}\">\n\t<div class=\"pict-mde-left-controls\">\n\t\t<div class=\"pict-mde-quadrant-tl\"></div>\n\t\t<div class=\"pict-mde-quadrant-bl\"></div>\n\t</div>\n\t<div class=\"pict-mde-drag-handle\" draggable=\"true\" title=\"Drag to reorder\"></div>\n\t<div class=\"pict-mde-segment-body\">\n\t\t<div class=\"pict-mde-tab-bar\" id=\"PictMDE-TabBar-{~D:Record.SegmentIndex~}\">\n\t\t\t<button type=\"button\" class=\"pict-mde-tab pict-mde-tab-active\" data-tab=\"editor\" onclick=\"{~D:Record.ViewIdentifier~}.switchSegmentTab({~D:Record.SegmentIndex~}, 'editor')\">Edit</button>\n\t\t\t<button type=\"button\" class=\"pict-mde-tab\" data-tab=\"preview\" onclick=\"{~D:Record.ViewIdentifier~}.switchSegmentTab({~D:Record.SegmentIndex~}, 'preview')\">Preview</button>\n\t\t</div>\n\t\t<div class=\"pict-mde-segment-editor\" id=\"PictMDE-SegmentEditor-{~D:Record.SegmentIndex~}\"></div>\n\t\t<div class=\"pict-mde-preview-pane\" id=\"PictMDE-PreviewPane-{~D:Record.SegmentIndex~}\">\n\t\t\t<div class=\"pict-mde-image-preview\" id=\"PictMDE-ImagePreview-{~D:Record.SegmentIndex~}\"></div>\n\t\t\t<div class=\"pict-mde-rich-preview\" id=\"PictMDE-RichPreview-{~D:Record.SegmentIndex~}\"></div>\n\t\t</div>\n\t</div>\n\t<div class=\"pict-mde-sidebar\" id=\"PictMDE-Sidebar-{~D:Record.SegmentIndex~}\">\n\t\t<div class=\"pict-mde-quadrant-tr\"></div>\n\t\t<div class=\"pict-mde-quadrant-br\"></div>\n\t\t<input type=\"file\" accept=\"image/*\" class=\"pict-mde-image-input\" id=\"PictMDE-ImageInput-{~D:Record.SegmentIndex~}\" style=\"display:none\" />\n\t</div>\n</div>"},{"Hash":"MarkdownEditor-AddSegment","Template":/*html*/"<div class=\"pict-mde-add-segment\">\n\t<button type=\"button\" class=\"pict-mde-btn-add\" onclick=\"{~D:Record.ViewIdentifier~}.addSegment()\">+ Add Segment</button>\n</div>"}],"Renderables":[{"RenderableHash":"MarkdownEditor-Wrap","TemplateHash":"MarkdownEditor-Container","DestinationAddress":"#MarkdownEditor-Container-Div"}],"TargetElementAddress":"#MarkdownEditor-Container-Div",// Address in AppData to read/write the segments array
// The data at this address should be an array of objects, each with a "Content" property
// e.g. AppData.Document.Segments = [ { Content: "# Hello" }, { Content: "Some text" } ]
"ContentDataAddress":false,// Whether the editor should be read-only
"ReadOnly":false,// Whether to show rich content previews (rendered markdown with syntax-highlighted
// code, mermaid diagrams, KaTeX equations, tables, etc. via pict-section-content).
// Requires the consumer to load the mermaid and/or katex libraries via CDN
// for diagram/equation rendering; code highlighting works without CDN scripts.
"EnableRichPreview":true,// Default preview layout mode: "off", "bottom", "side", "tabbed"
//   off       — no preview (default)
//   bottom    — preview below the editor
//   side      — editor and preview side-by-side
//   tabbed    — per-segment tabs switching between editor and preview
"DefaultPreviewMode":"off",// Base URL prepended to relative image URLs in image and rich previews.
// Set this to the directory-level path (e.g. "/content/") so that images
// referenced by filename in the markdown resolve correctly.
// Absolute URLs (starting with /, http://, https://, data:) are left as-is.
"ImageBaseURL":"",// ---- Quadrant button definitions ----
// Each quadrant is an array of button objects:
//   HTML   — innerHTML for the button
//   Action — method name, optionally "method:arg" (receives segment index as first param)
//   Class  — additional CSS class(es) appended to the base class
//   Title  — tooltip text
//
// Consumers can override any quadrant to add, remove, or reorder buttons.
// Left quadrant buttons (TL, BL) get the "pict-mde-left-btn" base class.
// Right quadrant buttons (TR, BR) get the "pict-mde-sidebar-btn" base class.
// Quadrant button HTML is parsed through Pict's template engine before
// being assigned as innerHTML, so `{~I:Name~}` template tags resolve
// to themable SVG icons from pict.providers.Icon.  Typographic
// formatting buttons (Bold / Italic / Inline-code / Heading / Link)
// stay as stylized letters — that's the markdown-editor convention.
"ButtonsTL":[{"HTML":"{~I:Close~}","Action":"removeSegment","Class":"pict-mde-btn-remove","Title":"Remove Segment"}],"ButtonsBL":[{"HTML":"{~I:ArrowUp~}","Action":"moveSegmentUp","Class":"pict-mde-btn-move","Title":"Move Up"},{"HTML":"{~I:ArrowDown~}","Action":"moveSegmentDown","Class":"pict-mde-btn-move","Title":"Move Down"},{"HTML":"{~I:Settings~}","Action":"toggleControls","Class":"pict-mde-btn-linenums","Title":"Toggle Controls"},{"HTML":"{~I:Eye~}","Action":"cyclePreviewMode","Class":"pict-mde-btn-preview","Title":"Cycle Preview Mode"}],"ButtonsTR":[{"HTML":"<b>B</b>","Action":"applyFormatting:bold","Class":"","Title":"Bold (Ctrl+B)"},{"HTML":"<i>I</i>","Action":"applyFormatting:italic","Class":"","Title":"Italic (Ctrl+I)"},{"HTML":"<code>&lt;&gt;</code>","Action":"applyFormatting:code","Class":"","Title":"Inline Code (Ctrl+E)"},{"HTML":"#","Action":"applyFormatting:heading","Class":"","Title":"Heading"},{"HTML":"[&thinsp;]","Action":"applyFormatting:link","Class":"","Title":"Link"},{"HTML":"{~I:Image~}","Action":"openImagePicker","Class":"pict-mde-sidebar-btn-image","Title":"Insert Image"}],"ButtonsBR":[],// CSS for the markdown editor
"CSS":/*css*/"\n/* ---- Container ---- */\n.pict-mde\n{\n\tfont-family: var(--theme-typography-family-body, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif);\n\tfont-size: 14px;\n}\n\n/* ---- Segment row: left-controls | drag-handle | editor body | sidebar ---- */\n.pict-mde-segment\n{\n\tposition: relative;\n\tdisplay: flex;\n\tflex-direction: row;\n\talign-items: stretch;\n\tmargin-bottom: 6px;\n\tmin-height: 48px;\n\ttransition: background-color 0.15s ease;\n}\n\n/* ---- Left controls column ---- */\n.pict-mde-left-controls\n{\n\tflex: 0 0 22px;\n\tdisplay: flex;\n\tflex-direction: column;\n\talign-items: center;\n\tjustify-content: space-between;\n\tpadding: 2px 0;\n}\n\n/* ---- Left-side quadrants ---- */\n.pict-mde-quadrant-tl\n{\n\tdisplay: flex;\n\tflex-direction: column;\n\talign-items: center;\n\tposition: sticky;\n\ttop: 2px;\n\tz-index: 2;\n}\n.pict-mde-quadrant-bl\n{\n\tdisplay: flex;\n\tflex-direction: column;\n\talign-items: center;\n\tgap: 1px;\n\tposition: sticky;\n\tbottom: 2px;\n\tz-index: 2;\n}\n\n/* ---- Left-side buttons (shared base) ---- */\n.pict-mde-left-btn\n{\n\tdisplay: flex;\n\talign-items: center;\n\tjustify-content: center;\n\twidth: 20px;\n\theight: 20px;\n\tborder: none;\n\tbackground: transparent;\n\tcursor: pointer;\n\tfont-size: 12px;\n\tpadding: 0;\n\tcolor: var(--theme-color-text-muted, #888);\n\tline-height: 1;\n\tfont-family: inherit;\n\topacity: 0;\n\ttransition: opacity 0.15s ease;\n}\n.pict-mde-segment:hover .pict-mde-left-btn,\n.pict-mde-segment.pict-mde-active .pict-mde-left-btn\n{\n\topacity: 1;\n}\n.pict-mde-left-btn:hover\n{\n\tcolor: var(--theme-color-text-primary, #222);\n}\n.pict-mde-btn-remove:hover\n{\n\tcolor: var(--theme-color-status-error, #CC3333);\n}\n.pict-mde-btn-linenums\n{\n\tfont-size: 11px;\n\tfont-weight: 600;\n\tfont-family: var(--theme-typography-family-mono, 'SFMono-Regular', 'SF Mono', 'Menlo', monospace);\n}\n/* Highlight when controls are active */\n.pict-mde.pict-mde-controls-on .pict-mde-btn-linenums\n{\n\tcolor: var(--theme-color-brand-primary, #4A90D9);\n}\n.pict-mde-btn-preview\n{\n\tfont-size: 11px;\n}\n/* Preview button: highlight when any preview mode is active */\n.pict-mde.pict-mde-preview-bottom .pict-mde-btn-preview,\n.pict-mde.pict-mde-preview-side .pict-mde-btn-preview,\n.pict-mde.pict-mde-preview-tabbed .pict-mde-btn-preview\n{\n\tcolor: var(--theme-color-brand-primary, #4A90D9);\n}\n/* Dim preview button when mode is off */\n.pict-mde.pict-mde-preview-off .pict-mde-btn-preview\n{\n\tcolor: var(--theme-color-border-default, #CCC);\n}\n\n/* ---- Drag handle (simple grey bar) ---- */\n.pict-mde-drag-handle\n{\n\tflex: 0 0 8px;\n\tcursor: grab;\n\tbackground: var(--theme-color-background-tertiary, #EDEDED);\n\ttransition: background-color 0.15s ease;\n\tuser-select: none;\n}\n.pict-mde-drag-handle:active\n{\n\tcursor: grabbing;\n}\n.pict-mde-drag-handle:hover\n{\n\tbackground: var(--theme-color-border-default, #C8C8C8);\n}\n\n/* ---- Editor body (middle column) ---- */\n.pict-mde-segment-body\n{\n\tflex: 1 1 0%;\n\tmin-width: 0;\n\toverflow: hidden;\n\tbackground: var(--theme-color-background-panel, #FFFFFF);\n\ttransition: background-color 0.15s ease;\n}\n.pict-mde-segment-editor\n{\n\tmin-height: 48px;\n}\n\n/* ---- Image preview area below the editor ---- */\n.pict-mde-image-preview\n{\n\tdisplay: none;\n}\n.pict-mde-image-preview.pict-mde-has-images\n{\n\tdisplay: flex;\n\tflex-wrap: wrap;\n\tgap: 8px;\n\tpadding: 8px 12px;\n\tborder-top: 1px solid var(--theme-color-border-light, #EDEDED);\n}\n.pict-mde-image-preview img\n{\n\tmax-width: 200px;\n\tmax-height: 150px;\n\tborder-radius: 3px;\n\tborder: 1px solid var(--theme-color-border-default, #E0E0E0);\n\tobject-fit: contain;\n\tbackground: var(--theme-color-background-secondary, #F8F8F8);\n}\n.pict-mde-image-preview-item\n{\n\tposition: relative;\n\tdisplay: inline-block;\n}\n.pict-mde-image-preview-label\n{\n\tdisplay: block;\n\tfont-size: 10px;\n\tcolor: var(--theme-color-text-muted, #999);\n\tmargin-top: 2px;\n\tmax-width: 200px;\n\toverflow: hidden;\n\ttext-overflow: ellipsis;\n\twhite-space: nowrap;\n}\n\n/* ---- Rich content preview area (rendered via pict-section-content) ---- */\n.pict-mde-rich-preview\n{\n\tdisplay: none;\n}\n.pict-mde-rich-preview.pict-mde-has-rich-preview\n{\n\tdisplay: block;\n\tborder-top: 1px solid var(--theme-color-border-light, #EDEDED);\n\tbackground: var(--theme-color-background-panel, #FCFCFC);\n\toverflow: hidden;\n}\n/* Constrain images in the rich preview even if pict-section-content CSS loads late */\n.pict-mde-rich-preview img\n{\n\tmax-width: 100%;\n\theight: auto;\n}\n/* ---- Preview layout modes ---- */\n\n/* Tab bar: hidden by default, shown only in tabbed mode */\n.pict-mde-tab-bar\n{\n\tdisplay: none;\n}\n.pict-mde.pict-mde-preview-tabbed .pict-mde-tab-bar\n{\n\tdisplay: flex;\n\tgap: 0;\n\tborder-bottom: 1px solid var(--theme-color-border-light, #EDEDED);\n\tbackground: var(--theme-color-background-secondary, #F8F8F8);\n}\n.pict-mde-tab\n{\n\tpadding: 4px 12px;\n\tborder: none;\n\tbackground: transparent;\n\tcursor: pointer;\n\tfont-size: 12px;\n\tcolor: var(--theme-color-text-muted, #888);\n\tborder-bottom: 2px solid transparent;\n\tfont-family: inherit;\n}\n.pict-mde-tab:hover\n{\n\tcolor: var(--theme-color-text-primary, #222);\n}\n.pict-mde-tab.pict-mde-tab-active\n{\n\tcolor: var(--theme-color-brand-primary, #4A90D9);\n\tborder-bottom-color: var(--theme-color-brand-primary, #4A90D9);\n}\n\n/* Off mode: hide all preview panes and tab bars */\n.pict-mde.pict-mde-preview-off .pict-mde-preview-pane\n{\n\tdisplay: none;\n}\n.pict-mde.pict-mde-preview-off .pict-mde-tab-bar\n{\n\tdisplay: none;\n}\n/* Legacy class alias for backward compatibility */\n.pict-mde.pict-mde-previews-hidden .pict-mde-preview-pane\n{\n\tdisplay: none;\n}\n\n/* Bottom mode: vertical stacking (default flex-column behavior) */\n.pict-mde.pict-mde-preview-bottom .pict-mde-segment-body\n{\n\tdisplay: flex;\n\tflex-direction: column;\n}\n\n/* Side-by-side mode: editor and preview side by side */\n.pict-mde.pict-mde-preview-side .pict-mde-segment-body\n{\n\tdisplay: flex;\n\tflex-direction: row;\n}\n.pict-mde.pict-mde-preview-side .pict-mde-segment-editor\n{\n\tflex: 1 1 50%;\n\tmin-width: 0;\n\toverflow: hidden;\n}\n.pict-mde.pict-mde-preview-side .pict-mde-preview-pane\n{\n\tflex: 1 1 50%;\n\tmin-width: 0;\n\toverflow: auto;\n\tborder-left: 1px solid var(--theme-color-border-light, #EDEDED);\n}\n/* Side-by-side: remove top borders since preview is beside, not below */\n.pict-mde.pict-mde-preview-side .pict-mde-rich-preview.pict-mde-has-rich-preview\n{\n\tborder-top: none;\n}\n.pict-mde.pict-mde-preview-side .pict-mde-image-preview.pict-mde-has-images\n{\n\tborder-top: none;\n}\n\n/* Tabbed mode: default hides preview, shows editor */\n.pict-mde.pict-mde-preview-tabbed .pict-mde-segment-body\n{\n\tdisplay: flex;\n\tflex-direction: column;\n}\n.pict-mde.pict-mde-preview-tabbed .pict-mde-preview-pane\n{\n\tdisplay: none;\n}\n/* Tabbed mode: when showing preview, hide editor and show preview */\n.pict-mde.pict-mde-preview-tabbed .pict-mde-segment.pict-mde-tab-showing-preview .pict-mde-segment-editor\n{\n\tdisplay: none;\n}\n.pict-mde.pict-mde-preview-tabbed .pict-mde-segment.pict-mde-tab-showing-preview .pict-mde-preview-pane\n{\n\tdisplay: block;\n}\n\n/* Per-segment preview hide: only applies in bottom and side modes */\n.pict-mde.pict-mde-preview-bottom .pict-mde-segment.pict-mde-preview-hidden .pict-mde-preview-pane,\n.pict-mde.pict-mde-preview-side .pict-mde-segment.pict-mde-preview-hidden .pict-mde-preview-pane\n{\n\tdisplay: none;\n}\n/* Constrain the pict-content inside the preview to fit the segment */\n.pict-mde-rich-preview .pict-content\n{\n\tpadding: 12px;\n\tmax-width: none;\n\tmargin: 0;\n\tfont-size: 13px;\n}\n/* Reduce heading sizes in the preview to be proportional */\n.pict-mde-rich-preview .pict-content h1\n{\n\tfont-size: 1.4em;\n\tmargin-top: 0;\n}\n.pict-mde-rich-preview .pict-content h2\n{\n\tfont-size: 1.2em;\n\tmargin-top: 0.75em;\n}\n.pict-mde-rich-preview .pict-content h3\n{\n\tfont-size: 1.1em;\n\tmargin-top: 0.6em;\n}\n\n/* ---- Rendered view (full document preview mode) ---- */\n.pict-mde-rendered-view\n{\n\tpadding: 16px 20px;\n\tbackground: var(--theme-color-background-panel, #FFFFFF);\n\tmin-height: 120px;\n}\n.pict-mde-rendered-view .pict-content\n{\n\tmax-width: none;\n\tmargin: 0;\n}\n/* Hide the add-segment button in rendered mode */\n.pict-mde.pict-mde-rendered-mode .pict-mde-add-segment\n{\n\tdisplay: none;\n}\n\n/* Focused / active editor gets subtle warm background */\n.pict-mde-segment.pict-mde-active .pict-mde-segment-body\n{\n\tbackground: var(--theme-color-background-secondary, #FAFAF5);\n}\n.pict-mde-segment.pict-mde-active .pict-mde-drag-handle\n{\n\tbackground: var(--theme-color-border-strong, #9CB4C8);\n}\n\n/* ---- Right sidebar column ---- */\n.pict-mde-sidebar\n{\n\tflex: 0 0 30px;\n\tdisplay: flex;\n\tflex-direction: column;\n\talign-items: flex-start;\n\tjustify-content: space-between;\n\tposition: relative;\n}\n\n/* ---- Right-side quadrants ---- */\n.pict-mde-quadrant-tr\n{\n\tdisplay: flex;\n\tflex-direction: column;\n\talign-items: center;\n\tgap: 1px;\n\tpadding: 4px 0;\n\twidth: 100%;\n\topacity: 0;\n\ttransition: opacity 0.15s ease, top 0.1s ease;\n\tposition: sticky;\n\ttop: 0;\n}\n.pict-mde-quadrant-br\n{\n\tdisplay: flex;\n\tflex-direction: column;\n\talign-items: center;\n\tgap: 1px;\n\tpadding: 4px 0;\n\twidth: 100%;\n\topacity: 0;\n\ttransition: opacity 0.15s ease;\n\tposition: sticky;\n\tbottom: 0;\n}\n\n/* Active segment always shows its right-side quadrants */\n.pict-mde-segment.pict-mde-active .pict-mde-quadrant-tr,\n.pict-mde-segment.pict-mde-active .pict-mde-quadrant-br\n{\n\topacity: 1;\n}\n/* When no segment is active, hovering shows both left + right controls */\n.pict-mde:not(:has(.pict-mde-active)) .pict-mde-segment:hover .pict-mde-quadrant-tr,\n.pict-mde:not(:has(.pict-mde-active)) .pict-mde-segment:hover .pict-mde-quadrant-br\n{\n\topacity: 1;\n}\n\n/* ---- Controls-hidden mode: right quadrants show faintly on hover ---- */\n.pict-mde.pict-mde-controls-hidden .pict-mde-quadrant-tr,\n.pict-mde.pict-mde-controls-hidden .pict-mde-quadrant-br\n{\n\topacity: 0;\n}\n.pict-mde.pict-mde-controls-hidden .pict-mde-segment:hover .pict-mde-quadrant-tr,\n.pict-mde.pict-mde-controls-hidden .pict-mde-segment:hover .pict-mde-quadrant-br\n{\n\topacity: 0.3;\n}\n.pict-mde.pict-mde-controls-hidden .pict-mde-segment.pict-mde-active .pict-mde-quadrant-tr,\n.pict-mde.pict-mde-controls-hidden .pict-mde-segment.pict-mde-active .pict-mde-quadrant-br\n{\n\topacity: 0.3;\n}\n\n/* When JS sets a cursor-relative offset, switch TR from sticky to absolute positioning */\n.pict-mde-quadrant-tr.pict-mde-sidebar-at-cursor\n{\n\tposition: absolute;\n\ttop: var(--pict-mde-sidebar-top, 0px);\n}\n\n/* ---- Right-side buttons (shared base) ---- */\n.pict-mde-sidebar-btn\n{\n\tdisplay: flex;\n\talign-items: center;\n\tjustify-content: center;\n\twidth: 24px;\n\theight: 22px;\n\tborder: none;\n\tbackground: transparent;\n\tcursor: pointer;\n\tfont-size: 12px;\n\tpadding: 0;\n\tborder-radius: 3px;\n\tcolor: var(--theme-color-text-secondary, #666);\n\tline-height: 1;\n\tfont-family: inherit;\n}\n.pict-mde-sidebar-btn:hover\n{\n\tcolor: var(--theme-color-text-primary, #222);\n}\n.pict-mde-sidebar-btn b\n{\n\tfont-size: 13px;\n\tfont-weight: 700;\n}\n.pict-mde-sidebar-btn i\n{\n\tfont-size: 13px;\n\tfont-style: italic;\n}\n.pict-mde-sidebar-btn code\n{\n\tfont-size: 10px;\n\tfont-family: var(--theme-typography-family-mono, 'SFMono-Regular', 'SF Mono', 'Menlo', monospace);\n}\n\n/* ---- Add segment button ---- */\n.pict-mde-add-segment\n{\n\tmargin-top: 6px;\n\tpadding-left: 30px;\n}\n.pict-mde-btn-add\n{\n\tdisplay: block;\n\twidth: 100%;\n\tpadding: 7px;\n\tborder: 2px dashed var(--theme-color-border-default, #D0D0D0);\n\tborder-radius: 4px;\n\tbackground: transparent;\n\tcolor: var(--theme-color-text-muted, #999);\n\tfont-size: 12px;\n\tfont-weight: 600;\n\tcursor: pointer;\n\ttransition: all 0.15s ease;\n}\n.pict-mde-btn-add:hover\n{\n\tborder-color: var(--theme-color-brand-primary, #4A90D9);\n\tcolor: var(--theme-color-brand-primary, #4A90D9);\n\tbackground: rgba(74, 144, 217, 0.04);\n}\n\n/* ---- Image drag-over indicator ---- */\n.pict-mde-segment-editor.pict-mde-image-dragover\n{\n\toutline: 2px dashed var(--theme-color-brand-primary, #4A90D9);\n\toutline-offset: -2px;\n}\n\n/* ---- Drag-in-progress: prevent CodeMirror from intercepting drop events ---- */\n.pict-mde.pict-mde-dragging .pict-mde-segment-editor\n{\n\tpointer-events: none;\n}\n\n/* ---- Drop target indicators for drag reorder ---- */\n.pict-mde-segment.pict-mde-drag-over-top\n{\n\tbox-shadow: 0 -2px 0 0 var(--theme-color-brand-primary, #4A90D9);\n}\n.pict-mde-segment.pict-mde-drag-over-bottom\n{\n\tbox-shadow: 0 2px 0 0 var(--theme-color-brand-primary, #4A90D9);\n}\n\n/* ---- CodeMirror overrides inside segments ---- */\n.pict-mde-segment-editor .cm-editor\n{\n\tborder: none;\n}\n.pict-mde-segment-editor .cm-editor .cm-scroller\n{\n\tfont-family: var(--theme-typography-family-mono, 'SFMono-Regular', 'SF Mono', 'Menlo', 'Consolas', 'Liberation Mono', 'Courier New', monospace);\n\tfont-size: 14px;\n\tline-height: 1.6;\n}\n.pict-mde-segment-editor .cm-editor.cm-focused\n{\n\toutline: none;\n}\n.pict-mde-segment-editor .cm-editor .cm-content\n{\n\tpadding: 8px 12px;\n\tmin-height: 36px;\n}\n.pict-mde-segment-editor .cm-editor .cm-gutters\n{\n\tbackground: var(--theme-color-background-secondary, #F8F8F8);\n\tborder-right: 1px solid var(--theme-color-border-light, #E8E8E8);\n\tcolor: var(--theme-color-text-muted, #BBB);\n}\n\n/* ---- Collapsed data URI widget ---- */\n.pict-mde-data-uri-collapsed\n{\n\tdisplay: inline;\n\tbackground: var(--theme-color-background-tertiary, #F0F0F0);\n\tcolor: var(--theme-color-text-muted, #888);\n\tfont-size: 11px;\n\tpadding: 1px 4px;\n\tborder-radius: 3px;\n\tborder: 1px solid var(--theme-color-border-default, #E0E0E0);\n\tfont-family: var(--theme-typography-family-mono, 'SFMono-Regular', 'SF Mono', 'Menlo', monospace);\n\tcursor: default;\n\twhite-space: nowrap;\n}\n\n/* ---- Line number / controls toggle: gutters hidden by default ---- */\n.pict-mde .cm-editor .cm-gutters\n{\n\tdisplay: none;\n}\n.pict-mde.pict-mde-controls-on .cm-editor .cm-gutters\n{\n\tdisplay: flex;\n}\n\n/* ============================================\n   RESPONSIVE: Tablet / Phone (max-width: 768px)\n   ============================================ */\n@media (max-width: 768px)\n{\n\t/* Prevent any horizontal overflow in the editor */\n\t.pict-mde\n\t{\n\t\toverflow-x: hidden;\n\t\tmax-width: 100%;\n\t}\n\n\t/* Reduce the left controls column width */\n\t.pict-mde-left-controls\n\t{\n\t\tflex: 0 0 16px;\n\t}\n\t.pict-mde-left-btn\n\t{\n\t\twidth: 16px;\n\t\theight: 18px;\n\t\tfont-size: 10px;\n\t}\n\n\t/* Make left-side buttons always visible on touch (no hover) */\n\t.pict-mde-left-btn\n\t{\n\t\topacity: 0.6;\n\t}\n\n\t/* Narrow the drag handle */\n\t.pict-mde-drag-handle\n\t{\n\t\tflex: 0 0 5px;\n\t}\n\n\t/* Shrink the right sidebar column */\n\t.pict-mde-sidebar\n\t{\n\t\tflex: 0 0 24px;\n\t}\n\t.pict-mde-sidebar-btn\n\t{\n\t\twidth: 20px;\n\t\theight: 20px;\n\t\tfont-size: 11px;\n\t}\n\n\t/* Make right sidebar buttons always visible (touch devices) */\n\t.pict-mde-quadrant-tr,\n\t.pict-mde-quadrant-br\n\t{\n\t\topacity: 0.7;\n\t}\n\t.pict-mde-segment.pict-mde-active .pict-mde-quadrant-tr,\n\t.pict-mde-segment.pict-mde-active .pict-mde-quadrant-br\n\t{\n\t\topacity: 1;\n\t}\n\n\t/* Reduce CodeMirror content padding */\n\t.pict-mde-segment-editor .cm-editor .cm-content\n\t{\n\t\tpadding: 6px 6px;\n\t}\n\n\t/* Reduce font size slightly for more content on screen */\n\t.pict-mde-segment-editor .cm-editor .cm-scroller\n\t{\n\t\tfont-size: 13px;\n\t}\n\n\t/* Add segment button: reduce left margin */\n\t.pict-mde-add-segment\n\t{\n\t\tpadding-left: 21px;\n\t}\n\n\t/* Side-by-side: fall back to vertical stacking on narrow screens */\n\t.pict-mde.pict-mde-preview-side .pict-mde-segment-body\n\t{\n\t\tflex-direction: column;\n\t}\n\t.pict-mde.pict-mde-preview-side .pict-mde-preview-pane\n\t{\n\t\tborder-left: none;\n\t\tborder-top: 1px solid var(--theme-color-border-light, #EDEDED);\n\t}\n\n\t/* Tab bar: smaller on tablet */\n\t.pict-mde-tab\n\t{\n\t\tpadding: 3px 8px;\n\t\tfont-size: 11px;\n\t}\n\n\t/* Rich preview: less padding */\n\t.pict-mde-rich-preview .pict-content\n\t{\n\t\tpadding: 8px;\n\t\tfont-size: 12px;\n\t}\n\n\t/* Image previews: smaller max dimensions */\n\t.pict-mde-image-preview img\n\t{\n\t\tmax-width: 120px;\n\t\tmax-height: 100px;\n\t}\n\n\t/* Rendered view: less padding */\n\t.pict-mde-rendered-view\n\t{\n\t\tpadding: 10px 8px;\n\t}\n}\n\n/* ============================================\n   RESPONSIVE: Small phone (max-width: 480px)\n   ============================================ */\n@media (max-width: 480px)\n{\n\t/* Wrap segment so left controls flow to the top as a horizontal bar */\n\t.pict-mde-segment\n\t{\n\t\tflex-wrap: wrap;\n\t}\n\n\t/* Left controls become a horizontal toolbar at the top of the segment */\n\t.pict-mde-left-controls\n\t{\n\t\tflex: 0 0 100%;\n\t\tflex-direction: row;\n\t\tjustify-content: flex-start;\n\t\tgap: 2px;\n\t\tpadding: 3px 4px;\n\t\torder: -1;\n\t\tbackground: var(--theme-color-background-secondary, #F5F5F5);\n\t\tborder-bottom: 1px solid var(--theme-color-border-light, #EDEDED);\n\t}\n\t.pict-mde-left-btn\n\t{\n\t\twidth: 24px;\n\t\theight: 24px;\n\t\tfont-size: 12px;\n\t\topacity: 0.7;\n\t}\n\n\t/* Left quadrants flow horizontally */\n\t.pict-mde-quadrant-tl,\n\t.pict-mde-quadrant-bl\n\t{\n\t\tflex-direction: row;\n\t\tgap: 2px;\n\t\tposition: static;\n\t}\n\n\t/* Segment body: explicit basis so it fills the wrapped row */\n\t.pict-mde-segment-body\n\t{\n\t\tflex: 1 1 calc(100% - 20px);\n\t}\n\n\t/* Hide drag handle on very small screens */\n\t.pict-mde-drag-handle\n\t{\n\t\tdisplay: none;\n\t}\n\n\t/* Right sidebar: further shrink */\n\t.pict-mde-sidebar\n\t{\n\t\tflex: 0 0 20px;\n\t}\n\t.pict-mde-sidebar-btn\n\t{\n\t\twidth: 18px;\n\t\theight: 18px;\n\t\tfont-size: 10px;\n\t}\n\n\t/* Add segment: no left offset since controls are at top */\n\t.pict-mde-add-segment\n\t{\n\t\tpadding-left: 0;\n\t}\n\n\t/* Even tighter CodeMirror padding */\n\t.pict-mde-segment-editor .cm-editor .cm-content\n\t{\n\t\tpadding: 4px 4px;\n\t}\n}\n"};},{}],49:[function(require,module,exports){const libPictViewClass=require('pict-view');const libPictSectionContent=require('pict-section-content');const _DefaultConfiguration=require('./Pict-Section-MarkdownEditor-DefaultConfiguration.js');// Helper modules
const libFormatting=require('./Pict-MDE-Formatting.js');const libImageHandling=require('./Pict-MDE-ImageHandling.js');const libDragAndReorder=require('./Pict-MDE-DragAndReorder.js');const libRichPreview=require('./Pict-MDE-RichPreview.js');const libCodeMirror=require('./Pict-MDE-CodeMirror.js');class PictSectionMarkdownEditor extends libPictViewClass{constructor(pFable,pOptions,pServiceHash){let tmpOptions=Object.assign({},_DefaultConfiguration,pOptions);super(pFable,tmpOptions,pServiceHash);this.initialRenderComplete=false;// CodeMirror prototype references (injected by consumer or found on window)
this._codeMirrorModules=null;// Map of segment index to CodeMirror EditorView instance
this._segmentEditors={};// Internal segment counter (monotonically increasing for unique IDs)
this._segmentCounter=0;// The view identifier used for onclick handlers in templates
this._viewCallIdentifier=false;// Currently active (focused) segment index, or -1
this._activeSegmentIndex=-1;// Drag state for reorder
this._dragSourceIndex=-1;// Whether controls (line numbers + right sidebar) are currently visible
this._controlsVisible=true;// Current preview layout mode: "off", "bottom", "side", "tabbed"
this._previewMode=this.options.DefaultPreviewMode||'off';// Last non-off preview layout, for togglePreview() backward compatibility
this._lastPreviewLayout='bottom';// Per-segment tab state in tabbed mode (keyed by logical index; "editor" or "preview")
this._segmentTabStates={};// Set of logical segment indices where preview has been individually hidden
this._hiddenPreviewSegments={};// Debounce timers for image preview updates (keyed by segment index)
this._imagePreviewTimers={};// Debounce timers for rich content preview updates (keyed by segment index)
this._richPreviewTimers={};// Generation counters for mermaid async rendering (keyed by segment index)
this._richPreviewGenerations={};// Content provider for markdown-to-HTML rendering in rich previews
// (pict-section-content provides parseMarkdown, code highlighting, etc.)
this._contentProvider=null;// Whether the rendered (read-mode) view is currently active
this._renderedViewActive=false;// Generation counter for rendered view mermaid async rendering
this._renderedViewGeneration=0;// Attach helper modules
libFormatting.attach(this);libImageHandling.attach(this);libDragAndReorder.attach(this);libRichPreview.attach(this);libCodeMirror.attach(this);}onBeforeInitialize(){super.onBeforeInitialize();this.targetElement=false;return super.onBeforeInitialize();}/**
	 * Connect the CodeMirror modules.  The consumer must pass an object with:
	 *   - EditorView: the EditorView class
	 *   - EditorState: the EditorState class
	 *   - extensions: an array of extensions to use (e.g. basicSetup, markdown(), etc.)
	 *
	 * If not called explicitly, the view will attempt to find them on window.CodeMirrorModules.
	 *
	 * @param {object} [pCodeMirrorModules] - The CodeMirror modules object
	 * @returns {boolean|void}
	 */connectCodeMirrorModules(pCodeMirrorModules){if(pCodeMirrorModules&&typeof pCodeMirrorModules==='object'){if(typeof pCodeMirrorModules.EditorView==='function'&&typeof pCodeMirrorModules.EditorState==='function'){this._codeMirrorModules=pCodeMirrorModules;return;}}// Try to find CodeMirror modules in global scope
if(typeof window!=='undefined'){if(window.CodeMirrorModules&&typeof window.CodeMirrorModules.EditorView==='function'){this.log.trace("PICT-MarkdownEditor Found CodeMirror modules on window.CodeMirrorModules.");this._codeMirrorModules=window.CodeMirrorModules;return;}}this.log.error("PICT-MarkdownEditor No CodeMirror modules found. Provide them via connectCodeMirrorModules() or set window.CodeMirrorModules.");return false;}onAfterRender(pRenderable){if(!this.initialRenderComplete){this.onAfterInitialRender();this.initialRenderComplete=true;}// Inject CSS from all registered views (after onAfterInitialRender so
// that pict-section-content's CSS is registered before injection)
this.pict.CSSMap.injectCSS();return super.onAfterRender(pRenderable);}onAfterInitialRender(){// Resolve CodeMirror modules if not already set
if(!this._codeMirrorModules){this.connectCodeMirrorModules();}if(!this._codeMirrorModules){this.log.error("PICT-MarkdownEditor Cannot initialize; no CodeMirror modules available.");return false;}// Register pict-section-content's CSS for rich preview rendering.
// This ensures the rendered markdown (headings, code blocks, tables, etc.)
// is styled correctly inside the preview area.
if(this.options.EnableRichPreview){let tmpContentViewConfig=libPictSectionContent.default_configuration;if(tmpContentViewConfig&&tmpContentViewConfig.CSS){this.pict.CSSMap.addCSS('Pict-Content-View',tmpContentViewConfig.CSS);}}// Find the target element
let tmpTargetElementSet=this.services.ContentAssignment.getElement(this.options.TargetElementAddress);if(!tmpTargetElementSet||tmpTargetElementSet.length<1){this.log.error("PICT-MarkdownEditor Could not find target element [".concat(this.options.TargetElementAddress,"]!"));this.targetElement=false;return false;}this.targetElement=tmpTargetElementSet[0];// Determine the view call identifier for onclick handlers
this._viewCallIdentifier=this._resolveViewCallIdentifier();// Build the editor UI
this._buildEditorUI();}/**
	 * Resolve how the view can be referenced from global onclick handlers.
	 * Returns a string like "_Pict.views['MyViewHash']" — bracket syntax
	 * is required so view hashes containing hyphens (e.g.
	 * "ContentEditor-MarkdownEditor") parse correctly. Dot access
	 * (`_Pict.views.X-Y`) is read as subtraction by the JS parser and
	 * the onclick silently no-ops.
	 *
	 * @returns {string}
	 */_resolveViewCallIdentifier(){let tmpViews=this.pict.views;for(let tmpViewHash in tmpViews){if(tmpViews[tmpViewHash]===this){return"_Pict.views['".concat(tmpViewHash,"']");}}return"_Pict.servicesMap.PictView['".concat(this.Hash,"']");}/**
	 * Get the .pict-mde container element.  Always does a fresh DOM lookup
	 * because pict's async render pipeline can replace the element between calls.
	 *
	 * @returns {HTMLElement|null}
	 */_getContainerElement(){if(this.targetElement){let tmpContainer=this.targetElement.querySelector('.pict-mde');if(tmpContainer){return tmpContainer;}}return this.targetElement||null;}/**
	 * Resolve a URL relative to the configured ImageBaseURL.
	 *
	 * Absolute URLs (starting with /, http://, https://, data:) are returned
	 * unchanged.  Relative URLs are prepended with this.options.ImageBaseURL.
	 *
	 * @param {string} pURL - The URL to resolve
	 * @returns {string} The resolved URL
	 */_resolveImageURL(pURL){if(!pURL||!this.options.ImageBaseURL){return pURL;}// Leave absolute URLs alone
if(pURL.startsWith('/')||pURL.startsWith('http://')||pURL.startsWith('https://')||pURL.startsWith('data:')){return pURL;}let tmpBase=this.options.ImageBaseURL;// Ensure base ends with /
if(tmpBase&&!tmpBase.endsWith('/')){tmpBase+='/';}return tmpBase+pURL;}/**
	 * Build the full editor UI: render existing segments from data and the add-segment button.
	 */_buildEditorUI(){let tmpContainer=this._getContainerElement();// Ensure the container has the pict-mde class (the template's wrapper
// may have been replaced by pict's async render pipeline)
if(tmpContainer&&!tmpContainer.classList.contains('pict-mde')){tmpContainer.classList.add('pict-mde');}// Destroy existing editors before clearing
for(let tmpIdx in this._segmentEditors){if(this._segmentEditors[tmpIdx]){this._segmentEditors[tmpIdx].destroy();}}tmpContainer.innerHTML='';// Restore toggle states on the container after clearing
tmpContainer.classList.remove('pict-mde-preview-off','pict-mde-preview-bottom','pict-mde-preview-side','pict-mde-preview-tabbed','pict-mde-previews-hidden');tmpContainer.classList.add('pict-mde-preview-'+this._previewMode);if(this._controlsVisible){tmpContainer.classList.add('pict-mde-controls-on');}else{tmpContainer.classList.add('pict-mde-controls-hidden');}// Load existing segments from data address, or start with one empty segment
let tmpSegments=this._getSegmentsFromData();if(!tmpSegments||tmpSegments.length===0){tmpSegments=[{Content:''}];this._setSegmentsToData(tmpSegments);}this._segmentCounter=0;this._segmentEditors={};for(let i=0;i<tmpSegments.length;i++){this._renderSegment(tmpContainer,i,tmpSegments[i].Content||'');}this._renderAddButton(tmpContainer);}/**
	 * Render a single segment into the container.
	 *
	 * @param {HTMLElement} pContainer - The container element
	 * @param {number} pIndex - The segment index
	 * @param {string} pContent - The initial content
	 */_renderSegment(pContainer,pIndex,pContent){let tmpSegmentIndex=this._segmentCounter++;let tmpRecord={SegmentIndex:tmpSegmentIndex,SegmentDisplayIndex:pIndex+1,ViewIdentifier:this._viewCallIdentifier};let tmpHTML=this.pict.parseTemplateByHash('MarkdownEditor-Segment',tmpRecord);let tmpTempDiv=document.createElement('div');tmpTempDiv.innerHTML=tmpHTML;let tmpSegmentElement=tmpTempDiv.firstElementChild;pContainer.appendChild(tmpSegmentElement);// Build quadrant buttons from configuration arrays
this._buildQuadrantButtons(tmpSegmentElement,tmpSegmentIndex);// Restore per-segment preview hidden state (tracked by logical index)
if(this._hiddenPreviewSegments[pIndex]){tmpSegmentElement.classList.add('pict-mde-preview-hidden');}// Restore per-segment tab state in tabbed mode
if(this._previewMode==='tabbed'&&this._segmentTabStates[pIndex]==='preview'){tmpSegmentElement.classList.add('pict-mde-tab-showing-preview');let tmpTabBar=tmpSegmentElement.querySelector('.pict-mde-tab-bar');if(tmpTabBar){let tmpEditorTab=tmpTabBar.querySelector('[data-tab="editor"]');let tmpPreviewTab=tmpTabBar.querySelector('[data-tab="preview"]');if(tmpEditorTab){tmpEditorTab.classList.remove('pict-mde-tab-active');}if(tmpPreviewTab){tmpPreviewTab.classList.add('pict-mde-tab-active');}}}// Wire up drag-and-drop on the drag handle
this._wireSegmentDragEvents(tmpSegmentElement,tmpSegmentIndex);// Create the CodeMirror editor in the segment editor container
let tmpEditorContainer=document.getElementById("PictMDE-SegmentEditor-".concat(tmpSegmentIndex));if(tmpEditorContainer){this._createEditorInContainer(tmpEditorContainer,tmpSegmentIndex,pContent);// Wire image drag-and-drop on the editor container
this._wireImageDragEvents(tmpEditorContainer,tmpSegmentIndex);// Render image previews for existing content
if(pContent){this._updateImagePreviews(tmpSegmentIndex);this._updateRichPreviews(tmpSegmentIndex);}}}/**
	 * Build buttons in all four quadrants (TL, BL, TR, BR) from the
	 * configuration arrays.  Each button config has:
	 *   HTML   — innerHTML
	 *   Action — "methodName" or "methodName:arg"
	 *   Class  — additional CSS class(es)
	 *   Title  — tooltip text
	 *
	 * Left quadrant buttons (TL, BL) get the "pict-mde-left-btn" base class.
	 * Right quadrant buttons (TR, BR) get the "pict-mde-sidebar-btn" base class.
	 *
	 * @param {HTMLElement} pSegmentElement - The .pict-mde-segment element
	 * @param {number} pSegmentIndex - The internal segment index
	 */_buildQuadrantButtons(pSegmentElement,pSegmentIndex){let tmpQuadrants=[{key:'ButtonsTL',selector:'.pict-mde-quadrant-tl',baseClass:'pict-mde-left-btn'},{key:'ButtonsBL',selector:'.pict-mde-quadrant-bl',baseClass:'pict-mde-left-btn'},{key:'ButtonsTR',selector:'.pict-mde-quadrant-tr',baseClass:'pict-mde-sidebar-btn'},{key:'ButtonsBR',selector:'.pict-mde-quadrant-br',baseClass:'pict-mde-sidebar-btn'}];let tmpSelf=this;for(let q=0;q<tmpQuadrants.length;q++){let tmpQuadrant=tmpQuadrants[q];let tmpContainer=pSegmentElement.querySelector(tmpQuadrant.selector);if(!tmpContainer){continue;}let tmpButtons=this.options[tmpQuadrant.key];if(!Array.isArray(tmpButtons)){continue;}for(let b=0;b<tmpButtons.length;b++){let tmpBtnConfig=tmpButtons[b];let tmpButton=document.createElement('button');tmpButton.type='button';tmpButton.className=tmpQuadrant.baseClass;if(tmpBtnConfig.Class){tmpButton.className+=' '+tmpBtnConfig.Class;}// Run the button HTML through Pict's template engine so
// `{~I:Name~}` tags expand into themable SVG icons from
// pict.providers.Icon.  Plain HTML strings (e.g. the
// stylized `<b>B</b>` formatting buttons) pass through
// unchanged — the parser is a no-op when no template tags
// are present.
let tmpHTML=tmpBtnConfig.HTML||'';if(tmpHTML&&typeof this.pict.parseTemplate==='function'){tmpHTML=this.pict.parseTemplate(tmpHTML,{});}tmpButton.innerHTML=tmpHTML;tmpButton.title=tmpBtnConfig.Title||'';// Parse the action string: "methodName" or "methodName:arg"
let tmpAction=tmpBtnConfig.Action||'';let tmpMethod=tmpAction;let tmpArg=null;let tmpColonIndex=tmpAction.indexOf(':');if(tmpColonIndex>=0){tmpMethod=tmpAction.substring(0,tmpColonIndex);tmpArg=tmpAction.substring(tmpColonIndex+1);}// Build the click handler
(function(pMethod,pArg,pSegIdx){tmpButton.addEventListener('click',()=>{if(typeof tmpSelf[pMethod]==='function'){if(pArg!==null){tmpSelf[pMethod](pSegIdx,pArg);}else{tmpSelf[pMethod](pSegIdx);}}else{tmpSelf.log.warn("PICT-MarkdownEditor _buildQuadrantButtons: method \"".concat(pMethod,"\" not found."));}});})(tmpMethod,tmpArg,pSegmentIndex);tmpContainer.appendChild(tmpButton);}}}/**
	 * Hook for subclasses to customize the CodeMirror extensions before editor creation.
	 *
	 * @param {Array} pExtensions - The extensions array to modify
	 * @param {number} pSegmentIndex - The segment index
	 * @returns {Array} The modified extensions array
	 */customConfigureExtensions(pExtensions,pSegmentIndex){return pExtensions;}/**
	 * Render the "Add Segment" button at the bottom of the container.
	 *
	 * @param {HTMLElement} pContainer - The container element
	 */_renderAddButton(pContainer){let tmpRecord={ViewIdentifier:this._viewCallIdentifier};let tmpHTML=this.pict.parseTemplateByHash('MarkdownEditor-AddSegment',tmpRecord);let tmpTempDiv=document.createElement('div');tmpTempDiv.innerHTML=tmpHTML;let tmpButtonElement=tmpTempDiv.firstElementChild;pContainer.appendChild(tmpButtonElement);}/**
	 * Hook for consumers to handle image uploads.
	 *
	 * Override this in a subclass or consumer to upload images to a server/CDN.
	 * Return true to indicate you are handling the upload asynchronously.
	 * Call fCallback(null, url) on success, or fCallback(error) on failure.
	 * Return false/undefined to fall back to base64 data URI inline.
	 *
	 * @param {File} pFile - The image File object
	 * @param {number} pSegmentIndex - The logical segment index
	 * @param {function} fCallback - Callback: fCallback(pError, pURL)
	 * @returns {boolean} true if handling the upload, false to use base64 default
	 */onImageUpload(pFile,pSegmentIndex,fCallback){// Override in subclass or consumer
return false;}// -- Controls Toggle (line numbers + right sidebar) --
/**
	 * Toggle controls (line number gutters and right sidebar formatting
	 * buttons) on or off for all segments.
	 *
	 * When controls are hidden the right-side quadrants (TR, BR) appear
	 * faintly on hover but are otherwise invisible, and CodeMirror line
	 * number gutters are hidden.
	 *
	 * This method is called by the quadrant button system with the segment
	 * index as the first argument — it ignores that argument and uses only
	 * the optional boolean.
	 *
	 * @param {number|boolean} [pSegmentIndexOrVisible] - Segment index (ignored) or boolean
	 * @param {boolean} [pVisible] - If provided, set to this value; otherwise toggle
	 */toggleControls(pSegmentIndexOrVisible,pVisible){// When called from a quadrant button, first arg is segment index (number).
// When called programmatically, first arg may be a boolean.
let tmpVisible=pVisible;if(typeof pSegmentIndexOrVisible==='boolean'){tmpVisible=pSegmentIndexOrVisible;}if(typeof tmpVisible==='boolean'){this._controlsVisible=tmpVisible;}else{this._controlsVisible=!this._controlsVisible;}let tmpContainer=this._getContainerElement();if(tmpContainer){if(this._controlsVisible){tmpContainer.classList.add('pict-mde-controls-on');tmpContainer.classList.remove('pict-mde-controls-hidden');}else{tmpContainer.classList.remove('pict-mde-controls-on');tmpContainer.classList.add('pict-mde-controls-hidden');}}}/**
	 * Toggle line numbers on or off for all segments.
	 * Backward-compatible alias for toggleControls().
	 *
	 * @param {boolean} [pVisible] - If provided, set to this value; otherwise toggle
	 */toggleLineNumbers(pVisible){this.toggleControls(pVisible);}// -- Preview Toggle --
/**
	 * Toggle rich previews on or off for all segments globally.
	 *
	 * When hidden globally, individual segment overrides are preserved
	 * so that restoring global visibility returns to the per-segment state.
	 *
	 * Backward compatible: toggles between "off" and the last-used preview layout.
	 *
	 * @param {boolean} [pVisible] - If provided, set to this value; otherwise toggle
	 */togglePreview(pVisible){if(typeof pVisible==='boolean'){if(pVisible){this.setPreviewMode(this._lastPreviewLayout||'bottom');}else{this.setPreviewMode('off');}}else{if(this._previewMode==='off'){this.setPreviewMode(this._lastPreviewLayout||'bottom');}else{this.setPreviewMode('off');}}}/**
	 * Set the preview layout mode.
	 *
	 * @param {string} pMode - One of "off", "bottom", "side", "tabbed"
	 */setPreviewMode(pMode){let tmpValidModes=['off','bottom','side','tabbed'];if(tmpValidModes.indexOf(pMode)<0){this.log.warn("PICT-MarkdownEditor setPreviewMode: unknown mode \"".concat(pMode,"\"."));return;}// Remember the last non-off mode for toggle restore
if(pMode!=='off'){this._lastPreviewLayout=pMode;}this._previewMode=pMode;let tmpContainer=this._getContainerElement();if(tmpContainer){tmpContainer.classList.remove('pict-mde-preview-off','pict-mde-preview-bottom','pict-mde-preview-side','pict-mde-preview-tabbed','pict-mde-previews-hidden');tmpContainer.classList.add('pict-mde-preview-'+pMode);}// When switching to a visible preview mode, trigger preview renders
// for all segments to ensure they are up to date
if(pMode!=='off'){let tmpOrderedIndices=this._getOrderedSegmentIndices();for(let i=0;i<tmpOrderedIndices.length;i++){this._updateRichPreviews(tmpOrderedIndices[i]);this._updateImagePreviews(tmpOrderedIndices[i]);}}}/**
	 * Cycle through preview layout modes: off → bottom → side → tabbed → off.
	 *
	 * Accepts a segment index as first argument (ignored) for compatibility
	 * with the quadrant button system.
	 *
	 * @param {number} [pSegmentIndex] - Ignored; present for quadrant button compat
	 */cyclePreviewMode(pSegmentIndex){let tmpModeOrder=['off','bottom','side','tabbed'];let tmpCurrentIndex=tmpModeOrder.indexOf(this._previewMode);let tmpNextIndex=(tmpCurrentIndex+1)%tmpModeOrder.length;this.setPreviewMode(tmpModeOrder[tmpNextIndex]);}/**
	 * Switch a segment between editor and preview tabs (tabbed mode).
	 *
	 * @param {number} pSegmentIndex - The internal segment index
	 * @param {string} pTab - "editor" or "preview"
	 */switchSegmentTab(pSegmentIndex,pTab){let tmpLogicalIndex=this._getLogicalIndex(pSegmentIndex);if(tmpLogicalIndex<0){return;}this._segmentTabStates[tmpLogicalIndex]=pTab;let tmpSegmentEl=document.getElementById("PictMDE-Segment-".concat(pSegmentIndex));if(!tmpSegmentEl){return;}// Toggle the preview-showing class on the segment
if(pTab==='preview'){tmpSegmentEl.classList.add('pict-mde-tab-showing-preview');// Trigger preview render when switching to preview tab
this._updateRichPreviews(pSegmentIndex);this._updateImagePreviews(pSegmentIndex);}else{tmpSegmentEl.classList.remove('pict-mde-tab-showing-preview');}// Update tab bar active state
let tmpTabBar=document.getElementById("PictMDE-TabBar-".concat(pSegmentIndex));if(tmpTabBar){let tmpTabs=tmpTabBar.querySelectorAll('.pict-mde-tab');for(let i=0;i<tmpTabs.length;i++){if(tmpTabs[i].getAttribute('data-tab')===pTab){tmpTabs[i].classList.add('pict-mde-tab-active');}else{tmpTabs[i].classList.remove('pict-mde-tab-active');}}}}/**
	 * Toggle the rich preview for a single segment.
	 *
	 * This adds/removes the .pict-mde-preview-hidden class on the
	 * individual segment element, independent of the global toggle.
	 *
	 * @param {number} pSegmentIndex - The internal segment index
	 * @param {boolean} [pVisible] - If provided, set to this value; otherwise toggle
	 */toggleSegmentPreview(pSegmentIndex,pVisible){// Convert internal index to logical index for persistent tracking
let tmpLogicalIndex=this._getLogicalIndex(pSegmentIndex);if(tmpLogicalIndex<0){return;}let tmpCurrentlyHidden=!!this._hiddenPreviewSegments[tmpLogicalIndex];if(typeof pVisible==='boolean'){tmpCurrentlyHidden=!pVisible;}else{tmpCurrentlyHidden=!tmpCurrentlyHidden;}if(tmpCurrentlyHidden){this._hiddenPreviewSegments[tmpLogicalIndex]=true;}else{delete this._hiddenPreviewSegments[tmpLogicalIndex];}let tmpSegmentEl=document.getElementById("PictMDE-Segment-".concat(pSegmentIndex));if(tmpSegmentEl){if(tmpCurrentlyHidden){tmpSegmentEl.classList.add('pict-mde-preview-hidden');}else{tmpSegmentEl.classList.remove('pict-mde-preview-hidden');// Render preview content when making it visible
this._updateRichPreviews(pSegmentIndex);this._updateImagePreviews(pSegmentIndex);}}}// -- Segment Data Management --
/**
	 * Get the segments array from the configured data address.
	 *
	 * @returns {Array|null}
	 */_getSegmentsFromData(){if(!this.options.ContentDataAddress){return null;}const tmpAddressSpace={Fable:this.fable,Pict:this.fable,AppData:this.AppData,Bundle:this.Bundle,Options:this.options};let tmpData=this.fable.manifest.getValueByHash(tmpAddressSpace,this.options.ContentDataAddress);if(Array.isArray(tmpData)){return tmpData;}return null;}/**
	 * Write the segments array to the configured data address.
	 *
	 * @param {Array} pSegments - The segments array
	 */_setSegmentsToData(pSegments){if(!this.options.ContentDataAddress){return;}const tmpAddressSpace={Fable:this.fable,Pict:this.fable,AppData:this.AppData,Bundle:this.Bundle,Options:this.options};this.fable.manifest.setValueByHash(tmpAddressSpace,this.options.ContentDataAddress,pSegments);}/**
	 * Called when a segment's content changes in the CodeMirror editor.
	 *
	 * @param {number} pSegmentIndex - The internal segment index
	 * @param {string} pContent - The new content
	 */_onSegmentContentChange(pSegmentIndex,pContent){let tmpLogicalIndex=this._getLogicalIndex(pSegmentIndex);if(tmpLogicalIndex<0){return;}let tmpSegments=this._getSegmentsFromData();if(!tmpSegments){return;}if(tmpLogicalIndex<tmpSegments.length){tmpSegments[tmpLogicalIndex].Content=pContent;}this.onContentChange(tmpLogicalIndex,pContent);// Debounce image preview updates (500ms) to avoid thrashing on every keystroke
let tmpSelf=this;if(this._imagePreviewTimers[pSegmentIndex]){clearTimeout(this._imagePreviewTimers[pSegmentIndex]);}this._imagePreviewTimers[pSegmentIndex]=setTimeout(()=>{tmpSelf._updateImagePreviews(pSegmentIndex);delete tmpSelf._imagePreviewTimers[pSegmentIndex];},500);// Debounce rich content preview updates (mermaid / KaTeX) at 500ms
if(this._richPreviewTimers[pSegmentIndex]){clearTimeout(this._richPreviewTimers[pSegmentIndex]);}this._richPreviewTimers[pSegmentIndex]=setTimeout(()=>{tmpSelf._updateRichPreviews(pSegmentIndex);delete tmpSelf._richPreviewTimers[pSegmentIndex];},500);}/**
	 * Hook for subclasses to respond to content changes.
	 *
	 * @param {number} pSegmentIndex - The logical segment index
	 * @param {string} pContent - The new content
	 */onContentChange(pSegmentIndex,pContent){// Override in subclass
}/**
	 * Get the logical (ordered) index for an internal segment index.
	 *
	 * @param {number} pInternalIndex - The internal segment index
	 * @returns {number} The logical index, or -1 if not found
	 */_getLogicalIndex(pInternalIndex){let tmpContainer=this._getContainerElement();if(!tmpContainer){return-1;}let tmpSegmentElements=tmpContainer.querySelectorAll('.pict-mde-segment');for(let i=0;i<tmpSegmentElements.length;i++){let tmpIndex=parseInt(tmpSegmentElements[i].getAttribute('data-segment-index'),10);if(tmpIndex===pInternalIndex){return i;}}return-1;}/**
	 * Get the ordered list of internal segment indices from the DOM.
	 *
	 * @returns {Array<number>}
	 */_getOrderedSegmentIndices(){let tmpContainer=this._getContainerElement();if(!tmpContainer){return[];}let tmpSegmentElements=tmpContainer.querySelectorAll('.pict-mde-segment');let tmpIndices=[];for(let i=0;i<tmpSegmentElements.length;i++){tmpIndices.push(parseInt(tmpSegmentElements[i].getAttribute('data-segment-index'),10));}return tmpIndices;}// -- Public API --
/**
	 * Add a new empty segment at the end.
	 *
	 * @param {string} [pContent] - Optional initial content for the new segment
	 */addSegment(pContent){let tmpContent=typeof pContent==='string'?pContent:'';let tmpSegments=this._getSegmentsFromData();if(!tmpSegments){tmpSegments=[];}tmpSegments.push({Content:tmpContent});this._setSegmentsToData(tmpSegments);this._buildEditorUI();}/**
	 * Remove a segment by its internal index.
	 *
	 * @param {number} pSegmentIndex - The internal segment index
	 */removeSegment(pSegmentIndex){let tmpLogicalIndex=this._getLogicalIndex(pSegmentIndex);if(tmpLogicalIndex<0){this.log.warn("PICT-MarkdownEditor removeSegment: segment index ".concat(pSegmentIndex," not found."));return;}let tmpSegments=this._getSegmentsFromData();if(!tmpSegments||tmpSegments.length<=1){this.log.warn("PICT-MarkdownEditor removeSegment: cannot remove the last segment.");return;}if(this._segmentEditors[pSegmentIndex]){this._segmentEditors[pSegmentIndex].destroy();delete this._segmentEditors[pSegmentIndex];}tmpSegments.splice(tmpLogicalIndex,1);this._setSegmentsToData(tmpSegments);// Update per-segment hidden preview state after removal
let tmpNewHidden={};for(let tmpKey in this._hiddenPreviewSegments){let tmpIdx=parseInt(tmpKey,10);if(tmpIdx<tmpLogicalIndex){tmpNewHidden[tmpIdx]=true;}else if(tmpIdx>tmpLogicalIndex){tmpNewHidden[tmpIdx-1]=true;}// tmpIdx === tmpLogicalIndex is the removed segment; skip it
}this._hiddenPreviewSegments=tmpNewHidden;// Update per-segment tab states after removal
let tmpNewTabStates={};for(let tmpKey in this._segmentTabStates){let tmpIdx=parseInt(tmpKey,10);if(tmpIdx<tmpLogicalIndex){tmpNewTabStates[tmpIdx]=this._segmentTabStates[tmpKey];}else if(tmpIdx>tmpLogicalIndex){tmpNewTabStates[tmpIdx-1]=this._segmentTabStates[tmpKey];}}this._segmentTabStates=tmpNewTabStates;this._buildEditorUI();}/**
	 * Move a segment up by its internal index.
	 *
	 * @param {number} pSegmentIndex - The internal segment index
	 */moveSegmentUp(pSegmentIndex){let tmpLogicalIndex=this._getLogicalIndex(pSegmentIndex);if(tmpLogicalIndex<=0){return;}this._marshalAllEditorsToData();let tmpSegments=this._getSegmentsFromData();if(!tmpSegments){return;}let tmpTemp=tmpSegments[tmpLogicalIndex];tmpSegments[tmpLogicalIndex]=tmpSegments[tmpLogicalIndex-1];tmpSegments[tmpLogicalIndex-1]=tmpTemp;// Swap per-segment hidden preview state to follow the moved segment
this._swapHiddenPreviewState(tmpLogicalIndex,tmpLogicalIndex-1);this._swapSegmentTabStates(tmpLogicalIndex,tmpLogicalIndex-1);this._buildEditorUI();}/**
	 * Move a segment down by its internal index.
	 *
	 * @param {number} pSegmentIndex - The internal segment index
	 */moveSegmentDown(pSegmentIndex){let tmpLogicalIndex=this._getLogicalIndex(pSegmentIndex);let tmpSegments=this._getSegmentsFromData();if(!tmpSegments||tmpLogicalIndex<0||tmpLogicalIndex>=tmpSegments.length-1){return;}this._marshalAllEditorsToData();let tmpTemp=tmpSegments[tmpLogicalIndex];tmpSegments[tmpLogicalIndex]=tmpSegments[tmpLogicalIndex+1];tmpSegments[tmpLogicalIndex+1]=tmpTemp;// Swap per-segment hidden preview state to follow the moved segment
this._swapHiddenPreviewState(tmpLogicalIndex,tmpLogicalIndex+1);this._swapSegmentTabStates(tmpLogicalIndex,tmpLogicalIndex+1);this._buildEditorUI();}/**
	 * Get the content of a specific segment by logical index.
	 *
	 * @param {number} pLogicalIndex - The logical (0-based) index
	 * @returns {string} The segment content
	 */getSegmentContent(pLogicalIndex){let tmpOrderedIndices=this._getOrderedSegmentIndices();if(pLogicalIndex<0||pLogicalIndex>=tmpOrderedIndices.length){return'';}let tmpInternalIndex=tmpOrderedIndices[pLogicalIndex];let tmpEditor=this._segmentEditors[tmpInternalIndex];if(tmpEditor){return tmpEditor.state.doc.toString();}return'';}/**
	 * Set the content of a specific segment by logical index.
	 *
	 * @param {number} pLogicalIndex - The logical (0-based) index
	 * @param {string} pContent - The content to set
	 */setSegmentContent(pLogicalIndex,pContent){let tmpOrderedIndices=this._getOrderedSegmentIndices();if(pLogicalIndex<0||pLogicalIndex>=tmpOrderedIndices.length){this.log.warn("PICT-MarkdownEditor setSegmentContent: index ".concat(pLogicalIndex," out of range."));return;}let tmpInternalIndex=tmpOrderedIndices[pLogicalIndex];let tmpEditor=this._segmentEditors[tmpInternalIndex];if(tmpEditor){tmpEditor.dispatch({changes:{from:0,to:tmpEditor.state.doc.length,insert:pContent}});}}/**
	 * Get the total number of segments.
	 *
	 * @returns {number}
	 */getSegmentCount(){return this._getOrderedSegmentIndices().length;}/**
	 * Get all content from all segments joined together.
	 *
	 * @param {string} [pSeparator] - The separator between segments (default: "\n\n")
	 * @returns {string}
	 */getAllContent(pSeparator){let tmpSeparator=typeof pSeparator==='string'?pSeparator:'\n\n';let tmpOrderedIndices=this._getOrderedSegmentIndices();let tmpParts=[];for(let i=0;i<tmpOrderedIndices.length;i++){let tmpEditor=this._segmentEditors[tmpOrderedIndices[i]];if(tmpEditor){tmpParts.push(tmpEditor.state.doc.toString());}}return tmpParts.join(tmpSeparator);}/**
	 * Marshal all editor contents back into the data address.
	 */_marshalAllEditorsToData(){let tmpSegments=this._getSegmentsFromData();if(!tmpSegments){return;}let tmpOrderedIndices=this._getOrderedSegmentIndices();for(let i=0;i<tmpOrderedIndices.length;i++){let tmpEditor=this._segmentEditors[tmpOrderedIndices[i]];if(tmpEditor&&i<tmpSegments.length){tmpSegments[i].Content=tmpEditor.state.doc.toString();}}}/**
	 * Set the read-only state of all editors.
	 *
	 * @param {boolean} pReadOnly - Whether editors should be read-only
	 */setReadOnly(pReadOnly){this.options.ReadOnly=pReadOnly;if(this.initialRenderComplete){this._marshalAllEditorsToData();this._buildEditorUI();}}/**
	 * Marshal content from the data address into the view.
	 */marshalToView(){super.marshalToView();if(this.initialRenderComplete&&this.options.ContentDataAddress){this._buildEditorUI();}}/**
	 * Marshal the current editor content back to the data address.
	 */marshalFromView(){super.marshalFromView();this._marshalAllEditorsToData();}/**
	 * Destroy all editors and clean up.
	 */destroy(){for(let tmpIndex in this._segmentEditors){if(this._segmentEditors[tmpIndex]){this._segmentEditors[tmpIndex].destroy();}}this._segmentEditors={};// Clear rich preview debounce timers
for(let tmpIndex in this._richPreviewTimers){clearTimeout(this._richPreviewTimers[tmpIndex]);}this._richPreviewTimers={};this._richPreviewGenerations={};this._segmentTabStates={};}}module.exports=PictSectionMarkdownEditor;module.exports.default_configuration=_DefaultConfiguration;},{"./Pict-MDE-CodeMirror.js":43,"./Pict-MDE-DragAndReorder.js":44,"./Pict-MDE-Formatting.js":45,"./Pict-MDE-ImageHandling.js":46,"./Pict-MDE-RichPreview.js":47,"./Pict-Section-MarkdownEditor-DefaultConfiguration.js":48,"pict-section-content":38,"pict-view":42}],50:[function(require,module,exports){arguments[4][8][0].apply(exports,arguments);},{"dup":8}],51:[function(require,module,exports){arguments[4][9][0].apply(exports,arguments);},{"../package.json":50,"dup":9}],52:[function(require,module,exports){arguments[4][22][0].apply(exports,arguments);},{"dup":22}],53:[function(require,module,exports){arguments[4][23][0].apply(exports,arguments);},{"../package.json":52,"dup":23,"fable-serviceproviderbase":51}],54:[function(require,module,exports){/**
 * Pict-Modal-Confirm
 *
 * Builds confirm and double-confirm dialog DOM, returns Promises.
 */class PictModalConfirm{constructor(pModal){this._modal=pModal;}/**
	 * Show a single-step confirmation dialog.
	 *
	 * @param {string} pMessage - The confirmation message
	 * @param {object} [pOptions] - Options (title, confirmLabel, cancelLabel, dangerous)
	 * @returns {Promise<boolean>}
	 */confirm(pMessage,pOptions){let tmpOptions=Object.assign({},this._modal.options.DefaultConfirmOptions,pOptions);return new Promise(fResolve=>{let tmpDialog=this._buildDialog(tmpOptions.title,pMessage,fResolve,tmpOptions);this._showDialog(tmpDialog,fResolve);});}/**
	 * Show a two-step confirmation dialog.
	 *
	 * If confirmPhrase is provided, user must type it to enable the confirm button.
	 * Otherwise, first click changes button text, second click confirms.
	 *
	 * @param {string} pMessage - The confirmation message
	 * @param {object} [pOptions] - Options (title, confirmPhrase, phrasePrompt, confirmLabel, cancelLabel)
	 * @returns {Promise<boolean>}
	 */doubleConfirm(pMessage,pOptions){let tmpOptions=Object.assign({},this._modal.options.DefaultDoubleConfirmOptions,pOptions);return new Promise(fResolve=>{let tmpDialog=this._buildDoubleConfirmDialog(tmpOptions.title,pMessage,fResolve,tmpOptions);this._showDialog(tmpDialog,fResolve);});}/**
	 * Build a standard confirm dialog element.
	 *
	 * @param {string} pTitle
	 * @param {string} pMessage
	 * @param {function} fResolve - Promise resolver
	 * @param {object} pOptions
	 * @returns {HTMLElement}
	 */_buildDialog(pTitle,pMessage,fResolve,pOptions){let tmpId=this._modal._nextId();let tmpBtnStyle=pOptions.dangerous?'danger':'primary';let tmpDialog=document.createElement('div');tmpDialog.className='pict-modal-dialog';if(pOptions.unbounded){tmpDialog.className+=' pict-modal-dialog--unbounded';}tmpDialog.id='pict-modal-'+tmpId;tmpDialog.setAttribute('role','dialog');tmpDialog.setAttribute('aria-modal','true');tmpDialog.style.width='420px';tmpDialog.innerHTML='<div class="pict-modal-dialog-header">'+'<span class="pict-modal-dialog-title">'+this._escapeHTML(pTitle)+'</span>'+'<button class="pict-modal-dialog-close" aria-label="Close">&times;</button>'+'</div>'+'<div class="pict-modal-dialog-body">'+'<p>'+this._escapeHTML(pMessage)+'</p>'+'</div>'+'<div class="pict-modal-dialog-footer">'+'<button class="pict-modal-btn" data-action="cancel">'+this._escapeHTML(pOptions.cancelLabel)+'</button>'+'<button class="pict-modal-btn pict-modal-btn--'+tmpBtnStyle+'" data-action="confirm">'+this._escapeHTML(pOptions.confirmLabel)+'</button>'+'</div>';let tmpCloseBtn=tmpDialog.querySelector('.pict-modal-dialog-close');let tmpCancelBtn=tmpDialog.querySelector('[data-action="cancel"]');let tmpConfirmBtn=tmpDialog.querySelector('[data-action="confirm"]');let tmpDismiss=pResult=>{this._dismissDialog(tmpDialog,pResult,fResolve);};tmpCloseBtn.addEventListener('click',()=>{tmpDismiss(false);});tmpCancelBtn.addEventListener('click',()=>{tmpDismiss(false);});tmpConfirmBtn.addEventListener('click',()=>{tmpDismiss(true);});tmpDialog._dismiss=tmpDismiss;tmpDialog._focusTarget=tmpCancelBtn;return tmpDialog;}/**
	 * Build a double-confirm dialog element.
	 *
	 * @param {string} pTitle
	 * @param {string} pMessage
	 * @param {function} fResolve - Promise resolver
	 * @param {object} pOptions
	 * @returns {HTMLElement}
	 */_buildDoubleConfirmDialog(pTitle,pMessage,fResolve,pOptions){let tmpId=this._modal._nextId();let tmpHasPhrase=typeof pOptions.confirmPhrase==='string'&&pOptions.confirmPhrase.length>0;let tmpDialog=document.createElement('div');tmpDialog.className='pict-modal-dialog';if(pOptions.unbounded){tmpDialog.className+=' pict-modal-dialog--unbounded';}tmpDialog.id='pict-modal-'+tmpId;tmpDialog.setAttribute('role','dialog');tmpDialog.setAttribute('aria-modal','true');tmpDialog.style.width='420px';let tmpBodyContent='<p>'+this._escapeHTML(pMessage)+'</p>';if(tmpHasPhrase){let tmpPromptText=pOptions.phrasePrompt.replace('{phrase}',pOptions.confirmPhrase);tmpBodyContent+='<div class="pict-modal-confirm-prompt">'+this._escapeHTML(tmpPromptText)+'</div>'+'<input type="text" class="pict-modal-confirm-input" autocomplete="off" spellcheck="false" />';}tmpDialog.innerHTML='<div class="pict-modal-dialog-header">'+'<span class="pict-modal-dialog-title">'+this._escapeHTML(pTitle)+'</span>'+'<button class="pict-modal-dialog-close" aria-label="Close">&times;</button>'+'</div>'+'<div class="pict-modal-dialog-body">'+tmpBodyContent+'</div>'+'<div class="pict-modal-dialog-footer">'+'<button class="pict-modal-btn" data-action="cancel">'+this._escapeHTML(pOptions.cancelLabel)+'</button>'+'<button class="pict-modal-btn pict-modal-btn--danger" data-action="confirm" disabled>'+this._escapeHTML(pOptions.confirmLabel)+'</button>'+'</div>';let tmpCloseBtn=tmpDialog.querySelector('.pict-modal-dialog-close');let tmpCancelBtn=tmpDialog.querySelector('[data-action="cancel"]');let tmpConfirmBtn=tmpDialog.querySelector('[data-action="confirm"]');let tmpDismiss=pResult=>{this._dismissDialog(tmpDialog,pResult,fResolve);};tmpCloseBtn.addEventListener('click',()=>{tmpDismiss(false);});tmpCancelBtn.addEventListener('click',()=>{tmpDismiss(false);});if(tmpHasPhrase){// Phrase-based: enable confirm button when input matches
let tmpInput=tmpDialog.querySelector('.pict-modal-confirm-input');tmpInput.addEventListener('input',()=>{tmpConfirmBtn.disabled=tmpInput.value!==pOptions.confirmPhrase;});tmpConfirmBtn.addEventListener('click',()=>{if(!tmpConfirmBtn.disabled){tmpDismiss(true);}});tmpDialog._focusTarget=tmpInput;}else{// Two-click: first click changes label, second click confirms
let tmpClickCount=0;let tmpOriginalLabel=pOptions.confirmLabel;tmpConfirmBtn.disabled=false;tmpConfirmBtn.addEventListener('click',()=>{tmpClickCount++;if(tmpClickCount===1){tmpConfirmBtn.textContent='Click again to confirm';}else{tmpDismiss(true);}});tmpDialog._focusTarget=tmpCancelBtn;}tmpDialog._dismiss=tmpDismiss;return tmpDialog;}/**
	 * Show a dialog element: append to body, show overlay, animate in.
	 *
	 * @param {HTMLElement} pDialog
	 * @param {function} fResolve - Promise resolver (for overlay click dismiss)
	 */_showDialog(pDialog,fResolve){let tmpModalEntry={element:pDialog,dismiss:pDialog._dismiss,type:'confirm'};// Show overlay
let tmpOverlayClickHandler=null;if(this._modal.options.OverlayClickDismisses){tmpOverlayClickHandler=()=>{pDialog._dismiss(false);};}this._modal._overlay.show(tmpOverlayClickHandler);// Append to body
document.body.appendChild(pDialog);// Track active modal
this._modal._activeModals.push(tmpModalEntry);// Animate in
void pDialog.offsetHeight;pDialog.classList.add('pict-modal-visible');// Focus
if(pDialog._focusTarget){pDialog._focusTarget.focus();}// Keyboard handler
pDialog._keyHandler=pEvent=>{if(pEvent.key==='Escape'){pDialog._dismiss(false);}};document.addEventListener('keydown',pDialog._keyHandler);}/**
	 * Dismiss a dialog: animate out, remove from DOM, hide overlay.
	 *
	 * @param {HTMLElement} pDialog
	 * @param {*} pResult - Value to resolve the promise with
	 * @param {function} fResolve - Promise resolver
	 */_dismissDialog(pDialog,pResult,fResolve){// Prevent double-dismiss
if(pDialog._dismissed){return;}pDialog._dismissed=true;// Remove keyboard handler
if(pDialog._keyHandler){document.removeEventListener('keydown',pDialog._keyHandler);}// Animate out
pDialog.classList.remove('pict-modal-visible');// Remove from active modals
this._modal._activeModals=this._modal._activeModals.filter(pEntry=>{return pEntry.element!==pDialog;});// Update overlay click handler to point to new topmost modal
if(this._modal._activeModals.length>0){let tmpTopModal=this._modal._activeModals[this._modal._activeModals.length-1];this._modal._overlay.updateClickHandler(this._modal.options.OverlayClickDismisses?tmpTopModal.dismiss:null);}// Hide overlay
this._modal._overlay.hide();// Remove from DOM after transition
setTimeout(()=>{if(pDialog.parentNode){pDialog.parentNode.removeChild(pDialog);}},220);// Resolve promise
fResolve(pResult);}/**
	 * Escape HTML special characters.
	 *
	 * @param {string} pText
	 * @returns {string}
	 */_escapeHTML(pText){if(typeof pText!=='string'){return'';}return pText.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}}module.exports=PictModalConfirm;},{}],55:[function(require,module,exports){/**
 * Pict-Modal-Dropdown
 *
 * Anchor-positioned menu that behaves like a dropdown / popover. Handy for:
 *   - nav menus that hang off a header link or button
 *   - "split button" style addenda (a primary action paired with a chevron
 *     that opens a list of related/alternate actions)
 *   - any "more options" affordance where a full modal would be heavy
 *
 * Differences from the modal Window helper:
 *   - No backdrop overlay — the rest of the page stays interactive.
 *   - Positioned next to the anchor element, not centered.
 *   - Auto-flips above when there isn't room below; clamps inside the viewport.
 *   - Click outside or Escape dismisses (matches native menu conventions).
 *
 * Usage:
 *     modal.dropdown(anchorEl, {
 *         items:
 *         [
 *             { Hash: 'edit',   Label: 'Edit'                    },
 *             { Hash: 'rename', Label: 'Rename...'                },
 *             { Separator: true                                   },
 *             { Hash: 'delete', Label: 'Delete', Style: 'danger'  },
 *             { Hash: 'archive',Label: 'Archive', Disabled: true,
 *               Tooltip: 'Already archived'                       }
 *         ],
 *         align: 'left'        // 'left' | 'right' (relative to anchor)
 *     }).then((pChoice) => { ... });
 *
 * Returns a Promise that resolves with `{ Hash, Item }` on selection or
 * `null` on dismiss.
 */class PictModalDropdown{constructor(pModal){this._modal=pModal;this._activeMenu=null;}/**
	 * Open a dropdown menu anchored to an element.
	 *
	 * @param {HTMLElement|string|object} pAnchor - Element, CSS selector, or
	 *   a rect-like { left, top, width, height } anchor (handy for context menus).
	 * @param {object} pOptions
	 * @param {Array}    pOptions.items     - [{ Hash, Label, Style?, Disabled?, Tooltip?, Icon?, Separator? }]
	 * @param {string}   [pOptions.align]   - 'left'|'right' (default 'left')
	 * @param {string}   [pOptions.position]- 'auto'|'below'|'above' (default 'auto')
	 * @param {string}   [pOptions.minWidth]- CSS minWidth (default: anchor width if known, else '160px')
	 * @param {string}   [pOptions.maxHeight]- CSS maxHeight (default '60vh')
	 * @param {string}   [pOptions.className]- extra class(es) for the menu element
	 * @param {boolean}  [pOptions.closeOnSelect] - default true
	 * @param {function} [pOptions.onSelect]- called with (Hash, Item) on selection
	 * @param {function} [pOptions.onClose] - called after dismiss
	 * @returns {Promise<{Hash: string, Item: object}|null>}
	 */dropdown(pAnchor,pOptions){let tmpOptions=Object.assign({align:'left',position:'auto',maxHeight:'60vh',closeOnSelect:true},pOptions||{});let tmpAnchorEl=this._resolveAnchor(pAnchor);let tmpAnchorRect=this._anchorRect(pAnchor,tmpAnchorEl);if(!tmpAnchorRect){return Promise.resolve(null);}// Re-opening the same menu is a no-op; closing-then-reopening is a
// caller decision (just call dismissDropdown() first).
if(this._activeMenu&&this._activeMenu.anchor===tmpAnchorEl){return this._activeMenu.promise;}// Only one dropdown at a time keeps focus / keyboard handling sane.
this.dismissAll();let tmpItems=Array.isArray(tmpOptions.items)?tmpOptions.items:[];let tmpResolveOuter;let tmpPromise=new Promise(fResolve=>{tmpResolveOuter=fResolve;});let tmpMenu=this._buildMenu(tmpItems,tmpOptions);document.body.appendChild(tmpMenu);this._positionMenu(tmpMenu,tmpAnchorRect,tmpOptions);// Animate in on the next frame.
void tmpMenu.offsetHeight;tmpMenu.classList.add('pict-modal-visible');let tmpDismiss=pResult=>{if(tmpMenu._dismissed){return;}tmpMenu._dismissed=true;document.removeEventListener('mousedown',tmpOutsideHandler,true);document.removeEventListener('keydown',tmpKeyHandler,true);window.removeEventListener('resize',tmpRepositionHandler);window.removeEventListener('scroll',tmpRepositionHandler,true);tmpMenu.classList.remove('pict-modal-visible');setTimeout(()=>{if(tmpMenu.parentNode){tmpMenu.parentNode.removeChild(tmpMenu);}},180);if(this._activeMenu&&this._activeMenu.element===tmpMenu){this._activeMenu=null;}if(typeof tmpOptions.onClose==='function'){tmpOptions.onClose(pResult);}tmpResolveOuter(pResult);};// Wire item clicks (each item element carries a data-hash; separators
// and disabled items are skipped).
let tmpItemEls=tmpMenu.querySelectorAll('[data-pict-modal-dropdown-item]');for(let i=0;i<tmpItemEls.length;i++){let tmpEl=tmpItemEls[i];tmpEl.addEventListener('click',pEvent=>{if(tmpEl.hasAttribute('data-disabled')){return;}pEvent.stopPropagation();let tmpIdx=parseInt(tmpEl.getAttribute('data-index'),10);let tmpItem=tmpItems[tmpIdx];let tmpHash=tmpEl.getAttribute('data-hash');if(typeof tmpOptions.onSelect==='function'){tmpOptions.onSelect(tmpHash,tmpItem);}if(tmpOptions.closeOnSelect!==false){tmpDismiss({Hash:tmpHash,Item:tmpItem});}});}// Click anywhere outside the menu (and outside the anchor) → dismiss.
// Use mousedown/capture so we beat any per-element click handlers.
let tmpOutsideHandler=pEvent=>{if(tmpMenu.contains(pEvent.target)){return;}if(tmpAnchorEl&&tmpAnchorEl.contains&&tmpAnchorEl.contains(pEvent.target)){return;}tmpDismiss(null);};document.addEventListener('mousedown',tmpOutsideHandler,true);// Esc dismisses; arrow keys navigate items (skipping disabled/separator).
let tmpKeyHandler=pEvent=>{if(pEvent.key==='Escape'){pEvent.stopPropagation();tmpDismiss(null);return;}if(pEvent.key==='ArrowDown'||pEvent.key==='ArrowUp'){pEvent.preventDefault();this._focusNeighbor(tmpMenu,pEvent.key==='ArrowDown'?1:-1);}else if(pEvent.key==='Enter'||pEvent.key===' '){let tmpFocused=document.activeElement;if(tmpFocused&&tmpMenu.contains(tmpFocused)&&tmpFocused.hasAttribute('data-pict-modal-dropdown-item')){pEvent.preventDefault();tmpFocused.click();}}};document.addEventListener('keydown',tmpKeyHandler,true);// Reposition on viewport resize / scroll so the menu doesn't drift
// off the anchor.
let tmpRepositionHandler=()=>{let tmpRect=this._anchorRect(pAnchor,tmpAnchorEl);if(tmpRect){this._positionMenu(tmpMenu,tmpRect,tmpOptions);}};window.addEventListener('resize',tmpRepositionHandler);window.addEventListener('scroll',tmpRepositionHandler,true);// Move keyboard focus to the first enabled item so arrows / Enter work
// without an extra click.
setTimeout(()=>{this._focusFirstEnabled(tmpMenu);},0);this._activeMenu={element:tmpMenu,anchor:tmpAnchorEl,promise:tmpPromise,dismiss:tmpDismiss};return tmpPromise;}/**
	 * Dismiss the currently-open dropdown (if any).
	 */dismissAll(){if(this._activeMenu){let tmpDismiss=this._activeMenu.dismiss;this._activeMenu=null;tmpDismiss(null);}}// ─────────────────────────────────────────────
//  Internals
// ─────────────────────────────────────────────
_resolveAnchor(pAnchor){if(!pAnchor){return null;}if(typeof pAnchor==='string'){return document.querySelector(pAnchor);}if(pAnchor.nodeType===1){return pAnchor;}// rect-like — no element to attach focus / outside-click ignore to,
// but that's fine, the caller knows what they're doing.
return null;}_anchorRect(pAnchor,pAnchorEl){if(pAnchorEl&&typeof pAnchorEl.getBoundingClientRect==='function'){return pAnchorEl.getBoundingClientRect();}if(pAnchor&&typeof pAnchor==='object'&&typeof pAnchor.left==='number'&&typeof pAnchor.top==='number'){return{left:pAnchor.left,top:pAnchor.top,width:pAnchor.width||0,height:pAnchor.height||0,right:pAnchor.left+(pAnchor.width||0),bottom:pAnchor.top+(pAnchor.height||0)};}return null;}_buildMenu(pItems,pOptions){let tmpId=this._modal._nextId();let tmpMenu=document.createElement('div');tmpMenu.className='pict-modal-dropdown';if(pOptions.className){tmpMenu.className+=' '+pOptions.className;}tmpMenu.id='pict-modal-dropdown-'+tmpId;tmpMenu.setAttribute('role','menu');tmpMenu.style.maxHeight=pOptions.maxHeight;let tmpHtml='';for(let i=0;i<pItems.length;i++){let tmpItem=pItems[i];if(tmpItem.Separator){tmpHtml+='<div class="pict-modal-dropdown-separator" role="separator"></div>';continue;}if(tmpItem.Header){tmpHtml+='<div class="pict-modal-dropdown-header">'+this._escapeHTML(tmpItem.Header)+'</div>';continue;}let tmpCls='pict-modal-dropdown-item';if(tmpItem.Style){tmpCls+=' pict-modal-dropdown-item--'+tmpItem.Style;}if(tmpItem.Disabled){tmpCls+=' pict-modal-dropdown-item--disabled';}let tmpAttrs=''+' data-pict-modal-dropdown-item'+' data-index="'+i+'"'+' data-hash="'+this._escapeHTML(tmpItem.Hash||'')+'"'+' role="menuitem"'+' tabindex="-1"';if(tmpItem.Disabled){tmpAttrs+=' aria-disabled="true" data-disabled';}if(tmpItem.Tooltip){tmpAttrs+=' title="'+this._escapeHTML(tmpItem.Tooltip)+'"';}let tmpIcon=tmpItem.Icon?'<span class="pict-modal-dropdown-item-icon">'+tmpItem.Icon+'</span>':'';let tmpHint=tmpItem.Hint?'<span class="pict-modal-dropdown-item-hint">'+this._escapeHTML(tmpItem.Hint)+'</span>':'';tmpHtml+='<div class="'+tmpCls+'"'+tmpAttrs+'>'+tmpIcon+'<span class="pict-modal-dropdown-item-label">'+this._escapeHTML(tmpItem.Label||'')+'</span>'+tmpHint+'</div>';}tmpMenu.innerHTML=tmpHtml;return tmpMenu;}_positionMenu(pMenu,pAnchorRect,pOptions){// Apply min-width before measuring so the menu's natural size accounts
// for the constraint.
let tmpMinWidth=pOptions.minWidth||(pAnchorRect.width>=80?Math.ceil(pAnchorRect.width)+'px':'160px');pMenu.style.minWidth=tmpMinWidth;// Measure after attaching.
let tmpMenuRect=pMenu.getBoundingClientRect();let tmpVw=window.innerWidth||document.documentElement.clientWidth;let tmpVh=window.innerHeight||document.documentElement.clientHeight;let tmpGap=4;// breathing room between anchor and menu
// Vertical: prefer below; flip above when not enough room and there's
// more above. 'below'/'above' overrides force the side.
let tmpRoomBelow=tmpVh-pAnchorRect.bottom-tmpGap;let tmpRoomAbove=pAnchorRect.top-tmpGap;let tmpPlaceAbove;if(pOptions.position==='above'){tmpPlaceAbove=true;}else if(pOptions.position==='below'){tmpPlaceAbove=false;}else{tmpPlaceAbove=tmpMenuRect.height>tmpRoomBelow&&tmpRoomAbove>tmpRoomBelow;}// Cap height to whichever side we landed on so the menu can scroll
// internally instead of running off the screen.
let tmpCap=Math.max(80,(tmpPlaceAbove?tmpRoomAbove:tmpRoomBelow)-8);pMenu.style.maxHeight=tmpCap+'px';// Horizontal alignment to the anchor, then clamp inside the viewport.
let tmpLeft;if(pOptions.align==='right'){tmpLeft=pAnchorRect.right-tmpMenuRect.width;}else if(pOptions.align==='center'){tmpLeft=pAnchorRect.left+(pAnchorRect.width-tmpMenuRect.width)/2;}else{tmpLeft=pAnchorRect.left;}tmpLeft=Math.min(tmpLeft,tmpVw-tmpMenuRect.width-4);tmpLeft=Math.max(4,tmpLeft);let tmpTop;if(tmpPlaceAbove){tmpTop=Math.max(4,pAnchorRect.top-tmpMenuRect.height-tmpGap);pMenu.classList.add('pict-modal-dropdown--above');}else{tmpTop=pAnchorRect.bottom+tmpGap;pMenu.classList.remove('pict-modal-dropdown--above');}pMenu.style.left=Math.round(tmpLeft)+'px';pMenu.style.top=Math.round(tmpTop)+'px';}_focusFirstEnabled(pMenu){let tmpItems=pMenu.querySelectorAll('[data-pict-modal-dropdown-item]:not([data-disabled])');if(tmpItems.length){tmpItems[0].focus();}}_focusNeighbor(pMenu,pDirection){let tmpItems=Array.prototype.slice.call(pMenu.querySelectorAll('[data-pict-modal-dropdown-item]:not([data-disabled])'));if(!tmpItems.length){return;}let tmpActive=document.activeElement;let tmpIdx=tmpItems.indexOf(tmpActive);let tmpNext=tmpIdx===-1?pDirection>0?0:tmpItems.length-1:(tmpIdx+pDirection+tmpItems.length)%tmpItems.length;tmpItems[tmpNext].focus();}_escapeHTML(pText){if(typeof pText!=='string'){return'';}return pText.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}}module.exports=PictModalDropdown;},{}],56:[function(require,module,exports){/**
 * Pict-Modal-Overlay
 *
 * Manages a shared backdrop overlay element appended to document.body.
 * Reference-counted — created on first modal open, removed when last closes.
 */class PictModalOverlay{constructor(pModal){this._modal=pModal;this._element=null;this._refCount=0;}/**
	 * Show the overlay (incrementing reference count).
	 * Creates the DOM element on first call.
	 *
	 * @param {function} [fOnClick] - Optional click handler (e.g. dismiss topmost modal)
	 */show(fOnClick){this._refCount++;if(!this._element){this._element=document.createElement('div');this._element.className='pict-modal-overlay';document.body.appendChild(this._element);// Force reflow so the transition animates
void this._element.offsetHeight;this._element.classList.add('pict-modal-visible');}if(fOnClick){// Store the latest click handler (for the topmost modal)
this._currentClickHandler=fOnClick;this._element.onclick=pEvent=>{if(pEvent.target===this._element&&this._currentClickHandler){this._currentClickHandler();}};}}/**
	 * Update the overlay click handler (e.g. when topmost modal changes).
	 *
	 * @param {function} [fOnClick] - New click handler
	 */updateClickHandler(fOnClick){this._currentClickHandler=fOnClick||null;}/**
	 * Hide the overlay (decrementing reference count).
	 * Removes the DOM element when reference count reaches zero.
	 */hide(){this._refCount--;if(this._refCount<=0){this._refCount=0;if(this._element){this._element.classList.remove('pict-modal-visible');let tmpElement=this._element;// Remove after transition
setTimeout(()=>{if(tmpElement.parentNode){tmpElement.parentNode.removeChild(tmpElement);}},220);this._element=null;this._currentClickHandler=null;}}}/**
	 * Force-remove the overlay regardless of reference count.
	 */destroy(){this._refCount=0;if(this._element&&this._element.parentNode){this._element.parentNode.removeChild(this._element);}this._element=null;this._currentClickHandler=null;}}module.exports=PictModalOverlay;},{}],57:[function(require,module,exports){/**
 * Pict-Modal-Panel
 *
 * Adds resizable and collapsible panel behavior to any DOM element.
 * Follows the handler composition pattern used by the other modal
 * handlers (confirm, window, toast, tooltip).
 *
 * Usage:
 *   let handle = modal.panel('#my-panel', { position: 'right', width: 340 });
 *   handle.toggle();
 *   handle.destroy();
 */class PictModalPanel{constructor(pModal){this._modal=pModal;this._panels=[];}/**
	 * Attach resizable/collapsible panel behavior to an element.
	 *
	 * @param {string} pTargetSelector - CSS selector for the panel element
	 * @param {object} [pOptions] - Panel options
	 * @returns {{ collapse, expand, toggle, setWidth, destroy }} Panel handle
	 */create(pTargetSelector,pOptions){let tmpDefaults=this._modal&&this._modal.options&&this._modal.options.DefaultPanelOptions||{};let tmpOptions=Object.assign({},{position:'right',width:340,minWidth:200,maxWidth:600,collapsible:true,collapsed:false,persist:false,persistKey:'',onResize:null,onToggle:null},tmpDefaults,pOptions);if(typeof document==='undefined')return this._nullHandle();let tmpTarget=document.querySelector(pTargetSelector);if(!tmpTarget)return this._nullHandle();let tmpId=this._modal._nextId();let tmpIsRight=tmpOptions.position==='right';let tmpIsCollapsed=false;let tmpCurrentWidth=tmpOptions.width;let tmpDestroyed=false;// Restore persisted state
if(tmpOptions.persist&&tmpOptions.persistKey){try{let tmpStored=localStorage.getItem('pict-panel-'+tmpOptions.persistKey);if(tmpStored){let tmpParsed=JSON.parse(tmpStored);if(typeof tmpParsed.width==='number')tmpCurrentWidth=tmpParsed.width;if(typeof tmpParsed.collapsed==='boolean')tmpOptions.collapsed=tmpParsed.collapsed;}}catch(e){/* ignore */}}// Apply classes and initial width
tmpTarget.classList.add('pict-panel');tmpTarget.classList.add(tmpIsRight?'pict-panel-right':'pict-panel-left');tmpTarget.style.width=tmpCurrentWidth+'px';// Remove display:none if present — panel uses width collapse instead
if(tmpTarget.style.display==='none'){tmpTarget.style.display='';}// ── Create the edge container ───────────────────────
let tmpEdge=document.createElement('div');tmpEdge.className='pict-panel-edge '+(tmpIsRight?'pict-panel-edge-right':'pict-panel-edge-left');// Resize handle
let tmpResize=document.createElement('div');tmpResize.className='pict-panel-resize';tmpEdge.appendChild(tmpResize);// Collapse tab (chevron SVG)
let tmpTab=null;if(tmpOptions.collapsible){tmpTab=document.createElement('div');tmpTab.className='pict-panel-tab';tmpTab.title='Toggle panel';tmpEdge.appendChild(tmpTab);}// Insert edge as a sibling so it is not clipped by the
// panel's own overflow (e.g. overflow-y: auto for scrolling).
// Right panels: edge goes BEFORE the panel (left side).
// Left panels: edge goes AFTER the panel (right side).
if(tmpTarget.parentNode){if(tmpIsRight){tmpTarget.parentNode.insertBefore(tmpEdge,tmpTarget);}else{tmpTarget.parentNode.insertBefore(tmpEdge,tmpTarget.nextSibling);}}else{tmpTarget.insertBefore(tmpEdge,tmpTarget.firstChild);}// ── Chevron lookup via pict.providers.Icon ──────────
// Both directions come from the core registry (`{~I:ChevronLeft~}`
// / `{~I:ChevronRight~}`).  Resolved per-render so a theme that
// re-registers the chevron variant picks up automatically.  Empty
// fallback in the unlikely case pict is missing the Icon provider
// (very old pict versions; current minimum is 1.0.368).
let tmpPictHandle=typeof window!=='undefined'&&window.pict?window.pict:null;let tmpIcon=pName=>tmpPictHandle&&typeof tmpPictHandle.icon==='function'?tmpPictHandle.icon(pName):'';let tmpUpdateChevron=()=>{if(!tmpTab)return;let tmpChevronRight=tmpIcon('ChevronRight');let tmpChevronLeft=tmpIcon('ChevronLeft');if(tmpIsRight){tmpTab.innerHTML=tmpIsCollapsed?tmpChevronLeft:tmpChevronRight;}else{tmpTab.innerHTML=tmpIsCollapsed?tmpChevronRight:tmpChevronLeft;}};// ── Persist helper ──────────────────────────────────
let tmpPersist=()=>{if(!tmpOptions.persist||!tmpOptions.persistKey)return;try{localStorage.setItem('pict-panel-'+tmpOptions.persistKey,JSON.stringify({width:tmpCurrentWidth,collapsed:tmpIsCollapsed}));}catch(e){/* ignore */}};// ── Collapse / expand ───────────────────────────────
let tmpCollapse=()=>{if(tmpIsCollapsed||tmpDestroyed)return;tmpIsCollapsed=true;tmpTarget.classList.add('pict-panel-collapsed');tmpEdge.classList.add('pict-panel-edge-collapsed');tmpUpdateChevron();tmpPersist();if(typeof tmpOptions.onToggle==='function')tmpOptions.onToggle(true);};let tmpExpand=()=>{if(!tmpIsCollapsed||tmpDestroyed)return;tmpIsCollapsed=false;tmpEdge.classList.remove('pict-panel-edge-collapsed');tmpTarget.classList.remove('pict-panel-collapsed');tmpTarget.style.width=tmpCurrentWidth+'px';tmpUpdateChevron();tmpPersist();if(typeof tmpOptions.onToggle==='function')tmpOptions.onToggle(false);};let tmpToggle=()=>{if(tmpIsCollapsed)tmpExpand();else tmpCollapse();};let tmpSetWidth=pWidth=>{if(tmpDestroyed)return;let tmpWidth=Math.max(tmpOptions.minWidth,Math.min(tmpOptions.maxWidth,pWidth));tmpCurrentWidth=tmpWidth;if(!tmpIsCollapsed){tmpTarget.style.width=tmpWidth+'px';}tmpPersist();if(typeof tmpOptions.onResize==='function')tmpOptions.onResize(tmpWidth);};// ── Tab click ───────────────────────────────────────
if(tmpTab){tmpTab.addEventListener('click',pEvent=>{pEvent.stopPropagation();tmpToggle();});}// ── Resize drag ─────────────────────────────────────
let tmpOnMouseDown=pEvent=>{if(tmpIsCollapsed)return;pEvent.preventDefault();let tmpStartX=pEvent.clientX;let tmpStartWidth=tmpTarget.offsetWidth;tmpResize.classList.add('dragging');tmpTarget.style.transition='none';document.body.style.userSelect='none';document.body.style.cursor='col-resize';let tmpOnMouseMove=pMoveEvent=>{let tmpDelta=tmpIsRight?tmpStartX-pMoveEvent.clientX:pMoveEvent.clientX-tmpStartX;let tmpNewWidth=Math.max(tmpOptions.minWidth,Math.min(tmpOptions.maxWidth,tmpStartWidth+tmpDelta));tmpTarget.style.width=tmpNewWidth+'px';};let tmpOnMouseUp=pUpEvent=>{document.removeEventListener('mousemove',tmpOnMouseMove);document.removeEventListener('mouseup',tmpOnMouseUp);tmpResize.classList.remove('dragging');tmpTarget.style.transition='';document.body.style.userSelect='';document.body.style.cursor='';// Capture the final width
tmpCurrentWidth=tmpTarget.offsetWidth;tmpPersist();if(typeof tmpOptions.onResize==='function')tmpOptions.onResize(tmpCurrentWidth);};document.addEventListener('mousemove',tmpOnMouseMove);document.addEventListener('mouseup',tmpOnMouseUp);};tmpResize.addEventListener('mousedown',tmpOnMouseDown);// ── Initial state ───────────────────────────────────
tmpUpdateChevron();if(tmpOptions.collapsed){tmpIsCollapsed=true;tmpTarget.classList.add('pict-panel-collapsed');tmpEdge.classList.add('pict-panel-edge-collapsed');tmpUpdateChevron();}// ── Destroy ─────────────────────────────────────────
let tmpDestroy=()=>{if(tmpDestroyed)return;tmpDestroyed=true;tmpResize.removeEventListener('mousedown',tmpOnMouseDown);if(tmpEdge.parentNode)tmpEdge.remove();tmpTarget.classList.remove('pict-panel','pict-panel-right','pict-panel-left','pict-panel-collapsed');tmpTarget.style.width='';tmpTarget.style.transition='';let tmpIdx=this._panels.indexOf(tmpHandle);if(tmpIdx>=0)this._panels.splice(tmpIdx,1);};// ── Return handle ───────────────────────────────────
let tmpHandle={id:tmpId,collapse:tmpCollapse,expand:tmpExpand,toggle:tmpToggle,setWidth:tmpSetWidth,destroy:tmpDestroy};this._panels.push(tmpHandle);return tmpHandle;}/**
	 * Return a no-op handle for server-side or missing-element cases.
	 */_nullHandle(){return{id:0,collapse:()=>{},expand:()=>{},toggle:()=>{},setWidth:()=>{},destroy:()=>{}};}/**
	 * Destroy all active panels.
	 */destroyAll(){let tmpPanels=this._panels.slice();for(let i=0;i<tmpPanels.length;i++){tmpPanels[i].destroy();}}}module.exports=PictModalPanel;},{}],58:[function(require,module,exports){/**
 * Pict-Modal-Shell — viewport-managing layout system for top / right /
 * bottom / left panels around a center.
 *
 * # What this is for
 *
 * Most apps grow a chrome of stacked bars: a topbar, sometimes a
 * sub-nav, sometimes a bottom status bar, often a left sidebar, maybe
 * a right inspector. Each one has its own collapse / resize / persist
 * concerns, and apps end up reinventing the layout glue + the chrome
 * controls per-app.
 *
 * The Shell solves this once. The host calls `modal.shell(viewport)`,
 * adds panels in the order they should stack from each edge, and the
 * Shell manages:
 *
 *   - DOM structure (a flex tree wrapping the viewport)
 *   - Layout placement (multiple panels per side, each in registration order)
 *   - Collapse / expand chrome (a thin tab strip when collapsed)
 *   - Resize chrome (drag handle on the inner edge)
 *   - Pinned (in-flow) vs overlay (absolutely-positioned) panels
 *   - Persistence (per-panel collapsed + size, scoped by host or custom key)
 *   - Center destination (the workspace area between all panels)
 *
 * # Usage
 *
 *   let tmpShell = modal.shell('#App-Container', { PersistenceKey: 'my-app' });
 *
 *   tmpShell.addPanel({
 *       Hash: 'topbar', Side: 'top', Mode: 'fixed', Size: 60,
 *       ContentDestinationId: 'App-TopBar'
 *   });
 *   tmpShell.addPanel({
 *       Hash: 'statusbar', Side: 'bottom', Mode: 'fixed', Size: 28,
 *       ContentDestinationId: 'App-StatusBar'
 *   });
 *   tmpShell.addPanel({
 *       Hash: 'sidebar', Side: 'left', Mode: 'resizable', Size: 280,
 *       MinSize: 180, MaxSize: 480, Title: 'Modules',
 *       ContentDestinationId: 'App-Sidebar'
 *   });
 *
 *   let tmpCenter = tmpShell.center({ ContentDestinationId: 'App-Workspace' });
 *
 *   // Render into the destinations the same way as any other Pict view.
 *   pict.ContentAssignment.assignContent('#App-Sidebar', tmpHTML);
 *
 * # Panel options
 *
 *   Hash:                 unique id within the shell (auto-generated if omitted).
 *                         Used as the localStorage key suffix and for getPanel().
 *   Side:                 'top' | 'right' | 'bottom' | 'left'.
 *   Mode:                 'fixed' (no chrome), 'collapsible' (collapse tab),
 *                         'resizable' (collapse tab + drag handle).
 *   Position:             'pinned' (default; takes layout space) or 'overlay'
 *                         (absolutely positioned over the center / siblings).
 *   Scope:                'shell' (default) | 'center'.
 *                         When 'shell', the panel mounts in one of the
 *                         outer rows / side stacks (Side decides which).
 *                         When 'center', the panel mounts INSIDE the
 *                         center column instead — useful for bars that
 *                         should align with the content area only, not
 *                         span across the sidebars.  Only Side='top' and
 *                         Side='bottom' are supported with Scope='center'.
 *                         The center auto-switches to a flex-column
 *                         layout so the content destination + inner
 *                         panels stack vertically.
 *   Size:                 initial px (height for top/bottom, width for left/right).
 *                         Default: 200 for sides, 60 for top/bottom.
 *   MinSize, MaxSize:     drag clamp for resizable panels.
 *   Collapsed:            initial state. Persisted state overrides this.
 *   CollapsedSize:        px the panel becomes when collapsed (default 24).
 *   Title:                shown in the collapse tab.
 *   Icon:                 optional inline SVG / HTML for the collapse tab.
 *   ContentDestinationId: id given to the inner content div so the host can
 *                         reach it via #ContentDestinationId selectors.
 *   ContentView:          ViewIdentifier (string) of a registered Pict view
 *                         that owns this panel's content. When set, the
 *                         shell auto-renders the view once at panel creation
 *                         (so the destination is filled before the user
 *                         opens the panel) AND again on every expand
 *                         transition (so freshly-streamed state shows up).
 *                         Centralises the "I created a panel — now I have
 *                         to remember to render the view into it" boilerplate.
 *   Persist:              default true; pass false to skip save/load for this
 *                         panel even when the shell has persistence enabled.
 *   Hidden:               default false. When true, the collapsed state has
 *                         NO visible chrome — no collapse tab, no edge
 *                         affordance, the panel root is display: none. The
 *                         only way to reveal it is a programmatic
 *                         expand()/toggle() from elsewhere (e.g. a topbar
 *                         gear). Mode still controls the EXPANDED chrome —
 *                         pass Mode: 'resizable' to keep the drag handle
 *                         while open, then vanish on collapse.
 *   OnExpand, OnCollapse: callbacks that fire ONLY on transitions
 *                         (collapsed→expanded or expanded→collapsed).
 *                         Cleaner than OnToggle which fires for both
 *                         directions and forces callers to inspect the
 *                         bool. OnToggle is kept for back-compat.
 *
 * # Persistence
 *
 *   Storage key:  'pict-modal-shell:' + <PersistenceKey or hostname or 'default'>
 *   Value shape:  { Version: 1, Panels: { <hash>: { Collapsed: bool, Size: number } } }
 */const STORAGE_PREFIX='pict-modal-shell:';const SCHEMA_VERSION=1;const DEFAULT_COLLAPSED_SIZE=24;const DEFAULT_SIZE_SIDE=240;const DEFAULT_SIZE_TOPBOTTOM=60;class PictModalShell{constructor(pModalSection,pViewportEl,pOptions){// Pointer events fire at the device's input rate (often 240 Hz+ on
// modern trackpads / mice) but we only paint at the display's refresh
// rate (60–120 Hz). Coalesce multiple pointermoves per frame into a
// single setSize() call via requestAnimationFrame — this drops the
// per-frame work to one DOM mutation regardless of pointer rate.
_defineProperty(this,"_onDragMove",pEvent=>{if(!this._activeDrag)return;let tmpD=this._activeDrag;let tmpCoord=tmpD.Axis==='x'?pEvent.clientX:pEvent.clientY;let tmpDelta=(tmpCoord-tmpD.StartCoord)*tmpD.Direction;tmpD.PendingSize=tmpD.StartSize+tmpDelta;if(!tmpD.RAFId){let tmpSelf=this;tmpD.RAFId=typeof window!=='undefined'&&window.requestAnimationFrame?window.requestAnimationFrame(function(){tmpSelf._flushDrag();}):setTimeout(function(){tmpSelf._flushDrag();},16);}});_defineProperty(this,"_onDragEnd",()=>{if(!this._activeDrag)return;let tmpD=this._activeDrag;// Flush any pending pointermove that hadn't painted yet so the
// final size matches the actual cursor position, not the last
// rAF-aligned value.
if(tmpD.PendingSize!==null){this._flushDrag();}if(tmpD.RAFId&&typeof window!=='undefined'&&window.cancelAnimationFrame){window.cancelAnimationFrame(tmpD.RAFId);}document.body.classList.remove('pict-modal-shell-dragging-x');document.body.classList.remove('pict-modal-shell-dragging-y');tmpD.Panel.El.classList.remove('pict-modal-shell-panel-resizing');document.removeEventListener('pointermove',this._onDragMove);document.removeEventListener('pointerup',this._onDragEnd);// Persist final size.
tmpD.Panel._persist();this._activeDrag=null;});this._modal=pModalSection;this._viewport=pViewportEl;this._options=pOptions||{};this._panels=[];this._panelsByHash={};this._centerDestinationEl=null;this._idCounter=0;this._activeDrag=null;this._persistenceEnabled=this._options.Persistence!==false;this._persistenceKey=this._persistenceEnabled?this._resolvePersistenceKey(this._options.PersistenceKey):null;// Build the wrapper DOM inside the viewport.
this._buildSkeleton();}// ────────────────────────────────────────────────────────────────
//  Public API
// ────────────────────────────────────────────────────────────────
addPanel(pConfig){let tmpPanel=new ShellPanel(this,pConfig||{});this._panels.push(tmpPanel);this._panelsByHash[tmpPanel.Hash]=tmpPanel;this._mountPanel(tmpPanel);// Render the bound ContentView once now so the destination has
// content even before the user opens the panel. This is the
// "create" half of the unified create-and-popup pattern — hosts
// no longer need to chase down each panel and call view.render()
// manually after addPanel().
tmpPanel._renderContentView();return tmpPanel;}getPanel(pHash){return this._panelsByHash[pHash]||null;}getPanels(){return this._panels.slice();}/**
	 * Convenience for cross-view popup triggers. Equivalent to
	 * `shell.getPanel(hash).popup()`. Silently no-ops when the hash
	 * doesn't match a registered panel (so callers don't have to
	 * null-check during boot races).
	 */openPanel(pHash){let tmpPanel=this._panelsByHash[pHash];if(tmpPanel){tmpPanel.popup();}return tmpPanel||null;}/**
	 * Configure the center area. Optional; if never called, the center
	 * still exists but has no host-supplied destination id (host can
	 * still reach it via .pict-modal-shell-center).
	 */center(pOptions){pOptions=pOptions||{};if(pOptions.ContentDestinationId){// Remove any previously-created destination so center() is
// idempotent across reconfigurations.  We don't blow away
// the whole center via innerHTML='' anymore: Scope:'center'
// panels mounted by earlier addPanel() calls need to stay
// in place.  Find the right insertion point so the
// destination sits between any top-scoped panels and any
// bottom-scoped panels.
if(this._centerDestinationEl&&this._centerDestinationEl.parentNode===this._centerEl){this._centerEl.removeChild(this._centerDestinationEl);}let tmpInner=document.createElement('div');tmpInner.id=pOptions.ContentDestinationId;tmpInner.className='pict-modal-shell-center-content';let tmpFirstBottomScoped=null;let tmpChildren=this._centerEl.children;for(let i=0;i<tmpChildren.length;i++){let tmpCandidate=tmpChildren[i];if(tmpCandidate.classList&&tmpCandidate.classList.contains('pict-modal-shell-panel-bottom')){tmpFirstBottomScoped=tmpCandidate;break;}}if(tmpFirstBottomScoped){this._centerEl.insertBefore(tmpInner,tmpFirstBottomScoped);}else{this._centerEl.appendChild(tmpInner);}this._centerDestinationEl=tmpInner;}return this._centerEl;}getCenterEl(){return this._centerEl;}destroy(){for(let i=0;i<this._panels.length;i++){this._panels[i].destroy(true);}this._panels=[];this._panelsByHash={};if(this._wrapperEl&&this._wrapperEl.parentNode){this._wrapperEl.parentNode.removeChild(this._wrapperEl);}this._detachDragHandlers();}// ────────────────────────────────────────────────────────────────
//  Persistence
// ────────────────────────────────────────────────────────────────
_resolvePersistenceKey(pUserKey){if(typeof pUserKey==='string'&&pUserKey.length>0)return STORAGE_PREFIX+pUserKey;try{if(typeof window!=='undefined'&&window.location&&window.location.hostname){return STORAGE_PREFIX+window.location.hostname;}}catch(pErr){/* fall through */}return STORAGE_PREFIX+'default';}_loadState(){if(!this._persistenceKey)return null;try{let tmpStore=typeof window!=='undefined'?window.localStorage:null;if(!tmpStore)return null;let tmpRaw=tmpStore.getItem(this._persistenceKey);if(!tmpRaw)return null;let tmpParsed=JSON.parse(tmpRaw);if(!tmpParsed||tmpParsed.Version!==SCHEMA_VERSION)return null;return tmpParsed.Panels&&typeof tmpParsed.Panels==='object'?tmpParsed.Panels:{};}catch(pErr){return null;}}_loadPanelState(pHash){let tmpAll=this._loadState();if(!tmpAll)return null;return tmpAll[pHash]||null;}_savePanelState(pHash,pState){if(!this._persistenceKey)return;try{let tmpStore=typeof window!=='undefined'?window.localStorage:null;if(!tmpStore)return;let tmpAll=this._loadState()||{};tmpAll[pHash]=pState;tmpStore.setItem(this._persistenceKey,JSON.stringify({Version:SCHEMA_VERSION,Panels:tmpAll,SavedAt:new Date().toISOString()}));}catch(pErr){/* swallow */}}// ────────────────────────────────────────────────────────────────
//  DOM scaffolding
// ────────────────────────────────────────────────────────────────
_buildSkeleton(){// Wipe whatever was inside the viewport — the host opted into
// the shell taking ownership of layout.
this._viewport.innerHTML='';this._viewport.classList.add('pict-modal-shell-host');this._wrapperEl=document.createElement('div');this._wrapperEl.className='pict-modal-shell';this._topRow=document.createElement('div');this._topRow.className='pict-modal-shell-row pict-modal-shell-row-top';this._wrapperEl.appendChild(this._topRow);this._middleRow=document.createElement('div');this._middleRow.className='pict-modal-shell-row pict-modal-shell-row-middle';this._wrapperEl.appendChild(this._middleRow);this._leftStack=document.createElement('div');this._leftStack.className='pict-modal-shell-side pict-modal-shell-side-left';this._middleRow.appendChild(this._leftStack);this._centerEl=document.createElement('div');this._centerEl.className='pict-modal-shell-center';this._middleRow.appendChild(this._centerEl);this._rightStack=document.createElement('div');this._rightStack.className='pict-modal-shell-side pict-modal-shell-side-right';this._middleRow.appendChild(this._rightStack);this._bottomRow=document.createElement('div');this._bottomRow.className='pict-modal-shell-row pict-modal-shell-row-bottom';this._wrapperEl.appendChild(this._bottomRow);// Overlay layer for overlay-position panels (absolute over middle row)
this._overlayLayer=document.createElement('div');this._overlayLayer.className='pict-modal-shell-overlay-layer';this._middleRow.appendChild(this._overlayLayer);this._viewport.appendChild(this._wrapperEl);}_mountPanel(pPanel){if(pPanel.Position==='overlay'){this._overlayLayer.appendChild(pPanel.El);return;}if(pPanel.Scope==='center'){// Center-scoped panels mount inside the center column.
// The column switches to flex-column so the content
// destination + the panel(s) stack vertically.
this._centerEl.classList.add('pict-modal-shell-center-with-inner-panel');if(pPanel.Side==='top'){// Top-scoped panels go above the content destination.
// If center() hasn't run yet, this still works — we
// insert before whatever's first (or just append to an
// empty center, which leaves us above any subsequent
// content destination).
this._centerEl.insertBefore(pPanel.El,this._centerEl.firstChild);}else{// Side === 'bottom' (the Scope guard already filtered
// left/right).  Append to the bottom of the center.
this._centerEl.appendChild(pPanel.El);}return;}let tmpHost;if(pPanel.Side==='top')tmpHost=this._topRow;else if(pPanel.Side==='bottom')tmpHost=this._bottomRow;else if(pPanel.Side==='left')tmpHost=this._leftStack;else if(pPanel.Side==='right')tmpHost=this._rightStack;else tmpHost=this._wrapperEl;tmpHost.appendChild(pPanel.El);}// ────────────────────────────────────────────────────────────────
//  Drag (resize) machinery — shared across all resizable panels.
// ────────────────────────────────────────────────────────────────
_attachDragStart(pPanel,pEvent){pEvent.preventDefault();let tmpAxis=pPanel.Side==='top'||pPanel.Side==='bottom'?'y':'x';this._activeDrag={Panel:pPanel,Axis:tmpAxis,StartCoord:tmpAxis==='x'?pEvent.clientX:pEvent.clientY,StartSize:pPanel.Size,Direction:pPanel.Side==='left'||pPanel.Side==='top'?1:-1,PendingSize:null,RAFId:0};document.body.classList.add(tmpAxis==='x'?'pict-modal-shell-dragging-x':'pict-modal-shell-dragging-y');// Suppress the panel's collapse/expand width/height transition for
// the duration of the drag — without this, every pointermove kicks
// off a fresh 140ms transition that stacks up and renders the
// resize as visibly laggy ("choppy"). With the transition off the
// panel snaps to each new size in the same frame as the pointer.
pPanel.El.classList.add('pict-modal-shell-panel-resizing');// Capture the pointer so dragging works even when the cursor leaves
// the resize handle (otherwise the user has to keep the cursor
// exactly on the 6 px strip — feels twitchy).
try{pEvent.target.setPointerCapture&&pEvent.target.setPointerCapture(pEvent.pointerId);}catch(pErr){/* not supported in old browsers — fine */}document.addEventListener('pointermove',this._onDragMove);document.addEventListener('pointerup',this._onDragEnd);}_flushDrag(){let tmpD=this._activeDrag;if(!tmpD)return;tmpD.RAFId=0;if(tmpD.PendingSize!==null){tmpD.Panel.setSize(tmpD.PendingSize);tmpD.PendingSize=null;}}_detachDragHandlers(){document.removeEventListener('pointermove',this._onDragMove);document.removeEventListener('pointerup',this._onDragEnd);}}// ════════════════════════════════════════════════════════════════════
//  ShellPanel — one panel within a Shell
// ════════════════════════════════════════════════════════════════════
class ShellPanel{constructor(pShell,pConfig){this._shell=pShell;this._config=pConfig;this.Hash=pConfig.Hash||'panel-'+ ++pShell._idCounter;this.Side=pConfig.Side==='right'||pConfig.Side==='bottom'||pConfig.Side==='left'?pConfig.Side:'top';this.Mode=pConfig.Mode==='collapsible'||pConfig.Mode==='resizable'?pConfig.Mode:'fixed';this.Position=pConfig.Position==='overlay'?'overlay':'pinned';// Scope: 'center' opts the panel into the center column instead
// of the shell's outer rows.  Only valid for Side='top'/'bottom'
// (left/right inside center would need a separate axis we don't
// support).  Invalid combinations silently fall back to 'shell'.
this.Scope=pConfig.Scope==='center'&&(this.Side==='top'||this.Side==='bottom')?'center':'shell';this.Title=pConfig.Title||'';this.Icon=pConfig.Icon||'';this.MinSize=typeof pConfig.MinSize==='number'?pConfig.MinSize:40;this.MaxSize=typeof pConfig.MaxSize==='number'?pConfig.MaxSize:1200;// `Hidden: true` is a panel that has NO visible chrome in its collapsed
// state — no collapse tab sliver, no resize handle, no edge marker, and
// (via CSS) display: none on the panel root. The only way to reveal it
// is a programmatic expand()/toggle() called from elsewhere in the app
// (e.g. a gear button in the topbar). Useful when the host wants a
// fully-shaped panel but doesn't want an always-visible affordance for
// discovering it. The Mode is still honoured for the EXPANDED state —
// pass Mode: 'resizable' to keep the drag handle while the panel is
// open, while still vanishing entirely when collapsed.
this.Hidden=!!pConfig.Hidden;this.CollapsedSize=typeof pConfig.CollapsedSize==='number'?pConfig.CollapsedSize:this.Hidden?0:DEFAULT_COLLAPSED_SIZE;this.PersistEnabled=pShell._persistenceEnabled&&pConfig.Persist!==false;let tmpDefaultSize=this.Side==='left'||this.Side==='right'?DEFAULT_SIZE_SIDE:DEFAULT_SIZE_TOPBOTTOM;this.Size=typeof pConfig.Size==='number'?pConfig.Size:tmpDefaultSize;this.Collapsed=!!pConfig.Collapsed;// Persisted state overrides initial Size/Collapsed.
if(this.PersistEnabled){let tmpSaved=pShell._loadPanelState(this.Hash);if(tmpSaved){if(typeof tmpSaved.Size==='number')this.Size=tmpSaved.Size;if(typeof tmpSaved.Collapsed==='boolean')this.Collapsed=tmpSaved.Collapsed;}}this._clampSize();// Build the panel DOM.
this._buildEl(pConfig);this._applySize();this._applyCollapsedClass();// Responsive drawer — at narrow viewports, flip a docked side
// panel into a "top drawer" by adding a class to the middle row
// that toggles flex-direction from row to column. The panel
// stretches to full width and trades its inline `width` for a
// configurable drawer `height`. The user's collapse/expand
// keeps working: collapsed in drawer mode just gives the panel
// height: 0 (so only the collapse tab remains visible at the
// top of the content), expanded restores the drawer height.
// Pass `0` or omit to disable. Mirrors retold-remote's
// `.content-editor-body { flex-direction: column }` pattern.
this.ResponsiveDrawer=typeof pConfig.ResponsiveDrawer==='number'&&pConfig.ResponsiveDrawer>0?pConfig.ResponsiveDrawer:0;// Drawer height — applied as `height` to the panel in drawer
// mode. CSS units (px / vh / %) accepted. Default 33vh which
// gives the panel roughly a third of the viewport height and
// leaves comfortable room for the workspace below.
this.DrawerHeight=typeof pConfig.DrawerHeight==='string'&&pConfig.DrawerHeight?pConfig.DrawerHeight:'33vh';this._mediaQuery=null;this._mediaQueryHandler=null;if(this.ResponsiveDrawer>0){this._wireResponsiveDrawer();}}// ───────────── public ─────────────
getContentEl(){return this._contentEl;}/**
	 * Returns the currently-bound ContentView Pict view instance, or
	 * null if no ContentView is configured / the view isn't registered
	 * yet.
	 */getContentView(){if(!this._config.ContentView)return null;let tmpPict=this._shell._modal&&this._shell._modal.pict;if(!tmpPict||!tmpPict.views)return null;return tmpPict.views[this._config.ContentView]||null;}collapse(){this._setCollapsed(true);}expand(){this._setCollapsed(false);}toggle(){this._setCollapsed(!this.Collapsed);}/**
	 * Unified "show this panel" affordance — this is the shared
	 * codepath every popup trigger should funnel through. Behavior:
	 *
	 *   - If collapsed → expand (which fires OnExpand + re-renders the
	 *     ContentView via the shared transition machinery).
	 *   - If already open → re-render the ContentView (so any newly-
	 *     streamed state is visible) AND briefly flash the panel
	 *     border so the user notices that the existing panel just
	 *     received attention. Avoids the "I clicked a button but
	 *     nothing happened" feeling when the panel was already open.
	 *
	 * Idempotent — safe to call from any number of triggers without
	 * stacking effects.
	 */popup(){if(this.Collapsed){this._setCollapsed(false);}else{// Already open — refresh content + flash for attention.
this._renderContentView();this._flash();}}setSize(pSize){if(typeof pSize!=='number'||!isFinite(pSize))return;this.Size=pSize;this._clampSize();this._applySize();}destroy(pSkipFromShell){this._unwireResponsiveDrawer();if(this.El&&this.El.parentNode)this.El.parentNode.removeChild(this.El);if(!pSkipFromShell){let tmpIdx=this._shell._panels.indexOf(this);if(tmpIdx>=0)this._shell._panels.splice(tmpIdx,1);delete this._shell._panelsByHash[this.Hash];}}// ───────────── internals ─────────────
_clampSize(){if(this.Size<this.MinSize)this.Size=this.MinSize;if(this.Size>this.MaxSize)this.Size=this.MaxSize;}// Responsive drawer — sets up a matchMedia listener for
// `(max-width: <ResponsiveDrawer>px)`. Each crossing flips the
// shell's middle row between row layout (wide) and column layout
// (narrow) by toggling the `pict-modal-shell-drawer-active` class
// on the middle row. The matching CSS makes side panels expand to
// full width with a fixed `DrawerHeight`, becoming top/bottom
// drawers above/below the workspace center. Collapsed in drawer
// mode collapses to height: 0, leaving only the collapse tab.
//
// This pattern is the conventional "responsive sidebar" approach
// (used by retold-remote's content editor) — the user keeps their
// sidebar accessible at narrow widths but it gives the workspace
// room to breathe.
_wireResponsiveDrawer(){if(typeof window==='undefined'||!window.matchMedia)return;this._mediaQuery=window.matchMedia('(max-width: '+this.ResponsiveDrawer+'px)');// Apply the drawer height as a CSS variable on the panel
// element so the static CSS rules can read it. Doing this once
// here avoids per-event JS style writes.
if(this.El){this.El.style.setProperty('--pict-modal-drawer-height',this.DrawerHeight);}let tmpSelf=this;this._mediaQueryHandler=function(pEvent){let tmpNarrow=pEvent&&typeof pEvent.matches==='boolean'?pEvent.matches:tmpSelf._mediaQuery.matches;tmpSelf._setDrawerMode(tmpNarrow);};// Apply the current state immediately (handles the case where the
// page loads already-narrow). Newer browsers use addEventListener;
// older ones use addListener.
if(this._mediaQuery.addEventListener){this._mediaQuery.addEventListener('change',this._mediaQueryHandler);}else if(this._mediaQuery.addListener){this._mediaQuery.addListener(this._mediaQueryHandler);}this._mediaQueryHandler({matches:this._mediaQuery.matches});// Belt + suspenders: also listen to window resize and re-sync.
// `matchMedia.change` is supposed to be reliable on every
// boundary crossing, but in real-world testing (esp. when the
// user is dragging DevTools to resize the inner viewport, or
// going through fast successive crossings) we've seen the
// change event silently miss. A plain resize listener is
// cheap and the handler is idempotent — if matches state
// hasn't actually changed the body of `_setDrawerMode` is a
// no-op (it short-circuits when classes are already correct).
this._resizeHandler=function(){tmpSelf._setDrawerMode(tmpSelf._mediaQuery.matches);};window.addEventListener('resize',this._resizeHandler);}_unwireResponsiveDrawer(){if(this._resizeHandler&&typeof window!=='undefined'){window.removeEventListener('resize',this._resizeHandler);this._resizeHandler=null;}if(!this._mediaQuery||!this._mediaQueryHandler)return;if(this._mediaQuery.removeEventListener){this._mediaQuery.removeEventListener('change',this._mediaQueryHandler);}else if(this._mediaQuery.removeListener){this._mediaQuery.removeListener(this._mediaQueryHandler);}this._mediaQuery=null;this._mediaQueryHandler=null;}// Toggle drawer mode by adding / removing a class on the shell's
// middle row. The CSS rule for `.pict-modal-shell-drawer-active`
// flips flex-direction column, makes side panels full-width, and
// applies the panel's `--pict-modal-drawer-height` for sizing.
// Also tags the panel itself so per-panel CSS can target it.
// Re-applies the inline size at the end so the wide-mode crossing
// gets a clean width back (drawer mode forced width: 100% via CSS
// !important; the inline style was stale).
_setDrawerMode(pDrawer){if(!this._shell||!this._shell._middleRow)return;// Idempotent — short-circuit when the panel's drawer state
// already matches the target. Keeps the resize-event fallback
// (which fires constantly during drag-resize) from doing
// pointless DOM thrash + style re-application every frame.
let tmpCurrentlyDrawer=!!(this.El&&this.El.classList.contains('pict-modal-shell-panel-drawer'));if(tmpCurrentlyDrawer===!!pDrawer)return;if(pDrawer){this._shell._middleRow.classList.add('pict-modal-shell-drawer-active');if(this.El){this.El.classList.add('pict-modal-shell-panel-drawer');}}else{// Only remove the row-level class if NO other panel still
// wants drawer mode. Multi-panel hosts can safely each opt
// in independently this way.
let tmpStillNarrow=false;let tmpPanels=this._shell._panels||[];for(let i=0;i<tmpPanels.length;i++){let tmpP=tmpPanels[i];if(tmpP!==this&&tmpP._mediaQuery&&tmpP._mediaQuery.matches&&tmpP.ResponsiveDrawer>0){tmpStillNarrow=true;break;}}if(!tmpStillNarrow){this._shell._middleRow.classList.remove('pict-modal-shell-drawer-active');}if(this.El){this.El.classList.remove('pict-modal-shell-panel-drawer');}}// Re-apply inline size. In drawer mode the CSS !important
// rule overrides this anyway, but on the wide crossing we
// need the inline width to be correct so the panel shows up
// at its proper docked / collapsed-docked size rather than
// inheriting any stale state.
this._applySize();}_buildEl(pConfig){let tmpRoot=document.createElement('div');tmpRoot.className='pict-modal-shell-panel pict-modal-shell-panel-'+this.Side+' pict-modal-shell-panel-mode-'+this.Mode+(this.Position==='overlay'?' pict-modal-shell-panel-overlay':'')+(this.Hidden?' pict-modal-shell-panel-hidden':'');tmpRoot.setAttribute('data-shell-panel-hash',this.Hash);tmpRoot.setAttribute('data-shell-panel-side',this.Side);tmpRoot.setAttribute('data-shell-panel-mode',this.Mode);// Content area — hosts render their stuff into the inner #id div.
let tmpContentWrap=document.createElement('div');tmpContentWrap.className='pict-modal-shell-panel-content';this._contentEl=document.createElement('div');if(pConfig.ContentDestinationId){this._contentEl.id=pConfig.ContentDestinationId;}this._contentEl.className='pict-modal-shell-panel-content-inner';tmpContentWrap.appendChild(this._contentEl);tmpRoot.appendChild(tmpContentWrap);// Collapse tab — shown when collapsible / resizable. Lives at the
// inner edge so it's always reachable when the panel is collapsed.
// Hidden panels skip the tab entirely — the only path back from
// collapsed → expanded is a programmatic expand() / toggle() call
// from the host (e.g. a topbar gear button).
if((this.Mode==='collapsible'||this.Mode==='resizable')&&!this.Hidden){this._collapseTab=document.createElement('button');this._collapseTab.type='button';this._collapseTab.className='pict-modal-shell-panel-collapse-tab';this._collapseTab.setAttribute('aria-label',this.Title?'Toggle '+this.Title:'Toggle panel');this._collapseTab.title=this.Title||'Toggle';this._collapseTab.innerHTML=''+(this.Icon?'<span class="pict-modal-shell-panel-collapse-tab-icon">'+this.Icon+'</span>':'')+(this.Title?'<span class="pict-modal-shell-panel-collapse-tab-title">'+this._escape(this.Title)+'</span>':'');let tmpSelf=this;this._collapseTab.addEventListener('click',function(){tmpSelf.toggle();});tmpRoot.appendChild(this._collapseTab);}// Resize handle — only when resizable. Positioned via CSS based
// on side.
if(this.Mode==='resizable'){this._resizeHandle=document.createElement('div');this._resizeHandle.className='pict-modal-shell-panel-resize-handle';this._resizeHandle.setAttribute('aria-hidden','true');let tmpSelf=this;this._resizeHandle.addEventListener('pointerdown',function(pEvent){if(tmpSelf.Collapsed)return;tmpSelf._shell._attachDragStart(tmpSelf,pEvent);});tmpRoot.appendChild(this._resizeHandle);}this.El=tmpRoot;}_applySize(){let tmpEffective=this.Collapsed?this.CollapsedSize:this.Size;if(this.Side==='left'||this.Side==='right'){this.El.style.width=tmpEffective+'px';this.El.style.height='';}else{this.El.style.height=tmpEffective+'px';this.El.style.width='';}}_applyCollapsedClass(){if(this.Collapsed)this.El.classList.add('pict-modal-shell-panel-collapsed');else this.El.classList.remove('pict-modal-shell-panel-collapsed');}_setCollapsed(pBool){if(this.Collapsed===!!pBool)return;let tmpWasCollapsed=this.Collapsed;this.Collapsed=!!pBool;this._applyCollapsedClass();this._applySize();this._persist();// Transition-specific hooks fire BEFORE OnToggle so OnExpand
// callers can mutate state (e.g. set focus, re-fetch data) and
// have it reflected by any OnToggle observer that runs after.
if(tmpWasCollapsed&&!this.Collapsed){// collapsed → expanded. Render the bound ContentView so
// freshly-streamed state shows up the moment the panel
// becomes visible (replaces the manual view.render() dance
// hosts used to do in their own runAction-style helpers).
this._renderContentView();this._fireHook('OnExpand');}else if(!tmpWasCollapsed&&this.Collapsed){this._fireHook('OnCollapse');}// Back-compat: OnToggle still fires for both directions.
this._fireHook('OnToggle',this.Collapsed);}_fireHook(pName,pArg){let tmpFn=this._config[pName];if(typeof tmpFn!=='function')return;try{if(typeof pArg!=='undefined'){tmpFn(pArg,this);}else{tmpFn(this);}}catch(pErr){/* host hook failure must not break the panel */}}/**
	 * Render the bound ContentView (if any) into this panel's
	 * destination. Called by the shell on panel creation + on every
	 * collapsed→expanded transition + by popup() when re-flashing an
	 * already-open panel. Silently no-ops when no ContentView is
	 * configured or the view isn't registered yet (boot races).
	 */_renderContentView(){let tmpView=this.getContentView();if(tmpView&&typeof tmpView.render==='function'){try{tmpView.render();}catch(pErr){/* view render failure shouldn't break the panel chrome */}}}/**
	 * Briefly highlight the panel — used by popup() when called on an
	 * already-open panel so the user sees that their click landed.
	 * The class is removed after the CSS animation completes; safe to
	 * re-trigger (timeouts overlap, last one wins on the trailing edge).
	 */_flash(){if(!this.El)return;this.El.classList.add('pict-modal-shell-panel-flash');let tmpSelf=this;clearTimeout(this._flashTimer);this._flashTimer=setTimeout(function(){if(tmpSelf.El)tmpSelf.El.classList.remove('pict-modal-shell-panel-flash');},700);}_persist(){if(!this.PersistEnabled)return;this._shell._savePanelState(this.Hash,{Collapsed:this.Collapsed,Size:this.Size});}_escape(pStr){return String(pStr||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}}// ════════════════════════════════════════════════════════════════════
//  Module exports — used internally by Pict-Section-Modal.shell()
// ════════════════════════════════════════════════════════════════════
class PictModalShellManager{constructor(pModalSection){this._modal=pModalSection;this._shellsByViewport=new WeakMap();}/**
	 * Idempotent — calling shell() twice with the same viewport returns
	 * the same instance.
	 */shell(pViewportSelectorOrEl,pOptions){let tmpEl=typeof pViewportSelectorOrEl==='string'?document.querySelector(pViewportSelectorOrEl):pViewportSelectorOrEl;if(!tmpEl){throw new Error('Pict-Modal-Shell.shell: viewport not found for '+pViewportSelectorOrEl);}let tmpExisting=this._shellsByViewport.get(tmpEl);if(tmpExisting)return tmpExisting;let tmpShell=new PictModalShell(this._modal,tmpEl,pOptions);this._shellsByViewport.set(tmpEl,tmpShell);return tmpShell;}}module.exports=PictModalShellManager;module.exports.PictModalShell=PictModalShell;module.exports.ShellPanel=ShellPanel;module.exports.STORAGE_PREFIX=STORAGE_PREFIX;module.exports.SCHEMA_VERSION=SCHEMA_VERSION;},{}],59:[function(require,module,exports){/**
 * Pict-Modal-Toast
 *
 * Manages toast notification elements with auto-dismiss and stacking.
 */class PictModalToast{constructor(pModal){this._modal=pModal;this._containers={};}/**
	 * Show a toast notification.
	 *
	 * @param {string} pMessage - Toast message text
	 * @param {object} [pOptions] - Options (type, duration, position, dismissible)
	 * @returns {{ dismiss: function }} Handle with dismiss method
	 */toast(pMessage,pOptions){let tmpOptions=Object.assign({},this._modal.options.DefaultToastOptions,pOptions);let tmpContainer=this._getContainer(tmpOptions.position);let tmpId=this._modal._nextId();let tmpToast=document.createElement('div');tmpToast.className='pict-modal-toast pict-modal-toast--'+tmpOptions.type;tmpToast.id='pict-modal-toast-'+tmpId;let tmpContent='<span class="pict-modal-toast-message">'+this._escapeHTML(pMessage)+'</span>';if(tmpOptions.dismissible){tmpContent+='<button class="pict-modal-toast-dismiss" aria-label="Dismiss">&times;</button>';}tmpToast.innerHTML=tmpContent;// Create handle
let tmpDismissed=false;let tmpTimeoutHandle=null;let tmpDismiss=()=>{if(tmpDismissed){return;}tmpDismissed=true;if(tmpTimeoutHandle){clearTimeout(tmpTimeoutHandle);}// Exit animation
tmpToast.classList.remove('pict-modal-visible');tmpToast.classList.add('pict-modal-toast-exit');// Remove from active list
this._modal._activeToasts=this._modal._activeToasts.filter(pEntry=>{return pEntry.element!==tmpToast;});// Remove from DOM after transition
setTimeout(()=>{if(tmpToast.parentNode){tmpToast.parentNode.removeChild(tmpToast);}this._cleanupContainer(tmpOptions.position);},220);};let tmpHandle={dismiss:tmpDismiss};// Wire dismiss button
if(tmpOptions.dismissible){let tmpDismissBtn=tmpToast.querySelector('.pict-modal-toast-dismiss');if(tmpDismissBtn){tmpDismissBtn.addEventListener('click',tmpDismiss);}}// Append to container
tmpContainer.appendChild(tmpToast);// Track
let tmpEntry={element:tmpToast,dismiss:tmpDismiss,handle:tmpHandle};this._modal._activeToasts.push(tmpEntry);// Animate in
void tmpToast.offsetHeight;tmpToast.classList.add('pict-modal-visible');// Auto-dismiss
if(tmpOptions.duration>0){tmpTimeoutHandle=setTimeout(tmpDismiss,tmpOptions.duration);}return tmpHandle;}/**
	 * Get or create a toast container for the given position.
	 *
	 * @param {string} pPosition - Position key (e.g. 'top-right')
	 * @returns {HTMLElement}
	 */_getContainer(pPosition){if(this._containers[pPosition]){return this._containers[pPosition];}let tmpContainer=document.createElement('div');tmpContainer.className='pict-modal-toast-container pict-modal-toast-container--'+pPosition;document.body.appendChild(tmpContainer);this._containers[pPosition]=tmpContainer;return tmpContainer;}/**
	 * Remove a container if it has no more toasts.
	 *
	 * @param {string} pPosition
	 */_cleanupContainer(pPosition){let tmpContainer=this._containers[pPosition];if(tmpContainer&&tmpContainer.children.length===0){if(tmpContainer.parentNode){tmpContainer.parentNode.removeChild(tmpContainer);}delete this._containers[pPosition];}}/**
	 * Dismiss all active toasts.
	 */dismissAll(){let tmpToasts=this._modal._activeToasts.slice();for(let i=0;i<tmpToasts.length;i++){tmpToasts[i].dismiss();}}/**
	 * Destroy all containers.
	 */destroy(){this.dismissAll();let tmpPositions=Object.keys(this._containers);for(let i=0;i<tmpPositions.length;i++){let tmpContainer=this._containers[tmpPositions[i]];if(tmpContainer&&tmpContainer.parentNode){tmpContainer.parentNode.removeChild(tmpContainer);}}this._containers={};}/**
	 * Escape HTML special characters.
	 *
	 * @param {string} pText
	 * @returns {string}
	 */_escapeHTML(pText){if(typeof pText!=='string'){return'';}return pText.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}}module.exports=PictModalToast;},{}],60:[function(require,module,exports){/**
 * Pict-Modal-Tooltip
 *
 * Manages simple text and rich HTML tooltips with positioning and auto-flip.
 */class PictModalTooltip{constructor(pModal){this._modal=pModal;}/**
	 * Attach a simple text tooltip to an element.
	 *
	 * @param {HTMLElement} pElement - Target element
	 * @param {string} pText - Tooltip text
	 * @param {object} [pOptions] - Options (position, delay, maxWidth)
	 * @returns {{ destroy: function }} Handle to remove the tooltip
	 */tooltip(pElement,pText,pOptions){let tmpOptions=Object.assign({},this._modal.options.DefaultTooltipOptions,pOptions);return this._attachTooltip(pElement,pText,false,tmpOptions);}/**
	 * Attach a rich HTML tooltip to an element.
	 *
	 * @param {HTMLElement} pElement - Target element
	 * @param {string} pHTMLContent - HTML content for the tooltip
	 * @param {object} [pOptions] - Options (position, delay, maxWidth, interactive)
	 * @returns {{ destroy: function }} Handle to remove the tooltip
	 */richTooltip(pElement,pHTMLContent,pOptions){let tmpOptions=Object.assign({},this._modal.options.DefaultTooltipOptions,pOptions);return this._attachTooltip(pElement,pHTMLContent,true,tmpOptions);}/**
	 * Internal: attach tooltip event listeners to an element.
	 *
	 * @param {HTMLElement} pElement
	 * @param {string} pContent
	 * @param {boolean} pIsHTML
	 * @param {object} pOptions
	 * @returns {{ destroy: function }}
	 */_attachTooltip(pElement,pContent,pIsHTML,pOptions){let tmpTooltipElement=null;let tmpShowTimeout=null;let tmpHideTimeout=null;let tmpDestroyed=false;let tmpId=this._modal._nextId();let tmpShow=()=>{if(tmpDestroyed||tmpTooltipElement){return;}tmpTooltipElement=document.createElement('div');tmpTooltipElement.className='pict-modal-tooltip pict-modal-tooltip--'+pOptions.position;tmpTooltipElement.id='pict-modal-tooltip-'+tmpId;tmpTooltipElement.setAttribute('role','tooltip');tmpTooltipElement.style.maxWidth=pOptions.maxWidth;if(pOptions.interactive){tmpTooltipElement.classList.add('pict-modal-tooltip-interactive');}// Arrow
let tmpArrow=document.createElement('div');tmpArrow.className='pict-modal-tooltip-arrow';// Content
let tmpContentDiv=document.createElement('div');if(pIsHTML){tmpContentDiv.innerHTML=pContent;}else{tmpContentDiv.textContent=pContent;}tmpTooltipElement.appendChild(tmpArrow);tmpTooltipElement.appendChild(tmpContentDiv);document.body.appendChild(tmpTooltipElement);// Set aria-describedby on target
pElement.setAttribute('aria-describedby',tmpTooltipElement.id);// Position
this._positionTooltip(tmpTooltipElement,pElement,pOptions.position);// Animate in
void tmpTooltipElement.offsetHeight;tmpTooltipElement.classList.add('pict-modal-visible');// Track
this._modal._activeTooltips.push({element:tmpTooltipElement,targetElement:pElement,destroy:tmpDestroy});// For interactive tooltips, allow hovering over the tooltip itself
if(pOptions.interactive&&tmpTooltipElement){tmpTooltipElement.addEventListener('mouseenter',()=>{if(tmpHideTimeout){clearTimeout(tmpHideTimeout);tmpHideTimeout=null;}});tmpTooltipElement.addEventListener('mouseleave',()=>{tmpHide();});}};let tmpHide=()=>{if(!tmpTooltipElement){return;}tmpTooltipElement.classList.remove('pict-modal-visible');let tmpEl=tmpTooltipElement;tmpTooltipElement=null;// Remove aria
pElement.removeAttribute('aria-describedby');// Remove from tracking
this._modal._activeTooltips=this._modal._activeTooltips.filter(pEntry=>{return pEntry.element!==tmpEl;});setTimeout(()=>{if(tmpEl.parentNode){tmpEl.parentNode.removeChild(tmpEl);}},220);};let tmpOnMouseEnter=()=>{if(tmpHideTimeout){clearTimeout(tmpHideTimeout);tmpHideTimeout=null;}tmpShowTimeout=setTimeout(tmpShow,pOptions.delay);};let tmpOnMouseLeave=()=>{if(tmpShowTimeout){clearTimeout(tmpShowTimeout);tmpShowTimeout=null;}// Small delay before hiding to allow moving to interactive tooltip
if(pOptions.interactive){tmpHideTimeout=setTimeout(tmpHide,100);}else{tmpHide();}};let tmpOnFocusIn=()=>{tmpShowTimeout=setTimeout(tmpShow,pOptions.delay);};let tmpOnFocusOut=()=>{if(tmpShowTimeout){clearTimeout(tmpShowTimeout);tmpShowTimeout=null;}tmpHide();};// Attach listeners
pElement.addEventListener('mouseenter',tmpOnMouseEnter);pElement.addEventListener('mouseleave',tmpOnMouseLeave);pElement.addEventListener('focusin',tmpOnFocusIn);pElement.addEventListener('focusout',tmpOnFocusOut);let tmpDestroy=()=>{if(tmpDestroyed){return;}tmpDestroyed=true;if(tmpShowTimeout){clearTimeout(tmpShowTimeout);}if(tmpHideTimeout){clearTimeout(tmpHideTimeout);}tmpHide();pElement.removeEventListener('mouseenter',tmpOnMouseEnter);pElement.removeEventListener('mouseleave',tmpOnMouseLeave);pElement.removeEventListener('focusin',tmpOnFocusIn);pElement.removeEventListener('focusout',tmpOnFocusOut);};return{destroy:tmpDestroy};}/**
	 * Position a tooltip element relative to the target element.
	 * Flips direction if the tooltip would overflow the viewport.
	 *
	 * @param {HTMLElement} pTooltip
	 * @param {HTMLElement} pTarget
	 * @param {string} pPosition - 'top', 'bottom', 'left', 'right'
	 */_positionTooltip(pTooltip,pTarget,pPosition){let tmpTargetRect=pTarget.getBoundingClientRect();let tmpTooltipRect=pTooltip.getBoundingClientRect();let tmpGap=8;let tmpPosition=pPosition;// Flip if needed
if(tmpPosition==='top'&&tmpTargetRect.top<tmpTooltipRect.height+tmpGap){tmpPosition='bottom';}else if(tmpPosition==='bottom'&&window.innerHeight-tmpTargetRect.bottom<tmpTooltipRect.height+tmpGap){tmpPosition='top';}else if(tmpPosition==='left'&&tmpTargetRect.left<tmpTooltipRect.width+tmpGap){tmpPosition='right';}else if(tmpPosition==='right'&&window.innerWidth-tmpTargetRect.right<tmpTooltipRect.width+tmpGap){tmpPosition='left';}// Update class for arrow direction
pTooltip.className=pTooltip.className.replace(/pict-modal-tooltip--\w+/,'pict-modal-tooltip--'+tmpPosition);let tmpTop=0;let tmpLeft=0;switch(tmpPosition){case'top':tmpTop=tmpTargetRect.top-tmpTooltipRect.height-tmpGap;tmpLeft=tmpTargetRect.left+tmpTargetRect.width/2-tmpTooltipRect.width/2;break;case'bottom':tmpTop=tmpTargetRect.bottom+tmpGap;tmpLeft=tmpTargetRect.left+tmpTargetRect.width/2-tmpTooltipRect.width/2;break;case'left':tmpTop=tmpTargetRect.top+tmpTargetRect.height/2-tmpTooltipRect.height/2;tmpLeft=tmpTargetRect.left-tmpTooltipRect.width-tmpGap;break;case'right':tmpTop=tmpTargetRect.top+tmpTargetRect.height/2-tmpTooltipRect.height/2;tmpLeft=tmpTargetRect.right+tmpGap;break;}// Clamp to viewport
tmpLeft=Math.max(4,Math.min(tmpLeft,window.innerWidth-tmpTooltipRect.width-4));tmpTop=Math.max(4,Math.min(tmpTop,window.innerHeight-tmpTooltipRect.height-4));pTooltip.style.top=tmpTop+'px';pTooltip.style.left=tmpLeft+'px';}/**
	 * Dismiss all active tooltips.
	 */dismissAll(){let tmpTooltips=this._modal._activeTooltips.slice();for(let i=0;i<tmpTooltips.length;i++){tmpTooltips[i].destroy();}}}module.exports=PictModalTooltip;},{}],61:[function(require,module,exports){/**
 * Pict-Modal-Window
 *
 * Builds custom floating modal windows with arbitrary content and buttons.
 */class PictModalWindow{constructor(pModal){this._modal=pModal;}/**
	 * Show a custom modal window.
	 *
	 * @param {object} [pOptions] - Options
	 * @param {string} [pOptions.title] - Dialog title
	 * @param {string} [pOptions.content] - HTML content for the body
	 * @param {Array} [pOptions.buttons] - Array of { Hash, Label, Style }
	 * @param {boolean} [pOptions.closeable] - Whether the close button and overlay dismiss are enabled
	 * @param {string} [pOptions.width] - CSS width value
	 * @param {boolean} [pOptions.unbounded] - If true, removes the default 90vh/90vw viewport cap. The dialog will grow with its content and may extend beyond the viewport.
	 * @param {function} [pOptions.onOpen] - Called after dialog is shown, receives dialog element
	 * @param {function} [pOptions.onClose] - Called after dialog is dismissed
	 * @returns {Promise<string|null>} Resolves with clicked button Hash, or null on close
	 */show(pOptions){let tmpOptions=Object.assign({},this._modal.options.DefaultModalOptions,pOptions);return new Promise(fResolve=>{let tmpDialog=this._buildDialog(tmpOptions,fResolve);this._showDialog(tmpDialog,tmpOptions,fResolve);});}/**
	 * Build the modal dialog element.
	 *
	 * @param {object} pOptions
	 * @param {function} fResolve
	 * @returns {HTMLElement}
	 */_buildDialog(pOptions,fResolve){let tmpId=this._modal._nextId();let tmpDialog=document.createElement('div');tmpDialog.className='pict-modal-dialog';if(pOptions.unbounded){tmpDialog.className+=' pict-modal-dialog--unbounded';}tmpDialog.id='pict-modal-'+tmpId;tmpDialog.setAttribute('role','dialog');tmpDialog.setAttribute('aria-modal','true');tmpDialog.style.width=pOptions.width;// Header
let tmpHeaderHTML='';if(pOptions.title||pOptions.closeable){tmpHeaderHTML='<div class="pict-modal-dialog-header">';tmpHeaderHTML+='<span class="pict-modal-dialog-title">'+this._escapeHTML(pOptions.title)+'</span>';if(pOptions.closeable){tmpHeaderHTML+='<button class="pict-modal-dialog-close" aria-label="Close">&times;</button>';}tmpHeaderHTML+='</div>';}// Body
let tmpBodyHTML='<div class="pict-modal-dialog-body">'+(pOptions.content||'')+'</div>';// Footer with buttons
let tmpFooterHTML='';if(pOptions.buttons&&pOptions.buttons.length>0){tmpFooterHTML='<div class="pict-modal-dialog-footer">';for(let i=0;i<pOptions.buttons.length;i++){let tmpButton=pOptions.buttons[i];let tmpBtnClass='pict-modal-btn';if(tmpButton.Style){tmpBtnClass+=' pict-modal-btn--'+tmpButton.Style;}tmpFooterHTML+='<button class="'+tmpBtnClass+'" data-hash="'+this._escapeHTML(tmpButton.Hash)+'">'+this._escapeHTML(tmpButton.Label)+'</button>';}tmpFooterHTML+='</div>';}tmpDialog.innerHTML=tmpHeaderHTML+tmpBodyHTML+tmpFooterHTML;let tmpDismiss=pResult=>{this._dismissDialog(tmpDialog,pResult,fResolve,pOptions);};// Wire close button
if(pOptions.closeable){let tmpCloseBtn=tmpDialog.querySelector('.pict-modal-dialog-close');if(tmpCloseBtn){tmpCloseBtn.addEventListener('click',()=>{tmpDismiss(null);});}}// Wire action buttons
let tmpActionButtons=tmpDialog.querySelectorAll('[data-hash]');for(let i=0;i<tmpActionButtons.length;i++){let tmpBtn=tmpActionButtons[i];tmpBtn.addEventListener('click',()=>{tmpDismiss(tmpBtn.getAttribute('data-hash'));});}tmpDialog._dismiss=tmpDismiss;return tmpDialog;}/**
	 * Show the dialog: append to body, show overlay, animate in.
	 *
	 * @param {HTMLElement} pDialog
	 * @param {object} pOptions
	 * @param {function} fResolve
	 */_showDialog(pDialog,pOptions,fResolve){let tmpModalEntry={element:pDialog,dismiss:pDialog._dismiss,type:'window'};// Show overlay
let tmpOverlayClickHandler=null;if(this._modal.options.OverlayClickDismisses&&pOptions.closeable){tmpOverlayClickHandler=()=>{pDialog._dismiss(null);};}this._modal._overlay.show(tmpOverlayClickHandler);// Append to body
document.body.appendChild(pDialog);// Track
this._modal._activeModals.push(tmpModalEntry);// Animate in
void pDialog.offsetHeight;pDialog.classList.add('pict-modal-visible');// Focus first button or close button
let tmpFocusTarget=pDialog.querySelector('.pict-modal-btn')||pDialog.querySelector('.pict-modal-dialog-close');if(tmpFocusTarget){tmpFocusTarget.focus();}// Keyboard handler
pDialog._keyHandler=pEvent=>{if(pEvent.key==='Escape'&&pOptions.closeable){pDialog._dismiss(null);}};document.addEventListener('keydown',pDialog._keyHandler);// onOpen callback
if(typeof pOptions.onOpen==='function'){pOptions.onOpen(pDialog);}}/**
	 * Dismiss the dialog: animate out, remove from DOM, hide overlay.
	 *
	 * @param {HTMLElement} pDialog
	 * @param {*} pResult
	 * @param {function} fResolve
	 * @param {object} pOptions
	 */_dismissDialog(pDialog,pResult,fResolve,pOptions){if(pDialog._dismissed){return;}pDialog._dismissed=true;if(pDialog._keyHandler){document.removeEventListener('keydown',pDialog._keyHandler);}pDialog.classList.remove('pict-modal-visible');this._modal._activeModals=this._modal._activeModals.filter(pEntry=>{return pEntry.element!==pDialog;});if(this._modal._activeModals.length>0){let tmpTopModal=this._modal._activeModals[this._modal._activeModals.length-1];this._modal._overlay.updateClickHandler(this._modal.options.OverlayClickDismisses?tmpTopModal.dismiss:null);}this._modal._overlay.hide();setTimeout(()=>{if(pDialog.parentNode){pDialog.parentNode.removeChild(pDialog);}},220);if(typeof pOptions.onClose==='function'){pOptions.onClose(pResult);}fResolve(pResult);}/**
	 * Escape HTML special characters.
	 *
	 * @param {string} pText
	 * @returns {string}
	 */_escapeHTML(pText){if(typeof pText!=='string'){return'';}return pText.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}}module.exports=PictModalWindow;},{}],62:[function(require,module,exports){module.exports={"AutoInitialize":true,"AutoRender":false,"AutoSolveWithApp":false,"ViewIdentifier":"Pict-Section-Modal","OverlayClickDismisses":true,"DefaultConfirmOptions":{"title":"Confirm","confirmLabel":"OK","cancelLabel":"Cancel","dangerous":false,"unbounded":false},"DefaultDoubleConfirmOptions":{"title":"Are you sure?","confirmLabel":"Confirm","cancelLabel":"Cancel","phrasePrompt":"Type \"{phrase}\" to confirm:","confirmPhrase":"","unbounded":false},"DefaultModalOptions":{"title":"","content":"","buttons":[],"closeable":true,"width":"480px","unbounded":false},"DefaultTooltipOptions":{"position":"top","delay":200,"maxWidth":"300px","interactive":false},"DefaultToastOptions":{"type":"info","duration":3000,"position":"top-right","dismissible":true},"DefaultPanelOptions":{"position":"right","width":340,"minWidth":200,"maxWidth":600,"collapsible":true,"collapsed":false,"persist":false,"persistKey":""},"Templates":[],"Renderables":[],"CSS":/*css*/"\n/* pict-section-modal */\n.pict-modal-root\n{\n\t/* Defaults are routed through pict-provider-theme tokens so apps\n\t   using the theme provider get themed modals automatically.  Each\n\t   var() carries its original hex as the fallback so apps that don't\n\t   install pict-provider-theme look exactly as before.  Apps may\n\t   still override any --pict-modal-* var directly to layer over the\n\t   theme-driven defaults. */\n\n\t/* Overlay */\n\t--pict-modal-overlay-bg: rgba(0, 0, 0, 0.5);\n\n\t/* Dialog */\n\t--pict-modal-bg:                  var(--theme-color-background-panel,  #ffffff);\n\t--pict-modal-fg:                  var(--theme-color-text-primary,      #1a1a1a);\n\t--pict-modal-border:              var(--theme-color-border-default,    #e0e0e0);\n\t--pict-modal-border-radius:       8px;\n\t--pict-modal-shadow:              0 4px 24px rgba(0, 0, 0, 0.15);\n\t--pict-modal-header-bg:           var(--theme-color-background-secondary, #f5f5f5);\n\t--pict-modal-header-fg:           var(--theme-color-text-primary,      #1a1a1a);\n\t--pict-modal-header-border:       var(--theme-color-border-default,    #e0e0e0);\n\n\t/* Buttons */\n\t--pict-modal-btn-bg:              var(--theme-color-background-secondary, #e0e0e0);\n\t--pict-modal-btn-fg:              var(--theme-color-text-primary,      #1a1a1a);\n\t--pict-modal-btn-hover-bg:        var(--theme-color-background-hover,  #d0d0d0);\n\t--pict-modal-btn-primary-bg:      var(--theme-color-brand-primary,     #2563eb);\n\t--pict-modal-btn-primary-fg:      var(--theme-color-text-on-brand,     #ffffff);\n\t--pict-modal-btn-primary-hover-bg:var(--theme-color-brand-primary-hover,#1d4ed8);\n\t--pict-modal-btn-danger-bg:       var(--theme-color-status-error,      #dc2626);\n\t--pict-modal-btn-danger-fg:       var(--theme-color-text-on-brand,     #ffffff);\n\t--pict-modal-btn-danger-hover-bg: var(--theme-color-status-error,      #b91c1c);\n\t--pict-modal-btn-border-radius:   4px;\n\n\t/* Toast */\n\t--pict-modal-toast-bg:            var(--theme-color-background-panel,  #333333);\n\t--pict-modal-toast-fg:            var(--theme-color-text-primary,      #ffffff);\n\t--pict-modal-toast-success-bg:    var(--theme-color-status-success,    #16a34a);\n\t--pict-modal-toast-warning-bg:    var(--theme-color-status-warning,    #d97706);\n\t--pict-modal-toast-error-bg:      var(--theme-color-status-error,      #dc2626);\n\t--pict-modal-toast-info-bg:       var(--theme-color-status-info,       #2563eb);\n\t--pict-modal-toast-border-radius: 6px;\n\t--pict-modal-toast-shadow:        0 2px 12px rgba(0, 0, 0, 0.15);\n\n\t/* Tooltip */\n\t--pict-modal-tooltip-bg:          var(--theme-color-background-tertiary,#1a1a1a);\n\t--pict-modal-tooltip-fg:          var(--theme-color-text-primary,      #ffffff);\n\t--pict-modal-tooltip-border-radius:4px;\n\t--pict-modal-tooltip-shadow:      0 2px 8px rgba(0, 0, 0, 0.15);\n\n\t/* Dropdown */\n\t--pict-modal-dropdown-bg:                 var(--theme-color-background-panel,  #ffffff);\n\t--pict-modal-dropdown-fg:                 var(--theme-color-text-primary,      #1a1a1a);\n\t--pict-modal-dropdown-border:             var(--theme-color-border-default,    #e0e0e0);\n\t--pict-modal-dropdown-border-radius:      6px;\n\t--pict-modal-dropdown-shadow:             0 6px 18px rgba(0, 0, 0, 0.18);\n\t--pict-modal-dropdown-item-hover-bg:      var(--theme-color-background-hover,  rgba(37, 99, 235, 0.10));\n\t--pict-modal-dropdown-item-hover-fg:      var(--theme-color-text-primary,      #1a1a1a);\n\t--pict-modal-dropdown-item-disabled-fg:   var(--theme-color-text-muted,        #9aa0a6);\n\t--pict-modal-dropdown-separator:          var(--theme-color-border-light,      #e8e8e8);\n\t--pict-modal-dropdown-header-fg:          var(--theme-color-text-secondary,    #6b7280);\n\t--pict-modal-dropdown-danger-fg:          var(--theme-color-status-error,      #dc2626);\n\t--pict-modal-dropdown-primary-fg:         var(--theme-color-brand-primary,     #2563eb);\n\n\t/* Typography */\n\t--pict-modal-font-family:         var(--theme-typography-family-sans,  system-ui, -apple-system, sans-serif);\n\t--pict-modal-font-size:           14px;\n\t--pict-modal-title-font-size:     16px;\n\n\t/* Animation */\n\t--pict-modal-transition-duration: 200ms;\n}\n\n/* Overlay */\n.pict-modal-overlay\n{\n\tposition: fixed;\n\ttop: 0;\n\tleft: 0;\n\twidth: 100%;\n\theight: 100%;\n\tz-index: 1000;\n\tbackground: var(--pict-modal-overlay-bg);\n\topacity: 0;\n\ttransition: opacity var(--pict-modal-transition-duration) ease;\n}\n\n.pict-modal-overlay.pict-modal-visible\n{\n\topacity: 1;\n}\n\n/* Dialog */\n.pict-modal-dialog\n{\n\tposition: fixed;\n\tz-index: 1010;\n\ttop: 50%;\n\tleft: 50%;\n\ttransform: translate(-50%, -50%) translateY(-20px);\n\topacity: 0;\n\ttransition: opacity var(--pict-modal-transition-duration) ease,\n\t            transform var(--pict-modal-transition-duration) ease;\n\n\tmax-width: 90vw;\n\tmax-height: 90vh;\n\tdisplay: flex;\n\tflex-direction: column;\n\n\tbackground: var(--pict-modal-bg);\n\tcolor: var(--pict-modal-fg);\n\tborder: 1px solid var(--pict-modal-border);\n\tborder-radius: var(--pict-modal-border-radius);\n\tbox-shadow: var(--pict-modal-shadow);\n\tfont-family: var(--pict-modal-font-family);\n\tfont-size: var(--pict-modal-font-size);\n}\n\n.pict-modal-dialog.pict-modal-visible\n{\n\topacity: 1;\n\ttransform: translate(-50%, -50%) translateY(0);\n}\n\n/* Unbounded modifier \u2014 lets callers opt out of the 90vh/90vw viewport cap.\n   Use with caution: content taller than the viewport will push buttons\n   below the fold. */\n.pict-modal-dialog.pict-modal-dialog--unbounded\n{\n\tmax-height: none;\n\tmax-width: none;\n}\n\n.pict-modal-dialog-header\n{\n\tdisplay: flex;\n\talign-items: center;\n\tjustify-content: space-between;\n\tpadding: 12px 16px;\n\tbackground: var(--pict-modal-header-bg);\n\tcolor: var(--pict-modal-header-fg);\n\tborder-bottom: 1px solid var(--pict-modal-header-border);\n\tborder-radius: var(--pict-modal-border-radius) var(--pict-modal-border-radius) 0 0;\n}\n\n.pict-modal-dialog-title\n{\n\tfont-size: var(--pict-modal-title-font-size);\n\tfont-weight: 600;\n}\n\n.pict-modal-dialog-close\n{\n\tbackground: none;\n\tborder: none;\n\tfont-size: 20px;\n\tcursor: pointer;\n\tcolor: var(--pict-modal-fg);\n\tpadding: 0 4px;\n\tline-height: 1;\n\topacity: 0.6;\n}\n\n.pict-modal-dialog-close:hover\n{\n\topacity: 1;\n}\n\n.pict-modal-dialog-body\n{\n\tpadding: 16px;\n\toverflow-y: auto;\n\tflex: 1;\n}\n\n.pict-modal-dialog-footer\n{\n\tdisplay: flex;\n\tjustify-content: flex-end;\n\tgap: 8px;\n\tpadding: 12px 16px;\n\tborder-top: 1px solid var(--pict-modal-border);\n}\n\n/* Buttons */\n.pict-modal-btn\n{\n\tpadding: 8px 16px;\n\tborder: none;\n\tborder-radius: var(--pict-modal-btn-border-radius);\n\tfont-family: var(--pict-modal-font-family);\n\tfont-size: var(--pict-modal-font-size);\n\tcursor: pointer;\n\tbackground: var(--pict-modal-btn-bg);\n\tcolor: var(--pict-modal-btn-fg);\n\ttransition: background var(--pict-modal-transition-duration) ease;\n}\n\n.pict-modal-btn:hover\n{\n\tbackground: var(--pict-modal-btn-hover-bg);\n}\n\n.pict-modal-btn:disabled\n{\n\topacity: 0.5;\n\tcursor: not-allowed;\n}\n\n.pict-modal-btn--primary\n{\n\tbackground: var(--pict-modal-btn-primary-bg);\n\tcolor: var(--pict-modal-btn-primary-fg);\n}\n\n.pict-modal-btn--primary:hover\n{\n\tbackground: var(--pict-modal-btn-primary-hover-bg);\n}\n\n.pict-modal-btn--danger\n{\n\tbackground: var(--pict-modal-btn-danger-bg);\n\tcolor: var(--pict-modal-btn-danger-fg);\n}\n\n.pict-modal-btn--danger:hover\n{\n\tbackground: var(--pict-modal-btn-danger-hover-bg);\n}\n\n/* Double confirm input */\n.pict-modal-confirm-input\n{\n\twidth: 100%;\n\tpadding: 8px 12px;\n\tmargin-top: 12px;\n\tborder: 1px solid var(--pict-modal-border);\n\tborder-radius: var(--pict-modal-btn-border-radius);\n\tfont-family: var(--pict-modal-font-family);\n\tfont-size: var(--pict-modal-font-size);\n\tbox-sizing: border-box;\n}\n\n.pict-modal-confirm-input:focus\n{\n\toutline: 2px solid var(--pict-modal-btn-primary-bg);\n\toutline-offset: -1px;\n}\n\n.pict-modal-confirm-prompt\n{\n\tmargin-top: 12px;\n\tfont-size: 13px;\n\tcolor: var(--pict-modal-fg);\n\topacity: 0.7;\n}\n\n/* Toast container */\n.pict-modal-toast-container\n{\n\tposition: fixed;\n\tz-index: 1030;\n\tdisplay: flex;\n\tflex-direction: column;\n\tgap: 8px;\n\tpointer-events: none;\n\tmax-width: 400px;\n}\n\n.pict-modal-toast-container--top-right\n{\n\ttop: 16px;\n\tright: 16px;\n}\n\n.pict-modal-toast-container--top-left\n{\n\ttop: 16px;\n\tleft: 16px;\n}\n\n.pict-modal-toast-container--bottom-right\n{\n\tbottom: 16px;\n\tright: 16px;\n}\n\n.pict-modal-toast-container--bottom-left\n{\n\tbottom: 16px;\n\tleft: 16px;\n}\n\n.pict-modal-toast-container--top-center\n{\n\ttop: 16px;\n\tleft: 50%;\n\ttransform: translateX(-50%);\n}\n\n.pict-modal-toast-container--bottom-center\n{\n\tbottom: 16px;\n\tleft: 50%;\n\ttransform: translateX(-50%);\n}\n\n/* Toast */\n.pict-modal-toast\n{\n\tdisplay: flex;\n\talign-items: center;\n\tgap: 10px;\n\tpadding: 12px 16px;\n\tborder-radius: var(--pict-modal-toast-border-radius);\n\tbox-shadow: var(--pict-modal-toast-shadow);\n\tfont-family: var(--pict-modal-font-family);\n\tfont-size: var(--pict-modal-font-size);\n\tbackground: var(--pict-modal-toast-bg);\n\tcolor: var(--pict-modal-toast-fg);\n\tpointer-events: auto;\n\topacity: 0;\n\ttransform: translateX(100%);\n\ttransition: opacity var(--pict-modal-transition-duration) ease,\n\t            transform var(--pict-modal-transition-duration) ease;\n}\n\n.pict-modal-toast.pict-modal-visible\n{\n\topacity: 1;\n\ttransform: translateX(0);\n}\n\n.pict-modal-toast.pict-modal-toast-exit\n{\n\topacity: 0;\n\ttransform: translateX(100%);\n}\n\n.pict-modal-toast--info\n{\n\tbackground: var(--pict-modal-toast-info-bg);\n}\n\n.pict-modal-toast--success\n{\n\tbackground: var(--pict-modal-toast-success-bg);\n}\n\n.pict-modal-toast--warning\n{\n\tbackground: var(--pict-modal-toast-warning-bg);\n}\n\n.pict-modal-toast--error\n{\n\tbackground: var(--pict-modal-toast-error-bg);\n}\n\n.pict-modal-toast-message\n{\n\tflex: 1;\n}\n\n.pict-modal-toast-dismiss\n{\n\tbackground: none;\n\tborder: none;\n\tcolor: inherit;\n\tfont-size: 18px;\n\tcursor: pointer;\n\tpadding: 0 2px;\n\tline-height: 1;\n\topacity: 0.7;\n}\n\n.pict-modal-toast-dismiss:hover\n{\n\topacity: 1;\n}\n\n/* Tooltip */\n.pict-modal-tooltip\n{\n\tposition: fixed;\n\tz-index: 1020;\n\tpadding: 6px 10px;\n\tborder-radius: var(--pict-modal-tooltip-border-radius);\n\tbox-shadow: var(--pict-modal-tooltip-shadow);\n\tbackground: var(--pict-modal-tooltip-bg);\n\tcolor: var(--pict-modal-tooltip-fg);\n\tfont-family: var(--pict-modal-font-family);\n\tfont-size: 13px;\n\tpointer-events: none;\n\topacity: 0;\n\ttransition: opacity var(--pict-modal-transition-duration) ease;\n\twhite-space: normal;\n\tword-wrap: break-word;\n}\n\n.pict-modal-tooltip.pict-modal-tooltip-interactive\n{\n\tpointer-events: auto;\n}\n\n.pict-modal-tooltip.pict-modal-visible\n{\n\topacity: 1;\n}\n\n.pict-modal-tooltip-arrow\n{\n\tposition: absolute;\n\twidth: 8px;\n\theight: 8px;\n\tbackground: var(--pict-modal-tooltip-bg);\n\ttransform: rotate(45deg);\n}\n\n.pict-modal-tooltip--top .pict-modal-tooltip-arrow\n{\n\tbottom: -4px;\n\tleft: 50%;\n\tmargin-left: -4px;\n}\n\n.pict-modal-tooltip--bottom .pict-modal-tooltip-arrow\n{\n\ttop: -4px;\n\tleft: 50%;\n\tmargin-left: -4px;\n}\n\n.pict-modal-tooltip--left .pict-modal-tooltip-arrow\n{\n\tright: -4px;\n\ttop: 50%;\n\tmargin-top: -4px;\n}\n\n.pict-modal-tooltip--right .pict-modal-tooltip-arrow\n{\n\tleft: -4px;\n\ttop: 50%;\n\tmargin-top: -4px;\n}\n\n/* \u2500\u2500 Dropdown \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n   Anchor-positioned menu (no overlay). Used for nav menus and\n   \"split button\" addenda \u2014 see Pict-Modal-Dropdown.js.\n*/\n.pict-modal-dropdown\n{\n\tposition: fixed;\n\tz-index: 1025;\n\tmin-width: 160px;\n\tmax-width: 360px;\n\tmax-height: 60vh;\n\toverflow-y: auto;\n\tbackground: var(--pict-modal-dropdown-bg);\n\tcolor: var(--pict-modal-dropdown-fg);\n\tborder: 1px solid var(--pict-modal-dropdown-border);\n\tborder-radius: var(--pict-modal-dropdown-border-radius);\n\tbox-shadow: var(--pict-modal-dropdown-shadow);\n\tfont-family: var(--pict-modal-font-family);\n\tfont-size: var(--pict-modal-font-size);\n\tpadding: 4px 0;\n\topacity: 0;\n\ttransform: translateY(-4px);\n\ttransition: opacity var(--pict-modal-transition-duration) ease,\n\t            transform var(--pict-modal-transition-duration) ease;\n}\n\n.pict-modal-dropdown.pict-modal-dropdown--above { transform: translateY(4px); }\n\n.pict-modal-dropdown.pict-modal-visible\n{\n\topacity: 1;\n\ttransform: translateY(0);\n}\n\n.pict-modal-dropdown-item\n{\n\tdisplay: flex;\n\talign-items: center;\n\tgap: 8px;\n\tpadding: 7px 14px;\n\tcursor: pointer;\n\tuser-select: none;\n\tcolor: inherit;\n\toutline: none;\n}\n\n.pict-modal-dropdown-item:hover,\n.pict-modal-dropdown-item:focus\n{\n\tbackground: var(--pict-modal-dropdown-item-hover-bg);\n\tcolor: var(--pict-modal-dropdown-item-hover-fg);\n}\n\n.pict-modal-dropdown-item--disabled\n{\n\tcursor: not-allowed;\n\tcolor: var(--pict-modal-dropdown-item-disabled-fg);\n}\n\n.pict-modal-dropdown-item--disabled:hover,\n.pict-modal-dropdown-item--disabled:focus\n{\n\tbackground: transparent;\n\tcolor: var(--pict-modal-dropdown-item-disabled-fg);\n}\n\n.pict-modal-dropdown-item--primary { color: var(--pict-modal-dropdown-primary-fg); }\n.pict-modal-dropdown-item--danger  { color: var(--pict-modal-dropdown-danger-fg); }\n\n.pict-modal-dropdown-item-icon\n{\n\tflex: 0 0 auto;\n\tdisplay: inline-flex;\n\talign-items: center;\n\tjustify-content: center;\n\twidth: 16px;\n\theight: 16px;\n}\n\n.pict-modal-dropdown-item-icon svg { width: 100%; height: 100%; display: block; }\n\n.pict-modal-dropdown-item-label { flex: 1 1 auto; min-width: 0; }\n\n.pict-modal-dropdown-item-hint\n{\n\tflex: 0 0 auto;\n\tfont-size: 11px;\n\topacity: 0.6;\n\tmargin-left: 12px;\n}\n\n.pict-modal-dropdown-separator\n{\n\theight: 1px;\n\tbackground: var(--pict-modal-dropdown-separator);\n\tmargin: 4px 0;\n}\n\n.pict-modal-dropdown-header\n{\n\tpadding: 6px 14px 2px;\n\tfont-size: 11px;\n\tfont-weight: 600;\n\ttext-transform: uppercase;\n\tletter-spacing: 0.04em;\n\tcolor: var(--pict-modal-dropdown-header-fg);\n}\n\n/* \u2500\u2500 Resizable / Collapsible Panels \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */\n.pict-panel\n{\n\tposition: relative;\n\ttransition: width 0.2s ease;\n\tflex-shrink: 0;\n\toverflow: visible;\n}\n.pict-panel-collapsed\n{\n\twidth: 0 !important;\n\tmin-width: 0 !important;\n\toverflow: visible;\n}\n.pict-panel-collapsed > *:not(.pict-panel-edge)\n{\n\tdisplay: none;\n}\n\n/* Edge container \u2014 zero-width flex sibling of the panel.\n   Sits next to the panel in the flex layout; children\n   use absolute positioning to overlap the panel boundary. */\n.pict-panel-edge\n{\n\tposition: relative;\n\twidth: 0;\n\tflex-shrink: 0;\n\tz-index: 50;\n\toverflow: visible;\n}\n\n/* Resize handle \u2014 thin strip on the panel boundary */\n.pict-panel-resize\n{\n\tposition: absolute;\n\ttop: 0;\n\tbottom: 0;\n\twidth: 4px;\n\tcursor: col-resize;\n\tbackground: transparent;\n\ttransition: background 0.15s, width 0.15s;\n}\n.pict-panel-edge-right .pict-panel-resize\n{\n\tright: 0;\n\tborder-right: 1px solid var(--pict-panel-border, #DDD6CA);\n}\n.pict-panel-edge-left .pict-panel-resize\n{\n\tleft: 0;\n\tborder-left: 1px solid var(--pict-panel-border, #DDD6CA);\n}\n.pict-panel-resize:hover,\n.pict-panel-edge:hover .pict-panel-resize\n{\n\twidth: 5px;\n\tbackground: var(--pict-panel-accent, #2E7D74);\n\topacity: 0.5;\n}\n.pict-panel-resize.dragging\n{\n\twidth: 5px;\n\tbackground: var(--pict-panel-accent, #2E7D74);\n\topacity: 1;\n\ttransition: none;\n}\n.pict-panel-edge-collapsed .pict-panel-resize\n{\n\tdisplay: none;\n}\n\n/* Collapse tab \u2014 tucked sliver at rest, slides out on hover */\n.pict-panel-tab\n{\n\tposition: absolute;\n\ttop: 8px;\n\twidth: 8px;\n\theight: 24px;\n\tdisplay: flex;\n\talign-items: center;\n\tjustify-content: center;\n\toverflow: hidden;\n\tbackground: var(--pict-panel-border, #DDD6CA);\n\tborder: 1px solid var(--pict-panel-border, #DDD6CA);\n\tcursor: pointer;\n\tcolor: var(--pict-panel-fg, #8A7F72);\n\tfont-size: 10px;\n\tline-height: 1;\n\topacity: 0.5;\n\ttransition: opacity 0.25s, width 0.2s ease, height 0.2s ease, left 0.2s ease, right 0.2s ease, background 0.2s;\n\tz-index: 51;\n}\n.pict-panel-edge:hover .pict-panel-tab,\n.pict-panel-tab:hover\n{\n\twidth: 20px;\n\theight: 32px;\n\topacity: 1;\n\toverflow: visible;\n\tbackground: var(--pict-panel-bg, #FAF8F4);\n}\n/* Right panel: tab to the left of the edge */\n.pict-panel-edge-right .pict-panel-tab\n{\n\tright: 0;\n\tborder-right: none;\n\tborder-radius: 4px 0 0 4px;\n}\n.pict-panel-edge-right:hover .pict-panel-tab,\n.pict-panel-edge-right .pict-panel-tab:hover\n{\n\tright: 0;\n}\n/* Left panel: tab to the right of the edge */\n.pict-panel-edge-left .pict-panel-tab\n{\n\tleft: 0;\n\tborder-left: none;\n\tborder-radius: 0 4px 4px 0;\n}\n.pict-panel-edge-left:hover .pict-panel-tab,\n.pict-panel-edge-left .pict-panel-tab:hover\n{\n\tleft: 0;\n}\n/* When collapsed \u2014 more visible */\n.pict-panel-edge-collapsed .pict-panel-tab\n{\n\twidth: 10px;\n\theight: 28px;\n\topacity: 0.6;\n}\n.pict-panel-edge-collapsed .pict-panel-tab:hover,\n.pict-panel-edge-collapsed:hover .pict-panel-tab\n{\n\twidth: 20px;\n\theight: 32px;\n\topacity: 1;\n\toverflow: visible;\n\tbackground: var(--pict-panel-bg, #FAF8F4);\n}\n\n/* \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n *  Pict-Modal-Shell \u2014 viewport-managing layout for top / right /\n *  bottom / left panels around a center.\n * \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */\n\n.pict-modal-shell-host { display: block; height: 100%; min-height: 0; }\n.pict-modal-shell\n{\n\tdisplay: flex;\n\tflex-direction: column;\n\twidth: 100%;\n\theight: 100%;\n\tmin-height: 0;\n\tposition: relative;\n\tcolor: var(--pict-modal-fg, var(--theme-color-text-primary, #1a1a1a));\n\tbackground: var(--theme-color-background-primary, transparent);\n}\n.pict-modal-shell-row { display: flex; min-width: 0; min-height: 0; }\n/* \"First added = at the edge\" convention is held by reversing the\n   flex-direction on the bottom row + right side. That way, for ALL\n   four sides, calling addPanel() N times stacks panel #1 against\n   the viewport edge, panel #2 just inside it, panel #3 further in,\n   and so on. Without these reverses, top + left worked that way but\n   bottom + right inverted (first-added at content side, last-added\n   at edge), which surprised callers. */\n.pict-modal-shell-row-top    { flex: 0 0 auto; flex-direction: column; }\n.pict-modal-shell-row-bottom { flex: 0 0 auto; flex-direction: column-reverse; }\n.pict-modal-shell-row-middle\n{\n\tflex: 1 1 0;\n\tflex-direction: row;\n\tmin-height: 0;\n\tposition: relative;\n}\n.pict-modal-shell-side\n{\n\tdisplay: flex;\n\tflex: 0 0 auto;\n\tmin-height: 0;\n}\n.pict-modal-shell-side-left  { flex-direction: row; }\n.pict-modal-shell-side-right { flex-direction: row-reverse; }\n.pict-modal-shell-center\n{\n\tflex: 1 1 0;\n\tmin-width: 0;\n\tmin-height: 0;\n\toverflow: auto;\n\tposition: relative;\n}\n.pict-modal-shell-center-content\n{\n\tmin-height: 100%;\n}\n/* Center column gains this class when at least one Scope:'center'\n   panel is added.  The center stops scrolling internally \u2014 that job\n   moves to the content destination \u2014 and switches to a vertical flex\n   so the destination and any inner panels stack cleanly. */\n.pict-modal-shell-center.pict-modal-shell-center-with-inner-panel\n{\n\tdisplay: flex;\n\tflex-direction: column;\n\toverflow: hidden;\n}\n.pict-modal-shell-center.pict-modal-shell-center-with-inner-panel > .pict-modal-shell-center-content\n{\n\tflex: 1 1 0;\n\tmin-height: 0;\n\toverflow: auto;\n}\n.pict-modal-shell-center.pict-modal-shell-center-with-inner-panel > .pict-modal-shell-panel\n{\n\tflex: 0 0 auto;\n\twidth: 100%;\n}\n\n/* Panels \u2014 base */\n.pict-modal-shell-panel\n{\n\t/* How far the collapse-tab's panel-bg \"merge bar\" extends INTO\n\t   the panel past the tab's geometric edge. Painted via box-shadow\n\t   on the tab (no DOM impact), it masks any 1px theme border on an\n\t   inner element, content padding offset, or resize-handle hover\n\t   bleed in the strip between the tab's panel-facing edge and the\n\t   first real pixel of panel content. Consumers can bump this for\n\t   themes with thicker (2+px) inner borders. */\n\t--pict-modal-collapse-tab-merge: 2px;\n\tposition: relative;\n\tdisplay: flex;\n\tflex-direction: column;\n\tbox-sizing: border-box;\n\tbackground: var(--pict-modal-bg, var(--theme-color-background-panel, #ffffff));\n\tcolor: inherit;\n\tmin-width: 0;\n\tmin-height: 0;\n\ttransition: width 140ms ease, height 140ms ease;\n}\n.pict-modal-shell-panel-content\n{\n\tflex: 1 1 auto;\n\tmin-width: 0;\n\tmin-height: 0;\n\toverflow: auto;\n}\n/* Fixed-mode panels are pure chrome (topbars, status rows). Their\n   content should fit the configured Size exactly \u2014 never scroll. The\n   1px border that .pict-modal-shell-panel-mode-fixed adds on the\n   inner edge shaves 1px off the content's available height, which\n   then triggers a sliver-scrollbar on any inner widget with\n   min-height matching the panel Size. overflow:hidden here suppresses\n   that without affecting resizable/collapsible panels (sidebars,\n   drawers) where scrollable content is the whole point. */\n.pict-modal-shell-panel-mode-fixed > .pict-modal-shell-panel-content\n{\n\toverflow: hidden;\n}\n.pict-modal-shell-panel-content-inner\n{\n\tmin-height: 100%;\n}\n/* Panel boundary \u2014 fixed-mode panels get a hairline border for explicit\n   demarcation. Collapsible / resizable panels DROP the boundary border\n   (background contrast separates them from the center anyway) so the\n   collapse tab can pull out cleanly without a hairline cutting across\n   it. The host stylesheet still gets full control via the panel's own\n   background. */\n.pict-modal-shell-panel-mode-fixed.pict-modal-shell-panel-top    { border-bottom: 1px solid var(--pict-modal-border, var(--theme-color-border-default, #e0e0e0)); }\n.pict-modal-shell-panel-mode-fixed.pict-modal-shell-panel-bottom { border-top:    1px solid var(--pict-modal-border, var(--theme-color-border-default, #e0e0e0)); }\n.pict-modal-shell-panel-mode-fixed.pict-modal-shell-panel-left   { border-right:  1px solid var(--pict-modal-border, var(--theme-color-border-default, #e0e0e0)); }\n.pict-modal-shell-panel-mode-fixed.pict-modal-shell-panel-right  { border-left:   1px solid var(--pict-modal-border, var(--theme-color-border-default, #e0e0e0)); }\n\n/* Resize handle \u2014 absolute on the inner edge of each panel. */\n.pict-modal-shell-panel-resize-handle\n{\n\tposition: absolute;\n\tbackground: transparent;\n\tz-index: 5;\n\ttransition: background-color 120ms ease;\n}\n/* Resize handle hover \u2014 use the active brand's mode-aware primary\n   color (set by pict-section-theme's Brand provider as\n   --brand-color-primary-mode) so the resize affordance picks up the\n   app's wordmark color. Falls back to the theme's brand-primary\n   token if no brand is registered. */\n.pict-modal-shell-panel-resize-handle:hover\n{\n\tbackground: var(--brand-color-primary-mode, var(--theme-color-brand-primary, #2563eb));\n\topacity: 0.4;\n}\n.pict-modal-shell-panel-left   .pict-modal-shell-panel-resize-handle { right: -3px; top: 0; bottom: 0; width: 6px; cursor: col-resize; }\n.pict-modal-shell-panel-right  .pict-modal-shell-panel-resize-handle { left:  -3px; top: 0; bottom: 0; width: 6px; cursor: col-resize; }\n.pict-modal-shell-panel-top    .pict-modal-shell-panel-resize-handle { bottom:-3px; left: 0; right: 0; height: 6px; cursor: row-resize; }\n.pict-modal-shell-panel-bottom .pict-modal-shell-panel-resize-handle { top:   -3px; left: 0; right: 0; height: 6px; cursor: row-resize; }\n\n/* Collapse tab \u2014 slim sliver flush on the panel's OUTER boundary\n   (where the resize handle sits), modelled on retold-content-system's\n   sidebar tab. At rest it's a 6\xD728 px sliver; hover expands to\n   18\xD736 px without overlapping the panel's own content. The tab is\n   positioned with its center on the boundary so half pokes into the\n   adjacent area \u2014 the only place we can safely take over without\n   stepping on app UI inside the panel. Title text only renders in the\n   collapsed state where there's room for it. */\n.pict-modal-shell-panel-collapse-tab\n{\n\tposition: absolute;\n\tdisplay: flex;            /* not inline-flex \u2014 avoids baseline alignment quirks */\n\talign-items: center;\n\tjustify-content: center;\n\toverflow: hidden;\n\tborder: 1px solid var(--pict-modal-border, var(--theme-color-border-default, #d0d7de));\n\tbackground: var(--pict-modal-bg, var(--theme-color-background-panel, #ffffff));\n\tcolor: var(--theme-color-text-muted, #6b7280);\n\tfont: inherit;\n\tfont-size: 10px;\n\tletter-spacing: 0.4px;\n\ttext-transform: uppercase;\n\tcursor: pointer;\n\tz-index: 50;\n\topacity: 0.55;\n\tpadding: 0;\n\tbox-sizing: border-box;\n\tline-height: 0;          /* keep child boxes from inflating around the rotated chevron */\n\t/* Geometry (width/height/right/left) is intentionally NOT animated.\n\t   Sliding the tab's outer edge inward on hover-out makes it look like\n\t   the tab is \"sliding into\" the panel content \u2014 weird visual.\n\t   Snapping the size change instead, and animating only the appearance\n\t   (opacity/color/shadow), gives a clean fade-in/out with no boundary\n\t   weirdness. */\n\ttransition: opacity 160ms ease,\n\t            background-color 160ms ease, color 160ms ease,\n\t            border-color 160ms ease, box-shadow 160ms ease;\n}\n/* Hover state pulls accent color from the active brand (mode-aware,\n   so it's legible in both light + dark) with theme brand-primary as\n   fallback. The whole point of brand colors is that they show up\n   across the app's chrome. */\n.pict-modal-shell-panel-collapse-tab:hover,\n.pict-modal-shell-panel:hover > .pict-modal-shell-panel-collapse-tab\n{\n\topacity: 1;\n\tcolor:        var(--brand-color-primary-mode, var(--theme-color-brand-primary, #2563eb));\n\tborder-color: var(--brand-color-primary-mode, var(--theme-color-brand-primary, #2563eb));\n}\n/* Drop shadow casts AWAY from the panel so the tab feels pulled out\n   (extension of the panel) rather than floating across the boundary.\n   The first shadow value is the merge-bar (panel-bg colored, offset\n   INTO the panel) which has to be repeated here so the hover override\n   doesn't drop it. */\n.pict-modal-shell-panel-left:hover    > .pict-modal-shell-panel-collapse-tab,\n.pict-modal-shell-panel-left    > .pict-modal-shell-panel-collapse-tab:hover\n{\n\tbox-shadow:\n\t\tcalc(-1 * var(--pict-modal-collapse-tab-merge)) 0 0 0 var(--pict-modal-bg, var(--theme-color-background-panel, #ffffff)),\n\t\t3px 0 6px -2px rgba(0, 0, 0, 0.18);\n}\n.pict-modal-shell-panel-right:hover   > .pict-modal-shell-panel-collapse-tab,\n.pict-modal-shell-panel-right   > .pict-modal-shell-panel-collapse-tab:hover\n{\n\tbox-shadow:\n\t\tvar(--pict-modal-collapse-tab-merge) 0 0 0 var(--pict-modal-bg, var(--theme-color-background-panel, #ffffff)),\n\t\t-3px 0 6px -2px rgba(0, 0, 0, 0.18);\n}\n.pict-modal-shell-panel-top:hover     > .pict-modal-shell-panel-collapse-tab,\n.pict-modal-shell-panel-top     > .pict-modal-shell-panel-collapse-tab:hover\n{\n\tbox-shadow:\n\t\t0 calc(-1 * var(--pict-modal-collapse-tab-merge)) 0 0 var(--pict-modal-bg, var(--theme-color-background-panel, #ffffff)),\n\t\t0 3px 6px -2px rgba(0, 0, 0, 0.18);\n}\n.pict-modal-shell-panel-bottom:hover  > .pict-modal-shell-panel-collapse-tab,\n.pict-modal-shell-panel-bottom  > .pict-modal-shell-panel-collapse-tab:hover\n{\n\tbox-shadow:\n\t\t0 var(--pict-modal-collapse-tab-merge) 0 0 var(--pict-modal-bg, var(--theme-color-background-panel, #ffffff)),\n\t\t0 -3px 6px -2px rgba(0, 0, 0, 0.18);\n}\n\n/* Side panels: slim VERTICAL sliver pulled OUT of the panel's outer\n   boundary like a drawer tab. The geometric inner edge sits 1px\n   INSIDE the panel boundary, and the merge-bar box-shadow paints\n   another --pict-modal-collapse-tab-merge px of panel-bg color past\n   it INTO the panel \u2014 together they mask any 1px theme border on an\n   inner element, content padding offset, or resize-handle hover bleed\n   that would otherwise leak between the tab and the panel content.\n   The tab grows OUTWARD only on hover; the inner edge stays put so\n   the tab always looks like an extension of the panel rather than a\n   floating button. Border-left is removed for left panels (and\n   border-right for right panels) so the panel-facing edge is open. */\n.pict-modal-shell-panel-left  > .pict-modal-shell-panel-collapse-tab\n{\n\tright: -5px; top: 14px; width: 6px; height: 28px;\n\tborder-radius: 0 4px 4px 0;\n\tborder-left: 0;\n\tbox-shadow: calc(-1 * var(--pict-modal-collapse-tab-merge)) 0 0 0 var(--pict-modal-bg, var(--theme-color-background-panel, #ffffff));\n}\n.pict-modal-shell-panel-right > .pict-modal-shell-panel-collapse-tab\n{\n\tleft:  -5px; top: 14px; width: 6px; height: 28px;\n\tborder-radius: 4px 0 0 4px;\n\tborder-right: 0;\n\tbox-shadow: var(--pict-modal-collapse-tab-merge) 0 0 0 var(--pict-modal-bg, var(--theme-color-background-panel, #ffffff));\n}\n/* Hover: same inner anchor (panelRight - 1), tab grows outward to\n   width 18 \u2192 right: -17px. Top + height grow downward only (top\n   stays, height extends so the tab visually 'drops' the chevron\n   into view). */\n.pict-modal-shell-panel-left:hover  > .pict-modal-shell-panel-collapse-tab,\n.pict-modal-shell-panel-left  > .pict-modal-shell-panel-collapse-tab:hover\n{\n\twidth: 18px; height: 36px; right: -17px;\n}\n.pict-modal-shell-panel-right:hover > .pict-modal-shell-panel-collapse-tab,\n.pict-modal-shell-panel-right > .pict-modal-shell-panel-collapse-tab:hover\n{\n\twidth: 18px; height: 36px; left: -17px;\n}\n\n/* Top / bottom panels: slim HORIZONTAL sliver pulled OUT of the\n   horizontal boundary, anchored 14 px in from the right. Same\n   inner-edge-anchored + merge-bar pattern as the side panels \u2014 the\n   merge-bar offsets vertically instead of horizontally. */\n.pict-modal-shell-panel-top    > .pict-modal-shell-panel-collapse-tab\n{\n\tbottom: -5px; right: 14px; width: 28px; height: 6px;\n\tborder-radius: 0 0 4px 4px;\n\tborder-top: 0;\n\tbox-shadow: 0 calc(-1 * var(--pict-modal-collapse-tab-merge)) 0 0 var(--pict-modal-bg, var(--theme-color-background-panel, #ffffff));\n}\n.pict-modal-shell-panel-bottom > .pict-modal-shell-panel-collapse-tab\n{\n\ttop:    -5px; right: 14px; width: 28px; height: 6px;\n\tborder-radius: 4px 4px 0 0;\n\tborder-bottom: 0;\n\tbox-shadow: 0 var(--pict-modal-collapse-tab-merge) 0 0 var(--pict-modal-bg, var(--theme-color-background-panel, #ffffff));\n}\n.pict-modal-shell-panel-top:hover    > .pict-modal-shell-panel-collapse-tab,\n.pict-modal-shell-panel-top    > .pict-modal-shell-panel-collapse-tab:hover\n{\n\twidth: 36px; height: 18px; bottom: -17px;\n}\n.pict-modal-shell-panel-bottom:hover > .pict-modal-shell-panel-collapse-tab,\n.pict-modal-shell-panel-bottom > .pict-modal-shell-panel-collapse-tab:hover\n{\n\twidth: 36px; height: 18px; top: -17px;\n}\n\n.pict-modal-shell-panel-collapse-tab-title { display: none; white-space: nowrap; }\n\n/* Auto-generated chevron glyph inside the tab \u2014 only visible once the\n   tab is wide / tall enough to show it (i.e. hover state, or when the\n   panel is collapsed). Direction follows side + state.\n   Sized 5\xD75 (down from 6) so even with rotation the visual stays\n   well clear of the tab's overflow:hidden bounds at 18\xD736 hover and\n   the 24px collapsed tab strip width. flex-shrink:0 ensures the\n   pseudo never collapses to zero in tight tab dimensions. */\n.pict-modal-shell-panel-collapse-tab::before\n{\n\tcontent: '';\n\tdisplay: block;\n\twidth: 5px; height: 5px;\n\tflex-shrink: 0;\n\topacity: 0;\n\tborder-right: 1.5px solid currentColor;\n\tborder-bottom: 1.5px solid currentColor;\n\ttransform: rotate(135deg);\n\ttransform-origin: center center;\n\ttransition: opacity 160ms ease, transform 160ms ease;\n}\n.pict-modal-shell-panel:hover > .pict-modal-shell-panel-collapse-tab::before,\n.pict-modal-shell-panel-collapse-tab:hover::before,\n.pict-modal-shell-panel-collapsed > .pict-modal-shell-panel-collapse-tab::before\n{\n\topacity: 1;\n}\n.pict-modal-shell-panel-right                                       > .pict-modal-shell-panel-collapse-tab::before { transform: rotate(-45deg); }\n.pict-modal-shell-panel-top                                         > .pict-modal-shell-panel-collapse-tab::before { transform: rotate(-135deg); }\n.pict-modal-shell-panel-bottom                                      > .pict-modal-shell-panel-collapse-tab::before { transform: rotate(45deg); }\n.pict-modal-shell-panel-left.pict-modal-shell-panel-collapsed       > .pict-modal-shell-panel-collapse-tab::before { transform: rotate(-45deg); }\n.pict-modal-shell-panel-right.pict-modal-shell-panel-collapsed      > .pict-modal-shell-panel-collapse-tab::before { transform: rotate(135deg); }\n.pict-modal-shell-panel-top.pict-modal-shell-panel-collapsed        > .pict-modal-shell-panel-collapse-tab::before { transform: rotate(45deg); }\n.pict-modal-shell-panel-bottom.pict-modal-shell-panel-collapsed     > .pict-modal-shell-panel-collapse-tab::before { transform: rotate(-135deg); }\n\n/* Collapsed state \u2014 content disappears, only the collapse tab remains. */\n.pict-modal-shell-panel-collapsed > .pict-modal-shell-panel-content\n{\n\tdisplay: none;\n}\n.pict-modal-shell-panel-collapsed > .pict-modal-shell-panel-resize-handle\n{\n\tdisplay: none;\n}\n.pict-modal-shell-panel-left.pict-modal-shell-panel-collapsed,\n.pict-modal-shell-panel-right.pict-modal-shell-panel-collapsed\n{\n\t/* When collapsed, side panels rotate the title for vertical reading. */\n\toverflow: hidden;\n}\n/* When collapsed: the entire panel becomes the tab strip \u2014 full width\n   for sides, full height for top/bottom \u2014 with the title visible\n   vertically (sides) or horizontally (top/bottom). The little sliver\n   tab on the boundary disappears (we don't need it anymore \u2014 clicking\n   anywhere on the panel toggles it back open). */\n.pict-modal-shell-panel-left.pict-modal-shell-panel-collapsed,\n.pict-modal-shell-panel-right.pict-modal-shell-panel-collapsed,\n.pict-modal-shell-panel-top.pict-modal-shell-panel-collapsed,\n.pict-modal-shell-panel-bottom.pict-modal-shell-panel-collapsed\n{\n\toverflow: hidden;\n}\n.pict-modal-shell-panel-collapsed > .pict-modal-shell-panel-collapse-tab\n{\n\t/* Promote the tab to FILL the collapsed panel (not just hug its\n\t   content) so the centered chevron + title group sits in the middle\n\t   of the panel. Without explicit width/height: 100%, the position:\n\t   absolute element shrinks to its natural content size and the\n\t   group ends up flush at the top of the panel \u2014 where the chevron\n\t   gets clipped by the topbar. */\n\tposition: absolute !important;\n\ttop: 0 !important; right: 0 !important; bottom: 0 !important; left: 0 !important;\n\twidth: 100% !important;\n\theight: 100% !important;\n\tborder: 0;\n\tborder-radius: 0;\n\tbackground: transparent;\n\topacity: 0.85;\n\tdisplay: flex;\n\talign-items: center;\n\tjustify-content: center;\n\tgap: 8px;\n\tpadding: 12px 4px;        /* keeps chevron + title clear of edges */\n\tbox-shadow: none;\n\tcolor: var(--theme-color-text-muted, #6b7280);\n\tbox-sizing: border-box;\n\toverflow: hidden;\n}\n.pict-modal-shell-panel-collapsed > .pict-modal-shell-panel-collapse-tab:hover\n{\n\tbackground: var(--theme-color-background-hover, var(--pict-modal-bg, #fff));\n\tcolor: var(--brand-color-primary-mode, var(--theme-color-brand-primary, #2563eb));\n\tbox-shadow: none;\n}\n/* Side panels (collapsed): rotate the title for vertical reading. */\n.pict-modal-shell-panel-left.pict-modal-shell-panel-collapsed   > .pict-modal-shell-panel-collapse-tab,\n.pict-modal-shell-panel-right.pict-modal-shell-panel-collapsed  > .pict-modal-shell-panel-collapse-tab\n{\n\twriting-mode: vertical-rl;\n\ttext-orientation: mixed;\n}\n.pict-modal-shell-panel-collapsed .pict-modal-shell-panel-collapse-tab-title\n{\n\tdisplay: inline;\n}\n\n/* Hidden panels \u2014 when Hidden:true is passed to addPanel, the collapsed\n   state has zero footprint: no collapse tab (the tab is never built),\n   the panel root is display:none, and the resize handle vanishes. The\n   only path to the open state is a programmatic expand()/toggle() from\n   somewhere else in the app (e.g. a topbar gear button). When expanded,\n   the panel renders normally \u2014 so resize/drag handles continue to work\n   while the panel is open. */\n.pict-modal-shell-panel-hidden.pict-modal-shell-panel-collapsed\n{\n\tdisplay: none !important;\n}\n\n/* Overlay panels \u2014 float over the middle row instead of taking layout\n   space. The overlay layer is positioned absolutely inside the middle\n   row; individual overlay panels stack with positive z-index. */\n.pict-modal-shell-overlay-layer\n{\n\tposition: absolute;\n\tinset: 0;\n\tpointer-events: none;\n\tz-index: 10;\n}\n.pict-modal-shell-overlay-layer .pict-modal-shell-panel\n{\n\tpointer-events: auto;\n\tposition: absolute;\n\tbox-shadow: 0 4px 24px rgba(0, 0, 0, 0.18);\n}\n.pict-modal-shell-overlay-layer .pict-modal-shell-panel-left   { left:   0; top: 0; bottom: 0; }\n.pict-modal-shell-overlay-layer .pict-modal-shell-panel-right  { right:  0; top: 0; bottom: 0; }\n.pict-modal-shell-overlay-layer .pict-modal-shell-panel-top    { top:    0; left: 0; right: 0; }\n.pict-modal-shell-overlay-layer .pict-modal-shell-panel-bottom { bottom: 0; left: 0; right: 0; }\n\n/* \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n   Responsive drawer mode \u2014 .pict-modal-shell-drawer-active toggles\n   onto the middle row when any panel with ResponsiveDrawer crosses\n   below its breakpoint. Flips the row's flex-direction from row to\n   column, stacking side panels above the center and stretching them\n   to full width. Each opted-in panel itself gets the\n   .pict-modal-shell-panel-drawer class so per-panel rules below\n   target only the drawer-mode panels (right + non-drawer panels in\n   the same row are unaffected). The drawer height is read from a\n   per-panel --pict-modal-drawer-height CSS variable (default\n   33vh, set in JS from the DrawerHeight option).\n   \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */\n.pict-modal-shell-row-middle.pict-modal-shell-drawer-active\n{\n\tflex-direction: column;\n\t/* The drawer tab lives outside the drawer's bottom edge \u2014 ancestor\n\t   chain MUST allow it to escape clip. */\n\toverflow: visible;\n}\n.pict-modal-shell-row-middle.pict-modal-shell-drawer-active .pict-modal-shell-side\n{\n\t/* Side stacks stretch full-width and lay out their panels as a\n\t   horizontal row of stacked drawers (so two drawers from the same\n\t   side don't end up overlapping). overflow: visible so the\n\t   per-panel tab can extend below the side stack into the workspace. */\n\twidth: 100% !important;\n\tflex-direction: column;\n\toverflow: visible;\n}\n/* The drawer-tagged panel itself: kill the inline width set by\n   _applySize (we override with !important since the inline style has\n   higher specificity than a class selector), then size by height\n   from the CSS variable. Resize handle is hidden in drawer mode\n   because horizontal dragging doesn't translate to vertical sizing\n   and the user already has the collapse tab to dismiss / restore.\n\n   padding-bottom reserves an 18px strip at the bottom of the panel\n   for the tab. The tab sits INSIDE the drawer's footprint \u2014 never\n   below it \u2014 so the workspace header below the drawer is never in\n   the same vertical band as the tab. (Previously the tab hung\n   below the drawer's bottom edge into the workspace's top padding;\n   that made the tab visually compete with the workspace header,\n   even when the tab box-model bounds technically cleared the\n   header.) box-sizing: border-box so the padding eats from the\n   33vh, not adding to it. */\n.pict-modal-shell-panel-drawer\n{\n\twidth: 100% !important;\n\tmax-width: 100% !important;\n\theight: var(--pict-modal-drawer-height, 33vh);\n\ttransition: height 140ms ease;\n\tpadding-bottom: 18px;\n\tbox-sizing: border-box;\n\toverflow: visible !important;\n\t/* Clip the panel bg to its CONTENT area only \u2014 the 18px\n\t   padding-bottom reserve (where the tab lives) becomes\n\t   transparent, so the middle row's primary background shows\n\t   through. Without this the reserve would render with the\n\t   panel's chrome bg, creating a visible \"strip\" between the\n\t   drawer content above and the workspace below \u2014 the tab would\n\t   look like it's sitting on its own miscoloured band rather\n\t   than at the seam between drawer and workspace. */\n\tbackground-clip: content-box;\n}\n.pict-modal-shell-panel-drawer.pict-modal-shell-panel-collapsed\n{\n\t/* Collapsed = \"just the tab strip is visible\". 18px matches the\n\t   panel's tab reserve so the height is consistent across states.\n\t   When this is 0 the tab would have nowhere to render and the\n\t   user couldn't reopen the drawer. */\n\theight: 18px !important;\n\tpadding-bottom: 0 !important;\n\t/* Drop the panel's bg in collapsed state \u2014 without this the 18px\n\t   strip shows the --pict-modal-bg (panel chrome) which doesn't\n\t   match the workspace --theme-color-background-primary below it,\n\t   creating a visible \"drawer band\" around the tab that breaks the\n\t   illusion of the tab belonging to the workspace area. With\n\t   transparent bg the middle row's primary background shows\n\t   through, the strip blends with the workspace, and the tab pill\n\t   reads as a free-floating handle. */\n\tbackground: transparent !important;\n}\n.pict-modal-shell-panel-drawer > .pict-modal-shell-panel-resize-handle\n{\n\tdisplay: none;\n}\n/* The drawer's collapse tab is a horizontal pill protruding from the\n   bottom of the drawer (rather than the inner edge of a side panel).\n   Override the side-panel positioning rules from above so the tab\n   always sits at the drawer's bottom-center seam, in both expanded\n   and collapsed states. The expand-from-zero affordance: when\n   collapsed (height: 0), the tab still hangs below \"where the\n   drawer would be\" \u2014 a small handle the user can click to pull\n   the drawer back down. */\n.pict-modal-shell-panel-drawer > .pict-modal-shell-panel-collapse-tab,\n.pict-modal-shell-panel-drawer.pict-modal-shell-panel-collapsed > .pict-modal-shell-panel-collapse-tab\n{\n\tposition: absolute !important;\n\t/* Anchored to the panel's BOTTOM edge \u2014 the tab lives INSIDE the\n\t   drawer's footprint (in the 18px reserve at the bottom), never\n\t   below it into the workspace. This means the workspace below\n\t   the drawer is never sharing a vertical band with the tab, so\n\t   the workspace header doesn't optically compete with it.\n\t   bottom: 4px aligns the tab's top edge exactly with the panel's\n\t   CONTENT-AREA bottom (panel.height \u2212 padding-bottom 18px). With\n\t   border-top: 0 on the tab, the seam between the drawer content\n\t   above and the tab body is invisible \u2014 they share --pict-modal-bg\n\t   and merge into one shape, the tab reading as a labelled\n\t   extension of the drawer hanging downward. Collapsed state\n\t   keeps the smaller offset (overridden below) because its panel\n\t   has no padding-bottom, so the math doesn't apply. */\n\ttop: auto !important;\n\tbottom: 4px !important;\n\tleft: 50% !important;\n\tright: auto !important;\n\ttransform: translate(-50%, 0) !important;\n\twidth: 64px !important;\n\theight: 14px !important;\n\t/* CRITICAL: border-box + padding: 0 \u2014 the collapsed-state base\n\t   rule inherits \"padding: 12px 4px\" (so the chevron clears the\n\t   edges of a tab that fills a 24px-wide side strip). In drawer\n\t   mode the tab is a 14px tall pill, NOT a strip-fill, so that\n\t   12px vertical padding would balloon the tab's outer height to\n\t   ~38px and crash into the workspace header text. The chevron\n\t   is centered via flex anyway. */\n\tbox-sizing: border-box !important;\n\tpadding: 0 !important;\n\t/* Rounded BOTTOM corners + no top border \u2014 the tab looks like a\n\t   traditional drawer-handle/tab hanging from above. Its rounded\n\t   bottom curves face the workspace (the \"open downward\" affordance\n\t   for a top drawer). border-top: 0 lets the tab visually merge\n\t   with whatever's directly above it inside the panel (sidebar\n\t   content when expanded, the panel background when collapsed). */\n\tborder-radius: 0 0 8px 8px;\n\tborder: 1px solid var(--pict-modal-border, var(--theme-color-border-default, #cfd5dd));\n\tborder-top: 0;\n\tbackground: var(--pict-modal-bg, var(--theme-color-background-panel, #fff));\n\topacity: 0.95;\n\tz-index: 20;\n\t/* The default side-panel hover-grow values would yank the tab off\n\t   to the wrong spot in drawer mode \u2014 neutralise. */\n\tdisplay: flex;\n\talign-items: center;\n\tjustify-content: center;\n}\n.pict-modal-shell-panel-drawer > .pict-modal-shell-panel-collapse-tab:hover,\n.pict-modal-shell-panel-drawer.pict-modal-shell-panel-collapsed > .pict-modal-shell-panel-collapse-tab:hover\n{\n\topacity: 1;\n\twidth: 96px !important;\n\t/* height stays at 14px \u2014 the tab is anchored with bottom, so any\n\t   height growth would push the tab's TOP edge UPWARD past the\n\t   space available above it. In EXPANDED state that crashes into\n\t   the drawer content above; in COLLAPSED state it crashes into\n\t   the topbar's brand stripes. Width-only growth (64 to 96, +50%)\n\t   still gives the \"tab is reaching toward me\" affordance without\n\t   the encroachment. */\n\tcolor: var(--brand-color-primary-mode, var(--theme-color-brand-primary, #2563eb));\n\tborder-color: var(--brand-color-primary-mode, var(--theme-color-brand-primary, #2563eb));\n\tbox-shadow: 0 3px 6px -2px rgba(0, 0, 0, 0.18);\n}\n/* Collapsed-state bottom-offset override. Expanded panels have an\n   18px padding-bottom reserve, and \"bottom: 4px\" anchors the tab's\n   top edge exactly at the content-area boundary (so it merges\n   visually with the drawer above). Collapsed panels have\n   padding-bottom: 0 and a total height of 18px \u2014 \"bottom: 4px\"\n   there would put the tab's top at the panel's actual top edge,\n   crashing the (border-top: 0) tab into the topbar. The smaller\n   \"bottom: 2px\" keeps the 14px tab vertically centered in the 18px\n   strip with 2px margins on either side. */\n.pict-modal-shell-panel-drawer.pict-modal-shell-panel-collapsed > .pict-modal-shell-panel-collapse-tab\n{\n\tbottom: 2px !important;\n}\n/* Chevron inside the tab: point UP when expanded (the drawer\n   collapses UP / out of view, so the arrow indicates \"click me to\n   send the drawer up\"), DOWN when collapsed (the drawer expands DOWN\n   into view). Rotations come from the existing top-panel chevron\n   table: rotate(-135deg) \u2192 UP arrow, rotate(45deg) \u2192 DOWN arrow. */\n.pict-modal-shell-panel-drawer > .pict-modal-shell-panel-collapse-tab::before\n{\n\ttransform: rotate(-135deg) !important;\n}\n.pict-modal-shell-panel-drawer.pict-modal-shell-panel-collapsed > .pict-modal-shell-panel-collapse-tab::before\n{\n\ttransform: rotate(45deg) !important;\n}\n/* The collapse tab's existing title-text span is hidden when reduced\n   to a pill \u2014 there's no horizontal room. The chevron alone reads\n   correctly. */\n.pict-modal-shell-panel-drawer > .pict-modal-shell-panel-collapse-tab .pict-modal-shell-panel-collapse-tab-title,\n.pict-modal-shell-panel-drawer > .pict-modal-shell-panel-collapse-tab .pict-modal-shell-panel-collapse-tab-icon\n{\n\tdisplay: none;\n}\n\n/* Drag-active state \u2014 disable text selection + change cursor globally\n   so resize feels solid even when the cursor briefly leaves the handle. */\n.pict-modal-shell-dragging-x, .pict-modal-shell-dragging-y { user-select: none; }\n.pict-modal-shell-dragging-x * { cursor: col-resize !important; }\n.pict-modal-shell-dragging-y * { cursor: row-resize !important; }\n\n/* Per-panel resize-active state \u2014 kills the panel's collapse/expand\n   width/height transition for the duration of a drag. Without this,\n   every pointermove starts a fresh 140 ms transition and the resize\n   visibly lags behind the cursor (\"choppy\"). With it disabled the\n   panel snaps to the new size on the same frame as the pointer, which\n   feels native. */\n.pict-modal-shell-panel-resizing { transition: none !important; }\n.pict-modal-shell-panel-resizing > .pict-modal-shell-panel-resize-handle\n{\n\tbackground: var(--brand-color-primary-mode, var(--theme-color-brand-primary, #2563eb));\n\topacity: 0.5;\n}\n\n/* Panel popup-attention flash \u2014 fires when popup() is called on an\n   already-open panel. Brief brand-colored inset glow so the user sees\n   that their click landed even though the panel didn't change shape.\n   Class is added by the shell, auto-removed after ~700 ms. */\n@keyframes pict-modal-shell-panel-flash\n{\n\t0%   { box-shadow: inset 0 0 0 0 transparent; }\n\t30%  { box-shadow: inset 0 0 0 3px var(--brand-color-primary-mode, var(--theme-color-brand-primary, #2563eb)); }\n\t100% { box-shadow: inset 0 0 0 0 transparent; }\n}\n.pict-modal-shell-panel-flash\n{\n\tanimation: pict-modal-shell-panel-flash 600ms ease-out;\n}\n"};},{}],63:[function(require,module,exports){const libPictViewClass=require('pict-view');const libPictModalOverlay=require('./Pict-Modal-Overlay.js');const libPictModalConfirm=require('./Pict-Modal-Confirm.js');const libPictModalWindow=require('./Pict-Modal-Window.js');const libPictModalToast=require('./Pict-Modal-Toast.js');const libPictModalTooltip=require('./Pict-Modal-Tooltip.js');const libPictModalPanel=require('./Pict-Modal-Panel.js');const libPictModalDropdown=require('./Pict-Modal-Dropdown.js');const libPictModalShell=require('./Pict-Modal-Shell.js');const _DefaultConfiguration=require('./Pict-Section-Modal-DefaultConfiguration.js');class PictSectionModal extends libPictViewClass{constructor(pFable,pOptions,pServiceHash){let tmpOptions=Object.assign({},_DefaultConfiguration,pOptions);super(pFable,tmpOptions,pServiceHash);this._activeModals=[];this._activeTooltips=[];this._activeToasts=[];this._idCounter=0;this._overlay=new libPictModalOverlay(this);this._confirm=new libPictModalConfirm(this);this._window=new libPictModalWindow(this);this._toast=new libPictModalToast(this);this._tooltip=new libPictModalTooltip(this);this._panel=new libPictModalPanel(this);this._dropdown=new libPictModalDropdown(this);this._shell=new libPictModalShell(this);}onBeforeInitialize(){super.onBeforeInitialize();// Ensure the root class is on the body for CSS variable scoping
if(typeof document!=='undefined'&&document.body){if(!document.body.classList.contains('pict-modal-root')){document.body.classList.add('pict-modal-root');}}return super.onBeforeInitialize();}/**
	 * Generate a unique ID for DOM elements.
	 *
	 * @returns {number}
	 */_nextId(){this._idCounter++;return this._idCounter;}// -- Confirm API --
/**
	 * Show a confirmation dialog.
	 *
	 * @param {string} pMessage - The confirmation message
	 * @param {object} [pOptions] - Options { title, confirmLabel, cancelLabel, dangerous }
	 * @returns {Promise<boolean>}
	 */confirm(pMessage,pOptions){return this._confirm.confirm(pMessage,pOptions);}/**
	 * Show a two-step confirmation dialog.
	 *
	 * If confirmPhrase is set, the user must type it to enable the confirm button.
	 * If no confirmPhrase, the first click changes the button text and the second click confirms.
	 *
	 * @param {string} pMessage - The confirmation message
	 * @param {object} [pOptions] - Options { title, confirmPhrase, phrasePrompt, confirmLabel, cancelLabel }
	 * @returns {Promise<boolean>}
	 */doubleConfirm(pMessage,pOptions){return this._confirm.doubleConfirm(pMessage,pOptions);}// -- Modal Window API --
/**
	 * Show a custom modal window.
	 *
	 * @param {object} [pOptions] - Options { title, content, buttons, closeable, width, onOpen, onClose }
	 * @returns {Promise<string|null>} Resolves with the clicked button Hash, or null on close
	 */show(pOptions){return this._window.show(pOptions);}// -- Tooltip API --
/**
	 * Attach a simple text tooltip to an element.
	 *
	 * @param {HTMLElement} pElement - Target element
	 * @param {string} pText - Tooltip text
	 * @param {object} [pOptions] - Options { position, delay, maxWidth }
	 * @returns {{ destroy: function }}
	 */tooltip(pElement,pText,pOptions){return this._tooltip.tooltip(pElement,pText,pOptions);}/**
	 * Attach a rich HTML tooltip to an element.
	 *
	 * @param {HTMLElement} pElement - Target element
	 * @param {string} pHTMLContent - HTML content
	 * @param {object} [pOptions] - Options { position, delay, maxWidth, interactive }
	 * @returns {{ destroy: function }}
	 */richTooltip(pElement,pHTMLContent,pOptions){return this._tooltip.richTooltip(pElement,pHTMLContent,pOptions);}// -- Toast API --
/**
	 * Show a toast notification.
	 *
	 * @param {string} pMessage - Toast message
	 * @param {object} [pOptions] - Options { type, duration, position, dismissible }
	 * @returns {{ dismiss: function }}
	 */toast(pMessage,pOptions){return this._toast.toast(pMessage,pOptions);}// -- Dropdown API --
/**
	 * Open an anchor-positioned dropdown menu (no backdrop, click-outside
	 * dismisses). Useful for nav menus and split-button addenda.
	 *
	 * @param {HTMLElement|string|object} pAnchor - Element, CSS selector, or
	 *   { left, top, width, height } rect for context-menu style anchoring.
	 * @param {object} pOptions - { items, align, position, minWidth, maxHeight,
	 *   className, closeOnSelect, onSelect, onClose }
	 * @returns {Promise<{Hash, Item}|null>} Selection or null on dismiss.
	 */dropdown(pAnchor,pOptions){return this._dropdown.dropdown(pAnchor,pOptions);}/**
	 * Dismiss any open dropdown.
	 */dismissDropdowns(){this._dropdown.dismissAll();}// -- Panel API --
/**
	 * Attach resizable/collapsible panel behavior to a DOM element.
	 *
	 * @param {string} pTargetSelector - CSS selector for the panel element
	 * @param {object} [pOptions] - Options { position, width, minWidth, maxWidth, collapsible, collapsed, persist, persistKey, onResize, onToggle }
	 * @returns {{ collapse, expand, toggle, setWidth, destroy }} Panel handle
	 */panel(pTargetSelector,pOptions){return this._panel.create(pTargetSelector,pOptions);}// -- Shell API --
/**
	 * Get (or create) a layout shell for a viewport. Idempotent.
	 *
	 * The shell takes ownership of the viewport's contents and manages
	 * top / right / bottom / left panel placement plus a center area.
	 * See Pict-Modal-Shell.js for full panel-config semantics.
	 *
	 * @param {string|HTMLElement} pViewport - selector or element of the
	 *   container the shell should fill (commonly the app's root div).
	 * @param {object} [pOptions]
	 * @param {boolean} [pOptions.Persistence=true]   - autosave panel state to localStorage
	 * @param {string}  [pOptions.PersistenceKey=null]- override scope (default: hostname)
	 * @returns {PictModalShell}
	 */shell(pViewport,pOptions){return this._shell.shell(pViewport,pOptions);}// -- Cleanup API --
/**
	 * Dismiss all open modals.
	 */dismissModals(){let tmpModals=this._activeModals.slice();for(let i=tmpModals.length-1;i>=0;i--){tmpModals[i].dismiss(null);}}/**
	 * Dismiss all active tooltips.
	 */dismissTooltips(){this._tooltip.dismissAll();}/**
	 * Dismiss all active toasts.
	 */dismissToasts(){this._toast.dismissAll();}/**
	 * Dismiss everything: modals, tooltips, and toasts.
	 */dismissAll(){this.dismissModals();this.dismissTooltips();this.dismissToasts();this.dismissDropdowns();}/**
	 * Clean up all DOM elements when the view is destroyed.
	 *//**
	 * Destroy all active panels.
	 */destroyPanels(){this._panel.destroyAll();}destroy(){this.dismissAll();this.destroyPanels();this._overlay.destroy();this._toast.destroy();if(typeof super.destroy==='function'){return super.destroy();}}}module.exports=PictSectionModal;module.exports.default_configuration=_DefaultConfiguration;},{"./Pict-Modal-Confirm.js":54,"./Pict-Modal-Dropdown.js":55,"./Pict-Modal-Overlay.js":56,"./Pict-Modal-Panel.js":57,"./Pict-Modal-Shell.js":58,"./Pict-Modal-Toast.js":59,"./Pict-Modal-Tooltip.js":60,"./Pict-Modal-Window.js":61,"./Pict-Section-Modal-DefaultConfiguration.js":62,"pict-view":53}]},{},[2])(2);});
