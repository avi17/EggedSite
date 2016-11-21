mslApp.directive('activeDates', function ($rootScope) {
    return {
        scope: {"activeDayList": "="},
        templateUrl: '/app/views/directive/activeDates.htm',
        link: function (scope, element, attrs, ctrl) {


        }
    }
});
