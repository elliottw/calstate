(function(){
    App = new Backbone.Marionette.Application();

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

        Core.activateFilterTable = function(tableId, filterInputId) {
            var tbl = new ttable(tableId);
            tbl.search.enabled = true;
            tbl.search.inputID = filterInputId;
            tbl.search.casesensitive = false;
            tbl.rendertable();
        };

        Core.placeCourse = function(slotModel, semesterView) {
            // add course to sidebar
            slotModel.set('satisfied', true);
            views.mandateRequirementView.render();

            // add course to semester
            semesterView.collection.add(new App.Planner.PlacedCourse({
                course: slotModel.get('course')
            }));
            semesterView.render();
        };
    });
})();
