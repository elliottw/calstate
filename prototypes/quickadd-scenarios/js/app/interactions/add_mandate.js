App.module("Interactions", function(Interactions, App, Backbone, Marionette, $, _){
    Interactions.AddMandateController = Marionette.Controller.extend({
        initialize: function(options) {
            _.bindAll(this, 'forward');
            this.forward();
        },
        forward: function() {
            // add course to sidebar
            slots.reqSlot1.set('satisfied', true);
            slots.reqSlot1.unset('interactionController');
            views.req1.render();

            // add course to semester
            views.fall.collection.add(new App.Planner.PlacedCourse({
                course: slots.reqSlot1.get('course')
            }));
        }
    });
});
