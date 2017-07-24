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
    .when("/user/:user", {
        templateUrl: '../views/user.html'
    });
})
    .run(function($rootScope){
        $rootScope.api = 'http://localhost:3000/api/chirps';
});


app.controller('ChirpsController', ['$rootScope', '$http', '$scope', '$location', function($rootScope, $http, $scope, $location) {
    $http.get($rootScope.api)
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
        var data = $.param({
            name: $scope.name,
            message: $scope.message,
            id: $scope.id,
            date: $scope.date
        });
        if(confirm('Do you really want to do that?') == true){
            $http({
            method: 'DELETE',
            url: $rootScope.api + '/one/' + id
            });
        } else{
            alert('Good choice!');
        };
    };
}]);

app.controller('SingleController', ['$rootScope', '$scope', '$routeParams', '$http', function($rootScope, $scope, $routeParams, $http){
id = $routeParams.id;    
    $http.get($rootScope.api +'/one/' +id)
    .then(function(response){
        $scope.chirps = response.data;
        console.log('single loaded');
    })
}])

app.controller('PushController', function($scope, $http, $rootScope){
    $scope.SendChirp = function(){
        if ($scope.user === '' || $scope.message === ''){
          alert("Must submit user and message!");  
        }else{
            var data = ({
                user : $scope.user,
                message : $scope.message,
                date: Date.now(),
                imgURL: $scope.imgURL
            });
            $http.post($rootScope.api, data)
            .then(function(response){
                console.log(response);
                alert('Chirp sent!');
                $('#name-input').val('');
                $('#chirp-input').val('');
            });
        }
    }
});

app.controller('UserController', ['$rootScope', '$scope', '$routeParams', '$http', '$location', function($rootScope, $scope, $routeParams, $http, $location){
    $http.get('http://localhost:3000/api/users')
    .then(function(response){
        $scope.userList = response.data;
        console.log(response.data);
    });
    $scope.UserPage = function(user){
        $location.path('/user/' + user)
    };
}]);

app.controller('OneUserController', ['$scope', '$routeParams', '$http', '$rootScope', '$location', function($scope, $routeParams, $http, $rootScope, $location){
    user = $routeParams.user;
    $http.get('http://localhost:3000/api/chirps/user/' + user)
    .then(function(response){
        console.log(response);
        console.log(response.data);
        $scope.userChirps = response.data;
    });
    $scope.DeleteChirp = function(id){
    console.log('click');
    var data = $.param({
        name: $scope.name,
        message: $scope.message,
        id: $scope.id,
        date: $scope.date
    });
    if(confirm('Do you really want to do that?') == true){
        $http({
        method: 'DELETE',
        url: $rootScope.api + '/one/' + id
        });
    } else{
        alert('Good choice!');
    };
    };
    $scope.DeleteHistory = function(user){
        user = $routeParams.user;
        if(confirm("Are you sure you want to delete user history?") == true){
            if(confirm("This action cannot be undone. Delete history?") == true){
                $http.delete('http://localhost:3000/api/chirps/user/' + user),
                $location.path('/');
            } else{
                alert('User History intact.')
            };
        } else{
            alert('User History intact.')
        };
    }
}])


