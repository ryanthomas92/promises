angular.module('qPromiseApp', [])
  .controller('CountController', CountController);

CountController.$inject = ['$q'];
function CountController($q){
  var vm = this;

  vm.addOne = function(num){
    console.log('addOne on ', num);
    // set up deferred
    var deferred = $q.defer();

    // do some work...
    // ... not much to do before we decide how to resolve and reject the task

    // in what case(s) should the deferred be resolved (success)?
    if (angular.isNumber(num)){
      // what argument should the promise success function use?
      var result = num+1;
      console.log('... resolved with result', result);
      deferred.resolve(result);
    }

    // in what case(s) should the deferred be rejected (error)?
    else {
      // what argument should the promise error function use?
      console.log('... rejected');
      deferred.reject(NaN);
    }

    // return the promise
    return deferred.promise;
  }

  vm.square = function(num){
    var deferred = $q.defer();
    if (angular.isNumber(num)) {
      var result = Math.pow(num, 2);
      console.log('... resolved with result', result);
      deferred.resolve(result);
    }
    else {
      console.log('... rejected');
      deferred.reject(NaN);
    }
    return deferred.promise;
  }

  vm.value = 0;    // should calculate value
  // vm.value = 'c';  // should give value NaN
  vm.addOne(vm.value)       // returns a promise
    .then(vm.addOne)        // returns a promise
    .then(vm.square)        // returns a promise
    .then(vm.addOne)        // returns a promise
    .then(success, error);


  function success(val){
    console.log('success, value is now', val);
    vm.value = val;  // update displayed value to be result
  }

  function error(err){
    console.log('error, value was', vm.value, '(', err, ')');
    vm.value = err;
    return err;
  }
}
