(function(){
	// recursive function that converts a possibly nested array of
	// course id strings into a parallel structure of course references
	function processCourses(courseStrArray, courseCollection) {
		return _.map(courseStrArray, function(prereq) {
			if (_.isArray(prereq)) {
				return processCourses(prereq, courseCollection);
			}
			else {
				return courseCollection.get(prereq);
			}
		});
	}

	function importData(url) {
		var data;
		$.ajax({
			dataType: 'json',
			url: url,
			async: false,
			success: function(json) { data = json; }
		});

		var semesters = new App.collections.Semesters(data.semesters);

		// First pass, define all the courses as a BB Collection with prereq
		// data still as flat strings
		var courses = new App.collections.Courses(data.courses);
		_.each(courses.models, function(course) {
			course.set('terms', _.map(course.get('terms'), function(termStr) {
				return semesters.get(termStr);
			}));
		});

		// Now back to resolve the prequesite references to take advantage of
		// courses.get
		_.each(courses.models, function(course) {
			course.set('prereq', processCourses(course.get('prereq'), courses));
		});

		// process FixedRequirement and ChooseRequirements separately
		var mandates = _.map(_.where(data.requirements, {type: 'mandated'}), function(req) {
			req.course = courses.get(req.course);
			return new App.models.FixedRequirement(req);
		});
		var chooses = _.map(_.where(data.requirements, {type: 'choose'}), function(req) {
			req.courses = processCourses(req.courses, courses);
			return new App.models.ChooseRequirement(req);
		});

		var requirements = new App.collections.MajorRequirements(mandates.concat(chooses));

		return {
			semesters: semesters,
			courses: courses,
			requirements: requirements
		};
	}

	// load initial data
	App.globals = {};

	var data = importData('http://localhost:8081/data/example.json');
	App.globals.semesters = data.semesters;
	App.globals.courses = data.courses;
	App.globals.requirements = data.requirements;

	$(function() {

	});
})();