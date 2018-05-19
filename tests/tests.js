var isOnScreenReturnValue;

var isOnScreenCalled=false;
var calls=[];

function inViewCallback(event,data){
  calls.push(data.count);
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


QUnit.test("Given initialInView and in view and no numTimes in options, when the callback is appied then the callback should be called",function(assert){
  isOnScreenReturnValue=true;

  addPluginToElement();

  assert.equal(calls.length,1);
  assert.equal(calls[0],1);
});
QUnit.test("Given initialInView and in view and numTimes 1, when the plugin is applied then the callback should be called",function(assert){
  isOnScreenReturnValue=true;

  addPluginToElement({numTimes:1});

  assert.equal(calls.length,1);
  assert.equal(calls[0],1);
});
QUnit.test("Given initialInView and in view and numTimes 0, when the plugin is applied then the callback should not called",function(assert){
  isOnScreenReturnValue=true;

  addPluginToElement({numTimes:0});

  assert.equal(calls.length,0);
});
QUnit.test("Given initialInView is false and in view and no numTimes in options, when the plugin is applied then the callback should not be called",function(assert){
  isOnScreenReturnValue=true;

  addPluginToElement({initialInView:false});

  assert.equal(calls.length,0);
});
QUnit.test('Given initialInView is false and in view, when scroll and stay in view then the callback should not be called',function(assert){
  isOnScreenReturnValue=true;

  addPluginToElement({initialInView:false});

  scroll();
  assert.equal(calls.length,0);
});
QUnit.test('Given initialInView is false and in view, when scroll out of view and back in view then the callback should be called',function(assert){
  isOnScreenReturnValue=true;

  addPluginToElement({initialInView:false});

  switchInViewAndBack();
  assert.equal(calls.length,1);
});
QUnit.test("Given in view, when scroll and stay in view then there should not be an additional callback",function(assert){
  isOnScreenReturnValue=true;
  
  addPluginToElement();
  assert.equal(calls.length,1);

  scroll();
  assert.equal(calls.length,1);
});
QUnit.test("Given no numTimes in options and out of view, when scroll in view then the callback should be called",function(assert){
  isOnScreenReturnValue=false;
  addPluginToElement();
  assert.equal(calls.length,0);

  switchInView();
  assert.equal(calls.length,1);

  scroll();
  assert.equal(calls.length,1);
});
QUnit.test("Given out of view and numTimes reached, when scroll in view then the callback should not be called",function(assert){
  isOnScreenReturnValue=true;
  addPluginToElement({numTimes:2});
  assert.equal(calls.length,1);

  switchInViewAndBack();
  assert.equal(calls.length,2);

  switchInViewAndBack();//this would be the third time
  assert.equal(calls.length,2);
});
QUnit.test("Given initialInView, in view and numTimes not reached, when scroll out of view then outOfView callback should be called",function(assert){
  isOnScreenReturnValue=true;
  var outOfViewCount;
  addPluginToElement({outOfView:function(evt,data){
    outOfViewCount=data.count;
  }});
  switchInView();
  assert.equal(outOfViewCount,1);
});
QUnit.test("Given initialInView, out of view and numTimes not reached, wehn apply the plugin then outOfView callback should be called",function(assert){
  isOnScreenReturnValue=false;
  var outOfViewCount;
  addPluginToElement({outOfView:function(evt,data){
    outOfViewCount=data.count;
  }});
  switchInView();
  assert.equal(outOfViewCount,0);
});
QUnit.test("Given initialInView is false and in view, when goes out of view then outOfView callback should be called ",function(assert){
  isOnScreenReturnValue=true;
  var outOfViewCount;
  addPluginToElement({
    outOfView:function(evt,data){
      outOfViewCount=data.count;
    },
    initialInView:false
  });
  switchInView();
  assert.equal(outOfViewCount,0);
});
QUnit.test("Given initialInView is false and out of view, when apply the plugin then outOfView callback should will be called ",function(assert){
  isOnScreenReturnValue=false;
  var outOfViewCount;
  addPluginToElement({
    outOfView:function(evt,data){
      outOfViewCount=data.count;
    },
    initialInView:false
  });
 
  assert.equal(outOfViewCount,0);
});

QUnit.test("Given plugin applied, when going out of view and into view then callbacks should receive incrementing value ",function(assert){
  isOnScreenReturnValue=true;
  var outOfViewCalls=[];
  addPluginToElement({outOfView:function(event,data){
    outOfViewCalls.push(data.count);
  }});

  switchInViewAndBack();
  switchInViewAndBack();
  
  assert.equal(calls.length,3);
  assert.equal(calls[0],1);
  assert.equal(calls[1],2);
  assert.equal(calls[2],3);

  assert.equal(outOfViewCalls.length,2);
  assert.equal(outOfViewCalls[0],1);
  assert.equal(outOfViewCalls[1],2);

});
QUnit.test("Given plugin applied, when going out of view and into view, then should receive the callbacks through events instead",function(assert){
  isOnScreenReturnValue=false;
  var plugInElement=addPluginToElement();
  var eventCalls=[];
  var outOfViewEventCalls=[];
  plugInElement.bind("inviewcallbackinview",function(event,data){
    eventCalls.push(data.count);
  });
  //Have bound too late to catch the first !
  plugInElement.bind("inviewcallbackoutofview",function(event,data){
    outOfViewEventCalls.push(data.count);
  });
  
  switchInView();

  switchInViewAndBack();
  switchInViewAndBack();

  assert.equal(eventCalls.length,3);
  assert.equal(eventCalls[0],1);
  assert.equal(eventCalls[1],2);
  assert.equal(eventCalls[2],3);

  
  assert.equal(outOfViewEventCalls.length,2);
  assert.equal(outOfViewEventCalls[0],1);
  assert.equal(outOfViewEventCalls[1],2);

});
QUnit.test("Given numTimes 10 and in view once, when set option numTimes to once and in view again then the callack should not be called again.",function(assert){
  isOnScreenReturnValue=false;
  var pluginElement=addPluginToElement({numTimes:10});

  switchInView();
  assert.equal(calls.length,1);

  pluginElement.inviewcallback('option',"numTimes",1);

  switchInViewAndBack();
  
  assert.equal(calls.length,1);

});
QUnit.test("Given numTimes is reached, when increase numTimes through the option and in view again then the callback should be called again. ",function(assert){
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




