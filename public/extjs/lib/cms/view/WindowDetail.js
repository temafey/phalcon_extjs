Ext.define('Cms.view.WindowDetail', {

    extend: 'Ext.panel.Panel',
    alias: 'widget.cmsWindowDetail',
    //autoScroll: true,
    border: false,

    initComponent: function() {
        var me = this;

        me.additionalParams = {};
        if (me.params !== undefined) {
            if (me.params['additionalGridParam'] !== undefined && me.active !== undefined) {
                me.additionalParams[me.params['additionalGridParam']] = me.active.getId();
            }
            if (me.params['additionalGridSearch'] !== undefined && me.params['additionalGridSearch'] !== null) {
                me.additionalParams['search'] = me.params['additionalGridSearch'];
            }
        }
        if (me.controllerApp === undefined) {
            me.controllerApp = Ext.create(me.controller, {
                baseParams: me.additionalParams
            });
            me.controllerApp.init();
        }
        me.grid = me.createGrid(me.controllerApp);
        me.initDisplay(me.controllerApp.additionals);

        var items = new Array();
        items.push(me.grid);
        if (me.controllerApp.additionals.length > 0) {
            items.push(me.createSouth());
            items.push(me.createEast());
        }

        Ext.apply(me, {
            layout: 'border',
            //items: [me.createNorth(), me.createSouth(), me.createEast()]
            items: items
        });

        me.relayEvents(me.grid, ['rowdblclick']);
        me.callParent(arguments);
    },

    /**
     * Create the grid
     * @private
     * @return {Ext.grid.Panel} grid
     */
    createGrid: function(controller) {
        var me = this,
            additionalParams = {};

        var dockerItems = new Array();
        if (controller.additionals.length > 0) {
            dockerItems.push(me.createTopToolbar());
        }

        var filter = me.createFilter(controller);
        filter.setParams(me.additionalParams);
        dockerItems.push(filter);

        var grid = Ext.create(controller.grid, {
            buildStore: false,
            store: controller.activeStore,
            region: 'center',
            filter: filter,
            dockedItems: dockerItems,
            flex: 2,
            minHeight: 200,
            minWidth: 150,
            listeners: {
                scope: me,
                select: me.onSelect,
                storeLoad: me.onStoreLoad
            }
        });

        grid.store.autoSync = true;

        return grid;
    },

    /**
     * Fires when a grid row is selected
     *
     * @param {Array} additionals
     */
    initDisplay: function(additionals) {
        var me = this;

        me.display = new Ext.util.MixedCollection();
        /*
         var additionalForm = Ext.create('Cms.view.WindowForm', {
         window: me,
         controller: me.getController(),
         grid: me.grid
         });
         me.relayEvents(additionalForm, ['opentab']);
         if (additionals.length > 0) {
         additionalForm.title = 'Form';
         }
         me.display.add(additionalForm);
         */
        for (var i = 0; i < additionals.length; i++) {
            if (typeof additionals[i] != 'undefined') {
                additional = me.createAdditional(additionals[i]['type'], additionals[i]['controller'], additionals[i]['param']);
                me.relayEvents(additional, ['opentab']);
                me.display.add(additional);
            }
        }
    },

    /**
     * Create the grid additional object
     *
     * @param {String} type
     * @param {Ext.app.Controller} controller
     * @param {String} param
     * @return {Ext.panel.Panel} additional
     */
    createAdditional: function(type, controller, param) {
        var me = this;

        if (me.controllerApp.$className == controller) {
            controllerApp = me.controllerApp;
        } else {
            controllerApp = Ext.create(controller, {});
            controllerApp.init();
        }

        switch (type) {
            case 'grid':
                var additional = Ext.create('Cms.view.WindowGrid', {
                    window: me,
                    controller: controllerApp,
                    additionalGridParam: param
                });
                additional.title = controllerApp.title;
                break;
            case 'form':
                var additional = Ext.create('Cms.view.WindowForm', {
                    window: me,
                    controller: controllerApp,
                    grid: me.grid
                });
                additional.title = controllerApp.title;
                break;
        }

        return additional;
    },

    /**
     * Create the form
     *
     * @param {Ext.app.Controller} controller
     * @return {Ext.form.Panel} form
     */
    createForm: function(controller) {
        var me = this;

        var form = Ext.create(controller.form, {
            region: 'center',
            listeners: {
                scope: me
            }
        });

        return form;
    },

    /**
     * Create the window
     *
     * @param {String} title
     * @return {Ext.window.Window} win
     */
    createWindow: function(title) {
        var me = this;

        me.win = Ext.create('widget.window', {
            title: title,
            closable: true,
            closeAction: 'hide',
            maximizable: true,
            width: 600,
            minWidth: 350,
            height: 350,
            autoScroll: true,
            bodyStyle: 'padding: 5px;'
        });

        return me.win;
    },

    /**
     * Fires when a grid row is selected
     *
     * @param {Ext.ux.crud.Grid} grid
     * @param {Ext.data.Model} rec
     */
    onSelect: function(grid, rec) {
        var me = this;

        me.display.each(function (item, index, len) {
            item.setActive(rec);
        });
    },

    /**
     * Fires when a grid store is loaded
     *
     * @param {Ext.ux.crud.Grid} grid
     * @param {Ext.ux.crud.Store} store
     * @param {Ext.data.Model} records
     * @param {Boolean} success
     */
    onStoreLoad: function(grid, store, records, success) {
        var me = this;
return;
        if (!success && records == null) {
            var token = Ext.util.Cookies.get('token');
            Ext.Ajax.request({
                url: '/'+ADMIN_PREFIX+'/check',
                params: {
                    token: token
                },
                grid: grid,
                success: function (response, opts) {
                    var obj = Ext.decode(response.responseText);
                    if (obj.success == true) {
                        grid.onReload();
                        return true;
                    } else {
                        Ext.util.Cookies.clear('username');
                        Ext.util.Cookies.clear('token');
                        window.location = '/'+ADMIN_PREFIX;
                    }
                },
                failure: function (response, opts) {
                    window.location = '/'+ADMIN_PREFIX;
                }
            });

        }
    },

    /**
     * Fires when a grid filter form is submited
     *
     * @param {Ext.ux.crud.Form} filter
     * @param {object} params
     */
    onFiltering: function(filter, params) {
        var me = this;
        me.grid.onFiltering(params);
    },

    /**
     * Apply additional params
     *
     * @param {Ext.data.Model} active
     * @param {object} params
     */
    applyAdditionalParams: function(active, params) {
        var me = this;

        me.additionalParams = {};

        if (params !== undefined) {
            if (params['additionalGridParam'] !== undefined && active !== undefined) {
                me.additionalParams[params['additionalGridParam']] = active.getId();
            }
            if (params['additionalGridSearch'] !== undefined && params['additionalGridSearch'] !== null) {
                me.additionalParams['search'] = params['additionalGridSearch'];
            }
        }
        if (me.grid) {
            me.grid.onFiltering(me.additionalParams, true);
        }
    },

    /**
     * Creates top controller toolbar.
     * @private
     * @return {Ext.toolbar.Toolbar} toolbar
     */
    createTopToolbar: function() {
        var me = this;

        me.toolbar = Ext.create('widget.toolbar', {
            cls: 'x-docked-noborder-top',
            items: [
                /*{
                 iconCls: 'open-all',
                 text: 'Open All',
                 scope: this,
                 handler: me.onOpenAllClick
                 },
                 '-',*/
                {
                    xtype: 'cycle',
                    text: 'Reading Panel',
                    prependText: 'Preview: ',
                    showText: true,
                    scope: me,
                    changeHandler: me.readingPanelChange,
                    menu: {
                        id: 'reading-menu',
                        items: [{
                            text: 'Bottom',
                            checked: true,
                            iconCls:'preview-bottom'
                        }, {
                            text: 'Right',
                            iconCls:'preview-right'
                        }, {
                            text: 'Hide',
                            iconCls:'preview-hide'
                        }]
                    }
                }]
        });

        return me.toolbar;
    },

    /**
     * Create top controller toolbar.
     * @private
     * @return {Ext.toolbar.Toolbar} toolbar
     */
    createFilter: function(controller) {
        var me = this;

        var filter = Ext.create(controller.filter, {
            collapsible: true,
            collapsed: true,
            split: true,
            frame: true,
            listeners: {
                scope: me,
                onSubmit: me.onFiltering
            }
        });

        return filter;
    },

    /**
     * Reacts to the open all being clicked
     * @private
     */
    onOpenAllClick: function() {
        var me = this;

        me.fireEvent('openall', me);
    },

    /**
     * Gets a list of titles/urls for each grid item.
     * @return {Array} The grid details
     */
    getWindowData: function() {
        var me = this;

        return me.grid.store.getRange();
    },

    /**
     * @private
     * @param {Ext.button.Button} btn The button
     * @param {Boolean} pressed Whether the button is pressed
     */
    onSummaryToggle: function(btn, pressed) {
        var me = this;
        me.grid.getComponent('view').getPlugin('preview').toggleExpanded(pressed);
    },

    /**
     * Handle the checked item being changed
     * @private
     * @param {Ext.menu.CheckItem} activeItem The checked item
     */
    readingPanelChange: function(cycle, activeItem) {
        var me = this;

        switch (activeItem.text) {
            case 'Bottom':
                me.east.hide();
                if (me.east.type == 'tab') {
                    activeTab = me.east.getActiveTab();
                }
                me.display.each(function(item, index, len) {
                    var me = this;
                    me.add(item);
                }, me.south);
                if (me.east.type == 'tab') {
                    me.south.setActiveTab(activeTab);
                }
                me.south.show();
                break;
            case 'Right':
                me.south.hide();
                if (me.south.type == 'tab') {
                    activeTab = me.south.getActiveTab();
                }
                me.display.each(function(item, index, len) {
                    var me = this;
                    me.add(item);
                }, me.east);
                if (me.south.type == 'tab') {
                    me.east.setActiveTab(activeTab);
                }
                me.east.show();
                break;
            default:
                me.south.hide();
                me.east.hide();
                break;
        }
    },

    /**
     * Create the north region container
     * @private
     * @return {Ext.panel.Panel} south
     */
    createNorth: function() {
        var me = this,
            type,
            options;

        options = {
            layout: 'fit',
            region: 'north',
            border: false,
            split: true,
            flex: 2,
            minHeight: 300,
            autoScroll: true
        };
        type = 'Ext.panel.Panel';
        me.north = Ext.create(type, options);
        me.north.add(me.grid);

        return me.north;
    },

    /**
     * Create the south region container
     * @private
     * @return {Ext.panel.Panel} south
     */
    createSouth: function() {
        var me = this,
            type,
            options;

        options = {
            layout: 'fit',
            region: 'south',
            border: false,
            split: true,
            flex: 2,
            minHeight: 300,
            minWidth: 300
        };
        if (me.display.getCount() > 1) {
            type = 'Ext.tab.Panel';
            options.type = 'tab';
            options.activeTab = 0;
            options.isSetActive = false;
        } else {
            type = 'Ext.panel.Panel';
            options.type = 'panel';
        }
        me.south = Ext.create(type, options);
        me.south.type = options.type;

        me.display.each(function(item, index, len) {
            var me = this;

            me.add(item);
            if (me.type == 'tab' && me.isSetActive == false) {
                me.setActiveTab(item);
                me.isSetActive = true;
            }
        }, me.south);

        return me.south;
    },

    /**
     * Create the east region container
     * @private
     * @return {Ext.panel.Panel} east
     */
    createEast: function() {
        var me = this,
            type,
            options;

        options = {
            layout: 'fit',
            region: 'east',
            flex: 1,
            split: true,
            hidden: true,
            minWidth: 300,
            border: false
        };

        if (me.display.getCount() > 1) {
            type = 'Ext.tab.Panel';
            options.type = 'tab';
            options.activeTab = 0;
            options.isSetActive = false;
        } else {
            type = 'Ext.panel.Panel';
            options.type = 'panel';
        }
        me.east = Ext.create(type, options);
        me.east.type = options.type;

        return me.east;
    },

    getController: function() {
        var me = this;

        return me.controllerApp;
    }
});
