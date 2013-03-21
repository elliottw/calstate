App.module("Interactions", function(Interactions, App, Backbone, Marionette, $, _){
    Interactions.AddToSemesterController = Marionette.Controller.extend({
        initialize: function(options) {
            _.bindAll(this, 'forward');
            this.sourceEl = options.sourceEl;
            this.showCatalog();
        },

        showCatalog: function() {
            var view = new App.Catalog.QuickCatalogView({
                model: new Backbone.Model({
                    title: 'Fall 2013 Courses'
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

            var that = this;
            view.on('rowSelected', function() {
                that.showInfo();
            });
        },

        showInfo: function() {
            var view = new App.Catalog.CourseInfoView({
                model: new Backbone.Model({
                    course: slots.req102.get('course'),
                    terms: [
                        {label: 'Fall 2013', selected: true}
                    ],
                    satisfies: [],
                    title: 'Fall 2013 Courses',
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

            // add course to sidebar
            slots.req102.set('satisfied', true);
            views.mandateRequirementView.render();

            // add course to semester
            views.fall13.collection.add(new App.Planner.PlacedCourse({
                course: slots.req102.get('course')
            }));
            views.fall13.undelegateEvents();
        }
    });
});
