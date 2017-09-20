app.controller('ComboCrearCtrl', function ($scope, $state, $modal, ProductoFtry, CategoriaFtry) {
    $scope.combo = {
        'Nombre': '',
        'Descripcion': '',
        'Precio': '0.00',
        'IdCategoria': '0',
        'Descuento': '20',
        'Promocion': true
    };
    var productos = [];

    $scope.alert = null;

    $scope.principal = [];
    $scope.extra = [];

    ProductoFtry.getAll().success(function(data){
        productos = data;
        CategoriaFtry.getAll().success(function (data) {
            $scope.listaCategoria = data;
        });
    })

    

    $scope.open = function (size) {
        var modalInstance = $modal.open({
            templateUrl: 'productoPrincipal.html',
            controller: 'ProductoModalCtrl',
            size: size,
            resolve: {
                items: function () {
                    return productos;
                }
            }
        });
        modalInstance.result.then(function (item) {
            var nuevoItem = {};
            nuevoItem.IdProducto = item.Id;
            nuevoItem.Nombre = item.Nombre;
            nuevoItem.Precio = item.Precio;
            nuevoItem.Cantidad = 1;
            nuevoItem.EsPrincipal = true;
            $scope.principal.push(nuevoItem);
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    }

    $scope.open1 = function (size) {
        var modalInstance = $modal.open({
            templateUrl: 'productoPrincipal.html',
            controller: 'ProductoModalCtrl',
            size: size,
            resolve: {
                items: function () {
                    return productos;
                }
            }
        });
        modalInstance.result.then(function (item) {
            var nuevoItem = {};
            nuevoItem.IdProducto = item.Id;
            nuevoItem.Nombre = item.Nombre;
            nuevoItem.Precio = item.Precio;
            nuevoItem.Cantidad = 1;
            nuevoItem.EsPrincipal = false;
            $scope.extra.push(nuevoItem);
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
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
        $scope.alert = null;
        var msg="";
        if(!$scope.Insumos || $scope.Insumos.length == 0){
            msg += 'No se ha ingresado los insumos del producto.';
        }
        if($scope.producto.IdCategoria<=0){
            msg += '\nNo se han completado los datos.';
        }
        if(!$scope.producto.Nombre){
            msg += '\nNo se ha ingresado el nombre del producto.';
        }
        if(isNaN($scope.producto.Porciones) || $scope.producto.Porciones < 1){
            msg += '\nNo se ha ingresado un número de porciones válido.';
        }
        console.log(msg);
        if(msg){
            $scope.alert = { type: 'warning', msg: msg };
            return;
        }

        $scope.producto.Insumos = $scope.Insumos;
        ProductoFtry.create($scope.producto).success(function (data) {
            alert("Datos grabados");
            $state.go("app.producto");
        }).error(function (data) {

        });
    }

    $scope.closeAlert = function () {
        $scope.alert = null;
    };
})