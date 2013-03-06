App.module("Courses", function(Courses, App, Backbone, Marionette, $, _){
	Courses.Course = Backbone.Model.extend({
		defaults: {
            label: '',
			terms: [],		// list of Semester instances
			prereqs: []		// list of Course instances
		}
	});
});