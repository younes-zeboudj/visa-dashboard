(function($) {
    $.fn.blink = function(options) {
        var defaults = { delay: 0 };
        var options = $.extend(defaults, options);
        return $(this).each(function(idx, itm) {
        
                $(itm).css('font-weight', 'bold');
            

            setTimeout(() => {
                $(itm).css('font-weight', 'normal');
                
            }, 120);
        });
    }
    $.fn.unblink = function() {
        return $(this).each(function(idx, itm) {
            var handle = $(itm).data('handle');
            if (handle) {
                clearInterval(handle);
                $(itm).data('handle', null);
                $(itm).css('visibility', 'inherit');
            }
        });
    }
}(jQuery))