# Promises

- Explain the purpose of promises.
- Draw the lifecycle of a promise.
- Manipulate promises using Angular’s $q service.

## "Deferred" and Promises

Promises are:

* A way to pass around a value that hasn't actually been calculated yet.
* A way to attach callback-like behavior to a function call that hasn't completed yet.
* A popular interview topic.
* Anything you can `.then( ... )`  on.
* Something that can be *pending*, then gets *resolved/fulfilled* or *rejected/failed*.

<img src="http://www.mediumequalsmessage.com/blog-images/promises.png" width="70%">
> <small>Imgae source: http://blog.mediumequalsmessage.com/promise-deferred-objects-in-javascript-pt1-theory-and-semantics </small>




You've seen them before.

May libraries - including jQuery and Angular -- have implementations of promises. Can you think of an example from Angular?

There are a few minor provisos.  Various implementations of promises have all been a little bit different.  The good news is the JS/ES6 community has pretty much settled on standards for this now.

![provisos](http://evolveandsucceed.com/wp-content/uploads/2014/05/03-provisos.gif)


### `$q` basics

The promise library in Angular is `$q`.

Deferreds are objects in Angular that represent deferred tasks. Each "promise" is the eventual result of a deferred task.  These structures let our code "promise" to run the attached functions when the deferred task is finished, whether it was successful or not.

> A new instance of deferred is constructed by calling `$q.defer()`. The purpose of the deferred object is to expose the associated Promise instance as well as APIs that can be used for signaling the successful or unsuccessful completion, as well as the status of the task.


### Code Sample

```js
function task(str){ // set up a function to use with promises

  var deferred = $q.defer();  // create a new 'deferred'
  // do some work...

  // in what case(s) should the deferred be resolved (success)?
  // write code to actually **resolve** the promise in each case...
  if (str === "dude" || str === "sweet"){
    deferred.resolve(str);  // argument gets passed to promise success
  } else if (str === "Where's my car?"){
    deferred.resolve("Aww man...");
  }
  // in what case(s) should the deferred be rejected (error)?
  // write code to actually **reject** the promise in each case
  else {
    deferred.reject("Error: " + str + "not recognized.");
  }

  var promise = deferred.promise;  // set up access to this eventual (promised) result
  return promise;  // return the promise
}
```


Elsewhere in our code,  we can run the function and attach next steps for successful resolution or for rejection.
```js
task("dude")  // returns a promise
  .then(success, error);
  
function success(resolvReturnValue){
  console.log(resolvReturnValue);
}

function error(rejectReturnValue){
  console.log(rejectReturnValue);
}
```



Promises can also be chained:
```js
task("dude")  // returns a promise
  .then(task) // returns a promise
  .then(success, error);
```

### Check for Understanding

1. What would you see logged in the console from the first example above?

  <details><summary>click for answer</summary>
  `"dude"`
  </details>

1. What would you see logged in the console from the second example?

  <details><summary>click for answer</summary>
  `"dude"`
  `"dude"`
  </details>


### Independent Practice

1. Fork and clone this repo.

2. Play around with the simple Angular app in the sample-code directory.  Remember to check your console output. Investigate how the `addOne` function is working.  Try calling it a few more times. 

3. As you start to feel comfortable with `addOne`, implement a `square` function in this controller that can be used in the same way.

### Additional Resources
* [`$q` documentation](https://docs.angularjs.org/api/ng/service/$q)
