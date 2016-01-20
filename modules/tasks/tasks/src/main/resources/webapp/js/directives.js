(function () {
    'use strict';

    /* Directives */

    var directives = angular.module('tasks.directives', []);

    directives.directive('taskHistoryGrid', function($compile, $http) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                try {
                    if (typeof($('#outsideTaskHistoryTable')[0].grid) !== 'undefined') {
                        return;
                    }
                }
                catch (e) {
                    return;
                }

                var elem = angular.element(element), k, rows, activity, message, date, stackTraceElement, fields, messageToShow;

                elem.jqGrid({
                    url: '../tasks/api/activity/' + scope.taskId,
                    datatype: 'json',
                    jsonReader:{
                        repeatitems:false
                    },
                    colModel: [{
                        name: 'activityType',
                        index: 'activityType',
                        sortable: false,
                        width: 50
                    }, {
                        name: 'message',
                        index: 'message',
                        sortable: false,
                        width: 220
                    }, {
                        name: 'date',
                        formatter: function (value) {
                            return moment(parseInt(value, 10)).fromNow();
                        },
                        index: 'date',
                        sortable: false,
                        width: 80
                    }, {
                       name: 'stackTraceElement',
                       index: 'stackTraceElement',
                       sortable: false,
                       hidden: true
                    }, {
                       name: 'fields',
                       index: 'fields',
                       sortable: false,
                       hidden: true
                    }],
                    pager: '#' + attrs.taskHistoryGrid,
                    viewrecords: true,
                    gridComplete: function () {
                        elem.jqGrid('setLabel', 'activityType', scope.msg('task.subsection.status'));
                        elem.jqGrid('setLabel', 'message', scope.msg('task.subsection.message'));
                        elem.jqGrid('setLabel', 'date', scope.msg('task.subsection.information'));

                        $('#outsideTaskHistoryTable').children('div').css('width','100%');
                        $('.ui-jqgrid-htable').addClass("table-lightblue");
                        $('.ui-jqgrid-btable').addClass("table-lightblue");
                        $('.ui-jqgrid-htable').width('100%');
                        $('.ui-jqgrid-bdiv').width('100%');
                        $('.ui-jqgrid-hdiv').width('100%');
                        $('.ui-jqgrid-view').width('100%');
                        $('#t_taskHistoryTable').width('auto');
                        $('.ui-jqgrid-pager').width('100%');
                        $('.ui-jqgrid-hbox').css({'padding-right':'0'});
                        $('.ui-jqgrid-hbox').width('100%');
                        $('#outsideTaskHistoryTable').children('div').each(function() {
                            $(this).find('table').width('100%');
                        });
                        rows = $("#taskHistoryTable").getDataIDs();
                        for (k = 0; k < rows.length; k+=1) {
                            activity = $("#taskHistoryTable").getCell(rows[k],"activityType").toLowerCase();
                            message = $("#taskHistoryTable").getCell(rows[k],"message");
                            if (activity !== undefined) {
                                if (activity === 'success') {
                                    $("#taskHistoryTable").jqGrid('setCell',rows[k],'activityType','<img src="../tasks/img/icon-ok.png" class="recent-activity-task-img"/>','ok',{ },'');
                                } else if (activity === 'warning') {
                                    $("#taskHistoryTable").jqGrid('setCell',rows[k],'activityType','<img src="../tasks/img/icon-question.png" class="recent-activity-task-img"/>','ok',{ },'');
                                } else if (activity === 'error') {
                                    $("#taskHistoryTable").jqGrid('setCell',rows[k],'activityType','<img src="../tasks/img/icon-exclamation.png" class="recent-activity-task-img"/>','ok',{ },'');
                                }
                            }

                            stackTraceElement = $("#taskHistoryTable").getCell(rows[k],"stackTraceElement");
                            fields = $("#taskHistoryTable").getCell(rows[k], "fields").split(",");
                            messageToShow = [message].concat(fields);
                            if (message !== undefined && activity === 'error' && stackTraceElement !== undefined && stackTraceElement !== null) {
                                $("#taskHistoryTable").jqGrid('setCell',rows[k],'message',
                                    '<p class="wrap-paragraph">' + scope.msg(messageToShow) +
                                    '&nbsp;&nbsp;<span class="label label-danger pointer" data-toggle="collapse" data-target="#stackTraceElement' + k + '">' +
                                    scope.msg('task.button.showStackTrace') + '</span></p>' +
                                    '<pre id="stackTraceElement' + k + '" class="collapse">' + stackTraceElement + '</pre>'
                                    ,'ok',{ },'');
                            } else if (message !== undefined) {
                                $("#taskHistoryTable").jqGrid('setCell',rows[k],'message',scope.msg(message),'ok',{ },'');
                            }
                        }
                    }
                });
            }
        };
    });

    directives.directive('taskPanelsResize', function ($window, $timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var windowDimensions = angular.element($window), setTableSize, setListSize, widthList, widthTBody, widthTaskPanel, widthTdRecentInfo, widthListHistory;

                setTableSize = function () {
                    widthTBody = $('#table-activity').width();
                    widthTdRecentInfo = Math.floor(widthTBody - (36 * 4));
                    $('.table-recent-activity  tbody td.recent-info').css({'text-overflow':'ellipsis', 'max-width': widthTdRecentInfo, 'min-width': 30});
                };

                setListSize = function () {
                    widthList = $('#task-list').width();
                    widthTaskPanel = Math.floor(widthList - 388);
                    $('#task-list .task-element.task-long-name').css({'text-overflow':'ellipsis', 'max-width': widthTaskPanel, 'min-width': 100});
                    widthListHistory = $('.history').width();
                    widthTaskPanel = Math.floor(widthListHistory - 300);
                    $('.history .task-element.task-long-name').css({'text-overflow':'ellipsis', 'max-width': widthTaskPanel, 'min-width': 100});
                };

                scope.getWindowDimensions = function () {
                    return {
                        'h': windowDimensions.height(),
                        'w': windowDimensions.width()
                    };
                };

                scope.$watch(scope.getWindowDimensions, function () {
                     $timeout(function() {
                         setTableSize();
                         setListSize();
                     }, 500);
                }, true);

                windowDimensions.on('resize', function () {
                    scope.$apply();
                });

                $('#inner-center').on('change', function() {
                    $timeout(function() {
                        setTableSize();
                        setListSize();
                    }, 250);
                });

                $('#inner-center').trigger("change");
            }
        };
    });

    directives.directive('taskStep', function () {
        return {
            restrict: 'EA',
            replace: true,
            transclude: true,
            scope: {
                step: "=",
                remove: "&"
            },
            templateUrl: '../tasks/partials/form-task-step.html'
        }
    });

    directives.directive('taskDataSource', function () {
        return {
            restrict: 'EA',
            scope: {
                step:'=',
                index: '=',
                dataSources: '=sources',
                availableFieldsFn: '&'
            },
            templateUrl: '../tasks/partials/form-data-source.html',
            controller: ['$scope', 'DataSources', 'ManageTaskUtils', function ($scope, ManageTaskUtils) {
                $scope.msg = $scope.$parent.msg;

                // Defaults
                $scope.source = false;
                $scope.object = false;
                $scope.lookup = false;
                $scope.failIfDataNotFound = false;
                $scope.fields = false;

                if (!$scope.fields) $scope.fields = [];

                // LOAD Source, Object & Lookup data
                var getAvailableFields = function() {
                    $scope.availableFields = $scope.availableFieldsFn();
                };
                $scope.$on('fields.changed', getAvailableFields);
                getAvailableFields();

                $scope.$watch('fields', function(newFields){
                    $scope.$emit('fields.changed');
                });

                $scope.$watch('source', function (newSource) {
                    if(!newSource){
                        delete $scope.step.providerId;
                    } else {
                        $scope.step.providerName = newSource.name; // if this is just used for display, remove
                        $scope.step.providerId = newSource.id;
                    }
                    $scope.object = false; // reset dependants
                });

                $scope.$watch('object', function (newObject) {
                    if (!newObject) {
                        delete $scope.step.type;
                        delete $scope.fields;
                    } else {
                        $scope.step.type = newObject.type;
                        $scope.fields = newObject.fields;
                    }
                    $scope.lookup = false;
                    $scope.failIfDataNotFound = false;
                });

                $scope.$watch('lookup', function (newLookup) {
                    if(!newLookup) {
                        delete $scope.step.lookup;
                    } else {
                        $scope.step.lookup = [];
                        newLookup.fields.forEach(function (field) {
                            $scope.step.lookup.push({
                                field: field,
                                value: '' // default...
                            });
                        });
                    }
                });

                $scope.$watch('failIfDataNotFound', function(newValue) {
                    $scope.step.failIfDataNotFound = newValue;
                });

                $scope.selectDataSource = function (source) {
                    // modal to confirm change...
                    $scope.source = source;
                }

                $scope.selectObject = function (object) {
                    // modal to confirm change...
                    $scope.object = object;
                };
                $scope.selectLookup = function (lookup) {
                    $scope.lookup = lookup;
                };

            }],
            link: function(scope, element, attrs, ngModel) {
                //
            }
        }
    });

    directives.directive('taskFilterSet', function () {
        return {
            restrict: 'EA',
            templateUrl: '../tasks/partials/form-filter-set.html',
            scope: {
                filterSet: '=ngModel',
                dataSources: '=sources',
                availableFieldsFn: '&'
            },
            controller: ['$scope', 'ManageTaskUtils', function ($scope, ManageTaskUtils) {
                // Set defaults...
                $scope.filters = $scope.filterSet.filters || [];

                var getAvailableFields = function() {
                    $scope.availableFields = $scope.availableFieldsFn();
                };
                $scope.$on('fields.changed', getAvailableFields);
                getAvailableFields();

                $scope.or_operator = null;
                if($scope.filterSet.operator == ManageTaskUtils.FILTER_OPERATOR_AND) $scope.or_operator = false;
                if($scope.filterSet.operator == ManageTaskUtils.FILTER_OPERATOR_OR) $scope.or_operator = true;

                $scope.addFilter = function () {
                    $scope.filters.push({});
                }
                $scope.removeFilter = function (index) {
                    $scope.filters.splice(index, 1);
                }

                $scope.$watch('filters', function(newFilters) {
                    $scope.filterSet.filters = newFilters;
                });

                $scope.$watch('or_operator', function(newValue) {
                    if(newValue) $scope.filterSet.operator = ManageTaskUtils.FILTER_OPERATOR_OR;
                    if(!newValue) $scope.filterSet.operator = ManageTaskUtils.FILTER_OPERATOR_AND;
                });
            }],
            link: function(scope, element, attrs) {
                scope.msg = scope.$parent.msg;
            }
        }
    });

    directives.directive('filter', ['ManageTaskUtils', function (ManageTaskUtils) {
        return {
            restrict: 'EA',
            require: 'ngModel',
            replace: false,
            templateUrl: '../tasks/partials/filter.html',
            scope: {
                remove: '&removeFn',
                availableFields:'='
            },
            link: function (scope, element, attrs, ngModel) {
                scope.msg = scope.$parent.msg;
                // field == key
                scope.FILTER_OPERATORS = ManageTaskUtils.FILTER_OPERATORS;
                scope.needsExpression = ManageTaskUtils.needsExpression;

                scope.setOperator = function (type, value) {
                    scope.type = type;
                    scope.operator = value;
                }

                ngModel.$render = function () {
                    scope.field = ngModel.$viewValue.key;
                    scope.negationOperator = ngModel.$viewValue.negationOperator;
                    scope.operator = ngModel.$viewValue.operator;
                    scope.expression = ngModel.$viewValue.expression;
                }

                scope.$watch('field + negationOperator + operator + type + expression', function(){
                    ngModel.$setViewValue({
                        key: scope.field,
                        negationOperator: scope.negationOperator,
                        operator: scope.operator,
                        type: scope.type,
                        expression: scope.expression
                    });

                });
            }
        }
    }]);

    directives.directive('fieldInput', ['DataSources', 'ManageTaskUtils', function (DataSources, ManageTaskUtils) {
        return {
            restrict: 'EA',
            require: 'ngModel',
            replace: false,
            templateUrl: '../tasks/partials/field-input.html',
            scope: {
                availableFields: '=?'
            },
            link: function (scope, element, attrs, ngModel) {
                scope.msg = scope.$parent.$parent.msg; // Do this differently...
                if (!scope.availableFields) scope.availableFields = []

                var sortFieldsBySource = function() {
                    var sources = [], providerIds = [], providerObjs = {};
                    for (var field of scope.availableFields) {
                        if (field.prefix == ManageTaskUtils.TRIGGER_PREFIX) {
                            if(providerIds.indexOf(field.triggerName) === -1){
                                providerIds.push(field.triggerName);
                                providerObjs[field.triggerName] = {
                                    type: field.moduleName,
                                    fields: [field]
                                };
                            } else {
                                providerObjs[field.triggerName].fields.push(field);
                            }
                        }
                        if (field.prefix == ManageTaskUtils.DATA_SOURCE_PREFIX) {
                            if(providerIds.indexOf(field.providerId) === -1){
                                providerIds.push(field.providerId);
                                providerObjs[field.providerId] = {
                                    type: field.providerType,
                                    fields: [field]
                                }
                            } else {
                                providerObjs[field.providerId].fields.push(field);
                            }
                        }
                    }
                    for(var providerId of providerIds) {
                        sources.push(providerObjs[providerId]);
                    }
                    scope.dataSources = sources; // Because a listener could be watching for changes, update only once...
                };
                scope.$on('fields.changed', sortFieldsBySource);
                sortFieldsBySource();

                ngModel.$formatters.push(function(modelValue){
                    var value = ManageTaskUtils.parseField(modelValue);
                    return {
                        displayName: value.displayName || "",
                        manipulations: value.manipulations || []
                    }
                });

                ngModel.$parsers.push(function (viewValue) {
                    return ManageTaskUtils.formatField(viewValue);
                });

                ngModel.$render = function () {
                    scope.displayName = ngModel.$viewValue.displayName;
                    scope.manipulations = ngModel.$viewValue.manipulations;
                };

                scope.selectField = function (field) {
                    if (scope.manipulations.length > 0) field.manipulations = scope.manipulations;
                    scope.displayName = field.displayName;
                    ngModel.$setViewValue(field);
                };
            }
        }
    }]);

    directives.directive('field', function () {
        return {
            restrict: 'E',
            replace: false,
            scope:{
                field: "=",
                editable: "=?"
            },
            link: function (scope, element, attrs) {
                if(!scope.field.manipulations || !Array.isArray(scope.field.manipulations)) scope.field.manipulations = [];

                element.data('value', scope.field);

                element.click(function (event) {
                    if(!$(event.target).hasClass("field-remove")) return;
                    element.remove();
                });
            },
            templateUrl: '../tasks/partials/field.html'
        }
    });

    directives.directive('draggable', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element
                  .draggable({
                    revert: true,
                    start: function () {
                        if (element.hasClass('draggable')) {
                            element.find("div:first-child").popover('hide');
                        }
                    }
                });
            }
        };
    });


    directives.directive('droppable', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.droppable({
                    drop: function (event, ui) {
                        var field = ui.draggable.data('value'); // Gross way to get the data...
                        scope.$emit('field.dropped', field);
                    }
                });
            }
        };
    });

    directives.directive('integer', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.keypress(function (evt) {
                    var charCode = evt.which || evt.keyCode,
                        allow = [8, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57]; // char code: <Backspace> 0 1 2 3 4 5 6 7 8 9

                    return allow.indexOf(charCode) >= 0;
                });
            }
        };
    });

    directives.directive('double', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.keypress(function (evt) {
                    var charCode = evt.which || evt.keyCode,
                        allow = [8, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57]; // char code: <Backspace> . 0 1 2 3 4 5 6 7 8 9

                    return allow.indexOf(charCode) >= 0;
                });
            }
        };
    });

    directives.directive('readOnly', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.keypress(function (evt) {
                    return false;
                });
            }
        };
    });

    directives.directive('contenteditable', function ($compile, ManageTaskUtils) {
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function (scope, element, attrs, ngModel) {
                if (!ngModel) return;

                var read = function () {
                    var container = $('<div></div>');
                    element.contents().each(function(){
                        var ele = $(this);
                        if(this.tagName && this.tagName.toLowerCase() == 'field'){
                            var field = ele.data('value');
                            container.append(ManageTaskUtils.formatField(field));
                        }else{
                            container.append(ele.text());
                        }
                    });
                    return container.text();
                };

                ngModel.$render = function () {
                    element.html("");
                    if(!ngModel.$viewValue) return;
                    var viewValueStr = ngModel.$viewValue; // copy becuase we are destructive with the value
                    var matches = viewValueStr.match(/{{[^{{]+}}/gi);
                    if(matches){
                        matches.forEach(function(match){
                            var matchStart = viewValueStr.indexOf(match);
                            if(matchStart > 0){
                                element.append(viewValueStr.substring(0, matchStart));
                            }
                            var fieldScope = scope.$parent.$new();
                            var fieldStr = viewValueStr.substr(matchStart, match.length);
                            fieldScope.field = ManageTaskUtils.parseField(fieldStr, scope.$parent.getAvailableFields());
                            var matchElement = $compile('<field field="field" editable="true" contenteditable="false" />')(fieldScope);
                            element.append(matchElement);

                            viewValueStr = viewValueStr.substring(matchStart + match.length, viewValueStr.length);
                        });
                    }
                    element.append(viewValueStr);
                };

                scope.$watch(function () {
                    return ngModel.$viewValue;
                }, function(){
                    ngModel.$render();
                });

                scope.$on('field.dropped', function(event, field) {
                    event.stopPropagation();
                    if(!field) return;
                    // maybe append formatted field at cursor point?
                    ngModel.$setViewValue(read() + ManageTaskUtils.formatField(field));
                    scope.$apply();
                });

                element.on('keypress', function (event) {
                    var type = $(this).data('type');

                    if (type !== 'TEXTAREA' && type !== 'MAP' && type !== 'LIST' && type !== 'PERIOD') {
                        return event.which !== 13;
                    }
                });

                element.bind('blur', function (event) {
                    event.stopPropagation();
                    if(element[0] != event.target) return;
                    ngModel.$setViewValue(read());
                    scope.$apply();
                });

                return read;
            }
        };
    });

    directives.directive('editableContent', function ($compile, $timeout, $http, $templateCache) {
        var templateLoader;

        return {
            restrict: 'E',
            replace : true,
            transclude: true,
            scope: {
                'data': '=',
                'index': '@',
                'action': '@'
            },
            compile: function (tElement, tAttrs, scope) {
                var url = '../tasks/partials/widgets/content-editable-' + tAttrs.type.toLowerCase() + '.html',

                templateLoader = $http.get(url, {cache: $templateCache})
                    .success(function (html) {
                        tElement.html(html);
                    });

                return function (scope, element, attrs) {
                    templateLoader.then(function () {
                        element.html($compile(tElement.html())(scope));
                    });

                    $timeout(function () {
                        element.find('div').focusout();
                    });
                };
            }
        };
    });

    directives.directive('manipulationPopover', function ($compile) {
        return {
            restrict: 'A',
            scope: {
                manipulations: "=",
                manipulationType: "="
            },
            link: function (scope, element, attrs) {
                if(!scope.manipulationType) return false;
                if (['UNICODE', 'TEXTAREA', 'DATE'].indexOf(scope.manipulationType) == -1) return false;
                if(!scope.manipulations) return false; // Break if isn't bound...

                var filter = scope.$parent.filter; // Should pull in better way...

                // Get real source.
                scope.msg = function (str) {
                    return str;
                }

                var hidePopup = function () {
                    element.removeClass('active');
                    element.popover('destroy');
                },
                showPopup = function () {
                    element.addClass('active');
                    element.popover({
                      title: function () {
                         switch(scope.manipulationType){
                             case 'STRING':
                                 return scope.msg('task.stringManipulation');
                             case 'DATE':
                             case 'DATE2DATE':
                                 return scope.msg('task.dateManipulation');
                         }
                         return null;
                      },
                      html: true,
                      content: '<manipulation-sorter type="'+scope.manipulationType+'" />', // I'd rather compile here...
                      placement: "auto left",
                      trigger: 'manual'
                    }).on('shown.bs.popover', function(event){
                      var popoverContent = $('.popover-content',$(event.target).next('.popover'))[0];
                      $compile(popoverContent)(scope);

                      $(document).on('click', function(event){
                        if (!popoverContent.contains(event.target)){
                            $(document).off(event);
                            hidePopup();
                        }
                      });

                    }).popover('show');
                };

                element.click(function (event) {
                    if ($(event.target).hasClass('field-remove')) return;
                    if (element.hasClass('active')) return;
                    event.stopPropagation();
                    window.getSelection().removeAllRanges(); // Make sure no text is selected...
                    showPopup();
                });
            }
        };
    });

    directives.directive('manipulationSorter', function($compile, $http, ManageTaskUtils) {
        return {
            restrict: 'EA',
            templateUrl: '../tasks/partials/manipulation-sorter.html',
            link: function (scope, element, attrs) {

                $('.sortable', element).sortable({
                    placeholder: "ui-state-highlight",
                    update: function (event, ui) {
                        var sorted = $(event.target);
                        var manipulations = [];
                        $('.manipulation', sorted).each(function(){
                            manipulations.push({
                                type: $(this).attr('type'),
                                argument: $(this).data('argument')
                            });
                        });
                        scope.manipulations = manipulations;
                        scope.$apply();
                    }
                });
            },
            controller: ['$scope', function ($scope) {
                var stringManipulations = [
                    {type:'toUpper'},
                    {type:'toLower'},
                    {type:'capitalize'},
                    {type:'URLEncode'},
                    {type:'join', argumentType:'text'},
                    {type:'split', argumentType:'text'},
                    {type:'substring', argumentType:'text'},
                    {type:'format', argumentType:'format'},
                    {type:'parseDate', argumentType:'text'},
                ];

                if ($scope.type == 'DATE') true;
                if ($scope.type == 'DATE2DATE') true;

                $scope.availableManipulations = stringManipulations;


                this.addManipulation = function (type, argument) {
                    if(!argument) argument = "";
                    $scope.manipulations.push({
                        type: type,
                        argument: argument
                    });
                    $scope.$apply();
                }

                this.removeManipulation = function (manipulationStr) {
                    var manipulations = [];
                    var returnVal = false;
                    for (var obj of $scope.manipulations) {
                        if(obj.type != manipulationStr) manipulations.push(obj);
                        if(obj.type == manipulationStr) returnVal = true;
                    }
                    $scope.manipulations = manipulations;
                    $scope.$apply();
                    return returnVal;
                }

                this.isActive = function (manipulationStr) {
                    for (var obj of $scope.manipulations) {
                        if (obj.type == manipulationStr) return true;
                    }
                    return false;
                }
            }]
        }
    });

    directives.directive('manipulation', function ($compile) {
        return {
            restrict : 'EA',
            require: '^manipulationSorter',
            transclude: true,
            replace: true,
            templateUrl: '../tasks/partials/manipulation.html',
            scope: {
                argument: '=?'
            },
            link : function (scope, element, attrs, manipulationSorter) {
                scope.msg = scope.$parent.msg;
                scope.type = attrs.type;
                if(attrs.active) scope.active = true;

                if(attrs.active) {
                    var attributeFieldTemplate = false;
                    if (['join', 'split', 'substring', 'parsedate'].indexOf(scope.type) >= 0) {
                        attributeFieldTemplate = '<input type="text" ng-model="argument" />';
                        if(!scope.argument) scope.argument = "";
                        element.append($compile(attributeFieldTemplate)(scope));
                    }

                    scope.$watch('argument', function(newValue) {
                        element.data('argument', newValue);
                    });

                    element.on("click", ".remove", function(){
                        manipulationSorter.removeManipulation(scope.type);
                    });
                } else {
                    scope.$watch(function () {
                        return manipulationSorter.isActive(scope.type);
                    }, function (active) {
                        if(active){
                            element.hide();
                        } else {
                            element.show();
                        }
                    });

                    element.on('click', function () {
                        manipulationSorter.addManipulation(scope.type);
                    });
                }
            }
        };
    });

    directives.directive('joinUpdate', function () {
        return {
            restrict : 'A',
            require: '?ngModel',
            link : function (scope, el, attrs) {
                el.on("focusout focusin keyup", function (event) {
                    event.stopPropagation();
                    var manipulateElement = $("[ismanipulate=true]"),
                        manipulation = "join(" + $("#joinSeparator").val() + ")",
                        elementManipulation = manipulateElement.attr("manipulate"),
                        regex = new RegExp("join\\(.*?\\)", "g");

                    elementManipulation = elementManipulation.replace(regex, manipulation);
                    manipulateElement.attr("manipulate", elementManipulation);
                    manipulateElement.trigger('manipulateChanged');
                });
            }
        };
    });

    directives.directive('splitUpdate', function () {
        return {
            restrict : 'A',
            require: '?ngModel',
            link : function (scope, el, attrs) {
                el.on("focusout focusin keyup", function (event) {
                    event.stopPropagation();
                    var manipulateElement = $("[ismanipulate=true]"),
                        manipulation = "split(" + $("#splitSeparator").val() + ")",
                        elementManipulation = manipulateElement.attr("manipulate"),
                        regex = new RegExp("split\\(.*?\\)", "g");

                    elementManipulation = elementManipulation.replace(regex, manipulation);
                    manipulateElement.attr("manipulate", elementManipulation);
                    manipulateElement.trigger('manipulateChanged');
                });
            }
        };
    });

    directives.directive('substringUpdate', function () {
        return {
            restrict : 'A',
            require: '?ngModel',
            link : function (scope, el, attrs) {
                el.on("focusout focusin keyup", function (event) {
                    event.stopPropagation();
                    var manipulateElement = $("[ismanipulate=true]"),
                        manipulation = "substring(" + $("#substringSeparator").val() + ")",
                        elementManipulation = manipulateElement.attr("manipulate"),
                        regex = new RegExp("substring\\(.*?\\)", "g");

                    elementManipulation = elementManipulation.replace(regex, manipulation);
                    manipulateElement.attr("manipulate", elementManipulation);
                    manipulateElement.trigger('manipulateChanged');
                });
            }
        };
    });

    directives.directive('dateUpdate', function () {
        return {
            restrict : 'A',
            require: '?ngModel',
            link : function (scope, el, attrs) {
                el.on("focusout focusin keyup", function (event) {
                    event.stopPropagation();
                    var manipulateElement = $("[ismanipulate=true]"),
                        manipulation = "dateTime(" + $("#dateFormat").val() + ")",
                        elementManipulation = manipulateElement.attr("manipulate"),
                        regex = new RegExp("dateTime\\(.*?\\)", "g");

                    elementManipulation = elementManipulation.replace(regex, manipulation);
                    manipulateElement.attr("manipulate", elementManipulation);
                    manipulateElement.trigger('manipulateChanged');
                });
            }
        };
    });

    directives.directive('dateManipulationUpdate', function() {
        return {
            restrict : 'A',
            require: '?ngModel',
            link : function (scope, el, attrs) {
                el.on("focusout focusin keyup", function (event) {
                    event.stopPropagation();
                    var
                        manipKind = attrs.manipulationKind,
                        manipulateElement = $("[ismanipulate=true]"),
                        manipulation = manipKind + "(" + $("#" + manipKind).val() + ")",
                        elementManipulation = manipulateElement.attr("manipulate"),
                        regex = new RegExp(manipKind + "\\(.*?\\)", "g");

                    elementManipulation = elementManipulation.replace(regex, manipulation);
                    manipulateElement.attr("manipulate", elementManipulation);
                    manipulateElement.trigger('manipulateChanged');
                });
            }
        };
    });

    directives.directive('parsedateUpdate', function () {
        return {
            restrict : 'A',
            require: '?ngModel',
            link : function (scope, el, attrs) {
                el.on("focusout focusin keyup", function (event) {
                    event.stopPropagation();
                    var manipulateElement = $("[ismanipulate=true]"),
                        manipulation = "parseDate(" + $("#parseDate").val() + ")",
                        elementManipulation = manipulateElement.attr("manipulate"),
                        regex = new RegExp("parseDate\\(.*?\\)", "g");

                    elementManipulation = elementManipulation.replace(regex, manipulation);
                    manipulateElement.attr("manipulate", elementManipulation);
                    manipulateElement.trigger('manipulateChanged');
                });
            }
        };
    });

    directives.directive('selectEvent', function() {
        return function(scope, element, attrs) {
            var elm = angular.element(element);
            elm.click(function (event) {
                var li = elm.parent('li'),
                    content = $(element).find('.content-task'),
                    visible = content.is(":visible"),
                    other = $('[select-event=' + attrs.selectEvent + ']').not('#' + $(this).attr('id')),
                    contentOffsetTop = $('#inner-center').offset().top,
                    setContentCss;

                    other.parent('li').not('.selectedTrigger').removeClass('active');
                    other.find('.content-task').hide();

                    if (visible) {
                        if (!li.hasClass('selectedTrigger')) {
                            li.removeClass('active');
                        }

                        content.hide();
                    } else {
                        li.addClass('active');
                        content.show();
                        content.removeClass('left right bottom top');
                        content.parent().find('div.arrow').css({'top':'50%'});
                        setContentCss = function () {
                            if ($(content).children('.popover-content').height() > 200) {
                                content.css({'height': '290'});
                                content.children('.popover-content').css({'height': 200, 'overflow-y': 'auto'});
                                content.parent().find('div.arrow').css({'top': function () {return ($(content).height()/2);}});
                                content.css({'top': function () {return -($(content).height()/2  - 60);}});
                            } else {
                                content.css({'top': function () {return -($(content).height()/2 - 60);}});
                            }
                        };
                        if (($(window).width() - $(this).offset().left) < 138 + $(content).width() && $(this).offset().left > $(content).width() && $(this).parent().parent().offset().left + ($(content).width()/2) < $(this).offset().left) {
                            content.addClass('left');
                            content.css({'left': function () {return -($(content).width() + 3);}});
                            setContentCss();
                        } else if (($(window).width() - ($(this).offset().left + 138)) > $(content).width() && !($(this).parent().parent().offset().left + ($(content).width()/2) < $(this).offset().left && $(this).offset().top - contentOffsetTop - 71 > 200 && $(content).children('.popover-content').height() + 11 < 200))  {
                            content.addClass('right');
                            content.css({'left': '125px'});
                            setContentCss();
                        } else if ($(this).offset().top - contentOffsetTop - 71 > 200 && $(content).children('.popover-content').height() + 11 < 200 && ($(window).width() - ($(this).offset().left + 108)) > $(content).width()) {
                            content.addClass('top');
                            content.children('.popover-content').css({'height': function () {return (content.children('.popover-content').children('ul').height()+15);}, 'overflow-y': 'auto'});
                            content.css({'height': function () {return (content.children('.popover-content').children('ul').height() + content.children('.popover-title').height() + 33);}});
                            content.css({'top': function () {return -($(content).height() + 8);}});
                            content.css({'left': function () {return -($(content).width()/2 - 70);}});
                            content.parent().find('div.arrow').css({'top': function() {return ($(content).height() + 2);}});
                        } else {
                            content.addClass('bottom');
                            content.css({'top': '115px', 'height': '240'});
                            if ($(content).children('.popover-content').children('ul').height() < 200) {
                                content.css({'height': function () {return (content.children('.popover-content').children('ul').height() + content.children('.popover-title').height() + 30);}});
                            } else {
                                content.children('.popover-content').css({'height': 200, 'overflow-y': 'auto'});
                            }
                            if (($(window).width() - ($(this).offset().left + 108)) < $(content).width()) {
                                content.css({'left': function () {return -($(content).width()/2 - 40);}});
                            } else {
                                content.css({'left': function () {return -($(content).width()/2 - 80);}});
                            }
                            content.parent().find('div.arrow').css({'top':'-11px'});
                        }
                    }
            });
        };
    });

    directives.directive('helpPopover', function($compile, $http) {
        return function(scope, element, attrs) {
            var msgScope = scope;

            while (msgScope.msg === undefined) {
                msgScope = msgScope.$parent;
            }

            $http.get('../tasks/partials/help/' + attrs.helpPopover + '.html').success(function (html) {
                $(element).popover({
                    placement: 'top',
                    trigger: 'hover',
                    html: true,
                    content: function() {
                        var elem = angular.element(html);

                        $compile(elem)(msgScope);
                        msgScope.$apply(elem);

                        return $compile(elem)(msgScope);
                    }
                });
            });
        };
    });

    directives.directive('divPlaceholder', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var parent = scope, curText;

                while (parent.msg === undefined) {
                    parent = parent.$parent;
                }

                curText = parent.msg(attrs.divPlaceholder);

                if (!element.text().trim().length) {
                    element.html('<em style="color: gray;">' + curText + '</em>');
                }

                element.focusin(function() {
                    if ($(this).text().toLowerCase() === curText.toLowerCase() || !$(this).text().length) {
                        $(this).empty();
                    }
                });

                element.focusout(function() {
                    if ($(this).text().toLowerCase() === curText.toLowerCase() || !$(this).text().length) {
                        $(this).html('<em style="color: gray;">' + curText + '</em>');
                    }
                });
            }
        };
    });

    directives.directive('actionSortableCursor', function () {
       return {
           restrict: 'A',
           link: function (scope, element, attrs) {
                angular.element(element).on({
                    mousedown: function () {
                        $(this).css('cursor', 'move');
                    },
                    mouseup: function () {
                        $(this).css('cursor', 'auto');
                    }
                });
           }
       };
    });

    directives.directive('actionsPopover', function () {
       return {
           restrict: 'A',
           link: function (scope, element, attrs) {
                angular.element(element).popover({
                    placement: 'right',
                    trigger: 'hover',
                    html: true,
                    content: function () {
                        var html = angular.element('<div style="text-align: left" />'),
                            actions = (scope.item && scope.item.task && scope.item.task.actions) || scope.actions || [];

                        angular.forEach(actions, function (action) {
                            var div = angular.element('<div />'),
                                img = angular.element('<img />'),
                                name = angular.element('<span style="margin-left: 5px" />');

                            img.attr('src', '../tasks/api/channel/icon?moduleName=' + action.moduleName);
                            img.addClass('task-list-img');

                            name.text(scope.msg(action.channelName) + ": " + scope.msg(action.displayName));

                            div.append(img);
                            div.append(name);

                            html.append(div);
                        });

                        return html;
                    }
                });
           }
       };
    });

    directives.directive('triggerPopover', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                angular.element(element).popover({
                    placement: 'right',
                    trigger: 'hover',
                    html: true,
                    content: function () {
                        var html = angular.element('<div style="text-align: left" />'),
                            div = angular.element('<div />'),
                            img = angular.element('<img />'),
                            name = angular.element('<span style="margin-left: 5px" />');

                        img.attr('src', '../tasks/api/channel/icon?moduleName=' + scope.item.task.trigger.moduleName);
                        img.addClass('task-list-img');
                        name.text(scope.msg(scope.item.task.trigger.channelName) + ": " + scope.msg(scope.item.task.trigger.displayName));
                        div.append(img);
                        div.append(name);
                        html.append(div);

                        return html;
                    }
                });
            }
        };
    });

    directives.directive('taskStopPropagation', function () {
        return function(scope, elem, attrs) {
            elem.on('click', function (e) {
               e.stopPropagation();
            });
        };
    });

    directives.directive('periodAmountTasks', function() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, element, attrs, ctrl) {
                var elem = angular.element(element),
                periodSliders = elem.parent().find("#period-slider > div"),
                periodSlider = elem.parent().find("#period-slider"),
                parent = elem.parent(),
                openPeriodModal,
                closePeriodModal,
                year = '0',
                month = '0',
                week = '0',
                day = '0',
                hour = '0',
                minute = '0',
                second = '0',
                sliderMax = {
                    year: 10,
                    month: 24,
                    week: 55,
                    day: 365,
                    hour: 125,
                    minute: 360,
                    second: 360
                },
                compileValueInputs = function (year, month, week, day, hour, minute, second) {
                    var valueInputs = [
                        year.toString( 10 ),
                        month.toString( 10 ),
                        week.toString( 10 ),
                        day.toString( 10 ),
                        hour.toString( 10 ),
                        minute.toString( 10 ),
                        second.toString( 10 )
                    ],
                    valueInputsName = ['Y', 'M', 'W', 'D', 'H', 'M', 'S'];

                    $.each( valueInputs, function( nr, val ) {
                        if (nr < 4 && val !== '0') {
                            valueInputs[ nr ] = val + valueInputsName[ nr ];
                        }
                        if ( (valueInputsName[ nr ] === 'H' || valueInputsName[ nr ] === 'M' || valueInputsName[ nr ] === 'S' ) &&  val !== '0' && nr > 3 ) {
                            valueInputs[ nr ] = val + valueInputsName[ nr ];
                            if (valueInputs[ 4 ].indexOf('T') === -1 && valueInputs[ 5 ].indexOf('T') === -1 && valueInputs[ 6 ].indexOf('T') === -1) {
                                valueInputs[ nr ] = 'T' + val + valueInputsName[ nr ];
                            }
                        }
                        if ( val === '0' ) {
                            valueInputs[ nr ] = '';
                        }
                    });
                    return 'P' + valueInputs.join( "" ).toUpperCase();
                },
                refreshPeriod = function () {
                    var year = periodSlider.children( "#period-year" ).slider( "value" ),
                    month = periodSlider.children( "#period-month" ).slider( "value" ),
                    week = periodSlider.children( "#period-week" ).slider( "value" ),
                    day = periodSlider.children( "#period-day" ).slider( "value" ),
                    hour = periodSlider.children( "#period-hour" ).slider( "value" ),
                    minute = periodSlider.children( "#period-minute" ).slider( "value" ),
                    second = periodSlider.children( "#period-second" ).slider( "value" ),

                    valueFromInputs = compileValueInputs(year, month, week, day, hour, minute, second);

                    periodSlider.children( "#amount-period-year" ).val( year );
                    periodSlider.children( "#amount-period-month" ).val( month );
                    periodSlider.children( "#amount-period-week" ).val( week );
                    periodSlider.children( "#amount-period-day" ).val( day );
                    periodSlider.children( "#amount-period-hour" ).val( hour );
                    periodSlider.children( "#amount-period-minute" ).val( minute );
                    periodSlider.children( "#amount-period-second" ).val( second );
                    elem.val( valueFromInputs );

                    scope.$apply(function() {
                       ctrl.$setViewValue(valueFromInputs);
                    });
                },
                setParsingPeriod = function () {
                    var valueElement = elem.val(), valueDate, valueTime,
                    checkValue = function (param) {
                        if(isNaN(param) || param === null || param === '' || param === undefined) {
                            param = '0';
                            return param;
                        } else {
                            return param;
                        }
                    },
                    parseDate = function (valueDate) {
                        if (valueDate.indexOf('Y') !== -1) {
                            year = checkValue(valueDate.slice(0, valueDate.indexOf('Y')).toString( 10 ));
                            valueDate = valueDate.substring(valueDate.indexOf('Y') + 1, valueDate.length);
                        } else {
                            year = '0';
                        }
                        if (valueDate.indexOf('M') !== -1) {
                            month = checkValue(valueDate.slice(0, valueDate.indexOf('M')).toString( 10 ));
                            valueDate = valueDate.substring(valueDate.indexOf('M') + 1, valueDate.length);
                        } else {
                            month = '0';
                        }
                        if (valueDate.indexOf('W') !== -1) {
                            week = checkValue(valueDate.slice(0, valueDate.indexOf('W')).toString( 10 ));
                            valueDate = valueDate.substring(valueDate.indexOf('W') + 1, valueDate.length);
                        } else {
                            week = '0';
                        }
                        if (valueDate.indexOf('D') !== -1) {
                            day = checkValue(valueDate.slice(0, valueDate.indexOf('D')).toString( 10 ));
                        } else {
                            day = '0';
                        }
                    },
                    parseTime = function (valueTime) {
                        if (valueTime.indexOf('H') !== -1) {
                            hour = checkValue(valueTime.slice(0, valueTime.indexOf('H')));
                            valueTime = valueTime.substring(valueTime.indexOf('H') + 1, valueTime.length);
                        } else {
                            hour = '0';
                        }
                        if (valueTime.indexOf('M') !== -1) {
                            minute = checkValue(valueTime.slice(0, valueTime.indexOf('M')));
                            valueTime = valueTime.substring(valueTime.indexOf('M') + 1, valueTime.length);
                        } else {
                            minute = '0';
                        }
                        if (valueTime.indexOf('S') !== -1) {
                            second = checkValue(valueTime.slice(0, valueTime.indexOf('S')));
                            valueTime = valueTime.substring(valueTime.indexOf('S') + 1, valueTime.length);
                        } else {
                            second = '0';
                        }
                    };

                    if (valueElement.indexOf('T') > 0) {
                        valueTime = valueElement.slice(valueElement.indexOf('T') + 1, valueElement.length);
                        parseTime(valueTime);
                        valueDate = valueElement.slice(1, valueElement.indexOf('T'));
                        parseDate(valueDate);
                    } else {
                        valueDate = valueElement.slice(1, valueElement.length);
                        parseDate(valueDate);
                        hour = '0'; minute = '0'; second = '0';
                    }

                    periodSlider.children( "#amount-period-year" ).val( year );
                    periodSlider.children( "#amount-period-month" ).val( month );
                    periodSlider.children( "#amount-period-week" ).val( week );
                    periodSlider.children( "#amount-period-day" ).val( day );
                    periodSlider.children( "#amount-period-hour" ).val( hour );
                    periodSlider.children( "#amount-period-minute" ).val( minute );
                    periodSlider.children( "#amount-period-second" ).val( second );

                    periodSlider.children( "#period-year" ).slider( "value", year);
                    periodSlider.children( "#period-month" ).slider( "value", month);
                    periodSlider.children( "#period-week" ).slider( "value", week);
                    periodSlider.children( "#period-day" ).slider( "value", day);
                    periodSlider.children( "#period-hour" ).slider( "value", hour);
                    periodSlider.children( "#period-minute" ).slider( "value", minute);
                    periodSlider.children( "#period-second" ).slider( "value", second );
                };

                periodSliders.each(function(index) {
                    var getValueSettings, valueName = (this.id);
                    valueName = valueName.substring(valueName.lastIndexOf('-') + 1);
                    getValueSettings = function (param1, param2) {
                        var result, resultVal = '';
                        $.each( param1, function( key, value) {
                            if (key === param2){
                                result = true;
                                resultVal = value;
                            } else {
                                result = false;
                            }
                        return (!result);
                        });
                    return resultVal;
                    };

                    $( this ).empty().slider({
                        value: getValueSettings([year, month, week, day, hour, minute, second], valueName),
                        range: "min",
                        min: 0,
                        max: getValueSettings(sliderMax, valueName),
                        animate: true,
                        orientation: "horizontal",
                        slide: refreshPeriod,
                        change: refreshPeriod
                    });
                    periodSlider.children( "#amount-period-" + valueName ).val( $( this ).slider( "value" ) );
                });

                elem.siblings('button').on('click', function() {
                    setParsingPeriod();
                    parent.children("#periodModal").modal('show');
                });
            }
        };
    });
}());
