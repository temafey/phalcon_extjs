Ext.define('Ext.ux.crud.Proxy', {
    extend: 'Ext.data.proxy.Ajax',
    alias: ['proxy.crudproxy', 'proxy.crudstoreproxy'],
    requires: ['Ext.data.proxy.Ajax'],
    exceptionResponse: false,

    listeners : {
        exception : function(proxy, response, operation, eOpts ) {
            proxy.exceptionResponse = response;
            //var data = response.responseText;

            if (!response.isTimeout && response.status !== 200) {
                Ext.Msg.show({
                    title : '',
                    msg :   "Sorry, this action failed with code "+
                            response.status+
                            ". Please retry your action. If error occurs again, please contact our developers. You may perform other actions in any case. ",
                    buttons : Ext.Msg.OK,
                    icon : Ext.MessageBox.INFO
                });
            } else if (response.isTimeout) {
                Ext.Msg.show({
                    title : '',
                    msg : "Response timed out.",
                    buttons : Ext.Msg.OK,
                    icon : Ext.MessageBox.INFO
                });
            } else if (response.status == 200) {
                var obj = Ext.decode(response.responseText);

                if (obj.success) {
                } else {
                    var msg = '';
                    if (obj.error !== undefined) {
                        msg = obj.error;
                        if (msg instanceof Array) {
                            msg = msg.join("\n");
                        }Ext.MessageBox.show({
                            title: 'Server error',
                            msg: msg,
                            icon: Ext.MessageBox.ERROR,
                            buttons: Ext.Msg.OK
                        });
                    }
                }
            }
        }
    },

    /**
     * @cfg {Object} headers
     * Any headers to add to the Ajax request. Defaults to undefined.
     */

    doRequest: function(operation, callback, scope) {
        var me = this,
            writer  = me.getWriter(),
            request = me.buildRequest(operation);

        me.exceptionResponse = false;

        if (operation.allowWrite()) {
            request = writer.write(request);
        }

        Ext.apply(request, {
            binary        : me.binary,
            headers       : me.headers,
            timeout       : me.timeout,
            scope         : me,
            callback      : me.createRequestCallback(request, operation, callback, scope),
            method        : me.getMethod(request),
            disableCaching: false // explicitly set it to false, ServerProxy handles caching
        });

        Ext.Ajax.request(request);

        return request;
    },

    isResponseException: function()
    {
        var me = this;

        if (me.exceptionResponse !== false && me.exceptionResponse.status !== 200) {
            return true;
        }

        return false;
    }

});