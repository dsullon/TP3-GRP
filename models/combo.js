app.factory("ComboFtry", function ($http, $location, $rootScope) {
    return {
        get: function (id) {
            return $http({
                url: $rootScope.baseUrl + '/combo/' + id,
                method: 'GET'
            });
        },
        getAll: function () {
            return $http({
                url: $rootScope.baseUrl + '/combo',
                method: 'GET'
            });
        },
        getWithRelation: function () {
            return $http({
                url: $rootScope.baseUrl + '/combo/retiro',
                method: 'GET'
            });
        }
    }
});