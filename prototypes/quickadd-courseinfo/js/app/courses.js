App.module("Courses", function(Courses, App, Backbone, Marionette, $, _){
    var Term = Backbone.Model.extend({
        initialize: function() {
            _.bindAll(this, 'toJSON');
        },
        toJSON: function() {
            return {
                id: this.id,
                semester: this.get('semester') || '',
                year: this.get('year') || ''
            };
        }
    });

	var Course = Backbone.Model.extend({
        initialize: function() {
            _.bindAll(this, 'toJSON');
        },
        toJSON: function() {
            var terms = this.terms ? (this.terms && this.terms.length) : [];
            return {
                id: this.id,
                label: this.get('label') || '',
                terms: this.has('terms') ? this.get('terms').map(function(term) { return term.toJSON(); }) : [],
                prereqs: []
            };
        }
	});

    var ScheduledCourse = Backbone.Model.extend({
        initialize: function() {
            _.bindAll(this, 'toJSON');
        },
        toJSON: function() {
            return {
                course: this.get('course') && this.get('course').toJSON(),
                term: this.get('term') && this.get('term').toJSON()
            };
        }
    });

    var CatalogFilter = Backbone.Model.extend({
        initialize: function() {
            _.bindAll(this, 'toJSON');
        },
        toJSON: function() {
            return {
                type: this.get('type') || '',
                value: this.get('value') || ''
            };
        }
    });

    var Catalog = Backbone.Collection.extend({
        model: Course,
        initialize: function() {
            _.bindAll(this, 'getScheduledCourses');
        },
        getScheduledCourses: function() {
            var termsToScheduledCourses = function(course) {
                var terms = course.get('terms') || new Backbone.Collection();
                return terms.map(function(term) {
                    return new ScheduledCourse({course: course, term: term});
                });
            };
            var iterator = function(memo, course) {
                return memo.concat(termsToScheduledCourses(course));
            };
            return this.reduce(iterator, []);
        }
    });


    var QuickCatalogFilterRow = Marionette.ItemView.extend({
        template: "#tpl-scheduled-course-row"
    });

    /* CompositeView expecting the following data types:
     * - model: any Model with attributes:
     *          - title: <str>
     * - collection: a Collection of ScheduledCourses
     */
    var QuickCatalogView = Marionette.CompositeView.extend({
        template: '#tpl-quick-catalog',

        itemView: QuickCatalogFilterRow,
        itemViewContainer: 'tbody',
        itemViewOptions: function(model) {
            return {
                tagName: 'tr',
                attributes: {'data-cid': model.cid}
            };
        },

        events: {
            "dblclick tr": "rowDblClicked"
        },

        initialize: function() {
            _.bindAll(this, 'rowDblClicked');
        },
        rowDblClicked: function(e) {
            var cid = $(e.currentTarget).data('cid');
            var scheduledCourse = this.collection.get(cid);
            this.trigger('chosen:scheduledCourse', scheduledCourse);
        }
    });

    var CourseInfoView = Marionette.ItemView.extend({
        template: '#tpl-quick-course-info',
        events: {
            "submit form": "addBtnClicked",
            "click .btn-back": "backBtnClicked"
        },

        initialize: function(options) {
            _.bindAll(this, 'addBtnClicked', 'backBtnClicked');
            this.selectedTerm = options && options.selectedTerm;
            this.selectedElecs = options && options.selectedElecs;
            this.backEnabled = (options && options.backEnabled) ? options.backEnabled : true;
        },

        serializeData: function() {
            var courseData = Marionette.ItemView.prototype.serializeData.call(this);
            return {
                course: courseData,
                backEnabled: this.backEnabled,
                selectedTerm: this.selectedTerm && this.selectedTerm.toJSON()
            };
        },

        addBtnClicked: function(e) {
            var termId = $(e.currentTarget).find('option:selected').val();
            this.trigger('click:addScheduledCourse', this.model, termId);
            e.preventDefault();
        },
        backBtnClicked: function(e) {
            this.trigger('click:back');
            e.preventDefault();
        }
    });

    var PopoverController = Marionette.Controller.extend({
        // initialize with (course) or (regionEl, catalog, fixedFilter)
        initialize: function(options) {
            var catalog = null;
            this.activeCourse = null;
            this.activeCourseInfoView = null;
            this.catalog = null;
            this.catalogView = null;
            this.region = options.region || null;

            var that = this;
            if (options.course) {
                // if course version of initializer
                this.activeCourse = options.course;
                this.activeCourseInfoView = new CourseInfoView({
                    model: new Backbone.Model({course: course}),
                    backEnabled: false
                });
                this.activeCourseInfoView.on("click:addScheduledCourse", function(course, term) {
                    that.trigger("courseSelected", course, term);
                });
                this.region.show(this.activeCourseInfoView);
            }
            else {
                // if catalog version of initializer
                this.catalog = options.catalog;

                var title = "All Courses";
                if(options.fixedFilter) {
                    if (options.fixedFilter.get('type') === 'term') {
                        title = "Fall 13 Courses";
                    }
                    else if (options.fixedFilter.get('type') === 'requirement') {
                        title = "Courses satisfying 'Block E'";
                    }
                }

                this.catalogView = new QuickCatalogView({
                    model: new Backbone.Model({title: title}),
                    collection: new Backbone.Collection(this.catalog.getScheduledCourses())
                });

                this.catalogView.on('chosen:scheduledCourse', function(scheduledCourse) {
                    that.activeCourseInfoView = new CourseInfoView({
                        model: scheduledCourse.get('course'),
                        selectedTerm: scheduledCourse.get('term')
                    });
                    that.activeCourseInfoView.on("click:addScheduledCourse", function(course, termId) {
                        that.trigger("courseSelected", course, termId);
                    });


                    that.activeCourseInfoView.on('click:back', function() {
                        that.region.show(that.catalogView);
                        that.catalogView.delegateEvents();
                    });

                    // don't call region.show!
                    that.showWithoutClosing(that.activeCourseInfoView);
                });

                this.region.show(this.catalogView);
            }
        },

        showWithoutClosing: function(view) {
            // copy of Marionette.Region.show code, minus the closing of the current view
            this.region.ensureEl();
            view.render();
            this.region.open(view);
            Marionette.triggerMethod.call(view, "show");
            Marionette.triggerMethod.call(this.region, "show", view);
            this.region.currentView = view;
        }
    });

    Courses.Term = Term;
    Courses.Catalog = Catalog;
    Courses.ScheduledCourse = ScheduledCourse;
    Courses.Course = Course;
    Courses.PopoverController = PopoverController;
});
