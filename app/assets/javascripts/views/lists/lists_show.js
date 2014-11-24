TrelloClone.Views.ListsShow= Backbone.CompositeView.extend({

  template: JST['lists/list-show'],

  className: 'hacky',

  initialize: function(){
  	this.listenTo(this.model, 'sync', this.render);
    this.listenTo(this.model.cards(), 'add', this.addEntry)
    this.listenTo(this.model.cards(), 'remove', this.removeCard)
    this.model.cards().each(this.addEntry.bind(this))    
  },

  events: {
    "dblclick .list-title": "editListTitle",
    "blur .listTitleEdit": "saveListTitleEdit",
    "click .add-card": "createNewCardForm",
    "click .new-card-btn": "createNewCard",
    "click .add-card-close-btn": "closeNewCardPane",
    "click .delete-card": "deleteCard"
  },

  editListTitle: function(event) {
    var $currentTarget = $(event.currentTarget);
    var string = '<input type="text" name="list[title]" value="' + this.model.get("title") +'" data-id="' + this.model.id + '" class="listTitleEdit">'
    $currentTarget.replaceWith(string)
  },

  saveListTitleEdit: function(event){
    var title = this.$('.listTitleEdit').val();
    this.model.set('title', title);
    this.model.save({}, {
      success: function(){
      }.bind(this)
    });
  },

  onRender: function () {
    Backbone.CompositeView.prototype.onRender.call(this);
    this.$('.list-cards').sortable({connectWith: '.list-cards'});
  },

  deleteCard: function(){
    var $currentTarget = $(event.target);
    var cardId = $currentTarget.data("id");
    var card = this.model.cards().get(cardId);
    card.destroy();
  },

  createNewCardForm: function(event){
    var newCardString = "<form><textarea class='new-card-title' name='card[title]'></textarea> <input type='submit' class='btn btn-success new-card-btn' value='Submit'> <button class='add-card-close-btn'> <span class='glyphicon glyphicon-remove' aria-hidden='true'></span></button></form>"
    $currentTarget = $(event.currentTarget);
    $currentTarget.replaceWith(newCardString);
  },

  createNewCard: function(event){
    event.preventDefault();
    var that = this;
    var title = this.$(".new-card-title").val();

    var newCard = new TrelloClone.Models.Card({
      title: title,
      list_id: this.model.id,
      description: 'fill in later'
    });

    newCard.save({}, {
      success: function(){
        that.model.cards().add(newCard);
        that.addCardDiv();
        that.$('.new-card-btn').remove();
        that.$('.add-card-close-btn').remove();
      }
    });
  },

  addCardDiv: function(){
    var addCardPaneString = "<div class='add-card'>Add a card... </div>";
    this.$('.new-card-title').replaceWith(addCardPaneString);

  },

  closeNewCardPane: function(event){
    event.preventDefault();
    var addCardPaneString = "<div class='add-card'>Add a card... </div>";
    this.$('.new-card-title').remove();
    this.$('.new-card-btn').remove();
    $currentTarget = $(event.currentTarget);
    $currentTarget.replaceWith(addCardPaneString);
  },

  removeCard: function(card){
    var cardSubview =
      _(this.subviews()['.list-cards']).find(function(subview){
        return subview.model == card;
      });

    this.removeSubview(".list-cards", cardSubview);
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
