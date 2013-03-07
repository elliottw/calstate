App.module("Requirements", function(Requirements, App, Backbone, Marionette, $, _){

    Requirements.RequirementTracker = Backbone.Model.extend({
        defaults: {
            title: '',
            slots: new Backbone.Collection()
        },

        // fill with collection of MandateSlot and ElectiveSlots
        getProgress: function() {
            return '0/' + String.parseInt(this.slots.length, 10);
        }
    });

    Requirements.MandateSlot = Backbone.Model.extend({
        initialize: function(attributes) {
            if (!attributes || !attributes.course) {
                console.error('No course specified for MandateSlot initialization');
            }
        },

        defaults: {
            satisfied: false
        },

        // override to unpack the contents of the inner Course model
        toJSON: function() {
            var attrs = Backbone.Model.prototype.toJSON.call(this);
            attrs.course = this.get('course').toJSON();
            return attrs;
        }
    });

    Requirements.ElectiveSlot = Backbone.Model.extend({
        initialize: function(attributes) {
            if (!attributes || !attributes.choicesDelegate) {
                console.error('No choicesDelegate specified for ElectiveSlot initialization');
            }
        },

        defaults: {
            choicesDelegate: null,
            satisfied: false,
            label: ''
        }
    });

    Requirements.MandateSlotView = Marionette.ItemView.extend({
        template: '#tpl-mandate-slot',
        className: 'course-slot course-slot-mandate',

        events: {
            click: 'onClick'
        },

        id: function() {
            return 'slot-' + this.model.get('course').id;
        },

        onRender: function() {
            this.$el.popover({
                html: true,
                placement: "left",
                title: this.model.get('course').get('label'),
                content: $("#tpl-semester-popup").html(),
                container: '#' + this.id(),
                trigger: 'manual'
            });
        },

        onClick: function(e) {
            var courseId = this.model.get('course').id;
            this.$el
                .popover('toggle')
                .find('.popover').on('click', 'button', function(e) {
                    console.log(courseId + ' to ' + $(e.target).val());
                    return false;
                }
            );
        }
    });

    Requirements.ElectiveSlotView = Marionette.ItemView.extend({
        template: '#tpl-elective-slot',
        className: 'course-slot course-slot-elective',

        events: {
            click: 'onClick'
        },

        id: function() {
            return this.model.cid;
        },

        onRender: function() {
            this.$el.popover({
                html: true,
                placement: "left",
                title: 'Courses satisfying ' + this.model.get('label'),
                content: $("#tpl-catalog-popup").html(),
                container: '#' + this.id(),
                trigger: 'manual'
            });
        },

        onClick: function(e) {
            this.$el.popover('toggle');
            var popover = this.$el.find('.popover');
            popover
                .on('click', 'button', function(e) {
                    var selectedOption = $(e.target).siblings('select').find(':selected');
                    console.log(selectedOption.val() + ' selected');
                    return false;
                })
                .on('click', 'form', function(e) {
                    return false;
                });
        }
    });


    Requirements.TrackerView = Marionette.CompositeView.extend({
        initialize: function(options) {
            this.collection = options && options.model && options.model.get('slots');
        },

        template: '#tpl-requirement-tracker',
        itemViewContainer: 'ul',
        itemViewOptions: {
            tagName: 'li'
        },
        itemView: function(item) {
            // duck typing to determine view to render
            if (_.isUndefined(item.model.get('choicesDelegate'))) {
                return new Requirements.MandateSlotView({model: item.model});
            }
            else {
                return new Requirements.ElectiveSlotView({model: item.model});
            }
        }
    });

    Requirements.trackerFactory = function(requirementGroup) {
        var slots = new Backbone.Collection(
            _.map(requirementGroup.mandates, function(mandate) {
                return new Requirements.MandateSlot({course: mandate});
            })
        );
        _.each(requirementGroup.electives, function(elective) {
            var count = elective.count || 1;
            for(var i = 0; i < count; i++) {
                slots.add(new Requirements.ElectiveSlot({label: elective.label}));
            }
        });

        return new Requirements.RequirementTracker({
            slots: slots,
            title: requirementGroup.title
        });
    };
});