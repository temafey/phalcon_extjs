Ext.define('Ext.ux.crud.Filter', {
    extend: 'Ext.form.Panel',

    requires: ['Ext.form.Panel','Ext.form.field.*'],

    initComponent : function() {
        this.callParent();
    },

    onReset: function() {
        var me = this;

        var fields = me.getForm().getFields().items;
        for (var i = 0, len = fields.length; i < len; i++) {
            fields[i].reset();
        }
    },

    setParams: function(params) {
        var me = this,
            form = me.getForm();

        me.onReset();

        for (var key in params) {
            if (params[key] === '') {
                //continue;
            }
            var val = params[key];
            if (me.isNumeric(val)) {
                val = parseFloat(val);
            }
            var field = form.findField(key);
            if (field) {
                field.setValue(val);
            }
        }
    },

    onClear: function() {
        var me = this;
        me.onReset();
    },

    onSubmit: function() {
        var me = this;

        if (me.getForm().isValid()) {
            var values = me.getForm().getValues();
            var params = {};
            for (var key in values) {
                if (values[key] === '') {
                    continue;
                }
                params[key] = values[key];
            }
            me.fireEvent('onSubmit', me, params);
        }
    },

    rtrim: function (str, charlist) {
        charlist = !charlist ? ' \s\u00A0' : (charlist + '').replace(/([\[\]\(\)\.\?\/\*\{\}\+$\^\:])/g, '\$1');
        var re = new RegExp('[' + charlist + ']+$', 'g');
        return (str + '').replace(re, '');
    },

    isNumeric: function (mixed_var) {
        var whitespace =
            " \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000";
        return (typeof mixed_var === 'number' || (typeof mixed_var === 'string' && whitespace.indexOf(mixed_var.slice(-1)) === -
            1)) && mixed_var !== '' && !isNaN(mixed_var);
    }

});