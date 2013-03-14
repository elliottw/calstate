App.module("Interactions", function(Interactions, App, Backbone, Marionette, $, _){
    Interactions.AddElectiveController = Marionette.Controller.extend({
        initialize: function(options) {
            _.bindAll(this, 'forward');
            this.forward();
        },
        forward: function() {
            // add course to sidebar
            var course = {code: 'ELEC 103'};
            slots.elecSlot3.set('course', course);
            slots.elecSlot3.unset('interactionController');
            views.req1.render();

            // add course to semester
            views.fall.collection.add(new App.Planner.PlacedCourse({
                course: course
            }));
        }
    });
});
