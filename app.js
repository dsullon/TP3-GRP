'use strict';
/**
 * @ngdoc overview
 * @name app
 * @description
 * # app
 *
 * Main module of the application.
 */
angular
  .module('app', [
    'ui.bootstrap',
    'ui.router',
    'oc.lazyLoad',
    'checklist-model'
  ]);