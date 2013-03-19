App.module("Interactions", function(Interactions, App, Backbone, Marionette, $, _){
    Interactions.AddElectiveController = Marionette.Controller.extend({
        initialize: function(options) {
            _.bindAll(this, 'forward');
            this.newCourse = {code: 'ELEC 103'};
            this.showCatalog();
        },

        showCatalog: function() {
            var view = new App.Catalog.QuickCatalogView({
                model: new Backbone.Model({
                    title: 'Block E Courses'
                })
            });
            App.quickAddRegion.show(view);

            var that = this;
            view.on('rowSelected', function() {
                that.showInfo();
            });
        },

        showInfo: function() {
            var view = new App.Catalog.CourseInfoView({
                model: new Backbone.Model({
                    course: this.newCourse,
                    terms: [
                        {label: 'Fall 2013', selected: false},
                        {label: 'Spring 2014', selected: false},
                        {label: 'Fall 2014', selected: false}
                    ],
                    satisfies: [
                        {label: 'Block E', checked: true, fixed: true}
                    ],
                    title: 'Block E Courses',
                    buttonText: 'Add Course'
                })
            });

            App.quickAddRegion.show(view);

            var that = this;
            view.on('courseSelected', function() {
                that.forward();
            });
        },
        forward: function() {
            // add course to sidebar
            slots.elecSlot3.set('course', this.newCourse);
            slots.elecSlot3.unset('interactionController');
            views.req1.render();

            // add course to semester
            views.fall.collection.add(new App.Planner.PlacedCourse({
                course: this.newCourse
            }));

            App.quickAddRegion.close();
        }
    });
});
