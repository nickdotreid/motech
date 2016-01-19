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
            if(!sources) return false;
            return sources;
        };
        this.getProvider = function (providerId) {
            if(!sources) return false;
            for(var provider of sources){
                if (provider.id == providerId) return provider;
            }
        };
        this.getObject = function (providerId, type) {
            if(!sources) return false;
            var provider = this.getProvider(providerId);
            if(!provider) return false;
            for (var object of provider.objects) {
                if (object.type == type){
                    object.providerName = provider.name;
                    object.objectId; // not sure where this comes from.
                    return object;
                }
            }
            return false;
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
