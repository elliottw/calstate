$(function() {
	getCourses = function(courseName) {
		return $('[data-course="' + courseName + '"]');
	};

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
	var onSemesterDrop = function(droppable) {
		var course = $(this);
		var semester = $(droppable);
		var courseText = course.text();

		if (course.hasClass("course-marker-planned")) {
			course = course.detach();
		}
		else {
			course.after('<div class="course-slot course-slot-claimed">' + courseText + '</div>');
			course.removeClass("course-marker-sidebar");
			course.addClass("course-marker-planned");
		}
		course.appendTo(semester);
	};

	var onSlotDrop = function(droppable) {
		var course = $(this);
		var courseSlot = $(droppable);
		var courseText = course.text();
		course.after('<div class="course-slot course-slot-claimed">' + courseText + '</div>');
		courseSlot.replaceWith(course);

		course.removeClass("course-marker-catalog");
		course.addClass("course-marker-sidebar");
	};

	$(".course-marker").draggable({
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
	});

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
