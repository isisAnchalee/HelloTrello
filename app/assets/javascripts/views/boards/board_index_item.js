TrelloClone.Views.IndexItem = Backbone.View.extend({

  template: JST['boards/index-item'],

  render: function(){
  	var content = this.template({ board: this.model });
  	this.$el.html(content);
  	return this
  },


});
