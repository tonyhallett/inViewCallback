var isOnScreenReturnValue;

var isOnScreenCalled=false;
var calls=[];

function callback(event,numberOfTimes){
  calls.push(numberOfTimes);
}
function addPluginToElement(plugInOptions){
  function createCallbackElement(){
    var fixture = $( "#qunit-fixture" );
    var callbackElement=$("<div>");
    fixture.append(callbackElement);
    return callbackElement;
  }
  plugInOptions=plugInOptions===undefined?{}:plugInOptions;
  var callbackElement=createCallbackElement();
  plugInOptions.callback=callback;
  callbackElement.inviewcallback(plugInOptions);
  return callbackElement;
}

QUnit.module("All tests",{
  before:function(){
    function isOnScreen(){
      isOnScreenCalled=true;
      return isOnScreenReturnValue;
    }
    //mocking the widget
    $.widget( "tonyhallett.inviewcallback", $.tonyhallett.inviewcallback, {
      _isOnScreen:isOnScreen
    });
  },
  beforeEach:function(){
    //can add to this context and can access in tests
    isOnScreenCalled=false;
    calls=[];
  },
  afterEach:function(){
    $(":tonyhallett-inviewcallback").inviewcallback("destroy");//!!!!!!!!!!!!!!!!!!
  }
});
//using defaults
QUnit.test("will call callback if on screen and num times not reached for initialInView true and without scroll",function(assert){
  isOnScreenReturnValue=true;

  addPluginToElement();

  assert.equal(isOnScreenCalled,true);
  assert.equal(calls.length,1);
  assert.equal(calls[0],1);

});
QUnit.test("will not callback if not on screen",function(assert){
  isOnScreenReturnValue=false;

  addPluginToElement();
  assert.equal(isOnScreenCalled,true);
  assert.equal(calls.length,0);

});
QUnit.test("will not callback if num times reached",function(assert){
  isOnScreenReturnValue=true;

  addPluginToElement({numTimes:0});

  assert.equal(isOnScreenCalled,false);
  assert.equal(calls.length,0);

});


QUnit.test("will not call isOnScreen when initialInView false and no scroll event ",function(assert){
  isOnScreenReturnValue=true;

  addPluginToElement({
    initialInView:false
  });

  assert.equal(isOnScreenCalled,false);
  assert.equal(calls.length,0);
});

QUnit.test("will call isOnScreen and callback when initialInView false and scroll event and num times not reached ",function(assert){
  isOnScreenReturnValue=true;

  addPluginToElement({
    initialInView:false,
    numTimes:2
  });

  $(window).trigger("scroll.inviewcallback");
  assert.equal(isOnScreenCalled,true);
  assert.equal(calls.length,1);
  assert.equal(calls[0],1);
  $(window).trigger("scroll.inviewcallback");
  assert.equal(calls.length,2);
  assert.equal(calls[1],2);
});
 QUnit.test("will not callback more than numTimes",function(assert){
  isOnScreenReturnValue=true;

  addPluginToElement({
    initialInView:false,
    numTimes:2
  });

  $(window).trigger("scroll.inviewcallback");
  $(window).trigger("scroll.inviewcallback");
  $(window).trigger("scroll.inviewcallback");
  $(window).trigger("scroll.inviewcallback");
  $(window).trigger("scroll.inviewcallback");
  $(window).trigger("scroll.inviewcallback");
  assert.equal(calls.length,2);

});

QUnit.test("will allow reducing num times",function(assert){
  isOnScreenReturnValue=true;

  var callbackElement=addPluginToElement({
    initialInView:false,
    numTimes:4
  });

  $(window).trigger("scroll.inviewcallback");
  $(window).trigger("scroll.inviewcallback");
  callbackElement.inviewcallback("option","numTimes",1);
  $(window).trigger("scroll.inviewcallback");
  $(window).trigger("scroll.inviewcallback");
  assert.equal(calls.length,2);

});
QUnit.test("will allow extending num times",function(assert){
  isOnScreenReturnValue=true;

  var callbackElement=addPluginToElement({
    initialInView:false,
    numTimes:2
  });

  $(window).trigger("scroll.inviewcallback");
  $(window).trigger("scroll.inviewcallback");
  callbackElement.inviewcallback("option","numTimes",3);
  $(window).trigger("scroll.inviewcallback");
  $(window).trigger("scroll.inviewcallback");
  assert.equal(calls.length,3);
});




