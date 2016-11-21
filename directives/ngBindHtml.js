
mslApp.directive('ngBindHtml', function ($compile, $location, localize) {
    return function (scope, element, attrs) {
        element.addClass('ng-binding').data('$binding', attrs.ngBindHtml);
        scope.$watch(attrs.ngBindHtml, function (newValue, oldValue) {
            element.html(newValue);
        });
    };
});