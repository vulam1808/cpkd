(function($){
    $.fn.extend({
        integer: function(options){
            //var defaults = {};
            //var options = $.extend(defaults, options);
            return this.each(function(){
              var obj = $(this);
              obj.keypress(function(e){
                  return /\d/.test(String.fromCharCode(e.keyCode || e.which));
              });
            });
        }
    });
    
})(jQuery);
