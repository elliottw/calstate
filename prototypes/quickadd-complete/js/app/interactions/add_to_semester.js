App.module("Interactions", function(Interactions, App, Backbone, Marionette, $, _){
    Interactions.AddToSemesterController = Marionette.Controller.extend({
        initialize: function(options) {
            _.bindAll(this, 'forward');
            this.sourceEl = options.sourceEl;
            this.showCatalog();
        },

        showCatalog: function() {
            var view = new App.Catalog.QuickCatalogView({
                model: new Backbone.Model()
            });

            this.sourceEl.popover({
                html: true,
                content: ' ',
                placement: 'bottom',
                title: 'Spring 2014 Courses'
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
            $('header').on('click', function(e) {
                that.popoverRegion.close();
                that.sourceEl.popover('destroy');
                delete that.popoverRegion;
                $('header').off('click');
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
                    course: slots.req102.get('course'),
                    terms: [
                        {label: 'Spring 2014', selected: true}
                    ],
                    satisfies: [],
                    buttonText: 'Add Course'
                })
            });

            $('.popover-title').text(slots.req102.get('course').code);
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
            $('header').off('click');

            // add course to sidebar
            slots.req102.set('satisfied', true);
            views.mandateRequirementView.render();

            // add course to semester
            views.spr14.collection.add(new App.Planner.PlacedCourse({
                course: slots.req102.get('course')
            }));

            views.spr14.undelegateEvents();
        }
    });
});
