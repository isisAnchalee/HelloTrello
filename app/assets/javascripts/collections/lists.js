TrelloClone.Collections.Lists = Backbone.Collection.extend({
	url: 'api/lists',
	comparator: 'ord',
  model: TrelloClone.Models.List,

	initialize: function(attributes, options){
		this.board = options.board;
	}

});
