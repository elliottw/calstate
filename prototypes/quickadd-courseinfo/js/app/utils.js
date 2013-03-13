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

		var Terms = Backbone.Collection.extend({model: App.Courses.Term});
		var terms = new Terms(data.terms);

		// First pass, define all the courses as a BB Collection with prereq
		// data still as flat strings
		var catalog = new App.Courses.Catalog(data.courses);
		_.each(catalog.models, function(course) {
			var termsArray = _.map(course.get('terms'), function(termStr) {
				return terms.get(termStr);
			});
			course.set('terms', new Backbone.Collection(terms));
		});

		// Now back to resolve the prequesite references to take advantage of
		// catalog.get
		_.each(catalog.models, function(course) {
			var prereqs = course.get('prereqs');
			if (prereqs) {
				if (!_.isArray(prereqs)) {
					console.warn("Non-array used for course prerequisites. Course id: " + course.id);
				}
				course.set('prereqs', processCourses(course.get('prereqs'), catalog));
			}
		});

		// create a base Array of requirement groups
		var requirementGroups = _.map(data.requirements, function(reqGroup) {
			// resolve course references in mandated cources and elective courses
			reqGroup.mandates = processCourses(reqGroup.mandates || [], catalog);
			_.each(reqGroup.electives, function(elec) {
				elec.choices = processCourses(elec.choices || [], catalog);
			});
			return reqGroup;
		});

		return {
			termCollection: terms,
			catalog: catalog,
			requirementGroups: requirementGroups
		};
	};
});