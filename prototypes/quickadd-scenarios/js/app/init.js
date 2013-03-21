(function(){
    App = new Backbone.Marionette.Application();

    App.module("Core", function(Core, App, Backbone, Marionette, $, _){
        Core.interactionViewExtension = {
            initialize: function() {
                _.bindAll(this, 'runInteraction');
            },
            events: {
                'click': 'runInteraction'
            },
            runInteraction: function(e) {
                if (this.model.has('interactionController')) {
                    new (this.model.get('interactionController'))({
                        sourceEl: this.$el
                    });
                }
                else {
                    console.log('no action');
                }
                e.stopImmediatePropagation();
                e.preventDefault();
            }
        };

        Core.InteractionItemView = Marionette.ItemView.extend(Core.interactionViewExtension);

        Core.activateFilterTable = function(tableId, filterInputId) {
            var tbl = new ttable(tableId);
            tbl.search.enabled = true;
            tbl.search.inputID = filterInputId;
            tbl.search.casesensitive = false;
            tbl.rendertable();
        };
    });
})();
