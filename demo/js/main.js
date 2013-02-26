$(function() {
	$(".course-draggable").draggable({
		revert: true,
		start: function(event, ui) {
			$(".semester").addClass('active');
		},
		stop: function(event, ui) {
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
