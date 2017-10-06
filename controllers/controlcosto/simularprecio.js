app.controller('SimularPrecioCtrl', function ($scope, $stateParams, $state, $modal, ProductoFtry, controlCostoFtry, simularPrecioFtry) {
    var id = $stateParams.producto;
    $scope.listaArticulo = [];
    $scope.listaInsumos = [];
    $scope.producto;
    $scope.isLoading = true;
    $scope.mensaje = "";
    $scope.showError = false;
    ProductoFtry.getAllPerItem(id).success(function (data) {
        $scope.alertaLista = data;
        $scope.items = $scope.alertaLista;
        for (var i = 0; i < id.length; i++) {
            controlCostoFtry.getUmbralPerId(id[i]).success(function (data) {
                $scope.listaArticulo.push(data);
            }).error(function(err, status){
                if(status == -1){
                    $scope.mensaje = "No se pudo conectar con el servicio.";
                }else{
                    $scope.mensaje = 'Error:' + status + ' - ' + err.Message;
                }
                $scope.showError = true;        
                $scope.isLoading = false;
            });
        }
        $scope.isLoading = false;
    }).error(function(err, status){
        if(status == -1){
            $scope.mensaje = "No se pudo conectar con el servicio.";
        }else{
            $scope.mensaje = 'Error:' + status + ' - ' + err.Message;
        }
        $scope.showError = true;        
        $scope.isLoading = false;
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
        $scope.isLoading = true;
        ProductoFtry.get(id).success(function (data) {
            $scope.producto = data;
            ProductoFtry.getDetails(id).success(function (data) {
                $scope.Insumos = data;
                for(var i = 0; i < $scope.Insumos.length; i++){
                    for(var j = 0; j < $scope.listaArticulo.length; j++){
                        if($scope.Insumos[i].IdArticulo == $scope.listaArticulo[j].Id){
                            $scope.Insumos[i].Costo = $scope.listaArticulo[j].NuevoCosto;
                            $scope.Insumos[i].Importe = parseFloat(($scope.Insumos[i].Cantidad/($scope.Insumos[i].Rendimiento/100))* $scope.Insumos[i].Costo).toFixed(2);
                            continue;
                        }
                    }
                }
                calcularCosto();
                $scope.isLoading = false;
            });
        })
    }

    $scope.actualizar = function(){
        if(!$scope.producto){
            $scope.showError = true;
            $scope.mensaje = 'No se ha seleccionado el producto';
            return;
        }
        if(!$scope.Insumos || $scope.Insumos.length == 0){
            $scope.showError = true;
            $scope.mensaje = 'No se ha ingresado los insumos';
            return;
        }
        $scope.producto.Insumos = $scope.Insumos;
        $scope.isLoading = true;
        ProductoFtry.update($scope.producto).success(function (data) {
            alert("Datos grabados");
            $state.go("app.controlCosto");
            $scope.isLoading = false;
        }).error(function(err, status){
            if(status == -1){
                $scope.mensaje = "No se pudo conectar con el servicio.";
            }else{
                $scope.mensaje = 'Error:' + status + ' - ' + err.Message;
            }
            $scope.showError = true;        
            $scope.isLoading = false;
        });
    }

    function calcularCosto(){
        var porciones = $scope.producto.Porciones;
        var costoTotal = parseFloat(0);
        var ingrediente;
        for (var idx = 0; idx < $scope.Insumos.length; idx++) {
            ingrediente = $scope.Insumos[idx];
            costoTotal += parseFloat(ingrediente.Importe);
        }
        $scope.producto.Costo = parseFloat(costoTotal).toFixed(2);
        $scope.producto.CostoUnitario = parseFloat(costoTotal/porciones).toFixed(2);
        $scope.producto.Precio = parseFloat((costoTotal * 0.30) +  costoTotal).toFixed(2);
    }
})