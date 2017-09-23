app.controller('SimularPrecioCtrl', function ($scope, $stateParams, $state, $modal, ProductoFtry) {
    var id = $stateParams.producto;
    ProductoFtry.getAllPerItem(id).success(function (data) {
        $scope.alertaLista = data;
        $scope.isLoading = false;
        $scope.showNoData = false;
        $scope.items = $scope.alertaLista;
        console.log(data);
    }).error(function(err){
        $scope.isLoading = false;
        $scope.showNoData = true;
        console.log(err);
    });
})