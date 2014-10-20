'use strict';


// Declare app level module which depends on filters, and services
var sharkapp = angular.module('myApp', [
  'ngRoute',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers',

]);

sharkapp.config(['$routeProvider', function($routeProvider) {
  /*delete $httpProvider.defaults.headers.common['X-Requested-With'];*/

  $routeProvider.when('/query', {templateUrl: 'partials/query.html', controller: 'QueryCtrl'});
  $routeProvider.when('/monitoring', {templateUrl: 'partials/monitoring.html', controller: 'MonitoringCtrl'});
  $routeProvider.when('/modelling', {templateUrl: 'partials/modelling.html', controller: 'ModellingCtrl'});
  $routeProvider.when('/job', {templateUrl: 'partials/stages.html', controller: 'StagesCtrl'});
  $routeProvider.when('/stages', {templateUrl: 'partials/stages.html', controller: 'StagesCtrl'});
  $routeProvider.when('/storage', {templateUrl: 'partials/storage.html', controller: 'StagesCtrl'});
  $routeProvider.when('/workers', {templateUrl: 'partials/workers.html', controller: 'StagesCtrl'});
  $routeProvider.when('/performance', {templateUrl: 'partials/errors.html', controller: 'StagesCtrl'});
  $routeProvider.when('/errors/:Id', {templateUrl: 'partials/errors.html', controller: 'StagesCtrl'})
  $routeProvider.when('/stage',{templateUrl:'partials/stage.html',controller:'StagesCtrl'})
  $routeProvider.when('/overtime', {templateUrl: 'partials/overtime.html', controller: 'StagesCtrl'});
  $routeProvider.when('/shuffle',{templateUrl:'partials/shuffle.html',controller:'StagesCtrl'})
  $routeProvider.when('/errors',{templateUrl:'partials/errors.html',controller:'StagesCtrl'})
  $routeProvider.when('/workerstatus',{templateUrl:'partials/workerstatus.html',controller:'StagesCtrl'})
  $routeProvider.when('/cached',{templateUrl:'partials/cached.html',controller:'StagesCtrl'})
   $routeProvider.when('/executers',{templateUrl:'partials/executors.html',controller:'StagesCtrl'})
  $routeProvider.when('/jobs',{templateUrl:'partials/jobs.html',controller:'StagesCtrl'})
  $routeProvider.when('/querystructure',{templateUrl:'partials/querystructure.html',controller:'StagesCtrl'})
  $routeProvider.when('/collapse',{templateUrl:'partials/collapse.html',controller:'StagesCtrl'})
  $routeProvider.otherwise({redirectTo: '/job'});
}]);


