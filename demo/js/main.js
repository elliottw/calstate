$(function() {
	getCourses = function(courseName) {
		return $('.course-marker[data-course="' + courseName + '"]');
	};

	getSemesters = function(semesterName) {
		return $('[data-semester="' + semesterName + '"]');
	};

	var addCourse = function(course, semester) {
		onSemesterDrop.call(getCourses(course)[0],getSemesters(semester)[0]);
	};

	$('select#semester-templates').on('change', function() {
		var selectedEl = $('select#semester-templates option:selected')[0];
		if ($(selectedEl).val() == 'general-requirements') {
			resetAll();
			addCourse('ge101', 'fall12');
			addCourse('req100', 'spr13');

			addCourse('ge102', 'spr13');
			addCourse('req100', 'spr13');
			addCourse('req101', 'spr13');

			addCourse('ge103', 'fall13');
			addCourse('ge104', 'fall13');

			addCourse('ge105', 'spr14');
			addCourse('req102', 'spr14');
		}
		else if ($(selectedEl).val() == 'special-interests') {
			resetAll();
			addCourse('ge101', 'fall12');
			addCourse('req100', 'fall12');
			addCourse('elec101', 'fall12');

			addCourse('ge102', 'spr13');
			addCourse('req100', 'spr13');
			addCourse('req101', 'spr13');
			addCourse('elec102', 'spr13');

			addCourse('ge103', 'fall13');
			addCourse('ge104', 'fall13');
			addCourse('elec103', 'fall13');

			if (getCourses('elec202').hasClass('course-marker-sidebar'))
				addCourse('elec202', 'fall13');

			addCourse('ge105', 'spr14');
			addCourse('req102', 'spr14');
		}
		else if ($(selectedEl).val() == 'blank') {
			resetAll();
		}
	});

	var isDroppable = function(draggable) {
		if (!draggable.hasClass('course-marker-sidebar') && !draggable.hasClass('course-marker-planned')) {
			return false;
		}

		var prereq = draggable.data('prereq');
		var semesters = draggable.data('semesters');
		var course = draggable.data('course');

		if (prereq) {
			var els = getCourses(prereq);
			if (!els.hasClass('course-marker-planned')) {
				return false;
			}
			var semesterOrder = parseInt($(this).data('semester-order'), 10);
			if (!_.every(els, function(el) { return parseInt($(el).parent().data('semester-order'), 10) < semesterOrder; })) {
				return false;
			}
		}

		if (semesters) {
			var semester = $(this).data('semester');
			semesters = semesters.split(/\s+/);
			if (!_.some(semesters, function(s) { return semester === s; })) {
				return false;
			}
		}

		return true;
	};

	// draggable member function
	onSemesterDrop = function(droppable) {
		var course = $(this);
		var semester = $(droppable);
		var courseText = course.text();

		if (course.hasClass("course-marker-planned")) {
			course = course.detach();
		}
		else {
			course.after('<div class="course-slot course-slot-claimed" data-course="' + course.data('course') + '">' + courseText + '</div>');
			course.removeClass("course-marker-sidebar");
			course.addClass("course-marker-planned");
			var r = parseInt(Math.random()*10, 10);
			var grade = ['A','A','A-','A-','B+','B+','B','B-','C+','C'][r];
			course.append('<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + grade);
		}
		course.appendTo(semester);
	};

	onSlotDrop = function(droppable) {
		var course = $(this);
		var courseSlot = $(droppable);
		var courseText = course.text();
		course.after('<div class="course-slot course-slot-claimed">' + courseText + '</div>');
		courseSlot.replaceWith(course);

		course.removeClass("course-marker-catalog");
		course.addClass("course-marker-sidebar");
	};

	resetCourse = function(courseName) {
		var course = getCourses(courseName)[0];
		var slot = $('.course-slot-claimed[data-course="' + courseName + '"]');
		slot.removeClass("course-slot course-slot-claimed");
		slot.addClass("course-marker course-marker-sidebar");
		$(course).remove();
		slot.draggable(courseDragOpts);
	};

	resetAll = function() {
		$(".semester").each(function() {
			$(this).find('.course-marker').each(function() {
				var courseName = $(this).data('course');
				resetCourse(courseName);
			});
		});
	};

	var courseDragOpts = {
		helper: 'clone',
		start: function(event, ui) {
			var course = $(event.target);
			course.addClass('drag-placeholder');

			var prereq = course.data('prereq');
			if (prereq) {
				getCourses(prereq).addClass('prereq');
			}

		},
		stop: function(event, ui) {
			var course = $(event.target);
			course.removeClass('drag-placeholder');

			var prereq = course.data('prereq');
			if (prereq) {
				getCourses(prereq).removeClass('prereq');
			}
		}
	};

	$(".course-marker").draggable(courseDragOpts);

	$(".semester").droppable({
		accept: isDroppable,
		hoverClass: "hover",

		drop: function(event, ui) {
			onSemesterDrop.call(ui.draggable, this);
		}
	});

    $(".course-slot-open")
		.on('click', function(e) {
			$('#left-panel a[href="#tab-catalog"]').tab('show');
		})
		.droppable({
			accept: ".course-marker-catalog",
			tolerance: "touch",
			hoverClass: "hover",

			drop: function(event, ui) {
				onSlotDrop.call(ui.draggable, this);
			}
		});
});
