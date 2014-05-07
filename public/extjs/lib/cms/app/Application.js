Ext.define('Cms.app.Application', {
    extend:'Ext.ux.app.Application',
    appFolder:'/extjs/lib/cms',
    name: 'Cms',
    controllers:[
        'Login',
    ],
    requires:[
        'Cms.view.Viewport'
    ],

    launch: function () {
        var me = this;

        // create Viewport instance
        var viewport = Ext.create('Cms.view.Viewport', {controller:me});

        // Get a reference to main TabPanel.  This is where top-level controllers will render themselves.
        // eg: this.render("workspace", this.getArtistsIndexView());
        // Think of it as a "render target".
        var workspace = viewport.down('container[region=center]');
        //this.addLayout('workspace', workspace);

        Ext.defer(me.hideLoadingScreen, 250);

        Ext.History.init(me.initDispatch, me);
        Ext.History.on('change', me.historyChange, me);

        // Start with dashboard
        token = Ext.History.getToken();
        if (token == null) {
            //Ext.History.add('dashboard', true);
            //Ext.dispatch('dashboard');
        }
    },

    initDispatch: function () {
        var me = this,
            token = Ext.History.getToken();
        Ext.log('Init dispatch with token: ' + token);
        me.historyChange(token);
    },

    historyChange: function (token) {
        var me = this;
        // and check if token is set
        Ext.log('History changed to: ' + token);
        if (token) {
            Ext.dispatch(token);
            //var route = Ext.Router.recognize(token);
            ////me.dispatch(route);
            //console.log(route);
        }
    },

    hideLoadingScreen: function() {
        Ext.get('logo').remove();
        Ext.get('loading').remove();
        /*Ext.fly('loading-mask').animate({
            opacity:0,
            remove:true
        });*/
    }
});
