App.module("Planner", function(Planner, App, Backbone, Marionette, $, _){

	Planner.Semester = Backbone.Model.extend({});

	Planner.PlacedCourse = Backbone.Model.extend({
		defaults: {
			course: null,	// Course instance
			status: '',
			grade: ''
		},

		// override to unpack the contents of the inner Course model
		toJSON: function() {
			var attrs = Backbone.Model.prototype.toJSON.call(this);
			attrs.course = this.get('course').toJSON();
			return attrs;
		}
	});

	Planner.SemesterPlacements = Backbone.Collection.extend({
		model: Planner.PlacedCourse
	});

	Planner.PlacedCourseView = Backbone.Marionette.ItemView.extend({
		className: 'course-marker',
		template: "#tpl-placed-course"
	});

	Planner.SemesterView = Backbone.Marionette.CollectionView.extend({
		className: 'semester',
		itemView: Planner.PlacedCourseView,
		events: {
			click: 'onClick'
		},

        onRender: function() {
            var html = '<form class="form-horizontal"><input type="search" class="search-query"/><select size="5">';
            App.fixedChoicesDelegate.each(function(course) {
                html += '<option val="' + course.id + '">' + course.get("label") + '</option>';
            });
            html += '</select><button>Add</button></form>';

            this.$el.popover({
                html: true,
                placement: "bottom",
                title: 'Add to Semester',
                content: html,
                trigger: 'manual',
                container: this.$el
            });
        },

        onClick: function(e) {
            this.$el.popover('toggle');
            var self = this;
            var popover = this.$el.find('.popover');
            popover.on('click', 'button', function(e) {
			var semesterId = $(e.target).val();
                return false;
            })
                .on('click', 'form', function(e) {
                    return false;
                });
        }
	});

});