(function(){
    data = {}, views = {};
    slots = {};

    slots.reqSlot1 = new App.Sidebar.MandateSlot({
        course: {code: 'REQ 101'},
        satisfied: false,
        interactionController: App.Interactions.AddMandateController
    });

    slots.reqSlot2 = new App.Sidebar.MandateSlot({
        course: {code: 'REQ 102'},
        satisfied: false
    });

    slots.reqSlot3 = new App.Sidebar.MandateSlot({
        course: {code: 'REQ 102'},
        satisfied: true
    });

    slots.elecSlot1 = new App.Sidebar.ElectiveSlot({
        label: 'Block E',
        course: {code: 'ELEC 101'},
        interactionController: App.Interactions.ReplaceElectiveController
    }),

    slots.elecSlot2 = new App.Sidebar.ElectiveSlot({
        label: 'Block E',
        course: {code: 'ELEC 102'}
    }),

    slots.elecSlot3 = new App.Sidebar.ElectiveSlot({
        label: 'Block E',
        course: {},
        interactionController: App.Interactions.AddElectiveController
    }),

    data.requirementGroup = new Backbone.Collection([
        slots.reqSlot1,
        slots.reqSlot2,
        slots.elecSlot1,
        slots.elecSlot2,
        slots.elecSlot3
    ]);

    placed = {};
    placed.course1 = new App.Planner.PlacedCourse({
        course: {code: 'ELEC 101'}
    });
    placed.course2 = new App.Planner.PlacedCourse({
        course: {code: 'ELEC 102'},
        interactionController: App.Interactions.ReplacePlacedController
    });

    data.plannedCourses = new Backbone.Collection([
        placed.course1,
        placed.course2
    ]);

    $(function() {
        App.addRegions({
            sidebarRegion1: '#requirement-group-1',
            plannerRegion: '#planner-region'
        });

        // App.modalRegion.ensureEl();
        $('#modal-container').modal({show: false});

        views.req1 = new App.Sidebar.RequirementGroupView({
            // model: new Backbone.Model({label: 'Baseline Requirements'}),
            collection: data.requirementGroup
        });

        App.sidebarRegion1.show(views.req1);

        views.fall = new App.Planner.SemesterView({
            model: new Backbone.Model({label: 'Fall 2013'}),
            collection: data.plannedCourses
        });
        App.plannerRegion.show(views.fall);

    });
})();