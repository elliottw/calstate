(function(){
    data = {}, views = {};
    slots = {};

    slots.req101Slot = new App.Sidebar.MandateSlot({
        course: {code: 'REQ 101'},
        satisfied: false,
        interactionController: App.Interactions.AddMandateController
    });
    slots.elecEmptySlot = new App.Sidebar.ElectiveSlot({
        label: 'Block E',
        course: {},
        interactionController: App.Interactions.AddElectiveController
    }),

    data.requirementGroup = new Backbone.Collection([
        slots.req101Slot,
        slots.elecEmptySlot
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