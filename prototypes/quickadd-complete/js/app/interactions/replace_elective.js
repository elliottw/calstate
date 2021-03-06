App.module("Interactions", function(Interactions, App, Backbone, Marionette, $, _){
    Interactions.ReplaceElectiveController = Marionette.Controller.extend({
        initialize: function(options) {
            _.bindAll(this, 'forward');
            this.newCourse = {code: 'ENGL 107'};
            this.sourceEl = options.sourceEl;
            this.showCatalog();
        },

        showCatalog: function() {
            var view = new App.Catalog.QuickCatalogView({
                model: new Backbone.Model({
                    filter: 'satisfiesE'
                })
            });

            this.sourceEl.popover({
                html: true,
                content: ' ',
                placement: 'left',
                title: "All 'English' Courses"
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
                        {label: 'Fall 2013', selected: false},
                        {label: 'Spring 2014', selected: false},
                        {label: 'Fall 2014', selected: false}
                    ],
                    satisfies: [
                        {label: 'Block E', checked: true, fixed: true}
                    ],
                    title: 'Block E Courses',
                    buttonText: 'Replace Course'
                })
            });

            $('.popover-title').text(this.newCourse.code);
            this.popoverRegion.show(view);

            var that = this;
            // get body click events to close popover
            $('.popover').on('click', function(e) {
                e.stopImmediatePropagation();
                e.preventDefault();
            });
            $('header').on('click', function(e) {
                that.popoverRegion.close();
                that.sourceEl.popover('destroy');
                delete that.popoverRegion;
                $('header').off('click');
            });

            view.on('courseSelected', function() {
                that.forward();
            });
        },

        forward: function() {
            this.popoverRegion.close();
            this.sourceEl.popover('destroy');
            delete this.popoverRegion;
            $('header').off('click');

            // don't use Core.placeCourse here so we can replace course content in place

            // add course to sidebar
            slots.elec1.set('course', this.newCourse);
            slots.elec1.unset('interactionController');
            views.electiveRequirementView.render();

            // add course to semester
            placed.course1.set('course', this.newCourse);
            views.fall13.render();
        }
    });
});
