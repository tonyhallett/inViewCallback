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
            inView: function(){},
            initialInView: true,
        },
        _isOnScreen:isOnScreen,
        _callbackCount:0,
        _widgetId: 0,
        _offScreen:true,
        _triggerView:function(inView){
            this._trigger(inView?"inView":"outOfView",null,{count:this._callbackCount});
        },
        _triggerInView:function(){
            this._triggerView(true);
        },
        _triggerOutOfView:function(){
            this._triggerView(false);
        },
        _reachedLimit:function(){
            return this.options.numTimes===undefined?false:(this._callbackCount>=this.options.numTimes);
        },
        _elementOnScreen:function(){
            return this._isOnScreen(this.element);
        },
        _testAndCallback:function(initialInView){
            var reachedLimit=false;
            var offScreen=this._offScreen;
            var onScreen=this._elementOnScreen();
            this._offScreen=!onScreen;

            if(initialInView){
                if(onScreen){
                    this._callbackCount++;
                    this._triggerInView();
                    
                }else{
                    this._triggerOutOfView();
                    reachedLimit=this._reachedLimit();
                }
            }else{
                if (offScreen&&onScreen) {
                    this._callbackCount++;
                    this._triggerInView();
                    
                }else if(!offScreen&&!onScreen){
                    this._triggerOutOfView();
                    reachedLimit=this._reachedLimit();
                }
            }

            
            return reachedLimit;
        },
        _destroy:function(){
            this._removeScrollHandler();
        },
        _getScrollHandlerEventType:function(){
            return "scroll.inviewcallback." + this._widgetId;
        },
        _addScrollHandler: function () {
            var self = this;
            $(window).on(this._getScrollHandlerEventType(), function () {
                var reachedLimit=self._testAndCallback();
                if(reachedLimit){
                    self._removeScrollHandler();
                }
            });
            
        },
        
        _removeScrollHandler:function(){
            $(window).off(this._getScrollHandlerEventType());
        },
        _create: function () {
            this._widgetId=widgetCount++;
            var requiresCallback=this.options.numTimes===undefined?true:this.options.numTimes>0;
           
            if (this.options.initialInView&&requiresCallback) {
                requiresCallback=!this._testAndCallback(true);
            }else{ 
                this._offScreen=!this._elementOnScreen();
                if(this._offScreen&&requiresCallback){
                    this._triggerOutOfView();
                }
            }
            if(requiresCallback){
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
