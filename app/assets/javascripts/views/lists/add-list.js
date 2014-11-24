TrelloClone.Views.AddList = Backbone.View.extend({

  template: JST['lists/add-list'],

  render: function(){
  	var content = this.template();
  	this.$el.html(content);
  	return this
  }
});
