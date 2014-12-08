TrelloClone.Views.CardsShow = Backbone.CompositeView.extend({
  template: JST['cards/card-show'],

	className:'card-display',
	
  render: function(){
  	var content =	this.template({ card: this.model });
  	this.$el.html(content);
  	return this;
  },

  initialize:function(){
  	this.listenTo(this.model, 'sync', this.render);
  }

});
