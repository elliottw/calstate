(function(){
	var data = App.Utils.importData('http://localhost:8081/data/mech-e.json');

	$(function() {
		var PlannerLayout = Marionette.Layout.extend({
			template: '#tpl-planner',
			regions: {
				fall13: '#fall13',
				spr14:  '#spr14',
				fall14: '#fall14',
				spr15:  '#spr15'
			}
		});

		var plannerLayout = new PlannerLayout();
		plannerLayout.render();

		plannerLayout.fall13.show(new App.Planner.SemesterView({
			// set collection: some PlannedCourse collection
		}));

		plannerLayout.spr14.show(new App.Planner.SemesterView({
			// set collection: some PlannedCourse collection
		}));

		plannerLayout.fall14.show(new App.Planner.SemesterView({
			// set collection: some PlannedCourse collection
		}));

		plannerLayout.spr15.show(new App.Planner.SemesterView({
			// set collection: some PlannedCourse collection
		}));


		App.addRegions({
			plannerRegion: '#planner-region'
		});
		App.plannerRegion.show(plannerLayout);

	});
})();