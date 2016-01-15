(function () {
    'use strict';

    /* Services */

    var services = angular.module('tasks.services', ['ngResource']);

    services.factory('Tasks', function ($resource) {
        return $resource('../tasks/api/task/:taskId', {taskId: '@id'});
    });

    services.factory('Activities', function ($resource) {
        return $resource('../tasks/api/activity/:taskId');
    });

    services.factory('Settings', function($resource) {
        return $resource('../tasks/api/settings');
    });

    services.factory('Channels', function ($resource) {
        return $resource('../tasks/api/channel');
    });

    services.service('DataSources', function ($q, $http) {
        var sources;

        this.get = function () {
            if(sources) return sources;
            return []; //return empty array?
        };
        this.load = function(){
            var deferred = $q.defer();
            var request = $http.get('../tasks/api/datasource');
            request.then(function (response) {
               sources = response.data;
               deferred.resolve(sources);
            });
            request.catch(function (response) {
               deferred.reject([]);
            });
            return deferred.promise;
        }
    });

}());
