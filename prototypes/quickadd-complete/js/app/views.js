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
        tagName: 'li',
        initialize: function() {
            var that = this;
            this.model.on('change:satisfied', function(model, isSatisfied) {
                if (isSatisfied) {
                    that.$el.addClass('mandate-satisfied', 1000);
                }
                else {
                    that.$el.removeClass('mandate-satisfied');
                }
            });
        }
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
                className = model.get('satisfied') ? 'mandate-satisfied' : '';
                return Sidebar.MandateSlotView.extend({
                    className: className + " mandate-slot requirement-slot",
                    id: model.cid
                });
            }
            else {
                className = !_.isEmpty(model.get('course')) ?
                    'elective-satisfied' : 'elective-unsatisfied';
                return Sidebar.ElectiveSlotView.extend({
                    className: className + " elective-slot requirement-slot",
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
            if (serialized_model.filter === 'satisfiesE') {
                return _.template($('#tpl-quick-catalog-engl').html(), serialized_model);
            }
            else if (serialized_model.filter === 'satisfiesH') {
                return _.template($('#tpl-quick-catalog-hist').html(), serialized_model);
            }
            else {
                return _.template($('#tpl-quick-catalog-semester').html(), serialized_model);
            }
        },

        initialize: function() {
            _.bindAll(this, 'onRowChosen');
        },

        events: {
            'click td': 'onRowChosen'
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