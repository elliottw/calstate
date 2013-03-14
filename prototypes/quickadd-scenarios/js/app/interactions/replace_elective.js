App.module("Interactions", function(Interactions, App, Backbone, Marionette, $, _){
    Interactions.ReplaceElectiveController = Marionette.Controller.extend({
        initialize: function(options) {
            _.bindAll(this, 'forward');
            this.forward();
        },
        forward: function() {
            // add course to sidebar
            var newCourse = {code: 'ELEC 105'};
            slots.elecSlot2.set('course', newCourse);
            slots.elecSlot2.unset('interactionController');
            views.req1.render();

            // add course to semester
            placed.course2.set('course', newCourse);
            views.fall.render();
        }
    });
});
