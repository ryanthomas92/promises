angular.module('qPromiseApp', [])
  .controller('CountController', CountController);

CountController.$inject = ['$q'];
function CountController($q){
  var vm = this;

  vm.addOne = function(num){
    console.log('addOne on', num);
    var deferred = $q.defer();

    if (angular.isNumber(num)){
      var result = num+1;
      console.log('... resolved with result', result);
      deferred.resolve(result);
    } else {
      console.log('... rejected');
      deferred.reject(NaN);
    }

    return deferred.promise;
  }

  vm.square = function(num){
    console.log('square on ', num);
    var deferred = $q.defer();
    if(angular.isNumber(num)){
      var result = num * num;
      console.log('... resolved with result', result);
      deferred.resolve(result);
    } else {
      console.log('... rejected');
      deferred.reject('NaN');
    }
    return deferred.promise;
  }


  vm.value = 0;    // should calculate value
  // vm.value = 'c';  // should give value NaN
  vm.addOne(vm.value)       // returns a promise
    .then(vm.addOne)        // returns a promise
    .then(vm.addOne)        // returns a promise
    .then(vm.square)        // returns a promise
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
