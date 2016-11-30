/*
 Copyright 2008-2011 by Nguyen Thanh Vy (ntvy@truthinet.com.vn)
 Licensed under the iNet Solutions Corp.,;
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 http://www.truthinet.com/licenses
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */
iNet.ui.common.PagingToolbar = function(config) {
  config = config || {};
  this.prefix = (config.prefix) ? config.prefix : config.id;
  this.id = 'paging';
  this.msgId = 'empty';
  this.total = 0;
  this.cpage = 0;
  this.limit = 20;
  this.off = 0;
  this.pages = 0;
  this.params = [];
  this.object = {};
  this.url = '';
  this.type = 'POST';
  this.store = [];
  this.idProperty = 'id';
  this.hideSearch = true;
  this.hideDownload = true;
  this.hideFormSearch = true;
  this.onSuccess = function() {
  };
  this.onError = function() {
  };
  this.onSearch = function() {
  
  };
  var ajaxLoading = new iNet.ui.common.AjaxLoading();
  var resources = {
    displayMsg: this.displayMsg || 'Displaying <b>{0}</b> - <b>{1}</b> of <b>{2}</b>',
    emptyMsg: this.emptyMsg || 'No data to display',
    beforePageText: this.beforePageText || 'Page',
    afterPageText: this.afterPageText || 'of {0}',
    firstText: this.firstText || 'First Page',
    prevText: this.prevText || 'Previous Page',
    nextText: this.nextText || 'Next Page',
    lastText: this.lastText || 'Last Page',
    refreshText: this.refreshText || 'Refresh',
    searchText: this.searchText || 'Search',
    downloadText: this.downloadText || 'Download'
  };
  //apply config
  iNet.apply(this, config);
  iNet.apply(this, resources);
  //private 
  this.sortInfo = this.sortInfo ? this.sortInfo : [];
  this.sortInfo[1] = this.sortInfo[1] ? this.sortInfo[1].toUpperCase() : 'ASC';
  this.prefix = (this.prefix) ? (this.prefix + '-') : '';
  this.__cid = String.format('{0}cpage', this.prefix);
  this.cid = String.format('#{0}', this.__cid);
  this.pid = String.format('#{0}', this.id);
  this.msgId = String.format('#{0}', this.msgId);
  /**
   * Generate paging.
   */
  this.pagingGenerate = function() {
    //========================================
    if (this.store.length > 0) {
      $(this.msgId).html('');
    }
    else {
      $(this.msgId).html(String.format('<i>{0}</i>', this.emptyMsg));
    }
    //check current page and sum pages.
    if (this.pages > 0 && this.cpage === 0) {
      this.cpage = 1;
    }
    else 
      if (this.pages === 0) {
        this.cpage = 0;
      }
    var __sum = ((this.cpage * this.limit) > this.total) ? this.total : (this.cpage * this.limit);
    var __off = (this.pages > 0 && this.off > 0) ? ((this.off - 1) * this.limit + 1) : 0;
    var __infoText = String.format(this.displayMsg, __off, __sum, this.total);
    var buttonsId = {
      first: (this.prefix + 'btnFirst'),
      next: (this.prefix + 'btnNext'),
      prev: (this.prefix + 'btnPrev'),
      last: (this.prefix + 'btnLast'),
      search: (this.prefix + 'btnSearch'),
      refresh: (this.prefix + 'btnRefresh'),
      download: (this.prefix + 'btnDownload')
    };
    var __prevBtn = String.format('<button id="{0}" type="button" class="first" title="{1}"><i class="icon-chevron-left"></i></button>', buttonsId.prev, this.prevText);
    var __nextBtn = String.format('<button id="{0}" type="button"  title="{1}"><i class="icon-chevron-right"></i></button>', buttonsId.next, this.nextText);
    var __searchBtn = String.format('<button id="{0}" type="button" class="{2}" title="{1}"><i class="icon-search {3}"></i></button>', buttonsId.search, this.searchText,(this.hideFormSearch)? '': 'btn-info',(this.hideFormSearch)? '': 'icon-white');
    var __downloadBtn = String.format('<button id="{0}" type="button" title="{1}"><i class="icon-download-alt"></i></button>', buttonsId.download, this.downloadText);
    var __refreshBtn = String.format('<button id="{0}" type="button" class="last" title="{1}"><i class="icon-refresh"></i></button>', buttonsId.refresh, this.refreshText);
    //generate paging
    var __pagingDiv = String.format('<span>{0}</span> {1} {2} {3} {4} {5}', __infoText,__prevBtn,  __nextBtn, (this.hideSearch)? '': __searchBtn,(this.hideDownload)? '': __downloadBtn, __refreshBtn);
    $(this.pid).html(__pagingDiv);
    if (!this.hideDownload) {
      if ($('#searchdownload_').length < 1) {
        $('body').append('<form id="searchdownload_" class="download-form"><input type="hidden" name="path"/><input type="hidden" name="bean"/></form>');
      }
		}
    var preId = "#" + buttonsId.prev;
    var nextId = "#" + buttonsId.next;
    var searchId = "#" + buttonsId.search;
    var downloadId = "#" + buttonsId.download;
    var refreshId = "#" + buttonsId.refresh;
    //handle button======================
    var that = this;
    $(preId).click(function() {
      that.navigatePage(-1);
    });
    $(nextId).click(function() {
      that.navigatePage(1);
    });
    $(refreshId).click(function() {
      that.search();
    });
    $(searchId).click(function() {
			/*
      var $icon = $(this).find('i');
      if (!that.hideFormSearch) {
        $(this).removeClass('btn-info');
        $icon.removeClass('icon-white');
        that.hideFormSearch = true;
      }
      else {
        $(this).addClass('btn-info');
        $icon.addClass('icon-white');
        that.hideFormSearch = false;
      }
      */
      that.onSearch();
    });
    $(downloadId).click(function() {
      that.onDownload();
    });
    //=====================================
    if (this.pages === 0) {
      $(downloadId).attr("disabled", true).addClass('disabled');
      $(refreshId).attr("disabled", true).addClass('disabled');
    }
    var back = (this.cpage < 2);
    var next = (this.cpage == this.pages);
    //add or remove class button.
    $(preId).attr("disabled", back);
    //$(firstId).attr("disabled", back);
    $(nextId).attr("disabled", next);
    //$(lastId).attr("disabled", next);
    if (back) {
      $(preId).addClass('disabled');
      //$(firstId).addClass('disabled');
    }
    else {
      $(preId).removeClass('disabled');
      //$(firstId).removeClass('disabled');
    }
    if (next) {
      $(nextId).addClass('disabled');
      //$(lastId).addClass('disabled');
    }
    else {
      $(nextId).removeClass('disabled');
      //$(lastId).removeClass('disabled');
    }
  };
  /**
   * search data
   * @param {Boolean} action - If true the re search.
   */
  this.search = function(action) {
    if (this.mask) {
      ajaxLoading.addMask(this.mask,{title: this.maskTitle || iNet.resources.message.load_msg});
    }
    if (this.url === "") {
      return;
    }
    this.off = (action) ? 0 : this.cpage;
    this.off = (this.off === 0) ? 1 : this.off;
    this.cpage = this.off;
    var limitObj = {
      name: 'limit',
      value: this.limit
    };
    var startObj = {
      name: 'start',
      value: ((this.off-1)*this.limit)
    };
    this.params[0] = startObj;
    this.params[1] = limitObj;
    var that = this;
    $.ajax({
      url: this.url,
      type: this.type,
      data: this.params,
      dataType: 'json',
      success: function(data) {
        var __result = data || {};
        try {
          that.total = __result.results || 0;
          that.pages = parseInt((that.total / that.limit), 10) + ((that.total % that.limit > 0) ? 1 : 0);
          that.store = __result.rows || [];
          that.pagingGenerate();
          that.onSuccess(that.store);//callback function
        } 
        catch (e) {
        }
      }
    });
  };
  this.load = this.search;
  this.navigatePage = function(value) {
    var temp = this.cpage + value;
    if (temp > 0 && temp <= this.pages) {
      this.cpage = temp;
      this.search();
    }
  };
  this.gotoPage = function(value) {
    if (value > 0) {
      this.cpage = value;
      this.search();
    }
  };
	/*
  $(this.pid).unbind('keydown');
  $(this.pid).bind('keydown', function(e) {
    var code = (e.keyCode ? e.keyCode : e.which);
    if (code == 13) { //Enter keycode
      var v = $(this.cid).val();
      var page = parseInt(v, 10);
      if (page > 0 && page <= this.pages) {
        this.gotoPage(page);
      }
      else {
        $(this.cid).val(this.cpage);
      }
      return false;
    }
  }.createDelegate(this));
  */
  var downloadParams = [];
  var checkFileCompleted = function(uuid) {
    var cur_value = 1;
    var __uuid = uuid;
    if (iNet.isEmpty(__uuid)) {
      return;
    }
    var __iwct = downloadParams[5].value;
    var __iwm = downloadParams[6].value;
    var __params = DocumentCommonService.createParams(__iwct, __iwm, 'READ_ONLY', 'chkexpprogress');
    __params.push({
      name: 'object',
      value: iNet.JSON.encode({
        'uuid': __uuid
      })
    });
    $.ajax({
      "dataType": 'json',
      "type": "POST",
      "url": iNet.getUrl('jsonajax'),
      "data": __params,
      "success": function(result) {
        var __result = result || {};
        var __success = (__result.success != undefined) ? __result.success : true;
        if (__success) {
          var __path = __result.path;
          if (typeof loader != "undefined") {
            loader.pnotify_remove();
          }
          
          if (!iNet.isEmpty(__path)) {
            var __form = document.getElementById('searchdownload_');
            __form.action = iNet.getUrl('receiver-download-file');
            __form.path.value = __path;
            __form.target = '';
            __form.bean.value = 'fileBean';
            __form.submit();
          }
          else {
            loader = $.pnotify({
              title: 'Đang tải',
              text: '<br/><div class="progress_bar progress progress-striped active" />',
              icon: 'picon picon-dialog-infor',
              hide: false,
              closer: false,
              sticker: false,
              before_open: function(pnotify) {
                var $progress = pnotify.find("div.progress_bar");
                $progress.html(String.format('<div class="bar" style="width: {0}%;"></div>', cur_value));
                timer = setInterval(function() {
                  if (cur_value >= 100) {
                    checkFileCompleted(__uuid);
                    clearInterval(timer);
                    return;
                  }
                  cur_value += 10;
                  $progress.html(String.format('<div class="bar" style="width: {0}%;"></div>', cur_value));
                }, 300);
              }
            });
          }
        }
      }
    });
  };
  /**
   * Download store
   */
  this.onDownload = function(action) {
    if (this.mask) {
      ajaxLoading.addMask(this.mask, {
        title: this.maskTitle || iNet.resources.message.load_msg
      });
    }
    var __params = iNet.clone(this.params);
    __params[2] = {
      name: 'action',
      value: 'export'
    };
    __params[3] = {
      name: 'iwa',
      value: 'export'
    };
    downloadParams = __params;
    $.ajax({
      url: this.url,
      type: this.type,
      data: __params,
      dataType: 'json',
      success: function(result) {
        var __result = result || {};
        var __success = (__result.success != undefined) ? __result.success : true;
        if (__success) {
          var __uuid = __result.uuid;
          checkFileCompleted(__uuid);
        }
      }
    });
  };
};
iNet.ui.common.PagingToolbar.prototype = {
  setParams: function(params) {
    this.params = params || [];
  },
  getParams: function() {
    return this.params;
  },
  getLimit: function() {
    return this.limit;
  },
  getOff: function() {
    return this.off;
  },
  getStore: function() {
    return this.store;
  },
  setUrl: function(url) {
    this.url = url || '';
  },
  getUrl: function() {
    return this.url;
  },
  /** Get the Record with the specified id.
   * @param {String} id The id of the Record to find.
   * @return {Object} The Record with the passed id. Returns undefined if not found.
   */
  getById: function(id) {
    for (var i = 0; i < this.store.length; i++) {
      if (this.store[i][this.idProperty] && this.store[i][this.idProperty] == id) {
        return this.store[i];
      }
    }
    return undefined;
  },
  /**
   * Sort the Records.
   * @param {String} fieldName - the name of the field to sort by.
   * @param {String} dir (optional) The sort order, 'ASC' or 'DESC' (case-sensitive, defaults to 'ASC')
   */
	sort: function(fieldName, dir){
    dir = dir ? dir.toUpperCase() : 'ASC';
    this.sortInfo = [fieldName, dir];
    this.search();
	},
  /**
   * Sets the default sort column and order to be used by the next.
   * @param {String} fieldName The name of the field to sort by.
   * @param {String} dir (optional) The sort order, 'ASC' or 'DESC' (case-sensitive, defaults to 'ASC')
   */
	setDefaultSort: function(fieldName, dir){
    dir = dir ? dir.toUpperCase() : 'ASC';
    this.sortInfo = [fieldName, dir];
  },
  setMask: function(mask) {
    this.mask = $(mask);
  },
  getMask: function() {
    return this.mask;
  },
  hide: function() {
    $(this.pid).hide();
  },
  show: function() {
    $(this.pid).show();
  }
};