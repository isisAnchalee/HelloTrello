TrelloClone.Collections.Boards = Backbone.Collection.extend({
	url: 'api/boards',

  model: TrelloClone.Models.Board,

  getOrFetch: function(id){
  	var targetBoard = this.get(id);
  	if (targetBoard){
  		targetBoard.fetch();
  		return targetBoard;
  	} else {
  		var newBoard = new TrelloClone.Models.Board({id: id});
      newBoard.fetch();
  		this.add(newBoard);
  		return newBoard;
  	}
  }

});

