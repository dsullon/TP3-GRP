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
        getDetails: function (id) {
            return $http({
                url: $rootScope.baseUrl + '/combo/' + id + '/detalle',
                method: 'GET'
            });
        },
        getWithRelation: function () {
            return $http({
                url: $rootScope.baseUrl + '/combo/retiro',
                method: 'GET'
            });
        },
        update: function (data) {
            return $http({
                url: $rootScope.baseUrl + '/combo',
                method: "PUT",
                data: data,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        create: function (data) {
            return $http({
                url: $rootScope.baseUrl + '/combo',
                method: "POST",
                data: data,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        delete: function (id) {
            return $http({
                url: $rootScope.baseUrl + '/combo/' + id , 
                method: "DELETE"
            })
        }
    };
});