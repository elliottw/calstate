App.module("Interactions", function(Interactions, App, Backbone, Marionette, $, _){
    Interactions.AddMandateController = Marionette.Controller.extend({
        initialize: function(options) {
            this.course = {
                code: 'REQ 101'
            };

            _.bindAll(this, 'forward');
            this.forward();
        },
        forward: function() {
            var cid = Interactions.findCourseModel(this.course.code, views.req1.collection);

            // add course to sidebar
            var sidebarModel = views.req1.collection.get(cid);
            sidebarModel.set('satisfied', true);
            sidebarModel.unset('interactionController');
            views.req1.render();

            // add course to semester
            views.fall.collection.add(new App.Planner.PlacedCourse({
                course: this.course
            }));
        }
    });
});
