app.controller('ComboCtrl', function ($scope, ComboFtry) {
    $scope.isLoading = true;
    $scope.showNoData = false;
    ComboFtry.getAll().success(function (data) {
        $scope.listaCombo = data;
        $scope.isLoading = false;
        $scope.showNoData = false;
        $scope.totalItems = $scope.listaCombo.length;
    }).error(function(err){
        $scope.isLoading = false;
        $scope.showNoData = true;
    });

    $scope.eliminar = function(id){
        alert(id);
    }

    $scope.currentPage = 1;
    $scope.itemsPerPage = 10;
    $scope.maxSize = 5; //Number of pager buttons to show
})