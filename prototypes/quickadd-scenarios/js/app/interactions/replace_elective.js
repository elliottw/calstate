App.module("Interactions", function(Interactions, App, Backbone, Marionette, $, _){
    Interactions.ReplaceElectiveController = Marionette.Controller.extend({
        initialize: function(options) {
            _.bindAll(this, 'forward');
            this.forward();
        },
        forward: function() {
            // add course to sidebar
            var newCourse = {code: 'ELEC 103'};
            slots.elecSlot1.set('course', newCourse);
            slots.elecSlot1.unset('interactionController');
            views.req1.render();

            // add course to semester
            placed.course1.set('course', newCourse);
            views.fall.render();
        }
    });
});
