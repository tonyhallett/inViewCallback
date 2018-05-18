# inViewCallback.js

Is a jquery-ui widget ( without any ui ) that will call the callback in options ( or trigger an event ) when the plugin element has entered the view.

## Entering the view

There are two ways that it can come into view.  The first is the logical,  when it is out of view and comes into view.  The second is dependent upon the option initialInView.  If initialInView is true and is in view then the callback will be called ( and it will need to go out of view and back in for the callback to be possibly called again.).  If it is out of view then it needs to come into view.  If initialInView is false and is in view then it will need to go out of view and come into view again.  If it is out of view then it will need to come into view.

## Number of times the callback will be called

If the numTimes option has not been set then it is infinite, otherwise this option value restricts the number of callbacks that will be received.

The numTimes option can be changed at any time.

## Usage

Jquery and jquery-ui need to be present.

### With callback

initialInView defaults to true.  If the element is in view the callback will be called.

``` javascript
$('#someElement).inviewcallback(
    {
        callback:function(event,callCount){
            //this will be called indefinitely
        }
    }
)
```

### With event

Here the element will have to be out of view and come in to view for the event to be raised.

``` javascript
var pluginElement=$('#someElement).inviewcallback(
    {
        initialInView:false
    }
)
plugInElement.bind("inviewcallbackcallback",function(event,count){
    //will be called indefinitely until...
  });
//changing the option at a later date
pluginElement.inviewcallback('option',"numTimes",1);
```

## Tests

The tests folder contains test.html and tests.js for testing in QUnit.