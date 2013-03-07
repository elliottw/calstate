(function(){
    data = App.Utils.importData('http://localhost:8081/data/mech-e.json');
    App.fixedChoicesDelegate = data.courseCollection;

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
            fall13: '#fall13',
            spr14: '#spr14',
            fall14: '#fall14',
            spr15: '#spr15',
            requirementSidebar: '#requirements-region'
        });


        fall13 = new Backbone.Collection();
        fall13View = new App.Planner.SemesterView({
            collection: fall13
        });
        App.fall13.show(fall13View);

        spr14 = new Backbone.Collection();
        spr14View = new App.Planner.SemesterView({
            collection: spr14
        });
        App.spr14.show(spr14View);

        fall14 = new Backbone.Collection();
        fall14View = new App.Planner.SemesterView({
            collection: fall14
        });
        App.fall14.show(fall14View);

        spr15 = new Backbone.Collection();
        spr15View = new App.Planner.SemesterView({
            collection: spr15
        });
        App.spr15.show(spr15View);


        var trackers = new Backbone.Collection(
            _.map(data.requirementGroups, function(reqGroup) {
                return App.Requirements.trackerFactory(reqGroup);
            })
        );

        App.vent.on('electiveChosen', function(slot, courseId) {
            slot
        });

        App.vent.on('coursePlaced', function(slot, semester) {
            slot.set('satisfied', true);
            var placement = new App.Planner.PlacedCourse({
                course: slot.get('course'),
                status: 'placed',
                grade: 'A'
            });

            if (semester === 'fall13')
                fall13.add(placement);
            else if (semester === 'spr14')
                spr14.add(placement);
            else if (semester === 'fall14')
                fall14.add(placement);
            else if (semester === 'spr15')
                spr15.add(placement);
        });

        var sidebarView = new (Marionette.CollectionView.extend({
            itemView: App.Requirements.TrackerView
        }))({collection: trackers});

        App.requirementSidebar.show(sidebarView);

        // App.addRegions({
        //  plannerRegion: '#planner-region'
        // });
        // App.plannerRegion.show(plannerLayout);
    });
})();