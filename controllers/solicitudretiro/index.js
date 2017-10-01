app.controller('SolicitudRetiroCtrl', function ($scope, SolicitudRetiroFtry) {
    $scope.isLoading = true;
    $scope.showNoData = false;
    SolicitudRetiroFtry.getAll().success(function (data) {
        $scope.listaSolicitudRetiro = data;
        $scope.isLoading = false;
        $scope.showNoData = false;
        console.log(data);
    }).error(function(err){
        $scope.isLoading = false;
        $scope.showNoData = true;
    });

 /*   $scope.eliminar = function (index) {
        var index = $scope.Insumos.indexOf(insumo);
        $scope.listaSolicitudRetiro.splice(index, 1);
        calcularCosto();
        calcularRendimientoNutricional();
    }
    */
})