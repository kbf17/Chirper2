
    var app = angular.module('myApp', ["ngRoute",]);

    app.config(function($routeProvider) {
        $routeProvider
        .when("/", {
            templateUrl : "../views/home.html"
        })
        .when("/list", {
            templateUrl : "../views/list.html",
        })
        .when("/single/:id", {
            templateUrl: '../views/single.html',

        })
    });


    app.controller('ChirpsController', function($scope, $http, $location) {
        $http.get("http://localhost:3000/api/chirps")
        .then(function(response){
            $scope.chirpList = response.data;
            console.log('success');   
            console.log(response);
        })
        .catch(function(error){
            alert('Uh oh, no chirps here!')
        });
        $scope.ClickMe = function(id){
            $location.path('/single/' + id)
        };
        $scope.DeleteChirp = function(id){
            console.log('click');
            var url = "http://localhost:3000/api/chirps/";
             var data = $.param({
                name: $scope.name,
                message: $scope.message,
                id: $scope.id
            });
            if(confirm('Do you really want to do that?') == true) {
                $http.delete(url + id, JSON.stringify(data)).then(function (response){
                    console.log(response);
                });
            } else {
                alert('Good choice!');
            }
    }
    });

    app.controller('SingleController', ['$scope', '$routeParams', '$http', function($scope, $routeParams, $http){
    id = $routeParams.id;    
     var url = "http://localhost:3000/api/chirps/"
        $http.get(url+id)
        .then(function(response){
            $scope.chirps = response.data;
            console.log('single loaded');
        })
    }])

    app.controller('PushController', function($scope, $http){
        $scope.SendChirp = function(){
            var data = ({
                user : $scope.user,
                message : $scope.message
            });
            $http.post("http://localhost:3000/api/chirps", data)
            .then(function(response){
                console.log(response);
                alert('Chirp sent!');
            });
        }
    });


