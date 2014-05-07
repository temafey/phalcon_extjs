Ext.define('Cms.WindowTab', {
    extend: 'Ext.grid.Panel',

    alias: 'widget.cmsWindowTab',

    initComponent: function() {
        var me = this;

        me.addEvents(
            /**
             * @event rowdblclick
             * Fires when a row is double clicked
             * @param {WindowViewer.WindowTab} this
             * @param {Ext.data.Model} model
             */
            'rowdblclick',
            /**
             * @event select
             * Fires when a grid row is selected
             * @param {WindowViewer.WindowTab} this
             * @param {Ext.data.Model} model
             */
            'select'
        );

        Ext.apply(me, {
            cls: 'window-grid',
            store: Ext.create('Ext.data.Store', {
                model: 'WindowItem',
                sortInfo: {
                    property: 'pubDate',
                    direction: 'DESC'
                },
                proxy: {
                    type: 'ajax',
                    url: 'feed-proxy.php',
                    reader: {
                        type: 'xml',
                        record: 'item'
                    },
                    listeners: {
                        exception: me.onProxyException,
                        scope: me
                    }
                },
                listeners: {
                    load: me.onLoad,
                    scope: me
                }
            }),
            viewConfig: {
                itemId: 'view',
                plugins: [{
                    pluginId: 'preview',
                    ptype: 'preview',
                    bodyField: 'description',
                    expanded: true
                }],
                listeners: {
                    scope: me,
                    itemdblclick: me.onRowDblClick
                }
            },
            columns: [{
                text: 'Title',
                dataIndex: 'title',
                flex: 1,
                renderer: me.formatTitle
            }, {
                text: 'Author',
                dataIndex: 'author',
                hidden: true,
                width: 200

            }, {
                text: 'Date',
                dataIndex: 'pubDate',
                renderer: me.formatDate,
                width: 200
            }]
        });
        me.callParent(arguments);
        me.on('selectionchange', me.onSelect, me);
    },

    /**
     * Reacts to a double click
     * @private
     * @param {Object} view The view
     * @param {Object} index The row index
     */
    onRowDblClick: function(view, record, item, index, e) {
        var me = this;
        me.fireEvent('rowdblclick', this, me.store.getAt(index));
    },


    /**
     * React to a grid item being selected
     * @private
     * @param {Ext.model.Selection} model The selection model
     * @param {Array} selections An array of selections
     */
    onSelect: function(model, selections) {
        var me = this;
        var selected = selections[0];
        if (selected) {
            me.fireEvent('select', me, selected);
        }
    },

    /**
     * Listens for the store loading
     * @private
     */
    onLoad: function(store, records, success) {
        var me = this;
        if (me.getStore().getCount()) {
            me.getSelectionModel().select(0);
        }
    },

    /**
     * Listen for proxy eerrors.
     */
    onProxyException: function(proxy, response, operation) {
        var me = this;
        Ext.Msg.alert("Error with data from server", operation.error);
        me.view.el.update('');

        // Update the detail view with a dummy empty record
        me.fireEvent('select', me, {data: {}});
    },

    /**
     * Instructs the grid to load a new window
     * @param {String} url The url to load
     */
    loadWindow: function(url) {
        var me = this,
            store = me.store;
        store.getProxy().extraParams.window = url;
        store.load();
    },

    /**
     * Title renderer
     * @private
     */
    formatTitle: function(value, p, record) {
        return Ext.String.format('<div class="topic"><b>{0}</b><span class="author">{1}</span></div>', value, record.get('author') || "Unknown");
    },

    /**
     * Date renderer
     * @private
     */
    formatDate: function(date) {
        if (!date) {
            return '';
        }

        var now = new Date(), d = Ext.Date.clearTime(now, true), notime = Ext.Date.clearTime(date, true).getTime();

        if (notime === d.getTime()) {
            return 'Today ' + Ext.Date.format(date, 'g:i a');
        }

        d = Ext.Date.add(d, 'd', -6);
        if (d.getTime() <= notime) {
            return Ext.Date.format(date, 'D g:i a');
        }
        return Ext.Date.format(date, 'Y/m/d g:i a');
    }
});
