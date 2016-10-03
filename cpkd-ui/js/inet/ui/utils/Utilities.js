// #PACKAGE: ita-utils-service
// #MODULE: itaUtilities

CommonService = {
    pageRequest: {
        xgate: 'xgate/page/index',
        hashtag: {
            chart: "#receiver-chart",
            created: "#receiver-queue",
            inprocess: "#receiver-inprocess",
            completed: "#receiver-completed",
            rejected: "#receiver-rejected",
            published: "#receiver-published",
            additional: "#receiver-additional"
        },
        created: 'xgate/page/receiver/queue',
        inprocess: 'xgate/page/receiver/inprocess',
        rejected: 'xgate/page/receiver/rejected',
        completed: 'xgate/page/receiver/completed',
        published: 'xgate/page/receiver/published',
        additional: 'xgate/page/receiver/additional',
        formNo01: 'xgate/page/receiver/formNo01',
        formNo03: 'xgate/page/receiver/formNo03',
        formNo04: 'xgate/page/receiver/formNo04'
    },
    cleanUnicode: function (input) {
        var output = "";
        for (var i = 0; i < input.length; i++) {
            if (input.charCodeAt(i) <= 127) {
                output += input.charAt(i);
            }
        }
        return output;
    },
    cleanSpecialChar: function (input) {
        var output = input || "";
        output = output.replace(/ /gi, "");
        output = output.replace(/-/gi, "");
        output = output.replace(/%/gi, "");
        output = output.replace(/$/gi, "");
        output = output.replace(/#/gi, "");
        output = output.replace(/@/gi, "");
        output = output.replace(/!/gi, "");
        return output;
    },
    isSuccess: function (data) {
        var __data = data;
        var __uuid = iNet.isEmpty(__data.uuid || '') ? "" : __data.uuid;
        var __intl = iNet.isEmpty(__data.intl) ? "" : __data.intl;

        if (!iNet.isEmpty(__data) && JSON.stringify(__data) != "{}" && !data.hasOwnProperty("errors") && __uuid != "ERROR!" && iNet.isEmpty(__intl)) {
            return true;
        }

        return false;
    },
    getRequests: function () {
        var s1 = location.search.substring(1, location.search.length).split('&'),
            r = {}, s2, i;
        for (i = 0; i < s1.length; i += 1) {
            s2 = s1[i].split('=');
            r[decodeURIComponent(s2[0])] = decodeURIComponent(s2[1]);
        }
        return r;
    },
    getArrayKey : function(array, key){
        var __key = key || "id";
        var arr = [];
        $.each(array || [], function (i, obj) {
            arr.push((obj[__key] || "").toString());
        });
        return arr;
    },
    getIndexOfArray : function(value, array, key){
        var __key = key || "id";
        var __value = (value || "").toString();
        var arr = [];
        $.each(array || [], function (i, obj) {
            arr.push((obj[__key] || "").toString());
        });
        var __index = arr.indexOf(__value);

        return __index;
    },
    getCurrentDate: function(format){
        var __format = format || "d/m/Y";
        return new Date().format(__format);
    },
    getFirstDate: function(format){
        var __currentDate = new Date();
        var __format = format || "d/m/Y";
        return new Date(__currentDate.getFullYear(), __currentDate.getMonth(), 1).format(__format);
    },
    syncProcedure: function(){
        $.postJSON(iNet.getUrl('onegate/firmprocedure/synch'), {}, function(result){
            console.log("CommonService syncProcedure", {result: result});
        });
    },
    getTotalPage: function(totalRecord, pageSize){
        var nPage = parseInt(parseInt((totalRecord/pageSize)) + parseInt(((totalRecord%pageSize > 0) ? 1 : 0)));
        if (isNaN(nPage)){
            return 0;
        }
        return nPage;
    },
    getNumber: function(number, option){
        var number = parseInt(number);
        if (isNaN(number)){
            return option;
        }
        return number;
    },
    getPercentCurrentDate: function(beginDate, endDate, completedDate){
        var __percent = 0;
        var __currentDate = new Date().getTime();
        var __lengthDate = endDate - beginDate;
        var __indexDate = __currentDate - beginDate;
        if (__lengthDate > 0 && __indexDate > 0){
            __percent = __indexDate*100/__lengthDate;

            if (this.getNumber(__percent, 0)>=100){
                __percent = 100;
            } else if (this.getNumber(__percent, 0)<=0){
                __percent = 0;
            } else {
                __percent = __percent.toFixed(0);
            }
        }
        return __percent;
    }

};

FormService = {
    appendHiddenField: function($el, name, value){
        $el.find('[name="'+name+'"]').remove();
        $el.append(String.format('<div class="hide"><input type="text" name="{0}" value="{1}"></div>', name, value));
    },
    checkService: function(){
        var serviceObject = $.getJSON(iNet.getUrl('common/page/ping'), {}, function(result) { });
        return (serviceObject.done() || {}).status === 200;
    },
    checkPageExists: function (src) {
        var http = new XMLHttpRequest();
        http.abort();
        http.open('HEAD', src, false);
        http.send();
        console.log('http status ----------->', http.status);
        return http.status === 200;
    },
    disable: function (control) {
        if (control != null) control.attr("disabled", "disabled");
    },
    enable: function (control) {
        if (control != null) control.removeAttr("disabled");
    },
    createSelect: function (id, datasource, idValue, formatView, allowClear, multiple, ajax, query) {
        var __datasource = datasource || [];
        var __idValue = idValue || "id";
        var __formatView = formatView || 1; //View= 1: name; 2: code name
        var __allowClear = iNet.isEmpty(allowClear) ? true : allowClear;
        var __multiple = iNet.isEmpty(multiple) ? false : multiple;
        var __ajax = iNet.isEmpty(ajax) ? {} : ajax;
        var __query = iNet.isFunction(query) ? query : "";

        var __config = {};
        __config.id = id;
        __config.placeholder = ita.resources.common.select_value || "Select value";
        __config.allowClear = __allowClear;
        __config.multiple = __multiple;
        __config.data = {
            results: __datasource,
            text: function (item) {
                return iNet.isEmpty(item.name) ? "" : item.name;
            }
        };
        __config.idValue = function (data) {
            return data[__idValue];//(__idValue == "code") ? data.code : data.id;
        };
        __config.initSelection = function (element, callback) {
            var __key = __idValue;
            var __value = element.val().split(',') || [];
            var __dataArray = [];
            var __dataValue = "";
            var __multiSelect = __multiple;

            if (!iNet.isEmpty(__value)) {
                for (var i = 0; i < __value.length; i++) {
                    for (var j = 0; j < __datasource.length; j++) {
                        if ((__key == "id") ? __datasource[j][__key].toString() == __value[i].toString() : __datasource[j][__key].toString() == __value[i].toString()) {
                            __datasource[j].name = iNet.isEmpty(__datasource[j].name) ? "" : __datasource[j].name;
                            __datasource[j].code = iNet.isEmpty(__datasource[j].code) ? "" : __datasource[j].code;

                            if (__multiSelect) {
                                __dataArray.push(__datasource[j]);
                            } else {
                                __dataValue = __datasource[j];
                            }
                            break;
                        }
                    }
                }
            }

            if (__multiSelect) {
                callback(__dataArray);
            } else {
                callback(__dataValue);
            }

        };
        __config.formatResult = function (data) {
            var __dataCode = iNet.isEmpty(data.code) ? "" : data.code;
            var __dataName = iNet.isEmpty(data.name) ? "" : data.name;

            var markup1 = __dataName;
            var markup2 = String.format('<span style="color: #c09853; text-align: right; padding-right: 5px"><strong>{0}<strong></strong></strong></span> {1}', __dataCode, __dataName);
            var markup = (__formatView == 1) ? markup1 : markup2;
            return markup;
        };
        __config.formatSelection = function (data) {
            var __dataCode = iNet.isEmpty(data.code) ? "" : data.code;
            var __dataName = iNet.isEmpty(data.name) ? "" : data.name;

            var markup1 = __dataName;
            var markup2 = String.format('<label class="label label-info marg-b-0">{0}</label> {1}', __dataCode, __dataName);
            var markup = (__formatView == 1) ? markup1 : markup2;
            return markup;
        };
        if (!iNet.isEmpty(ajax)) __config.ajax = __ajax;
        if (!iNet.isEmpty(__query)) __config.query = query;

        return new iNet.ui.form.select.Select(__config);
    },
    createDate: function ($control) {
        $control.mask('99/99/9999');
        var __datePicker = $control.datepicker({
            format: 'dd/mm/yyyy'
        }).on('changeDate', function (ev) {
            __datePicker.hide();
        }).data('datepicker');

        $control.next().on('click', function () {
            $(this).prev().focus();
        });
        $control.on('keydown', function (ev) {
            if (ev.which == 13 || ev.which == 9) __datePicker.hide();
            if ((ev.which >= 48 && ev.which <= 57) || ev.which == 191 || ev.which == 13 || ev.which == 9) {
                var v = $(this).val();
                var __arg = v.indexOf('.') > 0 ? (v.split(".") || []) : (v.split("/") || []);
                var __dateDay = ((__arg.length > 0) ? __arg[0] || "" : "").replace(/_/gi, "");
                var __dateMonth = ((__arg.length > 1) ? __arg[1] || "" : "").replace(/_/gi, "");
                var __dateYear = ((__arg.length > 2) ? __arg[2] || "" : "").replace(/_/gi, "");

                if (__dateDay.length == 1) __dateDay = "0" + __dateDay;
                if (__dateMonth.length == 1) __dateMonth = "0" + __dateMonth;

                if (__dateYear.length == 2) {
                    __dateYear = "20" + __dateYear;
                }
                if (__dateMonth.length == 2) {
                    if (Number(__dateMonth) > 12) __dateMonth = 12;
                    if (Number(__dateMonth) < 1) __dateMonth = "01";
                }

                var __dateDayMax = "31";
                if (!iNet.isEmpty(__dateYear)) {
                    switch (__dateMonth) {
                        case "01":
                        case "03":
                        case "05":
                        case "07":
                        case "08":
                        case "10":
                        case "12":
                            __dateDayMax = "31";
                            break;
                        case "04":
                        case "06":
                        case "09":
                        case "11":
                            __dateDayMax = "30";
                            break;
                        case "02":
                            !(Number(__dateYear) % 400) ? __dateDayMax = "29" : __dateDayMax = "28";
                            break;
                    }
                }

                if (__dateDay.length == 2) {
                    if (Number(__dateDay) > Number(__dateDayMax)) __dateDay = __dateDayMax;
                    if (Number(__dateDay) < 1) __dateDay = "01";
                }

                __dateDay = (iNet.isEmpty(__dateDay) ? "" : __dateDay + "/");
                __dateMonth = (iNet.isEmpty(__dateMonth) ? "" : __dateMonth + "/");
                __dateYear = (iNet.isEmpty(__dateYear) ? "" : __dateYear);

                if (ev.which == 191 || ev.which == 13 || ev.which == 9) {
                    $(this).val(__dateDay + __dateMonth + __dateYear);
                }
            }
        });
        $control.on('keyup', function (ev) {
        });
        return __datePicker;
    },
    validateDate: function(value, isDefault){
        var formats = 'd/m/Y';
        var format = 'dd/MM/yyyy';
        var isDate = false;

        if (format == 'dd/MM/yyyy') formats = 'd/m/Y';
        if (format == 'dd/MM/yyyy HH:mm:ss') formats = 'd/m/Y H:i:s';
        if (format == 'MM/dd/yyyy') formats = 'm/d/Y';
        if (format == 'MM/dd/yyyy HH:mm:ss') formats = 'm/d/Y H:i:s';

        var __format = formats;
        if (__format.length >= 5) {
            __format = __format.substring(0, 5);
        }

        var date = null;
        if (iNet.isEmpty(value)) {
            return false;
        }
        try {
            var split = '/';
            var indexSplit = value.indexOf(split);
            var arg = value.split(split);
            var day = 0, month = 0, year = 0;

            if (arg.length == 3) {
                day = value.substring(0, indexSplit);
                indexSplit += 1;
                month = value.substring(indexSplit, value.indexOf(split, indexSplit));
                indexSplit = value.indexOf(split, indexSplit) + 1;
                year = value.substring(indexSplit);
            }

            if (arg.length == 2) {
                month = value.substring(0, indexSplit);
                if (month > 12 && isDefault){
                    day = month;
                    month = "01";
                } else {
                    day = "01";
                }
                indexSplit += 1;
                year = value.substring(indexSplit);
            }

            if (arg.length == 1) {
                year = value;
                month = "01";
                day = "01";
            }

            if (isDefault){
                if(iNet.isEmpty(year)) year = 1;
                if(iNet.isEmpty(month)) month = 1;
                if(iNet.isEmpty(day)) day = 1;
            }

            var temp = month + split + day + split + year;
            if (temp.substring(temp.length-1) == split && !isDefault) {
                temp = "notDate";
            }
            date = new Date(Date.parse(temp)).getTime();
        }
        catch (e) {
            isDate = false;
        }

        isDate = (!isNaN(parseFloat(date)) && isFinite(date));
        return isDate;
    },
    displayContent : function($content, status){
        status = status || '';
        if ($content.hasClass('hide')){
            if (status != 'hide') { $content.removeClass('hide'); }
        } else {
            if (status != 'show') { $content.addClass('hide'); }
        }
    }
};

iNet.FileFormat = {
    /**
     * distance of openoffice and msoffice.
     */
    NEXT_FORMAT: 6,
    /**
     * OpenOffice Word
     */
    OO_WORD: 0 ,
    /**
     * OpenOffice Excel.
     */
    OO_EXCEL: 1,
    /**
     * OpenOffice Power Point.
     */
    OO_POWERPOINT: 2,
    /**
     * OpenOffice Graph.
     */
    OO_GRAPH: 3,
    /**
     * OpenOffice Math.
     */
    OO_MATH: 4,
    /**
     * OpenOffice Database.
     */
    OO_DATABASE: 5,
    /**
     * Microsoft Word.
     */
    MS_WORD: 6,
    /**
     * Microsoft Excel.
     */
    MS_EXCEL: 7,
    /**
     * Microsoft Power Point.
     */
    MS_POWERPOINT: 8,
    /**
     * Microsoft Access.
     */
    MS_ACCESS: 9,
    /**
     * Microsoft Project.
     */
    MS_PROJECT: 10,
    /**
     * Microsoft Visio.
     */
    MS_VISIO: 11,
    /**
     * Text document.
     */
    DOC_TEXT: 12,
    /**
     * HTML document.
     */
    DOC_HTML: 13,
    /**
     * XML document.
     */
    DOC_XML: 14,
    /**
     * PDF document.
     */
    DOC_PDF: 15,
    /**
     * Image document.
     */
    DOC_IMG: 16,
    /**
     * iNet document.
     */
    DOC_INET: 17,
    /**
     * Other document
     */
    DOC_OTHER: 18,
    /**
     * Microsoft Word 2007
     */
    MS_WORD_2007: 19,
    /**
     * Microsoft Excel 2007.
     */
    MS_EXCEL_2007: 20,
    /**
     * Microsoft PowerPoint 2007.
     */
    MS_POWERPOINT_2007: 21,
    /**
     * Document format
     */
    FORMAT:['oo-word','oo-excel','oo-powerpoint','oo-graph','oo-math','oo-database','ms-word','ms-excel',
        'ms-powerpoint','ms-access','ms-project','ms-visio','doc-text','doc-html','doc-xml','doc-pdf',
        'doc-img','doc-inet','doc-other','ms-word7','ms-excel7','ms-powerpoint7'],
    /**
     * Document extension format.
     */
    EXT_FORMAT:['odt','ods','odp','odg', 'odf', 'odb', 'doc', 'xls', 'ppt', 'mdb', 'mpp',
        'vsd', 'txt', 'html', 'xml', 'pdf', 'jpg', 'dtt', 'oth','docx','xlsx','pptx'],
    /**
     * Document format name.
     */
    FORMAT_NAME:[
        'Open Office Word',
        'Open Office Excel',
        'Open Office Powerpoint',
        'Open Office Graph',
        'Open Office Math',
        'Open Office Database',
        'Microsoft Word',
        'Microsoft Excel',
        'Microsoft Powerpoint',
        'Microsoft Access',
        'Microsoft Project',
        'Microsoft Visio',
        'Text Document',
        'HTML Document',
        'XML Document',
        'PDF Document',
        'Image Document',
        'iNet Document',
        'Others',
        'Microsoft Word 2007',
        'Microsoft Excel 2007',
        'Microsoft PowerPoint 2007'
    ],
    /**
     * @return the file extension.
     */
    getExtension: function(file) {
        if (file == undefined || file == '')
            return '';
        var position = file.lastIndexOf('.');
        if (position == -1)
            return '';

        // get file extension.
        return file.substr(position + 1, file.length);
    },

    /**
     * @return the format value.
     */
    getFormat: function(extension) {
        for (var index = 0; index < this.EXT_FORMAT.length; index++) {
            if (extension == this.EXT_FORMAT[index])
                return index;
        }

        // return document other.
        return this.DOC_OTHER;
    },
    getIcon: function(extension){
        var iconCls = 'file-icon xicon-' + extension || 'oth';
        //'icon-paper-clip'
        return iconCls;
    },
    getFileIcon: function(file){
        var ext= iNet.FileFormat.getExtension(file);
        return iNet.FileFormat.getIcon(ext);
    },
    /**
     * change format to ms office
     * @param {int} format- the given document format
     * @return {int}
     */
    changeFormatToMSOffice: function(format) {
        return format + this.NEXT_FORMAT;
    },

    /**
     * change format to openoffice
     * @param {int} format - the given document format
     * @return {int}
     */
    changeFormatToOO: function(format) {
        return format - this.NEXT_FORMAT;
    },
    getSize : function(size) {
        var __size = size || 0;
        var __rageToFix = 2;
        if (__size < 1024) {
            return String.format('{0} B', __size.toFixed(__rageToFix))
        }
        __size = __size / 1024;
        if (__size < 1024) {
            return String.format('{0} KB', __size.toFixed(__rageToFix))
        }
        __size = __size / 1024;
        if (__size < 1024) {
            return String.format('{0} MB', __size.toFixed(__rageToFix))
        }
        __size = __size / 1024;
        if (__size < 1024) {
            return String.format('{0} GB', __size.toFixed(__rageToFix))
        }
    }
};

/*----------------------------------------------
 |               S T R I N G                   |
 ==============================================*/
iNet.applyIf(String.prototype, {
    isDate: function () {
        // First check for the pattern
        if (!/^\d{2}\/\d{2}\/\d{4}$/.test(this))
            return false;

        // Parse the date parts to integers
        var parts = this.split("/");
        var day = parseInt(parts[0], 10);
        var month = parseInt(parts[1], 10);
        var year = parseInt(parts[2], 10);

        // Check the ranges of month and year
        if (year < 1000 || year > 3000 || month == 0 || month > 12)
            return false;

        var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

        // Adjust for leap years
        if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
            monthLength[1] = 29;

        // Check the range of the day
        return day > 0 && day <= monthLength[month - 1];
    },

    isNumeric: function () {
        return !isNaN(parseFloat(this)) && isFinite(this);
    },
    dateToLong: function (format) {
        var formats = 'd/m/Y';
        format = format || 'dd/MM/yyyy';

        if (format == 'dd/MM/yyyy') formats = 'd/m/Y';
        if (format == 'dd/MM/yyyy HH:mm:ss') formats = 'd/m/Y H:i:s';
        if (format == 'MM/dd/yyyy') formats = 'm/d/Y';
        if (format == 'MM/dd/yyyy HH:mm:ss') formats = 'm/d/Y H:i:s';

        var __format = formats;
        if (__format.length >= 5) {
            __format = __format.substring(0, 5);
        }
        var date = null;
        if (iNet.isEmpty(this)) {
            return null;
        }
        try {
            var split = '/';
            var day = this.substring(0, 2);
            var month = this.substring(3, 5);
            var year = this.substring(6, 10);
            switch (__format) {
                case 'm/d/Y':
                    month = this.substring(0, 2);
                    day = this.substring(3, 5);
                    break;
            }
            var temp = month + split + day + split + year;
            date = new Date(Date.parse(temp)).getTime();
        }
        catch (e) {
            return null;
        }
        return (!isNaN(parseFloat(date)) && isFinite(date)) ? date : null;
    },
    endDateToLong: function(format){
        var l = this.dateToLong(format);
        return (l == null) ? null : l + 86399000; //86399000 ~ 23:59:59
    },
    longToDate: function (format) {
        var formats = 'd/m/Y';
        format = format || 'dd/MM/yyyy';

        if (format == 'dd/MM/yyyy') formats = 'd/m/Y';
        if (format == 'dd/MM/yyyy HH:mm:ss') formats = 'd/m/Y H:i:s';
        if (format == 'MM/dd/yyyy') formats = 'm/d/Y';
        if (format == 'MM/dd/yyyy HH:mm:ss') formats = 'm/d/Y H:i:s';

        var date = '';
        if (!(!isNaN(parseFloat(this)) && isFinite(this))) {
            return '';
        }
        try {
            date = new Date(parseFloat(this)).format(formats);
        }
        catch (e) {
        }
        return date;
    },

    formatMoney: function (noOfDigitsAfterDecimal, decimalSymbol, digitGroupingSymbol) {
        try {
            var n = this,
                c = isNaN(noOfDigitsAfterDecimal = Math.abs(noOfDigitsAfterDecimal)) ? 2 : noOfDigitsAfterDecimal,
                d = decimalSymbol == undefined ? "." : decimalSymbol,
                t = digitGroupingSymbol == undefined ? "," : digitGroupingSymbol,
                s = n < 0 ? "-" : "",
                i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
                j = (j = i.length) > 3 ? j % 3 : 0;
            return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
        }
        catch (e) {
            return this;
        }

    }
});

/*----------------------------------------------
 |               N U M B E R                   |
 ==============================================*/
iNet.applyIf(Number.prototype, {
    formatMoney: function (noOfDigitsAfterDecimal, decimalSymbol, digitGroupingSymbol) {
        try {
            var n = this,
                c = isNaN(noOfDigitsAfterDecimal = Math.abs(noOfDigitsAfterDecimal)) ? 2 : noOfDigitsAfterDecimal,
                d = decimalSymbol == undefined ? "." : decimalSymbol,
                t = digitGroupingSymbol == undefined ? "," : digitGroupingSymbol,
                s = n < 0 ? "-" : "",
                i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
                j = (j = i.length) > 3 ? j % 3 : 0;
            return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
        }
        catch (e) {
            return this;
        }

    },

    longToDate: function (format) {
        var formats = 'd/m/Y';
        format = format || 'dd/MM/yyyy';

        if (format == 'dd/MM/yyyy') formats = 'd/m/Y';
        if (format == 'dd/MM/yyyy HH:mm:ss') formats = 'd/m/Y H:i:s';
        if (format == 'MM/dd/yyyy') formats = 'm/d/Y';
        if (format == 'MM/dd/yyyy HH:mm:ss') formats = 'm/d/Y H:i:s';

        var date = '';
        if (!(!isNaN(parseFloat(this)) && isFinite(this))) {
            return '';
        }
        try {
            date = new Date(parseFloat(this)).format(formats);
        }
        catch (e) {
        }
        return date;
    }
});
