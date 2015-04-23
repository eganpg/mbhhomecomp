'use strict';

angular.module('homestagerApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
    $scope.awesomeThings = [];

    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
      socket.syncUpdates('thing', $scope.awesomeThings);
    });

    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });

    $scope.parse = function(jsonObj){
      console.log('parse');
      

      $http.get('/api/things/parse').success(function(address){ 
        console.log('success');
        $scope.jsonObj = address;
      }).error(function(){console.log('help')});
    }

    $scope.getzillow = function(results){
      $http.get('/api/things/getzillow/' + results).success(function(res){
        $scope.response = res;
      }).error(function(){console.log('fuck zillow error')});
    }

    $scope.goDetails = function(addy){
      window.open(addy)
    }

    $scope.graphs = function(addy){
      window.open(addy)
    }

    $scope.map = function(addy){
      window.open(addy)
    }

    $scope.find = function(addy){
      window.open(addy)
    }

    $scope.mapthis = function(addy){
      $http.get('/api/things/parse').success(function(address){ 
        console.log('success');
        console.log(address);
      }).error(function(){console.log('help')});
    }
  });
