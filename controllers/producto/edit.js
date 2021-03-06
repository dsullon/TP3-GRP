app.controller('ProductoEditarCtrl', function ($scope, $stateParams, $state, $modal, ProductoFtry, 
    ArticuloFtry, CategoriaFtry, NutricionalFtry) {
    var id = $stateParams.id;
    $scope.isLoading = true;
    ProductoFtry.get(id).success(function (data) {
        $scope.producto = data;
        ArticuloFtry.getAll().success(function (data) {
            $scope.listaArticulo = data;
            CategoriaFtry.getAll().success(function (data) {
                $scope.listaCategoria = data;
                $scope.isLoading = false;
            }).error(function(err, status){
                if(status == -1){
                    $scope.mensaje = "No se pudo conectar con el servicio.";
                }else{
                    $scope.mensaje = 'Error:' + status + ' - ' + err.Message;
                }
                $scope.showError = true;        
                $scope.isLoading = false;
            })
        });
        ProductoFtry.getDetails(id).success(function (data) {
            $scope.Insumos = data;
            calcularCosto();
        }).error(function(err, status){
            if(status == -1){
                $scope.mensaje = "No se pudo conectar con el servicio.";
            }else{
                $scope.mensaje = 'Error:' + status + ' - ' + err.Message;
            }
            $scope.showError = true;        
            $scope.isLoading = false;
        })
    }).error(function(err, status){
        if(status == -1){
            $scope.mensaje = "No se pudo conectar con el servicio.";
        }else{
            $scope.mensaje = 'Error:' + status + ' - ' + err.Message;
        }
        $scope.showError = true;        
        $scope.isLoading = false;
    });

    $scope.open = function (size) {
        if(isNaN($scope.producto.Porciones)){
            $scope.showAlert = true;
            $scope.alert.type = 'warning';
            $scope.alert.msg = 'No se ha ingresado el número de porciones';
            return;
        }
        var modalInstance = $modal.open({
            templateUrl: 'modalContent.html',
            controller: 'ModalInstanceCtrl',
            size: size,
            resolve: {
                items: function () {
                    return $scope.listaArticulo;
                }
            }
        });
        modalInstance.result.then(function (selectedItem) {
            //$scope.selected = selectedItem;
            NutricionalFtry.get(selectedItem.item.Id).success(function (data) {
                var nuevoIngrediente = {};
                nuevoIngrediente.IdArticulo = selectedItem.item.Id;
                nuevoIngrediente.Nombre = selectedItem.item.Nombre;
                nuevoIngrediente.Cantidad = parseFloat(selectedItem.cantidad).toFixed(3);
                nuevoIngrediente.UnidadMedida = selectedItem.item.UnidadMedida;
                nuevoIngrediente.Costo = (selectedItem.item.Costo).toFixed(2);
                nuevoIngrediente.Rendimiento = parseFloat(selectedItem.rendimiento).toFixed(2);
                nuevoIngrediente.Importe = parseFloat((nuevoIngrediente.Cantidad/(nuevoIngrediente.Rendimiento/100))* nuevoIngrediente.Costo).toFixed(2);
                nuevoIngrediente.Calorias = parseFloat(data.Calorias * nuevoIngrediente.Cantidad);
                nuevoIngrediente.Carbohidratos = parseFloat(data.Carbohidratos * nuevoIngrediente.Cantidad);
                nuevoIngrediente.Grasas = parseFloat(data.Grasas * nuevoIngrediente.Cantidad);
                nuevoIngrediente.Proteinas = parseFloat(data.Proteinas * nuevoIngrediente.Cantidad);
                $scope.Insumos.push(nuevoIngrediente);
                calcularCosto();
                calcularRendimientoNutricional();
            });
            
        }, function () {
            //console.log('Modal dismissed at: ' + new Date());
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

    function calcularRendimientoNutricional(){
        var rendimientoTotal = parseFloat(0);
        var calorias = parseFloat(0);
        var carbohidratos = parseFloat(0);
        var grasas = parseFloat(0);
        var proteinas = parseFloat(0);
        var cantidadInsumos = $scope.Insumos.length;
        for (var idx = 0; idx < $scope.Insumos.length; idx++) {
            ingrediente = $scope.Insumos[idx];
            rendimientoTotal += parseFloat(ingrediente.Rendimiento);
            calorias += parseFloat(ingrediente.Calorias);
            carbohidratos += parseFloat(ingrediente.Carbohidratos);
            grasas += parseFloat(ingrediente.Grasas);
            proteinas += parseFloat(ingrediente.Proteinas);
        }
        $scope.producto.Calorias = parseFloat(calorias).toFixed(2);
        $scope.producto.Carbohidratos = parseFloat(carbohidratos).toFixed(2);
        $scope.producto.Grasas = parseFloat(grasas).toFixed(2);
        $scope.producto.Proteinas = parseFloat(proteinas).toFixed(2);
        $scope.producto.Rendimiento = parseFloat(rendimientoTotal / cantidadInsumos).toFixed(2);
    }

    $scope.grabar = function(){
        var msg="";
        if($scope.producto.IdCategoria <= 0){
            msg += 'No se han completado los datos.\n';
        }       
        if(!$scope.producto.Nombre.replace(/ /g,'')){
            msg += 'No se ha ingresado el nombre del producto.\n';
        }
        if(isNaN($scope.producto.Porciones) || $scope.producto.Porciones < 1){
            msg += 'No se ha ingresado un número de porciones válido.\n';
        }
        if(!$scope.Insumos || $scope.Insumos.length == 0){
            msg += 'No se ha ingresado los insumos del producto.\n';
        } 
        if(msg){
            $scope.showError = true;
            $scope.mensaje = msg;
            return;
        }


        $scope.producto.Insumos = $scope.Insumos;
        $scope.isLoading = true;
        ProductoFtry.update($scope.producto).success(function (data) {
            alert("Datos grabados");
            $state.go("app.producto");
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

    $scope.quitarItem = function (insumo) {
        var index = $scope.Insumos.indexOf(insumo);
        $scope.Insumos.splice(index, 1);
        calcularCosto();
        calcularRendimientoNutricional();
    }
})