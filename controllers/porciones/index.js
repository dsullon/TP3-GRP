app.controller('PorcionCtrl', function ($scope, porcionesSimuladorFtry, $modal) {
    $scope.showNoData = null;
    $scope.idArticuloSeleccionado = null;
    $scope.articuloProducto = [];
    $scope.idArticuloSeleccionado = [];
    $scope.informacionArticulo = null;
    $scope.nuevoCosto = null;
    $scope.availableOptions = [];

    porcionesSimuladorFtry.get().success(function (data) {
        console.log(data);
        $scope.availableOptions = data;
        $scope.idArticuloSeleccionado = data;
    }).error(function (err) {
    });


    $scope.myFunc = function (idArticulo) {
        for (var i = 0; i < $scope.idArticuloSeleccionado.length; i++) {
            if ($scope.idArticuloSeleccionado[i].codArticulo === idArticulo) {

                porcionesSimuladorFtry.getArticulo(idArticulo).success(function (costoProducto) {
                    $scope.nuevoCosto = costoProducto.nuevoCosto;
                }).error(function (err) {
                });
                $scope.viejoCosto = $scope.idArticuloSeleccionado[i].costoXUM;
                $scope.informacionArticulo = $scope.idArticuloSeleccionado[i];
            }
        }
    };

    $scope.modificador = false;
    $scope.busquedaArticulo = null;
    $scope.myFunc2 = function (idArticulo) {

        porcionesSimuladorFtry.getProductoByIdArticulo(idArticulo).success(function (productoByInsumo) {
            $scope.Productos = productoByInsumo;
            $scope.busquedaProducto = idArticulo;
        }).error(function (err) {
        });
    };
    $scope.itemProducto = null;
    $scope.agregarSimulador = function (itemProducto, index) {
        $scope.articuloProducto = null;
        porcionesSimuladorFtry.getArticuloPorProducto($scope.busquedaProducto).success(function (productoPorInsumo) {
            $scope.articuloProducto = productoPorInsumo;
            for (var i = 0; i < $scope.articuloProducto.length; i++) {
                if ($scope.articuloProducto[i].codProducto === itemProducto.codProducto) {
                    $scope.articuloSeleccionado = $scope.articuloProducto[i];

                } 
            }

            $scope.itemProducto = itemProducto;
            var modalInstance = $modal.open({
                templateUrl: 'views/porciones/simular.html',
                controller: 'PorcionSimuladorCtrl',
                animation: true,
                size: 'lg',
                resolve: {
                    items: function () {
                        return $scope.itemProducto;
                    },
                    itemProducto: function () {
                        return $scope.articuloSeleccionado;
                    },
                    itemArticulo: function () {
                        return $scope.informacionArticulo;
                    },
                    nuevoCosto: function () {
                        return $scope.nuevoCosto
                    }
                }
            });


            modalInstance.result.then(function () {
                $scope.Productos[index].modificado = true;

            });
        }).error(function (err) {
        });




    };



})
app.controller('PorcionSimuladorCtrl', function ($scope, items, $modalInstance, itemProducto, itemArticulo, nuevoCosto, porcionesSimuladorFtry) {
    $scope.showNoData = false;
    $scope.item = {cantidad: itemProducto.cantidad};
    $scope.datototalProducto = items;
    $scope.articuloByProducto = itemProducto;
    $scope.nombreProducto = items.nombre;
    $scope.itemArticulo = itemArticulo;
    $scope.nombreArticulo = itemArticulo.nombre;
    $scope.productoA = parseFloat(nuevoCosto);
    $scope.productoB = parseFloat(itemProducto.cantidad);
    $scope.costoInicial = itemProducto.costo;
    $scope.costoItemSimulado = $scope.productoA * $scope.productoB;
    $scope.costoProducto = items.costo;
    $scope.costoDiferencial = parseFloat(items.costo) - $scope.costoItemSimulado;

    $scope.mensaje = "Debe cambiar la porción de " + $scope.nombreArticulo + " para no exceder el costo";

    $scope.cambiarPorcion = function (cantidad) {
        $scope.productoB = parseFloat(cantidad);
        $scope.costoItemSimuladoResultado = ($scope.productoA * $scope.productoB) + $scope.costoDiferencial;

        $scope.mensajeAdvertencia = parseFloat($scope.costoProducto) < $scope.costoItemSimuladoResultado;


    };

    $scope.actualizar = function () {
        var data = {};
        console.log(itemArticulo, items);
        data.codArticulo = itemArticulo.codArticulo;
        data.codProducto = items.codProducto;
        data.cantidad = $scope.item.cantidad;
        porcionesSimuladorFtry.getActualizarCantidadProducto(data).then(function (respuesta) {
            console.log(respuesta.data);
            $modalInstance.close(true);
        }, function () {

        })
    }


    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };



})



