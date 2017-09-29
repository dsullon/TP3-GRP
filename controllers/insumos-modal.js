app.controller('ModalInstanceCtrl', function($scope, $modalInstance, items, filterFilter) {
    $scope.items = items;
    $scope.filterList = items;
    $scope.selected = {
        item: $scope.items[0],
        cantidad: 1,
        rendimiento: 100
    };

    $scope.busqueda = {
        nombre: ''
    };

    $scope.ok = function () {
        if((isNaN($scope.selected.cantidad) || $scope.selected.cantidad == 0) || 
            (isNaN($scope.selected.rendimiento) || $scope.selected.rendimiento == 0)){
            return;
        }else{
            $modalInstance.close($scope.selected);
        }
    };
    
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    
    $scope.viewby = 5;
    $scope.totalItems = $scope.items.length;
    $scope.currentPage = 1;
    $scope.itemsPerPage = 5;
    $scope.maxSize = 5; //Number of pager buttons to show

    $scope.buscar = function () {
        $scope.filterList = filterFilter($scope.items, {Nombre: $scope.busqueda.nombre});
        console.log($scope.busqueda.nombre);
        console.log($scope.filterList);
    };
})