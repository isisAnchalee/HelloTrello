TrelloClone.Views.CardsShow = Backbone.CompositeView.extend({
  template: JST['cards/card-show'],
  
	className:'card-display',

  events: {
    'click *:not(button, button *)': 'showModal',
    'click .delete-card': 'deleteCard'
  },

  attributes: function() {
    return {
      'data-card-id': this.model.id
    };
  },

  deleteCard: function(event){
    event.preventDefault();
    this.model.destroy();
  },

  render: function () {
    var content = this.template({
      card: this.model
    });

    this.$el.html(content);
    return this;
  },

  showModal: function (event) {
    if (event && event.target && $(event.target).is('button, button *')) return;

    this.modalView = this.modalView ||
      new TrelloClone.Views.CardModal({ model: this.model });
    $('body').prepend(this.modalView.render().$el);
    this.modalView.delegateEvents();
  },

  initialize:function(){
  	this.listenTo(this.model, 'sync', this.render);
  }

});
