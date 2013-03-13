(function(){
    data = {};
    data.requirementGroup = new Backbone.Collection([
        new App.Sidebar.MandateSlot({
            course: {code: 'REQ 101'},
            satisfied: true
        }),
        new App.Sidebar.MandateSlot({
            course: {code: 'REQ 102'},
            satisfied: false
        }),
        new App.Sidebar.ElectiveSlot({
            label: 'Block E',
            course: {code: 'ELEC 101'}
        }),
        new App.Sidebar.ElectiveSlot({
            label: 'Block E',
            course: {}
        })
    ]);

    $(function() {
        App.addRegions({
            sidebarRegion1: '#requirement-group-1',
            plannerRegion: '#planner-region'
        });

        App.sidebarRegion1.show(new App.Sidebar.RequirementGroupView({
            // model: new Backbone.Model({label: 'Baseline Requirements'}),
            collection: data.requirementGroup
        }));

        App.plannerRegion.show(new App.Planner.SemesterView({
            model: new Backbone.Model({label: 'Fall 13'}),
            collection: new Backbone.Collection()
        }));
    });
})();