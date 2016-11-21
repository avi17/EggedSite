mslApp.directive('gridView', function () {
    return {
        //scope: {
        //    datasource: '@'
        //},
        replace: true,
        templateUrl: '/app/views/directive/gridView.htm',
        link: function (scope, element, attrs) {

            scope.dataSource = [];

            scope.$watch(attrs.source, function (newValue, oldValue) {
                if (newValue == null) return;
                scope.dataSource = newValue;
            });

        }
    }
});