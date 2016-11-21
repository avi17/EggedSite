
mslApp.directive('ngKeyPress', function ($compile, $location, $rootScope, localize) {
    return function (scope, element, attrs) {
        element.bind("keyup", function (event) {
            scope.$apply(function () {
                if (event.key != "Shift" && event.key != "Control" && event.key != "Alt") {
                    $rootScope.search.keyPressedElement = element;
                    scope.$eval(attrs.ngKeyPress + "('" +
                        element[0].tagName + "," +
                        event.which + "," +
		                event.altKey + "," +
		                event.ctrlKey + "," +
                        event.shiftKey + "," +
                        attrs.ngGridIndex + "')");
                }
            });

            if (
                attrs.ngKeyPress != "bodyKeyPress"
                && attrs.ngKeyPress != "mainMenuItemKeyPress"
                && attrs.ngKeyPress != "headerMinimizeKeyPress"
                //&& attrs.ngKeyPress != "searchTabKeyPress"
                //&& attrs.ngKeyPress != "pathPlanGroupKeyPress"
                && attrs.ngKeyPress != "pathPlanKeyPress"
                && attrs.ngKeyPress != "dateSelectKeyPress"
                && attrs.ngKeyPress != "poiBydestFromStreetNumberPress"
                && attrs.ngKeyPress != "poiBydestToStreetNumberPress"
                && attrs.ngKeyPress != "poiBylineFromStreetNumberPress"
                && attrs.ngKeyPress != "poiBylineToStreetNumberPress"
                //&& attrs.ngKeyPress != "scheduleKeyPress"
                )
                event.preventDefault();

            if (attrs.ngKeyPress == "dateSelectKeyPress" && event.which == 9 && event.shiftKey == true)
                event.preventDefault();

        });
    };
});
