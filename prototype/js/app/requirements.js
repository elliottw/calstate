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
			satisfied: false
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