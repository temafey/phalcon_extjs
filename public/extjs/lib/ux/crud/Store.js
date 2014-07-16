Ext.define('Ext.ux.crud.Store', {
    extend: 'Ext.data.Store',
    alias: ['widget.crudstore'],
    requires: ['Ext.data.Store'],

    baseParams: null,

    /**
     * add base parameter to store.baseParams
     * @param string key
     * @param string key
     */
    addBaseParamKeyValue: function(key, value) {
        var me = this,
            obj = {};

        obj[key] = value;
        Ext.apply(me.baseParams, obj);
    },

    /**
     * add base parameter to store.baseParams
     * @param {Object} key/value object: {key: value}
     */
    addBaseParam: function(obj) {
        var me = this;

        Ext.apply(me.baseParams, obj);
    },

    /**
     * add several base parameters to store.baseParams
     * @param {Array}: array of key/value object: [{key1: value1, key2: value2,...}]
     */
    addBaseParams: function(objects) {
        var me = this;

        if (Ext.isArray(objects)){
            Ext.each(objects, function(obj){
                me.addBaseParam(obj);
            })
        } else if (objects){
            me.addBaseParam(objects);
        }
    },

    /**
     * reset base parameters
     */
    resetBaseParams: function() {
        var me = this;

        me.baseParams = {};
    },

    /**
     * constructor
     * @param {object} config
     */
    constructor: function(config) {
        var me = this;

        // manage base params
        me.baseParams = me.baseParams || {};
        // call parent
        me.callParent([config]);
    },

    /**
     * override load method to add base params to request params
     * @param {Object} options
     */
    load: function(options) {
        var me = this;

        options = options || {};
        options.params = options.params || {};
        Ext.applyIf(options.params, me.baseParams);
        me.callParent([options]);
    },

    isResponseException: function()
    {
        var proxy = this.proxy;

        if (proxy.exceptionResponse !== false && proxy.exceptionResponse.status !== 200) {
            return true;
        }

        return false;
    },

    listeners: {
        exception: function(proxy, response, operation){
            Ext.MessageBox.show({
                title: 'Server error',
                msg: operation.getError(),
                icon: Ext.MessageBox.ERROR,
                buttons: Ext.Msg.OK
            });
        }
    }

});