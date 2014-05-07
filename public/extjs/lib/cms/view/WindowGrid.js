Ext.define('Cms.view.WindowGrid', {

    extend: 'Ext.panel.Panel',
    alias: 'widget.cmsWindowGrid',
    cls: 'preview',
    autoScroll: true,
    border: true,

    initComponent: function() {
        var me = this;

        Ext.apply(me, {
            dockedItems: [me.createToolbar()]
        });
        if(me.inTab) {
            if (me.grid !== undefined) {
                me.items = [me.grid];
            }
        } else {
            me.gridWindows = new Ext.util.AbstractMixedCollection();
        }
        me.callParent(arguments);
    },

    /**
     * Set the active grid
     * @param {Ext.panel.Panel} window
     * @param {Ext.data.Model} rec
     */
    setActive: function(rec) {
        var me = this,
            openTab = me.down('button[text=View in new tab]');

        me.active = undefined;
        openTab.enable();
        me.active = rec;

        if (me.grid === undefined) {
            me.grid = me.createGrid(me.controller, me.active, me.additionalGridParam);
            me.add(me.grid);
        } else {
            var params = {};
            params[me.additionalGridParam] = me.active.getId();
            me.grid.onFiltering(params, true);
        }
    },

    /**
     * Create the top toolbar
     * @private
     * @return {Ext.toolbar.Toolbar} toolbar
     */
    createToolbar: function() {
        var me = this,
            items = [],
            config = {};

        if (!me.inTab) {
            items.push({
                    scope: me,
                    handler: me.openTab,
                    disabled: (me.active === undefined) ? true : false,
                    text: 'View in new tab',
                    iconCls: 'tab-new'
                }
            );
        }
        else {
            config.cls = 'x-docked-noborder-top';
        }

        if (me.grid !== undefined) {
            var title = me.getGridTitle(me.grid);
            var win = (me.inTab) ? me.parent.getWindowByTitle(title) : me.getWindowByTitle(title);
        }

        config.items = items;

        return Ext.create('widget.toolbar', config);
    },

    createGrid: function(controller, rec, param) {
        var grid = Ext.create(controller.grid, {});
        //grid.reconfigure(controller.getNewStore());
        //grid.store.autoSync = true;

        if (rec !== undefined) {
            var params = {};
            params[param] = rec.getId();
            grid.onFiltering(params, true);
        }

        return grid;
    },

    /**
     * Open the post in a new tab
     * @private
     */
    openTab: function() {
        var me = this,
            params = [];

        params['additionalGridParam'] = me.additionalGridParam;
        params['additionalGridSearch'] = me.grid.getSearchValue();
        me.fireEvent('opentab', me, me.controller, me.active, params);
    },

    getWindowByTitle: function(title) {
        var me = this;

        if (me.gridWindows === undefined) {
            return null;
        }
        var index = me.gridWindows.findIndex('title', title);

        return (index < 0) ? null : me.gridWindows.getAt(index);
    },

    getGridByTitle: function(title) {
        var me = this;

        var index = me.items.findIndex('title', title);

        return (index < 0) ? null : me.items.getAt(index);
    },

    getGridTitle: function(grid) {
        var me = this,
            id = '';

        if (me.active !== undefined) {
            id = me.active.getId();
        }
        var title = grid.title;
        if (id !== '') {
            title = title+" ("+id+")";
        } else {
            title = title+' (new)';
        }

        return title;
    }
});
