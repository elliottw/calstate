(function(){

	var CoursePlacementView = Backbone.Marionette.ItemView.extend({
		template: "#tpl-placed-course"
	});

	var SemesterView = Backbone.Marionette.CollectionView.extend({
		className: 'semester',
		itemView: CoursePlacementView
	});

	App.views = {
		CoursePlacementView: CoursePlacementView,
		SemesterView: SemesterView
	};
})();