App.module("Interactions", function(Interactions, App, Backbone, Marionette, $, _){
    Interactions.addElectiveController = Marionette.Controller.extend({
        initialize: function(options) {
            _.bindAll(this, 'forward');
            this.forward();
        },
        forward: function() {

        }
    });
});
