App.module("Interactions", function(Interactions, App, Backbone, Marionette, $, _){
    Interactions.AddElectiveController = Marionette.Controller.extend({
        initialize: function(options) {
            _.bindAll(this, 'forward');
            this.newCourse = {code: 'ELEC 103'};
            this.sourceEl = options.sourceEl;
            this.showCatalog();
        },

        showCatalog: function() {
            var view = new App.Catalog.QuickCatalogView({
                model: new Backbone.Model({
                    filter: 'satisfies'
                })
            });

            this.sourceEl.popover({
                html: true,
                content: ' ',
                placement: 'left',
                title: "All 'Hist' Courses"
            });
            this.sourceEl.popover('show');
            this.popoverRegion = new Marionette.Region({
                el: '.popover-content'
            });

            this.popoverRegion.show(view);

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

            $('.popover-title').text(this.newCourse.code);
            this.popoverRegion.show(view);

            var that = this;
            view.on('courseSelected', function() {
                that.forward();
            });
        },
        forward: function() {
            this.popoverRegion.close();
            this.sourceEl.popover('destroy');
            delete this.popoverRegion;

            // add course to sidebar
            slots.elec3.set('course', this.newCourse);
            slots.elec3.unset('interactionController');
            views.electiveRequirementView.render();

            // add course to semester
            views.fall13.collection.add(new App.Planner.PlacedCourse({
                course: this.newCourse
            }));
        }
    });
});
