var ged = angular.module('ionicApp', ['ionic']);

ged.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('connect', {
            url: '/connect',
            templateUrl: 'templates/connect.html',
            controller: 'UserCtrl'
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
                    templateUrl: 'templates/home.html',
                    controller: 'UserCtrl'
                }
            }
        })
        .state('tabs.settings', {
            url: '/settings',
            views: {
                'settings-tab': {
                    templateUrl: 'templates/settings.html',
                    controller: 'UserCtrl'
                }
            }
        });

    $urlRouterProvider.otherwise('/connect');
});

ged.controller('UserCtrl', function ($scope, $state) {
                                                      
    $scope.connect = function (user) {
        if(user == undefined) {
            console.log("No username entered!");
            alert("No username entered!");
            return;
        }
        console.log('Connect', user);
        $state.go('tabs.home');
    };
    
    $scope.disconnect = function (user) {
        console.log('Disconnect', user);
        $state.go('connect');
    };
});
