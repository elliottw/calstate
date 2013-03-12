App.module("Planner", function(Planner, App, Backbone, Marionette, $, _){

	Planner.Semester = Backbone.Model.extend({});

	Planner.PlacedCourse = Backbone.Model.extend({
		defaults: {
			course: null,	// Course instance
			status: '',
			grade: ''
		},

		// override to unpack the contents of the inner Course model
		toJSON: function() {
			var attrs = Backbone.Model.prototype.toJSON.call(this);
			attrs.course = this.get('course').toJSON();
			return attrs;
		}
	});

	Planner.SemesterPlacements = Backbone.Collection.extend({
		model: Planner.PlacedCourse
	});

	Planner.PlacedCourseView = Backbone.Marionette.ItemView.extend({
		className: 'course-marker',
		template: "#tpl-placed-course"
	});

	Planner.SemesterView = Backbone.Marionette.CollectionView.extend({
		className: 'semester',
		itemView: Planner.PlacedCourseView,
		events: {
			click: 'onClick'
		}
    });
});