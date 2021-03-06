App.module("Interactions", function(Interactions, App, Backbone, Marionette, $, _){
    Interactions.AddMandateController = Marionette.Controller.extend({
        initialize: function(options) {
            _.bindAll(this, 'forward');
            this.sourceEl = options.sourceEl;
            this.showInfo();
        },

        showInfo: function() {
            var view = new App.Catalog.CourseInfoView({
                model: new Backbone.Model({
                    course: slots.req101.get('course'),
                    terms: [
                        {label: 'Fall 2013', selected: false},
                        {label: 'Spring 2014', selected: false},
                        {label: 'Fall 2014', selected: false}
                    ],
                    satisfies: [],
                    title: '',
                    buttonText: 'Add Course'
                })
            });

            this.sourceEl.popover({
                html: true,
                content: ' ',
                placement: 'left',
                title: 'REQ 101'
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
            slots.req101.set('satisfied', true);
             slots.req101.unset('interactionController');
            views.mandateRequirementView.render();

            // add course to semester
            views.fall13.collection.add(new App.Planner.PlacedCourse({
                course: slots.req101.get('course')
            }));
        }
    });
});
