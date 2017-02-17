var app = angular.module('indexApp', []);

app.controller("indexCtrl", function ($scope, $http) {
    $http.get('/contactList').success(function (response) {
        console.log('client got the data');
        $scope.contactList = response;
    });
    var refresh = function () {
        $http.get('/contactList').success(function (response) {
            console.log('client got the new data');
            $scope.contactList = response;
            $scope.contact = '';
        })
    };
    refresh();

    $scope.addContact = function () {
        console.log($scope.contact);
        $http.post('/contactList', $scope.contact)
            .success(function (response) {
                console.log(response + '-addContact');
                refresh();
            })
            .error(function () {
                console.error(response);
            });
    }

    $scope.remove = function (id) {
        console.log(id);
        $http.delete('/contactList/' + id)
            .success(function (response) {
                console.log(response + '-remove');
                refresh();
            })
            .error(function (response) {
                console.error(response);
            });
    }

    $scope.edit = function (id) {
        console.log(id);
        $http.get('/contactList/' + id)
            .success(function (response) {
                $scope.contact = response;
                console.log(response+ '-edit');
            })
            .error(function (response) {
                console.error(response);
            });
    }

    $scope.update = function () {
        console.log($scope.contact._id);
        $http.put('/contactList/' + $scope.contact._id, $scope.contact).success(function (response) {
            refresh();
            console.log(response + '-update');
        });
    }

    $scope.deselect = function () {
       $scope.contact = '';
    }
})
