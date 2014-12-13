TrelloClone.Views.BoardShowView = Backbone.CompositeView.extend({

  template: JST['boards/show'],

  initialize:function(options){
    this.$el.data('id', this.model.id);
    this.collection = this.model.lists();
    this.listenTo(this.model, 'all', this.render);
    this.listenTo(this.collection, 'add', this.addEntry)
    this.collection.each(this.addEntry.bind(this))
  },

  orderOptions: {
    modelElement: '.list-heading',
    modelName: 'list',
    subviewContainer: '.board-lists'
  },

  events:{
    "click .board-delete-button": "deleteBoard",
    "click .submit-new-list": "newList",
    "click .delete-list": "deleteList",
    "dblclick .funbtn": "editBoardTitle",
    "blur .titleEdit": "saveRecentTitleEdit",
    "sortstop": "saveOrds"
  },

  editBoardTitle: function(event) {
    var $currentTarget = $(event.currentTarget),
                string = '<input type="text" name="post[title]" value="' + this.model.get("title") +'" data-id="' + this.model.id + '" class="titleEdit">';
    $currentTarget.replaceWith(string)
  },

  saveRecentTitleEdit: function(event){

    var title = this.$('.titleEdit').val();
    this.model.set('title', title);
    this.model.save({}, {
        success: function(model){
      }.bind(this)
    });

  },

  deleteBoard: function(){
    var $currentTarget = $(event.target),
               boardId = $currentTarget.data('id'),
                 board = TrelloClone.boards.get(boardId);

    board.destroy();
    Backbone.history.navigate("#", { trigger: true })
  },

  render: function(){
    var content = this.template({ board: this.model });

    this.$el.html(content);
    this.attachSubviews();
    this.onRender();
    this.$('.board-lists').sortable({ connectWith: '.board-lists'})
    return this
  },

  addEntry: function(list){
    var newSubview = new TrelloClone.Views.ListsShow({ 
      board: this.board,
      model: list 
    });
    
    this.addSubview(".board-lists", newSubview);
  },

  newList: function(event){
    var $currentTarget = $(event.target),
                  that = this,
                 title = $('#list-title').val();

    var newList = new TrelloClone.Models.List({ title: title, board_id: this.model.id }, { board: this.model });

    newList.save({}, {
      success: function(){
        that.model.lists().add(newList);
        $('body').removeClass('modal-open');
        $('#newboard').modal('hide');
        $('div.modal-backdrop').remove();

        var newFragment = Backbone.history.getFragment($(this).attr('href'));
        if (Backbone.history.fragment == newFragment) {
            Backbone.history.fragment = null;
            Backbone.history.navigate(newFragment, true);
        }
      }
    });
  },



  deleteList: function(){
    var $currentTarget = $(event.target)
                listId = $currentTarget.data('id')
                  list = this.model.lists().get(listId);

    list.destroy();
    var newFragment = Backbone.history.getFragment($(this).attr('href'));
    if (Backbone.history.fragment == newFragment) {
        Backbone.history.fragment = null;
        Backbone.history.navigate(newFragment, true);
    }
  }

});

_.extend(TrelloClone.Views.BoardShowView.prototype, TrelloClone.Utils.OrdView);
