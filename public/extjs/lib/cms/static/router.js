Ext.require('Ext.ux.router.Router', function () {
    Ext.Router = Ext.create('Ext.ux.router.Router', {});
// Alias dispatch/redirectTo for convenient use throughout app.
    Ext.dispatch = Ext.Function.bind(Ext.Router.dispatch, Ext.Router);
    Ext.redirectTo = Ext.Function.bind(Ext.Router.redirectTo, Ext.Router);
    Ext.Router.draw(function (map) {
        map.connect(':controller');
        map.connect(':controller/:action');
        map.connect(':controller/:action/:id');
    });
});