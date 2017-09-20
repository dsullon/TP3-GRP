app.controller('ComboCtrl', function ($scope, ComboFtry) {
    $scope.isLoading = true;
    $scope.showNoData = false;
    ComboFtry.getAll().success(function (data) {
        $scope.listaCombo = data;
        $scope.isLoading = false;
        $scope.showNoData = false;
    }).error(function(err){
        $scope.isLoading = false;
        $scope.showNoData = true;
    });

    $scope.eliminar = function(id){
        alert(id);
    }
})