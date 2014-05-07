Ext.define('Cms.view.WindowInfo', {

    extend: 'Ext.tab.Panel',
    alias: 'widget.cmsWindowInfo',
    requires: ['Cms.view.WindowDetail'],
    maxTabWidth: 230,
    border: false,

    initComponent: function() {
        var me = this;

        me.tabBar = {
            border: true
        };
        /*me.plugins = [{
            ptype: 'tabscrollermenu',
            maxText  : 15,
            pageSize : 5
        }];*/

        me.callParent();
    },

    /**
     * Add a new Window
     * @param {String} title The title of the Window
     * @param {String} controller The url of the Window
     */
    addWindow: function(title, controller) {
        var me = this;

        active = me.add({
            xtype: 'cmsWindowDetail',
            title: title,
            controller: controller,
            closable: true,
            closeAction: 'destroy',
            listeners: {
                scope: this,
                opentab: me.onTabOpen,
                openall: me.onOpenAll,
                rowdblclick: me.onRowDblClick
            }
        });
        me.setActiveTab(active);
    },

    openTab: function(title, controller) {
        var me = this,
            active = me.getActiveTab();

        if (!active) {
            me.addWindow(title, controller);
        } else {
            if (active.controller != controller) {
                active = me.items.findBy(function(i) {
                    return i.controller === controller;
                });
                if (!active) {
                    me.addWindow(title, controller);
                } else {
                    me.setActiveTab(active);
                }
            }
        }
    },

    onTabOpen: function(post, object, active, params) {
        var me = this;

        if (object instanceof Ext.form.Panel) {
            me.onFormTabOpen(post, object, active, params);
        } else if (object instanceof Ext.app.Controller) {
            me.onGridTabOpen(post, object, active, params);
        }
    },

    /**
     * Listens for a new tab request
     * @private
     * @param {Cms.WindowForm} post
     * @param {Ext.form.Panel} form
     * @param {Ext.data.Model} active
     */
    onFormTabOpen: function(post, form, active, params) {
        var me = this,
            items = [],
            item,
            title,
            id;

        if (Ext.isArray(form)) {
            Ext.each(form, function(form) {
                title = form.title;
                form.title = undefined;
                if (!me.getTabByTitle(title)) {
                    items.push({
                        inTab: true,
                        xtype: 'cmsWindowForm',
                        title: title,
                        closable: true,
                        parent: post,
                        form: form,
                        params: params
                    });
                }
            }, me);
            me.add(items);
        } else {
            id = form.getPrimaryField().getValue();
            title = form.title;
            form.title = undefined;
            if (id !== '') {
                title = title+" ("+id+")";
            } else {
                title = title+' (new)';
            }
            item = me.getTabByTitle(title);
            if (!item) {
                item = me.add({
                    inTab: true,
                    xtype: 'cmsWindowForm',
                    title: title,
                    closable: true,
                    parent: post,
                    form: form,
                    active: active,
                    params: params
                });
            }
            me.setActiveTab(item);
        }
    },

    /**
     * Listens for a new tab request
     * @private
     * @param {Cms.WindowForm} post
     * @param {Ext.app.Controller} controller
     * @param {Ext.data.Model} active
     * @param {object} params
     */
    onGridTabOpen: function(post, controller, active, params) {
        var me = this,
            items = [],
            item,
            title,
            id;

        if (Ext.isArray(controller)) {
            Ext.each(controller, function(controller, params) {
                var title = controller.title;
                var controllerName = controller.$className;
                if (!me.getTabByTitle(title)) {
                    items.push({
                        inTab: true,
                        xtype: 'cmsWindowDetail',
                        title: title,
                        closable: true,
                        parent: post,
                        controller: controllerName,
                        active: active,
                        params: params
                    });
                }
            }, me);
            me.add(items);
        } else {
            id = active.getId();
            title = controller.title;
            item = me.getTabByTitle(title);
            var controllerName = controller.$className;
            if (!item) {
                item = me.add({
                    inTab: true,
                    xtype: 'cmsWindowDetail',
                    title: title,
                    closable: true,
                    parent: post,
                    controller: controllerName,
                    active: active,
                    params: params
                });
            } else {
                item.applyAdditionalParams(active, params);
            }
            me.setActiveTab(item);
        }
    },

    /**
     * Find a tab by title
     * @param {String} title The title of the tab
     * @return {Ext.Component} The panel matching the title. null if not found.
     */
    getTabByTitle: function(title) {
        var me = this;
        var index = me.items.findIndex('title', title);
        return (index < 0) ? null : me.items.getAt(index);
    },

    /**
     * Listens for a row dblclick
     * @private
     * @param {Cms.WindowDetail} detail The detail
     * @param {Ext.data.Model} model The model
     */
    onRowDblClick: function(info, rec) {
        var me = this;
        me.onTabOpen(null, rec);
    },

    /**
     * Listens for the open all click
     * @private
     * @param {Cms.WindowDetail}
     */
    onOpenAll: function(detail) {
        var me = this;
        me.onTabOpen(null, detail.getWindowData());
    }
});