Ext.define('Cms.view.MenuPanel', {
    extend: 'Ext.tree.Panel',
    animCollapse: true,
    layout: 'fit',
    title: 'Modules',
    alias:'widget.view.Navigation',
    floating:false,
    plain:true,
    rootVisible:false,
    autoScroll:true,
    collapsible:true,
    animate:true,
    useArrows:true,
    stateEvents: ['itemcollapse', 'itemexpand'],
    stateId: 'tree-panel-menu-state-id',
    stateful: true,
    id: 'mainmenu',

    initComponent: function() {
        var me = this;

        Ext.apply(me, {
            store: me.createStore(),
            //dockedItems: this.createToolbar()
            tbar: me.createTbar(),

            viewConfig: {
                itemId: 'treePanelMain',
                plugins: [{
                    ptype: 'treeviewdragdrop',
                    containerScroll: true
                }],
                listeners: {
                    scope: me,
                    itemclick: me.onSelectionChange
                }
            }
        });

        me.createMenu();

        me.addEvents(
            /**
             * @event windowRemove Fired when a Window is removed
             * @param {MenuPanel} this
             * @param {String} title The title of the Window
             * @param {String} url The url of the Window
             */
            'windowRemove',

            /**
             * @event windowSelect Fired when a Window is selected
             * @param {MenuPanel} this
             * @param {String} title The title of the Window
             * @param {String} url The url of the Window
             */
            'windowSelect'
        );

        me.callParent(arguments);
    },

    getState: function() {
        var nodes = [];
        this.getRootNode().eachChild(function (child) {
        //function to store state of tree recursively
            var storeTreeState = function (node, expandedNodes) {
                if (node.isExpanded() && node.childNodes.length > 0) {
                    expandedNodes.push(node.getPath('id'));
                    node.eachChild(function (child) {
                        storeTreeState(child, expandedNodes);
                    });
                }
            };
            storeTreeState(child, nodes);
        });

        return {
            expandedNodes:nodes
        }
    },

    applyState: function (state) {
        var that = this;

        //read state in from cookie, not from what is passed in
        var cookie = Ext.state.Manager.get('tree-panel-menu-state-id');
        var nodes = cookie.expandedNodes;
        for (var i = 0; i < nodes.length; i++) {
            if (typeof nodes[i] != 'undefined') {
                that.expandPath(nodes[i]);
            }
        }
    },

    /**
     * Create the DataView to be used for the Window list.
     * @private
     * @return {Ext.view.View}
     */
    createStore: function() {
        var me = this;

        var store = Ext.create('Ext.data.TreeStore', {
            model: 'MenuPanelTreeModel',
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: '/admin/menu/options',
                reader: {
                    root: 'event',
                    type: 'json'
                }
            },
            extraParams: {
                path: 'extjs'
            },
            listeners: {
                scope: me,
                contextmenu: me.onContextMenu,
                viewready: me.onViewReady
            }
        });

        return store;
    },

    createTbar: function() {
        var me = this;

        var bar = [
            {
                text: 'Expand All',
                scope: me,
                handler: me.onExpandAllClick
            },
            {
                text: 'Collapse All',
                scope: me,
                handler: me.onCollapseAllClick
            }
        ];

        return bar;
    },

    onViewReady: function() {
        var me = this;
        me.view.getSelectionModel().select(me.view.store.first());
    },

    /**
     * Creates the toolbar to be used for controlling Windows.
     * @private
     * @return {Ext.toolbar.Toolbar}
     */
    createToolbar: function() {
        var me = this;

        me.createActions();
        me.toolbar = Ext.create('widget.toolbar', {
            items: [me.addAction, me.removeAction]
        });
        return me.toolbar;
    },

    /**
     * Create the context menu
     * @private
     */
    createMenu: function() {
        var me = this;

        me.menu = Ext.create('widget.menu', {
            items: [{
                scope: me,
                handler: me.onLoadClick,
                text: 'Load module',
                iconCls: 'module-load'
            }],
            listeners: {
                hide: function(c) {
                    c.activeController = null;
                }
            }
        });
    },

    /**
     * Used when view selection changes so we can disable toolbar buttons.
     * @private
     */
    onSelectionChange: function(view, record, item, index, evt, options) {
        var me = this;

        if (record.get('leaf')) {
            Ext.History.add(record.raw['controllerName'], true);
            me.loadWindow(record);
        }
    },

    /**
     * React to the load Window menu click.
     * @private
     */
    onLoadClick: function() {
        var me = this;

        this.loadWindow(this.menu.activeController);
    },

    /**
     * Loads a Window.
     * @private
     * @param {Ext.data.Model} rec The Window
     */
    loadWindow: function(rec) {
        var me = this;

        if (rec) {
            me.fireEvent('windowSelect', me, rec.get('text'), rec.get('controller'));
        }
    },

    /**
     * Gets the currently selected record in the view.
     * @private
     * @return {Ext.data.Model} Returns the selected model. false if nothing is selected.
     */
    getSelectedItem: function() {
        return this.view.getSelectionModel().getSelection()[0] || false;
    },

    /**
     * Listens for the context menu event on the view
     * @private
     */
    onContextMenu: function(view, index, el, event) {
        var menu = this.menu;

        event.stopEvent();
        menu.activeController = view.store.getAt(index);
        menu.showAt(event.getXY());
    },

    /**
     * React to a Window being removed
     * @private
     */
    onRemoveWindowClick: function() {
        var me = this;

        var active = me.menu.activeController || me.getSelectedItem();
        if (active) {
            me.view.getSelectionModel().deselectAll();
            me.animateNode(me.view.getNode(active), 1, 0, {
                scope: me,
                afteranimate: function() {
                    me.view.store.remove(active);

                }
            });
            me.fireEvent('windowRemove', me, active.get('title'), active.get('url'));
        }
    },

    /**
     * React to a Window attempting to be added
     * @private
     */
    onAddWindowClick: function() {
        var me = this;

        var win = me.addActionWindow || (me.addActionWindow = Ext.create('Cms.actionWindow', {
            listeners: {
                scope: me,
                Windowvalid: me.onWindowValid
            }
        }));
        win.form.getForm().reset();
        win.show();
    },

    /**
     * React to a validation on a Window passing
     * @private
     * @param {Cms.actionWindow} win
     * @param {String} title The title of the Window
     * @param {String} url The url of the Window
     */
    onWindowValid: function(win, title, url) {
        var me = this;

        var view = me.view,
            store = view.store,
            rec;

        rec = store.add({
            url: url,
            title: title
        })[0];

        me.animateNode(view.getNode(rec), 0, 1);
    },

    /**
     * Animate a node in the view when it is added/removed
     * @private
     * @param {Mixed} el The element to animate
     * @param {Number} start The start opacity
     * @param {Number} end The end opacity
     * @param {Object} listeners (optional) Any listeners
     */
    animateNode: function(el, start, end, listeners) {
        Ext.create('Ext.fx.Anim', {
            target: Ext.get(el),
            duration: 500,
            from: {
                opacity: start
            },
            to: {
                opacity: end
            },
            listeners: listeners
        });
    },

    // Inherit docs
    onDestroy: function() {
        var me = this;

        me.callParent(arguments);
        me.menu.destroy();
    },

    onExpandAllClick: function() {
        var me = this,
            toolbar = me.down('toolbar');

        me.getEl().mask('Expanding tree...');
        toolbar.disable();

        this.expandAll(function() {
            me.getEl().unmask();
            toolbar.enable();
        });
    },

    onCollapseAllClick: function() {
        var toolbar = this.down('toolbar');

        toolbar.disable();
        this.collapseAll(function() {
            toolbar.enable();
        });
    }
});