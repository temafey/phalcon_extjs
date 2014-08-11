Ext.define('Ext.ux.crud.Form', {
    extend: 'Ext.form.Panel',
    alias: ['widget.crudform'],
    requires: ['Ext.form.Panel','Ext.form.field.*'],

    onReset: function() {
        var me = this;
        var fields = me.getForm().getFields().items;

        for (var i = 0, len = fields.length; i < len; i++) {
            if (fields[i].name !== me.primaryKey && !fields[i].readOnly) {
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
                    var me = this;
                    console.log(action.result);
                    if (action.result.success) {
                        if (me.parentForm.grid !== undefined) {
                            me.parentForm.grid.onReload();
                        }
                        Ext.Msg.show({
                            title : '',
                            msg : action.result.msg,
                            icon : Ext.MessageBox.INFO,
                            buttons : Ext.Msg.OK
                        });
                    } else {
                        Ext.MessageBox.show({
                            title: 'Server error',
                            msg: action.error.join("\n"),
                            icon: Ext.MessageBox.ERROR,
                            buttons: Ext.Msg.OK
                        });
                    }
                },
                failure: function(form, action) {
                    Ext.MessageBox.show({
                        title: 'Server error',
                        msg: action.error.join("\n"),
                        icon: Ext.MessageBox.ERROR,
                        buttons: Ext.Msg.OK
                    });
                }
            });
        }
    },

    setActiveRecord: function(record) {
        var me = this;

        me.activeRecord = record;
        if (record) {
            //me.down('#save').enable();
            var primary = me.getPrimaryField();
            primary.enable();
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

    getAllFields: function(){
        var me = this;
        var fields = me.getForm().getFields().items;

        return fields;
    },

    getLink: function () {
        var me = this;
        console.log(me.link);
        var link = me.generateLinkFromTemplate(me.link, me.getAllFields());

        return link;
    },

    generateLinkFromTemplate: function (template, values, startDelimeter, endDelimeter) {
        startDelimeter = typeof startDelimeter !== 'undefined' ? startDelimeter : '{';
        endDelimeter = typeof endDelimeter !== 'undefined' ? endDelimeter : '}';

        for (i = 0; i < values.length; i++) {
            var pregString = new RegExp(startDelimeter + values[i].name + endDelimeter, 'g');
            console.log(pregString);
            var template = template.replace(pregString, values[i].value);
        }

        return template;
    },

    rtrim: function (str, charlist) {
        charlist = !charlist ? ' \s\u00A0' : (charlist + '').replace(/([\[\]\(\)\.\?\/\*\{\}\+$\^\:])/g, '\$1');
        var re = new RegExp('[' + charlist + ']+$', 'g');
        return (str + '').replace(re, '');
    }

});