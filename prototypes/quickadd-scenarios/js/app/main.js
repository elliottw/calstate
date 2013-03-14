(function(){
    data = {}, views = {};

    data.requirementGroup = new Backbone.Collection([
        new App.Sidebar.MandateSlot({
            course: {code: 'REQ 101'},
            satisfied: false,
            interactionController: App.Interactions.AddMandateController
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

    data.plannedCourses = new Backbone.Collection([]);

    $(function() {
        App.addRegions({
            sidebarRegion1: '#requirement-group-1',
            plannerRegion: '#planner-region'
        });

        views.req1 = new App.Sidebar.RequirementGroupView({
            // model: new Backbone.Model({label: 'Baseline Requirements'}),
            collection: data.requirementGroup
        });

        App.sidebarRegion1.show(views.req1);

        views.fall = new App.Planner.SemesterView({
            model: new Backbone.Model({label: 'Fall 13'}),
            collection: data.plannedCourses
        });
        App.plannerRegion.show(views.fall);
    });
})();