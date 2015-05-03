'use strict';

(function(ns){


  var pkgName = 'shm.anytime';
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
  }



  module.provider('Anytime',function() {
    this.resolve = ['Anytime', '$timeout', function(Anytime, $timeout) {
      var items = Anytime.release();
      var highest = items.reduce(function(a,b) {
        return a > b ? a : b;
      }, 0);
      return $timeout(angular.noop, highest);
    }];
    this.$get = ['ANYTIME','$rootScope', function(ANYTIME, $rootScope) {
      return new Anytime(ANYTIME, $rootScope);
    }];
  });



  module.directive('anytime', ['Anytime', '$rootScope', 'ANYTIME', '$timeout', function(Anytime, $rootScope, ANYTIME, $timeout) {
    return {
      restrict: 'A',
      link : function(scope, element, attr) {
        if(!angular.isNumber(parseInt(attr.anytime))) {
          throw new Error('anytime attribute needs to be a number');
        }
        if(!angular.isString(attr.anytimeClass)) {
          throw new Error('anytime-class attribute needs to be a string');
        }
        var time = attr.anytimeDelay ? parseInt(attr.anytime) + parseInt(attr.anytimeDelay) : parseInt(attr.anytime)
        Anytime.addItem(time);
        var unlisten = $rootScope.$on(ANYTIME.START, function() {
          if(attr.anytimeDelay && angular.isNumber(parseInt(attr.anytimeDelay))) {
            $timeout(function() {
              element.addClass(attr.anytimeClass);
            }, parseInt(attr.anytimeDelay))
          } else {
            element.addClass(attr.anytimeClass);
          }
        });

        scope.$on('$destroy', function() {
          unlisten();
        });
      }
    }
  }])


})(window);
