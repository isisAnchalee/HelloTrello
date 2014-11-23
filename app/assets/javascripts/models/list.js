TrelloClone.Models.List = Backbone.Model.extend({
	urlRoot: "api/lists",

	initialize: function(options){
		this.board = options.board;
	},

  cards: function () {
    if (this._cards) {
      return this._cards;
    }  else {
      this._cards = new TrelloClone.Collections.Cards([], { list: this })
      return this._cards;
    }
  },

  parse: function (response) {

    if(this.cards){      
      this.cards().set(response.cards);
      delete response.cards;
    }

    return response;
  }
  

});
