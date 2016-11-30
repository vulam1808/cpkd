/*--------------------------------------------
|         C O N S T R U C T O R S           |
============================================*/
/**
 * Define the iNet instance.
 */
window.undefined = window.undefined;// for old browsers
/**
 * @class iNet core utilities and functions.
 * @singleton
 */
iNet = {
    /**
     * The version of the framework
     *
     * @type String
     */
    version: '4.3.0 RELEASE',
    /**
     * The date release the framework
     */
    build_date: '04/03/2013'
};

/*--------------------------------------------
|               M E T H O D S               |
============================================*/
/**
 * Copies all the properties of config to obj.
 * 
 * @param {Object} obj The receiver of the properties
 * @param {Object} config The source of the properties
 * @param {Object} defaults A different object that will also be applied for default values
 * @return {Object} returns obj
 * @member iNet apply
 */
iNet.apply = function(o, c, defaults){
    // no "this" reference for friendly out of scope calls
    if(defaults){
        iNet.apply(o, defaults);
    }
    if(o && c && typeof c == 'object'){
        for(var p in c){
            o[p] = c[p];
        }
    }
    return o;
};
(function(){
    var ua = navigator.userAgent.toLowerCase(), toString = Object.prototype.toString,
        check = function(r){
          return r.test(ua);
        },
        DOC = document,
        isStrict = DOC.compatMode == "CSS1Compat",
        docMode = document.documentMode,
        isOpera = check(/opera/),
        isChrome = check(/chrome/),
        isWebKit = check(/webkit/),
        isSafari = !isChrome && check(/safari/),
        isSafari2 = isSafari && check(/applewebkit\/4/), // unique to Safari 2
        isSafari3 = isSafari && check(/version\/3/),
        isSafari4 = isSafari && check(/version\/4/),
        isIE = !isOpera && check(/msie/),
        isIE7 = isIE && (check(/msie 7/) || docMode == 7),
        isIE8 = isIE && (check(/msie 8/) && docMode != 7 && docMode != 9 && docMode != 10 || docMode == 8),
        isIE9 = isIE && (check(/msie 9/) && docMode != 7 && docMode != 8 && docMode != 10 || docMode == 9),
        isIE10 = isIE && (check(/msie 10/) && docMode != 7 && docMode != 8 && docMode != 9 || docMode == 10),
        isIE6 = isIE && !isIE7 && !isIE8 && !isIE9 && !isIE10,
        isSupport = (isIE && (docMode && !(docMode >= 7))) || !isIE,
        isGecko = !isWebKit && check(/gecko/),
        isGecko2 = isGecko && check(/rv:1\.8/),
        isGecko3 = isGecko && check(/rv:1\.9/),
        isGecko4 = isGecko && check(/rv:2\.0/),
        isBorderBox = isIE && !isStrict,
        isWindows = check(/windows|win32/),
        isMac = check(/macintosh|mac os x/),
        isAir = check(/adobeair/),
        isLinux = check(/linux/),
        isSecure = /^https/i.test(window.location.protocol);
    iNet.apply(iNet,{
         /**
         * Returns true if the passed object is a JavaScript Function, otherwise false.
         * @param {Object} object The object to test
         * @return {Boolean}
         */
        isFunction : function(v){
            return toString.apply(v) === '[object Function]';
        },
        /**
         * Returns the current context path.
         *
         * @return {String}
         */
        getContextPath: function(){
            var pathname = window.location.pathname;
            if (pathname == '/') {
                return '/';
            }
            
            var position = pathname.indexOf('/', 1);
            if (position == 0) {
                position = pathname.length;
            }
            return pathname.substr(0, position);
        },
        
        /**
         * Returns the full url from the given relative path.
         *
         * @param the given relative path.
         */
        getUrl: function(relativePath){
            var url = window.location.protocol + '//';
            url += window.location.hostname;
            
            if (isSecure && window.location.port != 443) {
                url += ':' + window.location.port;
            }
            else 
                if (!isSecure && window.location.port != 80) {
                    url += ':' + window.location.port;
                }
            
            // append the context path.
            pathname = window.location.pathname;
            if (pathname.length > 1) {
                var position = pathname.indexOf('/', 1);
                if (position == 0) 
                    position = pathname.length;
                url += pathname.substr(0, position);
            }
            var prefix = iNet.prefix || ibook;
            var extension = iNet.extension || '.cpx';
            if (relativePath.indexOf('/') == 0) {
                return url + '/' + prefix + relativePath + extension;
            }
            else {
                return url + '/' + prefix + '/'+relativePath+ extension;
            }
        },
        /**
         * Clone object
         * @param {Object} obj
         */
        clone: function(obj) {
          if (null == obj || "object" != typeof obj) {
            return obj;
          }
          var copy = obj.constructor();
          for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) {
              copy[attr] = obj[attr];
            }
          }
          return copy;
        },
        /**
         * Returns true if the passed object is a JavaScript Object, otherwise false.
         *
         * @param {Object} object The object to test
         * @return {Boolean}
         */
        isObject: function(v){
            return v && typeof v == "object";
        },
        /**
         * Returns true if the passed object is a string.
         *
         * @param {Object} v The object to test
         * @return {Boolean}
         */
        isString: function(v){
            return typeof v === 'string';
        },
        /**
         * Returns true if the passed object is a number. Returns false for
         * non-finite numbers.
         * 
         * @param {Object}
         *          v The object to test
         * @return {Boolean}
         */
        isNumber: function(v){
            return typeof v === 'number' && isFinite(v);
        },
        
        /**
         * Returns true if the passed object is a boolean.
         *
         * @param {Object} v The object to test
         * @return {Boolean}
         */
        isBoolean: function(v){
            return typeof v === 'boolean';
        },
        /**
         * Returns true if the passed object is a JavaScript array, otherwise false.
         *
         * @param {Object} object The object to test
         * @return {Boolean}
         */
        isArray: function(v){
            return toString.apply(v) === '[object Array]';
        },
        
        /**
         * Returns true if the passed object is not undefined.
         *
         * @param {Object} v The object to test
         * @return {Boolean}
         */
        isDefined: function(v){
            return typeof v !== 'undefined';
        },
        /**
         * Returns true if the passed value is empty. The value is deemed to be
         * empty if it is * null * undefined * an empty array * a zero length
         * string (Unless the allowBlank parameter is true)
         * 
         * @param {Mixed}
         *          value The value to test
         * @param {Boolean}
         *          allowBlank (optional) true to allow empty strings (defaults
         *          to false)
         * @return {Boolean}
         */
        isEmpty: function(v, allowBlank){
            return v === null || v === undefined || ((iNet.isArray(v) && !v.length)) || (!allowBlank ? v === '' : false);
        },
        /**
         * Returns true if the passed object is a email.
         *
         * @param {Object}
         *          v The object to test
         * @return {Boolean}
         */
        isEmail: function(v){
            return /^([a-zA-Z\u00E2\u00EA\u00F4\u0103\u01A1\u01B0\u00E1\u00E0\u1EA3\u00E3\u1EA1\u1EA5\u1EA7\u1EA9\u1EAB\u1EAD\u00E9\u00E8\u1EBB\u1EBD\u1EB9\u1EBF\u1EC1\u1EC3\u1EC5\u1EC7\u00F3\u00F2\u1ECF\u00F5\u1ECD\u1ED1\u1ED3\u1ED5\u1ED7\u1ED9\u1EDB\u1EDD\u1EDF\u1EE1\u1EE3\u1EE9\u1EEB\u1EED\u1EEF\u1EF1\u00ED\u00EC\u1EC9\u0129\u1ECB\u00FD\u1EF3\u1EF7\u1EF9\u1EF50-9])+([\.a-zA-Z\u00E2\u00EA\u00F4\u0103\u01A1\u01B0\u00E1\u00E0\u1EA3\u00E3\u1EA1\u1EA5\u1EA7\u1EA9\u1EAB\u1EAD\u00E9\u00E8\u1EBB\u1EBD\u1EB9\u1EBF\u1EC1\u1EC3\u1EC5\u1EC7\u00F3\u00F2\u1ECF\u00F5\u1ECD\u1ED1\u1ED3\u1ED5\u1ED7\u1ED9\u1EDB\u1EDD\u1EDF\u1EE1\u1EE3\u1EE9\u1EEB\u1EED\u1EEF\u1EF1\u00ED\u00EC\u1EC9\u0129\u1ECB\u00FD\u1EF3\u1EF7\u1EF9\u1EF50-9_-])*@([a-zA-Z\u00E2\u00EA\u00F4\u0103\u01A1\u01B0\u00E1\u00E0\u1EA3\u00E3\u1EA1\u1EA5\u1EA7\u1EA9\u1EAB\u1EAD\u00E9\u00E8\u1EBB\u1EBD\u1EB9\u1EBF\u1EC1\u1EC3\u1EC5\u1EC7\u00F3\u00F2\u1ECF\u00F5\u1ECD\u1ED1\u1ED3\u1ED5\u1ED7\u1ED9\u1EDB\u1EDD\u1EDF\u1EE1\u1EE3\u1EE9\u1EEB\u1EED\u1EEF\u1EF1\u00ED\u00EC\u1EC9\u0129\u1ECB\u00FD\u1EF3\u1EF7\u1EF9\u1EF50-9])+(\.[a-zA-Z\u00E2\u00EA\u00F4\u0103\u01A1\u01B0\u00E1\u00E0\u1EA3\u00E3\u1EA1\u1EA5\u1EA7\u1EA9\u1EAB\u1EAD\u00E9\u00E8\u1EBB\u1EBD\u1EB9\u1EBF\u1EC1\u1EC3\u1EC5\u1EC7\u00F3\u00F2\u1ECF\u00F5\u1ECD\u1ED1\u1ED3\u1ED5\u1ED7\u1ED9\u1EDB\u1EDD\u1EDF\u1EE1\u1EE3\u1EE9\u1EEB\u1EED\u1EEF\u1EF1\u00ED\u00EC\u1EC9\u0129\u1ECB\u00FD\u1EF3\u1EF7\u1EF9\u1EF50-9_-]+)+$/.test(v);
        },
        /**
         * True if the detected browser is Opera.
         *
         * @type Boolean
         */
        isOpera: isOpera,
        /**
         * True if the detected browser uses WebKit.
         *
         * @type Boolean
         */
        isWebKit: isWebKit,
        /**
         * True if the detected browser is Chrome.
         *
         * @type Boolean
         */
        isChrome: isChrome,
        /**
         * True if the detected browser is Safari.
         *
         * @type Boolean
         */
        isSafari: isSafari,
        /**
         * True if the detected browser is Safari 3.x.
         *
         * @type Boolean
         */
        isSafari3: isSafari3,
        /**
         * True if the detected browser is Safari 4.x.
         *
         * @type Boolean
         */
        isSafari4: isSafari4,
        /**
         * True if the detected browser is Safari 2.x.
         *
         * @type Boolean
         */
        isSafari2: isSafari2,
        /**
         * True if the detected browser is Internet Explorer.
         *
         * @type Boolean
         */
        isIE: isIE,
        /**
         * True if the detected browser is Internet Explorer 6.x.
         *
         * @type Boolean
         */
        isIE6: isIE6,
        /**
         * True if the detected browser is Internet Explorer 7.x.
         *
         * @type Boolean
         */
        isIE7: isIE7,
        /**
         * True if the detected browser is Internet Explorer 8.x.
         *
         * @type Boolean
         */
        isIE8: isIE8,
        /**
         * True if the detected browser is Internet Explorer 9.x.
         *
         * @type Boolean
         */
        isIE9: isIE9,
        /**
         * True if the detected browser is Internet Explorer 10.x.
         *
         * @type Boolean
         */
        isIE10: isIE10,
        /**
         * True if the detected browser uses the Gecko layout engine (e.g. Mozilla,
         * Firefox).
         *
         * @type Boolean
         */
        isGecko: isGecko,
        /**
         * True if the detected browser uses a pre-Gecko 1.9 layout engine (e.g.
         * Firefox 2.x).
         *
         * @type Boolean
         */
        isGecko2: isGecko2,
        /**
         * True if the detected browser uses a Gecko 1.9+ layout engine (e.g.
         * Firefox 3.x).
         *
         * @type Boolean
         */
        isGecko3: isGecko3,
        /**
         * True if the detected browser is Internet Explorer running in non-strict
         * mode.
         *
         * @type Boolean
         */
        isBorderBox: isBorderBox,
        /**
         * True if the detected platform is Linux.
         *
         * @type Boolean
         */
        isLinux: isLinux,
        /**
         * True if the detected platform is Windows.
         *
         * @type Boolean
         */
        isWindows: isWindows,
        /**
         * True if the detected platform is Mac OS.
         *
         * @type Boolean
         */
        isMac: isMac,
        /**
         * True if the detected platform is Adobe Air.
         *
         * @type Boolean
         */
        isAir: isAir,
        /**
         * True if the detected browser is Support.
         *
         * @type Boolean
         */
        isSupport: isSupport,
        /**
         * Converts any iterable (numeric indices and a length property) into a
         * true array Don't use this on strings. IE doesn't support "abc"[0]
         * which this implementation depends on. For strings, use this instead:
         * "abc".match(/./g) => [a,b,c];
         * 
         * @param {Iterable}
         *          the iterable object to be turned into a true Array.
         * @return (Array) array
         */
        toArray: function(){
            return isIE ? function(a, i, j, res){
                res = [];
                iNet.each(a, function(v){
                    res.push(v);
                });
                return res.slice(i || 0, j || res.length);
            }: function(a, i, j){
                return Array.prototype.slice.call(a, i || 0, j || a.length);
            };
        }(),
        /**
         * Copies all the properties of config to obj if they don't already
         * exist.
         * 
         * @param {Object}
         *          obj The receiver of the properties
         * @param {Object}
         *          config The source of the properties
         * @return {Object} returns obj
         */
        applyIf: function(o, c){
            if (o) {
                for (var p in c) {
                    if (iNet.isEmpty(o[p])) {
                        o[p] = c[p];
                    }
                }
            }
            return o;
        },
        /**
         * function with each item
         * 
         * @param {Object}
         *          array
         * @param {Object}
         *          fn
         * @param {Object}
         *          scope
         */
        each: function(array, fn, scope){
            if (iNet.isEmpty(array, true)) {
                return;
            }
            for (var i = 0, len = array.length; i < len; i++) {
                if (fn.call(scope || array[i], array[i], i, array) === false) {
                    return i;
                }
            }
        },
        /**
         * @param {String}
         *          namespace1
         * @param {String}
         *          namespace2
         * @param {String}
         *          etc
         * @method namespace
         */
        namespace: function(){
            var o, d;
            iNet.each(arguments, function(v){
                d = v.split(".");
                o = window[d[0]] = window[d[0]] || {};
                iNet.each(d.slice(1), function(v2){
                    o = o[v2] = o[v2] || {};
                });
            });
            return o;
        },
        /**
         * Get parameter from URL
         * 
         * @param {Object}
         *          name
         */
        getParam: function (name){
            name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
            var regexS = "[\\?&]" + name + "=([^&#]*)";
            var regex = new RegExp(regexS);
            var results = regex.exec(window.location.href);
            if (!results) {
                return "";
            }
            else {
                return results[1];
            }
        },
        /**
         * Parser html
         * 
         * @param {String}
         *          the given value
         * @return {String} The html
         */
        parserHtml: function(v){
            if (v === undefined || v === null || v.length === undefined) {
                return '';
            }
            v.replace(/</g, "&lt;");
            v.replace(/>/g, "&gt;");
            v.replace(/\n/g, '<br />');
            return v;
        },
        /**
         * generate the identifier.
         */
        generateId: function(){
            // get the date.
            var __date = new Date();
            // get the random number.
            var __number = Math.floor(Math.random() * 1000);
            // return the number.
            return (__date.getTime() + __number);
        },
        /**
         * Generate the identifier as alphabet.
         */
        alphaGenerateId: function(){
            var __id = '';
            var __alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
            var len = __alphabet.length;
            for (var index = 0; index < len; index++) {
                __id += __alphabet.charAt(Math.floor(Math.random() * len));
            }
            // return the identifier 24 character
            return __id.substr(len - 24);
        },
        /**
         * Get system date
         * return {Long} -the given time value
         */
        getDate: function(time) {
          var __time = time || new Date().getTime();
          try {
            return (new Date(__time).format('d/m/Y')).toDate().getTime();
          } 
          catch (e) {
            return (new Date().format('d/m/Y')).toDate().getTime();
          }
        },
        dateFormats: function(){
          var formats = new Hashtable();
          formats.put('dd/MM/yyyy', 'd/m/Y');
          formats.put('dd/MM/yyyy HH:mm:ss', 'd/m/Y H:i:s');
          formats.put('MM/dd/yyyy', 'm/d/Y');
          formats.put('MM/dd/yyyy HH:mm:ss', 'm/d/Y H:i:s');
          return formats;
        },
        /**
         * Empty function.
         */
        emptyFn: function(){},
        /**
         * @param {Object}
         *          origclass The class to override
         * @param {Object}
         *          overrides The list of functions to add to origClass. This
         *          should be specified as an object literal containing one or
         *          more methods.
         * @method override
         */
        override: function(origclass, overrides){
            if (overrides) {
                var p = origclass.prototype;
                iNet.apply(p, overrides);
                if (iNet.isIE && overrides.toString != origclass.toString) {
                    p.toString = overrides.toString;
                }
            }
        },
        /**
         * @param {Function}
         *          subclass The class inheriting the functionality
         * @param {Function}
         *          superclass The class being extended
         * @param {Object}
         *          overrides (optional) A literal with members which are copied
         *          into the subclass's prototype, and are therefore shared
         *          between all instances of the new class.
         * @return {Function} The subclass constructor.
         * @method extend
         */
        extend: function(){
            // inline overrides
            var io = function(o){
                for (var m in o) {
                    this[m] = o[m];
                }
            };
            var oc = Object.prototype.constructor;
            
            return function(sb, sp, overrides){
                if (iNet.isObject(sp)) {
                    overrides = sp;
                    sp = sb;
                    sb = overrides.constructor != oc ? overrides.constructor : function(){
                        sp.apply(this, arguments);
                    };
                }
                var F = function(){
                }, sbp, spp = sp.prototype;
                
                F.prototype = spp;
                sbp = sb.prototype = new F();
                sbp.constructor = sb;
                sb.superclass = spp;
                if (spp.constructor == oc) {
                    spp.constructor = sp;
                }
                sb.override = function(o){
                    iNet.override(sb, o);
                };
                sbp.superclass = sbp.supr = (function(){
                    return spp;
                });
                sbp.override = io;
                iNet.override(sb, overrides);
                sb.extend = function(o){
                    iNet.extend(sb, o);
                };
                return sb;
            };
        }()
	});
    iNet.ns = iNet.namespace;
})();

/*--------------------------------------------
|               J S O N                     |
============================================*/
/**
 * iNet.JSON.encode( json-serializble ) Converts the given argument into a JSON
 * respresentation.
 * 
 * If an object has a "toJSON" function, that will be used to get the
 * representation. Non-integer/string keys are skipped in the object, as are
 * keys that point to a function.
 * 
 * json-serializble: The *thing* to be converted.
 */
iNet.JSON = {
    encode: function(o){
        if (typeof(JSON) == 'object' && JSON.stringify) {
            return JSON.stringify(o);
        }
        var type = typeof(o);
        if (o === null) {
            return "null";
        }
        if (type == "undefined") {
            return undefined;
        }
        if (type == "number" || type == "boolean") {
            return o + "";
        }
        if (type == "string") {
            return this.quoteString(o);
        }
        if (type == 'object') {
            if (typeof o.toJSON == "function") {
                return this.encode(o.toJSON());
            }
            if (o.constructor === Date) {
                var month = o.getUTCMonth() + 1;
                if (month < 10) {
                    month = '0' + month;
                }
                var day = o.getUTCDate();
                if (day < 10) {
                    day = '0' + day;
                }
                var year = o.getUTCFullYear();
                
                var hours = o.getUTCHours();
                if (hours < 10) {
                    hours = '0' + hours;
                }
                var minutes = o.getUTCMinutes();
                if (minutes < 10) {
                    minutes = '0' + minutes;
                }
                var seconds = o.getUTCSeconds();
                if (seconds < 10) {
                    seconds = '0' + seconds;
                }
                var milli = o.getUTCMilliseconds();
                if (milli < 100) {
                    milli = '0' + milli;
                }
                if (milli < 10) {
                    milli = '0' + milli;
                }
                return '"' + year + '-' + month + '-' + day + 'T' + hours + ':' +
                minutes +
                ':' +
                seconds +
                '.' +
                milli +
                'Z"';
            }
            if (o.constructor === Array) {
                var ret = [];
                for (var i = 0; i < o.length; i++) {
                    ret.push(this.encode(o[i]) || "null");
                }
                return "[" + ret.join(",") + "]";
            }
            
            var pairs = [];
            for (var k in o) {
                var name;
                var stype = typeof k;
                if (stype == "number") {
                    name = '"' + k + '"';
                }
                else 
                    if (stype == "string") {
                        name = this.quoteString(k);
                    }
                    else {
                        continue;// skip non-string or number keys
                    }
                if (typeof o[k] == "function") {
                    continue; // skip pairs where the value is a function.
                }
                var val = this.encode(o[k]);
                pairs.push(name + ":" + val);
            }
            return "{" + pairs.join(", ") + "}";
        }
    },
    
    /**
     * iNet.JSON.decode(src) Evaluates a given piece of json source.
     */
    decode: function(src){
        if (typeof(JSON) == 'object' && JSON.parse) {
            return JSON.parse(src);
        }
        return eval("(" + src + ")");
    },
    
    /**
     * iNet.JSON.decodeSecure(src) Evals JSON in a way that is *more* secure.
     */
    decodeSecure: function(src){
        if (typeof(JSON) == 'object' && JSON.parse) {
            return JSON.parse(src);
        }
        var filtered = src;
        filtered = filtered.replace(/\\["\\\/bfnrtu]/g, '@');
        filtered = filtered.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']');
        filtered = filtered.replace(/(?:^|:|,)(?:\s*\[)+/g, '');
        if (/^[\],:{}\s]*$/.test(filtered)) {
            return eval("(" + src + ")");
        }
        else {
            throw new SyntaxError("Error parsing JSON, source is not valid.");
        }
    },
    
    /**
     * iNet.JSON.quoteString(string) Returns a string-repr of a string, escaping
     * quotes intelligently. Mostly a support function for JSON.encode.
     * 
     * Examples: >>> iNet.JSON.quoteString("apple") "apple"
     * 
     * >>> iNet.JSON.quoteString('"Where are we going?", she asked.') "\"Where
     * are we going?\", she asked."
     */
    quoteString: function(string){
        if (string.match(this._escapeable)) {
            return '"' +
            string.replace(this._escapeable, function(a){
                var c = this._meta[a];
                if (typeof c === 'string') {
                    return c;
                }
                c = a.charCodeAt();
                return '\\u00' + Math.floor(c / 16).toString(16) +
                (c % 16).toString(16);
            }) +
            '"';
        }
        return '"' + string + '"';
    },
    
    _escapeable: /["\\\x00-\x1f\x7f-\x9f]/g,
    
    _meta: {
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        '"': '\\"',
        '\\': '\\\\'
    }
};
/**
 * @class iNet.Url.
 * 
 * Support URL decode, encode.
 */
iNet.Url={
  // public method for url encoding
  encode : function (string) {
    return escape(this._utf8_encode(string));
  },
 
  // public method for url decoding
  decode : function (string) {
    return this._utf8_decode(unescape(string));
  },
 
  // private method for UTF-8 encoding
  _utf8_encode: function(string){
    string = string.replace(/\r\n/g, "\n");
    var utftext = "";
    
    for (var n = 0; n < string.length; n++) {
    
      var c = string.charCodeAt(n);
      
      if (c < 128) {
        utftext += String.fromCharCode(c);
      }
      else 
        if ((c > 127) && (c < 2048)) {
          utftext += String.fromCharCode((c >> 6) | 192);
          utftext += String.fromCharCode((c & 63) | 128);
        }
        else {
          utftext += String.fromCharCode((c >> 12) | 224);
          utftext += String.fromCharCode(((c >> 6) & 63) | 128);
          utftext += String.fromCharCode((c & 63) | 128);
        }
      
    }
    
    return utftext;
  },
 
  // private method for UTF-8 decoding
  _utf8_decode: function(utftext){
    var string = "";
    var i = 0;
    var c = 0, c1 = 0, c2 = 0;
    
    while (i < utftext.length) {
    
      c = utftext.charCodeAt(i);
      
      if (c < 128) {
        string += String.fromCharCode(c);
        i++;
      }
      else 
        if ((c > 191) && (c < 224)) {
          c2 = utftext.charCodeAt(i + 1);
          string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
          i += 2;
        }
        else {
          c2 = utftext.charCodeAt(i + 1);
          c3 = utftext.charCodeAt(i + 2);
          string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
          i += 3;
        }
      
    }
    return string;
  }
};
/*--------------------------------------------
|                    D A T E                |
============================================*/
/**
 * Formats a date given the supplied format string.
 * 
 * @param {String}
 *          format The format string.
 * @return {String} The formatted date.
 * @method format
 */
Date.replaceChars = {
	shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
	longMonths: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
	shortDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
	longDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
	// Day
	d: function() { return (this.getDate() < 10 ? '0' : '') + this.getDate(); },
	D: function() { return Date.replaceChars.shortDays[this.getDay()]; },
	j: function() { return this.getDate(); },
	l: function() { return Date.replaceChars.longDays[this.getDay()]; },
	N: function() { return this.getDay() + 1; },
	S: function() { return (this.getDate() % 10 == 1 && this.getDate() != 11 ? 'st' : (this.getDate() % 10 == 2 && this.getDate() != 12 ? 'nd' : (this.getDate() % 10 == 3 && this.getDate() != 13 ? 'rd' : 'th'))); },
	w: function() { return this.getDay(); },
	z: function() { return "Not Yet Supported"; },
	// Week
	W: function() { return "Not Yet Supported"; },
	// Month
	F: function() { return Date.replaceChars.longMonths[this.getMonth()]; },
	m: function() { return (this.getMonth() < 9 ? '0' : '') + (this.getMonth() + 1); },
	M: function() { return Date.replaceChars.shortMonths[this.getMonth()]; },
	n: function() { return this.getMonth() + 1; },
	t: function() { return "Not Yet Supported"; },
	// Year
	L: function() { return (((this.getFullYear()%4==0)&&(this.getFullYear()%100 != 0)) || (this.getFullYear()%400==0)) ? '1' : '0'; },
	o: function() { return "Not Supported"; },
	Y: function() { return this.getFullYear(); },
	y: function() { return ('' + this.getFullYear()).substr(2); },
	// Time
	a: function() { return this.getHours() < 12 ? 'am' : 'pm'; },
	A: function() { return this.getHours() < 12 ? 'AM' : 'PM'; },
	B: function() { return "Not Yet Supported"; },
	g: function() { return this.getHours() % 12 || 12; },
	G: function() { return this.getHours(); },
	h: function() { return ((this.getHours() % 12 || 12) < 10 ? '0' : '') + (this.getHours() % 12 || 12); },
	H: function() { return (this.getHours() < 10 ? '0' : '') + this.getHours(); },
	i: function() { return (this.getMinutes() < 10 ? '0' : '') + this.getMinutes(); },
	s: function() { return (this.getSeconds() < 10 ? '0' : '') + this.getSeconds(); },
	// Timezone
	e: function() { return "Not Yet Supported"; },
	I: function() { return "Not Supported"; },
	O: function() { return (-this.getTimezoneOffset() < 0 ? '-' : '+') + (Math.abs(this.getTimezoneOffset() / 60) < 10 ? '0' : '') + (Math.abs(this.getTimezoneOffset() / 60)) + '00'; },
	P: function() { return (-this.getTimezoneOffset() < 0 ? '-' : '+') + (Math.abs(this.getTimezoneOffset() / 60) < 10 ? '0' : '') + (Math.abs(this.getTimezoneOffset() / 60)) + ':' + (Math.abs(this.getTimezoneOffset() % 60) < 10 ? '0' : '') + (Math.abs(this.getTimezoneOffset() % 60)); },
	T: function() { var m = this.getMonth(); this.setMonth(0); var result = this.toTimeString().replace(/^.+ \(?([^\)]+)\)?$/, '$1'); this.setMonth(m); return result;},
	Z: function() { return -this.getTimezoneOffset() * 60; },
	// Full Date/Time
	c: function() { return this.format("Y-m-d") + "T" + this.format("H:i:sP"); },
	r: function() { return this.toString(); },
	U: function() { return this.getTime() / 1000; }
};
Date.prototype.format = function(format){
    var returnStr = '';
    var replace = Date.replaceChars;
    for (var i = 0; i < format.length; i++) {
        var curChar = format.charAt(i);
        if (replace[curChar]) {
            returnStr += replace[curChar].call(this);
        }
        else {
            returnStr += curChar;
        }
    }
    return returnStr;
};

/*--------------------------------------------
|           S C O P E  F U N C T I O N      |
============================================*/
/**
 * @class Function These functions are available on every Function object (any
 *        JavaScript function).
 */
iNet.apply(Function.prototype, {
	/**
   * Creates an interceptor function. The passed fcn is called before the
   * original one. If it returns false, the original one is not called. The
   * resulting function returns the results of the original function. The passed
   * fcn is called with the parameters of the original function.
   * 
   * @param {Function} fcn The function to call before the original
   * @param {Object} scope (optional) The scope of the passed fcn (Defaults to scope of original function or window)
   * @return {Function} The new function
   */
    createInterceptor: function(fcn, scope){
        var method = this;
        return !iNet.isFunction(fcn) ? this : function(){
            var me = this, args = arguments;
            fcn.target = me;
            fcn.method = method;
            return (fcn.apply(scope || me || window, args) !== false) ? method.apply(me || window, args) : null;
        };
    },
	
    /**
     * Creates a callback that passes arguments[0], arguments[1], arguments[2],
     * ... Call directly on any function. Example:
     * <code>myFunction.createCallback(arg1, arg2)</code> Will create a
     * function that is bound to those 2 args. executes in the window scope.
     * 
     * @return {Function} The new function
     */
    createCallback: function(){
        // make args available, in function below
        var args = arguments, method = this;
        return function(){
            return method.apply(window, args);
        };
    },
	
    /**
     * Creates a delegate (callback) that sets the scope to obj. Call directly
     * on any function. Example:
     * <code>this.myFunction.createDelegate(this, [arg1, arg2])</code> Will
     * create a function that is automatically scoped to obj so that the
     * <tt>this</tt> variable inside the callback points to obj.
     * 
     * @param {Object}
     *          obj (optional) The object for which the scope is set
     * @param {Array} args (optional) Overrides arguments for the call. (Defaults to the arguments passed by the caller)
     * @param {Boolean/Number} appendArgs (optional) if True args are appended to call args
     *          instead of overriding, if a number the args are inserted at the specified position
     * @return {Function} The new function
     */
    createDelegate: function(obj, args, appendArgs){
        var method = this;
        return function(){
            var callArgs = args || arguments;
            if (appendArgs === true) {
                callArgs = Array.prototype.slice.call(arguments, 0);
                callArgs = callArgs.concat(args);
            }
            else 
                if (iNet.isNumber(appendArgs)) {
                    callArgs = Array.prototype.slice.call(arguments, 0); // copy arguments first
                    var applyArgs = [appendArgs, 0].concat(args); // create method call params
                    Array.prototype.splice.apply(callArgs, applyArgs); // splice them in
                }
            return method.apply(obj || window, callArgs);
        };
    },
    
    /**
     * Calls this function after the number of millseconds specified, optionally
     * in a specific scope. Example usage:
     * 
     * @param {Number} millis The number of milliseconds for the setTimeout call (if
     *          less than or equal to 0 the function is executed immediately)
     * @param {Object}
     *          obj (optional) The object for which the scope is set
     * @param {Array} args (optional) Overrides arguments for the call. (Defaults to
     *          the arguments passed by the caller)
     * @param {Boolean/Number} appendArgs (optional) if True args are appended to call args
     *          instead of overriding, if a number the args are inserted at the
     *          specified position
     * @return {Number} The timeout id that can be used with clearTimeout
     */
    defer: function(millis, obj, args, appendArgs){
        var fn = this.createDelegate(obj, args, appendArgs);
        if (millis > 0) {
            return setTimeout(fn, millis);
        }
        fn();
        return 0;
    }
});

/*--------------------------------------------
|               S T R I N G                 |
============================================*/
/**
 * @class String These functions are available on every String object.
 */
iNet.applyIf(String, {
    /**
     * Allows you to define a tokenized string and pass an arbitrary number of
     * arguments to replace the tokens.
     */
    format: function(format){
        var args = iNet.toArray(arguments, 1);
        return format.replace(/\{(\d+)\}/g, function(m, i){
            return args[i];
        });
    },

    /**
     * Returns a string that trim all white spaces at the begining and the end
     * of this string.
     * 
     * @return {String}
     */
    trim: function() {
      return this.replace(/^[\s\xA0]+/,"").replace(/[\s\xA0]+$/,"");
    },

    /**
     * Returns if this string starts with the given string.
     * 
     * @param str
     *          the given string to check.
     * @return {Boolean}
     */
    startsWith: function(str) {
      return (this.match("^" + str) == str);
    },

    /**
     * Returns if this string ends with the given string.
     * 
     * @param str
     *          the given string to check.
     * @return {Boolean}
     */
    endsWith: function(str) {
      return (this.match(str + "$") == str);
    }
});

iNet.applyIf(String.prototype, {
    /**
     * Escapes the passed string quotes
     * 
     * @return {String} The escaped string
     */
    escapeHtml: function(){
        return (this.replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/"/g, '&quot;'));
    },
    /**
     * Convert String to Date (Only Support format dd/MM/yyyy & MM/dd/yyyy)
     */
    toDate: function(format) {
      var formats = iNet.dateFormats();
      var __format = formats.get(format || 'dd/MM/yyyy');
      if (__format.length >= 5) {
        __format=__format.substring(0, 5);
      }
      var date = new Date();
      if (iNet.isEmpty(this)) {
        return date;
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
        date = new Date(Date.parse(temp));
      } 
      catch (e) {
      }
      return date;
    }
});
/*--------------------------------------------
|               A R R A Y                   |
============================================*/
/**
 * @class Array
 */
iNet.applyIf(Array.prototype, {
    /**
     * Checks whether or not the specified object exists in the array.
     * 
     * @param {Object}
     *          o The object to check for
     * @return {Number} The index of o in the array (or -1 if it is not found)
     */
    indexOf: function(o){
        for (var i = 0, len = this.length; i < len; i++) {
            if (this[i] == o) {
                return i;
            }
        }
        return -1;
    },
    
    /**
     * Removes the specified object from the array. If the object is not found
     * nothing happens.
     * 
     * @param {Object}
     *          o The object to remove
     * @return {Array} this array
     */
    remove: function(o){
        var index = this.indexOf(o);
        if (index != -1) {
            this.splice(index, 1);
        }
        return this;
    },
    clone: function() {
      var newObj = (this instanceof Array) ? [] : {};
      for (i in this) {
        if (i == 'clone') 
          continue;
        if (this[i] && typeof this[i] == "object") {
          newObj[i] = this[i].clone();
        }
        else 
          newObj[i] = this[i]
      }
      return newObj;
    }
});


/*--------------------------------------------
|               BASE64                     |
============================================*/
/**
 * iNet.base64.encode( input) Converts the given argument into base64
 * respresentation.
 * 
 */
iNet.Base64 = {
	_keyString: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
	
    encode: function(input){
		input = escape(input);
		var output = "";
		var chr1, chr2, chr3 = "";
		var enc1, enc2, enc3, enc4 = "";
		var i = 0;
		
		do {
		   chr1 = input.charCodeAt(i++);
		   chr2 = input.charCodeAt(i++);
		   chr3 = input.charCodeAt(i++);
		
		   enc1 = chr1 >> 2;
		   enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
		   enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
		   enc4 = chr3 & 63;
		
		   if (isNaN(chr2)) {
		      enc3 = enc4 = 64;
		   } else if (isNaN(chr3)) {
		      enc4 = 64;
		   }
		
		   output = output +
		      this._keyString.charAt(enc1) +
		      this._keyString.charAt(enc2) +
		      this._keyString.charAt(enc3) +
		      this._keyString.charAt(enc4);
		   chr1 = chr2 = chr3 = "";
		   enc1 = enc2 = enc3 = enc4 = "";
		} while (i < input.length);
		
		return output;
    },
    
    /**
     * iNet.JSON.decode(src) Evaluates a given piece of json source.
     */
    decode: function(input){
    	var output = "";
        var chr1, chr2, chr3 = "";
        var enc1, enc2, enc3, enc4 = "";
        var i = 0;

        // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
        var base64test = /[^A-Za-z0-9\+\/\=]/g;
        if (base64test.exec(input)) {
           alert("There were invalid base64 characters in the input text.\n" +
                 "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                 "Expect errors in decoding.");
        }
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        do {
           enc1 = this._keyString.indexOf(input.charAt(i++));
           enc2 = this._keyString.indexOf(input.charAt(i++));
           enc3 = this._keyString.indexOf(input.charAt(i++));
           enc4 = this._keyString.indexOf(input.charAt(i++));

           chr1 = (enc1 << 2) | (enc2 >> 4);
           chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
           chr3 = ((enc3 & 3) << 6) | enc4;

           output = output + String.fromCharCode(chr1);

           if (enc3 != 64) {
              output = output + String.fromCharCode(chr2);
           }
           if (enc4 != 64) {
              output = output + String.fromCharCode(chr3);
           }

           chr1 = chr2 = chr3 = "";
           enc1 = enc2 = enc3 = enc4 = "";

        } while (i < input.length);

        return unescape(output);
    },
    encodeObject: function(obj){
    	return this.encode(iNet.JSON.encode(obj));
    },
    decodeObject: function(str){
    	return iNet.JSON.decode(this.decode(str));
    }
};
/**
 * Extends JQuery
 */
(function() {
  $.postJSON = function(url, params, callback) {
    var __callback = callback || iNet.emptyFn;
    $.post(url, params, function(data) {
      __callback(data);
    }); 
  };
})();
