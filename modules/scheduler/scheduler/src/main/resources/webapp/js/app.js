(function () {
    'use strict';

    /* App Module */

    var scheduler = angular.module('scheduler', [ 'motech-dashboard', 'scheduler.services',
        'scheduler.controllers', 'scheduler.directives', 'ngCookies'
    ]);

    scheduler.config( function ($routeProvider) {

        $routeProvider.when('/scheduler', {
                templateUrl: '../scheduler/partials/scheduler.html',
                controller: 'SchedulerCtrl'
            }
        );

    });

}());
