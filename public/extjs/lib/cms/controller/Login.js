Ext.define('Cms.controller.Login', {
    extend:'Cms.controller.Base',

    init: function () {
        this.control({
            'viewport': {
                render: this.index
            },
            'button[action=login]': {
                click: this.login
            },
            '#loginwindow textfield': {
                specialkey: this.keyenter
            },
            'button[action=logout]': {
                click: this.logout
            }
        });
    },

    views: [
        'Login', 'Viewport'
    ],

    refs: [
        {
            ref:'viewport',
            selector:'viewport'
        },
        {
            ref:'loginwindow',
            selector:'loginwindow'
        }
    ],

    index: function () {
        var me = this;

        console.log('Index function');
        var loginWin = Ext.create('Cms.view.Login');

        //@todo this hould ofcourse be better implemented with at least a check with the webservices if somebody is realy logged in
        //but for now just check the cookies
        if (me.empty(Ext.util.Cookies.get('username')) == false) {
            if (me.empty(Ext.util.Cookies.get('token')) == false) {
                me.checkToken(Ext.util.Cookies.get('token'));
                return;
            } else {
                me.checkIsAuth();
                return;
            }
        }
        me.login();
    },

    login: function () {
        var me = this;
        console.log('Login button');

        var form = Ext.getCmp('loginform');
        var values = form.getValues();
        var lay = me.getViewport().getLayout();
        lay.setActiveItem(0);
        if (me.checkAuthority(values.username, values.password, values.remember) == false) {
           Ext.getCmp('loginwindow').show();
        }
    },

    activate: function () {
        var me = this,
            win = Ext.getCmp('loginwindow'),
            viewport = me.getViewport();

        win.hide();
        if (!viewport.isInitialized()) {
            viewport.construct();
        }
        viewport.getLayout().setActiveItem(1);
        Ext.getCmp('loggedin').update('Logged in as:' + ' <b>' + Ext.util.Cookies.get('username') + '</b>');
    },

    checkAuthority: function (username, password, remember) {
        var me = this;
        if (me.empty(username) || me.empty(password)) {
            return false;
        }

        Ext.Ajax.request({
            url: '/admin/auth',
            params: {
                username: username,
                password: password,
                remember: remember
            },
            win: me,
            success: function (response, opts) {
                var obj = Ext.decode(response.responseText);
                if (obj.success) {
                    Ext.util.Cookies.set('username', opts.params.username);
                    opts.win.activate();
                    Ext.getCmp('loginform').getForm().reset();
                    return true;
                } else {
                    //Ext.getCmp('loginwindow').show();
                    Ext.Msg.alert('Failed', obj.msg);
                    return false;
                }
            },
            failure: function (response, opts) {
                return false;
            }
        });

        return true;
    },

    checkToken: function (token) {
        var me = this;

        console.log('Check token');
        if (me.empty(token)) {
            return false;
        }

        Ext.Ajax.request({
            url: '/admin/check',
            params: {
                token: token
            },
            win: me,
            success: function (response, opts) {
                var obj = Ext.decode(response.responseText);
                if (obj.success) {
                    opts.win.activate();
                    return true;
                } else {
                    Ext.Msg.alert('Success', obj.msg);
                    Ext.util.Cookies.clear('username');
                    Ext.util.Cookies.clear('token');
                    Ext.getCmp('loginwindow').show();
                    return false;
                }
            },
            failure: function (response, opts) {
                return false;
            }
        });
    },

    checkIsAuth: function (token) {
        var me = this;

        console.log('Check is auth');

        Ext.Ajax.request({
            url: '/admin/isauth',
            win: me,
            success: function (response, opts) {
                var obj = Ext.decode(response.responseText);
                if (obj.success) {
                    opts.win.activate();
                    return true;
                } else {
                    Ext.Msg.alert('Success', obj.msg);
                    Ext.util.Cookies.clear('username');
                    return false;
                }
            },
            failure: function (response, opts) {
                return false;
            }
        });
    },

    empty: function (value) {
        var undef, key, i, len;
        var emptyValues = [undef, null, false, 0, "", "0"];

        for (i = 0, len = emptyValues.length; i < len; i++) {
            if (value === emptyValues[i]) {
                return true;
            }
        }

        if (typeof value === "object") {
            for (key in value) {
                // TODO: should we check for own properties only?
                //if (value.hasOwnProperty(key)) {
                return false;
                //}
            }
            return true;
        }

        return false;
    },

    keyenter: function (item, event) {
        if (event.getKey() == event.ENTER) {
            this.login();
        }

    },

    logout: function (button) {
        Ext.log('Logout user');
        var lay = this.getViewport().getLayout();
        lay.setActiveItem(0);
        var win = Ext.getCmp('loginwindow');
        win.show();
        var menu = Ext.getCmp('mainmenu');
        menu.getStore().reload();

        Ext.Ajax.request({
            url: '/admin/logout',
            success: function (response, opts) {
                var obj = Ext.decode(response.responseText);
                if (obj.success) {
                    Ext.util.Cookies.clear('username');
                    Ext.util.Cookies.clear('token');
                    return true;
                } else {
                    Ext.Msg.alert('Success', obj.msg);
                    return false;
                }
            },
            failure: function (response, opts) {
                return false;
            }
        });
    }
});