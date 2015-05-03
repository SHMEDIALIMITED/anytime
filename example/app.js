angular.module('shm.example.anytime', [
  'shm.animation',
  'ui.router'
])


.config(function ($urlRouterProvider, $locationProvider) {
  $urlRouterProvider.otherwise('/one');
  $locationProvider.html5Mode(true);
})

.config(function($stateProvider, AnytimeProvider) {


  $stateProvider

  .state({
    name : 'one',
    url : '/one',
    templateUrl : 'one.html',
    resolve : {
      // API call fake
      data : function($timeout) {
        return $timeout(angular.noop, 2000)
      },
      // Resolve state element's animtions
      // Has to be last because animations should not trigger if data API call has failed
      anytime : AnytimeProvider.resolve
    }
  })

  .state({
    name : 'two',
    url : '/two',
    templateUrl : 'two.html',
    resolve : {
      data : function($timeout) {
        return $timeout(angular.noop, 2000)
      },
      anytime : AnytimeProvider.resolve
    }
  })

});
