(function () {

    'use strict';

    /* Controllers */

    var controllers = angular.module('tasks.controllers', []);

    controllers.controller('TasksDashboardCtrl', function ($scope, $filter, Tasks, Activities, $rootScope, $http, ManageTaskUtils) {
        var tasks, activities = [],
            searchMatch = function (item, method, searchQuery) {
                var result;

                if (!searchQuery) {
                    if (method === 'pausedTaskFilter') {
                        result = item.task.enabled === true;
                    } else if (method === 'activeTaskFilter') {
                        result = item.task.enabled === false;
                    } else if (method === 'noItems') {
                        result = false;
                    } else {
                        result = true;
                    }
                } else if (method === 'pausedTaskFilter' && item.task.description) {
                    result = item.task.enabled === true && (item.task.description.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1 || item.task.name.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1);
                } else if (method === 'activeTaskFilter' && item.task.description) {
                    result = item.task.enabled === false && (item.task.description.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1 || item.task.name.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1);
                } else if (method === 'activeTaskFilter' && item.task.description) {
                    result = item.task.description.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1 || item.task.name.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1;
                } else if (method === 'allItems' && item.task.description) {
                    result = item.task.description.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1 || item.task.name.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1;
                } else if (method === 'pausedTaskFilter') {
                    result = item.task.enabled === true && item.task.name.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1;
                } else if (method === 'activeTaskFilter') {
                    result = item.task.enabled === false && item.task.name.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1;
                } else if (method === 'noItems') {
                    result = false;
                } else {
                    result = item.task.name.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1;
                }

                return result;
            };

        $scope.allTasks = [];
        $scope.activities = [];
        $scope.hideActive = false;
        $scope.hidePaused = false;
        $scope.filteredItems = [];
        $scope.itemsPerPage = 10;
        $scope.currentFilter = 'allItems';
        $scope.formatInput = [];
        $scope.util = ManageTaskUtils;

        innerLayout({
            spacing_closed: 30,
            east__minSize: 200,
            east__maxSize: 350
        }, {
            show: true,
            button: '#tasks-filters'
        });

        $("#tasks-filters").bind('click', function () {
            $("#recentTaskActivity-tab").removeClass('active');
            $("#recentTaskActivity").removeClass('in active');
            $("#filters-tab").addClass('active');
            $("#filters").addClass(' in active');
        });

        $scope.getNumberOfActivities = function(id, type) {
            var numberOfActivities;
            $.ajax({
                url: '../tasks/api/activity/' + id + '/' + type,
                success:  function(data) {
                    numberOfActivities = data;
                },
                async: false
            });

            return numberOfActivities;
        };

        $scope.getTasks = function () {
            $scope.allTasks = [];

            tasks = Tasks.query(function () {
                activities = Activities.query(function () {
                    var item, i, j;

                    for (i = 0; i < tasks.length; i += 1) {
                        item = {
                            task: tasks[i],
                            success: $scope.getNumberOfActivities(tasks[i].id, 'SUCCESS'),
                            error: $scope.getNumberOfActivities(tasks[i].id, 'ERROR')
                        };

                        $scope.allTasks.push(item);
                    }

                    $rootScope.search();
                    $('#inner-center').trigger("change");
                });
            });
        };

        $scope.enableTask = function (item, enabled) {
            item.task.enabled = enabled;

            $http.post('../tasks/api/task/' + item.task.id, item.task)
                .success(dummyHandler)
                .error(function (response) {
                    item.task.enabled = !enabled;
                    jAlert($scope.util.createErrorMessage($scope, response, false), $scope.msg('task.error.actionNotChangeTitle'));
                });
        };

        $scope.deleteTask = function (item) {
            jConfirm(jQuery.i18n.prop('task.confirm.remove'), jQuery.i18n.prop("task.header.confirm"), function (val) {
                if (val) {
                    blockUI();

                    item.task.$remove(function () {
                        $scope.allTasks.removeObject(item);
                        $rootScope.search();
                        $('#inner-center').trigger("change");
                        unblockUI();
                    }, alertHandler('task.error.removed', 'task.header.error'));
                }
            });
        };

        $rootScope.search = function () {
            $scope.filteredItems = $filter('filter')($scope.allTasks, function (item) {
                return item && searchMatch(item, $scope.currentFilter, $rootScope.query);
            });

            $scope.setCurrentPage(0);
            $scope.groupToPages($scope.filteredItems, $scope.itemsPerPage);
        };

        $rootScope.setHideActive = function () {
            if ($scope.hideActive === true) {
                $scope.hideActive = false;
                $scope.setFilter($scope.hidePaused ? 'pausedTaskFilter' : 'allItems');

                $('.setHideActive').find('i').removeClass("fa-square-o").addClass('fa-check-square-o');
            } else {
                $scope.hideActive = true;
                $scope.setFilter($scope.hidePaused ? 'noItems' : 'activeTaskFilter');

                $('.setHideActive').find('i').removeClass("fa-check-square-o").addClass('fa-square-o');
            }
        };

        $rootScope.setHidePaused = function () {
            if ($scope.hidePaused === true) {
                $scope.hidePaused = false;
                $scope.setFilter($scope.hideActive ? 'activeTaskFilter' : 'allItems');

                $('.setHidePaused').find('i').removeClass("fa-square-o").addClass('fa-check-square-o');
            } else {
                $scope.hidePaused = true;
                $scope.setFilter($scope.hideActive ? 'noItems' : 'pausedTaskFilter');

                $('.setHidePaused').find('i').removeClass("fa-check-square-o").addClass('fa-square-o');
            }
        };

        $scope.setFilter = function (method) {
            $scope.currentFilter = method;
            $rootScope.search();
            $('#inner-center').trigger("change");
        };

        $scope.importTask = function () {
            blockUI();

            $('#importTaskForm').ajaxSubmit({
                success: function () {
                    $scope.getTasks();
                    $('#importTaskForm').resetForm();
                    $('#importTaskModal').modal('hide');
                    unblockUI();
                },
                error: function (response) {
                    handleResponse('task.header.error', 'task.error.import', response);
                }
            });
        };

        $scope.closeImportTaskModal = function () {
            $('#importTaskForm').resetForm();
            $('#importTaskModal').modal('hide');
        };

        $scope.resetItemsPagination();
        $scope.getTasks();

    });

    controllers.controller('TasksRecentActivityCtrl', function ($scope, Tasks, Activities) {

            var RECENT_TASK_COUNT = 7, tasks, activities = [];

            $scope.activities = [];
            $scope.formatInput = [];

            $scope.getNumberOfActivities = function(id, type) {
                var numberOfActivities;
                $.ajax({
                    url: '../tasks/api/activity/' + id + '/' + type,
                    success:  function(data) {
                        numberOfActivities = data;
                    },
                    async: false
                });

                return numberOfActivities;
            };

            $scope.getTasks = function () {

                tasks = Tasks.query(function () {
                    activities = Activities.query(function () {
                        var item, i, j;

                        for (i = 0; i < tasks.length; i += 1) {
                            item = {
                                task: tasks[i],
                                success: $scope.getNumberOfActivities(tasks[i].id, 'SUCCESS'),
                                error: $scope.getNumberOfActivities(tasks[i].id, 'ERROR')
                            };
                        }

                        for (i = 0; i < RECENT_TASK_COUNT && i < activities.length; i += 1) {
                            for (j = 0; j < tasks.length; j += 1) {
                                if (activities[i].task === tasks[j].id) {
                                    $scope.activities.push({
                                        task: activities[i].task,
                                        trigger: tasks[j].trigger,
                                        actions: tasks[j].actions,
                                        date: activities[i].date,
                                        type: activities[i].activityType,
                                        name: tasks[j].name
                                    });
                                    break;
                                }
                            }
                        }
                    });
                });
            };
            $scope.getTasks();

        });

    controllers.controller('TasksFilterCtrl', function($scope, $rootScope) {

        $scope.setHidePaused = function() {
            $rootScope.setHidePaused();
        };

        $scope.setHideActive = function() {
            $rootScope.setHideActive();
        };

        $scope.search = function() {
            $rootScope.query = $scope.query;
            $rootScope.search();
            $('#inner-center').trigger("change");
        };

    });

    controllers.controller('TasksManageCtrl', function ($scope, ManageTaskUtils, Channels, DataSources, Tasks, $q, $timeout, $routeParams, $http, $compile, $filter) {
        $scope.util = ManageTaskUtils; // Should call directly to avoid confusion?
        $scope.selectedActionChannel = [];
        $scope.selectedAction = [];
        $scope.task = { // Should be defined in factory?
            taskConfig: {
                steps: []
            }
        };

        innerLayout({
            spacing_closed: 30,
            east__minSize: 200,
            east__maxSize: 350
        });

        $scope.filter = $filter('filter');

        blockUI();

        $q.all([
            Channels.load(),
            DataSources.load()
        ]).then(function(data) {
            blockUI();

            $scope.channels = data[0];
            $scope.dataSources = data[1];

            if ($routeParams.taskId === undefined) {
                $scope.task = {
                    taskConfig: {
                        steps: []
                    }
                };
            } else {
                $scope.task = Tasks.get({ taskId: $routeParams.taskId }, function () {
                    var triggerChannel, trigger, dataSource, object;

                    if ($scope.task.trigger) {
                        $scope.selectTrigger(
                            $scope.task.trigger.moduleName,
                            $scope.task.trigger.subject
                        );
                    }

                    angular.forEach($scope.task.actions, function (info, idx) {
                        var action = null, actionBy = [];

                        $scope.selectedActionChannel[idx] = $scope.util.find({
                            where: $scope.channels,
                            by: {
                                what: 'moduleName',
                                equalTo: info.moduleName
                            }
                        });

                        if ($scope.selectedActionChannel[idx]) {
                            if (info.name) {
                                actionBy.push({ what: 'name', equalTo: info.name });
                                action = $scope.util.find({
                                    where: $scope.selectedActionChannel[idx].actionTaskEvents,
                                    by: actionBy
                                });
                            } else {
                                if (info.subject) {
                                    actionBy.push({ what: 'subject', equalTo: info.subject });
                                }

                                if (info.serviceInterface && info.serviceMethod) {
                                    actionBy.push({ what: 'serviceInterface', equalTo: info.serviceInterface });
                                    actionBy.push({ what: 'serviceMethod', equalTo: info.serviceMethod });
                                }

                                action = $scope.util.find({
                                    where: $scope.selectedActionChannel[idx].actionTaskEvents,
                                    by: actionBy
                                });
                            }

                            if (action) {
                                $timeout(function () {
                                    $scope.util.action.select($scope, idx, action);
                                    angular.element('#collapse-action-' + idx).collapse('hide');

                                    angular.forEach($scope.selectedAction[idx].actionParameters, function (param) {
                                        param.value = info.values[param.key] || '';
                                        param.value = $scope.util.convertToView($scope, param.type, param.value);
                                    });
                                });
                            }
                        }
                    });
                });
            }

            unblockUI();
        });

        $scope.selectTrigger = function (moduleName, subject, confirm) {
            var channel, trigger;
            if ($scope.task.trigger && !confirm) {
                motechConfirm('task.confirm.trigger', "task.header.confirm", function (val) {
                    if (val) $scope.selectTrigger(moduleName, subject, true);
                });
            } else {
                channel = Channels.getModule(moduleName);
                trigger = Channels.getTrigger(moduleName, subject);
                $scope.task.trigger = {
                    displayName: trigger.displayName,
                    channelName: channel.displayName,
                    moduleName: channel.moduleName,
                    moduleVersion: channel.moduleVersion,
                    subject: trigger.subject,
                    triggerListenerSubject: trigger.triggerListenerSubject
                };
                $scope.selectedTrigger = trigger;
            }
            //angular.element("#trigger-" + channel.moduleName).parent('li').addClass('selectedTrigger').addClass('active');
            /*
            if (angular.element("#collapse-trigger").collapse) {
                angular.element("#collapse-trigger").collapse('hide');
            }
            */
        };
        $scope.removeTrigger = function () {
            motechConfirm('task.confirm.trigger', "task.header.confirm", function (val) {
                if (val) {
                    delete $scope.task.trigger;
                    delete $scope.selectedTrigger;
                }
            });
        };

        $scope.addAction = function () {
            if (!$scope.task.actions) {
                $scope.task.actions = [];
            }
            $scope.task.actions.push({});
        };

        $scope.removeAction = function (idx) {
            var removeActionSelected = function (idx) {
                $scope.task.actions.remove(idx);
                $scope.selectedActionChannel.remove(idx);
                $scope.selectedAction.remove(idx);
                if (!$scope.$$phase) {
                    $scope.$apply($scope.task);
                }
            };

            if ($scope.selectedActionChannel[idx] !== undefined && $scope.selectedActionChannel[idx].displayName !== undefined) {
                motechConfirm('task.confirm.action', "task.header.confirm", function (val) {
                    if (val) {
                        removeActionSelected(idx);
                    }
                });
            } else {
                removeActionSelected(idx);
            }
        };

        $scope.selectActionChannel = function (idx, channel) {
            if ($scope.selectedActionChannel[idx] && $scope.selectedAction[idx]) {
                motechConfirm('task.confirm.action', "task.header.confirm", function (val) {
                    if (val) {
                        $scope.task.actions[idx] = {};
                        $scope.selectedActionChannel[idx] = channel;
                        $scope.selectedAction.remove(idx);

                        if (!$scope.$$phase) {
                            $scope.$apply($scope.task);
                        }
                    }
                });
            } else {
                $scope.selectedActionChannel[idx] = channel;
            }
        };

        $scope.getActions = function (idx) {
            return ($scope.selectedActionChannel[idx] && $scope.selectedActionChannel[idx].actionTaskEvents) || [];
        };

        $scope.selectAction = function (idx, action) {
            if ($scope.selectedAction[idx]) {
                motechConfirm('task.confirm.action', "task.header.confirm", function (val) {
                    if (val) {
                        $scope.util.action.select($scope, idx, action);
                    }
                });
            } else {
                $scope.util.action.select($scope, idx, action);
            }
        };

        $scope.addStep = function (type) {
            var data = {};
            data['@type'] = type;
            $scope.task.taskConfig.steps.push(data);
        }

        $scope.addFilterSet = function () {
            $scope.addStep(ManageTaskUtils.FILTER_SET_STEP);
        }

        $scope.addDataSource = function () {
            $scope.addStep(ManageTaskUtils.DATA_SOURCE_STEP);
        }

        $scope.removeStep = function (data) {
            var remove = function () {
                $scope.task.taskConfig.steps.removeObject(data);

                if (!$scope.$$phase) { // can I remove this? plz?
                    $scope.$apply($scope.task);
                }
            };

            if (true) { // make sure object is non-empty
                //'task.confirm.dataSource'
                motechConfirm('task.confirm.filterSet', "task.header.confirm", function (val) {
                    if (val) {
                        remove(data);
                    }
                });
            } else {
                remove();
            }
        };

        $scope.save = function (enabled) {
            var success = function (response) {
                    var alertMessage = enabled ? $scope.msg('task.success.savedAndEnabled') : $scope.msg('task.success.saved'),
                    loc, indexOf, errors = response.validationErrors || response;

                    if (errors.length > 0) {
                        alertMessage = $scope.util.createErrorMessage($scope, errors, true);
                    }

                    jAlert(alertMessage, $scope.msg('task.header.saved'), function () {
                        unblockUI();
                        loc = window.location.toString();
                        indexOf = loc.indexOf('#');

                        window.location = "{0}#/tasks/dashboard".format(loc.substring(0, indexOf));
                    });
                },
                error = function (response) {
                    var data = (response && response.data) || response;

                    angular.forEach($scope.task.actions, function (action) {
                        delete action.values;
                    });

                    angular.forEach($scope.task.taskConfig.steps, function (step) {
                        if (step['@type'] === 'DataSource') {
                            angular.forEach(step.lookup, function(lookupField) {
                                lookupField.value = $scope.util.convertToView($scope, 'UNICODE', lookupField.value);
                            });
                        }
                    });

                    delete $scope.task.enabled;

                    unblockUI();
                    jAlert($scope.util.createErrorMessage($scope, data, false), $scope.msg('task.header.error'));
                };

            $scope.task.enabled = enabled;

            angular.forEach($scope.selectedAction, function (action, idx) {
                if ($scope.task.actions[idx].values === undefined) {
                    $scope.task.actions[idx].values = {};
                }

                if ($scope.task.actions[idx].name === undefined && action.name !== undefined) {
                    $scope.task.actions[idx].name = action.name;
                }

                angular.forEach(action.actionParameters, function (param) {
                    $scope.task.actions[idx].values[param.key] = param.value; // This is what we are aiming for

                    if (!param.required && isBlank($scope.task.actions[idx].values[param.key])) {
                        delete $scope.task.actions[idx].values[param.key];
                    }
                });
            });

            angular.forEach($scope.task.taskConfig.steps, function (step) {
                if (step['@type'] === 'DataSource') {
                    if (step.lookup === undefined) {
                        step.lookup = [];
                    }
                    angular.forEach(step.lookup, function(lookupField) {
                        lookupField.value = $scope.util.convertToServer($scope, lookupField.value || '');
                    });

                }
            });

            blockUI();

            if (!$routeParams.taskId) {
                $http.post('../tasks/api/task/save', $scope.task).success(success).error(error);
            } else {
                $http.post('../tasks/api/task/' + $routeParams.taskId, $scope.task).success(success).error(error);
            }
        };

        $scope.showHelp = function () {
            $('#helpModalDate').modal();
        };

        $scope.msg = function(message) { //Move to service?
            if (message === undefined) {
                return "";
            }
            message = $scope.$parent.msg(message);
            if (message[0] === '[' && message[message.length-1] === ']') {
                return message.substr(1, message.length-2);
            } else {
                return message;
            }
        };

        $scope.getFields = function (beforeStep) {
            var fields = [];
            if($scope.selectedTrigger) {
               Channels.getEventParameters(
                $scope.selectedTrigger.moduleName,
                $scope.selectedTrigger.subject)
               .forEach(function (field) {
                    fields.push(field);
                });
            }
            if (!$scope.task.taskConfig.steps) return fields;
            $scope.task.taskConfig.steps.forEach(function (step, index) {
                if(step['@type'] != ManageTaskUtils.DATA_SOURCE_STEP) return false;
                if(beforeStep <= index) return false;
                DataSources.getFields(step.providerId, step.type).forEach(function (field) {
                    fields.push(field);
                });
            });
            return fields;
        }
        $scope.$on('fields.changed', function(event) {
            if (event.targetScope == $scope) return;
            if (event.stopPropagation) event.stopPropagation();
            $scope.$broadcast('fields.changed');
        });
    });

    controllers.controller('TasksLogCtrl', function ($scope, Tasks, Activities, $routeParams, $filter) {
        var data, task;

        $scope.taskId = $routeParams.taskId;
        $scope.activityTypes = ['All', 'Warning', 'Success', 'Error'];
        $scope.selectedActivityType = 'All';

        innerLayout({
            spacing_closed: 30,
            east__minSize: 200,
            east__maxSize: 350
        });

        if ($routeParams.taskId !== undefined) {
            data = { taskId: $scope.taskId };

            task = Tasks.get(data, function () {

                if (task.trigger) {
                    $scope.trigger = {
                        channelName: task.trigger.channelName,
                        moduleName: task.trigger.moduleName,
                        moduleVersion: task.trigger.moduleVersion
                    };
                }

                $scope.actions = [];

                angular.forEach(task.actions, function (action) {
                    $scope.actions.push({
                        channelName: action.channelName,
                        moduleName: action.moduleName,
                        moduleVersion: action.moduleVersion
                    });
                });

                $scope.description = task.description;
                $scope.enabled = task.enabled;
                $scope.name = task.name;
            });
        }

        $scope.changeActivityTypeFilter = function () {
            $('#taskHistoryTable').jqGrid('setGridParam', {
                page: 1,
                postData: {
                    activityType: ($scope.selectedActivityType === 'All') ? '' : $scope.selectedActivityType.toUpperCase()
                }}).trigger('reloadGrid');
        };

        $scope.refresh = function () {
            $("#taskHistoryTable").trigger('reloadGrid');
        };

        $scope.clearHistory = function () {
            motechConfirm('task.history.confirm.clearHistory', 'task.history.confirm.clear',function (r) {
                if (!r) {
                    return;
                }
                blockUI();
                Activities.remove({taskId: $routeParams.taskId}, function () {
                     $scope.refresh();
                     unblockUI();
                 }, function (response) {
                     unblockUI();
                     handleResponse('task.header.error', 'task.history.deleteError', response);
                 });
            });
        };
    });


    controllers.controller('TasksSettingsCtrl', function ($scope, Settings) {
        $scope.settings = Settings.get();

        innerLayout({
            spacing_closed: 30,
            east__minSize: 200,
            east__maxSize: 350
        });

        $scope.submit = function() {
            $scope.settings.$save(function() {
                motechAlert('task.settings.success.saved', 'server.saved');
            }, function() {
                motechAlert('task.settings.error.saved', 'server.error');
            });
        };

        $scope.cssClass = function(prop) {
            var msg = 'control-group';

            if (!$scope.isNumeric(prop)) {
                msg = msg.concat('server.error');
            }

            return msg;
        };

        $scope.isNumeric = function(prop) {
            return $scope.settings.hasOwnProperty(prop) && /^[0-9]+$/.test($scope.settings[prop]);
        };

    });

    controllers.controller('MapsCtrl', function ($scope) {
        var exp, values, keyValue, dragAndDrop = $scope.BrowserDetect.browser === 'Chrome' || $scope.BrowserDetect.browser === 'Explorer' || $scope.BrowserDetect.browser === 'Firefox';

        if (dragAndDrop) {
            exp = /((?::)((?!<span|<br>|>)[\w\W\s])+(?=$|<span|<\/span>|<br>))|((?:<br>)((?!<span|<br>)[\w\W\s])*(?=:))|(<span((?!<span)[\w\W\s])*<\/span>)/g;
        } else {
            exp = /((?:^|\n|\r)[\w{}\.#\s]*(?=:)|(:[\w{}\.#\s]*)(?=\n|$))/g;
        }

        $scope.data = $scope.$parent.$parent.$parent.i;
        $scope.pairs = [];
        $scope.pair = {key:"", value:""};
        $scope.dataTransformed = false;
        $scope.mapError = "";

        $scope.$watch(function (scope) {
            return scope.data.value;

        }, function () {
            var i,j,key,value;
            if ($scope.pairs.length === 0 && $scope.data.value !== "" && $scope.data.value !== null && !$scope.dataTransformed) {
                values = $scope.data.value.split("<br>");

                for (i = 0; i < values.length; i += 1) {
                    keyValue = values[i].split(":");

                    exp = new RegExp("( relative;.*?\">.*<\/span>)");
                    for (j = 1; j < keyValue.length; j += 1) {
                        if (exp.test(keyValue[j])) {
                            keyValue[j-1] += ":" + keyValue[j];
                            keyValue.splice(j, 1);
                            j -= 1;
                        }
                    }

                    key = keyValue[0];
                    value =  keyValue[1];

                    $scope.pairs.push({key:key, value:value});
                }

                $scope.dataTransformed = true;
            }
        });

        $scope.addPair = function (pair) {
            if ($scope.uniquePairKey(pair.key, -1)) {
                $scope.mapError = $scope.msg('task.error.duplicateMapKeys');
            } else if ($scope.emptyMap(pair)) {
                $scope.mapError = $scope.msg('task.error.emptyMapPair');
            } else {
                $scope.addToDataValue(pair, $scope.pairs.length);
                $scope.pairs.push({key: pair.key , value : pair.value});
                $scope.pair = {key:"", value:""};
                $scope.mapError = "";
            }
        };

       /**
       * Checks if the keys are unique.
       */
       $scope.uniquePairKey = function (mapKey, elementIndex) {
           var exp, keysList;
           elementIndex = parseInt(elementIndex, 10);
           exp = new RegExp('(<span.*?>)','g');
           keysList = function () {
               var resultKeysList = [];
               angular.forEach($scope.pairs, function (pair, index) {
                   if (pair !== null && pair.key !== undefined && pair.key.toString() !== '') {
                        if (index !== elementIndex) {
                            resultKeysList.push(pair.key.toString().replace(exp, ""));
                        }
                   }
               }, resultKeysList);
               return resultKeysList;
           };
           return $.inArray(mapKey.replace(exp, ""), keysList()) !== -1;
       };

       /**
       * Checks if the pair is empty.
       */
       $scope.emptyMap = function (pair) {
           return !(pair.key.toString().length > 0 && pair.value.toString().length > 0);
       };

        $scope.remove = function (index) {
            $scope.pairs.splice(index,1);
            $scope.data.value = "";

            $scope.pairs.forEach(function(element, index, array) {
                 $scope.addToDataValue(element, index);
             });
        };

        $scope.updateMap = function (pair, index) {
            if (!$scope.uniquePairKey(pair.key, index) && !$scope.emptyMap(pair)) {
                $scope.data.value = "";

                $scope.pairs.forEach(function(element, index, array) {
                     $scope.addToDataValue(element, index);
                });
            }
        };

        $scope.clearKey = function () {
            $scope.pair.key="";
        };

        $scope.clearValue = function () {
            $scope.pair.value="";
        };

        $scope.reset = function () {
            var resetMap = function () {
                $scope.pairs = [];
                $scope.data.value = "";

                if (!$scope.$$phase) {
                    $scope.$apply($scope.task);
                }
            };

            motechConfirm('task.confirm.reset.map', "task.header.confirm", function (val) {
                if (val) {
                    resetMap();
                }
            });
        };

        $scope.addToDataValue = function (pair, index) {
            var paired;
            if (index > 0 && dragAndDrop) {
                paired = "<div>" + pair.key + ":" + pair.value + "</div>";
            } else {
                paired = pair.key + ":" + pair.value;
            }

            if(!dragAndDrop) {
                paired = paired.concat("\n");
            }

            if ($scope.data.value === null) {
                $scope.data.value = "";
            }

            $scope.data.value = $scope.data.value.concat(paired);
        };
    });
}());
