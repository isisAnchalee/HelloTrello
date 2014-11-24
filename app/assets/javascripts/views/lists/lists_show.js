TrelloClone.Views.ListsShow= Backbone.CompositeView.extend({

  template: JST['lists/list-show'],

  initialize: function(){
  	this.listenTo(this.model, 'sync', this.render);
    this.listenTo(this.model.cards(), 'add', this.addEntry)
    this.model.cards().each(this.addEntry.bind(this))
  },

  events:{
    "dblclick .list-title": "editListTitle",
    "blur .titleEdit": "saveListTitleEdit",
    "click .add-card": "createNewCard"
  },

  editListTitle: function(event) {
    var $currentTarget = $(event.currentTarget);
    var string = '<input type="text" name="list[title]" value="' + this.model.get("title") +'" data-id="' + this.model.id + '" class="titleEdit">'
    $currentTarget.replaceWith(string)
  },

  saveListTitleEdit: function(event){

    var title = $('.titleEdit').val();
    var list_id = $('.titleEdit').data("id");
    
    var theUrl = "api/lists/" + this.model.id;
    $.ajax({
      url: theUrl ,
      type: "PUT",
      data: { list: { title: title, id: list_id, board_id: this.model.get("board_id") } },
      dataType: 'JSON',
      success: function(resp) {
        var $replaceItem = $('.titleEdit');
        var string = '<span class="list-title">' + resp.title + '</span>'
        $replaceItem.replaceWith(string);
      }
    })
  },

  createNewCard: function(event){
    var newCardString = "<input type='text' name='card[title]' value='Title'> <textarea name='card[description]'></textarea> <input type='submit' value='Submit'>"
    console.log(event.currentTarget);
    $currentTarget = $(event.currentTarget);
    $currentTarget.replaceWith(newCardString);
  },

  render:function(){
  	var content = this.template({ list: this.model })
  	this.$el.html(content);
		this.attachSubviews();
  	return this;
  },

  addEntry: function(card){
    var newSubview = new TrelloClone.Views.CardsShow({ 
    	board: this.board,
    	model: card,
    	list: this.model 
    });

    this.addSubview(".list-cards", newSubview);
  }

});
