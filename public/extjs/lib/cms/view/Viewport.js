Ext.define('Cms.view.Viewport', {
    extend:'Ext.container.Viewport',
    layout:'card',
    id:'viewport',
    activeItem:0,
    initialized: false,

    construct: function() {
        var me = this;
        me.initialized = true;
        me.items.items[1].add(me.createHeader());
        me.items.items[1].add(me.createMenuPanel());
        me.items.items[1].add(me.createWindowInfo());
        //me.items.items[1].add(me.createFooter());
    },

    initComponent: function() {
        var me = this;

        Ext.define('MenuPanelTreeModel', {
            extend: 'Ext.data.Model',
            fields: ['id', 'text', 'qtip', 'controller', 'leaf']
        });

        Ext.define('WindowItem', {
            extend: 'Ext.data.Model',
            fields: ['title', 'author', {
                name: 'pubDate',
                type: 'date'
            }, 'link', 'description', 'content']
        });

        Ext.apply(me, {
            items: [
                {
                    id:'card-0'
                },
                {
                    id:'card-1',
                    xtype:'panel',
                    layout:'border',
                    items: [
                    ]
                }
            ]
        });

        me.callParent(arguments);
    },

    createHeader: function() {
        var me = this;
        me.header = Ext.create('Cms.view.Header', {
            xtype:'view.Header',
            region:'north',
            height:50
        });
        return me.header;
    },

    createFooter: function() {
        var me = this;
        me.footer = Ext.create('Cms.view.Footer', {
        });
        return me.footer;
    },

    /**
     * Create the list of fields to be shown on the left
     * @private
     * @return {Cms.view.MenuPanel} MenuPanel
     */
    createMenuPanel: function() {
        var me = this;
        me.MenuPanel = Ext.create('Cms.view.MenuPanel', {
            region: 'west',
            collapsible: true,
            width: 225,
            //floatable: false,
            split: true,
            minWidth: 175,
            listeners: {
                scope: me,
                windowSelect: me.onWindowSelect
            }
        });
        return me.MenuPanel;
    },

    /**
     * Create the Window info container
     * @private
     * @return {Cms.view.WindowInfo} WindowInfo
     */
    createWindowInfo: function() {
        var me = this;
        me.WindowInfo = Ext.create('Cms.view.WindowInfo', {
            region: 'center',
            minWidth: 300
        });
        return me.WindowInfo;
    },

    /**
     * Reacts to a Window being selected
     * @private
     */
    onWindowSelect: function(window, title, controller) {
        var me = this;
        me.WindowInfo.openTab(title, controller);
    },

    isInitialized: function() {
        return this.initialized;
    }
});