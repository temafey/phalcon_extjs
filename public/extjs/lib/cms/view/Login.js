Ext.define('Cms.view.Login', {
    extend: 'Ext.window.Window',
    alias: 'widget.loginwindow',
    id: 'loginwindow',
    cls: 'form-login-dialog',
    iconCls: 'form-login-icon-title',
    title: 'Login',
    resizable: false,
    closable: false,
    draggable: false,
    modal: true,
    closeAction: 'hide',
    items: [
        {
        xtype: 'form',
        alias: 'widget.loginform',
        id: 'loginform',
        frame: false,
        width: 315,
        bodyPadding: 10,
        defaultType: 'textfield',
        defaults: {
            anchor: '100%'
        },
        items: [
            {
                allowBlank: false,
                fieldLabel: 'Email',
                name: 'username',
                emptyText: 'email',
                anchor: '100%',
                validateOnBlur: false
            },
            {
                xtype: 'textfield',
                fieldLabel: 'Password',
                name: 'password',
                allowBlank: false,
                inputType: 'password',
                emptyText: 'password',
                anchor: '100%',
                validateOnBlur: false,
                enableKeyEvents: true,
                listeners: {
                    render: {
                        fn: function (field, eOpts) {
                            field.capsWarningTooltip = Ext.create('Ext.tip.ToolTip', {
                                target:field.bodyEl,
                                anchor: 'top',
                                width:305,
                                html: 'Caps lock warning'
                            });
                            // disable to tooltip from showing on mouseover
                            field.capsWarningTooltip.disable();
                        },
                        scope: this
                    },
                    keypress: {
                        fn: function (field, e, eOpts) {
                            var charCode = e.getCharCode();
                            if ((e.shiftKey && charCode >= 97 && charCode <= 122) ||
                                (!e.shiftKey && charCode >= 65 && charCode <= 90)) {
                                field.capsWarningTooltip.enable();
                                field.capsWarningTooltip.show();
                            } else {
                                if (field.capsWarningTooltip.hidden === false) {
                                    field.capsWarningTooltip.disable();
                                    field.capsWarningTooltip.hide();
                                }
                            }
                        },
                        scope: this
                    },
                    blur: function (field) {
                        if (field.capsWarningTooltip.hidden === false) {
                            field.capsWarningTooltip.hide();
                        }
                    }
                }
        },
        {
            xtype: 'checkbox',
            fieldLabel: 'Remember me',
            name: 'remember'
        }
        ],
        buttons: [
            { 
                id: 'loginButton',
                type: "submit",
                action: "login",
                text: 'Login',
                ref: '../loginAction',
                scale: 'medium'
            }
        ]
    }]
});