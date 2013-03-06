App.module("Requirements", function(Requirements, App, Backbone, Marionette, $, _){
	Requirements.FixedRequirement = Backbone.Model.extend({
		defaults: {
			course: null,	// Course instance
			label: ''
		}
	});
	Requirements.ChooseRequirement = Backbone.Model.extend({
		defaults: {
			courses: [],	// list of Course instances
			label: '',
			count: 1
		}
	});
});