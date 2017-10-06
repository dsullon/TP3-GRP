app.controller('ComboCtrl', function ($scope, $state, $modal, ComboFtry) {
    $scope.isLoading = true;
    $scope.showError = false;
    $scope.mensaje = "";
    ComboFtry.getAll().success(function (data) {
        $scope.listaCombo = data;
        $scope.isLoading = false;
        $scope.showError = false;
        $scope.mensaje = "";
        $scope.totalItems = $scope.listaCombo.length;
    }).error(function(err, status){
        if(status == -1){
            $scope.mensaje = "No se pudo conectar con el servicio.";
        }else{
            $scope.mensaje = 'Error:' + status + ' - ' + err.Message;
        }
        $scope.showError = true;        
        $scope.isLoading = false;
    })

    $scope.open = function (item) {
        var error = false;
        var codigo;
        var mensaje;
        $modal.open({
            templateUrl: 'eliminar.html',
            backdrop: true,
            windowClass: 'modal',
            size: 'sm',
            controller: function ($scope, $modalInstance) {
                $scope.item = item;
                $scope.ok = function () {
                    $scope.isLoading = true;
                    ComboFtry.delete(item.Id).success(function (data) {
                        $state.reload();
                    }).error(function(err, status){
                        error = true;
                        if(status == -1){
                           mensaje = "No se pudo conectar con el servicio.";
                        }else{
                            mensaje = 'Error:' + status + ' - ' + err.Message;
                        }
                    });
                    $modalInstance.dismiss('cancel');
                    //console.log("Submit");
                }
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                    //console.log("Cancel");
                };
            }
        });
        if(error){
            $scope.showError = true;        
            $scope.isLoading = false;
            $scope.mensaje = mensaje;
        }
    }

    /*$scope.eliminar = function(id){
        alert(id);
    }*/

    $scope.currentPage = 1;
    $scope.itemsPerPage = 10;
    $scope.maxSize = 5; //Number of pager buttons to show
})