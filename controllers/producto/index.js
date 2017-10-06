app.controller('ProductoCtrl', function ($scope, ProductoFtry) {
    $scope.isLoading = true;
    $scope.showError = false;
    $scope.mensaje = "";
    $scope.currentPage = 1;
    $scope.itemsPerPage = 10;
    $scope.maxSize = 5; //Number of pager buttons to show
    ProductoFtry.getAll().success(function (data) {
        $scope.listaProducto = data;
        $scope.totalItems = $scope.listaProducto.length;
        $scope.isLoading = false;
        $scope.showError = false;
        $scope.mensaje = "";
    }).error(function(err, status){
        if(status == -1){
            $scope.mensaje = "No se pudo conectar con el servicio.";
        }else{
            $scope.mensaje = 'Error:' + status + ' - ' + err.Message;
        }
        $scope.showError = true;        
        $scope.isLoading = false;
    })

    $scope.eliminar = function(id){
        alert(id);
    }
})