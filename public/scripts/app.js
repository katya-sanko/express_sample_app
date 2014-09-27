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
        templateUrl: 'views/login.html',
        controller: 'authController'
      })
      .when('/logout', {
        templateUrl: 'views/logout.html',
        controller: 'authController'
      })
      .when('/signup', {
        templateUrl: '',
        controller: 'authController'
      })
      .when('/', {
        template: '<h2>Ninhao</h2>',
        controller: 'authController'
      })
      .when('/hello', {
        templateUrl: '',
        controller: 'authController'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
;
