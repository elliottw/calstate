App.module("Planner", function(Planner, App, Backbone, Marionette, $, _){

	Planner.Semester = Backbone.Model.extend({});

	Planner.PlacedCourse = Backbone.Model.extend({
		defaults: {
			course: null,	// Course instance
			status: '',
			grade: ''
		}
	});

	Planner.SemesterPlacements = Backbone.Collection.extend({
		model: Planner.PlacedCourse
	});

	Planner.PlacedCourseView = Backbone.Marionette.ItemView.extend({
		template: "#tpl-placed-course"
	});

	Planner.SemesterView = Backbone.Marionette.CollectionView.extend({
		className: 'semester',
		itemView: Planner.CoursePlacementView
	});

});