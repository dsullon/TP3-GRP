'use strict';

/**
 * @ngdoc function
 * @name app.config:uiRouter
 * @description
 * # Config
 * Config for the router
 */
angular.module('app')
  .run(
    [           '$rootScope', '$state', '$stateParams',
      function ( $rootScope,   $state,   $stateParams) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        //$rootScope.baseUrl = "http://localhost:5375/api";
        $rootScope.baseUrl = "http://grpwebapi.azurewebsites.net/api";
      }
    ]
  )
  .config(
    [          '$stateProvider', '$urlRouterProvider',
      function ( $stateProvider,   $urlRouterProvider) 
      {
        var layout = 'views/layout.html';
        var aside  = 'views/aside.html';
        var content= 'views/content.html';
        
        $urlRouterProvider
          .otherwise('/app/home');
        $stateProvider
          .state('app', {
            abstract: true,
            url: '/app',
            views: {
              '': {
                templateUrl: layout
              },
              'aside': {
                templateUrl: aside
              },
              'content': {
                templateUrl: content
              }
            }
          })
          .state('app.home', {
            url: '/home',
            templateUrl: 'views/home.html',
            resolve: {
              load: function($ocLazyLoad) {
                return $ocLazyLoad.load({
                  name: "app",
                  files: [
                    'styles/flexslider.css',
                    'libs/jquery/jquery.flexslider.js',
                    'controllers/home.js'
                    ]
                  });
                }
              }
          })
          .state('app.producto',{
            url: '/producto',
            templateUrl: 'views/producto/index.html',
            resolve: {
              load: function($ocLazyLoad){
                return $ocLazyLoad.load({
                  name: "app",
                  files: [
                    'models/producto.js',
                    'controllers/producto/index.js'
                  ]
                });
              }
            }
          })
          .state('app.crearProducto',{
            url: '/producto/nuevo',
            templateUrl: 'views/producto/create.html',
            resolve: {
              load: function($ocLazyLoad){
                return $ocLazyLoad.load({
                  name: "app",
                  files: [
                    'controllers/producto/create.js',
                    'controllers/insumos-modal.js',
                    'models/categoria.js',
                    'models/articulo.js',
                    'models/nutricional.js',
                    'models/producto.js'
                  ]
                });
              }
            }
          })
          .state('app.editarProducto',{
            url: '/producto/{id:[0-9]{1,4}}',
            templateUrl: 'views/producto/editar.html',
            resolve: {
              load: function($ocLazyLoad){
                return $ocLazyLoad.load({
                  name: "app",
                  files: [
                    'controllers/producto/edit.js',
                    'controllers/insumos-modal.js',
                    'models/categoria.js',
                    'models/articulo.js',
                    'models/nutricional.js',
                    'models/producto.js'
                  ]
                });
              }
            }
          })
          .state('app.controlCosto',{
            url: '/controlcosto',
            templateUrl: 'views/controlcosto/index.html',
            resolve: {
              load: function($ocLazyLoad){
                return $ocLazyLoad.load({
                  name: "app",
                  files: [ 
                    'models/controlcosto.js',
                    'controllers/controlcosto/index.js'
                    ]
                });
              }
            }
          })
          .state('app.combo',{
            url: '/combo',
            templateUrl: 'views/combo/index.html',
            resolve: {
              load: function($ocLazyLoad){
                return $ocLazyLoad.load({
                  name: "app",
                  files: [
                    'models/combo.js',
                    'controllers/combo/index.js'
                  ]
                });
              }
            }
          })
          .state('app.crearCombo',{
            url: '/combo/nuevo',
            templateUrl: 'views/combo/create.html',
            resolve: {
              load: function($ocLazyLoad){
                return $ocLazyLoad.load({
                  name: "app",
                  files: [
                    'controllers/combo/create.js',
                    'controllers/producto-modal.js',
                    'models/categoria.js',
                    'models/producto.js',
                    'models/combo.js'
                  ]
                });
              }
            }
          })
          .state('app.editarCombo',{
            url: '/combo/{id:[0-9]{1,4}}',
            templateUrl: 'views/combo/editar.html',
            resolve: {
              load: function($ocLazyLoad){
                return $ocLazyLoad.load({
                  name: "app",
                  files: [
                    'controllers/combo/edit.js',
                    'controllers/producto-modal.js',
                    'models/categoria.js',
                    'models/producto.js',
                    'models/combo.js'
                  ]
                });
              }
            }
          })
          .state('app.solicitudRetiro',{
            url: '/solicitudretiro',
            templateUrl: 'views/solicitudretiro/index.html',
            resolve: {
              load: function($ocLazyLoad){
                return $ocLazyLoad.load({
                  name: "app",
                  files: [                    
                    'models/solicitudretiro.js',
                    'controllers/solicitudretiro/index.js'
                  ]
                });
              }
            }
          })
          .state('app.simularprecio',{
            url: '/simularprecio',
            params: {
              producto: null
            },
            templateUrl: 'views/controlcosto/create.html',
            resolve: {
              load: function($ocLazyLoad){
                return $ocLazyLoad.load({
                  name: "app",
                  files: [ 
                    'models/simularprecio.js',
                    'models/producto.js',
                    'controllers/controlcosto/simularprecio.js'
                  ]
                });
              }
            }
          })
          .state('app.crearSolicitudRetiro',{
            url: '/solicitudretiro/nuevo',
            templateUrl: 'views/solicitudretiro/create.html',
            resolve: {
              load: function($ocLazyLoad){
                return $ocLazyLoad.load({
                  name: "app",
                  files: [                    
                    'models/solicitudretiro.js',
                    'models/combo.js',
                    'controllers/insumos-modal.js',                    
                    'controllers/solicitudretiro/create.js'                    
                  ]
                });
              }
            }
          })
          .state('app.editarSolicitudRetiro',{
            url: '/solicitudretiro/{id:[0-9]{1,4}}',
            templateUrl: 'views/solicitudretiro/edit.html',
            resolve: {
              load: function($ocLazyLoad){
                return $ocLazyLoad.load({
                  name: "app",
                  files: [
                    'models/solicitudretiro.js',
                    'models/combo.js',
                    'controllers/insumos-modal.js',                    
                    'controllers/solicitudretiro/edit.js'                    
                  ]
                });
              }
            }
          });
      }   
    ]
  );