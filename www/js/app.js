var ged = angular.module('ionicApp', ['ionic', 'calHeatmap']);

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

ged.factory("UserInfo", function ($http, $filter) {
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

    factory.stats = {
        streak: 0,
        streakOngoing: false,
        committedToday: false,
        lastUpdated: ""
    };

    factory.validate = function () {
        return $http.get("https://api.github.com/users/" + factory.username);
    };

    factory.getRepos = function () {
        return $http.get("https://api.github.com/users/" + factory.username + "/repos");
    };

    factory.getContributions = function () {
        return $http.get("https://github.com/users/jazzkr/contributions");
    };

    factory.updateContributions = function (info, response) {
        var tmp = document.implementation.createHTMLDocument();
        tmp.body.innerHTML = response.data;
        var items = $(tmp.body.children).find('rect');
        var contributions = [];
        for (var i = 0; i < items.length; i++){
            var contribution = {
                date: $(items[i]).attr('data-date'),
                count: $(items[i]).attr('data-count')
            };
            contributions.push(contribution);
        };
        info.contributions = contributions;
        console.log(contributions);
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
        info.stats.lastUpdated = response.data.updated_at;
        info.getRepos().then(function(response){
            info.repos = response.data;
        }, function(err){
            console.log("Error getting repos!");
        });
        info.getContributions().then(function(response){
            info.updateContributions(info, response);
        }, function(err){
            console.log("Error getting contributions!");
        });
    };

    factory.populateStats = function(info){
        var count = 0;
        var d = new Date();
        var dString = $filter('date')(d, "yyyy-MM-dd");
        console.log(d);
        console.log(dString);
        for(var i = 0; i < info.contributions.length; i++){

        };
    };

    return factory;
});

ged.controller('UserCtrl', function ($scope, $state, UserInfo, $ionicLoading, $window){

    $scope.stats = {
        streak: 0,
        commits_today: 0,
        commits_year: 0
    };

    $scope.cal_config = {
      domain: 'year',
      range: 1,
      cellSize: Math.floor($window.innerWidth/52),
      subDomainTextFormat: ' '
    };
    console.log($scope.cal_config.cellSize);

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

    $scope.scrape = function(){
/*        UserInfo.getContributions().then(function(response){
            UserInfo.updateContributions(UserInfo, response);
        }, function(err){
            console.log("Error getting contributions!");
            $state.go('connect');
        });*/
        UserInfo.populateStats(UserInfo);
    };

    $scope.refresh = function() {
        UserInfo.validate().then(function(response){
            UserInfo.updateInfo(UserInfo, response);
            console.log(UserInfo);
        }, function(err){
            UserInfo.validated = false;
            $state.go('connect');
        });
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$apply();
    };

});
