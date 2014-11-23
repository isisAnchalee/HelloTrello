TrelloClone.Views.BoardsIndex = Backbone.CompositeView.extend({

  template: JST['boards/index'],

  initialize:function(options){
  	this.listenTo(this.collection, 'sync', this.render);
  	this.listenTo(this.collection, 'add', this.addEntry);
  	this.$rootEl = options.$rootEl;

  	this.collection.each(this.addEntry.bind(this));
  },

  render: function(){
    var content = this.template({ boards: this.collection});

    this.$el.html(content);
    this.attachSubviews();

    return this
  },

  addEntry: function(board){
    var newSubview = new TrelloClone.Views.IndexItem({ model: board });
    this.addSubview(".entries", newSubview);

  },

  events:{
    "click .new-board": "createNewBoard"
  },

  createNewBoard: function(){
    var newBoardForm = new TrelloClone.Views.BoardNew();
    this.addSubview(".new-board-form", newBoardForm)
  }

});
