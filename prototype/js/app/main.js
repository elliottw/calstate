(function(){
    data = App.Utils.importData('http://localhost:8081/data/mech-e.json');

    $(function() {
        // var PlannerLayout = Marionette.Layout.extend({
        //  template: '#tpl-planner',
        //  regions: {
        //      fall13: '#fall13',
        //      spr14:  '#spr14',
        //      fall14: '#fall14',
        //      spr15:  '#spr15'
        //  }
        // });

        // var plannerLayout = new PlannerLayout();
        // plannerLayout.render();

        App.addRegions({
            fall13: '#fall13'
        });

        fall13 = new Backbone.Collection();
        _.each(data.courses.slice(4,8), function(course) {
            var placed = new App.Planner.PlacedCourse({
                course: course,
                status: 'placed',
                grade: 'A'
            });
            fall13.add(placed);
        });
        fall13View = new App.Planner.SemesterView({
            collection: fall13
        });

        App.fall13.show(fall13View);

        // App.addRegions({
        //  plannerRegion: '#planner-region'
        // });
        // App.plannerRegion.show(plannerLayout);
    });
})();