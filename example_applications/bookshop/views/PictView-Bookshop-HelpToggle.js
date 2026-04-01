const libPictView = require('pict-view');

const _ViewConfiguration =
{
	ViewIdentifier: "Bookshop-HelpToggle",

	DefaultRenderable: "Bookshop-HelpToggle-Display",
	DefaultDestinationAddress: "#Bookshop-Help-Toggle-Container",

	AutoRender: false,

	CSS: /*css*/`
	`,

	Templates:
	[
		{
			Hash: "Bookshop-HelpToggle-Template",
			Template: /*html*/`<span></span>`
		}
	],

	Renderables:
	[
		{
			RenderableHash: "Bookshop-HelpToggle-Display",
			TemplateHash: "Bookshop-HelpToggle-Template",
			DestinationAddress: "#Bookshop-Help-Toggle-Container",
			RenderMethod: "replace"
		}
	]
};

class BookshopHelpToggleView extends libPictView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
	}
}

module.exports = BookshopHelpToggleView;

module.exports.default_configuration = _ViewConfiguration;
