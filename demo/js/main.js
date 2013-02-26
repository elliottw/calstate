$(function() {
	$(".course-draggable").draggable({
		helper: 'clone',
		start: function(event, ui) {
			$(event.target).addClass('draggable-placeholder');
			ui.helper.addClass('draggable-clone');
			$(".semester").addClass('active');
		},
		stop: function(event, ui) {
			$(event.target).removeClass('draggable-placeholder');
			$(".semester").removeClass('active');
		}
	});

	$(".semester-accept").droppable({
		accept: ".course",
		hoverClass: "hover",

		drop: function(event, ui) {
			ui.draggable.draggable({
				revert: false
			});
		}
	});

    $( "#tabs" ).tabs();

    $(".course-placeholder").on('click', function(e) {
		$('#left-panel a[href="#tab-catalog"]').tab('show');
    });
});
