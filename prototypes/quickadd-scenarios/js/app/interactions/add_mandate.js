App.module("Interactions", function(Interactions, App, Backbone, Marionette, $, _){
    Interactions.AddMandateController = Marionette.Controller.extend({
        initialize: function(options) {
            _.bindAll(this, 'forward');

            var view = new App.Catalog.CourseInfoView({
                model: new Backbone.Model({
                    course: slots.reqSlot1.get('course'),
                    terms: [
                        {label: 'Fall 2013', selected: false},
                        {label: 'Spring 2014', selected: false},
                        {label: 'Fall 2014', selected: false}
                    ],
                    satisfies: []
                })
            });

            App.quickAddRegion.show(view);

            var that = this;
            view.on('courseSelected', function() {
                that.forward();
            });
        },
        forward: function() {
            App.quickAddRegion.close();

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
