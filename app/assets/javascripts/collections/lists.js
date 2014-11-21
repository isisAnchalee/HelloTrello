TrelloClone.Collections.Lists = Backbone.Collection.extend({

	initialize: function(options){
		this.board = options.board;
	},

	url: "api/lists",

  model: TrelloClone.Models.List

});
