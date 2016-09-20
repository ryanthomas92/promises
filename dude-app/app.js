angular.module('qPromiseApp', [])
  .controller('DudeController', DudeController);

DudeController.$inject = ['$q'];
function DudeController($q){
  var vm = this;

  function task(str){ // set up a function to use with promises
    var deferred = $q.defer();  // create a new 'deferred'
    // do some work...
    console.log(str);
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

  task("dude")  // returns a promise
    // .then(task) // returns a promise
    .then(success, error);

  function success(resolveReturnValue){
    console.log('resolved!', resolveReturnValue);
  }

  function error(rejectReturnValue){
    console.log('rejected!', rejectReturnValue);
  }
}
