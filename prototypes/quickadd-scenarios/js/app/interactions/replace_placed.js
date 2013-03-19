App.module("Interactions", function(Interactions, App, Backbone, Marionette, $, _){
    Interactions.ReplacePlacedController = Marionette.Controller.extend({
        initialize: function(options) {
            _.bindAll(this, 'forward');
            this.newCourse = {code: 'ELEC 105'};
            this.showCatalog();
        },

        showCatalog: function() {
            var view = new App.Catalog.QuickCatalogView({
                model: new Backbone.Model({
                    title: 'Fall 2013 Courses'
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
                        {label: 'Fall 2013', selected: true}
                    ],
                    satisfies: [
                        {label: 'Block E', checked: true}
                    ],
                    title: 'Fall 2013 Courses',
                    buttonText: 'Replace Course'
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
            slots.elecSlot2.set('course', this.newCourse);
            views.req1.render();

            // add course to semester
            placed.course2.set('course', this.newCourse);
            placed.course2.unset('interactionController');
            views.fall.render();
        }
    });
});
