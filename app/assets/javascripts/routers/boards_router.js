TrelloClone.Routers.Router = Backbone.Router.extend({
	routes:{
		"": "index",
		"boards/:id": "boardsShow"
	},

	initialize: function(options){
		this.$rootEl = options.$rootEl;
		this.collection = options.collection
	},

	index: function(){
		var indexView = new TrelloClone.Views.BoardsIndex({ 
			collection: TrelloClone.boards 
		});
		$('body').css('background-color', '#f9f9f9');
		
		this._swapView(indexView);
	},

	boardsShow: function(id){
		var board = TrelloClone.boards.getOrFetch(id);
		var showView = new TrelloClone.Views.BoardShowView({ model: board });
		$('body').css('background-color', '#0e74af');
		this._swapView(showView);
	},

  _swapView: function (view) {
    this.currentView && this.currentView.remove();
    this.currentView = view;
    this.$rootEl.html(view.render().$el.fadeIn());
  }
});
