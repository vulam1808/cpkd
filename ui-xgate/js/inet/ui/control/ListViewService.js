// #PACKAGE: listview
// #MODULE: ListViewService
$(function () {
    iNet.ns("iNet.ui.listview");

    iNet.ui.listview = function (config) {
        var _config = config || {};
        this.id = _config.id || 'list-view-div';
        this.idInterface = 'list-view-interface';
        this.idInterfaceItem = _config.uiItemId || 'list-view-item-interface';
        var self = this;
        iNet.ui.listview.superclass.constructor.call(this);

        if (iNet.isEmpty($.getCmp(this.id).prop('id'))){
            throw new Error("Identity not found: Can't create control, please config id right when initialization!...");
            return;
        }

        //APPLY LIST VIEW INTERFACE ========================================
        var $listView = $.getCmp(this.id);
        var $interface = $.getCmp(this.idInterface);
        $listView.html('').append($interface.html());
        //$interface.remove();

        var $interfaceItem = $.getCmp(this.idInterfaceItem);

        var $button = {
            LIST: $('#'+ this.id + ' [data-id="list-view-list"]'),
            TYPE: $('#'+ this.id + ' [data-id="list-view-type"]')
        };

        var $el = {
            control: $('#'+ this.id + ' [data-id="list-view-control"]'),
            toolbar: $('#'+ this.id + ' [data-id="list-view-toolbar"]'),
            basicSearch: $('#'+ this.id + ' [data-id="list-view-basic-search"]'),
            advanceSearch: $('#'+ this.id + ' [data-id="list-view-advance-search"]'),
            noData: $('#'+ this.id + ' [data-id="list-view-no-data"]'),
            data: $('#'+ this.id + ' [data-id="list-view-data"]'),
            dataContent: $('#'+ this.id + ' [data-id="list-view-data-content"]'),

            pullLeft: $('#'+ this.id + ' [data-id="list-view-pull-left"]'),
            pullRight: $('#'+ this.id + ' [data-id="list-view-pull-right"]'),
            paging: $('#'+ this.id + ' [data-id="list-view-paging"]'),
            pagingInfo: $('#'+ this.id + ' [data-id="list-view-paging-info"]'),
            pagingFrom: $('#'+ this.id + ' [data-id="list-view-paging-info-from"]'),
            pagingTo: $('#'+ this.id + ' [data-id="list-view-paging-info-to"]'),
            pagingTotal: $('#'+ this.id + ' [data-id="list-view-paging-info-total"]'),
            pagingPrev: $('#'+ this.id + ' [data-id="list-view-paging-prev-btn"]'),
            pagingRefresh: $('#'+ this.id + ' [data-id="list-view-paging-refresh-btn"]'),
            pagingNext: $('#'+ this.id + ' [data-id="list-view-paging-next-btn"]')
        };

        if (iNet.isFunction(_config.basicSearch)){
            iNet.extend(_config.basicSearch, iNet.Component);
            self.basicSearch = new _config.basicSearch();
            $el.basicSearch.html('').append($.getCmp(self.basicSearch.id).html());
            $.getCmp(self.basicSearch.id).remove();
            self.basicSearch.intComponent(this);
            self.basicSearch.show = function(){
                $el.basicSearch.show();
            };
            self.basicSearch.hide = function(){
                $el.basicSearch.hide();
            };
        }
        if (iNet.isFunction(_config.advanceSearch)){
            iNet.extend(_config.advanceSearch, iNet.Component);
            self.advanceSearch = new _config.advanceSearch();
            $el.advanceSearch.html('').append($.getCmp(self.advanceSearch.id).html());
            $.getCmp(self.advanceSearch.id).remove();
            self.advanceSearch.intComponent(this);
            self.advanceSearch.show = function(){
                if ($el.advanceSearch.css('display') == 'none'){
                    $el.advanceSearch.show();
                } else {
                    $el.advanceSearch.hide();
                }
            };
            self.advanceSearch.hide = function(){
                $el.advanceSearch.hide();
            };
        }
        if (iNet.isFunction(_config.pullLeft)){
            iNet.extend(_config.pullLeft, iNet.Component);
            self.pullLeft = new _config.pullLeft();
            $el.pullLeft.html('').append($.getCmp(self.pullLeft.id).html());
            $.getCmp(self.pullLeft.id).remove();
            self.pullLeft.intComponent(this);
        }
        if (iNet.isFunction(_config.toolbar)){
            iNet.extend(_config.toolbar, iNet.Component);
            self.toolbar = new _config.toolbar();
            $el.toolbar.html('').append($.getCmp(self.toolbar.id).html());
            $.getCmp(self.toolbar.id).remove();
            self.toolbar.intComponent(this);
        }

        var _url = _config.url;
        var _params = _config.params || {};

        //PRIVATE PUBLIC ==============================================
        var resizeHeightContent = function(height){
            $el.dataContent.height(height);
            $el.data.height(height);
            $el.data.slimscroll({
                scrollTo: 0,
                height: height,
                width: '100%'
            });
        };
        var getTotal = function(){
            return Number($el.pagingTotal.text() || 0);
        };
        var setPaging = function(total){
            var __pageSize = iNet.isEmpty(_params.pageSize) ? -1 : _params.pageSize;
            var __pageNumber = iNet.isEmpty(_params.pageNumber) ? -1 : _params.pageNumber;
            var __from = 1, __to = total;

            if (__pageSize != -1 && __pageNumber != -1){
                if (__to > (__pageNumber + 1) * __pageSize) {
                    __to = (__pageNumber + 1) * __pageSize;
                }
                __from = (__pageNumber * __pageSize) + 1;
            }

            $el.pagingRefresh.find('i').removeClass('icon-spin');
            $el.pagingFrom.text(__from);
            $el.pagingTo.text(__to);
            $el.pagingTotal.text(total);
        };
        var gotoPage = function(page) {
            $el.pagingRefresh.find('i').addClass('icon-spin');
            var __params = self.getParams() || {};

            if (page != -3) { //Refresh page
                var __totalSize = getTotal();
                var __pageNumber = Number(__params.pageNumber || 0);
                var __pageSize = Number(__params.pageSize || 20);
                var __pageMax = __pageSize == 0 ? 0 : __totalSize / __pageSize;

                if (page == -1) { //Next page
                    __pageNumber = __pageNumber + 1;
                } else if (page == -2) { //Prev page
                    __pageNumber = __pageNumber - 1;
                } else {
                    __pageNumber = Number(page || 0);
                }

                if (__pageNumber <= 0) {
                    __pageNumber = 0;
                }
                if (__pageNumber >= __pageMax) {
                    __pageNumber--;
                }

                __params.pageNumber = __pageNumber;
            }

            self.setParams(__params);
            self.load(1);
        };

        //FUNCTION PUBLIC ==============================================
        this.storageData = [];
        this.convertData = function(){
            //Override: Coding by person using control.
        };
        this.setTotal = function(total){
            $el.pagingTotal.text(total);
        };
        this.getItemHtml = function(){
            return $interfaceItem.html();
        };
        this.getData = function(index){
            if (iNet.isEmpty(index)){
                var __dataBase64 = (($listView.find('[data-id][data-base64].selected:first').attr('data-base64') || "") + "") + "";
                return iNet.Base64.decodeObject(__dataBase64) || {};
            } else {
                return {};
            }
        };
        this.getSelected = function(){
            var _itemSelected = [];
            $listView.find('[data-id][data-base64]').each(function(i, item){
               if ($(item).find('input[type="checkbox"]').prop('checked')){
                   var _uuid = $(item).attr('data-id') || "";
                   $(self.storageData).each(function(j, data){
                       if (data.key == _uuid){
                           _itemSelected.push({key: data.key, value: data.value});
                           return true;
                       }
                   });
               }
            });
            return _itemSelected;
        };
        this.addItem = function(data){
            var __data = data || {};
            var $itemHtml = String.format(
                self.getItemHtml(),
                (__data.uuid || __data.id),
                iNet.Base64.encodeObject(__data)
            );
            $el.dataContent.append($itemHtml);
            self.storageData.push({index: self.storageData.length, key: (__data.uuid || __data.id), value: __data});
            if (self.storageData.length == 1) {
                $listView.find('[data-id][data-base64]:first').trigger('click');
            }
        };
        this.setParams = function(data){
            _params = data || {};
        };
        this.getParams = function(){
            return (_params || {});
        };
        this.setUrl = function(url){
            _url = url;
        };
        this.getUrl = function(){
            return _url;
        };
        this.load = function(type){
            type = type || 0;

            $el.dataContent.html('');
            $el.data.hide();
            if (type != 1) {
                $el.paging.hide();
            }
            $el.noData.show();
            self.resizeHeight();
            self.storageData = [];
            //console.log(">>load with params>>",_params);
            $.postJSON(_url, _params, function(result){
                $el.dataContent.html('');
                var __result = result || {};
                var __total = 0;
                if (!iNet.isEmpty(__result.total)){
                    __total = (__result.total || 0);
                } else if (!iNet.isEmpty(__result.elements)){
                    __total = (__result.elements || []).length;
                }

                if (__total <= 0){
                    self.resizeHeight();
                    self.fireEvent('indexchange', {});
                } else {
                    if (iNet.isFunction(_config.convertData)){
                        _config.convertData(__result);
                    } else {
                        self.convertData(__result);
                    }

                    setPaging(__total);
                    $el.paging.show();
                    $el.noData.hide();
                    $el.data.show();
                    self.resizeHeight();
                }
            });
        };
        this.refresh = function(){
            self.load();
        };
        this.resizeHeight = function (height) {
            try {
                iNet.getLayout().$iframe.height($(iNet.getLayout().window).height() - 90);
            } catch (e) {
            }

            if ($el.dataContent.children().length) {
                resizeHeightContent($(window).height() - 136);
            } else {
                resizeHeightContent($(window).height() - 188);
            }
        };
        this.setType = function(type){
            //type: max, min, menu
            $el.control.removeClass('min menu').addClass(type);
        };

        //EVENT CONTROL =====================================
        $el.dataContent.on('click', '[data-id]', function(e){
            if ($(e.target).attr('type') == 'checkbox'){
                self.fireEvent('itemselected', self.getSelected());
                return;
            }

            var __dataId = $(e.currentTarget).attr('data-id') || "";
            $el.dataContent.find('[data-id]').removeClass('selected');
            $el.dataContent.find('[data-id="'+(__dataId)+'"]').addClass('selected');
            self.fireEvent('indexchange', self.getData());
        }.createDelegate(this));

        $button.LIST.on('click', function(){
            $el.control.removeClass('menu').addClass('min');
        }.createDelegate(this));
        $button.TYPE.on('click', function(){
            if ($el.control.hasClass('menu')){
                $el.control.removeClass('min menu');
                $button.LIST.hide();
                $button.TYPE.find('i').removeClass('icon-fullscreen').addClass('icon-resize-small');
                self.fireEvent('typechange', 'max');
            } else {
                $el.control.addClass('min');
                $button.LIST.show();
                $button.TYPE.find('i').removeClass('icon-resize-small').addClass('icon-fullscreen');
                self.fireEvent('typechange', 'min');
            }
        }.createDelegate(this));


        $el.pagingRefresh.on('click', function(){
            gotoPage(-3); //refresh page
        });
        $el.pagingPrev.on('click', function(){
            gotoPage(-2); //page - 1
        });
        $el.pagingNext.on('click', function(){
            gotoPage(-1); //page + 1
        });

        $(iNet.getLayout()).on('resize', function () {
            self.resizeHeight();
        });

        //INIT ==============================================
        //window.document.on('loaded', function(){
            self.load();
        //});
    };

    iNet.extend(iNet.ui.listview, iNet.Component);
});
