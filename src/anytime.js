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
  var Anytime = function(ANYTIME, $rootScope, config){
    this.config = config;
    // Times in ms for each element registered on current state
    var items = [];
    this.addItem = function(item) {
      items.push({
        time : item,
        index : items.length
      });
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
    var config = {};
    this.setDefaults = function(c) {
      config.time = c.time || 200;
      config.class = c.class || 'anytime';
      config.delay = c.delay || 0;
    };
    this.resolve = ['Anytime', '$timeout', function(Anytime, $timeout) {
      var items = Anytime.release();
      var highest = items.reduce(function(a,b) {
        return a.time > b.time ? a : b;
      }, {time:0});
      return $timeout(angular.noop, highest.time + items.length * Anytime.config.delay);
    }];
    this.$get = ['ANYTIME','$rootScope', function(ANYTIME, $rootScope) {
      return new Anytime(ANYTIME, $rootScope, config);
    }];
  });



  module.directive('anytime', ['Anytime', '$rootScope', 'ANYTIME', '$timeout', function(Anytime, $rootScope, ANYTIME, $timeout) {
    return {
      restrict: 'A',
      link : function(scope, element, attr) {
        attr.anytime = attr.anytime || Anytime.config.time;
        if(!angular.isNumber(parseInt(attr.anytime))) {
          throw new Error('anytime attribute needs to be a number');
        }
        attr.anytimeClass = attr.anytimeClass ? Anytime.config.class + ' ' + attr.anytimeClass : Anytime.config.class;
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
