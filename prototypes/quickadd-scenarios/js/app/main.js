(function(){
    data = {}, views = {};
    slots = {}, placed = {};

    function resetBlank() {
        slots.req101 = new App.Sidebar.MandateSlot({
            course: {code: 'REQ 101'},
            satisfied: false
        });

        slots.req102 = new App.Sidebar.MandateSlot({
            course: {code: 'REQ 102'},
            satisfied: false
        });

        slots.elec1 = new App.Sidebar.ElectiveSlot({
            label: 'English',
            course: {}
        }),

        slots.elec2 = new App.Sidebar.ElectiveSlot({
            label: 'English',
            course: {}
        }),

        slots.elec3 = new App.Sidebar.ElectiveSlot({
            label: 'Hist',
            course: {}
        }),

        slots.elec3.set('interactionController',
            App.Interactions.AddElectiveController);

        slots.req101.set('interactionController',
            App.Interactions.AddMandateController);

        resetRequirementGroups();

        data.plannedCourses = new Backbone.Collection([]);

        resetRegions();
    }

    function resetTemplate() {
        slots.elec1 = new App.Sidebar.ElectiveSlot({
            label: 'English',
            course: {code: 'ELEC 101'}
        }),

        slots.elec2 = new App.Sidebar.ElectiveSlot({
            label: 'English',
            course: {code: 'ELEC 102'}
        }),

        resetRequirementGroups();

        placed.course1 = new App.Planner.PlacedCourse({
            course: {code: 'ELEC 101'}
        });
        placed.course2 = new App.Planner.PlacedCourse({
            course: {code: 'ELEC 102'}
        });

        data.plannedCourses = new Backbone.Collection([
            placed.course1,
            placed.course2
        ]);

        slots.elec1.set('interactionController',
            App.Interactions.ReplaceElectiveController);

        placed.course2.set('interactionController',
            App.Interactions.ReplacePlacedController);

        resetRegions();
    }

    function resetRequirementGroups() {
        data.mandateGroup = new Backbone.Collection([
            slots.req101,
            slots.req102,
            new App.Sidebar.MandateSlot({course: {code: 'ENGR 300'}}),
            new App.Sidebar.MandateSlot({course: {code: 'ENGR 301'}}),
            new App.Sidebar.MandateSlot({course: {code: 'CE/ME 303'}}),
            new App.Sidebar.MandateSlot({course: {code: 'ME 306'}}),
            new App.Sidebar.MandateSlot({course: {code: 'ME 310'}}),
            new App.Sidebar.MandateSlot({course: {code: 'CE/ME 313'}}),
            new App.Sidebar.MandateSlot({course: {code: 'ME 315'}}),
            new App.Sidebar.MandateSlot({course: {code: 'ME 316'}}),
            new App.Sidebar.MandateSlot({course: {code: 'CE/ME 320'}}),
            new App.Sidebar.MandateSlot({course: {code: 'ME 318'}})
        ]);

        data.electiveGroup = new Backbone.Collection([
            new App.Sidebar.MandateSlot({course: {code: 'MATH 104'}}),
            new App.Sidebar.MandateSlot({course: {code: 'MATH 105'}}),
            new App.Sidebar.MandateSlot({course: {code: 'ENGL 102'}}),
            slots.elec1,
            slots.elec2,
            new App.Sidebar.MandateSlot({course: {code: 'COMM 150'}}),
            new App.Sidebar.MandateSlot({course: {code: 'POLS 150'}}),
            new App.Sidebar.ElectiveSlot({label: 'Phil', course: {}}),
            slots.elec3
        ]);

        data.inactiveGroup1 = new Backbone.Collection([
            new App.Sidebar.ElectiveSlot({label: 'Block C', course: {}}),
            new App.Sidebar.ElectiveSlot({label: 'Block E', course: {}}),
            new App.Sidebar.ElectiveSlot({label: 'Block E', course: {}})
        ]);

        data.inactiveGroup2 = new Backbone.Collection([
            new App.Sidebar.MandateSlot({course: {code: 'ENGR 150'}}),
            new App.Sidebar.MandateSlot({course: {code: 'ME 103'}}),
            new App.Sidebar.MandateSlot({course: {code: 'CE/ME 201'}}),
            new App.Sidebar.MandateSlot({course: {code: 'ME 204'}}),
            new App.Sidebar.MandateSlot({course: {code: 'CE/ME 210'}}),
            new App.Sidebar.MandateSlot({course: {code: 'EE 210'}}),
            new App.Sidebar.MandateSlot({course: {code: 'CE/ME 211'}}),
            new App.Sidebar.MandateSlot({course: {code: 'CHEM 101'}}),
            new App.Sidebar.MandateSlot({course: {code: 'CS 290'}}),
            new App.Sidebar.MandateSlot({course: {code: 'MATH 206'}}),
            new App.Sidebar.MandateSlot({course: {code: 'MATH 207'}}),
            new App.Sidebar.MandateSlot({course: {code: 'MATH 208'}}),
            new App.Sidebar.MandateSlot({course: {code: 'MATH 209'}}),
            new App.Sidebar.MandateSlot({course: {code: 'MATH 215'}}),
            new App.Sidebar.MandateSlot({course: {code: 'PHYS 211'}}),
            new App.Sidebar.MandateSlot({course: {code: 'PHYS 212'}}),
            new App.Sidebar.MandateSlot({course: {code: 'PHYS 213'}})
        ]);

        data.inactiveGroup3 = new Backbone.Collection([
            new App.Sidebar.MandateSlot({course: {code: 'ENGL 101'}}),
            new App.Sidebar.MandateSlot({course: {code: 'WPE'}})
        ]);

        data.inactiveGroup4 = new Backbone.Collection([
            new App.Sidebar.MandateSlot({course: {code: 'ME 497A'}}),
            new App.Sidebar.MandateSlot({course: {code: 'ME 497B'}}),
            new App.Sidebar.MandateSlot({course: {code: 'ME 497C'}})
        ]);
    }

    function resetRegions() {
        views.mandateRequirementView = new App.Sidebar.ActiveRequirementGroupView({
            collection: data.mandateGroup
        });
        App.mandateSidebarRegion.show(views.mandateRequirementView);

        views.electiveRequirementView = new App.Sidebar.ActiveRequirementGroupView({
            collection: data.electiveGroup
        });
        App.electiveSidebarRegion.show(views.electiveRequirementView);

        views.inactiveRequirementView1 = new App.Sidebar.ActiveRequirementGroupView({
            collection: data.inactiveGroup1
        });
        App.sidebarRegion1.show(views.inactiveRequirementView1);

        views.inactiveRequirementView2 = new App.Sidebar.ActiveRequirementGroupView({
            collection: data.inactiveGroup2
        });
        App.sidebarRegion2.show(views.inactiveRequirementView2);

        views.inactiveRequirementView3 = new App.Sidebar.ActiveRequirementGroupView({
            collection: data.inactiveGroup3
        });
        App.sidebarRegion3.show(views.inactiveRequirementView3);

        views.inactiveRequirementView4 = new App.Sidebar.ActiveRequirementGroupView({
            collection: data.inactiveGroup4
        });
        App.sidebarRegion4.show(views.inactiveRequirementView4);

        views.fall13 = new App.Planner.SemesterView({
            model: new Backbone.Model({label: 'Fall 2013'}),
            collection: data.plannedCourses
        });
        App.semesterRegion1.show(views.fall13);

        views.spr14 = new App.Planner.SemesterView({
            model: new Backbone.Model({label: 'Spring 2014'}),
            collection: new Backbone.Collection(),
            hasInteraction: true
        });
        App.semesterRegion2.show(views.spr14);

        views.fall14 = new App.Planner.SemesterView({
            model: new Backbone.Model({label: 'Fall 2014'}),
            collection: new Backbone.Collection()
        });
        App.semesterRegion3.show(views.fall14);

        views.spr15 = new App.Planner.SemesterView({
            model: new Backbone.Model({label: 'Spring 2015'}),
            collection: new Backbone.Collection()
        });
        App.semesterRegion4.show(views.spr15);

        views.fall15 = new App.Planner.SemesterView({
            model: new Backbone.Model({label: 'Fall 2015'}),
            collection: new Backbone.Collection()
        });
        App.semesterRegion5.show(views.fall15);

        views.spr16 = new App.Planner.SemesterView({
            model: new Backbone.Model({label: 'Spring 2016'}),
            collection: new Backbone.Collection()
        });
        App.semesterRegion6.show(views.spr15);

        views.fall16 = new App.Planner.SemesterView({
            model: new Backbone.Model({label: 'Fall 2016'}),
            collection: new Backbone.Collection()
        });
        App.semesterRegion7.show(views.fall16);

        views.spr17 = new App.Planner.SemesterView({
            model: new Backbone.Model({label: 'Spring 2017'}),
            collection: new Backbone.Collection()
        });
        App.semesterRegion8.show(views.spr17);
    }

    $(function() {
        App.addRegions({
            mandateSidebarRegion: '#active-mandate-group',
            electiveSidebarRegion: '#active-elective-group',

            semesterRegion1: '#semester-region-1',
            semesterRegion2: '#semester-region-2',
            semesterRegion3: '#semester-region-3',
            semesterRegion4: '#semester-region-4',
            semesterRegion5: '#semester-region-5',
            semesterRegion6: '#semester-region-6',
            semesterRegion7: '#semester-region-7',
            semesterRegion8: '#semester-region-8',

            sidebarRegion1: '#inactive-group-1',
            sidebarRegion2: '#inactive-group-2',
            sidebarRegion3: '#inactive-group-3',
            sidebarRegion4: '#inactive-group-4'
        });

        $("#btn-template-blank").on('click', function(e) {
            resetBlank();
            e.preventDefault();
        });

        $("#btn-template-1").on('click', function(e) {
            resetTemplate();
            e.preventDefault();
        });


        resetBlank();
    });

})();