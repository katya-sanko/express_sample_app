'use strict';

angular
  .module('sampleApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/login', {
        templateUrl: '/views/login.html',
        controller: 'authController'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
;
