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

    services.service('Channels', function ($q, $http, ManageTaskUtils) {
        var channels;

        this.get = function () {
            if(!channels) return false;
            return channels;
        }

        this.getModule = function (name) {
            if (!channels) return false;
            for (var module of channels) {
                if(name === module.moduleName) return JSON.parse(JSON.stringify(module));
            }
            return false;
        }

        this.getTrigger = function (moduleName, subject) {
            var module = this.getModule(moduleName);
            if(!module) return false;
            for (var trigger of module.triggerTaskEvents) {
                if (trigger.subject === subject){
                    trigger.moduleName = module.moduleName;
                    return trigger;
                }
            }
        }

        this.getEventParameters = function (moduleName, subject) {
            var module = this.getModule(moduleName);
            var trigger = this.getTrigger(moduleName, subject);
            var parameters = [];
            if (module && trigger) {
                trigger.eventParameters.forEach(function (param) {
                    param.prefix = ManageTaskUtils.TRIGGER_PREFIX;
                    param.module = module.moduleName;
                    param.moduleName = module.displayName;
                    param.trigger = trigger.subject;
                    param.triggerName = trigger.displayName;
                    parameters.push(param);
                });
            }
            return parameters;
        }

        this.load = function () {
            var deferred = $q.defer();
            var request = $http.get('../tasks/api/channel');
            request.then(function (response) {
                channels = response.data;
                deferred.resolve(channels);
            });
            request.catch(function (response) {
                deferred.reject([]);
            });
            return deferred.promise;
        }

    });

    services.service('DataSources', function ($q, $http, ManageTaskUtils) {
        var sources;

        this.get = function () {
            if(!sources) return false;
            return sources;
        };
        this.getProvider = function (providerId) {
            if(!sources) return false;
            for(var provider of sources){
                if (provider.id == providerId) return JSON.parse(JSON.stringify(provider));
            }
        };
        this.getObject = function (providerId, type) {
            if(!sources) return false;
            var provider = this.getProvider(providerId);
            if(!provider) return false;
            for (var object of provider.objects) {
                if (object.type == type){
                    object.providerName = provider.name;
                    object.providerId = provider.id;
                    object.objectId; // not sure where this comes from.
                    return object;
                }
            }
            return false;
        };
        this.getFields = function (providerId, type) {
            var fields = [];
            if(!sources) return fields;
            var object = this.getObject(providerId, type);
            if(!object || !object.fields) return fields;
            object.fields.forEach(function(field){
                field.prefix = ManageTaskUtils.DATA_SOURCE_PREFIX;
                field.providerId = object.providerId;
                field.providerName = object.providerName;
                field.providerType = type;
                field.objectId = object.id; //Not sure what this is doing..
                field.objectName = object.displayName;
                fields.push(field);
            });
            return fields;
        }
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
