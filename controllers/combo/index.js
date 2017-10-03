app.controller('ComboCtrl', function ($scope, $state, $modal, ComboFtry) {
    $scope.isLoading = true;
    $scope.showNoData = false;
    ComboFtry.getAll().success(function (data) {
        $scope.listaCombo = data;
        $scope.isLoading = false;
        $scope.showNoData = false;
        $scope.totalItems = $scope.listaCombo.length;
    }).error(function(err){
        $scope.isLoading = false;
        $scope.showNoData = true;
    })

    $scope.open = function (item) {
        $modal.open({
            templateUrl: 'eliminar.html',
            backdrop: true,
            windowClass: 'modal',
            size: 'sm',
            controller: function ($scope, $modalInstance) {
                $scope.item = item;
                $scope.ok = function () {
                    ComboFtry.delete(item.Id).success(function (data) {
                        $state.reload();
                    }).error(function(err){
                        console.log(err);
                    })
                    $modalInstance.dismiss('cancel');
                    console.log("Submit");
                }
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                    console.log("Cancel");
                };
            }
        });
    }

    /*$scope.eliminar = function(id){
        alert(id);
    }*/

    $scope.currentPage = 1;
    $scope.itemsPerPage = 10;
    $scope.maxSize = 5; //Number of pager buttons to show
})