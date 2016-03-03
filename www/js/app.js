var ged = angular.module('ionicApp', ['ionic']);

ged.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('connect', {
      url: '/connect',
      templateUrl: 'templates/connect.html',
      controller: 'ConnectCtrl'
    })
    .state('tabs', {
      url: '/tab',
      abstract: true,
      templateUrl: 'templates/tabs.html'
    })
    .state('tabs.home', {
      url: '/home',
      views: {
        'home-tab': {
          templateUrl: 'templates/home.html'
        }
      }
    })
    .state('tabs.settings', {
      url: '/settings',
      views: {
        'settings-tab': {
          templateUrl: 'templates/settings.html',
          controller: 'SettingsTabCtrl'
        }
      }
    });

   $urlRouterProvider.otherwise('/connect');
});

ged.controller('ConnectCtrl', function($scope, $state) {
  $scope.connect = function(username) {
    console.log('Connect', username);
    $state.go('tabs.home');
  };
});

ged.controller('SettingsTabCtrl', function($scope, $state) {
  $scope.disconnect= function(username) {
    console.log('Disconnect', username);
    $state.go('tabs.connect');
  };
});
