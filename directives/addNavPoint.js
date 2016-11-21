mslApp.directive('addNavPoint', function () {
    return {
        templateUrl: '/app/views/directive/addNavPoint.htm',
        link: function (scope, element, attrs, ctrl) {

            scope.isShowExtraAddressLine = false;

            scope.addNewNavPoint = function () {
                scope.isShowExtraAddressLine = true;
            }

        }
    }
});

