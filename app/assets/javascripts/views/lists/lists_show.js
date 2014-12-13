TrelloClone.Views.ListsShow= Backbone.CompositeView.extend({

  template: JST['lists/list-show'],

  className: "list-show list-group",

  initialize: function(){
    this.$el.data('id', this.model.id);
    this.collection = this.model.cards();
    this.listenTo(this.collection, 'add', this.addEntry)
    this.listenTo(this.collection, 'remove', this.removeCard)
    this.listenTo(this.model, 'all', this.render);
    this.collection.each(this.addEntry.bind(this))    
  },

  orderOptions: {
    modelElement: '.card-pane',
    modelName: 'card',
    subviewContainer: '.list-cards'
  },

  events: {
    "dblclick .list-title": "editListTitle",
    "blur .listTitleEdit": "saveListTitleEdit",
    "click .add-card": "createNewCardForm",
    "click .new-card-btn": "createNewCard",
    "click .add-card-close-btn": "closeNewCardPane",
    // "click .delete-card": "deleteCard",
    "sortreceive": "receiveCard",  
    // "sortremove": "removeSortingCard",
    "sortstop": "saveCards"
  },

  editListTitle: function(event) {
    var $currentTarget = $(event.currentTarget),
                string = '<input type="text" name="list[title]" value="' + this.model.get("title") +'" data-id="' + this.model.id + '" class="listTitleEdit">';
    $currentTarget.replaceWith(string)
  },

  saveListTitleEdit: function(event){
    var listTitle = this.$('.listTitleEdit'),
            title = listTitle.val();

    this.model.set('title', title);
    this.model.save({}, {
      success: function(){
      }.bind(this)
    });
    listTitle.html()
  },

  onRender: function () {
    Backbone.CompositeView.prototype.onRender.call(this);
    this.$('.list-cards').sortable({connectWith: '.list-cards'});
  },

  deleteCard: function(event){
    event.preventDefault();
    var $currentTarget = $(event.target),
        cardId = $currentTarget.data("id"),
        card = this.model.cards().get(cardId);
    card.destroy();
  },

  createNewCardForm: function(event){
    var newCardString = "<form><textarea class='new-card-title' name='card[title]'></textarea> <input type='submit' class='btn btn-success new-card-btn' value='Submit'> <button class='add-card-close-btn'> <span class='glyphicon glyphicon-remove' aria-hidden='true'></span></button></form>"
       $currentTarget = $(event.currentTarget);

    $currentTarget.replaceWith(newCardString);
  },

  createNewCard: function(event){
    event.preventDefault();
    var that = this,
       title = this.$(".new-card-title").val();

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
  },

  receiveCard: function(event, ui) {
    // var $cardDisplay = ui.item,
    //     cardId = $cardDisplay.data('card-id'),
    //     newOrd = $cardDisplay.index();

    // var cardClone = new TrelloClone.Models.Card({
    //   id: cardId,
    //   list_id: this.model.id,
    //   ord: newOrd
    // });

    // cardClone.save();
    // this.collection.add(cardClone);
    this.saveCards(event);
  },

  removeSortingCard: function(event, ui) {
    var $cardDisplay = ui.item,
        cardId = $cardDisplay.data('card-id'),
        cards =  this.collection,
        cardToRemove = cards.get(cardId);

    // cards.remove(cardToRemove);
  },

  saveCards: function(event) {
    event.stopPropagation();
    this.saveOrds();
  }
});

_.extend(TrelloClone.Views.ListsShow.prototype, TrelloClone.Utils.OrdView);
