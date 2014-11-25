TrelloClone.Collections.Boards = Backbone.Collection.extend({
	url: 'api/boards',

  model: TrelloClone.Models.Board,

  getOrFetch: function (id) {
    var board = this.get(id),
      boards = this;
    if(!board) {
      board = new boardApp.Models.board({ id: id });
      board.fetch({
        success: function () {
          boards.add(board);
        },
      });
    } else {
      board.fetch();
    }
    return board;
  }
});




