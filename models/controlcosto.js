app.factory("controlCostoFtry", function ($http, $location, $rootScope) {
    return {
        getAll: function () {
            return $http({
                url: $rootScope.baseUrl + '/articulo/umbral',
                method: 'GET'
            });
        },
        getUmbralPerId: function (id) {
            return $http({
                url: $rootScope.baseUrl + '/articulo/umbral/' + id,
                method: 'GET'
            });
        }
    }
});