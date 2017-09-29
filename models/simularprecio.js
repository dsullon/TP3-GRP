app.factory("simularPrecioFtry", function ($http, $location, $rootScope) {
    return {
        getDetails: function (id) {
            return $http({
                url: $rootScope.baseUrl + '/producto/' + id + '/details',
                method: 'GET'
            });
        }
    }
});