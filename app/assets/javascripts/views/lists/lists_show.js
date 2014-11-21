TrelloClone.Views.ListsShow= Backbone.CompositeView.extend({

  template: JST['lists/list-show'],

  initialize: function(){

  },

  render:function(){
  	var content = this.template({ list: this.model })
  	this.$el.html(content);
  	
  	return this;
  }

});
