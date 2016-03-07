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

ged.factory("UserInfo", function($http) {
    var factory = {};
    
    factory.username = "";
    factory.validated = false;
    factory.id = "";
    factory.avatar_url = "";
    factory.url = "";
    factory.html_url = "";
    factory.repos = [];
    factory.contributions = [];
    factory.name = "";
    factory.company = "";
    factory.email = "";
    factory.bio = "";
    factory.lastUpdated = "";
    
    factory.validate = function(){
        return $http.get("https://api.github.com/users/"+factory.username);
    };
    
    factory.getRepos = function(){
        return $http.get("https://api.github.com/users/"+factory.username+"/repos");
    };
    
    factory.getContributions = function(){
        return $http.get("https://github.com/users/jazzkr/contributions");
    };
    
    factory.updateInfo = function(info, response){
        info.validated = true;
        info.id = response.data.id;
        info.avatar_url = response.data.avatar_url;
        info.url = response.data.url;
        info.html_url = response.data.html_url;
        info.name = response.data.name;
        info.company = response.data.company;
        info.email = response.data.email;
        info.bio = response.data.bio;
        info.lastUpdated = response.data.updated_at;
        info.getRepos().then(function(response){
            info.repos = response.data;
        }, function(err){
            console.log("Error getting repos!");
        });
        info.getContributions().then(function(response){
            console.log(response);
            var tmp = document.implementation.createHTMLDocument();
            tmp.body.innerHTML = response.data;
            var items = $(tmp.body.children).find('day li');
            var contributions = [];
            for(var i = 0; i < items.length; i++){
                var contribution = {
                    date: $(items[i]).children('data-date')[0].innerText,
                    count: $(items[i]).children('data-count')[0].innerText
                };
                contributions.push(contribution);
            }
            
        }, function(err){
            console.log("Error getting contributions!");
        });
    };
    
    
    
    return factory;
});

ged.controller('UserCtrl', function ($scope, $state, UserInfo, $ionicLoading){
    
    $scope.connect = function (user){
        UserInfo.username = user.name;
        console.log('Connect', user);
        $ionicLoading.show({ template: '<ion-spinner></ion-spinner>' });
        UserInfo.validate().then(function(response){
            UserInfo.updateInfo(UserInfo, response);
            $state.go('tabs.home');
            console.log(UserInfo);
        }, function(err){
            UserInfo.validated = false;
            $scope.validated = false;
        }).finally(function(){
            $ionicLoading.hide();
        });
    };
    
    $scope.disconnect = function(){
        console.log('Disconnect', UserInfo.username);
        $state.go('connect');
    };
});
