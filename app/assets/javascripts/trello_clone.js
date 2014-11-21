window.TrelloClone = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function() {

  	var $rootEl = $('#main');
    
  	TrelloClone.boards = new TrelloClone.Collections.Boards();

  	TrelloClone.boards.fetch();

  	new TrelloClone.Routers.Router({ 
  		$rootEl: $rootEl, 
  		collection: TrelloClone.boards
  	});

  	Backbone.history.start();
  }
};

