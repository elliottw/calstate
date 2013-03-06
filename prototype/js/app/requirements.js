App.module("Requirements", function(Requirements, App, Backbone, Marionette, $, _){

	Requirements.ElectiveRequirement = Backbone.Model.extend({});

	Requirements.RequirementGroup = Backbone.Model.extend({
		initialize: function(attributes) {
			this.set('title', attributes.title);
			this.set('courses', attributes.courses || []);
			this.set('electives', _.map(attributes.electives, function(elec) {
				return new Requirements.ElectiveRequirement(elec);
			}));
		}
	});

});