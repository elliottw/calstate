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

    Sidebar.MandateSlotView = Marionette.ItemView.extend({
        // expects MandateSlot model
        template: '#tpl-mandate-slot'
    });

    // expects ElectiveSlot model
    Sidebar.ElectiveSlotView = Marionette.ItemView.extend({
        template: '#tpl-elective-slot'
    });

    // expects collection of MandateSlot/ElectiveSlot models
    Sidebar.RequirementGroupView = Marionette.CollectionView.extend({
        tagName: 'ul',
        template: '#tpl-requirement-group',
        itemViewContainer: 'ul',
        getItemView: function(model) {
            if (model.get('type') === 'mandate') {
                var className = model.get('satisfied') ?
                    'requirement-satisfied' : 'requirement-unsatisfied';
                return Sidebar.MandateSlotView.extend({className: className});
            }
            else {
                return Sidebar.ElectiveSlotView;
            }
        }
    });
});

App.module("Planner", function(Planner, App, Backbone, Marionette, $, _){
    // expects attributes {course: {code: <str>}}
    Planner.PlacedCourse = Backbone.Model.extend({});

    // expected model: PlacedCourse
    Planner.PlacedCourseView = Marionette.ItemView.extend({
        template: '#tpl-placed-course'
    });

    Planner.SemesterView = Marionette.CompositeView.extend({
        template: '#tpl-semester',
        itemView: Planner.PlacedCourseView,
        itemViewContainer: 'ul'
    });
});
