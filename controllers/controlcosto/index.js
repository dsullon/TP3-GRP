app.controller('controlCostoCtrl', function ($scope, $state, controlCostoFtry,filterFilter) {
    $scope.isLoading = true;
    $scope.showNoData = false;
    $scope.enviar = [];
    controlCostoFtry.getAll().success(function (data) {
        $scope.alertaLista = data;
        $scope.isLoading = false;
        $scope.showNoData = false;
        $scope.items = $scope.alertaLista;
    }).error(function(err){
        console.log(err);
        $scope.isLoading = false;
        $scope.showNoData = true;
    });

    $scope.eliminar = function(id){
        alert(id);
    }

    $scope.busqueda = {
        nombre: ''
    };

    $scope.buscar = function () {
        $scope.alertaLista = filterFilter($scope.items, {Nombre: $scope.busqueda.nombre});
        console.log($scope.busqueda.nombre);
        console.log($scope.alertaLista);
    };

    $scope.productos = function(){
        var ids = [];
        for (var i = 0; i < $scope.enviar.length; i++) {
            ids.push(
                {
                    'id': $scope.enviar[i]
                }
            );
        };
        $state.go('app.simularprecio', {producto: $scope.enviar});
    }

})