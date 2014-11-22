TrelloClone.Views.ListsShow= Backbone.CompositeView.extend({

  template: JST['lists/list-show'],

  initialize: function(){
  	this.listenTo(this.model, 'sync', this.render);
    this.listenTo(this.model.cards(), 'add', this.addEntry)
    this.model.cards().each(this.addEntry.bind(this))
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
