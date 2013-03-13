(function(){
    data = App.Utils.importData('../../data/mech-e.json');

    // temporarily give every course each semester
    data.catalog.each(function(course) {
        course.set('terms', data.termCollection);
    });

    $(function() {
        var ctrl = new App.Courses.PopoverController({
            region: new Marionette.Region({el: ".popover-mockup"}),
            catalog: data.catalog
        });
    });
})();