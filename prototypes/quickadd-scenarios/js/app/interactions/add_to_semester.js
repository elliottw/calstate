App.module("Interactions", function(Interactions, App, Backbone, Marionette, $, _){
    Interactions.AddToSemesterController = Marionette.Controller.extend({
        initialize: function(options) {
            _.bindAll(this, 'forward');
            this.forward();
        },
        forward: function() {
            // add course to sidebar
            slots.req102Slot.set('satisfied', true);
            views.req1.render();

            // add course to semester
            views.fall.collection.add(new App.Planner.PlacedCourse({
                course: slots.req102Slot.get('course')
            }));
        }
    });
});
