app.factory("SolicitudRetiroFtry", function ($http, $location, $rootScope) {
    return {
        get: function (id) {
            return $http({
                url: $rootScope.baseUrl + '/solicitudretiro/' + id,
                method: 'GET'
            });
        },
        getAll: function () {
            return $http({
                url: $rootScope.baseUrl + '/solicitudretiro',
                method: 'GET'
            });
        },
        getDetails: function (id) {
            return $http({
                url: $rootScope.baseUrl + '/solicitudretiro/' + id + '/details',
                method: 'GET'
            });
        },
        update: function (data) {
            return $http({
                url: $rootScope.baseUrl + '/solicitudretiro',
                method: "PUT",
                data: data,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
        },
        create: function (data) {
            return $http({
                url: $rootScope.baseUrl + '/solicitudretiro',
                method: "POST",
                data: data,
                headers: { 'Content-Type': 'application/json' }
            });
        },
        delete: function (data) {
            return $http({
                url: 'data/Area/delete',
                method: "POST",
                data: data,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
        }
    }
});