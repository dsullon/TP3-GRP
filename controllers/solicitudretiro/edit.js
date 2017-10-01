app.controller('SolicitudRetiroEditarCtrl', function ($scope, $stateParams, $state, $modal, 
    SolicitudRetiroFtry, ComboFtry) {
    var id = $stateParams.id;
    $scope.isLoading = true;
    $scope.solicitudretiro = {};

    var Tipo = 1;// Tipo item solicitud de la tabla comboSolicitudRetiro
    $scope.PorcentajeAporteAfecto = parseFloat(0); // acumulado de % aporte de combos a retirar
    $scope.PorcentajeAporteSimulacion = parseFloat(0); // acumulado de % de aporte de combos en simmulacion
    $scope.CombosxRetiro = [];
    $scope.CombosxProyeccion = [];
    $scope.IngresoProyectadoAfecto = parseFloat(0);
    $scope.DesabilitarSimulacion = true; //para controlar fieldset de simulacion
    $scope.TipoSimulacion = 1; // para controlar el boton agregar combo

    SolicitudRetiroFtry.get(id).success(function (data) {
        $scope.solicitudretiro = data;
        ComboFtry.getAll().success(function (data) {
            $scope.listaCombo = data;
        });

        SolicitudRetiroFtry.getDetails(id).success(function (data) {
            $scope.CombosxRetiro = data;
            console.log(data);
        });
    })

/*
   


    $scope.agregarCombosPorRetirar = function (size) {
        var modalInstance = $modal.open({
            templateUrl: 'modalContent.html',
            controller: 'ModalInstanceCtrl',
            size: size,
            resolve: {
                items: function () {
                    return $scope.listaCombo;
                }
            }
        });
        modalInstance.result.then(function (selectedItem) {
            //$scope.selected = selectedItem;
            var nuevoCombo = {};
            nuevoCombo.IdCombo = selectedItem.item.Id;
            nuevoCombo.Nombre = selectedItem.item.Nombre;
            nuevoCombo.VentaProyectada = parseFloat(selectedItem.item.MontoProyectado);
            nuevoCombo.PorcentajeAporte = parseFloat(selectedItem.item.PorcentajeAporte);
            nuevoCombo.VentaReal = parseFloat(selectedItem.item.VentaPeriodo);
            nuevoCombo.Saldo = parseFloat(selectedItem.item.MontoProyectado-selectedItem.item.VentaPeriodo);
            nuevoCombo.PorcentajeCumplimiento = parseFloat(nuevoCombo.VentaReal/nuevoCombo.VentaProyectada).toFixed(4);
            nuevoCombo.Tipo = Tipo;
            $scope.PorcentajeAporteAfecto += parseFloat(selectedItem.item.PorcentajeAporte);
            $scope.IngresoProyectadoAfecto += parseFloat(nuevoCombo.Saldo); // Calculando el IPA         
            //console.log($scope.IngresoProyectadoAfecto);
            //console.log($scope.PorcentajeAporteAfecto);
            $scope.CombosxRetiro.push(nuevoCombo);
            $scope.DesabilitarSimulacion = false;
        }, function () {
            //$log.info('Modal dismissed at: ' + new Date());
            //.splice() para eliminar en JavaScript 
        });
    };

    $scope.agregarCombosPorSimularPersonalizado = function (size) {
        var modalInstance = $modal.open({
            templateUrl: 'modalContent.html',
            controller: 'ModalInstanceCtrl',
            size: size,
            resolve: {
                items: function () {
                    return $scope.listaCombo;
                }
            }
        });
        modalInstance.result.then(function (selectedItem) { // se ejecuta cuando doy aceptar en el modal
            cargarCombosPorSimular(selectedItem);
        }, function () {
            //$log.info('Modal dismissed at: ' + new Date());
        });
    };

    function realizarSimulacion(){
        var pesoInterno = parseFloat(0);
        var comboSimulado; 
        var nuevoAporte = parseFloat(0); 
        var nuevoPorcentaje = parseFloat(0);  

        for (var idx = 0; idx < $scope.CombosxProyeccion.length; idx++) {
            comboSimulado = $scope.CombosxProyeccion[idx];
            pesoInterno = parseFloat(comboSimulado.PorcentajeAporte/$scope.PorcentajeAporteSimulacion).toFixed(4);
            $scope.CombosxProyeccion[idx].pesoInterno = pesoInterno;
            nuevoAporte = parseFloat(comboSimulado.VentaProyectada)+parseFloat(pesoInterno)*parseFloat($scope.IngresoProyectadoAfecto);
            $scope.CombosxProyeccion[idx].VentaProyectadaNueva = nuevoAporte;
            nuevoAporte = parseFloat($scope.PorcentajeAporteAfecto)*parseFloat(pesoInterno)+parseFloat(comboSimulado.PorcentajeAporte);
            $scope.CombosxProyeccion[idx].PorcentajeNuevoAporte = parseFloat(nuevoAporte).toFixed(4);
        }
    }

    function cargarCombosPorSimular(selectedItem){
        console.log(selectedItem);  
        var nuevoRegistro = {};
        nuevoRegistro.Id = selectedItem.item.Id;
        nuevoRegistro.Nombre = selectedItem.item.Nombre;
        nuevoRegistro.VentaProyectada = parseFloat(selectedItem.item.MontoProyectado);
        nuevoRegistro.PorcentajeAporte = parseFloat(selectedItem.item.PorcentajeAporte).toFixed(4);
        nuevoRegistro.VentaReal = parseFloat(selectedItem.item.VentaPeriodo);
        nuevoRegistro.PorcentajeNuevoAporte = parseFloat(0);
        $scope.PorcentajeAporteSimulacion += parseFloat(selectedItem.item.PorcentajeAporte);
        nuevoRegistro.VentaProyectadaNueva = parseFloat(0);
        $scope.CombosxProyeccion.push(nuevoRegistro); // otro comentario para probar git
        realizarSimulacion();
        //console.log(nuevoRegistro);           
    }

    $scope.agregarCombosPorSimularTotal = function (){
        //console.log($scope.listaCombo);
        var data = {
            item:{}
        };
        for (var idx = 0; idx < $scope.listaCombo.length; idx++ ){
            data.item = $scope.listaCombo[idx];
            console.log(data);
            cargarCombosPorSimular(data);            
        }
    }

    $scope.limpiarCombosPorSimular = function (){
        $scope.CombosxProyeccion = [];
    }


    $scope.grabar = function(){
        //console.log($scope.solicitudretiro);
        // $scope.solicitudretiro = // para recuperar un dato del formulario

        if(!$scope.CombosxRetiro || $scope.CombosxRetiro.length == 0){
            $scope.alert = { type: 'warning', msg: 'No se ha ingresado los combos a retirar.' };
            return;
        }
        if(!$scope.CombosxProyeccion || $scope.CombosxProyeccion.length == 0){
            $scope.alert = { type: 'warning', msg: 'No se ha realizado la simulacion de la proyeccion para compensacion.' };
            return;
        }
        $scope.solicitudretiro.Combos = $scope.CombosxRetiro;
        SolicitudRetiroFtry.create($scope.solicitudretiro).success(function (data) {
            alert("Datos grabados");
            $state.go("app.solicitudRetiro");
        }).error(function (data) {
            console.log(data);
        });
    }

    $scope.closeAlert = function () {
        $scope.alert = null;
    };

    */
})