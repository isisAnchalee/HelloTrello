TrelloClone.Views.BoardShowView = Backbone.CompositeView.extend({

  template: JST['boards/show'],

  initialize:function(options){
    this.listenTo(this.model, 'sync', this.render);
    this.listenTo(this.model.lists(), 'add', this.addEntry)

    this.model.lists().each(this.addEntry.bind(this))
  },

  events:{
    "click .board-delete-button": "deleteBoard",
    "click .submit-new-list" : "newList",
    'submit form': 'newList',
    "click .delete-list": "deleteList",
    "dblclick .funbtn": "editBoardTitle",
    "blur .titleEdit": "saveRecentTitleEdit"
  },

  editBoardTitle: function(event) {
    var $currentTarget = $(event.currentTarget);
    var string = '<input type="text" name="post[title]" value="' + this.model.get("title") +'" data-id="' + this.model.id + '" class="titleEdit">'
    $currentTarget.replaceWith(string)
  },

  saveRecentTitleEdit: function(event){
    var that = this;

    var title = $('.titleEdit').val();
    var board_id = $('.titleEdit').data("id");
    
    var theUrl = "api/boards/" + this.model.id;
    $.ajax({
      url: theUrl ,
      type: "PUT",
      data: { board: { title: title }},
      dataType: 'JSON',
      success: function(resp) {
        var $replaceItem = $('.titleEdit');
        var string = '<button class="btn btn-primary funbtn">' + resp.title + '</button>'
        $replaceItem.replaceWith(string);
      }
    })
  },


  deleteBoard: function(){
    var $currentTarget = $(event.target);
    var boardId = $currentTarget.data('id');
    var board = TrelloClone.boards.get(boardId);

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
    var newSubview = new TrelloClone.Views.ListsShow({ 
      board: this.board,
      model: list 
    });
    
    this.addSubview(".board-lists", newSubview);
  },

  newList: function(event){
    var that = this;
    var $currentTarget = $(event.target);
    var boardId = $currentTarget.data('id');
    var title = $('#list-title').val();

    var newList = new TrelloClone.Models.List({ title: title, board_id: boardId }, { board: this.model });

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
      },
      error: function(model, resp){
        // console.log(resp.responseText)
      }
    });
  },

  deleteList: function(){
    var $currentTarget = $(event.target);
    var listId = $currentTarget.data('id');
    var list = this.model.lists().get(listId);

    list.destroy();
    var newFragment = Backbone.history.getFragment($(this).attr('href'));
    if (Backbone.history.fragment == newFragment) {
        Backbone.history.fragment = null;
        Backbone.history.navigate(newFragment, true);
    }
  }

});

