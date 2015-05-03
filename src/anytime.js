'use strict';

(function(ns){


  var pkgName = 'shm.animation';
  var module = ns.angular.module(pkgName, []);


  // Events
  module.constant('ANYTIME', {
    START : pkgName + '.events.start',
    ADD : pkgName + '.events.add',
  });



  // Animation Manager Class
  var Anytime = function(ANYTIME, $rootScope){

    // Times in ms for each element registered on current state
    var items = [];

    this.addItem = function(item) {
      items.push(item);
    };

    // Called by resolve
    this.release = function() {
      $rootScope.$emit(ANYTIME.START);
      var itemsToRelease = items.slice();
      items.length = 0;
      return itemsToRelease;
    };

    $rootScope.$on(ANYTIME.ADD, this.addItem);
  }



  module.provider('Anytime',function() {

    this.resolve = ['Anytime', '$timeout', function(Anytime, $timeout) {
      var items = Anytime.release();
      var total = items.reduce(function(a,b) {
        a += b;
        return a;
      }, 0);
      return $timeout(angular.noop, 0);
    }];

    this.$get = ['ANYTIME','$rootScope', function(ANYTIME, $rootScope) {
      return new Anytime(ANYTIME, $rootScope);
    }];

  });



  module.directive('anytime', function(Anytime) {
    return {
      restrict: 'A',
      link : function(scope, el, attr) {
        if(!angular.isNumber(attr.anytime)) {
          throw new Error('Anytime directive needs a number');
        }
        Anytime.addItem(parseInt(attr.anytime));
      }
    }
  })


  // module.config(function($stateProvider, $provide, AnytimeProvider) {

  //   $provide.decorator('$state', function($delegate) {
  //     var originalTransitionTo = $delegate.transitionTo;
  //     $delegate.transitionTo = function(to, toParams, options) {
  //       return originalTransitionTo(to, toParams, angular.extend({
  //         reload: true
  //       }, options));
  //     };
  //     return $delegate;
  //   });

  // })


})(window);
