
mslApp.directive('ngSelected', function ($compile, $location, localize) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs, ctrl) {
            $(element).bind("mouseup", function (e) {
                scope.$eval(attrs.ngSelected + "='" + attrs.ngSelectedValue + "'");
                scope.$apply();

                $(element).find(".txtGoogleSearch").each(function () {
                    $(this).focus();
                });

                $(element).find(".ui-autocomplete-input").each(function () {
                    $(this).focus();
                });


            });



        }
    };
});
