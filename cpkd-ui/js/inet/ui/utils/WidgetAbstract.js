// #PACKAGE: application-widget-abstract-service
// #MODULE: itaWidget
$(function () {
    iNet.ns('iNet.ui.app');
    if (iNet.isEmpty(iNet.fnGetUrl)){
        iNet.apply(iNet, {
            fnGetUrl: iNet.getUrl,
            getPath: function (relativePath) {
                return this.fnGetUrl(relativePath);
            },
            getUrl: function (relativePath, type) {
                if (relativePath == "system/account/role"){
                    if ((iNet.firmPrefix || "smartcloud") != "smartcloud"){
                        relativePath = "subfirm/account/list";
                    }
                }

                if (!iNet.isEmpty(type)){
                    return iNet.getPath(relativePath);
                } else {
                    return iNet.getPUrl(relativePath);
                }
            }
        });
    }

    iNet.ui.app.widget = function (config) {
        var __config = config || {};
        iNet.apply(this, __config);
        this.notify = null; this.dialog = null;
        iNet.ui.app.widget.superclass.constructor.call(this);
    };
    iNet.extend(iNet.ui.app.widget, iNet.ui.Widget, {
        constructor: iNet.ui.app.widget,
        createNotify: function(){
            if (!this.notify) {
                this.notify = new iNet.ui.form.Notify({
                    id: iNet.generateId(),
                    delay: 3000
                });
            }

            return this.notify;
        },
        showMessage: function (type, title, content) {
            this.notify = this.createNotify();
            this.notify.setType(type || 'error');
            this.notify.setTitle(title || '');
            this.notify.setContent(content || '');
            this.notify.show();
        },
        getNotifyContent: function (mainNotify, messageNotify) {
            if (iNet.isEmpty(mainNotify)) { mainNotify = ""; }

            if (!iNet.isEmpty(messageNotify)) {
                if (iNet.isArray(messageNotify)) {
                    var __errors = messageNotify;
                    var __message = [];
                    try {
                        __errors.forEach(function (error) {
                            if (!iNet.isEmpty(error.message || "")) {
                                var __messageValue = iNet.resources.errors[error.message || ""];
                                if (iNet.isEmpty(__messageValue)) {
                                    __messageValue = error.message;
                                }
                                __message.push('<br/>' + __messageValue);
                            } else {
                                __message.push('<br/>' + error);
                            }
                        });
                        return String.format(mainNotify, __message);
                    } catch (err) {
                        console.log(">> notifyContent >>", messageNotify);
                        return "";
                    }

                } else {
                    var __message = messageNotify || "";
                    return String.format(mainNotify, __message);
                }
            } else {
                var __message = messageNotify || "";
                return String.format(mainNotify, __message);
            }

            return "";
        },
        notifyError: function (titleNotify, contentNotify) {
            this.notify = this.createNotify();
            this.notify.setType("error");
            this.notify.setTitle(titleNotify);
            this.notify.setContent(contentNotify);
            this.notify.show();
        },
        notifySuccess: function (titleNotify, contentNotify) {
            this.notify = this.createNotify();
            this.notify.setType("success");
            this.notify.setTitle(titleNotify);
            this.notify.setContent(contentNotify);
            this.notify.show();
        },
        confirmDialog: function (title, content, okFn) {
            var __okFn = iNet.isFunction(okFn) ? okFn.createDelegate(this) : iNet.emptyFn;
            if (!this.dialog) {
                this.dialog = new iNet.ui.dialog.ModalDialog({
                    id: iNet.generateId(),
                    title: title || '',
                    content: content || '',
                    buttons: [
                        {
                            text: iNet.resources.message.button.ok,
                            cls: 'btn-primary',
                            icon: 'icon-ok icon-white',
                            fn: __okFn
                        },
                        {
                            text: iNet.resources.message.button.cancel,
                            cls: 'btn-default',
                            icon: 'icon-remove',
                            fn: function () {
                                this.hide();
                            }
                        }
                    ]
                });
            }
            return  this.dialog;
        },
        hasPattern: function () {
            return !iNet.isEmpty(iNet.pattern);
        }
    });
});