/**
 * @author thoangtd@inetcloud.vn
 * Button Component
 * iBook product
 * 2013-03-12 10:23:00z
 */

/**
 * Syntax
 * attribute [{name:'', value:''}]
 */
iNet.ui.common.Button = function(config) {
   config = config || {};
   this.prefix = (config.prefix) ? config.prefix : config.id;
   iNet.apply(this, config);//apply configuration
   this.prefix = (this.prefix) ? (this.prefix + '-') : '';
   
   //DEFINE BUTTON
   // save button
   // ~ properties =================================================================
   this.SAVE = {
       id: this.prefix + iNet.generateId(),
       cls:'btn btn-primary',
       icon: 'icon-ok icon-white fix-ico',
       text:'Save',
       attr :[],
       fn : iNet.emptyFn
   };
   
   this.UPDATE = {
       id: this.prefix + iNet.generateId(),
       cls:'btn btn-primary',
       icon: 'icon-ok icon-white fix-ico',
       text:'Update',
       attr :[],
       fn : iNet.emptyFn
   };
   
   this.REPEAT = {
       id: this.prefix + iNet.generateId(),
       cls:'btn',
       icon: 'icon-repeat',
       text:'Repeat',
       attr :[],
       fn : iNet.emptyFn
   };
   
   this.OK = {
       id: this.prefix + iNet.generateId(),
       cls:'btn btn-primary',
       icon: 'icon-ok icon-white fix-ico',
       text:'Ok',
       attr :[],
       fn : iNet.emptyFn
   };
   
   this.CANCEL = {
       id: this.prefix + iNet.generateId(),
       cls:'btn',
       icon: 'icon-ban-circle',
       text:'Cancel',
       attr :[],
       fn : iNet.emptyFn
   };
   
   this.REFESH = {
       id: this.prefix + iNet.generateId(),
       cls:'btn btn-success',
       icon: 'icon-refresh icon-white',
       text:'Refresh',
       attr :[],
       fn : iNet.emptyFn
   };
   
};

iNet.ui.common.Button.prototype = {
		setCls : function(element, cls) {
				element.cls = cls || '';
		  	$(String.format("#{0}", element.id)).addClass(cls || '');
	   },
	   getCls : function(element) {
	   	return element.cls;
	    },
	   removeCls : function(element, cls) {
	  	 if(!iNet.isEmpty(cls)) {
	  		 $(String.format("#{0}", element.id)).removeClass(cls);
	  	 } else {
	  		 $(String.format("#{0}", element.id)).removeClass();
	  	 }
	   },
	   
	   //~ Icon ----------------------
	   setIcon : function(element, icon) {
	  	 element.icon = icon;
	  	 $(String.format("#{0}>span", element.id)).addClass(icon || '');
	   },
	   getIcon : function(element, icon) {
	  	 return $(String.format("#{0}>span", element.id)).attr('class');
	   },
	   removeIcon : function(element, icon) {
	  	 if(iNet.isEmpty(icon)) {
	  		 $(String.format("#{0}>span", element.id)).removeClass(cls || '');
	  	 } else {
	  		 $(String.format("#{0}>span", element.id)).removeClass();
	  	 }
	   },
	   
	   //~ Text ----------------------
	   setText : function(element, text) {
	  	 element.text = text || "";
	  	 $(String.format("#{0}", element.id)).text(text || '');
	   },
	   removeText : function(element) {
	  	 element.text = text || "";
	  	 $(String.format("#{0}", element.id)).text('');
	   },
	   getText : function(element) {
	  	return element.text;
	   },

	   //~ Attribute ----------------------
	   putAttr : function(element, attr) {
	  	 this.element.attr.push(attr || {});
	  	 $(String.format("#{0}", this.element.id)).attr(attr.name, attr.value);
	   },
	   
	   getAttr : function(element, name) {
	  	 if(!iNet.isEmpty(element.attr)) {
	  		 for(var i = 0 ; i < element.attr; i ++) {
	  			 if(element.attr[i].name == name) 
	  				 return element.attr[i].value;
	  		 }
	  	 }
	  	 return '';
	   },
	   pullAttr : function(element, name) {
	  	 var k = -1;
	  	 if(!iNet.isEmpty(element.attr)) {
	  		 for(var i = 0 ; i < element.attr; i ++) {
	  			 if(element.attr[i].name == name) {
	  				k = i;
	  				break;
	  			 }
	  		 }
	  	 }
	  	 if(k>-1) {
	  		 element.attr.splice(k,1);
	  	 }
	   },
	   
	   //~ fn --------------------------------
	   setFn : function(element, func){
	  	var fn = iNet.isFunction(func) ? func : iNet.emptyFn;
	  	element.fn = fn;
	  	$(String.format("#{0}", element)).off('click').on('click', fn);
	   },
	   removeFn : function(element) {
	  	 element.fn = iNet.emptyFn;
	   	 $(String.format("#{0}", element)).off('click');
	   },
	   getFn : function(element) {
	  	 return element.fn || iNet.emptyFn;
	   },
	   hide : function(element){
	  	 $(String.format("#{0}",element)).hide();
	   },
	   show : function(element){
	  	 $(String.format("#{0}",element)).show();
	   },
	   diabled : function(element){
	  	 $(String.format("#{0}",element)).attr('disabled','disabled');
	   },
	   enabled : function(element) {
	  	 $(String.format("#{0}",element)).removeAttr('disabled');
	   }
	   
};