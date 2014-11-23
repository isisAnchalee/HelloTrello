TrelloClone.Views.BoardShowView = Backbone.CompositeView.extend({

  template: JST['boards/show'],

  initialize:function(options){
    this.listenTo(this.model, 'sync', this.render);
    this.listenTo(this.model.lists(), 'add', this.addEntry)

    this.model.lists().each(this.addEntry.bind(this))
  },

  events:{
    "click .board-delete-button": "deleteBoard"
  },

  deleteBoard: function(){
    var $currentTarget = $(event.target);

    var boardId = $currentTarget.data('id');

    var board = TrelloClone.boards.get(boardId);
    console.log("deleted!!");
    board.destroy();
    Backbone.history.navigate("#", { trigger: true })
  },

  render: function(){
    var content = this.template({ board: this.model });
    this.$el.html(content);
    this.attachSubviews();
    return this
  },

  addEntry: function(list){
    var newSubview = new TrelloClone.Views.ListsShow({ board: this.board,
    model: list });
    this.addSubview(".board-lists", newSubview);
  }

});

