app.controller('SimularPrecioCtrl', function ($scope, $stateParams, $state, $modal, ProductoFtry, simularPrecioFtry) {
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

    $scope.alertaLista = [];
    $scope.selected = {
        item: $scope.alertaLista[0]
    };
    $scope.totalItems = $scope.alertaLista.length;
    $scope.currentPage = 1;
    $scope.itemsPerPage = 4;
    $scope.maxSize = 5; //Number of pager buttons to show

    $scope.productoDetalle = function(id){  
        /*console.log(id);
        var idd = $stateParams.id;*/
        //$scope.isLoading = true;
        simularPrecioFtry.getDetails(id).success(function (data) {
            $scope.listaInsumos = data;
            console.log(data);
        });
    }

})