Ext.define('Cms.view.WindowForm', {

    extend: 'Ext.panel.Panel',
    alias: 'widget.cmsWindowForm',
    cls: 'preview',
    autoScroll: true,
    border: true,

    initComponent: function() {
        var me = this;

        Ext.apply(me, {
            dockedItems: [me.createToolbar()]
        });
        if(me.inTab) {
            if (me.form !== undefined) {
                me.items = [me.form];
            }
        } else {
            me.formWindows = new Ext.util.AbstractMixedCollection();
        }
        me.callParent(arguments);
    },

    /**
     * Set the active form
     * @param {Ext.data.Model} rec
     */
    setActive: function(rec) {
        var me = this,
            gotoButton = me.down('button[text=Go to post]'),
            openTab    = me.down('button[text=View in new tab]'),
            openWindow = me.down('button[text=View in new window]');

        me.active = undefined;
        gotoButton.setHref('#');
        gotoButton.disable();
        openTab.enable();

        if (me.form === undefined) {
            me.form = Ext.create(me.controller.form, {
                title: undefined,
                grid: me.grid
            });
            me.add(me.form);
        }

        if (rec !== undefined) {
            me.active = rec;
            me.form.setActiveRecord(me.active);
            gotoButton.enable();
            gotoButton.setHref(me.form.getLink());
        } else {
            me.form.onClear();
        }

        title = me.getFormTitle(me.form);

        var win = me.getWindowByTitle(title);
        if (win && win.isVisible()) {
            openWindow.disable();
        } else {
            openWindow.enable();
        }
    },

    /**
     * Create the top toolbar
     * @private
     * @return {Ext.toolbar.Toolbar} toolbar
     */
    createToolbar: function() {
        var me = this,
            items = [],
            config = {},
            openWindow = true;

        if (!me.inTab) {
            items.push({
                    scope: me,
                    handler: me.openTab,
                    disabled: (me.active === undefined) ? true : false,
                    text: 'View in new tab',
                    iconCls: 'tab-new'
                }
            );
        }
        else {
            config.cls = 'x-docked-noborder-top';
        }

        if (me.form !== undefined) {
            var title = me.getFormTitle(me.form);
            var win = (me.inTab) ? me.parent.getWindowByTitle(title) : me.getWindowByTitle(title);
            if (win && win.isVisible()) {
                openWindow = false;
            }
        } else {
            openWindow = false;
        }

        var link = (me.inTab) ? me.form.getLink() : '#';
        items.push(
            {
                scope: me,
                handler: me.openWindow,
                disabled: (openWindow === false) ? true : false,
                text: 'View in new window',
                iconCls: 'tab-new'
            },
            '-',
            {
                href: link,
                disabled: (link === '#') ? true : false,
                target: '_blank',
                text: 'Go to post',
                iconCls: 'post-go'
            }
        );
        config.items = items;

        return Ext.create('widget.toolbar', config);
    },

    /**
     * Navigate to the active post in a new window
     * @private
     */
    goToPost: function() {
        var me = this;
        window.open(me.form.getLink());
    },

    /**
     * Open the post in a new tab
     * @private
     */
    openTab: function() {
        var me = this,
            form = Ext.create(me.controller.form, {});

        if (me.active !== undefined) {
            form.setActiveRecord(me.active);
        }
        me.fireEvent('opentab', me, form, me.active);
    },

    /**
     * Open the form in a new window
     * @private
     */
    openWindow: function() {
        var me = this,
            windowsContainer = (me.inTab) ? me.parent : me,
            window = (me.inTab) ? me.parent.window : me.window,
            button = me.down('button[text=View in new window]'),
            form =  Ext.create(me.controller.form, {});

        if (me.active !== undefined) {
            form.setActiveRecord(me.active);
        }

        title = me.getFormTitle(form);

        win = windowsContainer.getWindowByTitle(title);
        if (!win) {
            win = window.createWindow();
            win.display = me;
            win.setTitle(title);
            form.title = '';
            win.add(form);
            windowsContainer.formWindows.add(win);

            if(me.inTab) {
                win.buttonPost = me.parent.down('button[text=View in new window]');
                win.buttonTab = me.down('button[text=View in new window]');
            } else {
                win.buttonPost = me.down('button[text=View in new window]');
            }

            win.on("hide", function() {
                win.buttonPost.enable();
                if(win.buttonTab !== undefined) {
                    win.buttonTab.enable();
                }
            }, win);
        } else {
            if (me.inTab && win.buttonTab === undefined) {
                win.buttonTab = me.down('button[text=View in new window]');
            }
        }

        if (win.isVisible()) {
            win.hide(win, function() {
                win.buttonPost.enable();
                if(win.buttonTab !== undefined) {
                    win.buttonTab.enable();
                }
            });
        } else {
            win.show(me, function() {
                win.buttonPost.disable();
                if(win.buttonTab !== undefined) {
                    win.buttonTab.disable();
                }
            });
        }

    },

    getWindowByTitle: function(title) {
        var me = this;

        if (me.formWindows === undefined) {
            return null;
        }
        var index = me.formWindows.findIndex('title', title);

        return (index < 0) ? null : me.formWindows.getAt(index);
    },

    getFormByTitle: function(title) {
        var me = this;
        var index = me.items.findIndex('title', title);

        return (index < 0) ? null : me.items.getAt(index);
    },

    getFormTitle: function(form) {
        id = form.getPrimaryField().getValue();
        var title = form.title;
        if (id !== '') {
            title = title+" ("+id+")";
        } else {
            title = title+' (new)';
        }

        return title;
    }
});
