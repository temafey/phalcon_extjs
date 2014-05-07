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
        me.initDisplay(me.grid.additionals);

        Ext.apply(me, {
            layout: 'border',
            //items: [me.createNorth(), me.createSouth(), me.createEast()]
            items: [me.grid, me.createSouth(), me.createEast()]
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

        var filter = me.createFilter(controller);
            filter.setParams(me.additionalParams);

        var grid = Ext.create(controller.grid, {
            buildStore: false,
            store: controller.activeStore,
            region: 'center',
            filter: filter,
            dockedItems: [me.createTopToolbar(), filter],
            flex: 2,
            minHeight: 200,
            minWidth: 150,
            listeners: {
                scope: me,
                select: me.onSelect
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
        var additionalForm = Ext.create('Cms.view.WindowForm', {
            controller: me.getController(),
            grid: me.grid
        });
        me.relayEvents(additionalForm, ['opentab']);
        if (additionals.length > 0) {
            additionalForm.title = 'Form';
        }
        me.display.add(additionalForm);
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
        var controllerApp = Ext.create(controller, {});
        controllerApp.init();

        switch (type) {
            case 'grid':
                var additional = Ext.create('Cms.view.WindowGrid', {
                    controller: controllerApp,
                    additionalGridParam: param
                });
                additional.title = controllerApp.title;
                break;
            case 'form':
                var additional = Ext.create('Cms.view.WindowForm', {
                    controller: controllerApp
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
            layout: 'border',
            bodyStyle: 'padding: 5px;'
        });

        return me.win;
    },

    /**
     * Fires when a grid row is selected
     *
     * @param {Ext.grid.Panel} grid
     * @param {Ext.data.Model} rec
     */
    onSelect: function(grid, rec) {
        var me = this;

        me.display.each(function (item, index, len) {
            item.setActive(rec);
        });
    },

    /**
     * Fires when a grid filter form is submited
     *
     * @param {Ext.form.Panel} filter
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
        me.fireEvent('openall', this);
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
                me.south.show();
                me.south.isSetActive = false;
                me.display.each(function(item, index, len) {
                    this.add(item);
                }, me.south);
                break;
            case 'Right':
                me.south.hide();
                me.east.show();
                me.display.each(function(item, index, len) {
                    this.add(item);
                }, me.east);
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
           options.activeTab = 0;
        } else {
            type = 'Ext.panel.Panel';
        }
        me.south = Ext.create(type, options);
        me.south.isSetActive = false;

        me.display.each(function(item, index, len) {
            this.add(item);
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
            options.activeTab = 0;
        } else {
            type = 'Ext.panel.Panel';
        }
        me.east = Ext.create(type, options);
        return me.east;
    },

    getController: function() {
        return this.controllerApp;
    }
});
