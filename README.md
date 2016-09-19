# Better Patterns: Services & Promises

| Objectives |
| ----------| 
| Be able to DRY code by moving code into a Service |
| Be able to use a Service as a data model |
| Be able to return a promise which can be resolved in the controller |
| Be able to replace $http with ngResource | 


| Wordbank |  | | | |
| --------- | ------- | -------- | ------- | ------- |
| Service   | data model |   |  |   |
| `$q.defer`| promise | deferred | `.then(success, error) | reject |
| resolve |     |    |    |    | 

## What is a controller's job?  

Answer: to control the view-model


```js
BooksIndexController.$inject=['$http'];
function BooksIndexController($http) {
  var vm = this;

  $http({
    method: 'GET',
    url: 'https://super-crud.herokuapp.com/books'
  }).then(onBooksIndexSuccess, onError)

  function onBooksIndexSuccess(response){
    console.log('here\'s the get all books response data', response.data);
    vm.books = response.data.books;
  }
  function onError(error){
    console.log('there was an error: ', error);
  }
};
```

##### What's a view model?

Answer: mainly, that's the version of the data that ties into your page.  In short, the controller manages the page; it's the presentation logic. [view model](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93viewmodel)


##### Why does the controller have to worry so much about `$http` then?

Answer: it shouldn't.


## **Separation of concerns** & **Single Responsibility** or how I learned to use Services

At long last it's time that we moved our data management into a separate concern.  We'll use a **Service** for that.  Our services will be a little bit like the front-end equivalent to our mongoose models.  

Services'll:

  * represent a record or set of records.  
  * manage fetching records as needed

Controllers should not:

  * know where data comes from or how to get it - only who (what) to ask
  * be able to work with `$http` or any other sort of retrieval protocol
 
 
 **Yeah, we're really changing where stuff goes here.**
 
 
## Deferreds and Promises
 
**Deferreds promise** to run the attached callbacks when they finish.

Promises are:

* A way to pass around something that hasn't finished yet; and still be able to attach more 'callbacks' to it.  
* A popular interview topic
* Anything you can `.then( ... )`  on.
* Something that can either be *resolved* or *failed*.

You've seen them before.

##### jQuery and Angular both have implementations of promises as do many other libraries.

There are a few minor provisos.  The various implementations all over javascript land have all been a little bit different.  The good news is, the JS/ES6 community has pretty much settled on standards for this now.

![provisos](http://evolveandsucceed.com/wp-content/uploads/2014/05/03-provisos.gif)

The promise library in Angular is `$q`.

#### `$q` basics

```js
var def = $q.defer();  // create a new 'deferred'

var promise = def.promise;

// elsewhere we can attach a call back
promise.then(successFunction, errorFunction);

// and yet elsewhere we write code to **resolve** the promise
def.resolve(data);
// or **reject** it
def.reject("Failed: ", error);
```

#### Why are we talking about this?

Our services will abstract the *getting* *http* logic away and simply return promises to the controllers.


## Service Implementation

So now we have all the code we need to implement a service for all of our RESTful routes.  
We'll need 5 basic methods:

* query  - gets all of a resource
* get    - gets a specific resource (usually by id)
* remove - removes a resource
* update - alters an existing resource
* save   - store a new instance of a resource

Each of these methods will follow the same basic pattern and return a *promise* to whatever controllers use it.

```js
// basic pattern to follow in query, get, remove, update or save

var def = $q.defer();

$http({ ... }).then(success, error);

// note that this return usually occurs before the $http request has finished.
return def.promise;


function success(response) {
	// ... do stuff
	def.resolve(response.data);	
}
function error(err) {
	// ... do stuff
	def.reject({error: err});
}
```

Later on in your controller code, you can use this.  

```js
// controller.js
MyService.get(id).then(mySuccess, myError)
```

#### Sample Code

```js

BookService.$inject = ['$http', '$q'];
function BookService(   $http,   $q) {
  console.log('service');
  var self = this;  // similar to vm = this, but we're not working with a view-model here so using the 'generic' form for this closure
  self.book = {};
  self.books = [];
  self.query = query;  // get all books
  self.get = get;     // get one book
  self.update = update;  // update a book
  self.remove = remove;  // delete a book

  
  /* * * * * * * * * * * * * * * *
   *  Fetch all books
   *
   * * * * * * * * * * * * * * * */

  function query() {
    console.log('someone requested all the books');
  
    // create a new 'deferred'
    var def = $q.defer();
    // fire off the request
    $http({
      method: 'GET',
      url: 'https://super-crud.herokuapp.com/books'
    }).then(onBooksIndexSuccess, onError);

    // we return the promise here - whenever it's complete any other .then's you attach will get run too
    return def.promise;
    


    // note how these functions are defined within the body of another function?
    // that gives them access to variables from that function
    // - see lexical scope & closures https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures
    function onBooksIndexSuccess(response){
      console.log('here\'s the get all books response data from the service', response.data);
      self.books = response.data.books;
      // ok, we got data, resolve the deferred - at this point we get to choose what we send on to the controller
      def.resolve(self.books);
    }
    function onError(error){
      console.log('there was an error: ', error);
      self.books.error = {error: error};
      // oh noes!  error - reject the deferred - at this point we get to choose what we send on to the controller
      def.reject(self.books.error);
    }
  }




  /* * * * * * * * * * * * * * * *
   *  Fetch a single book
   *
   * * * * * * * * * * * * * * * */

  function get(bookId) {
    console.log('someone requested book', bookId);
  
    var def = $q.defer();  // create a new 'deferred'

    $http({
      method: 'GET',
      url: 'https://super-crud.herokuapp.com/books/'+bookId
    }).then(onBookShowSuccess, onError);

    // we return the promise here - whenever it's complete any other .then's you attach will get run too
    return def.promise;



    // note how these functions are defined within the body of another function?
    // that gives them access to variables from that function
    // - see lexical scope & closures https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures
    function onBookShowSuccess(response) {
      console.log('BookService: here\'s the data for book', bookId, ':', response.data);
      self.book = response.data;
      // ok, we got data, resolve the deferred - at this point we get to choose what we send on to the controller
      def.resolve(self.book);
    }
    function onError(error){
      console.log('there was an error: ', error);
      self.book = {error: error};
      // oh noes!  error - reject the deferred - at this point we get to choose what we send on to the controller
      def.reject(self.book);
    }
  }
```


## ngResource

Great job, you wrote your own service.  

Many sites employ RESTful conventions and in large-part serve things in very similar ways.  So why do we need so much code for this?

It turns out the Angular devs thought of that a long time ago.  ngResource implements a service very similar to the one we just built; with much less code!


#### Using ngResource

1. First add the correct script tag
	`<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.4.8/angular-resource.js"></script>`

1. Include ngResource in your angular module.
	`angular.module('libraryApp', ['ngRoute', 'ngResource'])`

1. List $resource as a dependency for your Service
	`function BookService($http, $q, $resource) {`



```js

angular.module('libraryApp')
  .service('BookService', BookService);

BookService.$inject = ['$http', '$q', '$resource'];
function BookService($http, $q, $resource) {
  console.log('service');
  var self = this;  // similar to vm = this, but we're not working with a view-model here so using the 'generic' form for this closure
  self.book = {};  // we'll let get fill this in when it can
  self.books = [];  // we'll let getAll fill this in when it can
  // self.getAll = index;
  // self.show = show;
  // self.update = update;
  // self.destroy = destroy;
  resource = $resource('https://super-crud.herokuapp.com/books/:id', { id: '@_id' }, {
      update: {
        method: 'PUT' // this method issues a PUT request
      },
      query: {
        isArray: true,
        transformResponse: function(data) {
            return angular.fromJson(data).books; // this grabs the books from the response data: `{books: [...]}`
        }
      }
    });
  return resource;
```
	
#### ngResource resources

* [http://www.sitepoint.com/creating-crud-app-minutes-angulars-resource/](http://www.sitepoint.com/creating-crud-app-minutes-angulars-resource/)
