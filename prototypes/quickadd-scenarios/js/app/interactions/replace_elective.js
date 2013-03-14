App.module("Interactions", function(Interactions, App, Backbone, Marionette, $, _){
    Interactions.replaceElectiveController = Marionette.Controller.extend({
        initialize: function(options) {
            this.finishAction();
        },
        finishAction: function() {

        }
    });
});
