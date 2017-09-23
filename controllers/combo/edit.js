app.controller('ComboEditarCtrl', function ($scope, $stateParams, $state, $modal, ComboFtry, ProductoFtry, CategoriaFtry) {
    var id = $stateParams.id;
    $scope.isLoading = true;
    var productos = [];
    $scope.principal = [];
    $scope.extra = [];
    $scope.enviar = [];
    CategoriaFtry.getAll().success(function (data) {
        $scope.listaCategoria = data;
        ProductoFtry.getAll().success(function (data) {
            productos = data;
            ComboFtry.get(id).success(function (data) {
                $scope.combo = data;
                console.log($scope.combo);
                $scope.combo.Promocion = $scope.combo.Descuento > 0;
                ComboFtry.getDetails(id).success(function (data) {
                    var datos = data;
                    for (var idx = 0; idx < datos.length; idx++) {
                        item = datos[idx];
                        if(item.EsPrincipal){
                            $scope.principal.push(item);
                        }
                    }
                    for (var idx = 0; idx < datos.length; idx++) {
                        item = datos[idx];
                        if(!item.EsPrincipal){
                            $scope.extra.push(item);
                        }
                    }
                    calcularCosto();
                    $scope.isLoading = false;
                })
            })
        })
    });

    $scope.alert = null;   

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
            calcularCosto();
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
            calcularCosto();
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    }

    function calcularCosto(){
        var costoTotal = parseFloat(0);
        var dcto = parseFloat(0);
        var item = null;
        for (var idx = 0; idx < $scope.principal.length; idx++) {
            item = $scope.principal[idx];
            costoTotal += parseFloat(item.Precio * item.Cantidad);
        }
        for (var idx = 0; idx < $scope.extra.length; idx++) {
            item = $scope.extra[idx];
            costoTotal += parseFloat(item.Precio * item.Cantidad);
        }
        dcto = parseFloat(costoTotal * ($scope.combo.Descuento/100)).toFixed(2);
        $scope.combo.Precio = parseFloat(costoTotal).toFixed(2);
        $scope.combo.PrecioVenta = parseFloat(costoTotal - dcto).toFixed(2);
        console.log($scope.enviar);
    }

    $scope.actualizarPrecio = function(item){
        if(!item.Cantidad || item.Cantidad < 1){
            item.Cantidad = 1;
        }
        calcularCosto();
    }

    $scope.actualizarDcto = function(){
        if(isNaN($scope.combo.Descuento) || $scope.combo.Descuento < 1){
            $scope.combo.Descuento = 10;
        }
        calcularCosto();
    }

    $scope.actualizarEstado = function(){
        $scope.combo.Descuento = 0;
        calcularCosto();
    }

    $scope.quitarPrincipal = function (item) {
        var index = $scope.principal.indexOf(item);
        $scope.principal.splice(index, 1);
        calcularCosto();
    }

    $scope.quitarExtra = function (item) {
        var index = $scope.extra.indexOf(item);
        $scope.extra.splice(index, 1);
        calcularCosto();
    }

    function validarDatos(){
        var esValido = true;

        if($scope.combo.IdCategoria == 0){
            alert('Verifique la categoría del combo');
            esValido = false;
        }

        if(!$scope.combo.Nombre.replace(/ /g,'')){
            alert('Verifique el nombre del combo');
            esValido = false;
        }

        if($scope.combo.Promocion && $scope.combo.Descuento <1){
            alert('Verifique el descuento');
            esValido = false;
        }

        if(!$scope.principal.length || $scope.principal.length == 0){
            alert('Verifique el producto principal');
            esValido = false;
        }

        for (var idx = 0; idx < $scope.principal.length; idx++) {
            if(!$scope.principal[idx].Cantidad || $scope.principal[idx].Cantidad < 1){
                esValido = false;
                alert('Verifique las cantidades');
                break
            }            
        }        
        return esValido;
    }

    $scope.grabar = function(){
        if(!validarDatos()){
            return;
        }

        var detalles = [];
        var item = null;
        for (var idx = 0; idx < $scope.principal.length; idx++) {
            item = $scope.principal[idx];
            detalles.push(item);
        }
        for (var idx = 0; idx < $scope.extra.length; idx++) {
            item = $scope.extra[idx];
            detalles.push(item);
        }
        $scope.combo.Productos = detalles;

        console.log($scope.combo);
        
        ComboFtry.update($scope.combo).success(function (data) {
            alert("Datos grabados");
            $state.go("app.combo");
        }).error(function (data) {

        });
    }

    $scope.closeAlert = function () {
        $scope.alert = null;
    };
})