TrelloClone.Utils = {};

TrelloClone.Utils.OrdView = {
  resortSubviews: function() {
    var subviews = this.subviews(this.orderOptions.subviewContainer);
    subviews.sort(function(subview1, subview2) {
      return subview1.model.get('ord') - subview2.model.get('ord');
    });
  },
  
  saveOrds: function() {
    var itemElements = this.$(this.orderOptions.modelElement),
        idAttribute = this.orderOptions.modelName + '-id',
        collection = this.collection;

    itemElements.each(function(index, element) {
      var $itemElement = $(element),
          itemId = $itemElement.data(idAttribute);
      var item = new this.collection.model({
        id: itemId,
        list_id: this.model.id,
        board_id: this.model.id,
        ord: index + 1
      }, {
        board: this.model
      });

      item.save();
    }.bind(this));
    
    collection.sort();
    if (this.orderOptions.subviewContainer) {
      this.resortSubviews();
    }
  }
};