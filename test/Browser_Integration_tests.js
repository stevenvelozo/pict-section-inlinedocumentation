/**
 * Headless browser integration tests for pict-section-inlinedocumentation.
 *
 * Verifies the inline documentation bookshop example works in a real browser:
 *   1) The bookshop loads and renders the book catalog
 *   2) The help panel opens via button and F1 keyboard shortcut
 *   3) Browsing different screens loads the correct contextual help
 *   4) Editing existing documentation (edit, modify, save, cancel)
 *   5) Creating a new documentation topic at runtime
 *   6) Binding a documentation entry to a route
 *   7) Multiple topics matching a route — navigation between them
 *
 * Screenshots and logs are saved to dist/test-artifacts/ after each key stage.
 *
 * Serves the pre-built bookshop example dist/ folder from a local HTTP server.
 *
 * Requires:
 *   - cd example_applications/bookshop && npx quack build && npx quack copy
 *   - npm install (puppeteer must be available)
 *
 * @license MIT
 * @author Steven Velozo <steven@velozo.com>
 */

const Chai = require('chai');
const Expect = Chai.expect;

const libHTTP = require('http');
const libFS = require('fs');
const libPath = require('path');

const _PackageRoot = libPath.resolve(__dirname, '..');
const _BookshopDistDir = libPath.join(_PackageRoot, 'example_applications', 'bookshop', 'dist');
const _ArtifactsDir = libPath.join(_PackageRoot, 'dist', 'test-artifacts');

/**
 * Ensure the test artifacts directory exists.
 */
function ensureArtifactsDir()
{
	if (!libFS.existsSync(libPath.join(_PackageRoot, 'dist')))
	{
		libFS.mkdirSync(libPath.join(_PackageRoot, 'dist'));
	}
	if (!libFS.existsSync(_ArtifactsDir))
	{
		libFS.mkdirSync(_ArtifactsDir);
	}
}

/**
 * Create a simple HTTP server that serves the bookshop dist/ folder.
 *
 * @param {function} fCallback - Callback with (pError, pServer, pPort)
 */
function startTestServer(fCallback)
{
	let tmpMimeTypes =
	{
		'.html': 'text/html',
		'.js': 'application/javascript',
		'.json': 'application/json',
		'.md': 'text/markdown',
		'.map': 'application/json',
		'.css': 'text/css'
	};

	let tmpServer = libHTTP.createServer(
		(pRequest, pResponse) =>
		{
			let tmpUrl = pRequest.url;

			// Strip query strings
			let tmpQueryIndex = tmpUrl.indexOf('?');
			if (tmpQueryIndex >= 0)
			{
				tmpUrl = tmpUrl.substring(0, tmpQueryIndex);
			}

			// Default to index.html
			if (tmpUrl === '/')
			{
				tmpUrl = '/index.html';
			}

			// Serve from dist/
			let tmpFilePath = libPath.join(_BookshopDistDir, tmpUrl);

			if (!libFS.existsSync(tmpFilePath))
			{
				pResponse.writeHead(404);
				pResponse.end('Not Found: ' + tmpUrl);
				return;
			}

			let tmpStat = libFS.statSync(tmpFilePath);
			if (tmpStat.isDirectory())
			{
				tmpFilePath = libPath.join(tmpFilePath, 'index.html');
				if (!libFS.existsSync(tmpFilePath))
				{
					pResponse.writeHead(404);
					pResponse.end('Not Found: ' + tmpUrl);
					return;
				}
			}

			let tmpExt = libPath.extname(tmpFilePath);
			let tmpContentType = tmpMimeTypes[tmpExt] || 'application/octet-stream';

			let tmpContent = libFS.readFileSync(tmpFilePath);
			pResponse.writeHead(200, { 'Content-Type': tmpContentType });
			pResponse.end(tmpContent);
		});

	tmpServer.listen(0, '127.0.0.1',
		() =>
		{
			let tmpPort = tmpServer.address().port;
			return fCallback(null, tmpServer, tmpPort);
		});
}


suite
(
	'Browser-Integration',
	function()
	{
		// Browser tests need extra time for puppeteer startup and page operations
		this.timeout(60000);

		let _Server;
		let _Port;
		let _Browser;
		let _Page;
		let _Puppeteer;

		// Collected console log entries across the entire run
		let _ConsoleLog = [];
		// Track screenshots taken
		let _ScreenshotsTaken = [];
		// Test results for the summary log
		let _TestResults = [];
		// Run start time
		let _RunStartTime;

		/**
		 * Take a screenshot and save it to the artifacts dir.
		 *
		 * @param {string} pName - Descriptive name (used in filename)
		 * @returns {Promise}
		 */
		function captureScreenshot(pName)
		{
			let tmpFilename = pName.replace(/[^a-zA-Z0-9_-]/g, '_') + '.png';
			let tmpPath = libPath.join(_ArtifactsDir, tmpFilename);

			return _Page.screenshot({ path: tmpPath, fullPage: true })
				.then(function()
				{
					_ScreenshotsTaken.push({ name: pName, file: tmpFilename, timestamp: new Date().toISOString() });
				})
				.catch(function(pError)
				{
					// Screenshot failures should not break the test — log and move on
					_ScreenshotsTaken.push({ name: pName, file: tmpFilename, timestamp: new Date().toISOString(), error: pError.message });
					console.log('  [screenshot warning] ' + pName + ': ' + pError.message);
				});
		}

		/**
		 * Capture a state log entry — collects page state and appdata at this moment.
		 *
		 * @param {string} pStageName - Descriptive stage name
		 * @returns {Promise<Object>} The captured state
		 */
		function captureStateLog(pStageName)
		{
			return _Page.evaluate(function()
			{
				var state = window._Pict && window._Pict.AppData && window._Pict.AppData.InlineDocumentation
					? window._Pict.AppData.InlineDocumentation : {};
				var appState = window._Pict && window._Pict.AppData && window._Pict.AppData.Bookshop
					? window._Pict.AppData.Bookshop : {};
				var provider = window._Pict && window._Pict.providers
					? window._Pict.providers['Pict-InlineDocumentation'] : null;

				return {
					CurrentPath: state.CurrentPath || '',
					CurrentRoute: state.CurrentRoute || '',
					Topic: state.Topic || null,
					EditEnabled: !!state.EditEnabled,
					Editing: !!state.Editing,
					EditingPath: state.EditingPath || '',
					CurrentView: appState.CurrentView || '',
					CurrentBook: appState.CurrentBook ? appState.CurrentBook.Title : null,
					HelpVisible: !!appState.HelpVisible,
					TopicCount: state.Topics ? Object.keys(state.Topics).length : 0,
					CacheCount: provider ? Object.keys(provider._ContentCache).length : 0,
					PanelVisible: document.getElementById('Bookshop-Help-Panel')
						? document.getElementById('Bookshop-Help-Panel').classList.contains('visible')
						: false
				};
			})
			.then(function(pState)
			{
				pState._stage = pStageName;
				pState._timestamp = new Date().toISOString();
				_ConsoleLog.push(pState);
				return pState;
			});
		}

		/**
		 * Write all collected logs and the summary to disk.
		 */
		function writeSummaryLog()
		{
			let tmpSummary =
			{
				runDate: _RunStartTime,
				runDurationMs: Date.now() - new Date(_RunStartTime).getTime(),
				testsRun: _TestResults.length,
				testsPassed: _TestResults.filter(function(r) { return r.passed; }).length,
				testsFailed: _TestResults.filter(function(r) { return !r.passed; }).length,
				tests: _TestResults,
				screenshots: _ScreenshotsTaken,
				stateLog: _ConsoleLog
			};

			let tmpLogPath = libPath.join(_ArtifactsDir, 'test-run-summary.json');
			libFS.writeFileSync(tmpLogPath, JSON.stringify(tmpSummary, null, '\t'));

			// Also write a human-readable log
			let tmpLines = [];
			tmpLines.push('=== Browser Integration Test Run ===');
			tmpLines.push('Date: ' + tmpSummary.runDate);
			tmpLines.push('Duration: ' + tmpSummary.runDurationMs + 'ms');
			tmpLines.push('Tests: ' + tmpSummary.testsPassed + '/' + tmpSummary.testsRun + ' passed');
			tmpLines.push('');
			tmpLines.push('--- Test Results ---');
			for (let i = 0; i < _TestResults.length; i++)
			{
				let tmpR = _TestResults[i];
				tmpLines.push((tmpR.passed ? 'PASS' : 'FAIL') + ': ' + tmpR.name + (tmpR.error ? ' (' + tmpR.error + ')' : ''));
			}
			tmpLines.push('');
			tmpLines.push('--- Screenshots ---');
			for (let i = 0; i < _ScreenshotsTaken.length; i++)
			{
				let tmpS = _ScreenshotsTaken[i];
				tmpLines.push('[' + tmpS.timestamp + '] ' + tmpS.name + ' -> ' + tmpS.file);
			}
			tmpLines.push('');
			tmpLines.push('--- State Log ---');
			for (let i = 0; i < _ConsoleLog.length; i++)
			{
				let tmpEntry = _ConsoleLog[i];
				tmpLines.push('[' + tmpEntry._timestamp + '] ' + tmpEntry._stage);
				tmpLines.push('  View=' + tmpEntry.CurrentView + ' Path=' + tmpEntry.CurrentPath + ' Route=' + tmpEntry.CurrentRoute);
				tmpLines.push('  Topic=' + tmpEntry.Topic + ' Editing=' + tmpEntry.Editing + ' PanelVisible=' + tmpEntry.PanelVisible);
			}
			tmpLines.push('');

			let tmpTextPath = libPath.join(_ArtifactsDir, 'test-run-summary.log');
			libFS.writeFileSync(tmpTextPath, tmpLines.join('\n'));
		}

		/**
		 * Record a test result.
		 *
		 * @param {string} pName - Test name
		 * @param {boolean} pPassed - Whether it passed
		 * @param {string} [pError] - Error message if failed
		 */
		function recordTestResult(pName, pPassed, pError)
		{
			_TestResults.push({ name: pName, passed: pPassed, error: pError || null, timestamp: new Date().toISOString() });
		}


		suiteSetup
		(
			function(fDone)
			{
				_RunStartTime = new Date().toISOString();

				// Ensure artifacts dir
				ensureArtifactsDir();

				// Verify dist/ exists
				if (!libFS.existsSync(libPath.join(_BookshopDistDir, 'index.html')))
				{
					return fDone(new Error(
						'Bookshop dist/index.html not found. Run "cd example_applications/bookshop && npx quack build && npx quack copy" first.'
					));
				}

				if (!libFS.existsSync(libPath.join(_BookshopDistDir, 'bookshop_example.js')))
				{
					return fDone(new Error(
						'Bookshop dist/bookshop_example.js not found. Run "cd example_applications/bookshop && npx quack build" first.'
					));
				}

				// Start the test server
				startTestServer(
					function(pError, pServer, pPort)
					{
						if (pError)
						{
							return fDone(pError);
						}
						_Server = pServer;
						_Port = pPort;

						// Load puppeteer
						try
						{
							_Puppeteer = require('puppeteer');
						}
						catch (pRequireError)
						{
							_Server.close();
							return fDone(new Error(
								'puppeteer is not installed. Run "npm install" to install it as a devDependency.'
							));
						}

						// Launch browser
						_Puppeteer.launch(
							{
								headless: true,
								args: ['--no-sandbox', '--disable-setuid-sandbox'],
								protocolTimeout: 60000
							})
							.then(
								function(pBrowser)
								{
									_Browser = pBrowser;
									return _Browser.newPage();
								})
							.then(
								function(pPage)
								{
									_Page = pPage;

									// Set a reasonable viewport
									return _Page.setViewport({ width: 1400, height: 900 });
								})
							.then(
								function()
								{
									// Capture all console output
									_Page.on('console',
										function(pMessage)
										{
											if (pMessage.type() === 'error')
											{
												console.log('  [browser error]', pMessage.text());
											}
										});

									_Page.on('pageerror',
										function(pError)
										{
											console.log('  [browser page error]', pError.message);
										});

									return fDone();
								})
							.catch(
								function(pError)
								{
									_Server.close();
									return fDone(pError);
								});
					});
			}
		);

		suiteTeardown
		(
			function(fDone)
			{
				// Write all logs and summary
				try
				{
					writeSummaryLog();
					console.log('    Artifacts saved to: dist/test-artifacts/');
					console.log('    Screenshots: ' + _ScreenshotsTaken.length);
				}
				catch (pWriteError)
				{
					console.log('    Warning: could not write test artifacts:', pWriteError.message);
				}

				let tmpCleanupSteps = [];

				if (_Browser)
				{
					tmpCleanupSteps.push(_Browser.close().catch(function() {}));
				}

				Promise.all(tmpCleanupSteps).then(
					function()
					{
						if (_Server)
						{
							_Server.close(fDone);
						}
						else
						{
							fDone();
						}
					});
			}
		);


		// ====================================================================
		// Test 1: Application loads and renders the book catalog
		// ====================================================================
		test
		(
			'Bookshop loads and renders the book catalog',
			function(fDone)
			{
				_Page.goto(`http://127.0.0.1:${_Port}/`, { waitUntil: 'networkidle0', timeout: 15000 })
					.then(function()
					{
						return _Page.waitForSelector('.bookshop-book-card', { timeout: 10000 });
					})
					.then(function()
					{
						return captureScreenshot('01-book-catalog-loaded');
					})
					.then(function()
					{
						return captureStateLog('01-book-catalog-loaded');
					})
					.then(function()
					{
						return _Page.evaluate(function()
						{
							var cards = document.querySelectorAll('.bookshop-book-card');
							var title = document.querySelector('.bookshop-section-title');
							return {
								cardCount: cards.length,
								titleText: title ? title.textContent : null,
								hasPict: typeof window._Pict !== 'undefined',
								hasProvider: !!(window._Pict && window._Pict.providers && window._Pict.providers['Pict-InlineDocumentation'])
							};
						});
					})
					.then(function(pResult)
					{
						Expect(pResult.cardCount).to.be.above(0, 'Should have at least one book card');
						Expect(pResult.titleText).to.equal('Book Catalog');
						Expect(pResult.hasPict).to.be.true;
						Expect(pResult.hasProvider).to.be.true;
						recordTestResult('Bookshop loads and renders the book catalog', true);
						fDone();
					})
					.catch(function(pError) { recordTestResult('Bookshop loads and renders the book catalog', false, pError.message); fDone(pError); });
			}
		);


		// ====================================================================
		// Test 2: Help panel opens via header button and shows content
		// ====================================================================
		test
		(
			'Help panel opens via header button and shows route-matched content',
			function(fDone)
			{
				_Page.evaluate(function()
				{
					var panel = document.getElementById('Bookshop-Help-Panel');
					return panel ? panel.classList.contains('visible') : false;
				})
				.then(function(pWasVisible)
				{
					if (pWasVisible)
					{
						return _Page.evaluate(function() { document.getElementById('Bookshop-Help-CloseBtn').click(); });
					}
				})
				.then(function()
				{
					return _Page.click('#Bookshop-Header-HelpBtn');
				})
				.then(function()
				{
					return _Page.waitForFunction(
						'document.getElementById("Bookshop-Help-Panel") && document.getElementById("Bookshop-Help-Panel").classList.contains("visible")',
						{ timeout: 5000 }
					);
				})
				.then(function()
				{
					return captureScreenshot('02-help-panel-open-book-list');
				})
				.then(function()
				{
					return captureStateLog('02-help-panel-open-book-list');
				})
				.then(function()
				{
					return _Page.evaluate(function()
					{
						var state = window._Pict.AppData.InlineDocumentation;
						var body = document.getElementById('InlineDoc-Content-Body');
						return {
							panelVisible: document.getElementById('Bookshop-Help-Panel').classList.contains('visible'),
							currentPath: state.CurrentPath,
							currentRoute: state.CurrentRoute,
							topic: state.Topic,
							bodyHasContent: body ? body.innerHTML.length > 50 : false
						};
					});
				})
				.then(function(pResult)
				{
					Expect(pResult.panelVisible).to.be.true;
					Expect(pResult.currentPath).to.equal('book-list.md', 'Should load book-list.md for /books route');
					Expect(pResult.topic).to.equal('BOOKSHOP-BOOKLIST');
					Expect(pResult.bodyHasContent).to.be.true;
					recordTestResult('Help panel opens via header button and shows route-matched content', true);
					fDone();
				})
				.catch(function(pError) { recordTestResult('Help panel opens via header button and shows route-matched content', false, pError.message); fDone(pError); });
			}
		);


		// ====================================================================
		// Test 3: Navigate to store page and help updates via route
		// ====================================================================
		test
		(
			'Navigate to store page and help updates to store topic via route matching',
			function(fDone)
			{
				_Page.evaluate(function()
				{
					var panel = document.getElementById('Bookshop-Help-Panel');
					if (panel && panel.classList.contains('visible'))
					{
						window._Pict.PictApplication.toggleHelp();
					}
				})
				.then(function()
				{
					return _Page.evaluate(function() { document.querySelector('.bookshop-book-card').click(); });
				})
				.then(function()
				{
					return _Page.waitForSelector('.bookshop-store-detail', { timeout: 5000 });
				})
				.then(function()
				{
					return captureScreenshot('03-store-page-navigated');
				})
				.then(function()
				{
					return captureStateLog('03-store-page-navigated');
				})
				.then(function()
				{
					return _Page.evaluate(function()
					{
						var state = window._Pict.AppData.InlineDocumentation;
						var appState = window._Pict.AppData.Bookshop;
						return {
							currentView: appState.CurrentView,
							currentBook: appState.CurrentBook ? appState.CurrentBook.Title : null,
							currentRoute: state.CurrentRoute,
							topic: state.Topic,
							currentPath: state.CurrentPath
						};
					});
				})
				.then(function(pResult)
				{
					Expect(pResult.currentView).to.equal('Store');
					Expect(pResult.currentBook).to.be.a('string');
					Expect(pResult.currentRoute).to.match(/^\/books\/store\/\d+$/);
					Expect(pResult.topic).to.equal('BOOKSHOP-STORE');
					Expect(pResult.currentPath).to.equal('store.md');
					recordTestResult('Navigate to store page and help updates to store topic via route matching', true);
					fDone();
				})
				.catch(function(pError) { recordTestResult('Navigate to store page and help updates to store topic via route matching', false, pError.message); fDone(pError); });
			}
		);


		// ====================================================================
		// Test 4: Open help on store page via ? button
		// ====================================================================
		test
		(
			'Help button on store page opens contextual help for the store',
			function(fDone)
			{
				_Page.evaluate(function() { document.getElementById('Bookshop-Help-Store').click(); })
					.then(function()
					{
						return _Page.waitForFunction(
							'document.getElementById("Bookshop-Help-Panel") && document.getElementById("Bookshop-Help-Panel").classList.contains("visible")',
							{ timeout: 5000 }
						);
					})
					.then(function()
					{
						return captureScreenshot('04-store-help-via-question-mark');
					})
					.then(function()
					{
						return captureStateLog('04-store-help-via-question-mark');
					})
					.then(function()
					{
						return _Page.evaluate(function()
						{
							var state = window._Pict.AppData.InlineDocumentation;
							var body = document.getElementById('InlineDoc-Content-Body');
							return {
								panelVisible: document.getElementById('Bookshop-Help-Panel').classList.contains('visible'),
								topic: state.Topic,
								bodyHtml: body ? body.innerHTML.substring(0, 200) : ''
							};
						});
					})
					.then(function(pResult)
					{
						Expect(pResult.panelVisible).to.be.true;
						Expect(pResult.topic).to.equal('BOOKSHOP-STORE');
						Expect(pResult.bodyHtml.length).to.be.above(0);
						recordTestResult('Help button on store page opens contextual help for the store', true);
						fDone();
					})
					.catch(function(pError) { recordTestResult('Help button on store page opens contextual help for the store', false, pError.message); fDone(pError); });
			}
		);


		// ====================================================================
		// Test 5: Edit existing documentation — toggle to edit, modify, save
		// ====================================================================
		test
		(
			'Edit mode: toggle into edit, modify content, and save',
			function(fDone)
			{
				_Page.evaluate(function()
				{
					var state = window._Pict.AppData.InlineDocumentation;
					return {
						editEnabled: state.EditEnabled,
						editing: state.Editing,
						currentPath: state.CurrentPath
					};
				})
				.then(function(pState)
				{
					Expect(pState.editEnabled).to.be.true;
					Expect(pState.editing).to.be.false;

					return _Page.evaluate(function() { document.getElementById('InlineDoc-Edit-Toggle').click(); });
				})
				.then(function()
				{
					return _Page.waitForSelector('#InlineDoc-Editor-Container', { timeout: 5000 });
				})
				.then(function()
				{
					return captureScreenshot('05a-edit-mode-textarea-open');
				})
				.then(function()
				{
					return captureStateLog('05a-edit-mode-textarea-open');
				})
				.then(function()
				{
					return _Page.evaluate(function()
					{
						var state = window._Pict.AppData.InlineDocumentation;
						var editorContainer = document.getElementById('InlineDoc-Editor-Container');
						var saveBtn = document.getElementById('InlineDoc-Edit-Save');
						var cancelBtn = document.getElementById('InlineDoc-Edit-Cancel');
						var editBtn = document.getElementById('InlineDoc-Edit-Toggle');
						return {
							editing: state.Editing,
							editingPath: state.EditingPath,
							hasEditor: !!editorContainer,
							contentLength: (state.EditorSegments && state.EditorSegments.length > 0) ? (state.EditorSegments[0].Content || '').length : 0,
							saveBtnVisible: saveBtn ? saveBtn.style.display !== 'none' : false,
							cancelBtnVisible: cancelBtn ? cancelBtn.style.display !== 'none' : false,
							editBtnHidden: editBtn ? editBtn.style.display === 'none' : false
						};
					});
				})
				.then(function(pResult)
				{
					Expect(pResult.editing).to.be.true;
					Expect(pResult.editingPath).to.equal('store.md');
					Expect(pResult.hasEditor).to.be.true;
					Expect(pResult.contentLength).to.be.above(0, 'Editor should contain markdown');
					Expect(pResult.saveBtnVisible).to.be.true;
					Expect(pResult.cancelBtnVisible).to.be.true;
					Expect(pResult.editBtnHidden).to.be.true;

					return _Page.evaluate(function()
					{
						var editorView = window._Pict.views['InlineDoc-MarkdownEditor'];
						var newContent = '# Edited Store Help\n\nThis was edited by the browser test.\n\n## Browser Test Section\n\nNew content added.';
						if (editorView && typeof editorView.setSegmentContent === 'function')
						{
							editorView.setSegmentContent(0, newContent);
						}
						window._Pict.AppData.InlineDocumentation.EditorSegments[0].Content = newContent;
						return newContent.length;
					});
				})
				.then(function(pNewLength)
				{
					Expect(pNewLength).to.be.above(0);

					return _Page.evaluate(function() { document.getElementById('InlineDoc-Edit-Save').click(); });
				})
				.then(function()
				{
					return _Page.waitForFunction(
						'!document.getElementById("InlineDoc-Editor-Container")',
						{ timeout: 5000 }
					);
				})
				.then(function()
				{
					return captureScreenshot('05b-edit-mode-saved');
				})
				.then(function()
				{
					return captureStateLog('05b-edit-mode-saved');
				})
				.then(function()
				{
					return _Page.evaluate(function()
					{
						var state = window._Pict.AppData.InlineDocumentation;
						var body = document.getElementById('InlineDoc-Content-Body');
						var provider = window._Pict.providers['Pict-InlineDocumentation'];
						var cache = provider._ContentCache['docs/store.md'];
						return {
							editing: state.Editing,
							bodyContainsEdited: body ? body.innerHTML.indexOf('Edited Store Help') >= 0 : false,
							bodyContainsNewSection: body ? body.innerHTML.indexOf('Browser Test Section') >= 0 : false,
							cacheUpdated: cache ? cache.markdown.indexOf('Edited Store Help') >= 0 : false
						};
					});
				})
				.then(function(pResult)
				{
					Expect(pResult.editing).to.be.false;
					Expect(pResult.bodyContainsEdited).to.be.true;
					Expect(pResult.bodyContainsNewSection).to.be.true;
					Expect(pResult.cacheUpdated).to.be.true;
					recordTestResult('Edit mode: toggle into edit, modify content, and save', true);
					fDone();
				})
				.catch(function(pError) { recordTestResult('Edit mode: toggle into edit, modify content, and save', false, pError.message); fDone(pError); });
			}
		);


		// ====================================================================
		// Test 6: Edit and Cancel — content should revert
		// ====================================================================
		test
		(
			'Edit mode: cancel reverts to original rendered content',
			function(fDone)
			{
				_Page.evaluate(function() { document.getElementById('InlineDoc-Edit-Toggle').click(); })
					.then(function()
					{
						return _Page.waitForSelector('#InlineDoc-Editor-Container', { timeout: 5000 });
					})
					.then(function()
					{
						return _Page.evaluate(function()
						{
							var editorView = window._Pict.views['InlineDoc-MarkdownEditor'];
							var newContent = '# CANCELLED CHANGES\n\nThis should not appear.';
							if (editorView && typeof editorView.setSegmentContent === 'function')
							{
								editorView.setSegmentContent(0, newContent);
							}
							window._Pict.AppData.InlineDocumentation.EditorSegments[0].Content = newContent;
						});
					})
					.then(function()
					{
						return captureScreenshot('06a-edit-mode-before-cancel');
					})
					.then(function()
					{
						return _Page.evaluate(function() { document.getElementById('InlineDoc-Edit-Cancel').click(); });
					})
					.then(function()
					{
						return _Page.waitForFunction(
							'!document.getElementById("InlineDoc-Editor-Container")',
							{ timeout: 5000 }
						);
					})
					.then(function()
					{
						return captureScreenshot('06b-edit-mode-after-cancel');
					})
					.then(function()
					{
						return captureStateLog('06-edit-cancel');
					})
					.then(function()
					{
						return _Page.evaluate(function()
						{
							var state = window._Pict.AppData.InlineDocumentation;
							var body = document.getElementById('InlineDoc-Content-Body');
							return {
								editing: state.Editing,
								bodyDoesNotContainCancelled: body ? body.innerHTML.indexOf('CANCELLED CHANGES') < 0 : true,
								bodyContainsSavedContent: body ? body.innerHTML.indexOf('Edited Store Help') >= 0 : false
							};
						});
					})
					.then(function(pResult)
					{
						Expect(pResult.editing).to.be.false;
						Expect(pResult.bodyDoesNotContainCancelled).to.be.true;
						Expect(pResult.bodyContainsSavedContent).to.be.true;
						recordTestResult('Edit mode: cancel reverts to original rendered content', true);
						fDone();
					})
					.catch(function(pError) { recordTestResult('Edit mode: cancel reverts to original rendered content', false, pError.message); fDone(pError); });
			}
		);


		// ====================================================================
		// Test 7: Navigate back to book list and verify help context switches
		// ====================================================================
		test
		(
			'Navigate back to book list and help context switches to book list topic',
			function(fDone)
			{
				_Page.evaluate(function()
				{
					var appState = window._Pict.AppData.Bookshop;
					if (appState.CurrentView !== 'Store')
					{
						window._Pict.PictApplication.showBook(1);
					}
					var panel = document.getElementById('Bookshop-Help-Panel');
					if (panel && panel.classList.contains('visible'))
					{
						window._Pict.PictApplication.toggleHelp();
					}
				})
				.then(function()
				{
					return _Page.waitForSelector('#Bookshop-Store-Back', { timeout: 5000 });
				})
				.then(function()
				{
					return _Page.evaluate(function() { document.getElementById('Bookshop-Store-Back').click(); });
				})
				.then(function()
				{
					return _Page.waitForSelector('.bookshop-book-card', { timeout: 5000 });
				})
				.then(function()
				{
					return captureScreenshot('07-navigated-back-to-book-list');
				})
				.then(function()
				{
					return captureStateLog('07-navigated-back-to-book-list');
				})
				.then(function()
				{
					return _Page.evaluate(function()
					{
						var state = window._Pict.AppData.InlineDocumentation;
						return {
							currentRoute: state.CurrentRoute,
							topic: state.Topic,
							currentPath: state.CurrentPath
						};
					});
				})
				.then(function(pResult)
				{
					Expect(pResult.currentRoute).to.equal('/books');
					Expect(pResult.topic).to.equal('BOOKSHOP-BOOKLIST');
					Expect(pResult.currentPath).to.equal('book-list.md');
					recordTestResult('Navigate back to book list and help context switches to book list topic', true);
					fDone();
				})
				.catch(function(pError) { recordTestResult('Navigate back to book list and help context switches to book list topic', false, pError.message); fDone(pError); });
			}
		);


		// ====================================================================
		// Test 8: F1 keyboard shortcut toggles help
		// ====================================================================
		test
		(
			'F1 keyboard shortcut toggles help panel',
			function(fDone)
			{
				_Page.evaluate(function()
				{
					var panel = document.getElementById('Bookshop-Help-Panel');
					if (panel && panel.classList.contains('visible'))
					{
						window._Pict.PictApplication.toggleHelp();
					}
					return !document.getElementById('Bookshop-Help-Panel').classList.contains('visible');
				})
				.then(function(pIsClosed)
				{
					Expect(pIsClosed).to.be.true;

					return _Page.keyboard.press('F1');
				})
				.then(function()
				{
					return _Page.waitForFunction(
						'document.getElementById("Bookshop-Help-Panel").classList.contains("visible")',
						{ timeout: 5000 }
					);
				})
				.then(function()
				{
					return captureScreenshot('08a-f1-help-opened');
				})
				.then(function()
				{
					return _Page.keyboard.press('F1');
				})
				.then(function()
				{
					return _Page.waitForFunction(
						'!document.getElementById("Bookshop-Help-Panel").classList.contains("visible")',
						{ timeout: 5000 }
					);
				})
				.then(function()
				{
					return captureScreenshot('08b-f1-help-closed');
				})
				.then(function()
				{
					return captureStateLog('08-f1-toggle');
				})
				.then(function()
				{
					return _Page.evaluate(function()
					{
						return !document.getElementById('Bookshop-Help-Panel').classList.contains('visible');
					});
				})
				.then(function(pIsClosed)
				{
					Expect(pIsClosed).to.be.true;
					recordTestResult('F1 keyboard shortcut toggles help panel', true);
					fDone();
				})
				.catch(function(pError) { recordTestResult('F1 keyboard shortcut toggles help panel', false, pError.message); fDone(pError); });
			}
		);


		// ====================================================================
		// Test 9: Create a new documentation topic at runtime (not route-bound)
		// ====================================================================
		test
		(
			'Create a new topic at runtime that is not bound to any route',
			function(fDone)
			{
				_Page.evaluate(function()
				{
					var provider = window._Pict.providers['Pict-InlineDocumentation'];

					provider.addTopic('CUSTOM-HELP',
					{
						TopicHelpFilePath: 'custom-help.md',
						TopicTitle: 'Custom Runtime Help'
					});

					var url = 'docs/custom-help.md';
					var markdown = '# Custom Help Topic\\n\\nThis documentation was created at runtime.\\n\\n## Not Route Bound\\n\\nThis topic has no route association.';
					var html = provider._ContentProvider.parseMarkdown(markdown);
					provider._ContentCache[url] = { html: html, markdown: markdown };

					provider.loadTopicDocument('CUSTOM-HELP');

					var state = window._Pict.AppData.InlineDocumentation;
					return {
						topicExists: !!state.Topics['CUSTOM-HELP'],
						topicTitle: state.Topics['CUSTOM-HELP'] ? state.Topics['CUSTOM-HELP'].TopicTitle : null,
						topicHasRoutes: !!(state.Topics['CUSTOM-HELP'] && state.Topics['CUSTOM-HELP'].Routes),
						activeTopic: state.Topic,
						currentPath: state.CurrentPath
					};
				})
				.then(function(pResult)
				{
					Expect(pResult.topicExists).to.be.true;
					Expect(pResult.topicTitle).to.equal('Custom Runtime Help');
					Expect(pResult.topicHasRoutes).to.be.false;
					Expect(pResult.activeTopic).to.equal('CUSTOM-HELP');
					Expect(pResult.currentPath).to.equal('custom-help.md');

					return _Page.evaluate(function()
					{
						var panel = document.getElementById('Bookshop-Help-Panel');
						if (!panel.classList.contains('visible'))
						{
							window._Pict.PictApplication.toggleHelp();
						}
					});
				})
				.then(function()
				{
					return _Page.waitForFunction(
						'document.getElementById("Bookshop-Help-Panel").classList.contains("visible")',
						{ timeout: 3000 }
					);
				})
				.then(function()
				{
					return captureScreenshot('09-runtime-topic-created');
				})
				.then(function()
				{
					return captureStateLog('09-runtime-topic-created');
				})
				.then(function()
				{
					return _Page.evaluate(function()
					{
						var body = document.getElementById('InlineDoc-Content-Body');
						return {
							hasCustomContent: body ? body.innerHTML.indexOf('Custom Help Topic') >= 0 : false,
							hasNotRouteBound: body ? body.innerHTML.indexOf('Not Route Bound') >= 0 : false
						};
					});
				})
				.then(function(pResult)
				{
					Expect(pResult.hasCustomContent).to.be.true;
					Expect(pResult.hasNotRouteBound).to.be.true;

					return _Page.evaluate(function()
					{
						var provider = window._Pict.providers['Pict-InlineDocumentation'];
						var match = provider.resolveHelpForRoute('/custom');
						return match;
					});
				})
				.then(function(pMatch)
				{
					Expect(pMatch).to.be.null;
					recordTestResult('Create a new topic at runtime that is not bound to any route', true);
					fDone();
				})
				.catch(function(pError) { recordTestResult('Create a new topic at runtime that is not bound to any route', false, pError.message); fDone(pError); });
			}
		);


		// ====================================================================
		// Test 10: Bind a documentation entry to a route
		// ====================================================================
		test
		(
			'Bind an existing topic to a route and verify it resolves',
			function(fDone)
			{
				_Page.evaluate(function()
				{
					var provider = window._Pict.providers['Pict-InlineDocumentation'];

					provider.addRouteToTopic('CUSTOM-HELP', '/custom');
					provider.addRouteToTopic('CUSTOM-HELP', '/custom/*');

					var state = window._Pict.AppData.InlineDocumentation;
					var topic = state.Topics['CUSTOM-HELP'];

					return {
						hasRoutes: Array.isArray(topic.Routes),
						routeCount: topic.Routes ? topic.Routes.length : 0,
						routes: topic.Routes || [],
						resolvedExact: provider.resolveHelpForRoute('/custom'),
						resolvedWildcard: provider.resolveHelpForRoute('/custom/sub/page'),
						resolvedUnrelated: provider.resolveHelpForRoute('/unrelated')
					};
				})
				.then(function(pResult)
				{
					Expect(pResult.hasRoutes).to.be.true;
					Expect(pResult.routeCount).to.equal(2);
					Expect(pResult.routes).to.include('/custom');
					Expect(pResult.routes).to.include('/custom/*');
					Expect(pResult.resolvedExact).to.equal('CUSTOM-HELP');
					Expect(pResult.resolvedWildcard).to.equal('CUSTOM-HELP');
					Expect(pResult.resolvedUnrelated).to.be.null;
					recordTestResult('Bind an existing topic to a route and verify it resolves', true);
					fDone();
				})
				.catch(function(pError) { recordTestResult('Bind an existing topic to a route and verify it resolves', false, pError.message); fDone(pError); });
			}
		);


		// ====================================================================
		// Test 11: Multiple topics match the same route — getTopicsForRoute
		// ====================================================================
		test
		(
			'Multiple topics matching one route, user can navigate between them',
			function(fDone)
			{
				_Page.evaluate(function()
				{
					var provider = window._Pict.providers['Pict-InlineDocumentation'];

					provider.addTopic('BOOKSHOP-FAQ',
					{
						TopicHelpFilePath: 'faq.md',
						TopicTitle: 'Frequently Asked Questions',
						Routes: ['/books', '/books/*']
					});

					var markdown = '# Bookshop FAQ\\n\\nFrequently asked questions about the bookshop.\\n\\n## How do I buy a book?\\n\\nClick on a book card and then click Add to Cart.';
					var html = provider._ContentProvider.parseMarkdown(markdown);
					provider._ContentCache['docs/faq.md'] = { html: html, markdown: markdown };

					var matches = provider.getTopicsForRoute('/books');

					return {
						matchCount: matches.length,
						matchCodes: matches.map(function(m) { return m.TopicCode; }),
						firstMatch: matches.length > 0 ? matches[0].TopicCode : null,
						allHavePatterns: matches.every(function(m) { return m.Pattern && m.MatchLength > 0; })
					};
				})
				.then(function(pResult)
				{
					Expect(pResult.matchCount).to.be.at.least(2, 'Should have at least two topics matching /books');
					Expect(pResult.matchCodes).to.include('BOOKSHOP-BOOKLIST');
					Expect(pResult.matchCodes).to.include('BOOKSHOP-FAQ');
					Expect(pResult.allHavePatterns).to.be.true;

					return _Page.evaluate(function()
					{
						var provider = window._Pict.providers['Pict-InlineDocumentation'];
						provider.loadTopicDocument('BOOKSHOP-BOOKLIST');
						return true;
					});
				})
				.then(function()
				{
					return _Page.waitForFunction(
						'document.getElementById("InlineDoc-Content-Body") && document.getElementById("InlineDoc-Content-Body").innerHTML.indexOf("Book Catalog") >= 0',
						{ timeout: 5000 }
					);
				})
				.then(function()
				{
					return captureScreenshot('11a-multi-match-booklist-topic');
				})
				.then(function()
				{
					return _Page.evaluate(function()
					{
						var provider = window._Pict.providers['Pict-InlineDocumentation'];
						provider.loadTopicDocument('BOOKSHOP-FAQ');
						return true;
					});
				})
				.then(function()
				{
					return _Page.waitForFunction(
						'document.getElementById("InlineDoc-Content-Body") && document.getElementById("InlineDoc-Content-Body").innerHTML.indexOf("Bookshop FAQ") >= 0',
						{ timeout: 5000 }
					);
				})
				.then(function()
				{
					return captureScreenshot('11b-multi-match-faq-topic');
				})
				.then(function()
				{
					return captureStateLog('11-multi-match-navigate');
				})
				.then(function()
				{
					return _Page.evaluate(function()
					{
						var state = window._Pict.AppData.InlineDocumentation;
						var body = document.getElementById('InlineDoc-Content-Body');
						return {
							topic: state.Topic,
							currentPath: state.CurrentPath,
							hasFaqContent: body ? body.innerHTML.indexOf('Bookshop FAQ') >= 0 : false,
							hasHowToBuy: body ? body.innerHTML.indexOf('How do I buy a book') >= 0 : false
						};
					});
				})
				.then(function(pResult)
				{
					Expect(pResult.topic).to.equal('BOOKSHOP-FAQ');
					Expect(pResult.currentPath).to.equal('faq.md');
					Expect(pResult.hasFaqContent).to.be.true;
					Expect(pResult.hasHowToBuy).to.be.true;

					// Switch back to confirm toggle works
					return _Page.evaluate(function()
					{
						var provider = window._Pict.providers['Pict-InlineDocumentation'];
						provider.loadTopicDocument('BOOKSHOP-BOOKLIST');
						return true;
					});
				})
				.then(function()
				{
					return _Page.waitForFunction(
						'document.getElementById("InlineDoc-Content-Body") && document.getElementById("InlineDoc-Content-Body").innerHTML.indexOf("Book Catalog") >= 0',
						{ timeout: 5000 }
					);
				})
				.then(function()
				{
					return captureScreenshot('11c-multi-match-back-to-booklist');
				})
				.then(function()
				{
					return _Page.evaluate(function()
					{
						var state = window._Pict.AppData.InlineDocumentation;
						return { topic: state.Topic, currentPath: state.CurrentPath };
					});
				})
				.then(function(pResult)
				{
					Expect(pResult.topic).to.equal('BOOKSHOP-BOOKLIST');
					Expect(pResult.currentPath).to.equal('book-list.md');
					recordTestResult('Multiple topics matching one route, user can navigate between them', true);
					fDone();
				})
				.catch(function(pError) { recordTestResult('Multiple topics matching one route, user can navigate between them', false, pError.message); fDone(pError); });
			}
		);


		// ====================================================================
		// Test 12: getTopicsForRoute on wildcard-heavy routes
		// ====================================================================
		test
		(
			'getTopicsForRoute returns sorted matches with wildcards',
			function(fDone)
			{
				_Page.evaluate(function()
				{
					var provider = window._Pict.providers['Pict-InlineDocumentation'];

					var matches = provider.getTopicsForRoute('/books/store/5');
					return {
						matchCount: matches.length,
						matchCodes: matches.map(function(m) { return m.TopicCode; }),
						firstMatch: matches.length > 0 ? matches[0].TopicCode : null,
						firstMatchLength: matches.length > 0 ? matches[0].MatchLength : 0,
						lastMatchLength: matches.length > 0 ? matches[matches.length - 1].MatchLength : 0
					};
				})
				.then(function(pResult)
				{
					Expect(pResult.matchCount).to.be.at.least(2, 'Should match BOOKSHOP-STORE and BOOKSHOP-FAQ');
					Expect(pResult.matchCodes).to.include('BOOKSHOP-STORE');
					Expect(pResult.matchCodes).to.include('BOOKSHOP-FAQ');
					Expect(pResult.firstMatch).to.equal('BOOKSHOP-STORE', 'BOOKSHOP-STORE should be first (longer prefix)');
					Expect(pResult.firstMatchLength).to.be.at.least(pResult.lastMatchLength, 'Results should be sorted by match length desc');
					recordTestResult('getTopicsForRoute returns sorted matches with wildcards', true);
					fDone();
				})
				.catch(function(pError) { recordTestResult('getTopicsForRoute returns sorted matches with wildcards', false, pError.message); fDone(pError); });
			}
		);


		// ====================================================================
		// Test 13: Edit the newly created runtime topic
		// ====================================================================
		test
		(
			'Edit the runtime-created topic content',
			function(fDone)
			{
				_Page.evaluate(function()
				{
					var provider = window._Pict.providers['Pict-InlineDocumentation'];
					provider.loadTopicDocument('CUSTOM-HELP');
					var panel = document.getElementById('Bookshop-Help-Panel');
					if (!panel.classList.contains('visible'))
					{
						window._Pict.PictApplication.toggleHelp();
					}
					return true;
				})
				.then(function()
				{
					return _Page.waitForFunction(
						'document.getElementById("InlineDoc-Content-Body") && document.getElementById("InlineDoc-Content-Body").innerHTML.indexOf("Custom Help Topic") >= 0',
						{ timeout: 5000 }
					);
				})
				.then(function()
				{
					return _Page.evaluate(function() { document.getElementById('InlineDoc-Edit-Toggle').click(); });
				})
				.then(function()
				{
					return _Page.waitForSelector('#InlineDoc-Editor-Container', { timeout: 5000 });
				})
				.then(function()
				{
					return captureScreenshot('13a-edit-runtime-topic');
				})
				.then(function()
				{
					return _Page.evaluate(function()
					{
						var editorView = window._Pict.views['InlineDoc-MarkdownEditor'];
						var newContent = '# Updated Custom Help\n\nThis topic was edited after being created at runtime.\n\n## Now With Route Binding\n\nBound to /custom.';
						if (editorView && typeof editorView.setSegmentContent === 'function')
						{
							editorView.setSegmentContent(0, newContent);
						}
						window._Pict.AppData.InlineDocumentation.EditorSegments[0].Content = newContent;
					});
				})
				.then(function()
				{
					return _Page.evaluate(function() { document.getElementById('InlineDoc-Edit-Save').click(); });
				})
				.then(function()
				{
					return _Page.waitForFunction(
						'!document.getElementById("InlineDoc-Editor-Container")',
						{ timeout: 5000 }
					);
				})
				.then(function()
				{
					return captureScreenshot('13b-edit-runtime-topic-saved');
				})
				.then(function()
				{
					return captureStateLog('13-edit-runtime-topic');
				})
				.then(function()
				{
					return _Page.evaluate(function()
					{
						var body = document.getElementById('InlineDoc-Content-Body');
						var provider = window._Pict.providers['Pict-InlineDocumentation'];
						var cache = provider._ContentCache['docs/custom-help.md'];
						return {
							hasUpdatedTitle: body ? body.innerHTML.indexOf('Updated Custom Help') >= 0 : false,
							cacheMarkdownUpdated: cache ? cache.markdown.indexOf('Updated Custom Help') >= 0 : false
						};
					});
				})
				.then(function(pResult)
				{
					Expect(pResult.hasUpdatedTitle).to.be.true;
					Expect(pResult.cacheMarkdownUpdated).to.be.true;
					recordTestResult('Edit the runtime-created topic content', true);
					fDone();
				})
				.catch(function(pError) { recordTestResult('Edit the runtime-created topic content', false, pError.message); fDone(pError); });
			}
		);


		// ====================================================================
		// Test 14: Verify edit disabled hides edit toolbar
		// ====================================================================
		test
		(
			'Disabling edit mode hides the edit toolbar',
			function(fDone)
			{
				_Page.evaluate(function()
				{
					var provider = window._Pict.providers['Pict-InlineDocumentation'];

					provider.setEditEnabled(false);

					var toolbar = document.getElementById('InlineDoc-Edit-Toolbar');
					var isHidden = toolbar ? !toolbar.classList.contains('visible') : true;

					provider.setEditEnabled(true);

					return { toolbarHiddenWhenDisabled: isHidden };
				})
				.then(function(pResult)
				{
					Expect(pResult.toolbarHiddenWhenDisabled).to.be.true;
					recordTestResult('Disabling edit mode hides the edit toolbar', true);

					// Final screenshot
					return captureScreenshot('14-final-state');
				})
				.then(function()
				{
					return captureStateLog('14-final-state');
				})
				.then(function()
				{
					fDone();
				})
				.catch(function(pError) { recordTestResult('Disabling edit mode hides the edit toolbar', false, pError.message); fDone(pError); });
			}
		);
	}
);
