TrelloClone.Views.ListsShow= Backbone.CompositeView.extend({

  template: JST['lists/list-show'],

  className: "list-show list-group",

  initialize: function(){
    this.$el.data('id', this.model.id);
    this.collection = this.model.cards();
  	this.listenTo(this.model, 'sync', this.render);
    this.listenTo(this.collection, 'add', this.addEntry)
    this.listenTo(this.collection, 'remove', this.removeCard)
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
    "click .delete-card": "deleteCard",
    "sortreceive": "receiveCard",
    "sortremove": "removeCard",
    "sortstop": "saveCards"
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
    var card = this.collection.get(cardId);
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
    var $cardDisplay = ui.item,
        cardId = $cardDisplay.data('card-id'),
        newOrd = $cardDisplay.index();

    var cardClone = new TrelloClone.Models.Card({
      id: cardId,
      list_id: this.model.id,
      ord: newOrd
    });

    cardClone.save();
    this.collection.add(cardClone, { silent: true });
    this.saveCards(event);
  },
  
  removeCard: function(event, ui) {
    var $cardDisplay = ui.item,
        cardId = $cardDisplay.data('card-id'),
        cards = this.collection,
        cardToRemove = cards.get(cardId),
        cardSubviews = this.subviews('.list-cards');
    cards.remove(cardToRemove);

    var subviewToRemove = _.findWhere(cardSubviews, {model: cardToRemove});
    cardSubviews.splice(cardSubviews.indexOf(subviewToRemove), 1);
  },

  saveCards: function(event) {
    event.stopPropagation(); // Prevent list sorting listener from firing.
    this.saveOrds();
  }
});

_.extend(TrelloClone.Views.ListsShow.prototype, TrelloClone.Utils.OrdView);
