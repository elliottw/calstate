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
        template: '#tpl-mandate-slot'
    });

    Requirements.ElectiveSlotView = Marionette.ItemView.extend({
        template: '#tpl-elective-slot'
    });

    Requirements.TrackerView = Marionette.CompositeView.extend({
        initialize: function(options) {
            console.log(options);
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

        return new Requirements.RequirementTracker({
            slots: slots,
            title: requirementGroup.title
        });
    };
});