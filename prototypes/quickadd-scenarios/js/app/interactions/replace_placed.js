App.module("Interactions", function(Interactions, App, Backbone, Marionette, $, _){
    Interactions.ReplacePlacedController = Marionette.Controller.extend({
        initialize: function(options) {
            _.bindAll(this, 'forward');
            this.newCourse = {code: 'ELEC 105'};
            this.sourceEl = options.sourceEl;
            this.showCatalog();
        },

        showCatalog: function() {
            var view = new App.Catalog.QuickCatalogView({
                model: new Backbone.Model({
                    filter: 'semester'
                })
            });

            this.sourceEl.popover({
                html: true,
                content: ' ',
                placement: 'bottom',
                title: 'Fall 2013 Courses'
            });
            this.sourceEl.popover('show');
            this.popoverRegion = new Marionette.Region({
                el: '.popover-content'
            });

            this.popoverRegion.show(view);
            App.Core.activateFilterTable('tbl-catalog', 'tbl-catalog-filter');
            $('#tbl-catalog-filter').focus();

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
                        {label: 'English', checked: true}
                    ],
                    title: 'Fall 2013 Courses',
                    buttonText: 'Replace Course'
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

            // don't use Core.placeCourse here so we can replace course content in place

            // add course to sidebar
            slots.elec2.set('course', this.newCourse);
            views.electiveRequirementView.render();

            // add course to semester
            placed.course2.set('course', this.newCourse);
            placed.course2.unset('interactionController');
            views.fall13.render();
        }
    });
});
