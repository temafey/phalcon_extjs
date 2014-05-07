Ext.define('Ext.ux.crud.Form', {
    extend: 'Ext.form.Panel',

    onReset: function() {
        var me = this;
        var fields = me.getForm().getFields().items;

        for (var i = 0, len = fields.length; i < len; i++) {
            if (fields[i].name !== me.primaryKey) {
                fields[i].setValue('');
                fields[i].reset();
            }
        }
    },

    onClear: function() {
        var me = this;
        me.onReset();
        var primary = me.getPrimaryField();
        primary.reset();
        primary.disable();
    },

    onSubmit: function() {
        var me = this;
        if (me.getForm().isValid()) {
            me.getForm().submit({
                url: me.url,
                parentForm: me,
                success: function(form, action) {
                    console.log(this.parentForm.grid);
                    if (this.parentForm.grid !== undefined) {
                        this.parentForm.grid.onReload();
                    }
                    Ext.Msg.alert('Success', action.result.msg);
                },
                failure: function(form, action) {
                    Ext.Msg.alert('Failed', action.result.error);
                }
            });
        }
    },

    setActiveRecord: function(record) {
        var me = this;
        me.activeRecord = record;
        if (record) {
            //me.down('#save').enable();
            me.getForm().loadRecord(record);
        } else {
            me.down('#save').disable();
            me.getForm().reset();
        }
    },

    getPrimaryField: function() {
        var me = this;

        var fields = me.getForm().getFields().items;

        for (var i = 0, len = fields.length; i < len; i++) {
            if (fields[i].name === me.primaryKey) {
                return fields[i]
            }
        }
        return false;
    },

    getLink: function() {
        var id = this.getPrimaryField().getValue();
        return (id !== '') ? this.rtrim(this.link, '/')+'/'+id : '#';
    },

    rtrim: function (str, charlist) {
        charlist = !charlist ? ' \s\u00A0' : (charlist + '').replace(/([\[\]\(\)\.\?\/\*\{\}\+$\^\:])/g, '\$1');
        var re = new RegExp('[' + charlist + ']+$', 'g');
        return (str + '').replace(re, '');
    }

});