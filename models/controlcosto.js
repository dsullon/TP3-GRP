app.factory("controlCostoFtry", function ($http, $location, $rootScope) {
    return {
        getAll: function () {
            return $http({
                url: $rootScope.baseUrl + '/articulo/umbral',
                method: 'GET'
            });
        }
    }
});