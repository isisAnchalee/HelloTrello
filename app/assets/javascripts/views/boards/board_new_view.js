TrelloClone.Views.BoardNew = Backbone.View.extend({

  template: JST['boards/board-new'],

  render: function(){
  	var content = this.template();
  	this.$el.html(content);
  	return this
  }


});
