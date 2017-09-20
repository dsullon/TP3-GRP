app.controller('ProductoModalCtrl', function($scope, $modalInstance, items, filterFilter) {
    $scope.items = items;
    $scope.filterList = items;
    $scope.selected = {
        item: $scope.items[0]
    };

    $scope.busqueda = {
        nombre: ''
    };

    $scope.ok = function (item) {
        $modalInstance.close(item);
    };
    
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    
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