App.module("Catalog", function(Catalog, App, Backbone, Marionette, $, _) {
    Catalog.PopupView = Marionette.ItemView.extend({
        template: "#tpl-catalog-popup"
    });
});