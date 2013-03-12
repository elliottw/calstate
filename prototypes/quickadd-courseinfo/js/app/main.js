(function(){
    data = App.Utils.importData('/data/mech-e.json');

    // temporarily give every course each semester
    data.courseCollection.each(function(course) {
        course.set('terms', data.semesterCollection.models);
    });

    var catalog = new App.Courses.Catalog(data.courseCollection.models);

    $(function() {
        var ctrl = new App.Courses.PopoverController({
            regionEl: ".popover-mockup",
            catalog: catalog
        });
    });
})();