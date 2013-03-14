(function(){
    App = new Backbone.Marionette.Application();

    App.module("Interactions", function(Interactions, App, Backbone, Marionette, $, _){
        Interactions.findCourseModel = function(courseCode, collection) {
            for (var i = collection.models.length - 1; i >= 0; i--) {
                var model = collection.models[i];
                if (model.get('course') && model.get('course')['code'] === courseCode) {
                    return model.cid;
                }
            }
            return null;
        };
    });
})();
