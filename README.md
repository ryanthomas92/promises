<!--
Creator: Team, most recent editing by Brianna
Location: SF
-->

![](https://ga-dash.s3.amazonaws.com/production/assets/logo-9f88ae6c9c3871690e33280fcf557f33.png)

# Promises

### Why is this important?
<!-- framing the "why" in big-picture/real world examples -->
*This workshop is important because:*

Promises are a powerful pattern for asynchronous behavior in JavaScript. They come up in interviews, and they're actually conceptually pretty simple. They're used a lot across libraries.

### What are the objectives?
<!-- specific/measurable goal for students to achieve -->
*After this workshop, developers will be able to:*

- Explain the purpose of promises.
- Draw the lifecycle of a promise.
- Manipulate promises using Angular’s $q service.


### Where should we be now?
<!-- call out the skills that are prerequisites -->
*Before this workshop, developers should already be able to:*

- Make an `$http` call, attaching success and error handlers with `.then()`.
- Create a simple Angular app with one controller.

### Warm Up

Let's go over the following questions:

1. What is a promise?
1. What does it mean for a promise to be pending, resolved, and rejected?
1. Represent a deferred task and promise with a drawing, text, skit, song. Whatever moves you!

### "Deferred" and Promises

Promises are:

* A way to pass around a value that hasn't actually been calculated yet.
* A way to attach callback-like behavior to a function call that hasn't completed yet.
* A popular interview topic.
* Anything you can `.then( ... )`  on.
* Something that can be *pending*, then gets *resolved/fulfilled* or *rejected/failed*.


There are a few minor provisios (small print!).  Various implementations of promises have all been a little bit different across libraries and languages. We'll dive in with Angular's `$q`.


#### Check for Understanding

You've used promises before. Many libraries - including jQuery and Angular -- have implementations of promises.

1. Can you think of an example of promises from Angular?


### `$q` basics

The promise library in Angular is `$q`.

Deferreds are objects in Angular that represent deferred tasks, tasks that haven't completed yet. Each "promise" is the eventual result of a deferred task.  These structures let our code "promise" that it will run a particular function when the deferred task is finished. We usually specify different functions to run based on whether the task was successful or not.

> A new instance of deferred is constructed by calling `$q.defer()`. The purpose of the deferred object is to expose the associated Promise instance as well as APIs that can be used for signaling the successful or unsuccessful completion, as well as the status of the task.


### Code Sample

```js
function task(str){ // set up a function to use with promises
  var deferred = $q.defer();  // create a new 'deferred'
  // do some work...
  console.log(str);  // usually this work can take a long time to complete!

  // in what case(s) should the deferred be resolved (success)?
  // write code to actually **resolve** the promise in each case...
  if (str === "dude" || str === "sweet"){
    deferred.resolve(str);  // argument gets passed to promise success
  } else if (str === "I lost the car!"){
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

function success(resolveReturnValue){
  console.log('resolved!', resolveReturnValue);
}

function error(rejectReturnValue){
  console.log('rejected!', rejectReturnValue);
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
  ```
  "dude"
  "resolved! dude"
  ```
  </details>

1. What would you see logged in the console from the second example?

  <details><summary>click for answer</summary>
  ```
  "dude"
  "dude"
  "resolved! dude"
  ```
  </details>


### Independent Practice

1. Fork and clone this repo.

2. Play around with the simple Angular app in the sample-code directory.  Remember to check your console output. Investigate how the `addOne` function is working.  Try calling it a few more times.

3. As you start to feel comfortable with `addOne`, implement a `square` function in this controller that can be used in the same way.

### Closing Thoughts

1. What is a promise?
1. What does it mean for a promise to be pending, fulfilled, resolved, and rejected?
1. How does promise "chaining" work?
1. Draw the lifecycle of a promise.

### Additional Resources
* [`$q` documentation](https://docs.angularjs.org/api/ng/service/$q)  
* [Cartoon explanation of promises](http://andyshora.com/promises-angularjs-explained-as-cartoon.html), by Andy Shora  
*  MDN's [JavaScript Promise documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)  
* [Angular's `$q` service example (video)](https://www.youtube.com/watch?v=W2PBVEgMijo) 
* [Promise history](http://blog.mediumequalsmessage.com/promise-deferred-objects-in-javascript-pt1-theory-and-semantics)
