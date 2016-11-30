/**
 * 
 */
iNet.ui.common.Uploader = function(config){
	this.id = 0;
	this._options = {
	    // set to true to see the server response
	    action: '/server/upload',
	    params: {},
	    name: "FileUpload",
	    element: {},
	    multiple: true,
	    // validation        
	    allowedExtensions: [],               
	    sizeLimit: 0,   
	    minSizeLimit: 0,                             
	    // events
	    // return false to cancel submit
	    onSubmit: function(id, fileName){},
	    onProgress: function(id, fileName, loaded, total){},
	    onComplete: function(id, fileName, responseJSON){},
	    onCancel: function(id, fileName){},
	    debug: false,
	    // messages                
	    messages: {
	        typeError: "{file} has invalid extension. Only {extensions} are allowed.",
	        sizeError: "{file} is too large, maximum file size is {sizeLimit}.",
	        minSizeError: "{file} is too small, minimum file size is {minSizeLimit}.",
	        emptyError: "{file} is empty, please select files again without it.",
	        onLeave: "The files are being uploaded, if you leave now the upload will be cancelled."            
	    },
	    showMessage: function(message){
	        alert(message);
	    }               
  };
  iNet.apply(this._options, config);
  this._input = this._createInput();
  
  var self = this;
  this._input.change(function(){
  	if(self._validateFile(this)){
  		self._upload();
  	}
  });
};
iNet.apply(iNet.ui.common.Uploader.prototype, {
  _createInput : function(){
  	var input = $('<input/>').attr('type', 'file')
  				.attr('name', 'someName')
  				.attr('style', 'display:none')
  				.attr('name', this._options.name);
        
    if (this._options.multiple){
        input.attr('multiple', 'multiple');
    }
    
    this._options.element.append(input);
    
    return input;
  },
  
  _validateFile: function(file){
    var name, size;
    
    if (file.value){
        // it is a file input            
        // get input value and remove path to normalize
        name = file.value.replace(/.*(\/|\\)/, "");
    } else {
        // fix missing properties in Safari
        name = file.fileName != null ? file.fileName : file.name;
        size = file.fileSize != null ? file.fileSize : file.size;
    }
                
    if (! this._isAllowedExtension(name)){            
        this._error('typeError', name);
        return false;
        
    } else if (size === 0){            
        this._error('emptyError', name);
        return false;
                                                 
    } else if (size && this._options.sizeLimit && size > this._options.sizeLimit){            
        this._error('sizeError', name);
        return false;
                    
    } else if (size && size < this._options.minSizeLimit){
        this._error('minSizeError', name);
        return false;            
    }
    
    return true;                
  },
  
  _isAllowedExtension: function(fileName){
    var ext = (-1 !== fileName.indexOf('.')) ? fileName.replace(/.*[.]/, '').toLowerCase() : '';
    var allowed = this._options.allowedExtensions;
    
    if (!allowed.length){return true;}        
    
    for (var i=0; i<allowed.length; i++){
        if (allowed[i].toLowerCase() == ext){ return true;}    
    }
    
    return false;
  },
  
  _error: function(code, fileName){
    var message = this._options.messages[code];        
    function r(name, replacement){ 
    	message = message.replace(name, replacement);
    }
    
    r('{file}', this._formatFileName(fileName));        
    r('{extensions}', this._options.allowedExtensions.join(', '));
    r('{sizeLimit}', this._formatSize(this._options.sizeLimit));
    r('{minSizeLimit}', this._formatSize(this._options.minSizeLimit));
    
    this._options.showMessage(message);                
  },
  
  _formatSize: function(bytes){
    var i = -1;                                    
    do {
        bytes = bytes / 1024;
        i++;  
    } while (bytes > 99);
    
    return Math.max(bytes, 0.1).toFixed(1) + ['kB', 'MB', 'GB', 'TB', 'PB', 'EB'][i];          
  },
  
  _formatFileName: function(name){
    if (name.length > 33){
        name = name.slice(0, 19) + '...' + name.slice(-13);    
    }
    return name;
  },
  
  _upload: function(){
    var id = this.id + 1;
    var iframe = this._createIframe(id);
    var form = this._createForm(iframe, this._options.params);
    form.append(this._input);
    var self = this;
    iframe = document.getElementById(id);
    var fileName = this.getName();
    this._attachLoadEvent(iframe, function(){                                 
		self.log('iframe loaded');
	    
	    var response = self._getIframeContentJSON(iframe);
	
	    self._options.onComplete(id, fileName, response);
	    
	    //delete self._inputs[id];
	    // timeout added to fix busy state in FF3.6
	    setTimeout(function(){
	        $(iframe).remove();
	    }, 1);
    });

    form.submit();
    
    //form.remove();        
    //iframe.remove();
    return id;
  },
  
   _createIframe: function(id){
    // We can't use following code as the name attribute
    // won't be properly registered in IE6, and new window
    // on form submit will open
    // var iframe = document.createElement('iframe');
    // iframe.setAttribute('name', id);

    var iframe = $('<iframe src="javascript:false;" name="' + id + '" />');
    // src="javascript:false;" removes ie6 prompt on https

    iframe.attr('id', id);
    iframe.attr('style', 'display:none;');
    iframe.appendTo($('body'));

    return iframe;
  },
  
  _createForm: function(iframe, params){
    // We can't use the following code in IE6
    // var form = document.createElement('form');
    // form.setAttribute('method', 'post');
    // form.setAttribute('enctype', 'multipart/form-data');
    // Because in this case file won't be attached to request
    var form =  $('<form method="POST" enctype="multipart/form-data"></form>');
    var paramsObj = params;
	if(typeof params.fn == 'function'){
		paramsObj = params.fn.call();
	}
	
    //var queryString = qq.obj2url(paramsObj, this._options.action);
	for(var i in paramsObj){
		form.append('<input type="hidden" name="'+ i +'" value="' + paramsObj[i] +  '" />');
	}
	form.attr('action', this._options.action);
    form.attr('target', iframe.attr('name'));
    form.attr('style', 'display:none;');
    form.appendTo($('body'));
    return form;
  },
  
  _attach : function(element, type, fn){
    if (element.addEventListener){
        element.addEventListener(type, fn, false);
    } else if (element.attachEvent){
        element.attachEvent('on' + type, fn);
    }
  },
  
  _attachLoadEvent: function(iframe, callback){
    this._attach(iframe, 'load', function(){
        // when we remove iframe from dom
        // the request stops, but in IE load
        // event fires
        if (!iframe.parentNode){
            return;
        }

        // fixing Opera 10.53
        if (iframe.contentDocument &&
            iframe.contentDocument.body &&
            iframe.contentDocument.body.innerHTML == "false"){
            // In Opera event is fired second time
            // when body.innerHTML changed from false
            // to server response approx. after 1 sec
            // when we upload file with iframe
            return;
        }

        callback();
    });
  },
  
  _getIframeContentJSON: function(iframe){
    // iframe.contentWindow.document - for IE<7
    var doc = iframe.contentDocument ? iframe.contentDocument: iframe.contentWindow.document,
        response;
    
    this.log("converting iframe's innerHTML to JSON");
    this.log("innerHTML = " + doc.body.innerHTML);
                    
    try {
        response = eval("(" + $(doc.body.innerHTML).html() + ")");
    } catch(err){
        response = {};
    }        
    return response;
  },
  
  //====================Public function=======================//
  getName: function(){
  	// get input value and remove path to normalize
	return this._input.val().replace(/.*(\/|\\)/, "");  
  },
  
  upload: function(){
  	this._input.click();
  },
  
  log: function(msg){
  	if((this._options.debug === true) && window.console){
  		console.log(msg);
  	}
  },
  
  setParams: function(params){
  	this._options.params = params;
  }
});