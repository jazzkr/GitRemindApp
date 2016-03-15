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

ged.service("UserInfo", function ($http, $filter) {

    var UserInfo = this;

    var username = "";
    var validated = false;
    var id = "";
    var avatar_url = "";
    var url = "";
    var html_url = "";
    var repos = [];
    var contributions = [];
    var name = "";
    var company = "";
    var email = "";
    var bio = "";

    var stats = {
        streak: 0,
        streakOngoing: false,
        committedToday: false,
        lastUpdated: "",
        heatmapJSON: []
    };

    this.setUsername = function(name) {
        username = name;
    };

    this.validate = function () {
        return $http.get("https://api.github.com/users/" + username);
    };

    this.getReposFromGithub = function () {
        return $http.get("https://api.github.com/users/" + username + "/repos");
    };

    this.getContributionsFromGithub = function () {
        return $http.get("https://github.com/users/" + username + "/contributions");
    };

    this.updateContributions = function (response) {
        var tmp = document.implementation.createHTMLDocument();
        tmp.body.innerHTML = response.data;
        var items = $(tmp.body.children).find('rect');
        var contributions_tmp = [];
        for (var i = 0; i < items.length; i++){
            var contribution = {
                date: $(items[i]).attr('data-date'),
                count: $(items[i]).attr('data-count')
            };
            contributions_tmp.push(contribution);
        };
        contributions = contributions_tmp;
        console.log(contributions);
    };

    this.updateInfo = function(response){
        validated = true;
        id = response.data.id;
        avatar_url = response.data.avatar_url;
        url = response.data.url;
        html_url = response.data.html_url;
        name = response.data.name;
        company = response.data.company;
        email = response.data.email;
        bio = response.data.bio;
        stats.lastUpdated = response.data.updated_at;
        this.getReposFromGithub().then(function(response){
            repos = response.data;
        }, function(err){
            console.log("Error getting repos!");
        });
        this.getContributionsFromGithub().then(function(response){
            UserInfo.updateContributions(response);
        }, function(err){
            console.log("Error getting contributions!");
        }).finally(function(){
          console.log("Formatting contributions!");
          UserInfo.formatContributionsForHeatmap();
        });
    };

    this.populateStats = function(info){
        var count = 0;
        var d = new Date();
        var dString = $filter('date')(d, "yyyy-MM-dd");
        console.log(d);
        console.log(dString);
        for(var i = 0; i < info.contributions.length; i++){

        };
    };

    this.formatContributionsForHeatmap = function(){
        var dataInJSON = [];
        if(contributions.length <= 0) return;
        for(var i = 0; i < contributions.length; i++){
            var parts = contributions[i].date.split('-');
            var d = new Date(parts[0], parts[1]-1, parts[2]);
            var datestamp = Math.round(d.getTime() / 1000);
            dataInJSON[String(datestamp)] = parseInt(contributions[i].count);
            console.log("Original: ", contributions[i].date);
            console.log("Timestamp'd: ", datestamp);
        };
        stats.heatmapJSON = dataInJSON;
    };

    this.getJSON = function() {
      return stats.heatmapJSON;
    }
});

ged.controller('UserCtrl', function ($scope, $state, UserInfo, $ionicLoading, $window){

    $scope.info = UserInfo;

    $scope.stats = {
        streak: 0,
        commits_today: 0,
        commits_year: 0
      };

    $scope.cellSize = 12;
    $scope.colLimit = 10 - Math.floor($window.innerWidth / $scope.cellSize);
    $scope.maxDate = new Date(Date.now());
    $scope.minDate = new Date($scope.maxDate);
    $scope.minDate.setDate($scope.minDate.getDate() - 365);

    $scope.cal_config = {
      domain: 'month',
      range: 13,
      cellSize: $scope.cellSize,
      colLimit: 4,
      start: $scope.minDate,
      minDate: $scope.minDate,
      maxDate: $scope.maxDate,
      considerMissingDataAsZero: false,
      subDomainTextFormat: ' ',
      data: []
    };

    $scope.connect = function (user){
        $scope.info.setUsername(user.name)
        console.log('Connect', user);
        $ionicLoading.show({ template: '<ion-spinner></ion-spinner>' });
        $scope.info.validate().then(function(response){
            $scope.info.updateInfo(response);
            $state.go('tabs.home');
            console.log(UserInfo);
        }, function(err){
            $scope.info.validated = false;
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
        info.populateStats(UserInfo);
    };

    $scope.refresh = function() {
        $scope.info.validate().then(function(response){
            $scope.info.updateInfo(response);
            console.log(UserInfo);
        }, function(err){
            $scope.info.validated = false;
            $state.go('connect');
        });
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$apply();
    };

    $scope.$watch('info.getJSON()', function(newData) {
      $scope.cal_config.data = newData;
      console.log("updated data!");
    });

});
