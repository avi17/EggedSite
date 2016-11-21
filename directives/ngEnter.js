
mslApp.directive('ngEnter', function ($compile, $location, localize) {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter + "('" + event.target.value + "')");
                });

                event.preventDefault();
            }
        });
    };
});
