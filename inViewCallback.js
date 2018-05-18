(function ( $ ) {
    var widgetCount=0;
    function isOnScreen (el) {

        var win = $(window);

        var viewport = {
            top: win.scrollTop(),
            left: win.scrollLeft()
        };
        viewport.right = viewport.left + win.width();
        viewport.bottom = viewport.top + win.height();

        var bounds = el.offset();
        bounds.right = bounds.left + el.outerWidth();
        bounds.bottom = bounds.top + el.outerHeight();

        return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));

    }
    $.widget("tonyhallett.inviewcallback", {      
        options: {
            callback: function(){},
            initialInView: true,
            numTimes:1
        },
        _isOnScreen:isOnScreen,
        _callbackCount:0,
        _widgetId: 0,
        _doCallback:function(){
            this._trigger("callback",null,this._callbackCount);
        },
        _reachedLimit:function(){
            return this._callbackCount>=this.options.numTimes;
        },
        _testAndCallback:function(){
            var reachedLimit=false;
            if (this._isOnScreen(this.element)) {
                this._callbackCount++;
                this._doCallback();
                reachedLimit=this._reachedLimit();
            }
            return reachedLimit;
        },
        _destroy:function(){
            this._removeScrollHandler();
        },
        _addScrollHandler: function () {
            var self = this;
            $(window).on("scroll.inviewcallback." + this._widgetId, function () {
                var reachedLimit=self._testAndCallback();
                if(reachedLimit){
                    self._removeScrollHandler();
                }
            });
            
        },
        
        _removeScrollHandler:function(){
            $(window).off("scroll.inviewcallback." + this._widgetId);
        },
        _create: function () {
            this._widgetId=widgetCount++;
            var requiresScrollHandler=this.options.numTimes>0;
            if (this.options.initialInView&&requiresScrollHandler) {
                requiresScrollHandler=!this._testAndCallback();
            }
            if(requiresScrollHandler){
                this._addScrollHandler();
            }
        },
        _setOption: function (key, value) {
            this._super(key, value);
            if(key==="numTimes"){
                this._removeScrollHandler();
                if(!this._reachedLimit()){
                    this._addScrollHandler();
                }
            }
        }
    });

}( jQuery ));
