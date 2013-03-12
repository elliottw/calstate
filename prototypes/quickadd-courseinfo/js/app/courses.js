App.module("Courses", function(Courses, App, Backbone, Marionette, $, _){
	var Course = Backbone.Model.extend({
		defaults: {
            label: '',
			terms: [],		// list of Semester instances
			prereqs: []		// list of Course instances
		}
	});

    var ScheduledCourse = Backbone.Model.extend({
        defaults: {
            course: null,
            term: null
        }
    });

    var Catalog = Backbone.Collection.extend({
        model: Course,
        getScheduledCourses: function() {
            var ScheduledCourseCollection = Backbone.Collection.extend({});
            var termsToScheduledCourses = function(course) {
                return _.map(course.get('terms'), function(term) {
                    return new ScheduledCourse({course: course, term:term});
                });
            };
            var iterator = function(memo, course) {
                return memo.concat(termsToScheduledCourses(course));
            };
            return this.reduce(iterator, []);
        }
    });

    var QuickCatalogView = Marionette.ItemView.extend({
        template: '#tpl-quick-catalog',
        events: {
            "click tr": "rowClicked"
        },

        initialize: function() {
            // TODO: firx this
            this.model.set('cid', this.model.cid);
            console.log(this.model);
            _.bindAll(this, 'rowClicked');

        },
        rowClicked: function(e) {
            // schCourse = this.model.get('scheduledCourses').get($(e.currentTarget).attr('id'));
            this.trigger('click:scheduledCourse');
        }
    });

    var CoursePageView = Marionette.ItemView.extend({
        template: '#tpl-quick-course-info',
        events: {
            "click .btn-add": "addBtnClicked"
        },
        initialize: function() {
            _.bindAll(this, 'addBtnClicked');
        },
        addBtnClicked: function() {
            this.trigger('click:addScheduledCourse', this.get('course'), this.get('term'));
        }
    });

    var PopoverController = Marionette.Controller.extend({
        // initialize with (regionEl, course) or (regionEl, catalog, fixedFilter)
        initialize: function(options) {
            var catalog = null;
            this.course = null;
            this.coursePageView = null;
            this.catalogModel = null;
            this.catalogView = null;

            this.region = new Marionette.Region({
                el: options.regionEl
            });

            if (options.course) {
                // if course version of initializer
                this.course = options.course;
                this.coursePageView = new CoursePageView({
                    model: new Backbone.Model({course: course})
                });
                region.show(this.coursePageView);
            }
            else {
                // if catalog version of initializer
                catalog = options.catalog;

                var title = "All Courses";
                if(options.fixedFilter) {
                    if (options.fixedFilter.type == 'term') {
                        title = "Fall 13 Courses";
                    }
                    else if (options.fixedFilter.type == 'requirement') {
                        title = "Courses satisfying 'Block E'";
                    }
                }

                this.catalogModel = new Backbone.Model({
                    scheduledCourses: new Backbone.Collection(
                        catalog.getScheduledCourses()),
                    title: title
                });
                this.catalogView = new QuickCatalogView({
                    model: this.catalogModel
                });

                var region = this.region;
                this.catalogView.on('click:scheduledCourse', function() {
                    this.coursePageView = new CoursePageView({
                        model: new Backbone.Model({
                            course: catalog.models[0],
                            term: catalog.models[0].get('terms')[0]
                        })
                    });
                    region.show(this.coursePageView);
                });

                this.region.show(this.catalogView);
            }
        }
    });

    Courses.Catalog = Catalog;
    Courses.ScheduledCourse = ScheduledCourse;
    Courses.Course = Course;
    Courses.PopoverController = PopoverController;
});
