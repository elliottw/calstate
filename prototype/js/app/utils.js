App.module("Utils", function(Utils, App, Backbone, Marionette, $, _){
	// recursive function that converts a possibly nested array of
	// course id strings into a parallel structure of course references
	function processCourses(courseStrArray, courseCollection) {
		return _.map(courseStrArray, function(courseStr) {
			if (_.isArray(courseStr)) {
				return processCourses(courseStr, courseCollection);
			}
			else {
				var course = courseCollection.get(courseStr);
				if (!course) {
					console.log('Creating new Course model: ' + courseStr);
					course = new App.Courses.Course({
						id: courseStr,
						label: courseStr
					});
					courseCollection.add(course);
				}
				return course;
			}
		});
	}

	Utils.importData = function(url) {
		var data;
		$.ajax({
			dataType: 'json',
			url: url,
			async: false,
			success: function(json) {
				data = json;
			}
		});

		var Semesters = Backbone.Collection.extend({model: App.Planner.Semester});
		var semesters = new Semesters(data.semesters);

		var Courses = Backbone.Collection.extend({model: App.Courses.Course});
		// First pass, define all the courses as a BB Collection with prereq
		// data still as flat strings
		var courses = new Courses(data.courses);
		_.each(courses.models, function(course) {
			course.set('terms', _.map(course.get('terms'), function(termStr) {
				return semesters.get(termStr);
			}));
		});

		// Now back to resolve the prequesite references to take advantage of
		// courses.get
		_.each(courses.models, function(course) {
			var prereqs = course.get('prereqs');
			if (prereqs) {
				if (!_.isArray(prereqs)) {
					console.warn("Non-array used for course prerequisites. Course id: " + course.id);
				}
				course.set('prereqs', processCourses(course.get('prereqs'), courses));
			}
		});

		// process FixedRequirement and ChooseRequirements separately
		var requirements = _.map(data.requirements, function(req) {
			var reqGroup = new App.Requirements.RequirementGroup(req);
			// resolve course references in mandated cources and elective courses
			if (reqGroup.get('courses')) {
				console.log(reqGroup.get('title'));
				reqGroup.set('courses', processCourses(reqGroup.get('courses'), courses));
			}
			_.each(reqGroup.get('electives'), function(elec) {
				elec.set('courses', processCourses(elec.get('courses'), courses));
			});
			return reqGroup;
		});

		return {
			semesters: semesters,
			courses: courses,
			requirements: requirements
		};
	};
});