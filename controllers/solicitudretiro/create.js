app.controller('SolicitudRetiroCrearCtrl', function ($scope, $state, $modal, 
    SolicitudRetiroFtry, ComboFtry) {
    $scope.solicitudretiro = {
        //'FechaEnvio': '',//new Date(),
        'Comentario': '',
        'IdProyeccion': '2',    // 2:es la ultima proyeccion realizada
        'TipoSimulacion': '1',  // 2:todos, 1:personalizada
        'Estado': '1'           // 1:creado, 2: aprobado, 3:rechazado
    };
    var Tipo = 1;// Tipo item solicitud de la tabla comboSolicitudRetiro
    $scope.PorcentajeAporteAfecto = parseFloat(0); // acumulado de % aporte de combos a retirar
    $scope.PorcentajeAporteSimulacion = parseFloat(0); // acumulado de % de aporte de combos en simmulacion
    $scope.CombosxRetiro = [];
    $scope.CombosxProyeccion = [];
    $scope.IngresoProyectadoAfectoPendiente = parseFloat(0);
    $scope.IngresoProyectadoAfectoSimulado = parseFloat(0);
    $scope.DesabilitarSimulacion = true; //para controlar fieldset de simulacion
    $scope.TipoSimulacion = 1; // para controlar el boton agregar combo
   
    ComboFtry.getWithRelation().success(function (data) {
        $scope.listaCombo = data;
    });

    $scope.agregarComboSolicitud = function (size) {
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
            $scope.IngresoProyectadoAfectoPendiente += parseFloat(nuevoCombo.Saldo); // Calculando el IPA         

            $scope.CombosxRetiro.push(nuevoCombo);
            $scope.DesabilitarSimulacion = false;
        }, function () {
            //$log.info('Modal dismissed at: ' + new Date());
            //.splice() para eliminar en JavaScript 
        });
    };

    function realizarSimulacion(){
        var pesoInterno = parseFloat(0);
        var comboSimulado; 
        var nuevoAporte = parseFloat(0); 
        var nuevoPorcentaje = parseFloat(0); 
        var nuevoPorcentaje = parseFloat(0);  
        $scope.IngresoProyectadoAfectoSimulado = 0; 

        for (var idx = 0; idx < $scope.CombosxProyeccion.length; idx++) {
            comboSimulado = $scope.CombosxProyeccion[idx];
            pesoInterno = parseFloat(comboSimulado.PorcentajeAporte/$scope.PorcentajeAporteSimulacion).toFixed(6);
            $scope.CombosxProyeccion[idx].pesoInterno = pesoInterno;
            nuevoAporte = parseFloat(comboSimulado.VentaProyectada)+parseFloat(pesoInterno)*parseFloat($scope.IngresoProyectadoAfectoPendiente);
            $scope.CombosxProyeccion[idx].VentaProyectadaNueva = nuevoAporte;
            nuevoPorcentaje = parseFloat($scope.PorcentajeAporteAfecto)*parseFloat(pesoInterno)+parseFloat(comboSimulado.PorcentajeAporte);
            $scope.CombosxProyeccion[idx].PorcentajeNuevoAporte = parseFloat(nuevoPorcentaje).toFixed(6);
            $scope.IngresoProyectadoAfectoSimulado += parseFloat(nuevoAporte)-parseFloat(comboSimulado.VentaProyectada);

        }
    }

    function cargarCombosPorSimular(selectedItem){
        var nuevoRegistro = {};
        nuevoRegistro.Id = selectedItem.item.Id;
        nuevoRegistro.Nombre = selectedItem.item.Nombre;
        nuevoRegistro.VentaProyectada = parseFloat(selectedItem.item.MontoProyectado);
        nuevoRegistro.PorcentajeAporte = parseFloat(selectedItem.item.PorcentajeAporte).toFixed(4);
        nuevoRegistro.VentaReal = parseFloat(selectedItem.item.VentaPeriodo);
        $scope.PorcentajeAporteSimulacion += parseFloat(selectedItem.item.PorcentajeAporte);
        nuevoRegistro.PorcentajeNuevoAporte = parseFloat(0); // este campo se llena en la simulacion
        nuevoRegistro.VentaProyectadaNueva = parseFloat(0);  // este campo se llena en la simulacion
        $scope.CombosxProyeccion.push(nuevoRegistro);
        realizarSimulacion();
    }

    $scope.agregarComboSimulacion = function (size) {
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
    
    $scope.simulacionPersonalizada = function (){
        console.log("ingresamos a simulacion personalizada")
        $scope.TipoSimulacion = 1;
        $scope.limpiarSimulacion();
    }

    // Esta funcion se ejecuta solo si la simulacion es general o total
    $scope.simulacionTotal = function (){
        var data = {item:{}};
        var existe = false;
        var encontrados = 0;
        $scope.TipoSimulacion = 2;        
        reiniciarSimulacion();
        console.log("ingresamos a simulacion total")
        
        // Aqui sacamos los combos de la solicitud de retiro antes de la simulacion final
        for (var idx = 0; idx < $scope.listaCombo.length; idx++ ){
            var idy = 0;
            while (idy < $scope.CombosxRetiro.length && $scope.CombosxRetiro.length != encontrados){
                if ($scope.CombosxRetiro[idy].IdCombo == $scope.listaCombo[idx].Id){
                    existe = true;
                    encontrados++;
                    idy = $scope.CombosxRetiro.length;
                }
                idy++;
            }
            if (!existe){
                data.item = $scope.listaCombo[idx];
                cargarCombosPorSimular(data);
            }                      
            existe = false;
        }

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

    // Esta funcion se llama desde la zona "Combos a retirar" de la solicitud
    $scope.quitarItemEliminar = function (idCombo) {
        var index = $scope.CombosxRetiro.indexOf(idCombo);
        var combo = $scope.CombosxRetiro[idCombo];
        var saldoEliminado = combo.Saldo;
        var porcentajeAporteEliminado = combo.PorcentajeAporte;
        $scope.CombosxRetiro.splice(index, 1);

        if ($scope.CombosxRetiro.length > 0){
            console.log("dentro del if");
            if ($scope.ControlTipoSimulacion == 2){ // Si tenemos una simulacion total
                console.log("dentro del if de simulacion total");
                $scope.simulacionTotal();
            } else {
                console.log("dentro del else del punto 1")
                $scope.IngresoProyectadoAfectoPendiente -= parseFloat(saldoEliminado);
                $scope.PorcentajeAporteAfecto -= parseFloat(porcentajeAporteEliminado);
            }         
        } else { // Si retiramos el ultimo combo de la solicitud limpiamos todo
            $scope.limpiarSimulacion();
            console.log("dentro del else");
            $scope.ControlTipoSimulacion = 1;
            $scope.IngresoProyectadoAfectoPendiente = 0;
            $scope.PorcentajeAporteAfecto = parseFloat(0); 
        }        
    }

    // Esta funcion se llama desde la zona "Simulacion de proyeccion" de la solicitud
    $scope.quitarItemSimular = function (combo) {
        var index = $scope.CombosxProyeccion.indexOf(combo);
        $scope.CombosxProyeccion.splice(index, 1);
    }

    function reiniciarSimulacion(){
        $scope.CombosxProyeccion = []; // limpia los combos anteriores
        $scope.IngresoProyectadoAfectoSimulado = 0;
        $scope.PorcentajeAporteSimulacion = parseFloat(0);
    }

    $scope.limpiarSimulacion = function (insumo) {
        // Esta funcion solo se ejecuta si la simulacion es personalizada
        reiniciarSimulacion();

        //$scope.CombosxProyeccion = [];
        //$scope.IngresoProyectadoAfectoSimulado = 0;
        //$scope.PorcentajeAporteSimulacion = parseFloat(0);
    }

})