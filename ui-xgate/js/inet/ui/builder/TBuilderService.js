// #PACKAGE: idesign-ui-t-builder-service
// #MODULE: TBuilderService
$(function () {
    ConvertService = {
        dateToLong: function(value, format){
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
            if (iNet.isEmpty(value)) {
                return null;
            }
            try {
                var split = '/';
                var day = value.substring(0, 2);
                var month = value.substring(3, 5);
                var year = value.substring(6, 10);
                switch (__format) {
                    case 'm/d/Y':
                        month = value.substring(0, 2);
                        day = value.substring(3, 5);
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
        longToDate: function(value, format){
            var formats = 'd/m/Y';
            format = format || 'dd/MM/yyyy';

            if (format == 'dd/MM/yyyy') formats = 'd/m/Y';
            if (format == 'dd/MM/yyyy HH:mm:ss') formats = 'd/m/Y H:i:s';
            if (format == 'MM/dd/yyyy') formats = 'm/d/Y';
            if (format == 'MM/dd/yyyy HH:mm:ss') formats = 'm/d/Y H:i:s';

            var date = '';
            if (!(!isNaN(parseFloat(value)) && isFinite(value))) {
                return '';
            }
            try {
                date = new Date(parseFloat(value)).format(formats);
            }
            catch (e) {
            }
            return date;
        }
    };

    PropertyService = {
        InputHtml: function(){
            var __html = '';
            __html+='<div class="attr attr-element">';
            __html+='<span class="name">{2}</span>';
            __html+='<span class="value"><input target-id="{0}" data-control="{1}" property-id="{2}" value="{3}" type="text" placeholder="{4}" /></span>';
            __html+='</div>';
            return __html;
        },
        ButtonHtml: function(){
            var __html = '';
            __html+='<div class="attr attr-element">';
            __html+='<span class="name">{2}</span>';
            __html+='<span class="value"><button data-action="Config" target-id="{0}" data-control="{1}" property-id="{2}"  placeholder="{4}">{3}</button></span>';
            __html+='</div>';
            return __html;
        },
        SelectHtml: function(){
            var __html = '';
            __html+='<div class="attr attr-element">';
            __html+='<span class="name">{2}</span>';
            __html+='<span class="value"><select data-action="Select" target-id="{0}" data-control="{1}" property-id="{2}" value="{3}"></select></span>';
            __html+='</div>';
            return __html;
        },
        GridSourceHtml: function(){
            var __html = '';
            __html+='<div class="attr attr-element">';
            __html+='<span class="name">{2}</span>';
            __html+='<span class="value"><button data-action="Config" target-id="{0}" source-id="{1}" property-id="{2}" style="width:84%;">{3}</button><button class="btn-circle" target-id="{0}" data-action="Minus" style="width:16%;"><i class="icon-minus"></i>></button></span>';
            __html+='</div>';
            return __html;
        },
        GridColumnHtml: function(){
            var __html = '';
            __html+='<div class="attr attr-element">';
            __html+='<span class="name">{2}</span>';
            __html+='<span class="value"><input target-id="{0}" column-id="{1}" property-id="{2}" value="{3}" placeholder="{4}" data-type="{5}" {6} type="text" /></span>';
            __html+='</div>';
            return __html;
        },
        GridColumnConfigHtml: function(){
            var __html = '';
            __html+='<properties rel="{0}" ref="column" property-value="{0}"/>';
            __html+='<column target-id="{0}">';
            __html+='<properties rel="property" disable="disabled" property-value="{0}"/>';
            __html+='<properties rel="label" property-value="{0}"/>';
            __html+='<properties rel="sortable" type="boolean" placeholder="true,false" property-value="true"/>';
            __html+='<properties rel="disabled" type="boolean" placeholder="true,false" property-value="false"/>';
            __html+='<properties rel="type" placeholder="text,selectx,datetime,checkbox" property-value="text"/>';
            __html+='<properties rel="align" placeholder="left,center,right" property-value="left"/>';
            __html+='<properties rel="width" type="int" property-value="80"/>';
            __html+='<properties rel="require" type="boolean" placeholder="true,false" property-value="false"/>';
            __html+='<properties rel="service" placeholder="url service" property-value=""/>';
            __html+='<properties rel="sourcevalue" placeholder="source value" property-value=""/>';
            __html+='<properties rel="displayvalue" placeholder="display value" property-value=""/>';
            __html+='<properties rel="keyvalue" placeholder="key value" property-value=""/>';
            __html+='<properties rel="formula" placeholder="sum,avg,v.v..." property-value=""/>';
            __html+='</column>';
            return __html;
        },
        RenderPropertyTarget: function($control, $container){
            var __attHtml = '';
            $control.find('target').each(function(){
                var $target = $(this);
                $target.find('properties').each(function(){
                    var __targetId = $target.attr('target-id') || '';
                    var __controlId = $control.find('[target-id="'+__targetId+'"]').attr('data-control') || '';

                    var $properties = $(this);
                    var __ref = $properties.attr('ref') || '';
                    var __key = $properties.attr('rel') || '';
                    var __value = $properties.attr("property-value") || '';
                    var __propertyType = $properties.attr('property-type') || '';
                    var __placeholder = $properties.attr("placeholder") || '';

                    console.log(">> target properties >>", __targetId, __controlId, __key, __value);

                    if (!iNet.isEmpty(__targetId) && !iNet.isEmpty(__controlId) && !iNet.isEmpty(__key)) {
                        var __html = '';
                        if (iNet.isEmpty(__propertyType)) { //type property
                            __html = PropertyService.InputHtml();
                        } else {
                            if (__propertyType == "button"){
                                __value = __value || 'Config';
                                __html = PropertyService.ButtonHtml();
                            } else {
                                __html = PropertyService.SelectHtml();
                            }
                        }
                        __attHtml += String.format(__html, __targetId, __controlId, __key, __value, __placeholder);
                    }
                });

            });
            $container.html(__attHtml);

            var __fnEvent = function(){
                $container.find('input').on('change', function(e){
                    var __targetId = $(this).attr('target-id');
                    var __propertyId = $(this).attr('property-id');
                    var __controlId = $(this).attr('data-control');
                    var __value = $(this).val();
                    console.log(">> $container change >>", __targetId, __controlId, __propertyId, __value);
                    switch (__propertyId){
                        case "maskoption" :
                        case "sourcevalue" :
                            __value= __value.replace(/"/gi,"'");
                            break;
                        case "css" :
                            $control.find('[target-id="'+__targetId+'"][data-control="'+ __controlId +'"]').removeClass().addClass(__value);
                            break;
                        case "style":
                            $control.find('[target-id="'+__targetId+'"][data-control="'+ __controlId +'"]').attr('style', __value);
                            break;
                        case "title":
                            $control.find('[target-id="'+__targetId+'"][data-control="'+ __controlId +'"]').attr('title', __value);
                            break;
                        case "rows":
                            $control.find('[target-id="'+__targetId+'"][data-control="'+ __controlId +'"]').attr('rows', __value || 3);
                            break;
                        case "text" :
                            if (__value.split('.').length > 1) {
                                $control.find('[target-id="'+__targetId+'"][data-control="'+ __controlId +'"]').text('$text.getText("'+__value+'")');
                            } else {
                                $control.find('[target-id="'+__targetId+'"][data-control="'+ __controlId +'"]').text(__value);
                            }
                            break;
                        case "name" :
                            if (__value.substring(0,1).isNumeric()){
                                __value = "n" + __value;
                            }
                            __value = CommonService.cleanSpecialChar(__value);
                            __value = CommonService.cleanUnicode(__value);
                            if (iNet.isEmpty(__value)){
                                __value = RenderService.generateName();
                            }
                            $(this).val(__value);
                            $control.find('[name]').each(function(i, ctrl){
                                var __namePrefix = $(ctrl).attr("name-prefix") || "";
                                $(ctrl).attr(__propertyId, __value + __namePrefix);
                            });
                            break;
                        case "scanner" :
                            if ($(this).val() == "true"){
                                $control.find('[data-scanner]').parent().removeClass('hide');
                            } else {
                                $control.find('[data-scanner]').parent().addClass('hide');
                            }

                            var __hardcopy = !$control.find('[data-hardcopy]').parent().parent().hasClass('hide');
                            var __scanner = ($(this).val() == "true");

                            $control.find('.ace-file-input').removeClass('span8 span9 span11 span12').addClass('span' + (12 - ((__hardcopy) ? 3 : 0)  - ((__scanner) ? 1 : 0)));

                            break;
                        case "hardcopy" :
                            if ($(this).val() == "true"){
                                $control.find('[data-hardcopy]').parent().parent().removeClass('hide');
                            } else {
                                $control.find('[data-hardcopy]').parent().parent().addClass('hide');
                            }

                            var __hardcopy = !$control.find('[data-hardcopy]').parent().parent().hasClass('hide');
                            var __scanner = ($(this).val() == "true");

                            $control.find('.ace-file-input').removeClass('span8 span9 span11 span12').addClass('span' + (12 - ((__hardcopy) ? 3 : 0)  - ((__scanner) ? 1 : 0)));

                            break;
                        case "hardnote" :
                            $control.find('[data-hardnote]').text(' ' + $(this).val());
                            break;
                        case "placeholder" :
                            $control.find('[target-id="'+__targetId+'"][data-control="'+ __controlId +'"]').attr(__propertyId, __value);
                            break;
                    }
                    $control.find('[target-id="'+__targetId+'"] [rel="'+ __propertyId +'"]').attr("property-value", __value);
                });
                $container.find('[data-action="Config"]').on('click', function(e){
                    var __targetId = $(this).attr('target-id');
                    var __propertyId = $(this).attr('property-id');
                    var __controlId = $(this).attr('data-control');

                    console.log(">> $container click >>", __targetId, __controlId, __propertyId, $(this).val());
                    switch (__controlId){
                        case "Grid":
                        case "SimpleGrid":
                            PropertyService.RenderPropertyGridSource($control, $container, __targetId);
                    }
                });
                $container.find('[data-action="Select"]').on('change', function(e){
                    var __targetId = $(this).attr('target-id');
                    var __propertyId = $(this).attr('property-id');
                    var __controlId = $(this).attr('data-control');
                    var __valueId = $(this).val();
                    console.log(">> $container Select >>", __targetId, __controlId, __propertyId, $(this).val());

                    $control.find('[target-id="'+__targetId+'"] [rel="'+ __propertyId +'"]').attr("property-value", $(this).val());
                    switch (__propertyId){
                        case "application":
//                            $control.find('[target-id="'+__targetId+'"] [rel="widget"]').attr("property-value", "");
//                            $container.find('[target-id="'+__targetId+'"][property-id="widget"]').html('');
//                            $.postJSON(iNet.getUrl('application/widget/list'), {module: __valueId, pageSize: 10000}, function (result) {
//                                if (!iNet.isEmpty((result || {}).items)){
//                                    $.each((result || {}).items || [], function(i, item){
//                                        $container.find('[target-id="'+__targetId+'"][property-id="widget"]').append('<option value="'+item.uuid+'">'+item.name+'</option>');
//                                    });
//                                    $container.find('[target-id="'+__targetId+'"][property-id="widget"]').attr('value', '');
//                                    $container.find('[target-id="'+__targetId+'"][property-id="widget"]').val('')
//                                }
//
//                            });

                          /*
                           * Author: hanhld@inetcloud.vn
                           */
                          var $el = $container.find('[target-id="'+__targetId+'"][property-id="widget"]');
                          $el.find('[rel="widget"]').attr("property-value", "");
                          $.postJSON(iNet.getUrl('application/widget/list'), {module: __valueId, pageSize: 10000}, function (result) {
                            if (!iNet.isEmpty((result || {}).items)){
                              var html = '';
                              $.each((result || {}).items || [], function(i, item){
                                html += '<option value="'+ item.uuid +'">'+ item.name +'</option>';
                              });
                              $el.html(html);
                              $el.attr('value', '').val('');
                            }
                          });
                            break;
                    }
                });
            };

            var __argSelect = $container.find('[data-action="Select"]');
            if (__argSelect.length == 0) {
                __fnEvent();
            } else {
                $.each(__argSelect || [], function(i, e) {
                    var __targetId = $(this).attr('target-id');
                    var __propertyId = $(this).attr('property-id');
                    var __controlId = $(this).attr('data-control');

                    switch (__propertyId){
                        case "application":

                            $.postJSON(iNet.getUrl('system/application/list'), {}, function (result) {
                                if (!iNet.isEmpty((result || {}).elements)){
//                                    $.each((result || {}).elements || [], function(i, item){
//                                        $container.find('[target-id="'+__targetId+'"][property-id="application"]').append('<option value="'+item.module+'">'+item.name+'</option>');
//                                    });
//                                    $container.find('[target-id="'+__targetId+'"][property-id="application"]').val($container.find('[target-id="'+__targetId+'"][property-id="application"]').attr('value'));
                                  /*
                                   * Author: hanhld@inetcloud.vn
                                   */
                                  // Cached element to prevent query many time with same element
                                  var $el = $container.find('[target-id="'+__targetId+'"][property-id="application"]'),
                                      html = '';
                                  $.each((result || {}).elements || [], function(i, item){
                                    html += '<option value="'+item.module+'">'+item.name+'</option>';
                                  });
                                  $el.html(html);
                                  $el.val($el.attr('value'));
                                }
                            });
                            break;
                        case "widget":
                            var __module = $container.find('[target-id="'+__targetId+'"][property-id="application"]').attr('value') || "";
                            if (!iNet.isEmpty(__module)){
                                $.postJSON(iNet.getUrl('application/widget/list'), {module: __module, pageSize: 10000}, function (result) {
//                                    if (!iNet.isEmpty((result || {}).items)){
//                                        $.each((result || {}).items || [], function(i, item){
//                                            $container.find('[target-id="'+__targetId+'"][property-id="widget"]').append('<option value="'+item.uuid+'">'+item.name+'</option>');
//                                        });
//                                    }
//                                    $container.find('[target-id="'+__targetId+'"][property-id="widget"]').val($container.find('[target-id="'+__targetId+'"][property-id="widget"]').attr('value'));
                                  /*
                                   * Author: hanhld@inetcloud.vn
                                   */
                                  // Cached element to prevent query many time with same element
                                  var $el = $container.find('[target-id="'+__targetId+'"][property-id="widget"]');
                                  if (!iNet.isEmpty((result || {}).items)){
                                    // Create string html for all option
                                    var html = '';
                                    $.each((result || {}).items || [], function(i, item){
                                      html += '<option value="'+ item.uuid +'">'+ item.name +'</option>';
                                    });
                                    $el.html(html);
                                  }
                                  $el.val($el.attr('value'));
                                });
                            }
                            break;
                    }

                    if (i == __argSelect.length -1){
                        __fnEvent();
                    }
                });
            }
        },
        RenderPropertyGridSource: function($control, $container, __targetId){
            var $properties = $control.find('[data-properties]');
            var $datasource = $control.find('datasource[target-id="'+__targetId+'"]');

            var __attHtml = '';
            __attHtml+='<div class="attr attr-element">';
            __attHtml+='<span class="name"><button class="btn-circle" data-action="Back"><i class="icon-arrow-left"></i></button></span>';
            __attHtml+='<span class="value">';
            __attHtml+='<input data-action="Type" placeholder="Column name" type="text" style="width:84%;" />';
            __attHtml+='<button data-action="Add" class="btn-circle" style="width:16%;"><i class="icon-plus"></i></button>';
            __attHtml+='</span>';
            __attHtml+='</div>';

            $datasource.each(function(){
                $(this).find('[ref="column"]').each(function(){
                    var __column = $(this).attr('rel') || '';
                    __attHtml+=String.format(PropertyService.GridSourceHtml(), __column, __targetId, 'column', __column, __column);
                });
            });

            $container.html(__attHtml);

            $container.find('[data-action="Type"]').on('change', function(){
                $container.find('[data-action="Add"]').attr('column', $(this).val());
            });
            $container.find('[data-action="Back"]').on('click', function(){
                PropertyService.RenderPropertyTarget($control, $container);
            });
            $container.find('[data-action="Add"]').on('click', function(){
                $container.find('[data-action="Type"]').val('');
                var __column = $(this).attr('column') || '';
                if (!iNet.isEmpty(__column)){
                    $(this).attr('column', '');

                    var __dataSource = '';
                    if ($datasource.length == 0){
                        __dataSource+='<datasource target-id="'+__targetId+'">';
                    }

                    __dataSource+=String.format(PropertyService.GridColumnConfigHtml(), __column);

                    if ($datasource.length == 0){
                        __dataSource+='</datasource>';
                        $properties.append(__dataSource);
                        $datasource = $control.find('datasource[target-id="'+__targetId+'"]');
                    } else {
                        $datasource.append(__dataSource);
                    }


                    var __htmlColumnProperty = String.format(PropertyService.GridSourceHtml(), __column, __targetId, 'column', __column, __column);
                    $container.append(__htmlColumnProperty)
                    $container.find('[data-action="Minus"][target-id="'+__column+'"]').on('click', function(){
                        $datasource.find('[rel="'+__column+'"]').remove();
                        $datasource.find('column[target-id="'+__column+'"]').remove();
                        if ($datasource.children().length == 0 ) {
                            $datasource.remove();
                            $datasource = $control.find('datasource[target-id="'+__targetId+'"]');
                        }
                        $(this).parent().parent().remove();
                    });
                    $container.find('[data-action="Config"][target-id="'+__column+'"]').on('click', function(){
                        PropertyService.RenderPropertyGridColumn($control, $container, __targetId, __column);
                    });
                }
            });
            $container.find('[data-action="Minus"]').on('click', function(e){
                var __column = $(e.currentTarget).attr('target-id') || '';
                if (!iNet.isEmpty(__column)){
                    $datasource.find('[rel="'+__column+'"]').remove();
                    $datasource.find('column[target-id="'+__column+'"]').remove();
                    if ($datasource.children().length == 0 ) {
                        $datasource.remove();
                        $datasource = $control.find('datasource[target-id="'+__targetId+'"]');
                    }
                    $(this).parent().parent().remove();
                }
            });
            $container.find('[data-action="Config"]').on('click', function(e){
                var __column = $(e.currentTarget).attr('target-id') || '';
                if (!iNet.isEmpty(__column)){
                    PropertyService.RenderPropertyGridColumn($control, $container, __targetId, __column);
                }
            });
        },
        RenderPropertyGridColumn: function($control, $container, __targetId, __columnId){
            var $properties = $control.find('[data-properties]');
            var $datasource = $control.find('datasource[target-id="'+__targetId+'"]');

            var __attHtml = ''
            __attHtml+='<div class="attr attr-element">';
            __attHtml+='<span class="name"><button class="btn-circle" data-action="Back"><i class="icon-arrow-left"></i></button></span>';
            __attHtml+='<span class="value"><button>'+__columnId+'</button></span>';
            __attHtml+='</div>';

            $datasource.find('column[target-id="'+__columnId+'"]').children().each(function(){
                var $attr = $(this);
                var __key = $attr.attr('rel') || '';
                var __value = $attr.attr("property-value") || '';
                var __disable = $attr.attr('disable') || '';
                var __type = $attr.attr('type') || 'text';
                var __placeholder = $attr.attr('placeholder') || '';

                __attHtml += String.format(PropertyService.GridColumnHtml(), __targetId, __columnId, __key, __value, __placeholder, __type, __disable);
            });
            $container.html(__attHtml);

            $container.find('input').on('change', function(e){
                var __targetId = $(this).attr('target-id') || '';
                var __columnId = $(this).attr('column-id') || '';
                var __propertyId = $(this).attr('property-id') || '';

                if (!iNet.isEmpty(__targetId) && !iNet.isEmpty(__columnId) && !iNet.isEmpty(__propertyId)){
                    $datasource.find('column[target-id="'+__columnId+'"] [rel="'+__propertyId+'"]').attr("property-value", $(this).val());
                }
            });

            $container.find('[data-action="Back"]').on('click', function(){
                PropertyService.RenderPropertyGridSource($control, $container, __targetId);
            });
        }
    };

    ControlService = {
        RenderSelect: function (id, datasource, idValue, formatView, allowClear, multiple, ajax, query) {
            var __datasource = datasource || [];
            var __idValue = idValue || "id";
            var __formatView = formatView || 1; //View= 1: name; 2: code name
            var __allowClear = iNet.isEmpty(allowClear) ? true : allowClear;
            var __multiple = iNet.isEmpty(multiple) ? false : multiple;
            var __ajax = iNet.isEmpty(ajax) ? {} : ajax;
            var __query = iNet.isFunction(query) ? query : "";

            var __config = {};
            __config.id = id;
            __config.placeholder = "Select value";
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
        RenderDate: function (id) {
            var date = $('#' + id).datepicker({
                format: 'dd/mm/yyyy'
            }).on('changeDate', function (ev) {
                date.hide();
            }).data('datepicker');

            $('#' + id).next().on('click', function () {
                $(this).prev().focus();
            });

            $('#' + id).on('keydown', function (ev) {
                if (ev.which == 13 || ev.which == 9) date.hide();
            });

            return date;
        },
        RenderGrid: function (id, datasource) {
            return new iNet.ui.grid.Grid({
                id: id,
                url: '',
                dataSource: datasource,
                stretchHeight: false,
                pageSize: 5000,
                editable: true,
                firstLoad: false,
                hideHeader: true,
                hideSearch: true,
                rowClass: function(record) {
                    if(record.rowTotal == true){
                        return "rowTotal";
                    }
                },
                idProperty: 'autoId'
            });
        },
        RenderScanner: function (id) {
            $('[data-id="jsScanner"]').remove();
            var __html = '';
            __html +='<div data-id="jsScanner" style="height: 1px; width: 1px;">';
            __html +='<script type="text/javascript" src="https://www.inetcloud.vn/public/tool/jsScanner.js"></script>';
            __html +='<embed id="deployJavaPlugin" type="application/java-deployment-toolkit" hidden="true">';
            __html +='<applet id="com_asprise_scan_applet" codebase="https://www.inetcloud.vn/public/tool/" archive="com-asprise-scan-applet.jar" code="com.asprise.imaging.scan.ui.web.ScanApplet" width="1" height="1" style="z-index: -999;"><param name="permissions" value="all-permissions"><param name="java_version" value="1.6+"><param name="java_arguments" value="-Xmx512m"><param name="separate_jvm" value="true"><param name="codebase_lookup" value="false"></applet>';
            __html +='</div>';
            $('#'+id).parent().append(__html);
        },
        RemoveScanner: function (id) {
            $('[data-id="jsScanner"]').remove();
        }
    };

    BuilderService = {
        PublicControl: function(name, control){
            if (iNet.isEmpty(window.iNet)){
                window.iNet = {};
            }
            if (iNet.isEmpty(window.iNet.controls)){
                window.iNet.controls = {};
            }
            if (!iNet.isEmpty(name)){
                console.log(">> PublicControl >>", name);
                window.iNet.controls[name] = control;
            }
        },
        CreateText: function ($controlContent, controlId, controlName, contentData, readonly) {
            var text = $('#' + controlId);

            var $name = $controlContent.find('[name="'+controlName+'"]');
            var __contentData = contentData || {};
            var __keyData = controlName || "";
            var __valueData = __contentData[__keyData] || '';

            //text.val(__valueData);
            BuilderService.PublicControl(controlName, $('#' + controlId));
        },
        CreateSelect: function ($controlContent, controlId, controlName, contentData, readonly) {
            var $properties = $controlContent.find('[data-properties]');
            var __targetId = $('#' + controlId).attr('target-id') || '';

            var $name = $controlContent.find('[name="'+controlName+'"]');
            var __contentData = contentData || {};
            var __keyData = controlName || "";
            var __valueData = __contentData[__keyData] || '';

            var __dataSource = [];
            var select = null;
            if (!iNet.isEmpty(__targetId)) {
                var __service = $properties.find('[target-id="'+__targetId+'"] [rel="service"]').attr("property-value") || '';
                if (!iNet.isEmpty(__service)) {
                    $.postJSON(iNet.getUrl(__service), {}, function(result){
                        for (var key in result) {
                            if (iNet.isArray(result[key])){

                                $.each(result[key] || [], function(i, obj){
                                    var __item = {id: obj.id || '', code: obj.code || '', name: obj.name || '', obj: obj};
                                    __dataSource.push(__item);
                                });

                                select = ControlService.RenderSelect(controlId, __dataSource, '', 2, true, false);
                                //select.setValue(__valueData);
                                BuilderService.PublicControl(controlName, select);
                                return select;
                            }
                        }
                    });/*, {
                     msg: iNet.resources.ajaxLoading.updating,
                     mask: self.getMask()
                     });*/
                } else {
                    select = ControlService.RenderSelect(controlId, __dataSource, '', 2, true, false);
                    BuilderService.PublicControl(controlName, select);
                    return select;
                }
            } else {
                select = ControlService.RenderSelect(controlId, __dataSource, '', 2, true, false);
                BuilderService.PublicControl(controlName, select);
                return select;
            }
        },
        CreateDate: function ($controlContent, controlId, controlName, contentData, readonly) {
            var date = $('#' + controlId);

            var $name = $controlContent.find('[name="'+controlName+'"]');
            var __contentData = contentData || {};
            var __keyData = controlName || "";
            var __valueData = __contentData[__keyData] || '';

            //date.val(__valueData);

            ControlService.RenderDate(controlId);
            BuilderService.PublicControl(controlName, $('#' + controlId));
        },
        CreateGrid: function ($controlContent, controlId, controlName, contentData, readonly) {
            var $properties = $controlContent.find('[data-properties]');
            var __targetId = $('#' + controlId).attr('target-id') || '';

            var __isShowTotal = ($properties.find('[rel="showtotal"]').attr("property-value") || "false") == "true";
            var $name = $controlContent.find('[name="'+controlName+'"]');
            var __contentData = contentData || {};
            var __keyData = controlName || "";
            var __valueData = __contentData[__keyData] || [];

            var getConfigSelect = function(url){
                var __dataConfig = [];
                var __service = url || '';
                $.postJSON(iNet.getUrl(__service), {}, function(result) {
                    for (var key in result) {
                        if (iNet.isArray(result[key])) {
                            $.each(result[key] || [], function (i, obj) {
                                var __item = {id: obj.id || '', code: obj.code || '', name: obj.name || '', obj: obj};
                                __dataConfig.push(__item);
                            });
                        }
                    }
                });

                var __configSelect = {
                    placeholder: 'Select one value',
                    multiple: false,
                    allowClear: true,
                    data: __dataConfig,
                    minimumInputLength : 0,
                    initSelection: function (element, callback) {
                        var id = $(element).val();
                        console.log(">> initSelection id >>", __dataConfig.length);
                        if (id == "") return;
                        if (__dataConfig.length > 0) {
                            $.each(__dataConfig, function(i, obj){
                                if (obj.id == id){
                                    if (iNet.isEmpty(obj.name)){
                                        obj.name = "empty";
                                    }
                                    callback(obj);
                                    return;
                                }
                            });
                        }
                    },
                    formatResult: function(item){
                        return item.name;
                    },
                    formatSelection: function(item){
                        return item.name;
                    },
                    query: function (query) {
                        var data = {results: []};

                        $.each(__dataConfig, function(){
                            if(query.term.length == 0 || this.code.toUpperCase().indexOf(query.term.toUpperCase()) >= 0 || this.name.toUpperCase().indexOf(query.term.toUpperCase()) >= 0 ){
                                data.results.push(this);
                            }
                        });

                        query.callback(data);
                    },
                    /*ajax: {
                     placeholder: 'Select one value',
                     url: iNet.getUrl(url),
                     dataType: 'json',
                     quietMillis: 100,
                     data: function (search, page ) {
                     return {
                     pageNumber: page - 1 || 0,
                     pageSize: 10,
                     totalrecord : 0,
                     search : search
                     };
                     },
                     results: function (data, page) {
                     var more = (page * 10) < data.totalRecords;
                     var __data = data || {};
                     var results = __data.list || [];
                     $.each(results, function(i, obj){
                     __dataConfig.push(obj);
                     });
                     return {
                     results: results,
                     more: more
                     };
                     }
                     },*/
                    escapeMarkup: function (m) { return m; }
                };

                return __configSelect;
            };

            var __columns = [];
            var $dataSource = $properties.find('datasource[target-id="'+__targetId+'"]:first');
            $dataSource.find('[ref="column"]').each(function(){
                var $column = $(this);
                var __ref = $column.attr('ref') || '';
                var __rel = $column.attr('rel') || ''; //Column name

                var __column = {};
                $dataSource.find('column[target-id="'+__rel+'"]:first').children().each(function(){
                    var $attr = $(this);
                    var __key = $attr.attr('rel') || '';
                    var __value = $attr.attr("property-value") || '';
                    var __type = $attr.attr('type') || 'text';

                    //console.log(">> column property >>", __rel, __key, __value);

                    if (__key == "service") {
                        __column[__key] = __value;
                        if (!iNet.isEmpty(__value)){
                            __column.config = getConfigSelect(__value);
                        }
                    }
                    else if (__key == "require") {
                        __column[__key] = __value;
                        if (__value == "true") {
                            __column.validate = function (v) {
                                if ($.trim(v) == '')
                                    return String.format('{} required!', '');
                            }
                        }
                    } else {
                        if (__type == "boolean") {
                            __column[__key] = (__value == "true") ? true : false;
                        } else {
                            __column[__key] = __value;
                        }
                    }
                });
                console.log(">> column >>", __rel, __column);
                __columns.push(__column);
            });
            var __columnButton = {
                label: '',
                type: 'action',
                width: 32,
                align: 'center',
                buttons: [{
                    text: "Delete",
                    icon: 'icon-trash',
                    labelCls: 'label label-important',
                    fn: function (record) {
                        grid.remove(record.autoId);
                    },
                    visibled: function(record){
                        return !record.rowTotal;
                    }
                }]
            };
            __columns.push(__columnButton);

            var __dataSource = new DataSource({
                columns: __columns,
                delay: 250
            });

            var grid = ControlService.RenderGrid(controlId, __dataSource);
            var __store = __valueData;
            $name.val(iNet.JSON.encode(__valueData));
            grid.loadData(__valueData);
            grid.setEditable(!readonly);
            BuilderService.PublicControl(controlName, grid);
            $controlContent.find('[data-action="add"]').on('click', function(){
                grid.newRecord({});
            });

            var rowTotal = {
                create: function(){
                    if (!__isShowTotal) { return; }

                    var __rowFormula = {};
                    var __rowNoFormula = {};
                    $properties.find('[rel="formula"]').each(function(){
                        var $attr = $(this);
                        var __formula = $attr.attr('property-value') || "";
                        var __column = $attr.parent().attr('target-id') || "";
                        if (!iNet.isEmpty(__formula) && !iNet.isEmpty(__column)) {
                            __rowFormula[__column] = __formula;
                        } else {
                            if (!iNet.isEmpty(__column)){
                                __rowNoFormula[__column] = '';
                            }
                        }
                    });

                    var __rowTotal = {autoId: 'rowTotal', rowTotal: true};
                    for (var key in __rowFormula){
                        $.each(__store || [], function(i, row){
                            __rowTotal[key] = (__rowTotal[key] || 0) + (iNet.isNumber(Number(row[key])) ? (Number(row[key]) || 0) : 0);
                        });
                    }
                    for (var key in __rowNoFormula){
                        __rowTotal[key] = '';
                    }
                    grid.insert(__rowTotal);
                    grid.fireEvent('calc', __rowTotal);
                }.createDelegate(this),
                remove: function(){
                    grid.remove('rowTotal');
                }
            };

            grid.on('save', function (data) {
                //rowTotal.remove();
                var __data = data || {};
                __data.autoId = iNet.generateId();
                grid.insert(__data);
                __store.push(__data);
                $name.val(iNet.JSON.encode(__store));

                grid.newRecord({});
                //rowTotal.create();
            });

            grid.on('calc', function(data){
                grid._switchView(data);
                console.log(">>> ", grid.getById('rowTotal'));
                grid.cancel('rowTotal');
            });

            grid.on('update', function (newData, oldData) {
                //rowTotal.remove();
                var __data = iNet.apply(oldData, newData) || {};
                grid.update(__data);
                grid.commit();

                $.each(__store || [], function (i, store) {
                    if (store.autoId == __data.autoId){
                        store = iNet.apply(store, __data);
                    }
                });
                $name.val(iNet.JSON.encode(__store));
                //rowTotal.create();
            });

            grid.on('blur', function (action, control) {
                var $row = null;
                if (action == 'update') {
                    grid.endEdit();
                } else {
                    $row = grid.getNewRow();
                    control.save();
                }

                if (!grid.isValid($row)) {
                }
            });

            grid.on('click', function(data, editable) {
            });

            grid.on('change', function(oldata, newdata, colIndex, rowIndex) {
            });

            grid.on('selectionchange', function (sm, data) {
            });

            grid.on('controlclick', function(record, colIndex, rowIndex) {
            });
        },
        CreateFile: function ($controlContent, controlId, controlName, contentData, readonly) {
            $('#' + controlId).on('change', function(){
                if (this.files.length < 1) {
                    this.files = [];
                    return;
                }
                var __nameFile = this.files[0].name;
                $controlContent.find('span[data-title]').attr('data-title', __nameFile);
            });

            $controlContent.find('[data-container]').on('click', function(){
                $('#' + controlId).trigger('click');
            });
        },
        CreateSimpleGrid: function ($controlContent, controlId, controlName, contentData, readonly) {
            /*var __htmlSource = '';
            __htmlSource += '<script type="text/javascript">';
            __htmlSource += '</script>';

            var __Velocity = '';
            #gridUI({
                "type":"simple-grid-form",
                "namespace":"GridVelocity",
                "id":"simple-grid-content-id",
                "url":"",
                "firstLoad": false,
                "hideHeader": true,
                "hideSearch": true,
                "rowId":"autoId"
            })
                [
                {"name": "Product", "title": "Product", "type" : "select2", "width" : "250", "fnEdit": "fnGetProduct", "optValue": "id", "optDisplay": "name"},
                {"name": "Qty", "title": "Qty", "sortable": true},
                {"name": "Price", "title": "Price", "sortable": true},
                {"name": "Amount", "title": "Amount", "sortable": true, "disabled": true},
                {"align": "center", "buttons":
                    [
                        {"fnAction": "gridedit", "icon": "icon-pencil", "title": "Edit"},
                        {"fnAction": "griddelete", "icon": "icon-trash", "css": "label label-important", "title": "delete"}
                    ]
                }
                ]
            #end*/
        }
    };

    PublicService = {
        Widget: function ($controlContent, controlName) {
            var $properties = $controlContent.find('[data-properties]');
            var controlId = $controlContent.find('[data-control="Widget"]').prop('id') || '';
            var __targetId = $('#' + controlId).attr('target-id') || '';
            var __widget = $properties.find('[rel="widget"]:first').attr('property-value') || '';

            $('#' + controlId).find('[widget]').attr('widget', __widget);
            $('#' + controlId).find('[widget]').attr('name', "widget");
            var __htmlScript = '';
            __htmlScript += '<script type="text/javascript">';
            __htmlScript += '$(function() {\n';
            __htmlScript += 'iNet.controls["'+controlName+'"] = $("#'+controlId+'");\n';
            __htmlScript += 'iNet.controls["'+controlName+'"].validate = "'+controlName+'";\n';
            __htmlScript += 'iNet.controls["'+controlName+'"].type="Widget";\n';
            __htmlScript += '});';
            __htmlScript += '</script>';

            var __html= '<WidgetControl id="{0}">{1}</WidgetControl>';

            return String.format(__html, controlName, __htmlScript);
        },
        Label: function ($controlContent, controlName) {
            var $properties = $controlContent.find('[data-properties]');
            var controlId = $controlContent.find('[data-control="Label"]').prop('id') || '';
            var __targetId = $('#' + controlId).attr('target-id') || '';

            var __htmlScript = '';
            __htmlScript += '<script type="text/javascript">';
            __htmlScript += '$(function() {\n';
            __htmlScript += 'iNet.controls["'+controlName+'"] = $("#'+controlId+'");\n';
            __htmlScript += 'iNet.controls["'+controlName+'"].validate = "'+controlName+'";\n';
            __htmlScript += 'iNet.controls["'+controlName+'"].type="Label";\n';
            __htmlScript += 'if(!(!!"$editmode" && "$editmode" == "true")) {\n';
            __htmlScript += '}\n';

            __htmlScript += 'iNet.controls["'+controlName+'"].validate = "'+controlName+'";\n';

            __htmlScript += 'iNet.controls["'+controlName+'"].setValue = function(value){\n';
            __htmlScript += '$("#'+controlId+'").text(value); \n';
            __htmlScript += '}\n';

            __htmlScript += 'iNet.controls["'+controlName+'"].getValue = function(){\n';
            __htmlScript += 'return $("#'+controlId+'").text(); \n';
            __htmlScript += '}\n';

            __htmlScript += '});';
            __htmlScript += '</script>';

            var __html= '<LabelControl id="{0}">{1}</LabelControl>';

            return String.format(__html, controlName, __htmlScript);
        },
        Text: function ($controlContent, controlName) {
            var $properties = $controlContent.find('[data-properties]');
            var controlId = $controlContent.find('[data-control="Text"]').prop('id') || '';
            var __targetId = $('#' + controlId).attr('target-id') || '';
            var __require = $properties.find('[rel="require"]:first').attr('property-value') || '';
            var __errormessage = $properties.find('[rel="errormessage"]:first').attr('property-value') || '*';
            var __mask = $properties.find('[rel="mask"]:first').attr('property-value') || '';
            var __maskoption = $properties.find('[rel="maskoption"]:first').attr('property-value') || '';

            var __htmlScript = '';
            __htmlScript += '<script type="text/javascript">';
            __htmlScript += '$(function() {\n';
            __htmlScript += 'iNet.controls["'+controlName+'"] = $("#'+controlId+'");\n';
            __htmlScript += 'iNet.controls["'+controlName+'"].validate = "'+controlName+'";\n';
            __htmlScript += 'iNet.controls["'+controlName+'"].type="Text";\n';

            __htmlScript += 'iNet.controls["'+controlName+'"].setValue = function(value){\n';
            __htmlScript += '$("#'+controlId+'").val(value); \n';
            __htmlScript += '}\n';

            __htmlScript += 'iNet.controls["'+controlName+'"].getValue = function(){\n';
            __htmlScript += 'return $("#'+controlId+'").val(); \n';
            __htmlScript += '}\n';

            if (!iNet.isEmpty(__mask)) {
                var __option = '{}';
                try {
                    __maskoption = __maskoption.replace(/'/gi, '"');
                    __option = iNet.JSON.decode(__maskoption);
                    __option = __maskoption;
                } catch (e) {
                }
                __htmlScript += '$("#'+controlId+'").mask("'+__mask+'", iNet.JSON.decode('+'\''+__option+'\''+'));\n';
            }
            if (__require == "true"){
                __htmlScript += 'iNet.controls["'+controlName+'"].validate = function(){\n';
                __htmlScript += 'return new iNet.ui.form.Validate({\n';
                __htmlScript += 'id: iNet.findForm($("#'+controlId+'")),\n';
                __htmlScript += 'rules: [\n';
                __htmlScript += '{\n';
                __htmlScript += 'id: "'+controlId+'",\n';
                __htmlScript += 'validate: function (v) {\n';
                __htmlScript += 'if (iNet.isEmpty(v)){\n';
                __htmlScript += ' if (iNet.isEmpty($("#'+controlId+'").attr("value") || "")){\n';
                __htmlScript += '  return "'+__errormessage+'";\n';
                __htmlScript += ' }\n';
                __htmlScript += '}\n';
                __htmlScript += '}\n';
                __htmlScript += '}\n';
                __htmlScript += ']\n';
                __htmlScript += '});\n';
                __htmlScript += '};\n';

                __htmlScript += 'iNet.controls["'+controlName+'"].messageError = "'+__errormessage+'"\n';
            }
            __htmlScript += 'if(!(!!"$editmode" && "$editmode" == "true")) {\n';
            __htmlScript += '$("#'+controlId+'").attr("disabled", "disabled"); \n';
            __htmlScript += '}\n';
            __htmlScript += '});';
            __htmlScript += '</script>';

            var __html= '<TextControl id="{0}">{1}</TextControl>';

            return String.format(__html, controlName, __htmlScript);
        },
        Check: function ($controlContent, controlName) {
            var $properties = $controlContent.find('[data-properties]');
            var controlId = $controlContent.find('[data-control="Check"]').prop('id') || '';
            var __targetId = $('#' + controlId).attr('target-id') || '';

            var __htmlScript = '';
            __htmlScript += '<script type="text/javascript">';
            __htmlScript += '$(function() {\n';
            __htmlScript += 'iNet.controls["'+controlName+'"] = $("#'+controlId+'");\n';
            __htmlScript += 'iNet.controls["'+controlName+'"].validate = "'+controlName+'";\n';
            __htmlScript += 'iNet.controls["'+controlName+'"].type="Check";\n';

            __htmlScript += '$("#'+controlId+'").on("change", function(){; \n';
            __htmlScript += '$("#'+controlId+'").attr("value", $("#'+controlId+'").prop("checked")); \n';
            __htmlScript += '});';

            __htmlScript += 'if(!(!!"$editmode" && "$editmode" == "true")) {\n';
            __htmlScript += '$("#'+controlId+'").attr("disabled", "disabled"); \n';
            __htmlScript += '}\n';
            __htmlScript += '});';
            __htmlScript += '</script>';

            var __html= '<CheckControl id="{0}">{1}</CheckControl>';

            return String.format(__html, controlName, __htmlScript);
        },
        Number: function ($controlContent, controlName) {
            var $properties = $controlContent.find('[data-properties]');
            var controlId = $controlContent.find('[data-control="Number"]').prop('id') || '';
            var __targetId = $('#' + controlId).attr('target-id') || '';
            var __require = $properties.find('[rel="require"]:first').attr('property-value') || '';
            var __errormessage = $properties.find('[rel="errormessage"]:first').attr('property-value') || '*';
            var __mask = $properties.find('[rel="mask"]:first').attr('property-value') || '';
            var __maskoption = $properties.find('[rel="maskoption"]:first').attr('property-value') || '';

            var __htmlScript = '';
            __htmlScript += '<script type="text/javascript">';
            __htmlScript += '$(function() {\n';
            __htmlScript += 'iNet.controls["'+controlName+'"] = $("#'+controlId+'");\n';
            __htmlScript += 'iNet.controls["'+controlName+'"].validate = "'+controlName+'";\n';
            __htmlScript += 'iNet.controls["'+controlName+'"].type="Number";\n';

            __htmlScript += 'iNet.controls["'+controlName+'"].setValue = function(value){\n';
            __htmlScript += '$("#'+controlId+'").val(value); \n';
            __htmlScript += '}\n';

            __htmlScript += 'iNet.controls["'+controlName+'"].getValue = function(){\n';
            __htmlScript += 'return $("#'+controlId+'").val(); \n';
            __htmlScript += '}\n';

            if (!iNet.isEmpty(__mask)) {
                var __option = '{}';
                try {
                    __maskoption = __maskoption.replace(/'/gi, '"');
                    __option = iNet.JSON.decode(__maskoption);
                    __option = __maskoption;
                } catch (e) {
                }
                __htmlScript += '$("#'+controlId+'").mask("'+__mask+'", iNet.JSON.decode('+'\''+__option+'\''+'));\n';
            }
            if (__require == "true"){
                __htmlScript += 'iNet.controls["'+controlName+'"].validate = function(){\n';
                __htmlScript += 'return new iNet.ui.form.Validate({\n';
                __htmlScript += 'id: iNet.findForm($("#'+controlId+'")),\n';
                __htmlScript += 'rules: [\n';
                __htmlScript += '{\n';
                __htmlScript += 'id: "'+controlId+'",\n';
                __htmlScript += 'validate: function (v) {\n';
                __htmlScript += 'if (iNet.isEmpty(v)){\n';
                __htmlScript += ' if (iNet.isEmpty($("#'+controlId+'").attr("value") || "")){\n';
                __htmlScript += '  return "'+__errormessage+'";\n';
                __htmlScript += ' }\n';
                __htmlScript += '}\n';
                __htmlScript += '}\n';
                __htmlScript += '}\n';
                __htmlScript += ']\n';
                __htmlScript += '});\n';
                __htmlScript += '};\n';

                __htmlScript += 'iNet.controls["'+controlName+'"].messageError = "'+__errormessage+'"\n';
            }
            __htmlScript += 'if(!(!!"$editmode" && "$editmode" == "true")) {\n';
            __htmlScript += '$("#'+controlId+'").attr("disabled", "disabled"); \n';
            __htmlScript += '}\n';
            __htmlScript += '});';
            __htmlScript += '</script>';

            var __html= '<NumberControl id="{0}">{1}</NumberControl>';

            return String.format(__html, controlName, __htmlScript);
        },
        Date: function ($controlContent, controlName) {
            var $properties = $controlContent.find('[data-properties]');
            var controlId = $controlContent.find('[data-control="Date"]').prop('id') || '';
            var textId = $controlContent.find('[data-control="Text"]').prop('id') || '';
            var __targetId = $('#' + controlId).attr('target-id') || '';
            var __require = $properties.find('[rel="require"]:first').attr('property-value') || '';
            var __errormessage = $properties.find('[rel="errormessage"]:first').attr('property-value') || '*';
            var __mask = $properties.find('[rel="mask"]:first').attr('property-value') || '';
            var __maskoption = $properties.find('[rel="maskoption"]:first').attr('property-value') || '';

            var __htmlScript = '';
            __htmlScript += '<script type="text/javascript">';
            __htmlScript += '\n';
            __htmlScript += '$(function() {\n';
            __htmlScript += 'iNet.controls["'+controlName+'"] = $("#'+controlId+'").datepicker({\n';
            __htmlScript += 'format: "dd/mm/yyyy"\n';
            __htmlScript += '}).on("changeDate", function (ev) {\n';
            __htmlScript += '$("#'+textId+'").val(ConvertService.dateToLong($("#'+controlId+'").val()));\n';
            __htmlScript += 'iNet.controls["'+controlName+'"].hide();\n';
            __htmlScript += '}).data("datepicker");\n';
            __htmlScript += 'iNet.controls["'+controlName+'"].validate = "'+controlName+'";\n';
            __htmlScript += 'iNet.controls["'+controlName+'"].type="Date";\n';

            if (!iNet.isEmpty(__mask)) {
                var __option = '{}';
                try {
                    __maskoption = __maskoption.replace(/'/gi, '"');
                    __option = iNet.JSON.decode(__maskoption);
                    __option = __maskoption;
                } catch (e) {
                }
                __htmlScript += '$("#'+controlId+'").mask("'+__mask+'", iNet.JSON.decode('+'\''+__option+'\''+'));\n';
            }
            if (__require == "true"){
                __htmlScript += 'iNet.controls["'+controlName+'"].validate = function(){\n';
                __htmlScript += 'return new iNet.ui.form.Validate({\n';
                __htmlScript += 'id: iNet.findForm($("#'+controlId+'")),\n';
                __htmlScript += 'rules: [\n';
                __htmlScript += '{\n';
                __htmlScript += 'id: "'+controlId+'",\n';
                __htmlScript += 'validate: function (v) {\n';
                __htmlScript += 'if (iNet.isEmpty(v)){\n';
                __htmlScript += ' if (iNet.isEmpty($("#'+controlId+'").attr("value") || "")){\n';
                __htmlScript += '  return "'+__errormessage+'";\n';
                __htmlScript += ' }\n';
                __htmlScript += '}\n';
                __htmlScript += '}\n';
                __htmlScript += '}\n';
                __htmlScript += ']\n';
                __htmlScript += '});\n';
                __htmlScript += '};\n';

                __htmlScript += 'iNet.controls["'+controlName+'"].messageError = "'+__errormessage+'"\n';
            }

            __htmlScript += 'iNet.controls["'+controlName+'"].setValue = function(value){\n';
            __htmlScript += '$("#'+controlId+'").val(value); \n';
            __htmlScript += '$("#'+textId+'").val(ConvertService.dateToLong($("#'+controlId+'").val())); \n';
            __htmlScript += '}\n';

            __htmlScript += 'iNet.controls["'+controlName+'"].getValue = function(){\n';
            __htmlScript += 'return $("#'+controlId+'").val(); \n';
            __htmlScript += '}\n';

            __htmlScript += 'iNet.controls["'+controlName+'"].setDate = function(date){\n';
            __htmlScript += '$("#'+controlId+'").val(date); \n';
            __htmlScript += '$("#'+textId+'").val(ConvertService.dateToLong($("#'+controlId+'").val())); \n';
            __htmlScript += '}\n';

            __htmlScript += 'if(!(!!"$editmode" && "$editmode" == "true")) {\n';
            __htmlScript += '$("#'+controlId+'").attr("disabled", "disabled"); \n';
            __htmlScript += '}\n';

            __htmlScript += '$("#'+controlId+'").next().on("click", function () {\n';
            __htmlScript += '$(this).prev().focus();\n';
            __htmlScript += '});\n';

            __htmlScript += '$("#'+controlId+'").on("keydown", function (ev) {\n';
            __htmlScript += 'if (ev.which == 13 || ev.which == 9) {\n';
            __htmlScript += '$("#'+textId+'").val(ConvertService.dateToLong($("#'+controlId+'").val()));\n';
            __htmlScript += 'iNet.controls["'+controlName+'"].hide();\n';
            __htmlScript += '}\n';
            __htmlScript += '});\n';

            __htmlScript += '$("#'+controlId+'").on("change", function (ev) {\n';
            __htmlScript += '$("#'+textId+'").val(ConvertService.dateToLong($("#'+controlId+'").val()));\n';
            __htmlScript += '$("#'+controlId+'").val(ConvertService.longToDate($("#'+textId+'").val()));\n';
            __htmlScript += '});\n';

            __htmlScript += '$("#'+controlId+'").val(ConvertService.longToDate($("#'+textId+'").val()));\n';

            __htmlScript += '});\n';
            __htmlScript += '</script>';

            var __html= '<DateControl id="{0}">{1}</DateControl>';

            return String.format(__html, controlName, __htmlScript);
        },
        File: function ($controlContent, controlName) {
            var $properties = $controlContent.find('[data-properties]');
            var controlId = $controlContent.find('[data-control="File"]').prop('id') || '';
            var __targetId = $('#' + controlId).attr('target-id') || '';
            var __require = $properties.find('[rel="require"]:first').attr('property-value') || '';
            var __errormessage = $properties.find('[rel="errormessage"]:first').attr('property-value') || '*';

            var __htmlScript = '';
            __htmlScript += '<script type="text/javascript">';
            __htmlScript += '$(function() {\n';
            __htmlScript += 'iNet.controls["'+controlName+'"] = $("#'+controlId+'");\n';
            __htmlScript += 'iNet.controls["'+controlName+'"].validate = "'+controlName+'";\n';
            __htmlScript += 'iNet.controls["'+controlName+'"].type="File";\n';

            if (__require == "true") {
                __htmlScript += 'iNet.controls["' + controlName + '"].validate = function(){\n';
                __htmlScript += 'return new iNet.ui.form.Validate({\n';
                __htmlScript += 'id: iNet.findForm($("#' + controlId + '")),\n';
                __htmlScript += 'rules: [\n';
                __htmlScript += '{\n';
                __htmlScript += 'id: "' + controlId + '",\n';
                __htmlScript += 'validate: function (v) {\n';
                __htmlScript += 'if (iNet.isEmpty(v)){\n';
                __htmlScript += '      var $fileContent = $("#'+controlId+'").parent();\n';
                __htmlScript += '      var dataHardCopy = ($fileContent.find("input[data-hardcopy]").length > 0) ? $fileContent.find("input[data-hardcopy]").val() : "noHardCopy";\n';
                __htmlScript += '      var dataScanner = ($fileContent.find("input[data-scanner]").length > 0) ? $fileContent.find("input[data-scanner]").val() : "noScanner";\n';
                __htmlScript += '      var dataFile = ($fileContent.css("display")=="none") || !iNet.isEmpty($("#'+controlId+'").val());\n';
                __htmlScript += '      if (dataHardCopy=="false" && iNet.isEmpty(dataScanner) && dataFile){\n';
                __htmlScript += '           return "' + __errormessage + '";\n';
                __htmlScript += '      }\n';
                __htmlScript += '}\n';
                __htmlScript += '}\n';
                __htmlScript += '}\n';
                __htmlScript += ']\n';
                __htmlScript += '});\n';
                __htmlScript += '};\n';

                __htmlScript += 'iNet.controls["'+controlName+'"].validateCheck = function(){\n';
                __htmlScript += 'if (!iNet.controls["'+controlName+'"].validate().check()){\n';

                __htmlScript += '$("#'+controlId+'").parent().find("label[data-title]").addClass("tooltip-error error");\n';
                __htmlScript += '$("#'+controlId+'").parent().find("label[data-title]").attr("title", "'+__errormessage+'");\n';
                __htmlScript += '} else {\n';
                __htmlScript += '$("#'+controlId+'").parent().find("label[data-title]").removeClass("tooltip-error error");\n';
                __htmlScript += '$("#'+controlId+'").parent().find("label[data-title]").attr("title", "");\n';
                __htmlScript += '};\n';
                __htmlScript += '};\n';

                __htmlScript += 'iNet.controls["'+controlName+'"].messageError = "'+__errormessage+'"\n';
            }

            __htmlScript += '$("#'+controlId+'").on("change", function(){\n';
            __htmlScript += 'if (this.files.length < 1) {\n';
            __htmlScript += 'this.files = [];\n';
            __htmlScript += 'return;\n';
            __htmlScript += '}\n';
            __htmlScript += '$("#'+controlId+'").parent().find("span[data-title]").attr("data-title", this.files[0].name);\n';
            __htmlScript += '$("#'+controlId+'").parent().find("label[data-title]").addClass("selected");\n';
            __htmlScript += '$("#'+controlId+'").parent().find("input[data-scanner]").attr("value","");\n';
            __htmlScript += '});\n';
            __htmlScript += 'if(!!"$editmode" && "$editmode" == "true") {\n';

            __htmlScript += '$("#'+controlId+'").parent().find("[data-container] label[data-title]").on("click", function(){\n';
            __htmlScript += '$("#'+controlId+'").trigger("click");\n';
            __htmlScript += '});\n';

            __htmlScript += '$("#'+controlId+'").parent().find("[data-remove]").on("click", function(){\n';
            __htmlScript += '$("#'+controlId+'").val("");\n';
            __htmlScript += '$("#'+controlId+'").parent().find("label[data-title]").removeClass("selected");\n';
            __htmlScript += '$("#'+controlId+'").parent().find("span[data-title]").attr("data-title","...");\n';
            __htmlScript += '});\n';

            __htmlScript += '$("#'+controlId+'").parent().find("[data-hardcopy]").on("change", function(){\n';
            __htmlScript += '$(this).attr("value", $(this).prop("checked"));\n';
            __htmlScript += '});\n';

            __htmlScript += 'function '+controlName+'ScanIndex(url, images, i, docID) {\n';
            __htmlScript += 'var __data = {};\n';
            __htmlScript += '__data.scanner_mimetype1 = images[i].mimetype;\n';
            __htmlScript += '__data.scanner_base1 = images[i].data;\n';
            __htmlScript += 'if (!iNet.isEmpty(docID)) {\n';
            __htmlScript += '__data.docID = docID;\n';
            __htmlScript += '}\n';

            __htmlScript += '$.postJSON(url, __data, function (result) {\n';
            __htmlScript += 'var __result = result || {};\n';
            __htmlScript += 'if (!iNet.isEmpty(__result.uuid)) {\n';
            __htmlScript += 'var __docID = __result.uuid || "";\n';
            __htmlScript += 'var __fileID = __result.file || "Scanner completed ....";\n';

            //__htmlScript += 'console.log(">> scaner index >>", i, (images.length - 1), __result);\n';

            __htmlScript += 'if (i >= (images.length - 1)) {\n';
            __htmlScript += '$("#'+controlId+'").val("");\n';
            __htmlScript += '$("#'+controlId+'").parent().find("label[data-title]").removeClass("selected");\n';
            __htmlScript += '$("#'+controlId+'").parent().find("span[data-title]").attr("data-title",__fileID);\n';
            __htmlScript += '$("#'+controlId+'").parent().find("input[data-scanner]").attr("value",__docID);\n';
            __htmlScript += '} else {\n';
            __htmlScript += 'var __process = "...";\n';
            __htmlScript += 'if(i%2==0) {__process = "......";}\n';
            __htmlScript += 'if(i%3==0) {__process = ".........";}\n';
            __htmlScript += '$("#'+controlId+'").parent().find("span[data-title]").attr("data-title",__process);\n';
            __htmlScript += ''+controlName+'ScanIndex(url, images, (i + 1), __docID);\n';
            __htmlScript += '}\n';
            __htmlScript += '} else {\n';
            __htmlScript += '$("#'+controlId+'").val("");\n';
            __htmlScript += '$("#'+controlId+'").parent().find("label[data-title]").removeClass("selected");\n';
            __htmlScript += '$("#'+controlId+'").parent().find("span[data-title]").attr("data-title",__fileID);\n';
            __htmlScript += '$("#'+controlId+'").parent().find("input[data-scanner]").attr("value",__docID);\n';
            __htmlScript += '}\n';
            __htmlScript += '});\n';

            __htmlScript += '}\n';

            __htmlScript += 'function '+controlName+'CallBackFunc(success, mesg, thumbs, images) {\n';
            __htmlScript += 'if ((images instanceof Array) && images.length > 0){\n';
            __htmlScript += ''+controlName+'ScanIndex(iNet.getUrl("firmtask/scanner/upload"), images, 0, "");\n';
            __htmlScript += '}\n';

            __htmlScript += 'ControlService.RemoveScanner("'+controlId+'");\n';
            __htmlScript += '}\n';

            __htmlScript += '$("#'+controlId+'").parent().find("[data-scanner]").on("click", function(){\n';
            __htmlScript += 'ControlService.RenderScanner("'+controlId+'");\n';
            __htmlScript += 'setTimeout(function(){\n';
            __htmlScript += 'com_asprise_scan_request('+controlName+'CallBackFunc, // callback on dialog closed\n';
            __htmlScript += 'com_asprise_scan_cmd_method_SCAN, // action: SCAN\n';
            __htmlScript += 'com_asprise_scan_cmd_return_IMAGES_AND_THUMBNAILS, // return types\n';
            __htmlScript += '{"wia-version": 2} // options\n';
            __htmlScript += ');\n';
            __htmlScript += '}, 2000);\n';

            __htmlScript += '});\n';

            __htmlScript += '}\n';
            __htmlScript += '});';
            __htmlScript += '</script>';

            var __html= '<FileControl id="{0}">{1}</FileControl>';

            return String.format(__html, controlName, __htmlScript);
        },
        Select: function ($controlContent, controlName) {
            var $properties = $controlContent.find('[data-properties]');
            var controlId = $controlContent.find('[data-control="Select"]').prop('id') || '';
            var __targetId = $('#' + controlId).attr('target-id') || '';
            var __service = $properties.find('[rel="service"]:first').attr('property-value') || '';
            var __sourcevalue = $properties.find('[rel="sourcevalue"]:first').attr('property-value') || '';
            var __displayvalue = $properties.find('[rel="displayvalue"]:first').attr('property-value') || '';
            var __keyvalue = $properties.find('[rel="keyvalue"]:first').attr('property-value') || '';
            var __require = $properties.find('[rel="require"]:first').attr('property-value') || '';
            var __errormessage = $properties.find('[rel="errormessage"]:first').attr('property-value') || '*';

            var __htmlScript = '';
            __htmlScript += '<script type="text/javascript">';
            __htmlScript += '$(function() {\n';
            __htmlScript += 'iNet.sources["'+controlName+'"] = {};\n';
            __htmlScript += 'iNet.sources["'+controlName+'"]["'+controlName+'"] = [];\n';
            __htmlScript += 'iNet.ajaxs["'+controlName+'"] = {};\n';
            if(!iNet.isEmpty(__service)) {
                __htmlScript += 'iNet.ajaxs["' + controlName + '"]["postJSON' + controlName + '"] = \n';
                __htmlScript += '$.postJSON(iNet.getUrl("' + __service + '"), { pageNumber: 0, pageSize: 9999 }, function(result){ \n';
                __htmlScript += 'var __result = result || {}; \n';
                var __displayName = "";
                $(__displayvalue.split(',')).each(function(i, value){
                    if (i > 0 && i < __displayvalue.split(',').length) { __displayName = __displayName + ' + " - " + '; }
                    __displayName = __displayName + '(obj["' + (value || "name") + '"] || "")';
                });

                if (iNet.isEmpty(__sourcevalue)) {
                    __htmlScript += 'for (var key in __result) {\n';
                    __htmlScript += 'if (iNet.isArray(__result[key])) {\n';
                    __htmlScript += '$.each(__result[key] || [], function (i, obj) {\n';
                    __htmlScript += 'iNet.sources["' + controlName + '"]["' + controlName + '"].push({id: (obj["' + (__keyvalue || "id") + '"] || "EmptyId"), code: (obj["' + (__keyvalue || "code") + '"] || "EmptyCode"), name: ('+__displayName+' || "EmptyName"), obj: obj}); \n';
                    __htmlScript += '});\n';
                    __htmlScript += '}\n';
                    __htmlScript += '}\n';
                } else {
                    __htmlScript += 'if (iNet.isArray(__result["' + __sourcevalue + '"])) {\n';
                    __htmlScript += '$.each(__result["' + __sourcevalue + '"] || [], function (i, obj) {\n';
                    __htmlScript += 'iNet.sources["' + controlName + '"]["' + controlName + '"].push({id: (obj["' + (__keyvalue || "id") + '"] || "EmptyId"), code: (obj["' + (__keyvalue || "code") + '"] || "EmptyCode"), name: ('+__displayName+' || "EmptyName"), obj: obj}); \n';
                    __htmlScript += '});\n';
                    __htmlScript += '}\n';
                }
                __htmlScript += '});\n';

                __htmlScript += '$.when(';
                __htmlScript += 'iNet.ajaxs["' + controlName + '"]["postJSON' + controlName + '"]';
                __htmlScript += ').done(function(){\n';
                __htmlScript += 'iNet.controls["' + controlName + '"] = ControlService.RenderSelect("' + controlId + '",iNet.sources["' + controlName + '"]["' + controlName + '"],"id",1,true,false);\n';
                __htmlScript += 'iNet.controls["'+controlName+'"].validate = "'+controlName+'";\n';
                __htmlScript += 'iNet.controls["'+controlName+'"].type="Select";\n';

                if (__require == "true") {
                    __htmlScript += 'iNet.controls["' + controlName + '"].validate = function(){\n';
                    __htmlScript += 'return new iNet.ui.form.Validate({\n';
                    __htmlScript += 'id: iNet.findForm($("#' + controlId + '")),\n';
                    __htmlScript += 'rules: [\n';
                    __htmlScript += '{\n';
                    __htmlScript += 'id: "' + controlId + '",\n';
                    __htmlScript += 'validate: function (v) {\n';
                    __htmlScript += 'if (iNet.isEmpty(v)){\n';
                    __htmlScript += ' if (iNet.isEmpty($("#'+controlId+'").attr("value") || "")){\n';
                    __htmlScript += '  return "'+__errormessage+'";\n';
                    __htmlScript += ' }\n';
                    __htmlScript += '}\n';
                    __htmlScript += '}\n';
                    __htmlScript += '}\n';
                    __htmlScript += ']\n';
                    __htmlScript += '});\n';
                    __htmlScript += '};\n';

                    __htmlScript += 'iNet.controls["'+controlName+'"].messageError = "'+__errormessage+'"\n';
                }
                __htmlScript += 'if(!(!!"$editmode" && "$editmode" == "true")) {\n';
                __htmlScript += '$("#' + controlId + '").attr("disabled", "disabled"); \n';
                __htmlScript += '}\n';
                __htmlScript += '});\n';
            } else {
                __htmlScript += 'iNet.sources["' + controlName + '"]["' + controlName + '"] = []; \n';
                if (!iNet.isEmpty(__sourcevalue)) {
                    var __arraySource = [];
                    try {
                        __arraySource = eval(__sourcevalue);
                    } catch (e) {
                        __arraySource = [];
                    }

                    $.each(__arraySource, function(i, obj){
                        __htmlScript += 'iNet.sources["' + controlName + '"]["' + controlName + '"].push({id: "'+(iNet.isEmpty(obj[__keyvalue || "id"]) ? "EmptyId" : obj[__keyvalue || "id"])+'", code: "'+(iNet.isEmpty(obj[__keyvalue || "code"]) ? "EmptyCode" : obj[__keyvalue || "code"])+'", name: "'+ (iNet.isEmpty(obj[__displayvalue || "name"]) ? "EmptyName" : obj[__displayvalue || "name"]) +'"}); \n';
                    });
                }

                __htmlScript += 'iNet.controls["' + controlName + '"] = ControlService.RenderSelect("' + controlId + '",iNet.sources["' + controlName + '"]["' + controlName + '"],"id",1,true,false);\n';
                __htmlScript += 'iNet.controls["'+controlName+'"].validate = "'+controlName+'";\n';
                __htmlScript += 'iNet.controls["'+controlName+'"].type="Select";\n';

                if (__require == "true") {
                    __htmlScript += 'iNet.controls["' + controlName + '"].validate = function(){\n';
                    __htmlScript += 'return new iNet.ui.form.Validate({\n';
                    __htmlScript += 'id: iNet.findForm($("#' + controlId + '")),\n';
                    __htmlScript += 'rules: [\n';
                    __htmlScript += '{\n';
                    __htmlScript += 'id: "' + controlId + '",\n';
                    __htmlScript += 'validate: function (v) {\n';
                    __htmlScript += 'if (iNet.isEmpty(v)){\n';
                    __htmlScript += ' if (iNet.isEmpty($("#'+controlId+'").attr("value") || "")){\n';
                    __htmlScript += '  return "'+__errormessage+'";\n';
                    __htmlScript += ' }\n';
                    __htmlScript += '}\n';
                    __htmlScript += '}\n';
                    __htmlScript += '}\n';
                    __htmlScript += ']\n';
                    __htmlScript += '});\n';
                    __htmlScript += '};\n';

                    __htmlScript += 'iNet.controls["'+controlName+'"].messageError = "'+__errormessage+'"\n';
                }
                __htmlScript += 'if(!(!!"$editmode" && "$editmode" == "true")) {\n';
                __htmlScript += '$("#' + controlId + '").attr("disabled", "disabled"); \n';
                __htmlScript += '}\n';
            }

            __htmlScript += '});';
            __htmlScript += '</script>';

            var __html= '<SelectControl id="{0}">{1}</SelectControl>';

            return String.format(__html, controlName, __htmlScript);
        },
        SimpleGrid: function ($controlContent, controlName) {
            var $properties = $controlContent.find('[data-properties]');
            var controlId = $controlContent.find('[data-control="SimpleGrid"]').prop('id') || '';
            var __targetId = $('#' + controlId).attr('target-id') || '';
            var __buttonNewRecordId = $controlContent.find('[data-action="NewRecord"]').prop('id') || '';
            var __hiddenId = $controlContent.find('[data-control="Text"]').prop('id') || '';
            var __require = $properties.find('[rel="require"]:first').attr('property-value') || '';
            var __errormessage = $properties.find('[rel="errormessage"]:first').attr('property-value') || '*';

            var __columns = [];
            var __formulas = [];
            var __ajaxs = [];
            var $dataSource = $properties.find('datasource[target-id="'+__targetId+'"]:first');
            $dataSource.find('[ref="column"]').each(function(){
                var $column = $(this);
                var __ref = $column.attr('ref') || '';
                var __rel = $column.attr('rel') || ''; //Column name

                var $attrs = $dataSource.find('column[target-id="'+__rel+'"]');
                var __columnType = $attrs.find('[rel="type"]:first').attr('property-value') || '';
                var __name = $attrs.find('[rel="property"]:first').attr('property-value') || '';
                var __title = $attrs.find('[rel="label"]:first').attr('property-value') || '';
                var __width = $attrs.find('[rel="width"]:first').attr('property-value') || '';
                var __sortable = $attrs.find('[rel="sortable"]:first').attr('property-value') || '';
                var __disabled = $attrs.find('[rel="disabled"]:first').attr('property-value') || '';
                var __align = $attrs.find('[rel="align"]:first').attr('property-value') || '';
                var __service = $attrs.find('[rel="service"]:first').attr('property-value') || '';
                var __sourcevalue = $attrs.find('[rel="sourcevalue"]:first').attr('property-value') || '';
                var __displayvalue = $attrs.find('[rel="displayvalue"]:first').attr('property-value') || '';
                var __keyvalue = $attrs.find('[rel="keyvalue"]:first').attr('property-value') || '';
                var __formula = $attrs.find('[rel="formula"]:first').attr('property-value') || '';

                if (__columnType == "select2" && iNet.isEmpty(__service)) {
                    __columnType = "text";
                }

                switch (__columnType) {
                    case "select2":
                        var __html = '{"name": "{0}", "title": "{1}", "width" : "{2}", "fnEdit": "{3}", "optValue": "id", "optDisplay": "name", "type" : "select2"}';
                        var __fnEdit = String.format("fnGet{0}", __name);

                        __formulas.push({name: __name, formula: __formula});
                        __ajaxs.push({name: __name, service: __service, sourcevalue: __sourcevalue, displayvalue: __displayvalue, keyvalue: __keyvalue, fnEdit: __fnEdit});
                        __html = String.format(__html, __name, __title, __width, __fnEdit);
                        __columns.push(__html);

                        break;
                    case "datetime":
                        var __html = '{"name": "{0}", "title": "{1}", "width" : "{2}", "sortable": "{3}", "disabled": "{4}", "align": "{5}", "type" : "{6}", "clearTime": true }';

                        __formulas.push({name: __name, formula: __formula});
                        __html = String.format(__html, __name, __title, __width, __sortable, __disabled, __align, __columnType);
                        __columns.push(__html);
                        break;
                    default :
                        var __html = '{"name": "{0}", "title": "{1}", "width" : "{2}", "sortable": "{3}", "disabled": "{4}", "align": "{5}", "type" : "{6}"}';

                        __formulas.push({name: __name, formula: __formula});
                        __html = String.format(__html, __name, __title, __width, __sortable, __disabled, __align, __columnType);
                        __columns.push(__html);
                        break;
                }
            });

            var __htmlSource = '';
            __htmlSource += '<script type="text/javascript">';
            __htmlSource += '$(function() {\n';
            __htmlSource += 'fnData'+controlName+' = {};\n';
            $.each(__ajaxs, function(i, ajax){
                __htmlSource += 'fnData'+controlName+'["fnGet'+ajax.name+'"]=[];\n';
            });
            //__htmlSource += 'fnData'+controlName+'["fnGetProduct"]=[]';
            __htmlSource += '});\n';
            __htmlSource += '</script>';

            var __htmlVelocity = '';
            __htmlVelocity+='#gridUI({\n';
            __htmlVelocity+='"type":"simple-grid-form",\n';
            __htmlVelocity+='"namespace":"'+controlName+'",\n';
            __htmlVelocity+='"id":"'+controlId+'",\n';
            __htmlVelocity+='"url":"",\n';
            __htmlVelocity+='"firstLoad": false,\n';
            __htmlVelocity+='"hideHeader": true,\n';
            __htmlVelocity+='"hideSearch": true,\n';
            __htmlVelocity+='"rowId":"autoId"\n';
            __htmlVelocity+='})\n';
            __htmlVelocity+='[\n';
            __htmlVelocity+= __columns.toString();
            __htmlVelocity+='#if(!!$editmode && $editmode == true)';
            __htmlVelocity+=',{\n';
            __htmlVelocity+='"align": "center",\n';
            __htmlVelocity+='"buttons":\n';
            __htmlVelocity+='[\n';
            __htmlVelocity+='{"fnAction": "gridedit", "icon": "icon-pencil", "title": "Edit"},\n';
            __htmlVelocity+='{"fnAction": "griddelete", "icon": "icon-trash", "css": "label label-important", "title": "delete"}\n';
            __htmlVelocity+=']\n';
            __htmlVelocity+='}\n';
            __htmlVelocity+='#end';
            __htmlVelocity+=']\n';
            __htmlVelocity+='#end';

            var __htmlScript = '';
            __htmlScript += '<script type="text/javascript">';
            __htmlScript += '$(function() {\n';
            __htmlScript += 'iNet.sources["'+controlName+'"] = {};\n';
            __htmlScript += 'iNet.ajaxs["'+controlName+'"] = {};\n';
            $.each(__ajaxs, function(i, ajax){
                __htmlScript += 'iNet.sources["'+controlName+'"]["'+ajax.name+'"] = [];\n';
                __htmlScript += 'iNet.ajaxs["'+controlName+'"]["postJSON'+ajax.name+'"] = \n';
                __htmlScript += '$.postJSON(iNet.getUrl("'+ajax.service+'"), {pageNumber: 0, pageSize: 9999}, function(result){ \n';
                __htmlScript += 'var __result = result || {}; \n';
                if (iNet.isEmpty(ajax.sourcevalue)){
                    __htmlScript += 'for (var key in __result) {\n';
                    __htmlScript += 'if (iNet.isArray(__result[key])) {\n';
                    __htmlScript += '$.each(__result[key] || [], function (i, obj) {\n';
                    __htmlScript += 'iNet.sources["'+controlName+'"]["'+ajax.name+'"].push({id: (obj["'+(ajax.keyvalue || "id")+'"] || "EmptyId"), code: (obj["'+(ajax.keyvalue || "code")+'"] || "EmptyCode"), name: (obj["'+(ajax.displayvalue || "name")+'"] || "EmptyName"), obj: obj}); \n';
                    __htmlScript += '});\n';
                    __htmlScript += '}\n';
                    __htmlScript += '}\n';
                } else {
                    __htmlScript += 'if (iNet.isArray(__result["'+ajax.sourcevalue+'"])) {\n';
                    __htmlScript += '$.each(__result["'+ajax.sourcevalue+'"] || [], function (i, obj) {\n';
                    __htmlScript += 'iNet.sources["'+controlName+'"]["'+ajax.name+'"].push({id: (obj["'+(ajax.keyvalue || "id")+'"] || "EmptyId"), code: (obj["'+(ajax.keyvalue || "code")+'"] || "EmptyCode"), name: (obj["'+(ajax.displayvalue || "name")+'"] || "EmptyName"), obj: obj}); \n';
                    __htmlScript += '});\n';
                    __htmlScript += '}\n';
                }
                __htmlScript += '});\n';
            });

            //__htmlScript += 'iNet.sources["'+controlName+'"]["Product"] = [];\n';
            //__htmlScript += 'iNet.sources["'+controlName+'"]["postJSONProduct"] = $.postJSON(iNet.getUrl("ibookcore/cms/product/search"), {}, function(result){ var __result = result || {}; $.each(__result.list || [], function(i, item){ iNet.sources["'+controlName+'"]["Product"].push({id: item.id, code: item.code, name: item.name}); }); });\n';

            __htmlScript += 'iNet.controls["'+controlName+'"] = null;\n';
            __htmlScript += '$.when(';
            $.each(__ajaxs, function(i, ajax){
                __htmlScript += 'iNet.ajaxs["'+controlName+'"]["postJSON'+ajax.name+'"]' + ((i == __ajaxs.length-1) ? '' : ',');
            });
            //__htmlScript += 'iNet.ajaxs["'+controlName+'"]["postJSONProduct"]';
            __htmlScript += ').done(function(){\n';
            $.each(__ajaxs, function(i, ajax){
                __htmlScript += 'fnData'+controlName+'["fnGet'+ajax.name+'"] = iNet.sources["'+controlName+'"]["'+ajax.name+'"];\n';
            });
            //__htmlScript += 'fnData'+controlName+'["fnGetProduct"] = iNet.sources["'+controlName+'"]["Product"]\n';

            __htmlScript += 'iNet.controls["'+controlName+'"] = new iNet.ui.'+controlName+'.SimpleGrid({\n';
            __htmlScript += 'fnDataEdit: fnData'+controlName+',\n';
            __htmlScript += 'hideHeader: true,\n';
            __htmlScript += 'pageSize: 200,\n';
            __htmlScript += 'data: #if(!!$formreqdata && !!$formreqdata.'+controlName+')$formreqdata.'+controlName+'#else[]#end\n';
            __htmlScript += '});\n';
            __htmlScript += 'iNet.controls["'+controlName+'"].validate = "'+controlName+'";\n';
            __htmlScript += 'iNet.controls["'+controlName+'"].type="SimpleGrid";\n';

            if (__require == "true"){
                __htmlScript += 'iNet.controls["'+controlName+'"].validate = function(){\n';
                __htmlScript += 'return new iNet.ui.form.Validate({\n';
                __htmlScript += 'id: iNet.findForm($("#'+__hiddenId+'")),\n';
                __htmlScript += 'rules: [\n';
                __htmlScript += '{\n';
                __htmlScript += 'id: "'+__hiddenId+'",\n';
                __htmlScript += 'validate: function (v) {\n';
                __htmlScript += 'if (iNet.isEmpty(v)){\n';
                __htmlScript += ' if (iNet.isEmpty($("#'+__hiddenId+'").attr("value") || "")){\n';
                __htmlScript += '  return "'+__errormessage+'";\n';
                __htmlScript += ' }\n';
                __htmlScript += '}\n';
                __htmlScript += '}\n';
                __htmlScript += '}\n';
                __htmlScript += ']\n';
                __htmlScript += '});\n';
                __htmlScript += '};\n';

                __htmlScript += 'iNet.controls["'+controlName+'"].messageError = "'+__errormessage+'"\n';
                __htmlScript += 'iNet.controls["'+controlName+'"].validateCheck = function(){\n';
                __htmlScript += 'if (!iNet.controls["'+controlName+'"].validate().check()){\n';
                __htmlScript += '$("#'+controlId+'").parent().parent().addClass("tooltip-error error");\n';
                __htmlScript += '$("#'+controlId+'").parent().parent().attr("title", "'+__errormessage+'");\n';
                __htmlScript += '} else {\n';
                __htmlScript += '$("#'+controlId+'").parent().parent().removeClass("tooltip-error error");\n';
                __htmlScript += '$("#'+controlId+'").parent().parent().attr("title", "");\n';
                __htmlScript += '};\n';
                __htmlScript += '};\n';
            }

            if (!iNet.isEmpty(__buttonNewRecordId)) {
                __htmlScript += 'if(!!"$editmode" && "$editmode" == "true"){\n';
                __htmlScript += '$("#' + __buttonNewRecordId + '").show();\n';
                __htmlScript += '} else { \n';
                __htmlScript += '$("#' + __buttonNewRecordId + '").hide();\n';
                __htmlScript += '}\n';

                __htmlScript += '$("#' + __buttonNewRecordId + '").on("click", function(){\n';
                __htmlScript += 'iNet.controls["'+controlName+'"].newRecord();\n';
                __htmlScript += '});\n';
            }

            __htmlScript += 'iNet.controls["'+controlName+'"].setValue = function(){\n';
            __htmlScript += '}\n';

            __htmlScript += 'iNet.controls["'+controlName+'"].getValue = function(){\n';
            __htmlScript += 'return $("#'+__hiddenId+'").val(); \n';
            __htmlScript += '}\n';

            __htmlScript += 'iNet.controls["'+controlName+'"].updateStore = function(){\n';
            __htmlScript += '$("#'+__hiddenId+'").val(iNet.JSON.encode(iNet.controls["'+controlName+'"].getStore().values()));\n';
            __htmlScript += '};\n';

            __htmlScript += 'iNet.controls["'+controlName+'"].getColValue = function(col, formula){\n';
            __htmlScript += 'var __col = col || "";\n';
            __htmlScript += 'var __formula = formula || "sum";\n';
            __htmlScript += 'var __valueReturn = 0;\n';
            __htmlScript += 'if(iNet.isEmpty(__col)) return 0;\n';
            __htmlScript += 'if(__formula == "sum"){\n';
            __htmlScript += 'var __values = iNet.controls["'+controlName+'"].getStore().values() || [];\n';
            __htmlScript += '$.each(__values, function(i, value){\n';
            __htmlScript += 'var __value = value || {};\n';
            __htmlScript += '__valueReturn  += iNet.isNumber(Number(__value[col] || 0)) ? Number(__value[col] || 0) : 0;\n';
            __htmlScript += '});\n';
            __htmlScript += 'return __valueReturn;\n';
            __htmlScript += '} else {\n';
            __htmlScript += 'return __valueReturn;\n';
            __htmlScript += '}\n';
            __htmlScript += '};\n';

            __htmlScript += 'iNet.controls["'+controlName+'"].on("save", function (row) {\n';
            __htmlScript += 'row = row || {};\n';
            __htmlScript += 'row.autoId = iNet.generateId();\n';
            $.each(__formulas, function(i, formula){
                if (!iNet.isEmpty(formula.name || "") && !iNet.isEmpty(formula.formula || "")){
                    __htmlScript += 'try{row["'+formula.name+'"] = math.eval(""+'+formula.formula+');}catch(ex) {}\n';
                }
            });
            __htmlScript += 'iNet.controls["'+controlName+'"].insert(row);\n';
            __htmlScript += '});\n';

            __htmlScript += 'iNet.controls["'+controlName+'"].on("insert", function (row) {\n';
            __htmlScript += 'iNet.controls["'+controlName+'"].updateStore();\n';
            __htmlScript += 'iNet.controls["'+controlName+'"].fireEvent("completed", row);\n';
            //__htmlScript += 'iNet.controls["'+controlName+'"].newRecord();';
            __htmlScript += '});\n';

            __htmlScript += 'iNet.controls["'+controlName+'"].on("update", function (newData, oldData) {\n';
            __htmlScript += 'var row = iNet.apply(oldData, newData) || {};\n';
            $.each(__formulas, function(i, formula){
                if (!iNet.isEmpty(formula.name || "") && !iNet.isEmpty(formula.formula || "")){
                    __htmlScript += 'try{row["'+formula.name+'"] = math.eval(""+'+formula.formula+');}catch(ex) {}\n';
                }
            });

            __htmlScript += 'iNet.controls["'+controlName+'"].update(row);\n';
            __htmlScript += 'iNet.controls["'+controlName+'"].commit();\n';
            __htmlScript += 'iNet.controls["'+controlName+'"].updateStore();\n';
            __htmlScript += 'iNet.controls["'+controlName+'"].fireEvent("completed", row);\n';
            __htmlScript += '});\n';

            __htmlScript += 'iNet.controls["'+controlName+'"].on("gridedit", function(row){\n';
            __htmlScript += 'iNet.controls["'+controlName+'"].edit(row[iNet.controls["'+controlName+'"].getIdProperty()]);\n';
            __htmlScript += '});\n';

            __htmlScript += 'iNet.controls["'+controlName+'"].on("griddelete", function(row){\n';
            __htmlScript += 'iNet.controls["'+controlName+'"].remove(row[iNet.controls["'+controlName+'"].getIdProperty()]);\n';
            __htmlScript += 'iNet.controls["'+controlName+'"].updateStore();\n';
            __htmlScript += 'iNet.controls["'+controlName+'"].fireEvent("completed", row);\n';
            __htmlScript += '});\n';

            __htmlScript += 'iNet.controls["'+controlName+'"].on("loaded", function(){\n';
            __htmlScript += 'console.log(">>loaded>>>");\n';
            __htmlScript += 'iNet.controls["'+controlName+'"].updateStore();\n';
            __htmlScript += '});\n';

            __htmlScript += '});\n';
            __htmlScript += '});';
            __htmlScript += '</script>';

            var __html= '<SimpleGridControl id="{0}">{1}</SimpleGridControl>';

            return String.format(__html, controlName, __htmlSource + __htmlVelocity + __htmlScript);
        },
        GraphData: function ($controlContent, controlName) {
            var $properties = $controlContent.find('[data-properties]');
            var __graphDataId = $controlContent.find('[data-control="GraphData"]').prop('id') || '';
            var __textId = $controlContent.find('[data-control="Text"]').prop('id') || '';
            var __buttonSearchId = $controlContent.find('[data-control="Button"][data-action="Search"]').prop('id') || '';
            var __buttonCloseId = $controlContent.find('[data-control="Button"][data-action="Close"]').prop('id') || '';
            var __selectId = $controlContent.find('[data-control="Select"]').prop('id') || '';
            var __gridId = $controlContent.find('[data-control="Grid"]').prop('id') || '';

            var __htmlScript = '';
            __htmlScript += '<script type="text/javascript">';
            __htmlScript += '$(function() {\n';
            __htmlScript += 'if(!!"$editmode" && "$editmode" == "true") {\n';
            __htmlScript += '$("#' + __graphDataId + '").show(); \n';
            __htmlScript += '} else { \n';
            __htmlScript += '$("#' + __graphDataId + '").hide(); \n';
            __htmlScript += '}\n';

            __htmlScript += 'var __dataSource = new DataSource({\n';
            __htmlScript += 'columns: [\n';
            __htmlScript += '{property:"requestorName",label:"Requestor",sortable: true,disabled: true,type: "label",},\n';
            __htmlScript += '{property:"requestTime",label:"Request time",sortable: true,disabled: true,type: "datetime",},\n';
            __htmlScript += '{property:"name",label:"Subject",sortable: true,disabled: true,type: "label",},\n';
            __htmlScript += '{label: "",type: "action",width: 32,align: "center",\n';
            __htmlScript += 'buttons: [{text: "Select",icon: "icon-ok",labelCls: "label label-info",\n';
            __htmlScript += 'fn: function (record) {iNet.controls["'+controlName+'"].fireEvent("select", record);}\n';
            __htmlScript += '}]}\n';
            __htmlScript += '],\n';
            __htmlScript += 'delay: 250\n';
            __htmlScript += '});\n';

            __htmlScript += 'iNet.controls["'+controlName+'"] = new iNet.ui.grid.Grid({\n';
            __htmlScript += 'id: "'+__gridId+'",\n';
            __htmlScript += 'url: iNet.getUrl("request/warehouse/query"),\n';
            __htmlScript += 'params: {type: true, keyword: ""},\n';
            __htmlScript += 'convertData: function (data) {\n';
            __htmlScript += 'var __data = data || {};\n';
            __htmlScript += 'iNet.controls["'+controlName+'"].setTotal(__data.total);\n';
            __htmlScript += 'return __data.items || [];},\n';
            __htmlScript += 'dataSource: __dataSource,\n';
            __htmlScript += 'stretchHeight: false,\n';
            __htmlScript += 'editable: false,\n';
            __htmlScript += 'firstLoad: false,\n';
            __htmlScript += 'idProperty: "uuid"\n';
            __htmlScript += '});\n';
            __htmlScript += 'iNet.controls["'+controlName+'"].validate = "'+controlName+'";\n';
            __htmlScript += 'iNet.controls["'+controlName+'"].type="GraphData";\n';

            __htmlScript += 'iNet.controls["'+controlName+'"].selected = function(item){\n';
            __htmlScript += '$("#'+__buttonSearchId+'").parent().removeClass("open");\n';
            __htmlScript += '};\n';

            __htmlScript += '$("#'+__buttonSearchId+'").on("click", function(){\n';
            __htmlScript += '$("#'+__buttonSearchId+'").parent().addClass("open");\n';
            __htmlScript += 'var __params = iNet.controls["'+controlName+'"].getParams() || {};\n';
            __htmlScript += '__params.keyword = $("#'+__textId+'").val();\n';
            __htmlScript += '__params.type = $("#'+__selectId+'").val();\n';
            __htmlScript += 'iNet.controls["'+controlName+'"].setParams(__params);\n';
            __htmlScript += 'iNet.controls["'+controlName+'"].load();\n';
            __htmlScript += '});\n';

            __htmlScript += '$("#'+__buttonCloseId+'").on("click", function(){\n';
            __htmlScript += '$("#'+__buttonCloseId+'").parent().parent().parent().removeClass("open");\n';
            __htmlScript += '});\n';

            __htmlScript += '});';
            __htmlScript += '</script>';

            var __html= '<GraphDataControl id="{0}">{1}</GraphDataControl>';

            return String.format(__html, controlName, __htmlScript);
        },
        Textarea: function ($controlContent, controlName) {
            var $properties = $controlContent.find('[data-properties]');
            var controlId = $controlContent.find('[data-control="Textarea"]').prop('id') || '';
            var __targetId = $('#' + controlId).attr('target-id') || '';
            var __require = $properties.find('[rel="require"]:first').attr('property-value') || '';
            var __errormessage = $properties.find('[rel="errormessage"]:first').attr('property-value') || '*';

            var __htmlScript = '';
            __htmlScript += '<script type="text/javascript">';
            __htmlScript += '$(function() {\n';
            __htmlScript += 'iNet.controls["'+controlName+'"] = $("#'+controlId+'");\n';
            __htmlScript += 'iNet.controls["'+controlName+'"].validate = "'+controlName+'";\n';
            __htmlScript += 'iNet.controls["'+controlName+'"].type="Textarea";\n';

            if (__require == "true"){
                __htmlScript += 'iNet.controls["'+controlName+'"].validate = function(){\n';
                __htmlScript += 'return new iNet.ui.form.Validate({\n';
                __htmlScript += 'id: iNet.findForm($("#'+controlId+'")),\n';
                __htmlScript += 'rules: [\n';
                __htmlScript += '{\n';
                __htmlScript += 'id: "'+controlId+'",\n';
                __htmlScript += 'validate: function (v) {\n';
                __htmlScript += 'if (iNet.isEmpty(v)){\n';
                __htmlScript += ' if (iNet.isEmpty($("#'+controlId+'").attr("value") || "")){\n';
                __htmlScript += '  return "'+__errormessage+'";\n';
                __htmlScript += ' }\n';
                __htmlScript += '}\n';
                __htmlScript += '}\n';
                __htmlScript += '}\n';
                __htmlScript += ']\n';
                __htmlScript += '});\n';
                __htmlScript += '};\n';

                __htmlScript += 'iNet.controls["'+controlName+'"].messageError = "'+__errormessage+'"\n';
            }
            __htmlScript += 'if(!(!!"$editmode" && "$editmode" == "true")) {\n';
            __htmlScript += '$("#'+controlId+'").attr("disabled", "disabled"); \n';
            __htmlScript += '}\n';
            __htmlScript += '});';
            __htmlScript += '</script>';

            var __html= '<TextareaControl id="{0}">{1}</TextareaControl>';

            return String.format(__html, controlName, __htmlScript);
        },
        iNetScript: function ($contentHtml) {
            var __htmlControl = '';
            var __htmlControls = '';

            var __htmlScriptInit = '';
            __htmlScriptInit += '<script type="text/javascript">';
            __htmlScriptInit += '$(function() {\n';
            __htmlScriptInit += 'iNet.sources = {};\n';
            __htmlScriptInit += 'iNet.ajaxs = {};\n';
            __htmlScriptInit += 'iNet.controls = {};\n';

            __htmlScriptInit += 'iNet.findForm = function($el){\n';
            __htmlScriptInit += 'if ($el.get(0).tagName == "FORM") {\n';
            __htmlScriptInit += 'return $el.prop("id");\n';
            __htmlScriptInit += '} else {\n';
            __htmlScriptInit += 'return iNet.findForm($el.parent()); \n';
            __htmlScriptInit += '};\n';
            __htmlScriptInit += '};\n';

            __htmlScriptInit += 'iNet.requestData = {\n';
            __htmlScriptInit += 'messageError: [],\n';
            __htmlScriptInit += 'validate: function(){\n';
            __htmlScriptInit += 'var __validateCheck = true;\n';
            __htmlScriptInit += 'iNet.requestData.messageError=[];\n';
            __htmlScriptInit += 'for (var control in iNet.controls) {\n';
            __htmlScriptInit += 'try {\n';
            __htmlScriptInit += '  if (!iNet.isEmpty(iNet.controls[control])) {\n';
            __htmlScriptInit += '    if (iNet.isFunction(iNet.controls[control].validate)) {\n';
            __htmlScriptInit += '      if (!iNet.controls[control].validate().check()){\n';
            __htmlScriptInit += '      if (iNet.controls[control].type=="File"){\n';
            __htmlScriptInit += '      var $fileContent = iNet.controls[control].parent();\n';
            __htmlScriptInit += '      var dataHardCopy = ($fileContent.find("input[data-hardcopy]").length > 0) ? $fileContent.find("input[data-hardcopy]").val() : "noHardCopy";\n';
            __htmlScriptInit += '      var dataScanner = ($fileContent.find("input[data-scanner]").length > 0) ? $fileContent.find("input[data-scanner]").val() : "noScanner";\n';
            __htmlScriptInit += '      var dataFile = iNet.controls[control].val();\n';
            __htmlScriptInit += '      if (dataHardCopy=="false" && iNet.isEmpty(dataScanner) && iNet.isEmpty(dataFile)){\n';
            __htmlScriptInit += '        iNet.requestData.messageError.push(iNet.controls[control].messageError);\n';
            __htmlScriptInit += '        __validateCheck = false;\n';
            __htmlScriptInit += '      }\n';
            __htmlScriptInit += '      } else {\n';
            __htmlScriptInit += '        iNet.requestData.messageError.push(iNet.controls[control].messageError);\n';
            __htmlScriptInit += '        __validateCheck = false;\n';
            __htmlScriptInit += '      }\n';


            __htmlScriptInit += '      }\n';
            __htmlScriptInit += '      if (iNet.controls[control].type.indexOf("File")>=0 || iNet.controls[control].type.indexOf("SimpleGrid")>=0){\n';
            __htmlScriptInit += '        iNet.controls[control].validateCheck();\n';
            __htmlScriptInit += '      }\n';
            __htmlScriptInit += '    }\n';
            __htmlScriptInit += '  }\n';
            __htmlScriptInit += '} catch(ex) {}\n';
            __htmlScriptInit += '}\n';
            __htmlScriptInit += 'return __validateCheck;\n';
            __htmlScriptInit += '},\n';
            __htmlScriptInit += 'messageValidate: function(){\n';
            __htmlScriptInit += 'return iNet.requestData.validate() ? "" : iNet.requestData.messageError;\n';
            __htmlScriptInit += '}\n';
            __htmlScriptInit += '};\n';

            __htmlScriptInit += 'fnDataEdit = {};\n';
            __htmlScriptInit += '});\n';
            __htmlScriptInit += '</script>';

            $contentHtml.find('[data-control]').each(function () {
                var $control = $(this);
                var $contentControl = $control.find('[data-content][web-content]:first');

                var __control = $control.attr('data-control') || '';
                var __controlName = $control.find('[name]').attr('name') || '';

                if (!iNet.isEmpty(__control) && $contentControl.length > 0) {
                    switch (__control){
                        case "Widget":
                            __htmlControl = PublicService.Widget($control, __controlName);
                            __htmlControls+= __htmlControl + '\n';
                            break;
                        case "Label":
                            __htmlControl = PublicService.Label($control, __controlName);
                            __htmlControls+= __htmlControl + '\n';
                            break;
                        case "Text":
                        case "TextBox":
                            __htmlControl = PublicService.Text($control, __controlName);
                            __htmlControls+= __htmlControl + '\n';
                            if (__control == "TextBox") {
                                __htmlControl = PublicService.Label($control, __controlName + "lbl");
                                __htmlControls+= __htmlControl + '\n';
                            }
                            break;
                        case "Check":
                        case "CheckBox":
                            __htmlControl = PublicService.Check($control, __controlName);
                            __htmlControls+= __htmlControl + '\n';
                            if (__control == "Check") {
                                __htmlControl = PublicService.Label($control, __controlName + "lbl");
                                __htmlControls+= __htmlControl + '\n';
                            }
                            break;
                        case "Number":
                        case "NumberBox":
                            __htmlControl = PublicService.Number($control, __controlName);
                            __htmlControls+= __htmlControl + '\n';
                            if (__control == "NumberBox") {
                                __htmlControl = PublicService.Label($control, __controlName + "lbl");
                                __htmlControls+= __htmlControl + '\n';
                            }
                            break;
                        case "Textarea":
                        case "TextareaBox":
                            __htmlControl = PublicService.Textarea($control, __controlName);
                            __htmlControls+= __htmlControl + '\n';
                            if (__control == "TextBox") {
                                __htmlControl = PublicService.Label($control, __controlName + "lbl");
                                __htmlControls+= __htmlControl + '\n';
                            }
                            break;
                        case "Date":
                        case "DateBox":
                            __htmlControl = PublicService.Date($control, __controlName);
                            __htmlControls+= __htmlControl + '\n';
                            if (__control == "TextBox") {
                                __htmlControl = PublicService.Label($control, __controlName + "lbl");
                                __htmlControls+= __htmlControl + '\n';
                            }
                            break;
                        case "File":
                        case "FileBox":
                            __htmlControl = PublicService.File($control, __controlName);
                            __htmlControls+= __htmlControl + '\n';
                            if (__control == "TextBox") {
                                __htmlControl = PublicService.Label($control, __controlName + "lbl");
                                __htmlControls+= __htmlControl + '\n';
                            }
                            break;
                        case "Select":
                        case "SelectBox":
                            __htmlControl = PublicService.Select($control, __controlName);
                            __htmlControls+= __htmlControl + '\n';
                            if (__control == "TextBox") {
                                __htmlControl = PublicService.Label($control, __controlName + "lbl");
                                __htmlControls+= __htmlControl + '\n';
                            }
                            break;
                        case "SimpleGrid":
                            __htmlControl = PublicService.SimpleGrid($control, __controlName);
                            __htmlControls += __htmlControl + '\n';
                            break;
                        case "GraphData":
                            __htmlControl = PublicService.GraphData($control, __controlName);
                            __htmlControls += __htmlControl + '\n';
                            break;
                    }
                }
            });


            var __htmlScriptCustom = '';
            var __jsContent = $contentHtml.find('[page-javascript-web-content]').text();
            if (!iNet.isEmpty(__jsContent)){
                var __jsHtml = '<script type="text/javascript">\n{0}</script>';
                var __jsPage = '$(function(){\niNet.pageScript = function(){\n{0}\n};\n});';
                __jsContent = __jsContent.replace(/;/gi,';\n');
                __jsContent = __jsContent.replace(/var/gi,'\nvar');
                __jsContent = String.format(__jsPage, __jsContent);
                __htmlScriptCustom = String.format(__jsHtml, __jsContent);
            }

            return String.format('<iNetControls>{0}{1}{2}</iNetControls>', __htmlScriptInit, __htmlControls, __htmlScriptCustom);
        },
        PageScript: function($contentHtml, contentData){
            console.log(">>> call function PageScript >>>");
            var __init = false;

            setTimeout(function () {
                if (!__init) {
                    console.log(">>> iNet.pageScript >>>");
                    if (iNet.isFunction(iNet.pageScript)){
                        iNet.pageScript();
                        __init = true;
                    }
                }
            }, 2000);

            $($contentHtml).on('loaded', function(){
                console.log(">>> content html loaded  >>> ");

            });
        },
        /*
         * Author hanhld@inetcloud.vn
         */
      MobileScript: function ($contentHtml) {
//        var script = '<script>(function(){\n var _ = {}, control;',
//            mapProperties = {};
//        try{
//          mapProperties = JSON.parse($contentHtml.find('[type="text/properties"]').html());
//        }catch (e){}
//        $contentHtml.find('[data-control]').each(function () {
//          var control = this.getAttribute('data-control').toLowerCase(),
//              name = this.getAttribute('name');
//          if(!name){
//            return;
//          }
//          script += '\n';
//          switch (control){
//            case 'date':
//              script += '_["' + name + '"] = new eNet.controls.Date({' +
//                  '$element: $("#' + this.id + '")' +
//                  '});';
//              break;
//            case 'select':
//              var properties = mapProperties[name];
//              if(properties){
//                script += 'control = new eNet.controls.Select({' +
//                    '$element:  $("#' + this.id + '"),' +
//                    'keyName: "' + properties.displayvalue + '",' +
//                    'keyValue: "' + properties.keyvalue + '"' +
//                    '});';
//                if (properties.service) {
//                  script += '$.getJSON(iNet.getUrl("' + properties.service + '"), function (data) {' +
//                      'if (iNet.isArray(data)) {' +
//                      'control.setData(data);' +
//                      'control.render();' +
//                      '} else if (iNet.isObject(data)) {' +
//                      'for (var k in data) {' +
//                      'var item = data[k];' +
//                      'if (iNet.isArray(item)) {' +
//                      'control.setData(item);' +
//                      'control.render();' +
//                      'break;' +
//                      '}' +
//                      '}' +
//                      '}' +
//                      '});';
//                } else if (properties.sourcevalue) {
//                  try{
//                    script +=
//                        'control.setData(' + JSON.stringify(eval(properties.sourcevalue))  + ');' +
//                        'control.render();';
//                  }catch (e){}
//                }
//                script += '_["' + name + '"] = control;';
//              }
//              break;
//            case 'label':
//              script += 'control = $("#' + this.id + '");' +
//                  'control.setValue = function(val){this.html(val)};' +
//                  'control.getValue = function(){return this.html()};' +
//                  '_["' + name + '"] = control;';
//              break;
//            case 'widget':
//              // Load widget
//              this.setAttribute('name', 'widget');
//              this.setAttribute('widget', mapProperties[name].widget);
////              case 'text':
////              case 'textarea':
////              case 'number':
////              case 'check':
//            default :
//              script += 'control = $("#' + this.id + '");' +
//                  'control.setValue = function(val){this.val(val)};' +
//                  'control.getValue = function(){return this.val()};' +
//                  '_["' + name + '"] = control;';
//          }
//        });
//
//        var $scriptContainer = $contentHtml.find('[page-javascript-mobile-content]');
//        // Render javascript container
//        script += '\n' + $scriptContainer.html();
//        script += '\n})()</script>';
//        $scriptContainer.remove();
//        return $contentHtml.html() + script;

        var $scriptContainer = $contentHtml.find('[page-javascript-mobile-content]'),
            script = String.format('<script>{0}</script>', $scriptContainer.html()),
            widget = $contentHtml.find('[data-control="Widget"]'),
            mapProperties = {};
        // widget will auto render in server side
        // So that need change properties
        if(widget.length > 0){
          try{
            mapProperties = JSON.parse($contentHtml.find('[type="text/properties"]').html());
          }catch (e){}
          widget.each(function () {
            this.setAttribute('widget', mapProperties[this.getAttribute('name')].widget);
            this.setAttribute('name', 'widget');
          });
        }
        $scriptContainer.remove();
        return $contentHtml.html() + script;
      }
    };

    RenderService = {
        generateName: function(){
            var __argChar = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','x','y','z'];
            return __argChar[Math.floor(Math.random() * 26) + 1] + iNet.generateId();
        },
        DesignData: function($design){
            $design.find('[data-control]').each(function(){
                var $designControl = $(this);
                var __designControlType = $designControl.attr('data-control') || '';

                if (!iNet.isEmpty(__designControlType)){
                    if (iNet.isEmpty($designControl.prop('id'))) {
                        var __designControlName = RenderService.generateName();
                        var __designControlId = __designControlType + '-design-' + __designControlName;
                        $designControl.prop('id', __designControlId);
                        $designControl.attr('name', __designControlName);

                        //Render interface by type control
                        switch (__designControlType){
                            case "Select": BuilderService.CreateSelect($designControl, __designControlId); break;
                            //case "Date": BuilderService.CreateDate($designControl, __designControlId); break;
                            case "Grid": BuilderService.CreateGrid($designControl, __designControlId); break;
                            //case "File": BuilderService.CreateFile($designControl, __designControlId); break;
                        }
                    } else {
                        var __designControlId = $designControl.prop('id') || '';
                    }
                }
            });
        },
        DesignContent: function($content){
            $content.find('[data-control]').each(function(){
                var $contentControl = $(this);
                var __contentControl = $contentControl.attr('data-control') || '';

                if (iNet.isEmpty($contentControl.prop('id')) && !iNet.isEmpty(__contentControl)) {
                    var __contentControlName = RenderService.generateName();
                    $contentControl.prop('id', __contentControl + '-content-' + __contentControlName);
                    $contentControl.parent().parent().parent().find('[rel="name"]').attr('property-value', __contentControlName);
                    $contentControl.parent().parent().parent().find('[name]').attr('name', __contentControlName);
                }
            });
        }
    };
});
