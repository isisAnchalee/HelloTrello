TrelloClone.Views.BoardsIndex = Backbone.CompositeView.extend({

  template: JST['boards/index'],

  initialize:function(options){
  	this.listenTo(this.collection, 'sync', this.render);
  	this.listenTo(this.collection, 'add remove', this.addEntry);
  	this.$rootEl = options.$rootEl;

  	this.collection.each(this.addEntry.bind(this));
  },

  events: {
    'submit form': 'submit'
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

  submit: function (event) {
    event.preventDefault();
    var title = $('#board-title').val();
    var user_id = $('#user-id').val();
    var newBoard = new TrelloClone.Models.Board({title: title, user_id: user_id})
    newBoard.save({},{
      success: function(){
        TrelloClone.boards.add(newBoard);

      }
    })
  }

});
