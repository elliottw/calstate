App.module("Core", function(Core, App, Backbone, Marionette, $, _){
    Core.interactionViewExtension = {
        initialize: function() {
            _.bindAll(this, 'runInteraction');
        },
        events: {
            'click': 'runInteraction'
        },
        runInteraction: function(e) {
            if (this.model.has('interactionController')) {
                new (this.model.get('interactionController'))();
            }
            else {
                console.log('no action');
            }
            e.stopImmediatePropagation();
            e.preventDefault();
        }
    };

    Core.InteractionItemView = Marionette.ItemView.extend(Core.interactionViewExtension);
});

App.module("Sidebar", function(Sidebar, App, Backbone, Marionette, $, _){
    // expects attributes {course: { code: <str> }, satisfied: <bool>}
    Sidebar.MandateSlot = Backbone.Model.extend({
        initialize: function() {
            this.set('type', 'mandate');
        }
    });

    // expects attributes {course: { code: <str> }} or {label: <str>}
    Sidebar.ElectiveSlot = Backbone.Model.extend({
        initialize: function() {
            this.set('type', 'elective');
        }
    });

    Sidebar.MandateSlotView = App.Core.InteractionItemView.extend({
        // expects MandateSlot model
        template: '#tpl-mandate-slot',
        tagName: 'li'
    });

    // expects ElectiveSlot model
    Sidebar.ElectiveSlotView = App.Core.InteractionItemView.extend({
        template: '#tpl-elective-slot',
        tagName: 'li'
    });

    // expects collection of MandateSlot/ElectiveSlot models
    Sidebar.RequirementGroupView = Marionette.CollectionView.extend({
        tagName: 'ul',
        template: '#tpl-requirement-group',
        getItemView: function(model) {
            if (model.get('type') === 'mandate') {
                var className = model.get('satisfied') ?
                    'requirement-satisfied' : 'requirement-unsatisfied';
                return Sidebar.MandateSlotView.extend({
                    className: className,
                    id: model.cid
                });
            }
            else {
                return Sidebar.ElectiveSlotView.extend({
                    id: model.cid
                });
            }
        }
    });
});

App.module("Planner", function(Planner, App, Backbone, Marionette, $, _){
    // expects attributes {course: {code: <str>}}
    Planner.PlacedCourse = Backbone.Model.extend({});

    // expected model: PlacedCourse
    Planner.PlacedCourseView = App.Core.InteractionItemView.extend({
        template: '#tpl-placed-course'
    });

    Planner.SemesterView = Marionette.CompositeView.extend({
        template: '#tpl-semester',
        itemView: Planner.PlacedCourseView,
        itemViewContainer: 'ul',
        itemViewOptions: function(model) {
            return {id: model.cid};
        },
        events: {
            click: 'onClick'
        },
        onClick: function(e) {
            new App.Interactions.AddToSemesterController();
            e.preventDefault();
        }
    });
});


App.module("Catalog", function(Catalog, App, Backbone, Marionette, $, _){
    // expects model with {course: code}
    Catalog.CourseInfoView = Marionette.ItemView.extend({
        template: '#tpl-course-info',

        initialize: function() {
            _.bindAll(this, 'onSubmit');
        },

        events: {
            'click input[type="submit"]': 'onSubmit'
        },

        onSubmit: function(e) {
            e.preventDefault();
            this.trigger('courseSelected');
        }
    });
});