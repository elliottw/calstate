App.module("Interactions", function(Interactions, App, Backbone, Marionette, $, _){
    Interactions.AddElectiveController = Marionette.Controller.extend({
        initialize: function(options) {
            _.bindAll(this, 'forward');
            this.newCourse = {code: 'HIST 102'};
            this.sourceEl = options.sourceEl;
            this.showCatalog();
        },

        showCatalog: function() {
            var view = new App.Catalog.QuickCatalogView({
                model: new Backbone.Model({
                    filter: 'satisfiesH'
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

            // get body click events to close popover
            $('.popover').on('click', function(e) {
                e.stopImmediatePropagation();
                e.preventDefault();
            });
            $(document).on('click', function(e) {
                that.popoverRegion.close();
                that.sourceEl.popover('destroy');
                delete that.popoverRegion;
                $(document).off('click');
            });

            App.Core.activateFilterTable('tbl-catalog', 'tbl-catalog-filter');
            $('#tbl-catalog-filter').focus();

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
                        {label: 'Spring 2014', selected: true},
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
            $(document).off('click');

            // don't use Core.placeCourse here so we can add a new course

            // add course to sidebar
            slots.elec3.set('course', this.newCourse);
            slots.elec3.unset('interactionController');
            views.electiveRequirementView.render();

            // add course to semester
            views.spr14.collection.add(new App.Planner.PlacedCourse({
                course: this.newCourse
            }));
        }
    });
});
