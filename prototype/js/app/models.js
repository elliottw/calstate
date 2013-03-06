(function(){
	var Semester = Backbone.Model.extend({
		defaults: {
			label: '',
			order: 0
		}
	});
	var Semesters = Backbone.Collection.extend({
		model: Semester
	});


	var Course = Backbone.Model.extend({
		defaults: {
			terms: [],		// list of Semester instances
			prereqs: []		// list of Course instances
		}
	});
	var Courses = Backbone.Collection.extend({
		model: Course
	});

	var Placement = Backbone.Model.extend({
		defaults: {
			course: null,	// Course model instance
			semester: null,	// Semester model instance
			status: '',
			grade: ''
		}
	});

	var PlannerSemester = Backbone.Model.extend({
		defaults: {
			semester: null,	// Semester model instance
			placements: []	// list of Placement instances
		}
	});
	var Planner = Backbone.Collection.extend({
		model: PlannerSemester
	});

	var FixedRequirement = Backbone.Model.extend({
		defaults: {
			course: null,	// Course instance
			label: ''
		}
	});
	var ChooseRequirement = Backbone.Model.extend({
		defaults: {
			courses: [],	// list of Course instances
			label: '',
			count: 1
		}
	});

	var MajorRequirements = Backbone.Collection.extend({
		// collection of *Requirements
	});

	var CatalogFilter = Backbone.Model.extend({
		// not sure how this will be implemented yet
	});
	var Catalog = Backbone.Model.extend({
		defaults: {
			courses: null,		// Courses collection instance
			activeFilter: null	// CatalogFilter model
		}
	});

	/*** exports ***/

	App.models = {
		Semester: Semester,
		Course: Course,
		Placement: Placement,
		PlannerSemester: PlannerSemester,
		FixedRequirement: FixedRequirement,
		ChooseRequirement: ChooseRequirement,
		CatalogFilter: CatalogFilter,
		Catalog: Catalog
	};

	App.collections = {
		Semesters: Semesters,
		Courses: Courses,
		Planner: Planner,
		MajorRequirements: MajorRequirements
	};

	App.constants = {

	};
})();