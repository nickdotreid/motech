(function () {
    'use strict';

    /* Services */

    angular.module('tasks.utils', []).factory('TasksConstants', function () {
        return {
            TRIGGER_PREFIX: 'trigger',
            DATA_SOURCE_PREFIX: 'ad',
            FILTER_SET_STEP: 'FilterSet',
            DATA_SOURCE_STEP: 'DataSource',
            FILTER_OPERATOR_AND: 'AND',
            FILTER_OPERATOR_OR: 'OR',
            FILTER_OPERATORS: {
                'task.string': {
                    'type': 'UNICODE',
                    'options': [
                        'task.exist',
                        'task.equals',
                        'task.contains',
                        'task.startsWith',
                        'task.endsWith',
                        'task.equalsIgnoreCase'
                    ]
                },
                'task.number': {
                    'type': 'DOUBLE',
                    'options': [
                        'task.exist',
                        'task.number.equals',
                        'task.gt',
                        'task.lt'
                    ]
                },
                'task.date': {
                    'type': 'DATE',
                    'options': [
                        'task.exist',
                        'task.equals',
                        'task.after',
                        'task.afterNow',
                        'task.before',
                        'task.beforeNow',
                        'task.lessDaysFromNow',
                        'task.moreDaysFromNow'
                    ]
                }
            },
            MANIPULATION_SETTINGS: [{
                name: 'join',
                input: 'input[join-update]',
                pattern: 5
            }, {
                name: 'split',
                input: 'input[split-update]',
                pattern: 6
            }, {
                name: 'substring',
                input: 'input[substring-update]',
                pattern: 10
            }, {
                name: 'dateTime',
                input: 'input[date-update]',
                pattern: 9
            }, {
                name: 'plusDays',
                input: 'input[manipulation-kind="plusDays"]',
                pattern: 9
            }, {
                name: 'minusDays',
                input: 'input[manipulation-kind="minusDays"]',
                pattern: 10
            }, {
                name: 'plusHours',
                input: 'input[manipulation-kind="plusHours"]',
                pattern: 10
            }, {
                name: 'minusHours',
                input: 'input[manipulation-kind="minusHours"]',
                pattern: 11
            }, {
                name: 'plusMinutes',
                input: 'input[manipulation-kind="plusMinutes"]',
                pattern: 12
            }, {
                name: 'minusMinutes',
                input: 'input[manipulation-kind="minusMinutes"]',
                pattern: 13
            }, {
                name: 'format',
                input: ''
            }, {
                name: 'capitalize',
                input: ''
            }, {
                name: 'toUpper',
                input: ''
            }, {
                name: 'toLower',
                input: ''
            }, {
                name: 'URLEncode',
                input: ''
            }, {
                name: 'parseDate',
                input: 'input[parsedate-update]',
                pattern: 10
            } ],
            needsExpression: function (param) {
                return param && $.inArray(param, ['task.exist', 'task.afterNow', 'task.beforeNow']) === -1;
            },
            isText: function (value) {
                return value && $.inArray(value, ['UNICODE', 'TEXTAREA']) !== -1;
            },
            isNumber: function (value) {
                return value && $.inArray(value, ['INTEGER', 'LONG', 'DOUBLE']) !== -1;
            },
            isDate: function (value) {
                return value && $.inArray(value, ['DATE']) !== -1;
            },
            isDate2Date: function (value) {
                return value && $.inArray(value, ['DATE2DATE']) !== -1;
            },
            isBoolean: function (value) {
                return value && $.inArray(value, ['BOOLEAN']) !== -1;
            }
        };
    }).factory('TaskFieldHelper', ['TasksConstants', function (TasksConstants) {
        var helpers = {};
        helpers.formatField = function (field) {
            if(!field) return "";
            var str = "";

            switch(field.prefix){
                case utils.TRIGGER_PREFIX:
                    str = "{0}.{1}".format(TasksConstants.TRIGGER_PREFIX, field.eventKey);
                    break;
                case utils.DATA_SOURCE_PREFIX:
                    str = "{0}.{1}.{2}#{3}.{4}".format(TasksConstants.DATA_SOURCE_PREFIX, field.providerId, field.type, field.objectId, field.fieldKey);
                    break;
                default:
                    str = field.displayName;
            }

            if (field.manipulations && Array.isArray(field.manipulations)) {
                field.manipulations.forEach(function(manipulation) {
                    str += "?{0}({1})".format(manipulation.type, manipulation.argument);
                });
            }

            return "{{" + str + "}}";
        }
        helpers.parseField = function (str, existingFields) {
            if(!str) return false;
            if(!existingFields || !Array.isArray(existingFields)) existingFields=[];
            // Remove formatting (if present)
            if(str.substring(0,2)=='{{') str = str.substring(2,str.length);
            if(str.substr(-2,2)=='}}') str = str.substr(0,str.length-2);

            var manipulations = str.split('?');
            str = manipulations.shift();

            var field = {};
            field.displayName = str;

            existingFields.forEach(function (exField) {
                if("{{" + str + "}}" == helpers.formatField(exField)){
                    field = Object.assign({}, exField);
                }
            });

            field.manipulations = [];
            manipulations.forEach(function (manipulationStr) {
                var manipulation = {};
                var parts = manipulationStr.split('(');
                manipulation.type = parts.shift();
                if(parts.length>0) {
                    manipulation.argument = parts[0].replace(')','');
                }
                field.manipulations.push(manipulation);
            });
            return field;
        };
        return helpers;
    }]);

}());
