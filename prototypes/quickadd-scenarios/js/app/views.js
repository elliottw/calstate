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
                new (this.model.get('interactionController'))({
                    sourceEl: this.$el
                });
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
    var className;
    Sidebar.ActiveRequirementGroupView = Marionette.CollectionView.extend({
        tagName: 'ul',
        template: '#tpl-requirement-group',
        getItemView: function(model) {
            if (model.get('type') === 'mandate') {
                className = model.get('satisfied') ?
                    'requirement-satisfied' : 'requirement-unsatisfied';
                return Sidebar.MandateSlotView.extend({
                    className: className,
                    id: model.cid
                });
            }
            else {
                className = !_.isEmpty(model.get('course')) ?
                    'elective-satisfied' : 'elective-unsatisfied';
                return Sidebar.ElectiveSlotView.extend({
                    className: className,
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
        className: 'semester',
        itemViewContainer: 'ul',
        itemViewOptions: function(model) {
            return {
                id: model.cid,
                tagName: 'li'
            };
        },
        initialize: function(options) {
            this.hasInteraction = (options && options.hasInteraction) || false;
        },
        events: {
            click: 'onClick'
        },
        onClick: function(e) {
            if (this.hasInteraction) {
                new App.Interactions.AddToSemesterController({
                    sourceEl: this.$el
                });
                e.stopImmediatePropagation();
                e.preventDefault();
            }
        }
    });
});

App.module("Catalog", function(Catalog, App, Backbone, Marionette, $, _){
    // expects model with {course: code}
    Catalog.QuickCatalogView = Marionette.ItemView.extend({
        template: function(serialized_model) {
            if (serialized_model.filter === 'satisfies') {
                return _.template($('#tpl-quick-catalog-blocke').html(), serialized_model);
            }
            else {
                return _.template($('#tpl-quick-catalog-fall13').html(), serialized_model);
            }
        },

        initialize: function() {
            _.bindAll(this, 'onRowChosen');
        },

        events: {
            'click tr': 'onRowChosen'
        },

        onRowChosen: function(e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            this.trigger('rowSelected');
        }
    });

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
            e.stopImmediatePropagation();
            this.trigger('courseSelected');
        }
    });
});