App.module("Interactions", function(Interactions, App, Backbone, Marionette, $, _){
    Interactions.AddToSemesterController = Marionette.Controller.extend({
        initialize: function(options) {
            _.bindAll(this, 'forward');
            this.showInfo();
        },

        showInfo: function() {
            var view = new App.Catalog.CourseInfoView({
                model: new Backbone.Model({
                    course: slots.reqSlot2.get('course'),
                    terms: [
                        {label: 'Fall 2013', selected: true}
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
            slots.reqSlot2.set('satisfied', true);
            views.req1.render();

            // add course to semester
            views.fall.collection.add(new App.Planner.PlacedCourse({
                course: slots.reqSlot2.get('course')
            }));
            views.fall.undelegateEvents();
        }
    });
});
