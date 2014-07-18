Ext.define('Ext.ux.crud.Grid', {
    extend: 'Ext.grid.Panel',
    alias: ['widget.crudgrid'],
    requires: ['Ext.grid.Panel'],

    baseParams: null,
    filter: false,
    selModel: {
        mode: 'MULTI'
    },

    createStore : function(store) {
        var me = this;

        var store = Ext.create(store, {
            baseParams: me.baseParams,
            listeners: {
                scope: me,
                load: me.onStoreLoad
            }
        });

        store.sync({
            failure: function (batch, eOpts) {
                // 'this' is the Ext.data.proxy.Ajax object
                // or whatever proxy you are using
                var data = this.getReader().jsonData,
                    raw_data = this.getReader().rawData;
            }
        });

        return store;
    },

    afterRender: function() {
        var me = this;

        me.callParent(arguments);
        me.textField = me.down('textfield[name=searchField]');
    },

    onCreate: function() {
        var me = this;

        me.fireEvent('select', me, undefined);
    },

    onDelete: function() {
        var me = this;

        var selections = me.getSelectionModel().getSelection();
        if (selections.length > 0) {
            Ext.MessageBox.confirm('Information', 'Do you really want to remove the selected items?', function (btn) {
                if (btn == 'yes') {
                    me.getStore().remove(selections);
                    me.getStore().load();
                }
            });
        } else {
            Ext.MessageBox.alert('Information', 'No selected items');
        }
    },

    onSelect: function(model, selections) {
        var me = this,
            selected = selections[0];

        if (selected) {
            me.fireEvent('select', me, selected);
        }
    },

    onFiltering: function(params, setParamsToFilterForm) {
        var me = this,
            store = me.getStore();

        store.resetBaseParams();
        if (me.filter && setParamsToFilterForm) {
            me.filter.setParams(params);
        }
        for (var key in params) {
            if (params[key] === '') {
                continue;
            }
            store.addBaseParamKeyValue(key, params[key]);
        }
        store.reload({params: {start:0}});
    },

    onEdit: function(editor, e) {
        var me = this;

        var rec = e.record;
        for (var key in e.newValues) {
            if (e.newValues[key] !== e.originalValues[key]) {
                var column = me.getColumnByName(key);
                if (column.field !== undefined && column.field.xtype === 'combobox') {
                    var value = column.field.store.getById(e.newValues[key]);
                    rec.data[key] = value.data.name;
                }
            }
        }

        me.fireEvent('select', me, rec);
    },

    onReload: function() {
        var me = this;

        me.getStore().load();
    },

    onStoreLoad: function(store, records, success, eOpts) {
        var me = this;

        me.fireEvent('storeLoad', me, store, records, success);
    },

    onDbClick: function(model, selections) {
        var selected = selections[0];
        if (selected) {
        }
    },

    getSearchValue: function() {
        var me = this,
            value = me.textField.getValue();

        if (value === '') {
            return null;
        }

        return value;
    },

    onTextFieldChange: function() {
        var me = this,
            params = {},
            count = 0;

        me.view.refresh();
        me.searchValue = me.getSearchValue();

        params['search'] = me.searchValue;
        me.onFiltering(params);
    },

    getColumnByName: function(dataIndex) {
        var me = this;

        for (var i = 0; i < me.columns.length; i++) {
            if (me.columns[i].dataIndex == dataIndex) {
                return me.columns[i];
            }
        }

        return false;
    },

    getStoreRowById: function(id) {
        var me = this;

        return me.getStore().getById(id);
    },

    getColumnFieldValue: function(name, value) {
        var me = this;

        var column = me.getColumnByName(name);
        if (column.field !== undefined && column.field.xtype === 'combobox') {
            value = column.field.store.findRecord('name', value);
        }

        return value;
    },

    getDockedToolbars: function() {
        var me = this,
            dockedItems;

        dockedItems = [
            me.returnTopToolbar(),
            me.returnBottomToolbar()
        ];

        return dockedItems;
    },

    getTopToolbar: function() {
        var me = this,
            toolbar;

        toolbar = Ext.create('widget.toolbar', {
            dock: 'top',
            items: me.getTopToolbarItems()
        });

        return toolbar;
    },

    getBottomToolbar: function() {
        var me = this,
            toolbar;

        toolbar = Ext.create('widget.toolbar', {
            dock: 'bottom',
            items: me.getBottomToolbarItems()
        });

        return toolbar;
    },

    getTopToolbarItems: function() {
        var me = this,
            items = [];

        return items;
    },

    getBottomToolbarItems: function() {
        var me = this,
            items = [];

        return items;
    },

    getPagingToolbar: function() {
        var me = this,
            paging;

        paging = Ext.create('widget.pagingtoolbar', {
            store: me.getStore(),
            displayInfo: true,
            displayMsg: 'Displaying topics {0} - {1} of {2}',
            emptyMsg: 'No topics to display'
        });

        return paging;
    }

});