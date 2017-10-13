app.factory("porcionesSimuladorFtry", function ($http, $location, $rootScope) {

    var urlBasePorciones = "https://b1f40fd2.ngrok.io"; // https://23df96cb.ngrok.io
    return {
        get: function (id) {
            return $http({
                url: urlBasePorciones + '/tp3/porciones/lista/insumos/',
                //url: 'http://d7c87227.ngrok.io/tp3/porciones/lista/insumos/',
                method: 'GET'
            });
        },
        getArticulo: function (id) {
            return $http({
                url: urlBasePorciones + '/tp3/porciones/costoactualarticulo/' + id,
                method: 'GET'
            });
        },
        getProductoByIdArticulo: function (id) {
            return $http({
                url: urlBasePorciones + '/tp3/porciones/listaproductoInsumo/' + id,
                method: 'GET'
            });
        },
        getArticuloPorProducto: function (id) {
            return $http({
                url: urlBasePorciones + '/tp3/porciones/listaarticuloProducto/' + id,
                method: 'GET'
            });
        },
        getActualizarCantidadProducto: function (data) {
 
            return $http({
                url: urlBasePorciones + '/tp3/porciones/actualizarporcion/' + data.codArticulo + "/" + data.codProducto + "/" + data.cantidad,
                method: 'GET'
            });

            //return $http.put(urlBasePorciones + "/tp3/porciones/actualizarporcion/", data);
        }
    };
});