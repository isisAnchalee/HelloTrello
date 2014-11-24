TrelloClone.Views.ListsShow= Backbone.CompositeView.extend({

  template: JST['lists/list-show'],

  initialize: function(){
  	this.listenTo(this.model, 'sync', this.render);
    this.listenTo(this.model.cards(), 'add', this.addEntry)
    this.model.cards().each(this.addEntry.bind(this))
  },

  events:{
    "dblclick .list-title": "editListTitle",
    "blur .listTitleEdit": "saveListTitleEdit",
    "click .add-card": "createNewCard"
  },

  editListTitle: function(event) {
    var $currentTarget = $(event.currentTarget);
    var string = '<input type="text" name="list[title]" value="' + this.model.get("title") +'" data-id="' + this.model.id + '" class="listTitleEdit">'
    $currentTarget.replaceWith(string)
  },

  saveListTitleEdit: function(event){

    var title = this.$('.listTitleEdit').val();
    var list_id = this.$('.listTitleEdit').data("id");
    
    var theUrl = "api/lists/" + this.model.id;
    $.ajax({
      url: theUrl ,
      type: "PUT",
      data: { list: { title: title, id: list_id, board_id: this.model.get("board_id") } },
      dataType: 'JSON',
      success: function(resp) {
        var $replaceItem = $('.listTitleEdit');
        var string = '<span class="list-title">' + resp.title + '</span>'
        $replaceItem.replaceWith(string);
      }
    })
  },

  createNewCard: function(event){
    var newCardString = "<textarea class='new-card-description' name='card[title]'></textarea> <input type='submit' class='btn btn-success new-card-btn' value='Submit'> <button class='add-card-close-btn'> <span class='glyphicon glyphicon-remove' aria-hidden='true'></span></button>"
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
