app.controller('ProductoCrearCtrl', function ($scope, $state, $modal, ProductoFtry, ArticuloFtry, CategoriaFtry, 
    NutricionalFtry) {
    $scope.producto = {
        'Nombre': '',
        'Costo': '0.00',
        'CostoUnitario': '0.00',
        'Precio': '0.00',
        'Rendimiento': '0.00',
        'Grasas': '0.00',
        'Proteinas': '0.00',
        'Calorias': '0.00',
        'Carbohidratos': '0.00',
        'Elaboracion': '',
        'IdCategoria': '0',
        'Porciones': 1,
        'Umbral': '20'
    };

    $scope.alert = null;

    $scope.Insumos = [];

    ArticuloFtry.getAll().success(function (data) {
        $scope.listaArticulo = data;
        CategoriaFtry.getAll().success(function (data) {
            $scope.listaCategoria = data;
        });
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