var isOnScreenReturnValue;

var isOnScreenCalled=false;
var calls=[];

function inViewCallback(event,numberOfTimes){
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
  plugInOptions.inView=inViewCallback;
  callbackElement.inviewcallback(plugInOptions);
  return callbackElement;
}
function scroll(times){
  times=(times===undefined?1:times);
  for(var i=0;i<times;i++){
    $(window).trigger("scroll.inviewcallback");
  }
}
function switchInView(){
    isOnScreenReturnValue=!isOnScreenReturnValue;
    scroll();
}
function switchInViewAndBack(){
  switchInView();
  switchInView();
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


QUnit.test("when initialInView and in view and no numTimes in options then callback should be called",function(assert){
  isOnScreenReturnValue=true;

  addPluginToElement();

  assert.equal(calls.length,1);
  assert.equal(calls[0],1);
});
QUnit.test("when initialInView and in view and numTimes 1 then callback should be called",function(assert){
  isOnScreenReturnValue=true;

  addPluginToElement({numTimes:1});

  assert.equal(calls.length,1);
  assert.equal(calls[0],1);
});
QUnit.test("when initialInView and in view and numTimes 0 then callback should not called",function(assert){
  isOnScreenReturnValue=true;

  addPluginToElement({numTimes:0});

  assert.equal(calls.length,0);
});
QUnit.test("when initialInView is false and in view and no numTimes in options then callback should not be called",function(assert){
  isOnScreenReturnValue=true;

  addPluginToElement({initialInView:false});

  assert.equal(calls.length,0);
});
QUnit.test('when initialInView is false and in view, when scroll and stay in view then callback should not be called',function(assert){
  isOnScreenReturnValue=true;

  addPluginToElement({initialInView:false});

  scroll();
  assert.equal(calls.length,0);
});
QUnit.test('when initialInView is false and in view, it has to go out of view and back in view for the callback to be called',function(assert){
  isOnScreenReturnValue=true;

  addPluginToElement({initialInView:false});

  switchInViewAndBack();
  assert.equal(calls.length,1);
});
QUnit.test("when in view and scroll there should not be an additional callback",function(assert){
  isOnScreenReturnValue=true;
  
  addPluginToElement();
  assert.equal(calls.length,1);

  scroll();
  assert.equal(calls.length,1);
});
QUnit.test("when out of view and scroll in view and no times in options then callback should be called",function(assert){
  isOnScreenReturnValue=false;
  addPluginToElement();
  assert.equal(calls.length,0);

  switchInView();
  assert.equal(calls.length,1);

  scroll();
  assert.equal(calls.length,1);
});
QUnit.test("when out of view and scroll in view and numTimes reached then callback should not be called",function(assert){
  isOnScreenReturnValue=true;
  addPluginToElement({numTimes:2});
  assert.equal(calls.length,1);

  switchInViewAndBack();
  assert.equal(calls.length,2);

  switchInViewAndBack();//this would be the third time
  assert.equal(calls.length,2);
});

QUnit.test("callbacks should receive incrementing value when going out of view and into view",function(assert){
  isOnScreenReturnValue=true;
  addPluginToElement();

  switchInViewAndBack();
  
  assert.equal(calls.length,2);
  assert.equal(calls[0],1);
  assert.equal(calls[1],2);
});
QUnit.test("can receive the callback through event instead",function(assert){
  isOnScreenReturnValue=false;
  var plugInElement=addPluginToElement();
  var calls=[];
  plugInElement.bind("inviewcallbackinview",function(event,data){
    calls.push(data);
  });
  
  switchInView();

  switchInViewAndBack();

  assert.equal(calls.length,2);
  assert.equal(calls[0],1);
  assert.equal(calls[1],2);

});
QUnit.test("it is possible to reduce numTimes",function(assert){
  isOnScreenReturnValue=false;
  var pluginElement=addPluginToElement({numTimes:10});

  switchInView();
  assert.equal(calls.length,1);

  pluginElement.inviewcallback('option',"numTimes",1);

  switchInViewAndBack();
  
  assert.equal(calls.length,1);

});
QUnit.test("it is possible to increase numTimes",function(assert){
  isOnScreenReturnValue=false;
  var pluginElement=addPluginToElement({numTimes:1});

  switchInView();
  assert.equal(calls.length,1);

  switchInViewAndBack();
  assert.equal(calls.length,1);

  pluginElement.inviewcallback('option',"numTimes",2);

  switchInViewAndBack();
  assert.equal(calls.length,2);

});




