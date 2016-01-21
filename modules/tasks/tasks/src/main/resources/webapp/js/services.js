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

    services.factory('TasksResource', ['$q', '$http', function ($q, $http) {
        return function (resourceURL) {
            var data;
            return {
                get: function(){
                    if (!data) return false;
                    return data;
                },
                load: function() {
                    var deferred = $q.defer();
                    var request = $http.get(resourceURL);
                    request.then(function (response) {
                        data = response.data;
                        deferred.resolve(data);
                    });
                    request.catch(function (response) {
                        deferred.reject();
                    });
                    return deferred.promise;
                }
            };
        }
    }]);

    services.service('Channels', ['ManageTaskUtils', 'TasksResource', function (ManageTaskUtils, TasksResource) {
        var resource = TasksResource('../tasks/api/channel');
        resource.getModule = function (name) {
            var channels = resource.get();
            if (!channels) return false;
            for (var module of channels) {
                if(name === module.moduleName) return JSON.parse(JSON.stringify(module));
            }
            return false;
        }
        resource.getTrigger = function (moduleName, subject) {
            var module = resource.getModule(moduleName);
            if(!module) return false;
            for (var trigger of module.triggerTaskEvents) {
                if (trigger.subject === subject){
                    trigger.moduleName = module.moduleName;
                    return trigger;
                }
            }
        }
        resource.getEventParameters = function (moduleName, subject) {
            var module = resource.getModule(moduleName);
            var trigger = resource.getTrigger(moduleName, subject);
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
        return resource;
    }]);

    services.service('DataSources', ['ManageTaskUtils', 'TasksResource', function (ManageTaskUtils, TasksResource) {
        var resource = TasksResource('../tasks/api/datasource');
        resource.getProvider = function (providerId) {
            var sources = resource.get();
            if(!sources) return false;
            for(var provider of sources){
                if (provider.id == providerId) return JSON.parse(JSON.stringify(provider));
            }
        };
        resource.getObject = function (providerId, type) {
            var provider = resource.getProvider(providerId);
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
        resource.getFields = function (providerId, type) {
            var fields = [];
            var object = resource.getObject(providerId, type);
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
        return resource;
    }]);

}());
